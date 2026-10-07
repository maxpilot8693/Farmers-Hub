import React, { useEffect, useState } from 'react';
import { AuthProvider } from './lib/authContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

import { HomePage } from './pages/HomePage';
import { SearchPage } from './pages/SearchPage';
import { CategoryPage } from './pages/CategoryPage';
import { ListingDetailPage } from './pages/ListingDetailPage';
import { FarmerProfilePage } from './pages/FarmerProfilePage';
import { FarmerDashboardPage } from './pages/FarmerDashboardPage';
import { CreateEditListingPage } from './pages/CreateEditListingPage';
import { FarmerProfileEditPage } from './pages/FarmerProfileEditPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AdminPage } from './pages/AdminPage';

export function App() {
  const [route, setRoute] = useState<string>(window.location.pathname || '/');
  const [searchParams, setSearchParams] = useState<URLSearchParams>(
    new URLSearchParams(window.location.search)
  );

  useEffect(() => {
    const handlePopState = () => {
      setRoute(window.location.pathname || '/');
      setSearchParams(new URLSearchParams(window.location.search));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (to: string) => {
    if (typeof to === 'number' && to === -1) {
      window.history.back();
      return;
    }

    const [pathname, search] = to.split('?');
    window.history.pushState({}, '', to);
    setRoute(pathname || '/');
    setSearchParams(new URLSearchParams(search || ''));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Route Resolver
  const renderPage = () => {
    // 1. Homepage
    if (route === '/' || route === '') {
      return <HomePage navigate={navigate} />;
    }

    // 2. Search & Browse
    if (route === '/search' || route === '/categories') {
      return (
        <SearchPage
          navigate={navigate}
          initialQuery={searchParams.get('q') || ''}
          initialCounty={searchParams.get('county') || ''}
          initialCategory={searchParams.get('category') || ''}
        />
      );
    }

    // 3. Category Page: /category/:slug
    if (route.startsWith('/category/')) {
      const slug = route.replace('/category/', '');
      return <CategoryPage slug={slug} navigate={navigate} />;
    }

    // 4. Listing Detail Page: /listing/:id
    if (route.startsWith('/listing/')) {
      const id = route.replace('/listing/', '');
      return <ListingDetailPage id={id} navigate={navigate} />;
    }

    // 5. Farmer Routes
    if (route === '/farmer/dashboard' || route === '/farmer/listings') {
      return <FarmerDashboardPage navigate={navigate} />;
    }

    if (route === '/farmer/listings/new') {
      return <CreateEditListingPage navigate={navigate} />;
    }

    if (route.startsWith('/farmer/listings/') && route.endsWith('/edit')) {
      const parts = route.split('/');
      const id = parts[3];
      return <CreateEditListingPage id={id} navigate={navigate} />;
    }

    if (route === '/farmer/profile') {
      return <FarmerProfileEditPage navigate={navigate} />;
    }

    // 6. Farmer Public Profile: /farmer/:id
    if (route.startsWith('/farmer/')) {
      const id = route.replace('/farmer/', '');
      return <FarmerProfilePage id={id} navigate={navigate} />;
    }

    // 7. Favorites: /favorites
    if (route === '/favorites') {
      return <FavoritesPage navigate={navigate} />;
    }

    // 8. Auth
    if (route === '/login') {
      return <LoginPage navigate={navigate} />;
    }

    if (route === '/register') {
      const registerType = searchParams.get('type') as 'farmer' | 'buyer' | null;
      return <RegisterPage initialType={registerType || 'farmer'} navigate={navigate} />;
    }

    // 9. Admin Console
    if (route === '/admin') {
      return <AdminPage navigate={navigate} />;
    }

    // Fallback
    return <HomePage navigate={navigate} />;
  };

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col font-sans text-slate-800 bg-[#F8F9F8] selection:bg-[#E2C37A] selection:text-[#0D3B2E]">
        <Navbar currentRoute={route} navigate={navigate} />
        <main className="flex-1">{renderPage()}</main>
        <Footer navigate={navigate} />
      </div>
    </AuthProvider>
  );
}

export default App;
