# Database Setup Guide

This application requires a MySQL database to function properly. Follow the steps below to set it up.

## Current Issue

If you're seeing this error when running the application:

```
❌ DATABASE CONNECTION FAILED
Error: ECONNREFUSED
```

It means MySQL is not installed or not running on your system.

## Solution: Install and Configure MySQL

### Step 1: Install MySQL

**Windows:**
1. Download MySQL from: https://dev.mysql.com/downloads/mysql/
2. Run the installer and follow the setup wizard
3. During installation, set a root password (the app currently expects: `Password1`)
4. Make sure MySQL Server is running

**macOS:**
```bash
brew install mysql
brew services start mysql
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql
```

### Step 2: Configure MySQL

1. **Log in to MySQL:**
   ```bash
   mysql -u root -p
   ```
   (Enter your password when prompted. Default in code is: `Password1`)

2. **Create the database:**
   ```sql
   CREATE DATABASE ifia_db;
   exit;
   ```

### Step 3: Import Database Schema

From the project root directory:

```bash
mysql -u root -p ifia_db < db/schema.sql
mysql -u root -p ifia_db < db/seeds.sql
```

### Step 4: Configure Environment Variables

Create a `.env` file in the project root directory with your database credentials:

```bash
cp .env.example .env
```

Then edit the `.env` file with your MySQL password:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=Password1
DB_NAME=ifia_db
```

**Important:** Replace `Password1` with your actual MySQL root password.

### Step 5: Verify Setup

Run the application:
```bash
node server.js
```

You should see:
```
Server listening on: http://localhost:8081
✓ Database connected as id [number]
```

## Alternative: Use Cloud Database

If you prefer not to install MySQL locally, you can use a cloud database service:

1. Set up a MySQL database on a service like:
   - JawsDB (Heroku add-on)
   - PlanetScale
   - AWS RDS
   - Google Cloud SQL

2. Add the connection URL to your `.env` file:
   ```env
   JAWSDB_URL=mysql://user:password@host:port/database
   ```

   Or export it as an environment variable:
   ```bash
   export JAWSDB_URL="mysql://user:password@host:port/database"
   ```

**Note:** If `JAWSDB_URL` is set, it will be used instead of the individual DB_* variables.

## Troubleshooting

### "Cannot connect to MySQL server"
- Make sure MySQL is running: `sudo systemctl status mysql` (Linux) or check Services (Windows)
- Verify MySQL is listening on port 3306

### "Access denied for user 'root'"
- Check your password in `config/connection.js`
- Reset MySQL root password if needed

### "Database 'ifia_db' doesn't exist"
- Run the CREATE DATABASE command from Step 2
- Import the schema files from Step 3

## Database Schema

The application uses two tables:

**questions**
- Stores quiz questions with multiple choice answers
- Tracks which questions have been accessed

**users**
- Stores user information
- Tracks quiz attempts and scores
