System Zarządzania Projektami - Środowisko Deweloperskie



Dokumentacja techniczna uruchomienia środowiska lokalnego opartego na Dockerze (Monorepo: Backend NestJS + Frontend + PostgreSQL).

1\. Wymagania wstępne



Przed rozpoczęciem należy upewnić się, że w systemie zainstalowane są:



&nbsp;   Docker Desktop (włączony i działający w tle).



&nbsp;   Git (do pobrania repozytorium).



Nie jest wymagana lokalna instalacja Node.js ani PostgreSQL.

2\. Instrukcja uruchomienia



Całe środowisko jest skonfigurowane w pliku docker-compose.yml. Aby je uruchomić, należy wykonać poniższe kroki w terminalu, w głównym katalogu projektu:



&nbsp;   Uruchomienie kontenerów: Zbudowanie obrazów i start usług (Frontend, Backend, Baza Danych).

&nbsp;   Bash



docker-compose up --build



Uwaga: Pierwsze uruchomienie może potrwać kilka minut.



Inicjalizacja bazy danych (Migracja): Krok wymagany tylko przy pierwszym uruchomieniu (lub po usunięciu wolumenów), aby utworzyć strukturę tabel w PostgreSQL. Należy otworzyć nowe okno terminala i wykonać:

Bash



&nbsp;   docker exec -it backend-1 npx prisma migrate dev --name init



3\. Adresy i Porty



Po poprawnym uruchomieniu usługi są dostępne pod następującymi adresami:

Usługa	Adres URL / Host	Port	Opis

Frontend	http://localhost:5173	5173	Aplikacja kliencka (Vite)

Backend API	http://localhost:3000	3000	NestJS API

Swagger	http://localhost:3000/api	3000	Dokumentacja API (jeśli skonfigurowana)

Baza Danych	localhost	5432	PostgreSQL



Dane dostępowe do bazy danych:



&nbsp;   User: myuser



&nbsp;   Password: mypassword



&nbsp;   Database: mydb



4\. Praca z kodem (Development)



&nbsp;   Backend: Kod znajduje się w katalogu /backend.



&nbsp;   Frontend: Kod znajduje się w katalogu /frontend.



Dzięki zamontowanym wolumenom (volumes), każda zmiana w plikach lokalnych powoduje automatyczne przeładowanie aplikacji w kontenerze (Hot Reload).

Komunikacja Frontend -> Backend



Aplikacja frontendowa powinna wysyłać zapytania API na adres http://localhost:3000 (bezpośrednio do hosta, nie przez nazwę sieciową Dockera).

5\. Przydatne komendy



Zatrzymanie środowiska:

Bash



docker-compose down



Zatrzymanie i usunięcie wszystkich danych (w tym bazy danych):

Bash



docker-compose down -v



Rozwiązywanie problemów: W przypadku błędu Port is already in use, należy upewnić się, że żadne inne procesy lokalne nie zajmują portów 3000, 5173 lub 5432.

