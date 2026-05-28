# Portfolio Frontend - React + TypeScript + Vite

Ứng dụng frontend portfolio được xây dựng với React 19, TypeScript, Vite, React Router, NodeQuery (React Query), và Zustand.

## 📋 Tổng Quan Công Nghệ (Tech Stack)

- **Framework**: React 19 (với Hooks)
- **Ngôn ngữ**: TypeScript 6
- **Build Tool**: Vite (fast build & HMR)
- **Routing**: React Router v7
- **State Management**: Zustand (với persist middleware)
- **Data Fetching**: TanStack React Query v5
- **Styling**: SCSS
- **Linting**: ESLint
- **Editor**: VSCode optimized

---

## 📁 Cấu Trúc Thư Mục

```
├── public/                          # Static assets
├── src/
│   ├── App.tsx                      # Root component - setup providers & router
│   ├── main.tsx                     # Entry point
│   ├── index.css                    # Global styles
│   │
│   ├── components/
│   │   ├── error/                   # Error handling
│   │   │   ├── ErrorBoundary.tsx    # React Error Boundary wrapper
│   │   │   └── PageError.tsx        # Error fallback UI
│   │   │
│   │   ├── layouts/                 # Layout templates (cho các page khác nhau)
│   │   │   ├── MainLayout.tsx       # Main layout (cho user pages)
│   │   │   ├── AuthLayout.tsx       # Auth layout (login, register)
│   │   │   ├── AdminLayout.tsx      # Admin layout (admin panel)
│   │   │   ├── LayoutRenderer.tsx   # Component render layout dựa trên config
│   │   │   └── style/
│   │   │       ├── index.scss
│   │   │       └── MainLayout.scss
│   │   │
│   │   └── ui/                      # Reusable UI components
│   │       ├── LoadingSpinner.tsx   # Loading indicator
│   │       ├── Button/              # Button component
│   │       └── Modal/               # Modal component
│   │
│   ├── features/                    # Feature modules (mỗi feature = 1 thư mục)
│   │   ├── auth/                    # Authentication feature
│   │   │   ├── components/          # Các component dùng riêng trong auth
│   │   │   ├── hooks/               # Custom hooks của auth
│   │   │   ├── page/                # Page/screens của auth
│   │   │   └── services/            # API calls của auth
│   │   │
│   │   └── home/                    # Home feature
│   │       ├── index.tsx            # Main export
│   │       ├── components/          # Components (VD: BirdsBackground)
│   │       ├── pages/               # Page components
│   │       │   └── homePage1.tsx
│   │       └── styles/              # Feature styles
│   │           ├── index.scss
│   │           └── homePage1.scss
│   │
│   ├── hooks/                       # Custom hooks (dùng toàn app)
│   │
│   ├── providers/
│   │   ├── AppProviders.tsx         # Provider wrapper (Router + Query Client)
│   │   └── queryClient.ts           # React Query client config
│   │
│   ├── router/
│   │   ├── AppRouter.tsx            # Router component setup
│   │   ├── routeConfig.tsx          # Route definitions + metadata
│   │   └── RouteGuard.tsx           # Route protection (auth guard, etc)
│   │
│   ├── services/                    # API services / HTTP client
│   │
│   ├── store/
│   │   └── authStore.tsx            # Zustand auth store (state management)
│   │
│   ├── types/                       # TypeScript types/interfaces
│   │   ├── AuthState.ts
│   │   ├── Layout.ts                # Route & Layout types
│   │   └── User.ts
│   │
│   └── utils/                       # Utility functions
│
├── vite.config.ts                   # Vite configuration
├── eslint.config.js                 # ESLint rules
├── tsconfig.json                    # TypeScript config (root)
├── tsconfig.app.json                # TypeScript app config
├── tsconfig.node.json               # TypeScript node config
├── package.json                     # Dependencies
└── index.html                       # Entry HTML file
```

---

## 🔄 Cách Code Hoạt Động (Architecture Flow)

### 1. **Khởi động ứng dụng (Startup)**
```
index.html 
  → main.tsx (entry point)
    → App.tsx (root component)
      → AppProviders (wraps all providers)
        → QueryClientProvider (React Query)
        → BrowserRouter (React Router)
          → AppRouter (route handler)
```

