# CloverArena Frontend

A modern, responsive e-commerce frontend built with React, TypeScript, and Vite for [CloverArena](https://cloverarena.com) - an online store specializing in football jerseys and related merchandise.

## 🚀 Features

### User Features
- **Authentication**
  - OTP-based login/signup via SMS
  - Password-based authentication
  - Forgot password functionality
  - JWT token authentication (7-day session)
  - Different layouts for guest, user, and admin roles

- **Product Browsing**
  - Product catalog with search functionality
  - Search autocomplete with suggestions
  - Category and subcategory navigation
  - Product filtering by categories and sizes
  - Product carousel for featured items
  - Lazy loading for optimized performance
  - Breadcrumb navigation on product pages
  - Product details with image viewing
  - Size variant selection

- **Shopping Experience**
  - Real-time cart management synced with backend
  - Wishlist functionality
  - Popular search suggestions (generated from backend analytics)
  - Delivery availability checker
  - Size guide modal
  - Cart validation alerts

- **Checkout & Orders**
  - Multi-step checkout process
  - Address management
  - UPI payment integration (PhonePe/Google Pay/Paytm)
  - Order confirmation with email notification
  - Order history and tracking
  - Order details page with status tracking
  - Order cancellation (returns via customer service)

- **User Account**
  - Profile management
  - Update personal details (name, email, phone)
  - Password change
  - Address management
  - Order history
  - Wishlist management

- **Static Pages**
  - About Us
  - Contact Us
  - Privacy Policy
  - Return Policy
  - Shipping Information
  - Terms & Conditions

### Admin Features
- **Dashboard**
  - Analytics and statistics
  - Customer overview

- **Product Management**
  - Add/edit/delete products
  - Category and subcategory management
  - Banner management
  - Price settings

- **Order Management**
  - View all orders
  - Update order status
  - Order details

- **Customer Management**
  - View customer details
  - Customer orders
  - Customer cart and wishlist
  - Customer addresses

### UI/UX Features
- Fully responsive design (mobile, tablet, desktop)
- Loading skeletons for better UX
- Toast notifications for user feedback
- Mobile bottom navigation
- Error handling with user-friendly messages
- Intersection Observer for lazy loading
- Image carousel for banners
- Social media integration

## 🛠️ Tech Stack

- **Framework:** React 19.1.0
- **Build Tool:** Vite 6.3.5
- **Language:** TypeScript 5.8.3
- **Routing:** React Router DOM 7.6.2
- **State Management:** Redux Toolkit 2.8.2
- **Styling:** Tailwind CSS 4.1.10
- **Form Handling:** React Hook Form 7.60.0
- **HTTP Client:** Axios 1.10.0
- **Notifications:** Sonner 2.0.7
- **Icons:** Lucide React 0.525.0
- **Deployment:** Docker + Nginx on AWS EC2
- **CI/CD:** GitHub Actions

## 📋 Prerequisites

- Node.js v22.15.0 or higher
- npm or yarn
- Backend API running (CloverArena Backend)
- AWS S3 bucket for product images

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/rickylaikhuram/ecommerce-frontend.git
cd ecommerce-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

Create a `.env` file in the root directory:
```env
VITE_BACKEND_URL=http://localhost:5000
VITE_S3_BASE_URL=https://your-s3-bucket-url
```

4. Start the development server:
```bash
npm run dev
```

The application will start on `http://localhost:5173`

## 🔐 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_BACKEND_URL` | Backend API base URL | `https://example.com` |
| `VITE_S3_BASE_URL` | AWS S3 bucket base URL for product images | `https://yourbucketname.s3.yourregion.amazonaws.com/` |

**Note:** Environment variables must be set during the build process as Vite embeds them at build time.

## 🏗️ Project Structure

```
src/
├── assets/          # Static assets (logo, images)
├── components/      # React components
│   ├── admin/       # Admin-specific components
│   ├── cart/        # Shopping cart components
│   ├── checkout/    # Checkout flow components
│   ├── common/      # Shared/reusable components
│   ├── header/      # Header and navigation components
│   ├── layout/      # Layout components
│   ├── products/    # Product display components
│   ├── section/     # Homepage sections
│   └── ui/          # Base UI components (Button, Badge)
├── hooks/           # Custom React hooks
├── layout/          # Main layout wrappers
├── pages/           # Page components
│   ├── admin/       # Admin panel pages
│   ├── auth/        # Authentication pages
│   ├── client/      # User account pages
│   ├── error/       # Error pages
│   ├── home/        # Homepage
│   └── static/      # Static content pages
├── redux/           # Redux store and slices
│   ├── hook/        # Redux hooks
│   └── slice/       # Redux slices (auth, cart, wishlist, etc.)
├── routes/          # Route configurations
├── services/        # API service functions
├── types/           # TypeScript type definitions
└── utils/           # Utility functions
```

## 🔄 Available Scripts

```bash
# Development
npm run dev          # Start development server with hot reload

# Production
npm run build        # Build for production (TypeScript + Vite)
npm run preview      # Preview production build locally
npm start           # Serve production build (using serve package)

# Code Quality
npm run lint         # Run ESLint
```

## 🚀 Deployment

The application is deployed on AWS EC2 using Docker and Nginx, with automated CI/CD via GitHub Actions.

### Deployment Architecture
- **Platform:** AWS EC2
- **Container:** Docker multi-stage build
- **Web Server:** Nginx (Alpine)
- **CI/CD:** GitHub Actions
- **Container Registry:** Docker Hub

### Nginx Configuration
The application uses a custom Nginx configuration that:
- Handles React Router SPA routing with fallback to `index.html`
- Caches static assets (JS, CSS, images) for 1 year
- Includes security headers (X-Frame-Options, X-Content-Type-Options, X-XSS-Protection)
- Serves on port 80

### Automated Deployment Flow
1. Push code to `main` branch
2. GitHub Actions builds the application with environment variables
3. Multi-architecture Docker image is created (amd64, arm64)
4. Image is pushed to Docker Hub
5. Infrastructure repository is triggered for deployment
6. EC2 instance pulls and deploys the new image automatically

### Build Arguments
The Docker build accepts the following build arguments:
- `VITE_BACKEND_URL` - Backend API URL
- `VITE_S3_BASE_URL` - S3 bucket URL for images

## 🎨 Key Features Implementation

### State Management
- **Redux Toolkit** for global state management
- Separate slices for:
  - Authentication (`auth.ts`)
  - Shopping cart (`cart.ts`)
  - Wishlist (`wishlist.ts`)
  - User profile (`userProfile.ts`)
  - Categories (`categories.ts`)
  - Addresses (`address.ts`)
  - Delivery info (`delivery.ts`)

### Authentication Flow
1. User enters phone number
2. OTP is sent via SMS
3. User enters OTP for verification
4. JWT token is stored (7-day validity)
5. Token is sent with each API request
6. Different UI layouts for guest/user/admin roles

### Cart Management
- Cart stored in Redux and synced with backend immediately
- Real-time stock validation
- Quantity updates
- Stock reservation system
- Cart persistence across sessions

### Payment Integration
- UPI payment via custom CloverShop gateway
- Supports PhonePe, Google Pay, and Paytm
- QR code payment flow
- Webhook-based payment confirmation
- Automatic order status updates

### Performance Optimizations
- Lazy loading with Intersection Observer
- Image lazy loading
- Component code splitting (Vite automatic)
- Static asset caching (1-year cache via Nginx)
- Skeleton loaders for better perceived performance

### Error Handling
- Error boundary for React component errors
- API error handling with toast notifications
- Generic error messages for backend downtime
- 404 error page for invalid routes
- Form validation errors with React Hook Form

### Responsive Design
- Mobile-first approach
- Responsive breakpoints for all screen sizes
- Mobile bottom navigation
- Adaptive layouts for desktop/tablet/mobile
- Touch-friendly UI elements

## 📱 Route Protection

The application implements three types of route protection:

1. **Guest Routes** - Accessible only when not authenticated
   - Login pages
   - Signup pages
   - OTP verification

2. **User Routes** - Requires user authentication
   - Profile management
   - Order history
   - Wishlist
   - Addresses

3. **Admin Routes** - Requires admin privileges (set in database)
   - Dashboard
   - Product management
   - Order management
   - Customer management

Protected routes redirect to error page if accessed without proper authorization.

## 🖼️ Image Handling

- Product images are loaded from AWS S3 via `VITE_S3_BASE_URL`
- Logo is bundled with the application
- Fallback placeholder for failed image loads: `https://via.placeholder.com/1200x400/6b7280/ffffff?text=Image+Not+Found`
- Optimized image loading with lazy loading

## 🔍 Search Functionality

- Search autocomplete with suggestions
- Popular searches generated from backend (based on most sold products)
- Search as you type with debouncing
- Product filtering by categories and sizes
- Breadcrumb navigation for better UX

## ⚠️ Important Notes

### Environment Variables
Environment variables must be set during the build process, not at runtime. Vite embeds these at build time into the static bundle.

### Token Storage
JWT tokens are stored with a 7-day validity period. The "Remember me" option is available but all sessions expire after 7 days regardless.

### Payment Flow
Users are redirected to the CloverShop payment gateway for UPI payments. After successful payment, they are redirected back to the order confirmation page.

### Cart Sync
The shopping cart is immediately synced with the backend on every action (add, update, remove) to ensure consistency and enable stock reservation.

### Admin Access
Admin privileges are controlled at the database level via an `isAdmin` flag. Only users with this flag set to true can access admin routes.

### Image Optimization
While lazy loading is implemented, future updates will include more advanced image optimization techniques.

## 🔜 Upcoming Features

- Product reviews and ratings
- Related products recommendations
- Recently viewed products
- Guest checkout
- Price filtering
- Product return functionality (currently via customer service)
- Newsletter subscription
- Advanced SEO optimization
- PWA support
- Dark mode

## 🤝 Contributing

This is a proprietary project. For contributions or issues, please contact the author.

## 📄 License

© 2025 Ricky Laikhuram. All Rights Reserved.

This software is proprietary and confidential.
Licensed for use by CloverArena.
Available for testing and evaluation purposes only.
Commercial use, redistribution, or deployment for business purposes requires explicit written permission from the author.

## 👨‍💻 Author

**Ricky Laikhuram**
- GitHub: [@rickylaikhuram](https://github.com/rickylaikhuram)
- Project Link: [https://github.com/rickylaikhuram/ecommerce-frontend](https://github.com/rickylaikhuram/ecommerce-frontend)

## 🌐 Live Site

Visit the live site at [https://cloverarena.com](https://cloverarena.com)

---

## 📞 Support

For issues or questions, please contact customer support or open an issue on the GitHub repository.

