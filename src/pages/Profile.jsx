import React, { useState, useEffect } from 'react';
import AuthService from '../services/authService'; // Importez le service d'authentification
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Alert, AlertDescription } from "../components/ui/alert";
import { 
  ChevronRight, 
  Mail, 
  User,
  Key,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Loader // Ajout de l'icône de chargement
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [openModal, setOpenModal] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const Navigate=useNavigate();
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  // Récupération du profil utilisateur au chargement du composant
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const data = await AuthService.getProfile();
      
      if (data && data.name && data.email) {
        setUserData(prevData => ({
          ...prevData,
          name: data.name,
          email: data.email
        }));
        setError('');
      }
    } catch (error) {
      if (error.response?.status === 401) {
        
      } else {
        setError('Erreur lors du chargement du profil');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAuthError = (error) => {
    console.error('Erreur d\'authentification:', error);
    AuthService.logout(); // Utilisation de la méthode logout du service
    setError('Session expirée. Veuillez vous reconnecter.');
    // Redirection vers la page de connexion
    //Navigate('/login');
  };

  const handleUpdate = async (type) => {
    try {
      let endpoint = '';
      let data = {};
      
      switch(type) {
        case 'name':
          endpoint = '/update-name';
          data = { name: userData.name };
          break;
        case 'email':
          endpoint = '/update-email';
          data = { email: userData.email };
          break;
        case 'password':
          if (!validatePassword()) return;
          endpoint = '/update-password';
          data = {
            currentPassword: userData.currentPassword,
            newPassword: userData.newPassword
          };
          break;
        default:
          return;
      }

      const response = await AuthService.updateProfile(endpoint, data);

      setSuccess(`${type === 'name' ? 'Nom' : type === 'email' ? 'Email' : 'Mot de passe'} mis à jour avec succès !`);
      setOpenModal('');
      
      if (type === 'password') {
        setUserData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
      } else {
        fetchUserProfile();
      }

      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      if (error.response?.status === 401) {
        handleAuthError(error);
      } else {
        setErrors({ submit: error.response?.data?.message || 'Une erreur est survenue. Veuillez réessayer.' });
      }
    }
  };

  const validatePassword = () => {
    const newErrors = {};
    if (userData.newPassword.length < 8) {
      newErrors.newPassword = 'Le mot de passe doit contenir au moins 8 caractères';
    }
    if (userData.newPassword !== userData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }
  return (
    <div className="max-w-2xl mx-auto p-6 rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-black">Informations personnelles</h1>
      <p className="text-gray-600 mb-8">
        Gérez vos informations personnelles et paramètres de sécurité.
      </p>

      {success && (
        <Alert className="mb-4 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-600">
            {success}
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert className="mb-4 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-600">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Nom */}
      <div 
        onClick={() => setOpenModal('name')}
        className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer rounded-lg mb-2 text-black"
      >
        <div>
          <h2 className="font-semibold mb-1">Nom</h2>
          <p className="text-gray-600 text-sm">{userData.name}</p>
        </div>
        <ChevronRight className="text-gray-500" />
      </div>

      {/* Email */}
      <div 
        onClick={() => setOpenModal('email')}
        className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer rounded-lg mb-2 text-black"
      >
        <div>
          <h2 className="font-semibold mb-1">Email</h2>
          <p className="text-gray-600 text-sm">{userData.email}</p>
        </div>
        <ChevronRight className="text-gray-500" />
      </div>

      {/* Mot de passe */}
      <div 
        onClick={() => setOpenModal('password')}
        className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer rounded-lg text-black"
      >
        <div>
          <h2 className="font-semibold mb-1">Mot de passe</h2>
          <p className="text-gray-600 text-sm">Modifiez votre mot de passe</p>
        </div>
        <ChevronRight className="text-gray-500" />
      </div>

      {/* Modal Nom */}
      <Dialog open={openModal === 'name'} onOpenChange={() => setOpenModal('')}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Modifier le nom</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); handleUpdate('name'); }} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2 text-gray-700">
                <User className="h-4 w-4" /> Nom
              </Label>
              <Input
                id="name"
                value={userData.name}
                onChange={(e) => setUserData({...userData, name: e.target.value})}
                className="text-gray-900"
              />
            </div>
            {errors.submit && (
              <p className="text-sm text-red-500">{errors.submit}</p>
            )}
            <DialogFooter>
              <Button type="submit" className="bg-green-600 text-white hover:bg-green-700">
                Enregistrer
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal Email */}
      <Dialog open={openModal === 'email'} onOpenChange={() => setOpenModal('')}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Modifier l'email</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); handleUpdate('email'); }} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2 text-gray-700">
                <Mail className="h-4 w-4" /> Email
              </Label>
              <Input
                id="email"
                type="email"
                value={userData.email}
                onChange={(e) => setUserData({...userData, email: e.target.value})}
                className="text-gray-900"
              />
            </div>
            {errors.submit && (
              <p className="text-sm text-red-500">{errors.submit}</p>
            )}
            <DialogFooter>
              <Button type="submit" className="bg-green-600 text-white hover:bg-green-700">
                Enregistrer
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal Mot de passe */}
      <Dialog open={openModal === 'password'} onOpenChange={() => setOpenModal('')}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Modifier le mot de passe</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); handleUpdate('password'); }} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword" className="flex items-center gap-2 text-gray-700">
                <Key className="h-4 w-4" /> Mot de passe actuel
              </Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={userData.currentPassword}
                  onChange={(e) => setUserData({...userData, currentPassword: e.target.value})}
                  className="text-gray-900 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword ? 
                    <EyeOff className="h-4 w-4 text-gray-500" /> : 
                    <Eye className="h-4 w-4 text-gray-500" />
                  }
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword" className="flex items-center gap-2 text-gray-700">
                <Key className="h-4 w-4" /> Nouveau mot de passe
              </Label>
              <Input
                id="newPassword"
                type="password"
                value={userData.newPassword}
                onChange={(e) => setUserData({...userData, newPassword: e.target.value})}
                className="text-gray-900"
              />
              {errors.newPassword && (
                <p className="text-sm text-red-500">{errors.newPassword}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="flex items-center gap-2 text-gray-700">
                <Key className="h-4 w-4" /> Confirmer le mot de passe
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={userData.confirmPassword}
                onChange={(e) => setUserData({...userData, confirmPassword: e.target.value})}
                className="text-gray-900"
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword}</p>
              )}
            </div>
            {errors.submit && (
              <p className="text-sm text-red-500">{errors.submit}</p>
            )}
            <DialogFooter>
              <Button type="submit" className="bg-green-600 text-white hover:bg-green-700">
                Enregistrer
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;