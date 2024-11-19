# Backend Project

## Overview

This is a backend project built with **TypeScript** and **Express.js**, following the **Model-View-Controller (MVC)** architecture. It integrates various features and tools, including **MQTT** for messaging, **JWT** for authentication, **Nodemailer** for email communication, and **PrismaORM** for PostgreSQL database management. Additionally, it includes an admin injection script for initial setup.

---

## Features

- **TypeScript**: Ensures type safety and enhanced code quality.
- **Express.js**: Provides a robust API and routing system.
- **MVC Architecture**: Maintains separation of concerns for scalability and maintainability.
- **MQTT**: Implements lightweight and efficient messaging for IoT and real-time features.
- **JWT Authentication**: Secures APIs with token-based authentication.
- **Nodemailer**: Facilitates email services for password resets, notifications, and more.
- **Prisma ORM**: Simplifies database access and management for PostgreSQL.
- **Admin Injection Script**: Easily seeds an admin user during the initial setup.

---

## Installation

### Prerequisites

- **Node.js**: Version 16.x or higher
- **npm**: Version 7.x or higher
- **PostgreSQL**: Ensure a PostgreSQL instance is running

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/ihebdebbech/ExpressJs_Typescript-project.git
   
2. migrate db:
   ```bash
   run: npx prisma migrate dev
3. install modules:
   ```bash
   run: npm i
4. execute project:
   ```bash
   run: npm run dev


    