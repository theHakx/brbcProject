# Receipt Management System

A full-stack web application for managing receipts and financial records, built with React (frontend) and Node.js/Express (backend).

## 🚀 Features

- **User Authentication**: Secure login and registration system
- **Receipt Management**: Upload, view, and organize receipts
- **Admin Dashboard**: Administrative controls and user management
- **Conference Management**: Handle conference-related receipts
- **PDF Generation**: Generate reports and receipts in PDF format
- **Email Integration**: Send notifications and reports via email

## 🛠️ Tech Stack

### Frontend
- **React 19** with Vite
- **Material-UI (MUI)** for UI components
- **React Router** for navigation
- **Axios** for API communication
- **SASS** for styling

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **PDFKit** for PDF generation
- **Nodemailer** for email functionality
- **CORS** for cross-origin requests

## 📁 Project Structure

```
├── brbc/                 # Frontend React application
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── context/      # React context providers
│   │   ├── utils/        # Utility functions
│   │   └── styles/       # SASS stylesheets
│   ├── public/           # Static assets
│   └── package.json
├── server/               # Backend Node.js application
│   ├── routes/           # API route handlers
│   ├── controllers/      # Business logic
│   ├── models/           # Database models
│   ├── utils/            # Utility functions
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Receipt
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd brbc
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd ../server
   npm install
   ```

4. **Environment Setup**

   Create `.env` files in both `brbc/` and `server/` directories:

   **Frontend (.env in brbc/)**
   ```env
   VITE_API_URL=http://localhost:5000
   ```

   **Backend (.env in server/)**
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_password
   RESEND_API_KEY=your_resend_api_key
   ```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd server
   npm run dev
   ```
   The server will start on `http://localhost:5000`

2. **Start the Frontend Development Server**
   ```bash
   cd brbc
   npm run dev
   ```
   The frontend will start on `http://localhost:5173`

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### User Management
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/receipts` - Get user receipts

### Admin Routes
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user

### Conference Management
- `GET /api/conferences` - Get conferences
- `POST /api/conferences` - Create conference

## 🔧 Available Scripts

### Frontend (brbc/)
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Backend (server/)
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

## 📦 Deployment

### Frontend Deployment
1. Build the project: `npm run build`
2. Deploy the `dist/` folder to your hosting service

### Backend Deployment
1. Set up environment variables on your hosting platform
2. Deploy the server files
3. Ensure MongoDB connection is configured

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Material-UI for the beautiful UI components
- MongoDB for the database solution
- Express.js for the robust backend framework 