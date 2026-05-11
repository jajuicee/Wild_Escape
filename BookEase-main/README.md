# Wildfire / BookEase

> A robust full-stack application built with React (Vite) and Spring Boot.

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Frontend](https://img.shields.io/badge/Frontend-React_Vite-61DAFB?logo=react)
![Backend](https://img.shields.io/badge/Backend-Spring_Boot-6DB33F?logo=spring)

## 📖 Table of Contents
* [About the Project](#about-the-project)
* [Tech Stack](#tech-stack)
* [Prerequisites](#prerequisites)
* [Getting Started](##getting-started)
    * [Backend Setup](###backend-setup)
    * [Frontend Setup](###frontend-setup)
* [Configuration](##configuration)

---

## 🧐 About the Project
Wildfire / BookEase is a web application designed to help users search, compare, and book hotels and accommodations worldwide. It leverages the speed of Vite for the frontend and the reliability of the Spring ecosystem for the backend, providing a fast, responsive, and secure booking experience.

**Key Features:**
* Feature 1 (e.g., Secure JWT Authentication)
* Feature 2 (e.g., RESTful API architecture)

---

## 🛠 Tech Stack

### Frontend
* **Framework:** [React](https://reactjs.org/)
* **Build Tool:** [Vite](https://vitejs.dev/)
* **Styling:** [Tailwind CSS / MUI]
* **State Management:** [Default React useState]
* **HTTP Client:** [Axios]

### Backend
* **Framework:** [Spring Boot 3.x](https://spring.io/projects/spring-boot)
* **Language:** Java [17/21]
* **Database:** [MySQL]
* **ORM:** [Spring Data JPA / Hibernate]
* **Build Tool:** [Maven]

---

## ⚙️ Prerequisites
Before running the project, ensure you have the following installed:

* **Node.js** (v18+ recommended)
* **Java Development Kit (JDK)** (v17+)
* **Database** (e.g., MySQL, PostgreSQL installed and running)
* **Git**

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/migoreng-punch/BookEase.git
cd repo-name
```

### 2. Backend Setup
```bash
cd backend

# Build the project
mvn clean install

# Run the Spring Boot app
mvn spring-boot:run
```

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install
# or
yarn install

# Run the frontend
npm run dev
# or
yarn dev
```

## 🔩 Configuration

### Configure Database: 
Open src/main/resources/application.properties (or application.yml) and update your database credentials:
```Properties
spring.datasource.url=jdbc:mysql://localhost:3306/your_database_name
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
```

