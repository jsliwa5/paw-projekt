# Używamy lekkiego obrazu Node.js (tego samego co w backendzie)
FROM node:20-alpine

# Ustawiamy katalog roboczy w kontenerze
WORKDIR /app

# Kopiujemy pliki definicji zależności
COPY package*.json ./

# Instalujemy zależności wewnątrz kontenera
RUN npm install

# Kopiujemy resztę kodu aplikacji
COPY . .

# Wystawiamy port, na którym działa Vite (domyślnie 5173)
EXPOSE 5000

# Uruchamiamy serwer deweloperski
# WAŻNE: Dodajemy "-- --host", żeby aplikacja była dostępna spoza kontenera
CMD ["npm", "run", "dev", "--", "--host"]