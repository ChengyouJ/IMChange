# IMChange
For ICHack : Sponsored by IMC aimed at using new technologies to work in conjunction with exiting charities. testjnunhjnh

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd IMChange
```

2. Install dependencies:
```bash
npm install
```

3. Set up the database:
```bash
npm run db:migrate
```

This will create a `dev.sqlite3` file and run all migrations to set up the database schema.

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the port shown in your terminal).

### Database Commands

- `npm run db:migrate` - Run all pending migrations
- `npm run db:rollback` - Rollback the last migration
- `npm run db:latest` - Alias for migrate (run all pending migrations)

### Project Structure

- `/src` - SvelteKit application code
- `/migrations` - Database migration files
- `/knexfile.js` - Database configuration
- `dev.sqlite3` - SQLite database file (created after running migrations)

## Features

- User registration and authentication
- Food bank surplus item management
- Location-based search for nearby food banks
- Item request system
