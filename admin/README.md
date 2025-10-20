# PetZy Admin Panel

A separate Next.js 15 admin dashboard for managing the PetZy platform. This project handles partner management, customer management, promotions, transactions, and more.

## 🚀 Tech Stack

- **Framework:** Next.js 15.5.3 with Turbopack
- **React:** 19.1.0
- **UI Library:** Ant Design 5.27.3
- **Icons:** Lucide React 0.544.0
- **Styling:** Tailwind CSS 4
- **Notifications:** SweetAlert2 11.23.0
- **Real-time Chat:** Socket.io-client 4.8.1
- **TypeScript:** 5.x
- **Font:** Kanit (Google Fonts)

## 📋 Prerequisites

- Node.js 18+ or 20+
- npm, yarn, or pnpm

## 🛠️ Installation

1. **Navigate to the admin directory:**
   ```bash
   cd admin
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the admin directory:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
NEXT_PUBLIC_USE_API_MODE=true

# Socket.io Configuration (for chat)
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

### Development Mode

The admin panel runs on **port 3002** by default to avoid conflicts with the partner frontend (port 3000).

## 🚦 Running the Project

### Development Mode
```bash
npm run dev
```

This will start the admin panel at [http://localhost:3002](http://localhost:3002)

### Production Build
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

## 📁 Project Structure

```
admin/
├── public/                 # Static assets
│   ├── assets/
│   │   └── images/        # Images (logo, background, icons)
│   └── suppress-warnings.js
├── src/
│   ├── app/               # Next.js 15 App Router
│   │   ├── chats/         # Admin chat management
│   │   ├── customers/     # Customer management
│   │   ├── dashboard/     # Main dashboard
│   │   ├── login/         # Admin login
│   │   ├── partners/      # Partner management
│   │   ├── petzy-app/     # App banner management
│   │   ├── policy/        # Privacy policy upload
│   │   ├── profile/       # Admin profile settings
│   │   ├── promotions/    # Promotion management
│   │   ├── transactions/  # Payment history & payouts
│   │   ├── layout.tsx     # Root layout
│   │   ├── page.tsx       # Home page (redirects to login)
│   │   └── globals.css    # Global styles
│   ├── components/
│   │   ├── admin/
│   │   │   └── shared/
│   │   │       └── Sidebar.tsx  # Admin navigation sidebar
│   │   └── first_page/
│   │       └── logo.tsx   # PetZy logo component
│   ├── config/
│   │   └── api.ts         # API configuration
│   ├── hooks/
│   │   ├── useChat.ts     # Chat functionality hook
│   │   └── useApprovalStatus.ts
│   └── utils/
│       ├── api.ts         # API utility functions
│       ├── apiErrorHandler.ts  # Error handling
│       └── validation.ts  # Form validation
├── next.config.ts         # Next.js configuration
├── tsconfig.json          # TypeScript configuration
├── tailwind.config.ts     # Tailwind CSS configuration
└── package.json           # Dependencies and scripts
```

## 🎯 Features

### 1. **Dashboard** (`/dashboard`)
- Overview of partners and customers
- Booking statistics
- Activity charts
- Calendar view
- Recent messages

### 2. **Partner Management** (`/partners`)
- View all partners
- Manage partner accounts
- Approval workflow
- Export data

### 3. **Customer Management** (`/customers`)
- View all customers
- Filter by new/all customers
- Search by name, email, phone
- Export customer data
- View customer details

### 4. **Petzy App Management** (`/petzy-app`)
- Upload app banners
- Manage main page content
- Image gallery

### 5. **Promotions** (`/promotions`)
- Create/edit promotions
- Active/inactive status
- Date range configuration
- Discount percentage

### 6. **Transactions** (`/transactions`)
- Customer payment history
- Partner payout tracking
- Status management (Pending, Success, Failed)
- Export transaction data

### 7. **Chat** (`/chats`)
- Real-time messaging
- Socket.io integration
- Admin-Partner communication

### 8. **Privacy Policy** (`/policy`)
- Upload privacy policy documents
- Support for images and PDFs
- Public display on partner portal

### 9. **Profile** (`/profile`)
- Admin account settings
- Profile customization

## 🔐 Authentication

### Admin Login Flow

1. Navigate to `/login`
2. Enter email and password
3. System validates admin role
4. Redirects to `/dashboard` on success

### Preview Mode

If `USE_API_MODE` is `false`, the app runs in preview mode with mock data.

### API Mode

Set `NEXT_PUBLIC_USE_API_MODE=true` to connect to the backend API.

## 🎨 UI Components

### Sidebar Navigation
- Fixed left sidebar (250px width)
- Blue gradient background (#2C62D8)
- Active page indicator
- Logout button

### Common Patterns
- Ant Design tables with pagination
- Search with debouncing
- File upload with preview
- Modal dialogs (SweetAlert2)
- Loading states (Spin component)
- Date pickers for filtering

## 🌐 API Integration

### Base URL Configuration
```typescript
// src/config/api.ts
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
export const USE_API_MODE = process.env.NEXT_PUBLIC_USE_API_MODE === 'true';
```

### Authentication Headers
All API requests include:
```typescript
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json',
}
```

### Error Handling
- Centralized error handler in `src/utils/apiErrorHandler.ts`
- Automatic token refresh on 401 errors
- User-friendly error messages with SweetAlert2

## 📱 Responsive Design

- Desktop-first design
- Minimum screen width: 1280px recommended
- Mobile support can be added as needed

## 🔄 Real-time Features

### Chat System
- Socket.io for real-time messaging
- Auto-reconnect on connection loss
- Message history persistence

## 🛡️ Security

- JWT token authentication
- LocalStorage for token storage
- Automatic logout on token expiration
- Admin-only access control
- CORS configuration required on backend

## 🐛 Known Issues

### React 19 Compatibility
- Ant Design 5.27.3 officially supports React 16-18
- Works fine with React 19, compatibility warnings are suppressed
- See `WarningSupressor.tsx` for implementation

### Image Loading
- Next.js Image component requires proper CORS headers from backend
- Configure `next.config.ts` with your backend domain

## 📦 Build and Deployment

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

### Environment Variables for Production
```env
NEXT_PUBLIC_API_BASE_URL=https://api.yourbackend.com
NEXT_PUBLIC_USE_API_MODE=true
NEXT_PUBLIC_SOCKET_URL=https://api.yourbackend.com
```

## 🔗 Related Projects

- **Partner Frontend:** `../partner/` - Partner portal (port 3000)
- **Backend API:** Separate Node.js/Express backend (port 3001)

## 📝 Development Notes

### Port Configuration
- Admin runs on **port 3002** (configurable in `package.json`)
- Partner frontend uses port 3000
- Backend API uses port 3001

### Code Style
- ESLint with Next.js TypeScript rules
- Tailwind CSS for styling
- Inline styles for dynamic colors

### Adding New Pages
1. Create page in `src/app/[pagename]/page.tsx`
2. Add route to Sidebar in `src/components/admin/shared/Sidebar.tsx`
3. Protect route with authentication check
4. Follow existing page patterns for consistency

## 🤝 Contributing

1. Create feature branch from `main`
2. Follow existing code patterns
3. Test authentication flow
4. Update README if adding new features

## 📄 License

Private project - All rights reserved

## 👥 Team

- **Frontend:** Next.js 15 + React 19 + Ant Design 5
- **Backend:** Node.js + Express + PostgreSQL
- **Design:** Figma reference designs

## 📞 Support

For issues or questions, contact the development team.

---

**Last Updated:** October 19, 2025  
**Version:** 1.0.0  
**Status:** ✅ Separated from partner project - Ready for independent deployment