### 2. **AppProviders.tsx** - Cấu hình Providers
```typescript
// Bọc 2 provider chính
- QueryClientProvider: Quản lý data fetching & caching (từ TanStack Query)
- BrowserRouter: Cho phép routing trên ứng dụng
```

### 3. **AppRouter.tsx** - Xử lý Routes
```
routeConfig (định nghĩa routes)
  ↓
AppRouter (render routes)
  ↓
Cho mỗi route:
  1. Suspense (fallback: LoadingSpinner)
  2. ErrorBoundary (fallback: PageError)
  3. RouteGuard (kiểm tra auth, permissions)
  4. LayoutRenderer (wrap page với layout phù hợp)
  5. route.element (page component)
```

### 4. **routeConfig.tsx** - Định Nghĩa Routes
```typescript
// Ví dụ:
{
  path: '/',                    // URL
  element: <HomePage />,        // Component to render
  public: true,                 // Public route (không cần auth)
  label: 'Home',               // Menu label
  showInMenu: true,            // Show in navigation
  layout: 'main',              // Layout type
}
```

### 5. **LayoutRenderer.tsx** - Dynamic Layout
- Nhận layout type từ route config
- Render page component trong layout phù hợp
- Hỗ trợ multiple layouts: MainLayout, AuthLayout, AdminLayout

### 6. **State Management (Zustand)**
```typescript
// authStore.tsx
- Store: { token: string | null }
- Actions: setToken(), logout()
- Persisted to localStorage (via persist middleware)
- Sử dụng: const { token, setToken } = useAuthStore()
```

### 7. **Data Fetching (React Query)**
```typescript
// Trong providers/queryClient.ts
- Cấu hình caching, retry logic, stale time
- Dùng: useQuery() để fetch data
- Tự động cache & refetch data
```

### 8. **Routing Flow**
```
User clicks link
  ↓
React Router thay đổi URL
  ↓
AppRouter re-render với route mới
  ↓
Chạy qua Suspense → ErrorBoundary → RouteGuard → LayoutRenderer
  ↓
Render page component
```

### 9. **Features Folder Structure**
Mỗi feature (auth, home, etc.) có structure riêng:
```
features/auth/
├── components/     # Auth-specific UI components
├── hooks/         # Auth custom hooks (useLogin, useRegister, etc)
├── pages/         # Auth pages/screens
├── services/      # Auth API calls (userService.login, etc)
└── index.tsx      # Export main page
```

### 10. **Error Handling**
- **ErrorBoundary**: Bắt React component errors, hiển thị fallback UI
- **PageError**: Error page component
- **RouteGuard**: Redirect nếu route không được phép

---

## 🚀 Scripts & Commands

```bash
# Dev server (với HMR - Hot Module Replacement)
npm run dev

# Build cho production
npm run build

# Preview production build
npm run preview

# Lint code (ESLint)
npm run lint
```

---

## 💾 Dependencies

### Production
- **react**: UI library
- **react-dom**: React DOM rendering
- **react-router-dom**: Client-side routing
- **@tanstack/react-query**: Server state management & data fetching
- **zustand**: Client state management (auth)
- **sass**: SCSS preprocessor

### Development
- **typescript**: Type safety
- **vite**: Build tool
- **eslint**: Code linting
- **@types/react**: Type definitions

---

## 📝 Best Practices

1. **Features**: Tổ chức code theo features, không theo type (components, services, etc)
2. **Reusable Components**: UI components chung trong `src/components/ui/`
3. **State Management**: Auth store dùng Zustand, data queries dùng React Query
4. **Type Safety**: Tất cả components và functions đều typed
5. **Error Handling**: Dùng ErrorBoundary + RouteGuard cho robust app
6. **Lazy Loading**: Routes được lazy load bằng React.lazy() để reduce bundle size

---

## 🎯 Workflow Ứng Dụng

1. **User truy cập URL** → React Router match route
2. **Route được protect** → RouteGuard kiểm tra (public/auth required)
3. **Component lazy load** → Suspense hiển thị spinner
4. **Page render** → LayoutRenderer wrap trong layout
5. **Data fetch** → React Query handle caching & refetch
6. **User interact** → Update state via Zustand/React Query
7. **Error xảy ra** → ErrorBoundary catch + PageError display
