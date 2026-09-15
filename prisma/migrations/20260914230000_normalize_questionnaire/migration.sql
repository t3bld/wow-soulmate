BEGIN;

CREATE FUNCTION soulmate_valid_selection(selected_values anyarray, allowed_values anyarray, minimum_count integer DEFAULT 0)
RETURNS boolean LANGUAGE sql IMMUTABLE AS $$
  SELECT selected_values IS NOT NULL
    AND COALESCE(array_ndims(selected_values), 1) = 1
    AND cardinality(selected_values) BETWEEN minimum_count AND cardinality(allowed_values)
    AND selected_values <@ allowed_values
    AND cardinality(selected_values) = (SELECT count(DISTINCT element) FROM unnest(selected_values) AS item(element));
$$;

ALTER TABLE "soulmate_profiles"
  ADD COLUMN "classes" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "factions" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "preferred_classes" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "class_priority" TEXT NOT NULL DEFAULT 'wish',
  ADD COLUMN "role_preference" TEXT NOT NULL DEFAULT 'any',
  ADD COLUMN "role_priority" TEXT NOT NULL DEFAULT 'wish',
  ADD COLUMN "experience_preference" TEXT NOT NULL DEFAULT 'any',
  ADD COLUMN "experience_priority" TEXT NOT NULL DEFAULT 'wish';

UPDATE "soulmate_profiles" SET
  "roles" = CASE WHEN cardinality("roles") > 0 THEN "roles" ELSE ARRAY["role"] END,
  "classes" = ARRAY(SELECT DISTINCT value FROM jsonb_array_elements_text(COALESCE(NULLIF("matchmaking"->'classes', 'null'::jsonb), '[]'::jsonb)) AS item(value) WHERE value IN ('warrior','paladin','hunter','rogue','priest','shaman','mage','warlock','druid')),
  "factions" = ARRAY(SELECT DISTINCT value FROM jsonb_array_elements_text(COALESCE(NULLIF("matchmaking"->'factions', 'null'::jsonb), '[]'::jsonb)) AS item(value)),
  "preferred_classes" = ARRAY(SELECT DISTINCT value FROM jsonb_array_elements_text(COALESCE(NULLIF("matchmaking"->'preferredClasses', 'null'::jsonb), '[]'::jsonb)) AS item(value) WHERE value IN ('warrior','paladin','hunter','rogue','priest','shaman','mage','warlock','druid')),
  "class_priority" = COALESCE("matchmaking"->>'classPriority', 'wish'),
  "role_preference" = COALESCE("matchmaking"->>'rolePreference', 'any'),
  "role_priority" = COALESCE("matchmaking"->>'rolePriority', 'wish'),
  "experience_preference" = COALESCE("matchmaking"->>'experiencePreference', 'any'),
  "experience_priority" = COALESCE("matchmaking"->>'experiencePriority', 'wish');

UPDATE "soulmate_profiles" SET "class_priority" = 'wish' WHERE cardinality("preferred_classes") = 0;

CREATE TABLE "soulmate_profile_playtimes" (
  "profile_id" UUID NOT NULL REFERENCES "soulmate_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "position" INTEGER NOT NULL,
  "days" INTEGER[] NOT NULL,
  "start_hour" INTEGER NOT NULL,
  "end_hour" INTEGER NOT NULL,
  PRIMARY KEY ("profile_id", "position"),
  CONSTRAINT "playtime_position_valid" CHECK ("position" BETWEEN 0 AND 13),
  CONSTRAINT "playtime_days_valid" CHECK (soulmate_valid_selection("days", ARRAY[1,2,3,4,5,6,7], 1)),
  CONSTRAINT "playtime_hours_valid" CHECK ("start_hour" BETWEEN 0 AND 23 AND "end_hour" BETWEEN 1 AND 24 AND "end_hour" > "start_hour")
);

INSERT INTO "soulmate_profile_playtimes" ("profile_id", "position", "days", "start_hour", "end_hour")
SELECT profile.id, (slot.ordinality - 1)::integer,
  ARRAY(SELECT DISTINCT value::integer FROM jsonb_array_elements_text(slot.value->'days') AS day(value)),
  (slot.value->>'startHour')::integer, (slot.value->>'endHour')::integer
FROM "soulmate_profiles" AS profile
CROSS JOIN LATERAL jsonb_array_elements(COALESCE(NULLIF(profile.playtimes, 'null'::jsonb), jsonb_build_array(jsonb_build_object('days', profile.days, 'startHour', profile.start_hour, 'endHour', profile.end_hour)))) WITH ORDINALITY AS slot(value, ordinality);

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM soulmate_profiles AS profile WHERE NOT EXISTS (SELECT 1 FROM soulmate_profile_playtimes AS slot WHERE slot.profile_id = profile.id)) THEN
    RAISE EXCEPTION 'Cannot migrate a profile without playtimes';
  END IF;
