# BankMore Frontend - AngularJS

Frontend web application for the BankMore banking system built with AngularJS 1.8.3.

## Features

- **User Authentication**: Login with account number or CPF
- **Account Registration**: Create new bank accounts
- **Dashboard**: View account balance and quick actions
- **Money Transfers**: Send money to other accounts
- **Fee Management**: View transaction fees and charges
- **Profile Management**: Account information and deactivation
- **Responsive Design**: Mobile-friendly interface with Bootstrap 5

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)
- BankMore Backend APIs running (Account API, Transfer API, Fee API)

## Installation

1. Clone or navigate to the project directory:
```bash
cd BankMore-Frontend-Angular
```

2. Install dependencies:
```bash
npm install
```

## Configuration

The application is configured to connect to the following backend APIs:

- **Account API**: `http://localhost:54850/api`
- **Transfer API**: `http://localhost:54849/api`
- **Fee API**: `http://localhost:62483/api`

These URLs are defined in `app/js/app.js` in the `API_CONFIG` constant. Update these URLs if your backend APIs are running on different ports.

## Running the Application

### Option 1: Using Docker (Recommended)

1. Build and run with Docker Compose:
```bash
docker-compose up --build
```

2. Open your browser and navigate to:
```
http://localhost:8080
```

### Option 2: Using Node.js (Development)

1. Start the development server:
```bash
npm start
```

2. Open your browser and navigate to:
```
http://localhost:8080
```

The application will automatically open in your default browser.

### Option 3: Docker Only (Frontend)

1. Build the Docker image:
```bash
docker build -t bankmore-frontend-angular .
```

2. Run the container:
```bash
docker run -p 8080:80 bankmore-frontend-angular
```

**Note**: When running with Docker, make sure your backend APIs are accessible. The nginx configuration is set up to proxy API calls to the backend services.

## Project Structure

```
BankMore-Frontend-Angular/
├── app/
│   ├── css/
│   │   └── app.css                 # Custom styles
│   ├── js/
│   │   ├── app.js                  # Main application module and routing
│   │   ├── controllers/            # AngularJS controllers
│   │   │   ├── dashboardController.js
│   │   │   ├── feeController.js
│   │   │   ├── homeController.js
│   │   │   ├── loginController.js
│   │   │   ├── navController.js
│   │   │   ├── profileController.js
│   │   │   ├── registerController.js
│   │   │   └── transferController.js
│   │   └── services/               # AngularJS services
│   │       ├── accountService.js
│   │       ├── authService.js
│   │       ├── feeService.js
│   │       └── transferService.js
│   ├── views/                      # HTML templates
│   │   ├── dashboard.html
│   │   ├── fees.html
│   │   ├── home.html
│   │   ├── login.html
│   │   ├── profile.html
│   │   ├── register.html
│   │   └── transfer.html
│   └── index.html                  # Main HTML file
├── package.json
└── README.md
```

## API Integration

The frontend integrates with three main backend APIs:

### Account API (Port 54850)
- `POST /api/Account/register` - Create new account
- `POST /api/Account/login` - User authentication
- `GET /api/Account/balance` - Get current balance
- `GET /api/Account/exists/{accountNumber}` - Check if account exists
- `PUT /api/Account/deactivate` - Deactivate account

### Transfer API (Port 54849)
- `POST /api/Transfer` - Create money transfer

### Fee API (Port 62483)
- `GET /api/Fee/{accountNumber}` - Get fees by account
- `GET /api/Fee/fee/{id}` - Get specific fee details

## Authentication

The application uses JWT (JSON Web Tokens) for authentication:

- Tokens are stored in localStorage
- Automatic token validation on protected routes
- Automatic logout on token expiration
- Route guards for authenticated pages

## Features Overview

### Home Page
- Landing page with feature highlights
- Login and registration links
- Responsive hero section

### Authentication
- **Login**: Support for both account number and CPF
- **Registration**: Create new accounts with CPF validation
- **Security**: JWT token-based authentication

### Dashboard
- Account balance display
- Quick action buttons
- Security tips
- Account summary

### Transfers
- Real-time account validation
- Amount validation (max R$ 10,000)
- Transfer confirmation
- Balance checking

### Fees
- Fee history display
- Monthly summaries
- Fee categorization
- Total calculations

### Profile
- Account information display
- Security settings
- Account deactivation option

## Security Features

- JWT token authentication
- Input validation and sanitization
- CPF format validation
- Password requirements
- Secure logout functionality
- Protected routes

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development

### Adding New Features

1. Create new controller in `app/js/controllers/`
2. Create corresponding service in `app/js/services/`
3. Add HTML template in `app/views/`
4. Update routing in `app/js/app.js`
5. Add navigation links in `app/index.html`

### Styling

The application uses:
- Bootstrap 5.3.0 for UI components
- Bootstrap Icons for iconography
- Custom CSS in `app/css/app.css`

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure backend APIs have CORS configured for `http://localhost:8080`

2. **API Connection Issues**: 
   - Verify backend APIs are running
   - Check API URLs in `app/js/app.js`
   - Ensure correct ports are configured

3. **Authentication Issues**:
   - Clear localStorage: `localStorage.clear()`
   - Check JWT token validity
   - Verify backend authentication endpoints

4. **Build Issues**:
   - Delete `node_modules` and run `npm install`
   - Check Node.js version compatibility

## Contributing

1. Follow AngularJS 1.x best practices
2. Maintain consistent code formatting
3. Add appropriate error handling
4. Update documentation for new features

## License

This project is part of the BankMore banking system.
