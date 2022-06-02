-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "hashPwd" TEXT NOT NULL,
    "hashRToken" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
