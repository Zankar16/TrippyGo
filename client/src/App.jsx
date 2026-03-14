import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/AppLayout';

// Existing Pages
import HomePage from './pages/HomePage';
import BookingsPage from './pages/BookingsPage';
import DocumentsPage from './pages/DocumentsPage';
import NewSpotsPage from './pages/NewSpotsPage';
import WeatherPage from './pages/WeatherPage';
import RecommendationsPage from './pages/RecommendationsPage';
import ItineraryPage from './pages/ItineraryPage';

// New Pages (Skeletons to be built)
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ExplorePage from './pages/ExplorePage';
import ExploreDetailPage from './pages/ExploreDetailPage';
import ShareTripPage from './pages/ShareTripPage';

import { useSelector } from 'react-redux';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useSelector(state => state.auth);
  
  if (isLoading) return (
    <div className="h-screen w-screen flex items-center justify-center bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/trip/share/:shareId" element={<ShareTripPage />} />

        {/* Protected Application Routes */}
        <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route index element={<HomePage />} />
          <Route path="explore" element={<ExplorePage />} />
          <Route path="explore/:destination" element={<ExploreDetailPage />} />
          <Route path="bookings" element={<BookingsPage />} />
          <Route path="documents" element={<DocumentsPage />} />
          <Route path="newspots" element={<NewSpotsPage />} />
          <Route path="weather" element={<WeatherPage />} />
          <Route path="recommendations/:destination" element={<RecommendationsPage />} />
          <Route path="itinerary" element={<ItineraryPage />} />
          <Route path="itinerary/:tripId" element={<ItineraryPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
