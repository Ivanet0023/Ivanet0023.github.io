-- CreateTable
CREATE TABLE "Dish" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "category" TEXT NOT NULL,
    "img" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Dish_pkey" PRIMARY KEY ("id")
);
