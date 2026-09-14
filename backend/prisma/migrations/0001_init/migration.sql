-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "membre" (
    "id" SERIAL NOT NULL,
    "nom" VARCHAR(100) NOT NULL,
    "telephone" VARCHAR(150) NOT NULL,
    "date_inscription" DATE NOT NULL DEFAULT CURRENT_DATE,
    "statut_membre" VARCHAR(20) NOT NULL DEFAULT 'Actif',
    "mail" VARCHAR(150) NOT NULL,

    CONSTRAINT "membre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "abonnemment" (
    "id" SERIAL NOT NULL,
    "type" VARCHAR(30) NOT NULL,
    "date_debut" DATE NOT NULL,
    "date_fin" DATE NOT NULL,
    "prix" DECIMAL(10,2) NOT NULL,
    "statut_abonnement" VARCHAR(20) NOT NULL DEFAULT 'Actif',
    "membre_id" INTEGER NOT NULL,

    CONSTRAINT "abonnemment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "membre_telephone_key" ON "membre"("telephone");

-- CreateIndex
CREATE UNIQUE INDEX "membre_mail_key" ON "membre"("mail");

-- AddForeignKey
ALTER TABLE "abonnemment" ADD CONSTRAINT "fk_abonnement_membre" FOREIGN KEY ("membre_id") REFERENCES "membre"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