END;
$$;

ALTER TABLE "soulmate_profiles"
  DROP COLUMN "role",
  DROP COLUMN "days",
  DROP COLUMN "start_hour",
  DROP COLUMN "end_hour",
  DROP COLUMN "playtimes",
  DROP COLUMN "matchmaking",
  ALTER COLUMN "roles" DROP DEFAULT,
  ALTER COLUMN "activities" SET NOT NULL,
  ADD CONSTRAINT "profile_alias_valid" CHECK (char_length("alias") BETWEEN 2 AND 24 AND "alias" = btrim("alias")),
  ADD CONSTRAINT "profile_region_valid" CHECK ("region" IN ('EU','US')),
  ADD CONSTRAINT "profile_language_valid" CHECK ("language" IN ('en','de','fr','es','it','pt','ru')),
  ADD CONSTRAINT "profile_roles_valid" CHECK (soulmate_valid_selection("roles", ARRAY['tank','healer','damage','flexible'], 1)),
  ADD CONSTRAINT "profile_activities_valid" CHECK (soulmate_valid_selection("activities", ARRAY['dungeons','raids','pvp','exploration','questing','story','collecting','roleplay','relaxation','professions'], 1)),
  ADD CONSTRAINT "profile_classes_valid" CHECK (soulmate_valid_selection("classes", ARRAY['warrior','paladin','hunter','rogue','priest','shaman','mage','warlock','druid'])),
  ADD CONSTRAINT "profile_factions_valid" CHECK (soulmate_valid_selection("factions", ARRAY['horde','alliance'])),
  ADD CONSTRAINT "profile_preferred_classes_valid" CHECK (soulmate_valid_selection("preferred_classes", ARRAY['warrior','paladin','hunter','rogue','priest','shaman','mage','warlock','druid'])),
  ADD CONSTRAINT "profile_experience_valid" CHECK ("experience" IN ('new','returning','regular','veteran','original')),
  ADD CONSTRAINT "profile_age_valid" CHECK ("age_group" IN ('private','18-24','25-34','35-44','45+')),
  ADD CONSTRAINT "profile_timezone_valid" CHECK ("timezone" IN ('Europe/Berlin','Europe/London','Europe/Paris','Europe/Madrid','Europe/Rome','Europe/Lisbon','Europe/Moscow','America/New_York','America/Los_Angeles','UTC')),
  ADD CONSTRAINT "profile_adult_required" CHECK ("adult"),
  ADD CONSTRAINT "profile_class_priority_valid" CHECK ("class_priority" IN ('wish','must') AND ("class_priority" <> 'must' OR cardinality("preferred_classes") > 0)),
  ADD CONSTRAINT "profile_role_preference_valid" CHECK ("role_preference" IN ('any','similar','complementary') AND "role_priority" IN ('wish','must') AND ("role_priority" <> 'must' OR "role_preference" <> 'any')),
  ADD CONSTRAINT "profile_experience_preference_valid" CHECK ("experience_preference" IN ('any','similar','more','less') AND "experience_priority" IN ('wish','must') AND ("experience_priority" <> 'must' OR "experience_preference" <> 'any'));

CREATE FUNCTION soulmate_require_playtimes() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE
  profile_ids uuid[];
  target_id uuid;
BEGIN
  IF TG_TABLE_NAME = 'soulmate_profiles' THEN
    profile_ids := ARRAY[NEW.id];
  ELSIF TG_OP = 'DELETE' THEN
    profile_ids := ARRAY[OLD.profile_id];
  ELSIF TG_OP = 'UPDATE' THEN
    profile_ids := ARRAY[OLD.profile_id, NEW.profile_id];
  ELSE
    profile_ids := ARRAY[NEW.profile_id];
  END IF;
  FOREACH target_id IN ARRAY profile_ids LOOP
    PERFORM id FROM soulmate_profiles WHERE id = target_id FOR UPDATE;
    IF FOUND AND NOT EXISTS (SELECT 1 FROM soulmate_profile_playtimes WHERE profile_id = target_id) THEN
      RAISE EXCEPTION 'A profile requires at least one playtime' USING ERRCODE = '23514';
    END IF;
  END LOOP;
  RETURN NULL;
END;
$$;

CREATE CONSTRAINT TRIGGER profile_requires_playtimes
AFTER INSERT ON soulmate_profiles DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW EXECUTE FUNCTION soulmate_require_playtimes();

CREATE CONSTRAINT TRIGGER playtimes_preserve_profile_schedule
AFTER INSERT OR UPDATE OR DELETE ON soulmate_profile_playtimes DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW EXECUTE FUNCTION soulmate_require_playtimes();

COMMIT;