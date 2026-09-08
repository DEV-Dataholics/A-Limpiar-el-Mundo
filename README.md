# A Limpiar el Mundo 2026

Welcome to the **A Limpiar el Mundo** platform repository. This project is a unified multi-tenant volunteer management portal built to support massive corporate volunteering initiatives (initially branching from the *Somos Comunidad* architecture but overhauled to support strict corporate hierarchies).

## 🚀 Tech Stack
- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **Backend:** PHP 8, CodeIgniter 4 REST API
- **Database:** MySQL
- **Authentication:** JWT (JSON Web Tokens)

## 🏛️ Strategic Architecture

The core of this system revolves around a **Unified Multi-Volunteering & Multi-Tenant Model**. It tracks volunteers across a rigid (but flexible) corporate hierarchy, natively accommodating standard plants and complex divisions (like the "Lear Exception").

### Key Database Entities
1. **`campaigns`**: Handles the campaign window. (e.g., *A Limpiar el Mundo* in September). The `is_registration_open` toggle locks or unlocks the frontend forms.
2. **`corporates`**: The parent company/donor (e.g., APTIV, LEAR).
3. **`corporate_divisions`**: Optional intermediate level (e.g., División Piel, División Asientos).
4. **`corporate_plants`**: The physical plant/location where volunteers work.
5. **`activities`**: The central transactional table tracking volunteer events, dates, hours, and modalities (locked to 'CORPORATIVA' for this campaign).

## 💻 Local Development

### 1. Database Setup
1. Create a local MySQL database.
2. Copy `api/env` to `api/.env`.
3. Set `CI_ENVIRONMENT = development`.
4. Configure your database credentials in `api/.env`:
   ```env
   database.default.hostname = localhost
   database.default.database = your_db_name
   database.default.username = root
   database.default.password = root
   ```
5. Run migrations and seed data:
   ```bash
   cd api
   php spark migrate
   ```
   *Note: This will build the entire schema and seed the default "A Limpiar el Mundo" campaign and test corporate hierarchies.*

### 2. Backend (API)
1. Ensure dependencies are installed: `composer install` (from the `api/` directory).
2. Start the CodeIgniter development server:
   ```bash
   php spark serve
   ```

### 3. Frontend (React)
1. Navigate to the `frontend/` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `frontend/.env.development` to `.env` and configure the `VITE_API_URL` to point to your local CodeIgniter server.
4. Start the Vite development server:
   ```bash
   npm run dev
   ```

## 🔐 Admin Access
To access the admin dashboard, login with an account that has `role_id = 1` in the database. 

## 📦 Deployment
The project can be deployed to any standard cPanel/Apache environment. 
Use the included `upload_alem.ps1` script to automatically build the frontend and FTP the production files to the remote server.
