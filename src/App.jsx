import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Sidebar from './pages/Sidebar';

// Composant PrivateRoute pour protéger les routes
const PrivateRoute = ({ children }) => {
  const { user } = useAuthContext();
  
  if (!user) {
    // Rediriger vers login si non authentifié
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Composant PublicRoute pour les routes publiques
const PublicRoute = ({ children }) => {
  const { user } = useAuthContext();
  
  if (user) {
    // Rediriger vers profile si déjà authentifié
    return <Navigate to="/profile" replace />;
  }

  return children;
};

const App = () => {
  const { user, logout } = useAuthContext();

  return (
    <BrowserRouter>
      <div className="flex flex-col h-screen">
        {/* Le Sidebar ne s'affiche que si l'utilisateur est connecté */}
        {user && (
          <header>
            <Sidebar />
          </header>
        )}

        <main className="flex-1 py-8 px-6">
          <Routes>
            {/* Routes publiques */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />

            {/* Routes protégées */}
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />

            {/* Route par défaut */}
            <Route
              path="/"
              element={
                user ? (
                  <Navigate to="/profile" replace />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;