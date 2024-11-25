import React, { useState, useEffect } from 'react';
import AuthService from '../services/authService';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Alert, AlertDescription } from "../components/ui/alert";
import { 
  ChevronRight, 
  Mail, 
  User,
  Trash2,
  CheckCircle,
  AlertCircle,
  Loader
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {ConfirmDelete} from '../components/ui/confirmDelete';

const Profile = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [openModal, setOpenModal] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    confirmDelete: ''
  });
  const [errors, setErrors] = useState({});

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
        handleAuthError(error);
      } else {
        setError('Erreur lors du chargement du profil');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAuthError = (error) => {
    console.error('Erreur d\'authentification:', error);
    AuthService.logout();
    navigate('/login', { replace: true }); // Force navigation with replace
  };

  const handleUpdate = async (type) => {
    try {
      setErrors({});
      
      let response;
      if (type === 'name') {
        response = await AuthService.updateProfile('/update-name', { name: userData.name });
      } else if (type === 'email') {
        if (!validateEmail(userData.email)) {
          setErrors({ email: 'Email invalide' });
          return;
        }
        response = await AuthService.updateProfile('/update-email', { email: userData.email });
      }

      setSuccess(`${type === 'name' ? 'Nom' : 'Email'} mis à jour avec succès !`);
      setOpenModal('');
      fetchUserProfile();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      if (error.response?.status === 401) {
        handleAuthError(error);
        return; // Stop execution after handling auth error
      } else {
        setErrors({ submit: error.response?.data?.message || 'Une erreur est survenue. Veuillez réessayer.' });
      }
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await AuthService.deleteAccount();
      AuthService.logout();
      // Force immediate navigation
      window.location.reload();  
      } catch (error) {
      setLoading(false); // Stop loading if there's an error
      if (error.response?.status === 401) {
        handleAuthError(error);
      } else {
        setErrors({ submit: 'Erreur lors de la suppression du compte' });
        setIsModalOpen(false); // Close the modal on error
      }
    }
  };
  useEffect(() => {
    const loadingTimeout = setTimeout(() => {
      if (loading) {
        setLoading(false);
        setError('Le chargement a pris trop de temps. Veuillez rafraîchir la page.');
      }
    }, 100); // 1 seconds timeout

    return () => clearTimeout(loadingTimeout);
  }, [loading]);
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="flex-1 ml-64 p-6">
      <h1 className="text-2xl font-bold mb-4 text-black">Informations personnelles</h1>
      <p className="text-gray-600 mb-8">
        Gérez vos informations personnelles.
      </p>

      {success && (
        <Alert className="mb-4 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-600">{success}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert className="mb-4 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-600">{error}</AlertDescription>
        </Alert>
      )}

      {/* Nom */}
      <div 
        onClick={() => setOpenModal('name')}
        className="flex items-center justify-between p-4 hover:bg-green-50 cursor-pointer rounded-lg mb-2 text-black"
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
        className="flex items-center justify-between p-4 hover:bg-green-50 cursor-pointer rounded-lg mb-2 text-black"
      >
        <div>
          <h2 className="font-semibold mb-1">Email</h2>
          <p className="text-gray-600 text-sm">{userData.email}</p>
        </div>
        <ChevronRight className="text-gray-500" />
      </div>

      {/* Supprimer le compte */}
      <div 
        onClick={() => setIsModalOpen(true)}
        className="flex items-center justify-between p-4 hover:bg-red-50 cursor-pointer rounded-lg text-red-600"
      >
        <div>
          <h2 className="font-semibold mb-1">Supprimer le compte</h2>
          <p className="text-red-500 text-sm">Cette action est irréversible</p>
        </div>
        <Trash2 className="text-red-500" />
      </div>
         {/* Nouveau composant de confirmation */}
     {/* Le modal de confirmation */}
     {isModalOpen && (
        <ConfirmDelete
          title="Supprimer le compte ?"
          message="Cette action est irréversible"
          onConfirm={handleDeleteAccount}
          onCancel={() => setIsModalOpen(false)}
        />
      )}

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
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
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