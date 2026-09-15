ALTER TABLE "soulmate_profiles" DROP CONSTRAINT "profile_language_valid";
ALTER TABLE "soulmate_profiles" ADD CONSTRAINT "profile_language_valid"
  CHECK ("language" IN ('en','de','fr','es','it','pt','pt-BR','pl','ru'));

ALTER TABLE "soulmate_profiles" DROP CONSTRAINT "profile_timezone_valid";
ALTER TABLE "soulmate_profiles" ADD CONSTRAINT "profile_timezone_valid"
  CHECK ("timezone" IN ('Europe/Berlin','Europe/London','Europe/Paris','Europe/Madrid','Europe/Rome','Europe/Lisbon','Europe/Warsaw','Europe/Moscow','America/New_York','America/Los_Angeles','America/Sao_Paulo','America/Manaus','America/Rio_Branco','America/Noronha','UTC'));