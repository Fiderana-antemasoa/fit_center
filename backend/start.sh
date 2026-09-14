#!/bin/sh
set -e

echo "Application des migrations Prisma..."
npx prisma migrate deploy

echo "Démarrage du backend..."
npm start

