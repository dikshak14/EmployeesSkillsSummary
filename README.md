# Employee Skills Summary System

## Project Overview

Employee Skills Summary System is a web application used to manage employee information and their skills.

It has two types of users:

- **Admin** – Can manage employees, users, skills and training details.
- **Employee** – Can view and update their own profile.

The project is developed using **React.js, Spring Boot and MySQL**.

---

## Main Features

- User Registration and Login
- Secure Login
- Admin and Employee Roles
- Admin Dashboard
- Employee Dashboard
- Add Employee
- Edit Employee
- Delete Employee
- Search Employees
- Manage Users
- Manage Employee Skills
- Track Skill Levels
- Track Training Requirements
- Employee Profile Update
- Skills Analytics
- Export Employee Data to CSV
- Responsive Design

---

## Technologies Used

### Frontend
- React.js
- Vite
- JavaScript
- HTML
- CSS
- Axios

### Backend
- Java
- Spring Boot
- Spring Data JPA
- Spring Security
- Maven

### Database
- MySQL

### Tools
- IntelliJ IDEA
- Git
- GitHub
- Postman

### Security
- Spring Security
- BCrypt Password Encryption
- Role-Based Access Control

---

## Admin Features

The Admin can:

- Login securely
- View the Admin Dashboard
- View all employees
- Add employees
- Edit employee details
- Delete employees
- Search and filter employees
- View employee skills
- Check skill levels
- Check training requirements
- Manage registered users
- View analytics
- Export employee data as CSV

---

## Employee Features

Employees can:

- Login securely
- View their Employee Dashboard
- View their profile
- View their department
- View their skills
- View their skill level
- View their training requirement
- Update their profile
- Logout securely

---

## System Architecture

The system follows a simple three-layer structure:

**React.js → Spring Boot → MySQL**

- **React.js** – Provides the user interface.
- **Spring Boot** – Handles APIs, security and application logic.
- **MySQL** – Stores employee and user data.

---

## Project Structure

```text
EmployeesSkillsSummary
│
├── employee-skills-frontend
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── App.jsx
│   │   └── App.css
│   ├── package.json
│   └── vite.config.js
│
├── src
│   └── main
│       ├── java
│       │   └── com.hexaware.employeeskillsummary
│       │       ├── config
│       │       ├── controller
│       │       ├── entity
│       │       ├── repository
│       │       └── service
│       │
│       └── resources
│           └── application.properties
│
├── pom.xml
├── mvnw
├── mvnw.cmd
---

## How the System Works

1. The user opens the application.
2. The user can register or login.
3. The system checks the login details.
4. The system checks the user's role.
5. Admin users are taken to the Admin Dashboard.
6. Employee users are taken to the Employee Dashboard.
7. Admins can manage employees and users.
8. Employees can view and update their own profile.
9. All information is stored in the MySQL database.

---

## Security

The application uses **Spring Security** for secure login and access control.

Passwords are protected using **BCrypt encryption**.

The system uses **Role-Based Access Control**.

- **Admin** can access admin features.
- **Employee** can access employee features.
- Unauthorized users cannot access protected features.

---

## API Testing

The REST APIs were tested using **Postman**.

The following operations were tested:

- User Login
- User Registration
- Get Employees
- Add Employee
- Update Employee
- Delete Employee
- Get Employee Profile
- Update Employee Profile
- User Management
- Access Control

---

## Application Pages

The application contains the following pages:

- Login Page
- Registration Page
- Admin Dashboard
- Add Employee Page
- Edit Employee Page
- User Management Page
- Skills Analytics Page
- Employee Dashboard
- Employee Profile
- Access Denied Page

---

## How to Run the Project

### Backend Setup

1. Open the project in **IntelliJ IDEA**.
2. Make sure **MySQL** is running.
3. Create the required database in MySQL.
4. Configure the database connection in `application.properties`.
5. Run the Spring Boot application.

The backend runs on:

```text
http://localhost:8080
├── .gitignore
└── README.md
