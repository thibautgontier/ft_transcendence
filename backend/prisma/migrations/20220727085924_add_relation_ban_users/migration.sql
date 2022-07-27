-- CreateTable
CREATE TABLE "_banUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_banUser_AB_unique" ON "_banUser"("A", "B");

-- CreateIndex
CREATE INDEX "_banUser_B_index" ON "_banUser"("B");

-- AddForeignKey
ALTER TABLE "_banUser" ADD CONSTRAINT "_banUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_banUser" ADD CONSTRAINT "_banUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
