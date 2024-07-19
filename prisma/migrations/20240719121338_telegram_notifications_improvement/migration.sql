-- CreateTable
CREATE TABLE "TelegramBot" (
    "id" UUID NOT NULL,
    "token" VARCHAR(46) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6),

    CONSTRAINT "TelegramBot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TelegramUser" (
    "id" UUID NOT NULL,
    "telegramUserId" VARCHAR(12) NOT NULL,
    "fullName" VARCHAR(50) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6),

    CONSTRAINT "TelegramUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationToken" (
    "id" UUID NOT NULL,
    "telegramBotId" UUID NOT NULL,
    "telegramUserId" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6),

    CONSTRAINT "NotificationToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TelegramBot_token_key" ON "TelegramBot"("token");

-- CreateIndex
CREATE UNIQUE INDEX "TelegramUser_telegramUserId_key" ON "TelegramUser"("telegramUserId");

-- CreateIndex
CREATE UNIQUE INDEX "TelegramUser_fullName_key" ON "TelegramUser"("fullName");

-- AddForeignKey
ALTER TABLE "NotificationToken" ADD CONSTRAINT "NotificationToken_telegramBotId_fkey" FOREIGN KEY ("telegramBotId") REFERENCES "TelegramBot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationToken" ADD CONSTRAINT "NotificationToken_telegramUserId_fkey" FOREIGN KEY ("telegramUserId") REFERENCES "TelegramUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
