# Digital Document Vault System

A secure document storage and management system built with React (Frontend) and Spring Boot (Backend).

## 🚀 Features

- **User Authentication**: Register and login functionality
- **Secure Document Storage**: Upload documents up to 50MB
- **Document Management**: View, download, and delete documents
- **Category Organization**: Organize documents by categories (Personal, Work, Financial, Legal, Medical, Education, Other)
- **Search Functionality**: Search documents by filename
- **Modern UI**: Beautiful gradient design with smooth animations
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## 📁 Project Structure

```
digital_document_vault_system/
├── backend/
│   └── digital-vault-backend/
│       ├── src/
│       │   ├── main/
│       │   │   ├── java/com/digitalvault/digital_vault_backend/
│       │   │   │   ├── controller/     # REST API Controllers
│       │   │   │   ├── model/          # Entity Models
│       │   │   │   ├── repository/     # JPA Repositories
│       │   │   │   ├── service/        # Business Logic
│       │   │   │   └── security/       # Security Configuration
│       │   │   └── resources/
│       │   │       └── application.properties
│       │   └── test/
│       └── pom.xml
│
└── frontend/
    └── digital-vault-ui/
        ├── public/
        ├── src/
        │   ├── components/     # Reusable Components (Navbar, Footer)
        │   ├── pages/          # Page Components (Home, Login, Register, etc.)
        │   ├── services/       # API Service Layer
        │   └── styles/         # CSS Styles
        └── package.json
```

## 🛠️ Technologies Used

### Backend

- **Java 17**
- **Spring Boot 3.5.7**
- **Spring Data JPA**
- **MySQL Database**
- **Maven**

### Frontend

- **React 19.2.0**
- **React Router DOM 6.28.0**
- **Font Awesome 6.4.0**
- **CSS3 with Gradients & Animations**

## 📋 Prerequisites

- Java JDK 17 or higher
- Node.js 16 or higher
- MySQL Server 8.0 or higher
- Maven 3.6 or higher

## ⚙️ Installation & Setup

### Database Setup

1. Install MySQL and start the server
2. The database `digital_vault_db` will be created automatically
3. Update credentials in `backend/digital-vault-backend/src/main/resources/application.properties` if needed:
   ```properties
   spring.datasource.username=root
   spring.datasource.password=examly
   ```

### Backend Setup

1. Navigate to backend directory:

   ```bash
   cd backend/digital-vault-backend
   ```

2. Build the project:

   ```bash
   mvn clean install
   ```

3. Run the application:

   ```bash
   mvn spring-boot:run
   ```

4. Backend will start on `http://localhost:8080`

### Frontend Setup

1. Navigate to frontend directory:

   ```bash
   cd frontend/digital-vault-ui
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm start
   ```

4. Frontend will start on `http://localhost:3000`

## 🔌 API Endpoints

### User Endpoints

- `POST /api/users/register` - Register new user
- `GET /api/users/{id}` - Get user by ID
- `GET /api/users/username/{username}` - Get user by username
- `GET /api/users` - Get all users
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

### Document Endpoints

- `POST /api/documents/upload` - Upload document
- `GET /api/documents/{id}` - Get document by ID
- `GET /api/documents/user/{userId}` - Get all documents for user
- `GET /api/documents/user/{userId}/category/{category}` - Get documents by category
- `GET /api/documents/user/{userId}/search?fileName={name}` - Search documents
- `GET /api/documents/download/{id}` - Download document
- `DELETE /api/documents/{id}` - Delete document

## 🎨 Design Features

- **Gradient Backgrounds**: Purple to blue gradients throughout
- **Smooth Animations**: Fade-in, slide-up, and hover effects
- **Card-based Layout**: Modern card designs for documents
- **Responsive Grid**: Auto-adjusting layouts for different screen sizes
- **Icon Integration**: Font Awesome icons for visual appeal
- **Color-coded Categories**: Different colors for document types

## 📱 Pages

1. **Home** - Landing page with features showcase
2. **Register** - User registration with validation
3. **Login** - User authentication
4. **Dashboard** - Overview with statistics and quick actions
5. **Upload** - Document upload with category selection
6. **Documents** - View, search, filter, download, and delete documents

## 🔒 Security Notes

⚠️ **Current Status**: Spring Security is temporarily disabled for initial development.

To enable security:

1. Uncomment Spring Security dependency in `pom.xml`
2. Implement proper authentication in `SecurityConfig.java`
3. Add password encryption with BCrypt
4. Implement JWT tokens for stateless authentication

## 🚧 Future Enhancements

- [ ] JWT Authentication
- [ ] Password encryption
- [ ] Document sharing between users
- [ ] Document versioning
- [ ] File preview functionality
- [ ] Advanced search with filters
- [ ] User profile management
- [ ] Email notifications
- [ ] Document tags
- [ ] Storage analytics

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Backend (8080)
netstat -ano | findstr :8080
taskkill /PID <process_id> /F

# Frontend (3000)
netstat -ano | findstr :3000
taskkill /PID <process_id> /F
```

### Database Connection Issues

- Verify MySQL is running
- Check username/password in application.properties
- Ensure database is created or `createDatabaseIfNotExist=true` is set

### Build Errors

```bash
# Backend
mvn clean install -U

# Frontend
npm install --force
```

## 📄 License

This project is created for educational purposes.

## 👥 Contributors

- Your Name

## 📞 Support

For issues and questions, please create an issue in the repository.

---

**Happy Coding! 🎉**
