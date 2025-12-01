FROM node:20-alpine

# Ustawiamy katalog roboczy
WORKDIR /usr/src/app

# Kopiujemy pliki zależności
COPY package*.json ./

# Kopiujemy schemat Prismy (ważne przed instalacją, jeśli są skrypty post-install)
COPY prisma ./prisma/

# Instalujemy WSZYSTKIE zależności (również devDependencies jak @nestjs/cli czy typescript)
RUN npm install

# Kopiujemy resztę plików (dla porządku, choć wolumen i tak to nadpisze)
COPY . .

# Generujemy klienta Prismy
RUN npx prisma generate

# Domyślna komenda startowa (można ją nadpisać w docker-compose)
CMD ["npm", "run", "start:dev"]