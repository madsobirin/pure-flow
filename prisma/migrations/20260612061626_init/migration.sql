-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alat" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "nama_alat" TEXT NOT NULL,
    "foto_path" TEXT NOT NULL,
    "catatan_alat" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "alat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "log_latihan" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "alat_id" INTEGER NOT NULL,
    "jumlah_set" INTEGER NOT NULL,
    "jumlah_repetisi" INTEGER NOT NULL,
    "catatan_latihan" TEXT,
    "tanggal_latihan" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "log_latihan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "alat" ADD CONSTRAINT "alat_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "log_latihan" ADD CONSTRAINT "log_latihan_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "log_latihan" ADD CONSTRAINT "log_latihan_alat_id_fkey" FOREIGN KEY ("alat_id") REFERENCES "alat"("id") ON DELETE CASCADE ON UPDATE CASCADE;
