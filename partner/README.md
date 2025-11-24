# 🐾 PetZy Partner Portal

A modern Next.js web application for hotel partners to manage their pet-friendly accommodations, services, bookings, and more.

## 🌟 Features

### For Hotel Partners
- **Multi-step Registration**: Complete onboarding with data-entry forms
- **Room & Service Management**: Configure room types, special services, and pet care options
- **Dashboard**: Comprehensive management interface with booking statistics
- **Image Upload**: Multiple image upload for hotel galleries
- **Service Configuration**: Detailed service setup with pricing and schedules
- **Profile Management**: Update profile information and images
- **Real-time Chat**: Communicate with admins via WebSocket
- **Payment History**: Track earnings and payouts

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
- **Package Manager**: npm, yarn, pnpm, or bun
- **Backend API**: NestJS backend running on `http://localhost:3001`
- **Git**: For version control

## 🛠️ Installation & Setup

### 1. Navigate to Partner Directory

```bash
cd next_js_petzy/partner
```

### 2. Install Dependencies

```bash
# Using npm
npm install

# Using yarn
yarn install

# Using pnpm (recommended)
pnpm install

# Using bun
bun install
```

### 3. Environment Setup

Create a `.env.local` file in the `partner` directory:

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

# Using bun
bun dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## 🔧 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Build production application |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint for code quality |

## 📁 Project Structure

```
partner/
├── public/
│   └── assets/
│       └── images/          # Static images (logo, backgrounds, icons)
├── src/
│   ├── app/                 # Next.js 15 App Router
│   │   ├── login/           # Login page
│   │   ├── partner/
│   │   │   ├── dashboard/   # Partner dashboard
│   │   │   ├── data-entry/  # Multi-step registration
│   │   │   ├── create-service/ # Service creation/editing
│   │   │   ├── manage-rooms/  # Room management
│   │   │   ├── profile/     # Profile settings
│   │   │   ├── chat/        # Real-time chat
│   │   │   └── ...          # Other partner pages
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Home page
│   │   └── globals.css      # Global styles
│   ├── components/
│   │   ├── first_page/      # Landing page components
│   │   └── partner/
│   │       ├── dataEntry/   # Data entry form components
│   │       └── shared/      # Shared components (Sidebar, etc.)
│   ├── config/
│   │   └── api.ts           # API configuration
│   ├── hooks/
│   │   ├── useChat.ts       # Chat functionality hook
│   │   └── useApprovalStatus.ts
│   └── utils/
│       ├── api.ts           # API utility functions
│       ├── profileImageUrl.ts # Profile image URL helper
│       └── validation.ts    # Form validation
├── package.json
├── tsconfig.json
├── next.config.ts
└── tailwind.config.ts
```

## 🎯 Key Pages & Features

### Authentication
- **Login Page** (`/login`): Email/phone number authentication
- **Registration** (`/partner/register`): Multi-step partner registration

### Partner Dashboard (`/partner/dashboard`)
- Booking statistics
- Recent bookings
- Revenue overview
- Quick actions

### Data Entry (`/partner/data-entry`)
Multi-step hotel setup process:
1. **Step 1**: Personal information and hotel location
2. **Step 2**: Business details and document uploads
3. **Step 3**: Service configuration and room management
4. **Step 4**: Individual room/service details with images

### Service Management (`/partner/create-service`)
- Create and edit services
- Room service configuration
- Special service setup
- Pet care service management
- Image uploads for rooms and services

### Profile Management (`/partner/profile`)
- Update personal information
- Upload profile image (served via API)
- Manage cover images
- Change password

### Chat (`/partner/chat`)
- Real-time messaging with admins
- WebSocket-based communication
- Message history

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

- `POST /api/partner/register` - Partner registration
- `POST /api/partner/login` - Partner login
- `GET /api/partner/profile` - Get profile
- `POST /api/partner/profile` - Update profile
- `POST /api/partner/create-service` - Create/update services
- `GET /api/partner/service-data` - Get service data
- `GET /api/images/profile/*` - Get profile images (secure API endpoint)

### Image Handling

Profile images are served through secure API endpoints:
- Profile images: `/api/images/profile/{filename}`
- Utility function: `getProfileImageUrl()` in `src/utils/profileImageUrl.ts`

## 🎨 UI Components

### Sidebar Navigation
- Fixed left sidebar with navigation menu
- Profile image display (from API)
- Accommodation name display
- Logout functionality

### Form Components
- Multi-step forms with validation
- File upload with preview
- Image galleries
- Data tables

### Common Patterns
- Ant Design components
- SweetAlert2 for notifications
- Loading states
- Error handling

## 🔐 Authentication Flow

1. User logs in at `/login`
2. Token stored in `localStorage`
3. Protected routes check for token
4. Token automatically extended on API requests
5. Logout clears token and redirects

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm run start
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
4. Deploy automatically on every push

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
- Partner portal runs on **port 3000** (default Next.js port)
- Admin panel runs on port 3002
- Backend API runs on port 3001

### Code Style
- ESLint with Next.js TypeScript rules
- Tailwind CSS for styling
- TypeScript strict mode enabled

### Adding New Pages
1. Create page in `src/app/partner/[pagename]/page.tsx`
2. Add route to Sidebar in `src/components/partner/shared/Sidebar.tsx`
3. Protect route with authentication check
4. Follow existing page patterns for consistency

## 🔗 Related Projects

- **Backend API**: `../nestjs_petzy/` (port 3001)
- **Admin Panel**: `../admin/` (port 3002)
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

**Made with ❤️ for PetZy Platform** 🐕🐱
