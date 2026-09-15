CREATE TABLE "auth_users" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL UNIQUE,
  "emailVerified" BOOLEAN NOT NULL DEFAULT false,
  "image" TEXT,
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(3) NOT NULL,
  "bnetSubject" TEXT NOT NULL UNIQUE,
  "bnetBattleTag" TEXT,
  "bnetEmail" TEXT,
  "bnetEmailVerified" BOOLEAN,
  "bnetLastLoginAt" TEXT
);
CREATE TABLE "auth_sessions" (
  "id" TEXT PRIMARY KEY,
  "token" TEXT NOT NULL UNIQUE,
  "userId" TEXT NOT NULL REFERENCES "auth_users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "expiresAt" TIMESTAMPTZ(3) NOT NULL,
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(3) NOT NULL,
  "ipAddress" TEXT,
  "userAgent" TEXT
);
CREATE INDEX "auth_sessions_userId_idx" ON "auth_sessions"("userId");
CREATE INDEX "auth_sessions_expiresAt_idx" ON "auth_sessions"("expiresAt");
CREATE TABLE "auth_accounts" (
  "id" TEXT PRIMARY KEY,
  "accountId" TEXT NOT NULL,
  "providerId" TEXT NOT NULL,
  "userId" TEXT NOT NULL REFERENCES "auth_users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "accessToken" TEXT,
  "refreshToken" TEXT,
  "idToken" TEXT,
  "accessTokenExpiresAt" TIMESTAMPTZ(3),
  "refreshTokenExpiresAt" TIMESTAMPTZ(3),
  "scope" TEXT,
  "password" TEXT,
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(3) NOT NULL,
  CONSTRAINT "auth_accounts_providerId_accountId_key" UNIQUE ("providerId", "accountId"),
  CONSTRAINT "auth_accounts_no_credentials" CHECK ("accessToken" IS NULL AND "refreshToken" IS NULL AND "idToken" IS NULL AND "password" IS NULL)
);
CREATE INDEX "auth_accounts_userId_idx" ON "auth_accounts"("userId");
CREATE TABLE "auth_verifications" (
  "id" TEXT PRIMARY KEY,
  "identifier" TEXT NOT NULL,
  "value" TEXT NOT NULL,
  "expiresAt" TIMESTAMPTZ(3) NOT NULL,
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(3) NOT NULL
);
CREATE INDEX "auth_verifications_identifier_idx" ON "auth_verifications"("identifier");
CREATE INDEX "auth_verifications_expiresAt_idx" ON "auth_verifications"("expiresAt");
CREATE TABLE "auth_rate_limits" (
  "id" TEXT PRIMARY KEY,
  "key" TEXT NOT NULL UNIQUE,
  "count" INTEGER NOT NULL,
  "lastRequest" BIGINT NOT NULL
);
CREATE TABLE "soulmate_request_rate_limits" (
  "key" VARCHAR(64) PRIMARY KEY,
  "count" INTEGER NOT NULL CHECK ("count" > 0),
  "expiresAt" TIMESTAMPTZ(3) NOT NULL
);
CREATE INDEX "soulmate_request_rate_limits_expiresAt_idx" ON "soulmate_request_rate_limits"("expiresAt");