# Project Management System Plan

## 1. Project Setup
- **Technologies:** 
  - Backend: Node.js with Express.js framework
  - Database: MySQL 12
  - Frontend: EJS templates
  - Authentication: Passport.js for local authentication, bcrypt for password hashing, and two-factor authentication (2FA)
  - Graphs: Chart.js for displaying hours worked
  - PDF Generation: pdfkit for generating invoices
  - Email Notifications: Nodemailer

## 2. Database Design
- **Tables:**
  - `users` (id, name, email, password, role, 2fa_secret)
  - `projects` (id, name, description, start_date, end_date)
  - `clock_entries` (id, user_id, project_id, clock_in_time, clock_out_time)
  - `roles` (id, role_name)
  - `audit_logs` (id, user_id, action, timestamp)
  - `invoices` (id, user_id, project_id, hours_worked, invoice_date, pdf_path)

## 3. Backend Routes
- **Authentication:**
  - `/login` (POST): Authenticate users
  - `/register` (POST): Register new users (admin only)
  - `/2fa-setup` (POST): Set up 2FA for a user
  - `/2fa-verify` (POST): Verify 2FA for login

- **Clocking:**
  - `/clock-in` (POST): Clock in for a project
  - `/clock-out` (POST): Clock out for a project

- **Projects:**
  - `/projects` (GET): List all projects
  - `/projects` (POST): Create a new project (manager/admin only)
  - `/projects/:id` (GET): Get details of a specific project

- **Users:**
  - `/users` (GET): List all users (admin only)
  - `/users/:id` (GET): Get user profile (admin/manager only)
  - `/users/:id/permissions` (POST): Edit user permissions (admin only)

- **Reports:**
  - `/reports/hours` (GET): Get hours worked for each project (filter by day, week, month)
  - `/invoices/generate` (POST): Generate invoice for hours worked

- **Logs:**
  - `/audit-logs` (GET): View audit logs (admin only)

## 4. Frontend Pages
- **Authentication Pages:**
  - Login
  - 2FA Verification
  - Registration (admin only)

- **Dashboard:**
  - Overview of projects and hours worked
  - Graphs showing hours worked per project (daily, weekly, monthly)

- **Project Management:**
  - List of projects
  - Create/Edit project (manager/admin only)
  - Project details

- **User Management:**
  - List of users (admin only)
  - User profile (admin/manager only)
  - Edit user permissions (admin only)

- **Clock In/Out:**
  - Clock in/out interface for employees

- **Invoices:**
  - Generate invoice interface
  - View generated invoices

## 5. Key Features Implementation
- **Authentication:**
  - Use Passport.js for local authentication
  - Use bcrypt for hashing passwords
  - Implement 2FA using Google Authenticator and QR codes

- **Clocking:**
  - Implement clock in/out functionality that records timestamps and project IDs in the database

- **Graphs:**
  - Use Chart.js to display hours worked per project, with different colors for each project
  - Provide filters for daily, weekly, and monthly views

- **Admin/Manager Roles:**
  - Use middleware to restrict routes based on user roles
  - Allow admins to manage user permissions
  - Allow managers to create/edit projects but not manage users

- **Audit Logs:**
  - Log all significant actions (e.g., user logins, project creation, clock in/out) in an `audit_logs` table
  - Create an interface for admins to view audit logs

- **Email Notifications:**
  - Use Nodemailer to send email notifications for significant events (e.g., new project assignments, password resets)

- **PDF Invoicing:**
  - Use pdfkit to generate PDFs for invoices based on hours worked
  - Store generated PDFs in the `invoices` table

## 6. Security
- Ensure all passwords are hashed using bcrypt
- Implement 2FA for an additional layer of security
- Use HTTPS for all data transmissions
- Implement input validation and sanitization to prevent SQL injection and XSS attacks

## 7. Deployment
- Use Docker for containerization
- Use a CI/CD pipeline for automated testing and deployment
- Host on a cloud provider like AWS, Azure, or DigitalOcean

## 8. Project Timeline
- **Week 1-2:**
  - Set up the project structure and database schema
  - Implement authentication and user management

- **Week 3-4:**
  - Develop clock in/out functionality
  - Create project management features

- **Week 5-6:**
  - Implement reporting and graph features
  - Develop invoice generation and email notifications

- **Week 7-8:**
  - Implement audit logs and security features
  - Perform thorough testing and bug fixing

- **Week 9:**
  - Deployment and final testing
  - User training and documentation
