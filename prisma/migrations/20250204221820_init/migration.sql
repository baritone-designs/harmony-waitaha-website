-- CreateEnum
CREATE TYPE "ChorusId" AS ENUM ('Plainsmen', 'Qa');

-- CreateEnum
CREATE TYPE "PageId" AS ENUM ('Home', 'Plainsmen', 'Qa');

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "WhitelistedEmail" (
    "email" TEXT NOT NULL,
    "whitelistedById" TEXT NOT NULL,

    CONSTRAINT "WhitelistedEmail_pkey" PRIMARY KEY ("email")
);

-- CreateTable
CREATE TABLE "Chorus" (
    "id" "ChorusId" NOT NULL,
    "pageId" "PageId" NOT NULL,
    "imageUrl" TEXT,
    "socials" JSONB NOT NULL,

    CONSTRAINT "Chorus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PersonChorus" (
    "chorusId" "ChorusId" NOT NULL,
    "personId" TEXT NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "PersonChorus_pkey" PRIMARY KEY ("chorusId","personId")
);

-- CreateTable
CREATE TABLE "Person" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "biography" TEXT NOT NULL,
    "iconUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "venueId" TEXT NOT NULL,
    "venueName" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quartet" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "biography" TEXT NOT NULL,
    "members" JSONB NOT NULL,
    "imageUrl" TEXT,
    "backgroundImageUrl" TEXT,
    "logoUrl" TEXT,
    "socials" JSONB NOT NULL,
    "websiteUrl" TEXT,

    CONSTRAINT "Quartet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Page" (
    "id" "PageId" NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "iconUrl" TEXT,
    "logoUrl" TEXT,
    "aboutParagraph" TEXT,
    "recruitmentParagraph" TEXT,
    "headerMediaUrl" TEXT,
    "carouselMediaUrls" TEXT[],

    CONSTRAINT "Page_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ChorusToEvent" (
    "A" "ChorusId" NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ChorusToEvent_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "Chorus_pageId_key" ON "Chorus"("pageId");

-- CreateIndex
CREATE UNIQUE INDEX "Quartet_name_key" ON "Quartet"("name");

-- CreateIndex
CREATE INDEX "_ChorusToEvent_B_index" ON "_ChorusToEvent"("B");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WhitelistedEmail" ADD CONSTRAINT "WhitelistedEmail_whitelistedById_fkey" FOREIGN KEY ("whitelistedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chorus" ADD CONSTRAINT "Chorus_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonChorus" ADD CONSTRAINT "PersonChorus_chorusId_fkey" FOREIGN KEY ("chorusId") REFERENCES "Chorus"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonChorus" ADD CONSTRAINT "PersonChorus_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChorusToEvent" ADD CONSTRAINT "_ChorusToEvent_A_fkey" FOREIGN KEY ("A") REFERENCES "Chorus"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChorusToEvent" ADD CONSTRAINT "_ChorusToEvent_B_fkey" FOREIGN KEY ("B") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
