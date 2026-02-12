# 🍔 Feedo - Food Delivery Mobile Application

A full-stack food delivery mobile application built with React Native (Expo) and NestJS, featuring real-time order tracking, restaurant management, and a premium dark-themed UI.


## 📱 Overview

Feedo is a modern food delivery platform that connects customers with their favorite restaurants. The application provides a seamless experience for ordering food, tracking deliveries in real-time, and managing restaurant operations.

## ✨ Features

### 👤 For Customers
- **User Authentication** - Secure login and registration with JWT-based authentication
- **Role-Based Access** - Support for Customer, Restaurant Owner, and Driver roles
- **Browse Restaurants** - Discover restaurants with advanced search and filtering
  - Sort by ratings (high to low / low to high)
  - Browse all restaurants screen
  - Category-based filtering
- **Menu Exploration** - View detailed menus with categories and item descriptions
- **Smart Cart System** - Add items to cart with real-time price calculations
- **Order Management** - Place orders and track order history
  - Modern orders UI with gradient status bars
  - Filter orders by status (All, Delivered, In Transit, Cancelled)
  - Order tracking with real-time updates
  - Reorder functionality
  - Rate completed orders
- **Real-Time Tracking** - Live order status updates using WebSockets
- **Comprehensive User Profiles** - Complete profile management system
  - Edit profile with image upload
  - Global profile sync across app
  - Profile picture displayed in home screen header
- **Address Management** - Save and manage delivery addresses
  - Add multiple addresses (Home, Work, Other)
  - Set default delivery address
  - Edit and delete saved addresses
- **Payment Methods** - Manage payment options
  - Save credit/debit cards, UPI, and wallets
  - Set default payment method
  - Secure payment information storage
- **Notification Settings** - Customize notification preferences
  - Order update notifications
  - Marketing and promotional offers
  - Multiple channels: Push, Email, SMS
- **Reviews & Ratings** - Rate restaurants and view community feedback
- **Offers & Discounts** - Access special deals and promotional offers
  - Best offers screen with discount sorting
  - Offer details and redemption

### 🍽️ For Restaurant Owners
- **Restaurant Dashboard** - Comprehensive admin panel for restaurant management
- **Menu Management** - Add, edit, and remove menu items and categories
- **Order Processing** - Receive and manage incoming orders
- **Real-Time Notifications** - Instant alerts for new orders
- **Analytics** - View performance metrics and insights

### 🚗 For Delivery Drivers
- **Order Assignment** - Accept and manage delivery requests
- **Navigation Support** - Integrated tracking for efficient deliveries
- **Earnings Overview** - Track completed deliveries and earnings

### 🎨 Design & UI/UX
- **Premium Dark Theme** - Modern "Midnight Gourmet" aesthetic
- **Glassmorphism Effects** - Sleek blur and transparency effects
- **Smooth Animations** - React Native Reanimated for fluid transitions
- **Responsive Design** - Optimized for all screen sizes
- **NativeWind Styling** - Tailwind CSS for React Native

## 🛠️ Tech Stack

### Frontend (Mobile App)
- **Framework:** React Native with Expo SDK 54
- **Language:** TypeScript
- **Navigation:** React Navigation (Stack & Bottom Tabs)
- **Styling:** NativeWind (Tailwind CSS for React Native)
- **State Management:** React Context API
- **HTTP Client:** Axios
- **Real-Time:** Socket.IO Client
- **Animations:** React Native Reanimated
- **UI Components:**
  - Expo Linear Gradient
  - Expo Image Picker
  - Expo Vector Icons
  - AsyncStorage for local data persistence

### Backend (API Server)
- **Framework:** NestJS (Node.js)
- **Language:** TypeScript
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** Passport.js with JWT Strategy
- **Real-Time:** Socket.IO & WebSockets
- **Password Hashing:** Bcrypt
- **API Documentation:** Swagger/OpenAPI
- **Validation:** Class Validator & Class Transformer
- **Testing:** Jest & Supertest

### Backend Modules
- **Auth Module** - User authentication and authorization
- **Users Module** - User profile management
- **Restaurants Module** - Restaurant data and operations
- **Menu Module** - Menu items and categories
- **Orders Module** - Order processing and management
- **Reviews Module** - Customer reviews and ratings
- **Offers Module** - Promotional offers and discounts
- **Events Module** - Real-time event handling with WebSockets

## 📁 Project Structure

```
FoodieExpress/
├── backend/                 # NestJS Backend API
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── users/          # User management
│   │   ├── restaurants/    # Restaurant operations
│   │   ├── menu/           # Menu management
│   │   ├── orders/         # Order processing
│   │   ├── reviews/        # Reviews & ratings
│   │   ├── offers/         # Promotions & discounts
│   │   ├── events/         # WebSocket events
│   │   ├── app.module.ts   # Root module
│   │   └── main.ts         # Entry point
│   └── package.json
│
├── frontend/               # React Native Mobile App
│   ├── src/
│   │   ├── auth/          # Authentication screens
│   │   ├── home/          # Home screen & categories
│   │   ├── restaurant/    # Restaurant details & listing
│   │   ├── menu/          # Menu browsing
│   │   ├── cart/          # Shopping cart & checkout
│   │   ├── profile/       # User profile & settings
│   │   │   ├── ProfileScreen.tsx
│   │   │   ├── EditProfileScreen.tsx
│   │   │   ├── YourOrdersScreen.tsx
│   │   │   ├── ManageAddressesScreen.tsx
│   │   │   ├── PaymentMethodsScreen.tsx
│   │   │   └── NotificationsSettingsScreen.tsx
│   │   ├── driver/        # Driver interface
│   │   ├── restaurant-admin/ # Restaurant dashboard
│   │   ├── navigation/    # Navigation setup
│   │   └── utils/         # Utility functions & context
│   │       ├── UserContext.tsx
│   │       ├── profileUtils.ts
│   │       ├── searchUtils.ts
│   │       └── CartContext.tsx
│   ├── App.tsx            # Root component
│   └── package.json
│
├── images/                 # App assets and logos
└── package.json           # Root package.json

```

