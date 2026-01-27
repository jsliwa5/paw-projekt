# Wprowadzenie

Aplikacja Project Management System to kompleksowe narzędzie do zarządzania projektami i zadaniami w zespołach, stworzone w architekturze klient-serwer.

Cel aplikacji: Celem systemu jest usprawnienie organizacji pracy poprzez umożliwienie tworzenia projektów, przydzielania zadań konkretnym użytkownikom, śledzenia postępów (statusów), priorytetów oraz terminów realizacji (Due Date).

Kluczowe funkcje i możliwości:

   - Pełna autentykacja i autoryzacja użytkowników (JWT).

   - Podział na role: Manager (zarządzanie projektami) i User (wykonywanie zadań).

   - Zarządzanie zadaniami: priorytety, terminy, przypisywanie do osób.

   - Interaktywny frontend z dynamicznym odświeżaniem danych.

   - Automatyczna dokumentacja API (Swagger/OpenAPI).

   # Wykorzystane technologie

Backend:
- Node.js & NestJS – główny framework serwerowy.

- TypeScript – typowanie statyczne zapewniające bezpieczeństwo kodu.

- Prisma ORM – komunikacja z bazą danych i migracje.

- PostgreSQL – relacyjna baza danych.

- Docker & Docker Compose – konteneryzacja środowiska.

- JWT & Passport – obsługa bezpieczeństwa i logowania.

- Swagger – dokumentacja API.

Frontend:
- React (Vite) – biblioteka interfejsu użytkownika.

- TailwindCSS – stylowanie aplikacji.

- shadcn/ui & Radix UI – zestaw komponentów UI.

- TanStack Query – zarządzanie stanem serwera i cache.

- React Hook Form + Zod – obsługa formularzy i walidacja.

# Instalacja i Przygotowanie (Wprowadzenie techniczne)

Wymagania wstępne:

   - Docker Desktop (uruchomiony).

   - Node.js (wersja 18 lub nowsza) - opcjonalnie, jeśli chcesz uruchamiać bez Dockera.

  -  Git.

  ```bash 
  git clone https://github.com/jsliwa5/paw-projekt.git
cd paw-projekt
  ```

## Kroki instalacji – przygotowanie projektu:

   1. Konfiguracja środowiska: Upewnij się, że w głównym katalogu (dla docker-compose) oraz w folderach backend i frontend znajdują się odpowiednie pliki konfiguracyjne (Docker zajmie się większością z nich, ale warto sprawdzić .env).

   2. Uruchomienie za pomocą Dockera (Zalecane): Jest to najszybsza metoda, która stawia bazę danych, backend i frontend jednocześnie.
 
```
    docker compose up --build
```

   3.  Migracja bazy danych (Przy pierwszym uruchomieniu): Po uruchomieniu kontenerów, otwórz nowy terminal i wykonaj migrację, aby utworzyć tabele w PostgreSQL:
    
```
    docker exec -it project-management-app-backend-1 npx prisma migrate dev --name init
```
   
# Instrukcje użytkowania

Uruchamianie lokalne: Po wykonaniu komendy docker-compose up, aplikacja jest dostępna pod następującymi adresami:

  -  Frontend (Aplikacja): http://localhost:5000

  -  Backend API: http://localhost:3000

 - Dokumentacja Swagger: http://localhost:3000/api

<img width="1919" height="936" alt="obraz" src="https://github.com/user-attachments/assets/2ef34abd-8cae-41d9-a746-25ec6871d67c" />
<img width="1918" height="938" alt="obraz" src="https://github.com/user-attachments/assets/279a5bb7-b145-48d8-8c1d-2ab62919737a" />
<img width="1919" height="939" alt="obraz" src="https://github.com/user-attachments/assets/127c41eb-db6a-4f28-90ed-0bc264ab595d" />
<img width="1916" height="935" alt="obraz" src="https://github.com/user-attachments/assets/163b0fa0-1dc9-42bd-9740-9d1aecd19773" />
<img width="1919" height="931" alt="obraz" src="https://github.com/user-attachments/assets/856dc531-763b-4cba-8c33-c266fa3c4cd7" />
<img width="1919" height="938" alt="obraz" src="https://github.com/user-attachments/assets/a994e705-40e2-4220-833a-a57a78a4b6c4" />


 # Konfiguracja
 Przykładowa zawartośc .env
 ```bash
DATABASE_URL="postgresql://myuser:mypassword@localhost:5432/mydb?schema=public"
JWT_SECRET="super_tajny_sekret"
 ```

