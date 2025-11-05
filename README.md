# ParkEasy

Smart parking management system with real-time reservations and email notifications.

## Deployment Guide (Render)

This app uses two Render services:
1. Backend Web Service (API + email sending)
2. Frontend Static Site (React/Vite app)

### 1. Backend Web Service Setup

1. Create a new **Web Service** in Render:
   - Connect to GitHub repository
   - Select branch `main`
   - Root Directory: `/`
   - Runtime: Node
   - Build Command: `cd BACKEND && npm install`
   - Start Command: `cd BACKEND && npm start`

2. Add Environment Variables:
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=7d
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your_gmail_address
   SMTP_PASS=your_gmail_app_password
   SMTP_FROM="ParkEasy <your_gmail_address>"
   PORT=10000
   ```

   Notes:
   - For `SMTP_PASS`: Create an App Password in Gmail (requires 2FA enabled)
   - Generate a strong `JWT_SECRET` (e.g., use `openssl rand -hex 32`)
   - Set `PORT` to Render's default 10000

### 2. Frontend Static Site Setup

1. Create a new **Static Site** in Render:
   - Connect to same GitHub repository
   - Select branch `main`
   - Root Directory: `/FRONTEND`
   - Build Command: `npm install --legacy-peer-deps && npm run build`
   - Publish Directory: `dist`

2. Add Environment Variables:
   ```
   VITE_API_BASE_URL=https://your-backend-service.onrender.com
   ```
   Note: Replace with your actual backend service URL after it deploys.

### Development Setup

1. Clone repository:
   ```bash
   git clone https://github.com/urzarai/ParkEasy.git
   cd ParkEasy
   ```

2. Install dependencies:
   ```bash
   # Install backend deps
   cd BACKEND
   npm install

   # Install frontend deps
   cd ../FRONTEND
   npm install --legacy-peer-deps
   ```

3. Set up environment:
   - Copy `BACKEND/.env.example` to `BACKEND/.env` (create if missing)
   - Add required environment variables (see Backend Setup section)

4. Start development servers:
   ```bash
   # Terminal 1: Backend
   cd BACKEND
   npm run dev

   # Terminal 2: Frontend
   cd FRONTEND
   npm run dev
   ```

Visit frontend at http://localhost:5173 (or port shown) and backend at http://localhost:5000.

### Testing Email Setup

1. Enable 2FA on your Gmail account
2. Create an App Password:
   - Go to Google Account → Security → App Passwords
   - Select "Mail" and "Other" (Custom Name: "ParkEasy")
   - Copy the 16-character password
3. Update `BACKEND/.env` with Gmail + App Password
4. Run the test script:
   ```bash
   cd BACKEND
   node scripts/send-test-email.js
   ```

### Deployment Checklist

Backend:
- [ ] MongoDB Atlas cluster created and `MONGO_URI` ready
- [ ] Gmail 2FA enabled and App Password created
- [ ] All environment variables added in Render
- [ ] Service deployed and health check passing
- [ ] Test reservation email sending

Frontend:
- [ ] Backend URL added as `VITE_API_BASE_URL`
- [ ] Build succeeds and assets published
- [ ] Can log in and make reservations
- [ ] Emails received on reservation

## License

MIT