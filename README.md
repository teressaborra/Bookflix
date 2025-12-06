# 🎬 Bookflix - Advanced Movie Booking System

A comprehensive movie booking platform built with React, TypeScript, and NestJS featuring advanced booking capabilities, dynamic pricing, and professional UI design.

## ✨ Features

### 🎯 Core Features
- **User Authentication & Authorization** - Secure login/register with JWT
- **Movie Management** - Browse movies with detailed information
- **Theater Management** - Professional theater listings with amenities
- **Advanced Booking System** - Seat selection with real-time availability
- **Admin Dashboard** - Comprehensive management panel

### 🚀 Advanced Features
- **Dynamic Pricing** - AI-powered pricing based on demand and occupancy
- **Loyalty Rewards System** - Points-based rewards and tier benefits
- **Smart Recommendations** - Personalized movie suggestions
- **Group Bookings** - Special rates for group reservations
- **Movie Reviews & Ratings** - User-generated content system
- **Seat Recommendations** - AI-suggested optimal seating
- **Real-time Analytics** - Revenue and booking insights
- **Multi-language Support** - Support for regional languages
- **Accessibility Features** - Wheelchair access and hearing loop support
- **Professional UI/UX** - Modern, responsive design

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **React Router** for navigation
- **Axios** for API calls

### Backend
- **NestJS** with TypeScript
- **TypeORM** for database management
- **JWT** for authentication
- **PostgreSQL/SQLite** database
- **RESTful API** architecture

## 📁 Project Structure

```
bookflix/
├── frontend/          # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── api/           # API service layer
│   │   ├── context/       # React context providers
│   │   └── types/         # TypeScript type definitions
│   └── public/
├── backend/           # NestJS backend application
│   ├── src/
│   │   ├── auth/          # Authentication module
│   │   ├── movies/        # Movie management
│   │   ├── theaters/      # Theater management
│   │   ├── bookings/      # Booking system
│   │   ├── users/         # User management
│   │   ├── analytics/     # Analytics & reporting
│   │   ├── loyalty/       # Loyalty system
│   │   └── dynamic-pricing/ # Dynamic pricing engine
│   └── test/
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL (optional, SQLite works for development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/teressaborra/Bookflix.git
   cd Bookflix
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   
   # Create environment file
   cp .env.example .env
   # Edit .env with your database credentials
   
   # Run migrations (if needed)
   npm run migration:run
   
   # Start development server
   npm run start:dev
   ```
   The backend will run on `http://localhost:3000`.

3. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   
   # Start development server
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`.

## 📱 Usage

### For Users
1. **Register/Login** - Create account or sign in
2. **Browse Movies** - Explore available movies and showtimes
3. **Select Theater** - Choose from available theater locations
4. **Book Tickets** - Select seats and complete booking
5. **Manage Bookings** - View and manage your reservations
6. **Earn Rewards** - Collect loyalty points with each booking

### For Admins
1. **Admin Dashboard** - Access comprehensive management panel
2. **Add Movies** - Upload new movies with detailed information
3. **Manage Theaters** - Add theaters with amenities and accessibility features
4. **Create Shows** - Schedule movie showtimes
5. **Analytics** - View revenue and booking analytics
6. **Dynamic Pricing** - Monitor and adjust pricing strategies

## 🎨 UI Features

- **Professional Design** - Modern, cinema-industry inspired interface
- **Responsive Layout** - Works seamlessly on all devices
- **Dark Theme** - Elegant dark mode design
- **Smooth Animations** - Polished user interactions
- **Accessibility** - WCAG compliant design

## 🔧 API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration

### Movies
- `GET /movies` - Get all movies
- `GET /movies/:id` - Get movie details
- `POST /movies` - Add new movie (Admin)

### Theaters
- `GET /theaters` - Get all theaters
- `POST /theaters` - Add new theater (Admin)

### Bookings
- `POST /bookings` - Create booking
- `GET /users/me/bookings` - Get user bookings

### Analytics
- `GET /analytics/revenue` - Revenue analytics (Admin)
- `GET /dynamic-pricing/shows` - Pricing data (Admin)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Teresa Borra**
- GitHub: [@teressaborra](https://github.com/teressaborra)

## 🙏 Acknowledgments

- Inspired by modern cinema booking platforms
- Built with love for movie enthusiasts
- Special thanks to the open-source community

---

⭐ Star this repository if you found it helpful!
