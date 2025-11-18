-- CreateEnum
CREATE TYPE "station_status" AS ENUM ('BUSY', 'FREE', 'CLOSED', 'MAINTENANCE');

-- CreateEnum
CREATE TYPE "charge_point_status" AS ENUM ('BUSY', 'FREE', 'CLOSED', 'MAINTENANCE');

-- CreateEnum
CREATE TYPE "charge_point_type" AS ENUM ('TYPE1', 'TYPE2', 'CCS', 'CHAdeMO', 'TESLA_SUPERCHARGER');

-- AlterTable
ALTER TABLE "stations" ADD COLUMN     "address" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "workingHours" TEXT NOT NULL DEFAULT '24/7';

-- CreateTable
CREATE TABLE "charge_points" (
    "id" SERIAL NOT NULL,
    "stationId" INTEGER NOT NULL,
    "type" "charge_point_type" NOT NULL DEFAULT 'TYPE1',
    "powerKW" DOUBLE PRECISION NOT NULL,
    "pricePerKwh" DOUBLE PRECISION NOT NULL,
    "status" "charge_point_status" NOT NULL DEFAULT 'FREE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "charge_points_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "charge_points" ADD CONSTRAINT "charge_points_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "stations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
