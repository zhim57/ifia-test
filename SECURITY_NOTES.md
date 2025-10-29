# Security Issues

## SQL Injection Vulnerabilities

The application contains several SQL injection vulnerabilities where user input is directly concatenated into SQL queries without proper sanitization:

### 1. Update Question Route (controllers/ifiaController.js:51)
```javascript
var condition = "id = " + req.params.id;
```
The `req.params.id` is directly concatenated into the SQL condition string.

### 2. Delete Question Route (controllers/ifiaController.js:76)
```javascript
var condition = "id = " + req.params.id;
```
The `req.params.id` is directly concatenated into the SQL condition string.

### 3. Delete User Route (controllers/ifiaController.js:94)
```javascript
var condition = "id = " + req.params.id;
```
The `req.params.id` is directly concatenated into the SQL condition string.

## Recommended Fix

Use parameterized queries or the ORM should properly escape values. For example:

```javascript
// Instead of:
var condition = "id = " + req.params.id;

// Use:
var condition = "id = ?";
// Pass the parameter separately to the query execution
```

Or validate and sanitize the input:
```javascript
var id = parseInt(req.params.id);
if (isNaN(id)) {
  return res.status(400).json({ error: "Invalid ID" });
}
var condition = "id = " + id;
```

## Other Security Concerns

1. **Hardcoded database password** in `config/connection.js:12` - Should use environment variables
2. **Weak session secret** in `server.js:22` - Should use a strong, random secret stored in environment variables
