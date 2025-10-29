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

### Step 4: Update Password (if needed)

If your MySQL root password is different from `Password1`, update it in `config/connection.js`:

```javascript
connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "YOUR_PASSWORD_HERE",  // Change this
  database: "ifia_db"
});
```

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

2. Set the `JAWSDB_URL` environment variable:
   ```bash
   export JAWSDB_URL="mysql://user:password@host:port/database"
   ```

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
