# Some Notes

Some of this Project is AI generated. AI code was used for frontend things like CSS and html and this readme file. All backend was done by me (with some help from ai when I got stuck)

# Fred's Marine - Boat Dealership Service Management System

A full-stack web application for Fred's Marine boat dealership that manages boat inventory and customer service requests through a role-based access control system.

## Project Overview

This application allows customers to browse boat inventory and submit service requests, while providing an admin interface for managing boats, inventory, and service requests. The system implements role-based access control with four user types: admin, sales representative, service manager, and customer.

### Key Features

- **Boat Inventory Management**: Add, edit, and manage boat listings with multiple images
- **Service Request System**: Customers can submit service requests with details and track their status
- **Role-Based Access Control**: Four distinct user roles with specific permissions
- **User Authentication**: Secure login and registration with bcrypt password hashing
- **Session Management**: PostgreSQL-backed session storage for persistent authentication

## Technology Stack

- **Backend**: Express.js (Node.js)
- **Frontend**: EJS templating engine
- **Database**: PostgreSQL
- **Authentication**: express-session, bcrypt
- **Validation**: express-validator
- **Deployment**: Render

## Database Schema

### Entity Relationship Diagram
![Database ERD](./fredsERD.png)

### Tables Overview

### Users Table
```
id (SERIAL PRIMARY KEY)
email (VARCHAR(255) UNIQUE NOT NULL)
password (VARCHAR(255) NOT NULL - bcrypt hashed)
role (VARCHAR(50) NOT NULL) - Roles: admin, sales_rep, service_manager, customer
created_at (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
```

### Boats Table
```
id (SERIAL PRIMARY KEY)
title (VARCHAR(255) NOT NULL)
make (VARCHAR(100) NOT NULL)
model (VARCHAR(100) NOT NULL)
year (VARCHAR(10) NOT NULL)
price (DECIMAL(10, 2) NOT NULL)
condition (VARCHAR(50) NOT NULL)
description (TEXT)
created_at (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
updated_at (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
```

### Boat Images Table
```
id (SERIAL PRIMARY KEY)
boat_id (INTEGER NOT NULL - Foreign Key to boats)
image_url (VARCHAR(500) NOT NULL)
created_at (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
```

### Service Requests Table
```
id (SERIAL PRIMARY KEY)
user_id (INTEGER NOT NULL - Foreign Key to users)
boat_id (INTEGER - Foreign Key to boats, can be NULL)
description (TEXT NOT NULL)
status (VARCHAR(50) NOT NULL) - Values: submitted, approved, denied, completed
response_notes (TEXT)
service_types (TEXT[] ARRAY)
boat_year (VARCHAR(10))
boat_make (VARCHAR(100))
boat_model (VARCHAR(100))
created_at (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
updated_at (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
responded_at (TIMESTAMP)
```

### Admin Users Table
```
id (SERIAL PRIMARY KEY)
user_id (INTEGER NOT NULL - Foreign Key to users)
created_at (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
```

## User Roles and Permissions

### Admin
- Full access to all features
- Can manage boats (add, edit, delete)
- Can upload multiple images per boat
- Can view and respond to all service requests
- Can manage user accounts

### Sales Representative
- Can add and edit boat listings
- Can upload multiple images per boat
- Cannot view or manage service requests
- Cannot manage user accounts

### Service Manager
- Can view all service requests
- Can update service request status
- Can add response notes
- Cannot manage boats
- Cannot manage user accounts

### Customer
- Can browse boat inventory
- Can submit service requests
- Can view their own service requests and responses
- Cannot manage boats or other users' requests

## Test Accounts

Use these credentials to test the application (all use password: `test123`):

| Email | Role | Password |
|-------|------|----------|
| admin@fredsmarine.com | Admin | test123 |
| sales@fredsmarine.com | Sales Rep | test123 |
| service@fredsmarine.com | Service Manager | test123 |
| customer@fredsmarine.com | Customer | test123 |

## Quick Access

**Live Application**: [Fred's Marine on Render](https://cse340-final-e7hz.onrender.com)

## Installation and Setup For Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/tylerburdett7/cse340-final.git
   cd cse340-final
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the root directory with:
   ```
   DATABASE_URL=postgresql://user:password@localhost:5432/fredsmarine
   SESSION_SECRET=your_session_secret_here
   NODE_ENV=development
   PORT=3000
   ```

4. **Set up the PostgreSQL database**
   Create a PostgreSQL database and run the schema setup scripts to create all tables.

5. **Start the application**
   ```bash
   npm start
   ```
   The application will be available at `http://localhost:3000`

## File Structure

```
cse340-final/
├── src/
│   ├── controllers/
│   │   ├── routes.js
│   │   ├── boatController.js
│   │   ├── serviceRequestController.js
│   │   ├── loginController.js
│   │   └── homeController.js
│   ├── models/
│   │   ├── boatModel.js
│   │   └── serviceRequestModel.js
│   ├── middleware/
│   │   └── auth.js
│   ├── db/
│   │   └── index.js
│   └── views/
│       ├── pages/
│       ├── partials/
│       └── layouts/
├── public/
│   ├── css/
│   └── images/
├── package.json
├── server.js
└── .env
```

## Key Workflows

### Customer Service Request Flow
1. Customer logs in
2. Browses boat inventory
3. Submits service request for a specific boat or general inquiry
4. Request status is "submitted"
5. Service manager reviews and changes status to "approved", "denied", or "completed"
6. Customer can view updates to their request

### Boat Management Flow
1. Admin or Sales Rep logs in
2. Accesses the add-listing page via "Sales" link in navigation
3. Adds new boat with title, make, model, year, price, condition, and description
4. Adds multiple image URLs for the boat
5. Can edit or delete existing boats
6. Changes are reflected in boat inventory

## Known Limitations

- Image URLs are stored as text references (not direct file uploads)
- Service request attachments are not supported
- User management interface (for admins to create/edit users) is not yet implemented
- Boat search and filtering is not implemented

## Development

- Run with auto-reload: `npm run dev`
- Uses Express.js 5.x with ES6 modules
- All database queries use parameterized statements to prevent SQL injection
- Password hashing uses bcrypt with 10 salt rounds

## Deployment

The application is configured for deployment on Render with PostgreSQL database hosting.

## Author

Tyler Burdett

## License

ISC
