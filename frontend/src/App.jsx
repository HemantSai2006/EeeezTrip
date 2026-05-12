import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import MoodPage from './pages/MoodPage';
import AIPage from './pages/AIPage';
import BookingPage from './pages/BookingPage';
import ItineraryPage from './pages/ItineraryPage';
import TipsPage from './pages/TipsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MyTripsPage from './pages/MyTripsPage';
import './styles/globals.css';

function Router() {
  const { currentPage } = useApp();
  const { isAuthenticated } = useAuth();

  // Auth pages available to everyone
  if (currentPage === 'login') return <LoginPage />;
  if (currentPage === 'register') return <RegisterPage />;

  // Protected pages - redirect to login if not authenticated
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const pages = {
    home:      <HomePage />,
    mood:      <MoodPage />,
    ai:        <AIPage />,
    booking:   <BookingPage />,
    itinerary: <ItineraryPage />,
    tips:      <TipsPage />,
    mytrips:   <MyTripsPage />,
  };

  return pages[currentPage] || <HomePage />;
}

function AppContent() {
  const { isAuthenticated } = useAuth();
  const { currentPage } = useApp();

  const showNav = isAuthenticated && currentPage !== 'login' && currentPage !== 'register';

  return (
    <>
      {showNav && <Navbar />}
      <Router />
      {showNav && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
}
