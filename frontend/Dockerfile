# frontend/Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Vite domyślnie działa na porcie 5173
EXPOSE 5173

# Komenda startowa (zależy od frameworka, zazwyczaj 'dev' lub 'start')
CMD ["npm", "run", "dev", "--", "--host"]