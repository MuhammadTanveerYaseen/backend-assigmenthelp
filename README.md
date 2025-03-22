# Express.js & MongoDB Backend

This is the backend server for the user management system, built with Express.js and MongoDB.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
- Copy `.env.example` to `.env`
- Update the MongoDB connection string in `.env`

3. Start the development server:
```bash
npm run dev
```

## Features

- Express.js server setup
- MongoDB integration with Mongoose
- Basic User model
- CORS enabled
- Environment variable configuration
- Complete CRUD API endpoints

## API Endpoints

### Users API

Base URL: `http://localhost:5000/api/users`

#### GET /api/users
- Get all users
- Response: Array of user objects

#### GET /api/users/:id
- Get a single user by ID
- Response: User object
- Error: 404 if user not found

#### POST /api/users
- Create a new user
- Request body:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com"
  }
  ```
- Response: Created user object

#### PUT /api/users/:id
- Update a user
- Request body:
  ```json
  {
    "name": "Updated Name",
    "email": "updated@example.com"
  }
  ```
- Response: Updated user object
- Error: 404 if user not found

#### DELETE /api/users/:id
- Delete a user
- Response: Success message
- Error: 404 if user not found

## MongoDB Schema

### User
```javascript
{
  name: String,      // Required
  email: String,     // Required, Unique
  createdAt: Date    // Default: Current timestamp
}
```

## Requirements

- Node.js
- MongoDB
- npm or yarn 