# Funkcje
System Rejestracji i Logowania (RBAC):

  -  Bezpieczne hashowanie haseł (bcrypt).

  -  Role-Based Access Control: Tylko Manager może tworzyć/usuwać projekty.

Zarządzanie Projektami:

  -   Pełny CRUD (Create, Read, Update, Delete) dla projektów.

Zaawansowane Zadania (Tasks):

  -  Priorytetyzacja (LOW, MEDIUM, HIGH, URGENT).

 -   Terminowość (DueDate).

   - Przypisanie do użytkownika (Relacja Task -> User).

Walidacja Danych:

  -  Frontend: Zod schema validation (natychmiastowa informacja o błędach).

 -   Backend: DTO + Class Validator (zabezpieczenie API).
 

 # Struktura apliakcji
 ## Model danych (Baza danych)

Baza oparta jest o 3 główne tabele zdefiniowane w schema.prisma:

  -  User: Posiada rolę (Enum), listę przypisanych zadań.

  -  Project: Posiada właściciela i listę zadań.

  -  Task: Należy do projektu, może być przypisany do Usera, posiada status, priorytet i datę. 

## Struktura katalogów

```
.
├── backend/
│   ├── src/
│   │   ├── auth/         # Logika logowania, Guardy, Strategie JWT
│   │   ├── tasks/        # Moduł zadań (Controller, Service, DTO)
│   │   ├── projects/     # Moduł projektów
│   │   ├── users/        # Moduł użytkowników
│   │   ├── prisma/       # Serwis połączenia z bazą
│   │   └── main.ts       # Punkt startowy aplikacji
├── frontend/
│   ├── client/src/
│   │   ├── components/   # Komponenty UI (współdzielone)
│   │   ├── lib/          # Konfiguracja API, utilsy
│   │   └── hooks/        # Customowe hooki (np. useAuth)
├── docker-compose.yml
└── README.md
```

## Prezentacja funkcojonalności

plik tasks.services.ts
```typescript
// 1. Definicja metody serwisu, która przyjmuje DTO (zweryfikowane dane od użytkownika)
async create(createTaskDto: CreateTaskDto) {

  // 2. Weryfikacja spójności danych: Sprawdzamy czy projekt, do którego
  // chcemy dodać zadanie, faktycznie istnieje w bazie.
  const proj = await this.prisma.project.findUnique({
    where: { id: createTaskDto.projectId },
  });

  // 3. Jeśli projekt nie istnieje, przerywamy działanie rzucając wyjątek HTTP 404.
  // NestJS automatycznie zamieni to na odpowiedź JSON z błędem dla klienta.
  if (!proj) {
    throw new NotFoundException(`Project with ID ${createTaskDto.projectId} not found`);
  }

  // 4. Wywołanie Prisma ORM do zapisania rekordu w bazie danych.
  return this.prisma.task.create({
    data: {
      title: createTaskDto.title,
      description: createTaskDto.description,
      projectId: createTaskDto.projectId,
      // Obsługa opcjonalnego przypisania użytkownika
      userId: createTaskDto.userId || null,
      status: 'TODO', // Domyślny status
      priority: createTaskDto.priority, // Enum Priorytetu
      dueDate: createTaskDto.dueDate,   // Data wykonania
    },
    // 5. Select pozwala nam zwrócić czysty obiekt JSON,
    // ukrywając pola systemowe (np. createdAt, updatedAt)
    select: this.taskSelect,
  });
}
```

# Wdrożenie
Tak samo jak kroki instalacji tylko używamy migrate deploy zamiast dev, aby zaaplikować gotowe migracje bez generowania nowych.


```bash
docker exec project-management-app-backend-1 npx prisma migrate deploy
```
