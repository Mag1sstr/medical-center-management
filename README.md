# Учёт медицинского центра

Простое fullstack-приложение: **React (Vite) + Redux Toolkit / RTK Query** на фронте и **Express + PostgreSQL** на бэкенде.

## Структура проекта

```
kursovaya/
├── README.md                 ← этот файл
├── .env.example              ← пример DATABASE_URL для корня (дублирует server)
├── server/
│   ├── .env.example
│   ├── package.json
│   ├── index.js              ← Express API
│   ├── db.js                 ← пул PostgreSQL (DATABASE_URL)
│   └── schema.sql            ← создание таблиц
└── client/
    ├── .env.example          ← опционально VITE_API_URL
    ├── package.json
    ├── vite.config.js        ← прокси на API в dev
    ├── index.html
    ├── tailwind.config.js
    ├── postcss.config.js
    └── src/
        ├── main.jsx
        ├── index.css
        ├── App.jsx
        ├── components/
        │   └── Navbar.jsx
        ├── pages/
        │   ├── PatientsPage.jsx
        │   ├── DoctorsPage.jsx
        │   ├── AppointmentsPage.jsx
        │   ├── TreatmentsPage.jsx
        │   └── AnalyticsPage.jsx
        └── store/
            ├── store.js
            └── api.js          ← RTK Query ко всем endpoint’ам
```

## Перед первым запуском

1. Установите **PostgreSQL** (локально, Docker или Supabase).
2. Создайте базу данных и примените схему:

```bash
# из папки server (подставьте свой URL)
psql "YOUR_DATABASE_URL" -f schema.sql
```

На Windows при установленном PostgreSQL может быть доступна команда `psql` из меню или через полный путь.

3. В папке **server** создайте файл `.env` (можно скопировать из `.env.example`):

```env
DATABASE_URL=postgresql://user:password@localhost:5432/medical_center
PORT=3001
```

Для Supabase возьмите строку подключения из настроек проекта; при необходимости добавьте в URL `?sslmode=require` или установите переменную `PGSSLMODE=require`.

## Установка зависимостей

В корне проекта выполните установку **в двух папках**:

```bash
cd server && npm install && cd ../client && npm install
```

## Запуск

**Терминал 1 — backend** (из папки `server`):

```bash
npm run start
```

API по умолчанию: `http://localhost:3001`.

**Терминал 2 — frontend** (из папки `client`):

```bash
npm run dev
```

Откройте в браузере адрес, который покажет Vite (обычно `http://localhost:5173`). Запросы к `/patients`, `/doctors` и т.д. проксируются на backend.

Если frontend и backend на разных машинах или без прокси, в **client** создайте `.env`:

```env
VITE_API_URL=http://localhost:3001
```

## API (кратко)

| Метод | Путь |
|--------|------|
| GET/POST | `/patients`, `/doctors`, `/appointments`, `/treatments` |
| GET | `/analytics/appointments` |
| GET | `/analytics/doctor-load` |
| GET | `/analytics/total-income` |
| GET | `/analytics/income-by-doctor` |
| GET | `/analytics/diagnosis-stats` |

Проверка живости: `GET /health`.

## Пример `.env`

Корень / сервер:

```env
DATABASE_URL=your_database_url
```

Клиент (опционально):

```env
VITE_API_URL=
```

Если `VITE_API_URL` пустой, в режиме разработки используются относительные URL и прокси из `vite.config.js`.
