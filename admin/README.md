# 🐾 PetZy Admin Panel

A comprehensive Next.js admin dashboard for managing the PetZy platform. This panel handles partner management, customer management, promotions, transactions, real-time chat, and more.

## 🌟 Features

### Admin Management
- **Dashboard**: Overview of partners, customers, bookings, and statistics
- **Partner Management**: View, approve, and manage partner accounts
- **Customer Management**: View and manage customer accounts
- **Promotion Management**: Create and manage promotional campaigns
- **Transaction Management**: Track payments and payouts
- **Real-time Chat**: Communicate with partners via WebSocket
- **Policy Management**: Upload and manage privacy policies
- **App Banner Management**: Manage PetZy app banners

## 🚀 Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | `15.5.3` | React framework with App Router |
| **React** | `19.1.0` | Frontend library |
| **TypeScript** | `^5.0.0` | Type safety |
| **Tailwind CSS** | `^4.0.0` | Utility-first CSS framework |
| **Ant Design** | `^5.27.3` | UI component library |
| **SweetAlert2** | `^11.23.0` | Beautiful alert dialogs |
| **Socket.io Client** | `^4.8.1` | Real-time chat |
| **Lucide React** | `^0.544.0` | Icon library |

## 📋 Prerequisites

- **Node.js**: `18.0.0` or higher (recommended: `20.x.x`)
- **Package Manager**: npm, yarn, or pnpm
- **Backend API**: NestJS backend running on `http://localhost:3001`
- **Git**: For version control

## 🛠️ Installation & Setup

### 1. Navigate to Admin Directory

```bash
cd next_js_petzy/admin
```

### 2. Install Dependencies

```bash
# Using npm
npm install

# Using yarn
yarn install

# Using pnpm (recommended)
pnpm install
```

### 3. Environment Setup

Create a `.env.local` file in the `admin` directory:

```env
# Backend API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001

# API Mode (set to true to use real API, false for mock data)
NEXT_PUBLIC_USE_API_MODE=true

# Socket.io Configuration (for real-time chat)
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

### 4. Run Development Server

```bash
# Using npm
npm run dev

# Using yarn
yarn dev

# Using pnpm
pnpm dev
```

The admin panel will be available at [http://localhost:3002](http://localhost:3002)

**Note**: Admin panel runs on port 3002 to avoid conflicts with partner portal (port 3000).

## 🔧 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server on port 3002 with Turbopack |
| `npm run build` | Build production application |
| `npm run start` | Start production server on port 3002 |
| `npm run lint` | Run ESLint for code quality |

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
│   │   ├── promotions/   # Promotion management
│   │   ├── transactions/ # Payment history & payouts
│   │   ├── layout.tsx    # Root layout
│   │   ├── page.tsx      # Home page (redirects to login)
│   │   └── globals.css   # Global styles
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
│       ├── profileImageUrl.ts  # Profile image URL helper
│       └── validation.ts  # Form validation
├── next.config.ts         # Next.js configuration
├── tsconfig.json          # TypeScript configuration
├── tailwind.config.ts     # Tailwind CSS configuration
└── package.json           # Dependencies and scripts
```

## 🎯 Key Features

### 1. Dashboard (`/dashboard`)
- Overview of partners and customers
- Booking statistics and charts
- Activity calendar view
- Recent messages
- Quick actions

### 2. Partner Management (`/partners`)
- View all partners
- Filter and search partners
- Manage partner accounts
- Approval workflow
- Export partner data

### 3. Customer Management (`/customers`)
- View all customers
- Filter by new/all customers
- Search by name, email, phone
- Export customer data
- View customer details

### 4. Petzy App Management (`/petzy-app`)
- Upload app banners
- Manage main page content
- Image gallery management

### 5. Promotions (`/promotions`)
- Create and edit promotions
- Set active/inactive status
- Configure date ranges
- Set discount percentages
- View promotion analytics

### 6. Transactions (`/transactions`)
- Customer payment history
- Partner payout tracking
- Status management (Pending, Success, Failed)
- Filter by date range
- Export transaction data

### 7. Chat (`/chats`)
- Real-time messaging with partners
- Socket.io integration
- Message history
- Typing indicators
- Online/offline status

### 8. Privacy Policy (`/policy`)
- Upload privacy policy documents
- Support for images and PDFs
- Public display on partner portal

### 9. Profile (`/profile`)
- Admin account settings
- Profile customization
- Profile image upload (served via API)

## 🌐 API Integration

### Base URL Configuration

```typescript
// src/config/api.ts
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
export const USE_API_MODE = process.env.NEXT_PUBLIC_USE_API_MODE === 'true';
```

### Authentication

All API requests include JWT token in headers:

```typescript
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json',
}
```

Token is stored in `localStorage` as `accessToken`.

### Key API Endpoints

- `POST /api/auth/login` - Admin login
- `GET /api/admin/partners` - Get all partners
- `GET /api/admin/customers` - Get all customers
- `GET /api/admin/dashboard` - Get dashboard statistics
- `GET /api/admin/transactions` - Get transactions
- `POST /api/admin/promotions` - Create promotion
- `GET /api/images/profile/*` - Get profile images (secure API endpoint)

### Image Handling

Profile images are served through secure API endpoints:
- Profile images: `/api/images/profile/{filename}`
- Utility function: `getProfileImageUrl()` in `src/utils/profileImageUrl.ts`

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

## 🔐 Authentication Flow

1. Admin logs in at `/login`
2. System validates admin role
3. Token stored in `localStorage`
4. Protected routes check for token and admin role
5. Redirects to `/dashboard` on success
6. Logout clears token and redirects to login

### Preview Mode

If `USE_API_MODE` is `false`, the app runs in preview mode with mock data.

### API Mode

Set `NEXT_PUBLIC_USE_API_MODE=true` to connect to the backend API.

## 🔄 Real-time Features

### Chat System
- Socket.io for real-time messaging
- Auto-reconnect on connection loss
- Message history persistence
- Typing indicators
- Online/offline status

## 🛡️ Security

- JWT token authentication
- LocalStorage for token storage
- Automatic logout on token expiration
- Admin-only access control
- CORS configuration required on backend

## 🚀 Deployment

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
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com
NEXT_PUBLIC_USE_API_MODE=true
NEXT_PUBLIC_SOCKET_URL=https://api.yourdomain.com
```

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to [Vercel](https://vercel.com)
3. Set environment variables in Vercel dashboard
4. Configure port 3002 in Vercel settings
5. Deploy automatically on every push

## 🐛 Known Issues

### React 19 Compatibility
- Ant Design 5.27.3 officially supports React 16-18
- Works fine with React 19, compatibility warnings are suppressed
- See `WarningSupressor.tsx` for implementation

### Image Loading
- Next.js Image component requires proper CORS headers from backend
- Configure `next.config.ts` with backend domain for remote images

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

## 🔗 Related Projects

- **Backend API**: `../nestjs_petzy/` (port 3001)
- **Partner Portal**: `../partner/` (port 3000)
- **Mobile App**: `../flutter_petzy/`

## 📞 Support

For issues or questions:
- Check backend API is running
- Verify environment variables are set correctly
- Review browser console for errors
- Check network tab for API request failures

## 📄 License

Private project - All rights reserved

---

**Last Updated:** November 24, 2025  
**Version:** 1.0.0  
**Status:** ✅ Ready for production deployment
