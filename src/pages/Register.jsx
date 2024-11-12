import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { User, Mail, Lock } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useAuthContext();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(name, email, password);
      navigate('/profile', { replace: true });
    } catch (err){
      if(err.response && err.response.data) {
        setError(err.response.data.message);    
      }
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <Card className="w-full max-w-md bg-white shadow-md rounded-lg border-green-600">
        <CardHeader className="pt-10 pb-10">
          <CardTitle className="text-4xl font-extrabold text-green-600 text-center">
            INSCRIPTION
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded">
              {success}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <label
                className="block text-black text-sm mb-1 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-black peer-focus:text-sm"
                htmlFor="name"
              >
                Nom
              </label>
              <div className="flex items-center border border-green-600 rounded-md overflow-hidden">
                <div className="bg-white px-3 py-2 text-green-600 rounded-l-md">
                  <User size={18} />
                </div>
                <Input
                  placeholder="Votre nom"
                  id="name"
                  name="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="flex-1 border-l-0 rounded-none focus-visible:outline-none focus-visible:ring-0"
                />
              </div>
            </div>

            <div className="relative">
              <label
                className="block text-black text-sm mb-1 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-black peer-focus:text-sm"
                htmlFor="email"
              >
                Adresse Email
              </label>
              <div className="flex items-center border border-green-600 rounded-md overflow-hidden">
                <div className="bg-white px-3 py-2 text-green-600 rounded-l-md">
                  <Mail size={18} />
                </div>
                <Input
                  placeholder="exemple@gmail.com"
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 border-l-0 rounded-none focus-visible:outline-none focus-visible:ring-0"
                />
              </div>
            </div>

            <div className="relative">
              <label
                className="block text-black text-sm mb-1 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-black peer-focus:text-sm"
                htmlFor="password"
              >
                Mot de passe
              </label>
              <div className="flex items-center border border-green-600 rounded-md overflow-hidden">
                <div className="bg-white px-3 py-2 text-green-600 rounded-l-md">
                  <Lock size={18} />
                </div>
                <Input
                  placeholder="Mot de passe"
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="flex-1 border-l-0 rounded-none focus-visible:outline-none focus-visible:ring-0"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full py-2 px-4 bg-green-950 hover:bg-green-600 rounded-md shadow-lg text-white font-medium transition duration-200"
            >
              S'inscrire
            </Button>
          </form>

          <div className="text-center text-gray-800 pt-2">
            <Link className="text-green-600 hover:underline" to="/login">
              Déjà inscrit ? Se connecter
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;