## 🚀 Getting Started

### Prerequisites

Before running the application, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (v5 or higher) - Running locally or MongoDB Atlas
- **Expo CLI** - `npm install -g expo-cli`
- **Git**

For mobile development:
- **iOS:** Xcode (macOS only) or Expo Go app
- **Android:** Android Studio or Expo Go app

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ayush08k/Feedo---Food-Delivery-Mobile-Application.git
   cd Feedo---Food-Delivery-Mobile-Application
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies (optional)
   npm install

   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

### Backend Setup

1. **Configure environment variables**
   
   Create a `.env` file in the `backend` directory:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/foodie-express
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=7d
   
   # Server Configuration
   PORT=3000
   NODE_ENV=development
   ```

2. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   
   # Or use MongoDB Atlas connection string in .env
   ```

3. **Run the backend server**
   ```bash
   cd backend
   
   # Development mode with hot reload
   npm run start:dev
   
   # Production mode
   npm run build
   npm run start:prod
   ```

   The backend API will be available at `http://localhost:3000`
   
   Swagger API documentation: `http://localhost:3000/api`

### Frontend Setup

1. **Configure API endpoint**
   
   Update the API base URL in your frontend code (usually in `src/utils` or a config file):
   ```typescript
   // For iOS Simulator
   const API_URL = 'http://localhost:3000';
   
   // For Android Emulator
   const API_URL = 'http://10.0.2.2:3000';
   
   // For physical device (use your computer's IP)
   const API_URL = 'http://192.168.x.x:3000';
   ```

2. **Start the Expo development server**
   ```bash
   cd frontend
   
   # Start Expo
   npm start
   
   # Or run directly on platform
   npm run android   # For Android
   npm run ios       # For iOS
   npm run web       # For Web
   ```

3. **Run on device/emulator**
   - Scan the QR code with Expo Go app (iOS/Android)
   - Press `a` for Android emulator
   - Press `i` for iOS simulator
   - Press `w` for web browser

### Quick Start (All Services)

From the root directory, you can start both backend and frontend:

```bash
# Terminal 1 - Backend
npm run start:backend

# Terminal 2 - Frontend
npm run start:frontend
```

## 🧪 Testing

### Backend Tests
```bash
cd backend

# Run unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:cov

# Run e2e tests
npm run test:e2e
```

## 📦 Building for Production

### Backend
```bash
cd backend
npm run build
npm run start:prod
```

### Frontend

**For Android (APK):**
```bash
cd frontend
eas build --platform android
```

**For iOS (IPA):**
```bash
cd frontend
eas build --platform ios
```

Note: You'll need an Expo account and EAS CLI configured for production builds.

## 🔑 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `GET /auth/profile` - Get current user profile

### Restaurants
- `GET /restaurants` - Get all restaurants
- `GET /restaurants/:id` - Get restaurant details
- `POST /restaurants` - Create restaurant (Owner only)
- `PATCH /restaurants/:id` - Update restaurant
- `DELETE /restaurants/:id` - Delete restaurant

### Menu
- `GET /menu/restaurant/:id` - Get restaurant menu
- `POST /menu` - Add menu item
- `PATCH /menu/:id` - Update menu item
- `DELETE /menu/:id` - Delete menu item

### Orders
- `GET /orders` - Get user orders
- `POST /orders` - Create new order
- `PATCH /orders/:id` - Update order status
- `GET /orders/:id` - Get order details

### Reviews
- `GET /reviews/restaurant/:id` - Get restaurant reviews
- `POST /reviews` - Submit review
- `PATCH /reviews/:id` - Update review
- `DELETE /reviews/:id` - Delete review

For complete API documentation, visit: `http://localhost:3000/api`

## 🎯 Features Roadmap

### ✅ Completed
- [x] User authentication and authorization
- [x] Restaurant browsing with search and filtering
- [x] Cart management system
- [x] Order placement and tracking
- [x] Profile management with image upload
- [x] Address management (CRUD operations)
- [x] Payment methods management
- [x] Notification settings
- [x] Modern orders UI with status tracking
- [x] Best offers section
- [x] Global profile synchronization
- [x] Restaurant sorting by ratings

### 🚧 In Progress / Planned
- [ ] Payment Gateway Integration (Stripe/Razorpay)
- [ ] Push Notifications (FCM/APNs)
- [ ] Google Maps Integration for live tracking
- [ ] Advanced Analytics Dashboard
- [ ] Multi-language Support (i18n)
- [ ] Dark/Light Theme Toggle
- [ ] Voice Search
- [ ] Loyalty Points System
- [ ] Social Sharing
- [ ] Chat support with restaurants
- [ ] Scheduled orders
- [ ] Favorite restaurants and dishes

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the UNLICENSED License - see the LICENSE file for details.

## 👨‍💻 Author

**Ayush Kumar**
- GitHub: [@Ayush08k](https://github.com/Ayush08k)

## 🙏 Acknowledgments

- NestJS for the amazing backend framework
- Expo team for the excellent React Native development platform
- The open-source community for incredible tools and libraries

## 📧 Support

For support, email ayushkumar2467@gmail.com or open an issue in the GitHub repository.

---

Made with ❤️ by Ayush Kumar
