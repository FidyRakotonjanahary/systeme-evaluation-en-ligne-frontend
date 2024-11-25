// contexts/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/AuthService.jsx';
import { Loader2 } from 'lucide-react';
// Créer le contexte avec une valeur initiale par défaut
export const AuthContext = createContext({
  user: null,
  login: () => Promise.resolve(),
  register: () => Promise.resolve(),
  logout: () => {},
  isLoading: false,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Vérifier l'utilisateur au chargement
    const initAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          // Vérifier si le token est toujours valide
          const profile = await authService.getProfile();
          setUser({ ...userData, ...profile });
        }
      } catch (error) {
        console.error('Erreur d\'authentification:', error);
        localStorage.removeItem('user');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setIsLoading(true);
      const userData = await authService.login(email, password);
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.error('Erreur de connexion:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name, email, password) => {
    try {
      setIsLoading(true);
      const userData = await authService.register(name, email, password);
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    login,
    register,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading ? children : <div className="flex justify-center items-center h-[600px]">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>}
    </AuthContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  return context;
};