# 🐾 Petzy - Pet-Friendly Hotel Platform

A modern web application for pet-friendly hotel booking and management, built with Next.js and React. This platform allows hotel partners to register, manage their pet-friendly accommodations, and provides a seamless booking experience for pet owners.

## 🌟 Features

### For Hotel Partners
- **Multi-step Registration Process**: Complete onboarding with data-entry forms
- **Room & Service Management**: Configure room types, special services, and pet care options
- **Dashboard**: Comprehensive management interface
- **Image Upload**: Multiple image upload for hotel galleries
- **Service Configuration**: Detailed service setup with pricing and schedules

### For Users
- **Pet-Friendly Search**: Find accommodations that welcome pets
- **Modern UI/UX**: Clean, responsive design with Ant Design components
- **Multi-language Support**: Thai and English interface

## 🚀 Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | `15.5.3` | React framework with App Router |
| **React** | `19.1.0` | Frontend library |
| **TypeScript** | `^5.0.0` | Type safety |
| **Tailwind CSS** | `^4.0.0` | Utility-first CSS framework |
| **Ant Design** | `^5.27.3` | UI component library |
| **SweetAlert2** | `^11.23.0` | Beautiful alert dialogs |
| **Lucide React** | `^0.544.0` | Icon library |

## 📋 Prerequisites

- **Node.js**: `18.0.0` or higher (recommended: `20.x.x`)
- **Package Manager**: npm, yarn, pnpm, or bun
- **Git**: For version control

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/next_js_petzy.git
cd next_js_petzy
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
Copy the example environment file and configure it:
```bash
# Copy the example file
cp .env.example .env.local

# Edit .env.local with your configuration
```

The `.env.local` file should contain:
```env
# Backend API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001

# Environment
NODE_ENV=development
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

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📁 Project Structure

```
next_js_petzy/
├── public/
│   └── assets/
│       └── images/
│           ├── background/
│           ├── first_page/
│           ├── logo/
│           └── svg/
├── src/
│   ├── app/
│   │   ├── login/
│   │   ├── partner/
│   │   │   ├── dashboard/
│   │   │   ├── data-entry/
│   │   │   ├── data-entry-2/
│   │   │   ├── data-entry-3/
│   │   │   ├── data-entry-4/
│   │   │   ├── manage-rooms/
│   │   │   └── ...
│   │   └── globals.css
│   └── components/
│       ├── first_page/
│       └── partner/
│           └── shared/
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.ts
```

## 🔧 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Build production application |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint for code quality |

## 🎨 Key Pages & Features

### Authentication
- **Login Page**: Support for email/phone number authentication
- **Registration**: Multi-step partner registration process

### Partner Dashboard
- **Data Entry Forms**: 4-step hotel setup process
  - Basic information and service categories
  - Detailed service configuration with image uploads
  - Room and service management
  - Individual room/service details
- **Room Management**: Edit and manage room configurations
- **Profile Management**: Partner profile settings

### Components
- **Reusable UI Components**: Shared components for consistent design
- **File Upload**: Custom image upload with preview
- **Data Tables**: Dynamic tables for data management
- **Form Validation**: Comprehensive form validation with SweetAlert2

## 🌐 API Integration

The application is designed to work with backend APIs:

- `POST /api/partner/data-entry-2` - Basic hotel information
- `POST /api/partner/data-entry-3` - Service configuration & images
- `POST /api/partner/data-entry-4` - Individual room/service details

## 🎯 Development Features

- **Turbopack**: Fast bundling for development and build
- **TypeScript**: Full type safety throughout the application
- **ESLint**: Code quality and consistency
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Component Architecture**: Modular and reusable components

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Deploy automatically on every push

### Other Deployment Options
- **Netlify**: Static site deployment
- **Docker**: Containerized deployment
- **Self-hosted**: Using `npm run start`

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Known Issues

- React 19 compatibility warnings with Ant Design (suppressed in development)
- Some TypeScript strict mode warnings (being addressed)

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team

## 🔄 Version History

- **v0.1.0** - Initial release with core functionality
  - Multi-step partner registration
  - Room and service management
  - Image upload capabilities
  - Responsive design implementation

---

**Made with ❤️ for pet lovers and their furry friends** 🐕🐱