-- CreateTable
CREATE TABLE "GameProfile" (
    "id" SERIAL NOT NULL,
    "Level" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "Xp" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "NbParty" INTEGER NOT NULL DEFAULT 0,
    "NbWin" INTEGER NOT NULL DEFAULT 0,
    "UserID" INTEGER,

    CONSTRAINT "GameProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_history" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "GameProfile_UserID_key" ON "GameProfile"("UserID");

-- CreateIndex
CREATE UNIQUE INDEX "_history_AB_unique" ON "_history"("A", "B");

-- CreateIndex
CREATE INDEX "_history_B_index" ON "_history"("B");

-- AddForeignKey
ALTER TABLE "GameProfile" ADD CONSTRAINT "GameProfile_UserID_fkey" FOREIGN KEY ("UserID") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_history" ADD CONSTRAINT "_history_A_fkey" FOREIGN KEY ("A") REFERENCES "GameProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_history" ADD CONSTRAINT "_history_B_fkey" FOREIGN KEY ("B") REFERENCES "Party"("id") ON DELETE CASCADE ON UPDATE CASCADE;
