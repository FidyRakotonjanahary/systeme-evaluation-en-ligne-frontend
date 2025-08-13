import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card, CardHeader, CardTitle, CardContent, CardDescription 
} from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { ScrollArea } from '../components/ui/scroll-area';
import {
  Plus, Edit2, Trash2, CheckCircle, XCircle, Calendar, 
  Loader2, Search, RefreshCcw, Filter, Clock
} from 'lucide-react';
import useDebounce from '/src/hooks/useDebounce.jsx';
import axios from 'axios'; // Ajout de l'import axios
import {
  Alert,
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,AlertDescription
} from '../components/ui/alert'; 



// Configuration du token
const getToken = () => localStorage.getItem('token');

// Configuration des headers avec le token
const getHeaders = () => ({
  'x-auth-token': getToken(),
  'Content-Type': 'application/json'
});

const Examens = () => {
  const navigate = useNavigate();
  const [examens, setExamens] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null); 
  const [filters, setFilters] = useState({
    nom_matiere: '',
    status: 'Tous',
    sortBy: 'Date'
  });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedExamens, setSelectedExamens] = useState(new Set());
  
  const debouncedSearchTerm = useDebounce(filters.title, 300);
  const [debug, setDebug] = useState(null);

  // Vérification du token
  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate('/login');
      return;
    }
  }, [navigate]);

  useEffect(() => {
    fetchExamens();
  }, [debouncedSearchTerm, filters.status]);

  const [modalSuppression, setModalSuppression] = useState({
    isOpen: false,
    examenId: null,
    suppressionMultiple: false
  });

  // Gestion de la suppression d'un seul examen
  const handleDeleteOne = (examen_id) => {
    setModalSuppression({
      isOpen: true,
      examenId: examen_id,
      suppressionMultiple: false
    });
  };

  // Gestion de la suppression multiple
  const handleDeleteMultiple = async () => {
    setModalSuppression({
      isOpen: true,
      examenId: null,
      suppressionMultiple: true
    });
  };

  // Confirmation de la suppression
  const handleConfirmDelete = async () => {
    try {
      if (modalSuppression.suppressionMultiple) {
        const selectedIds = Array.from(selectedExamens).join(',');
        console.log('IDs à supprimer:', selectedIds); // Log de débogage
  
        const response = await axios.delete(`http://localhost:5000/api/examens/multiple/${selectedIds}`, {
          headers: getHeaders()
        });
        
        console.log('Réponse du serveur:', response.data); // Log de débogage
        
        if (response.data.success) {
          setExamens(examens.filter(examen => !selectedExamens.has(examen.examen_id)));
          setSelectedExamens(new Set());
          showError("Suppressions effectuées avec succès");
        } else {
          throw new Error(response.data.error || 'Erreur lors de la suppression');
        }
      } else {
        await axios.delete(`http://localhost:5000/api/examens/${modalSuppression.examenId}`, {
          headers: getHeaders()
        });
        setExamens(examens.filter(examen => examen.examen_id !== modalSuppression.examenId));
        showError("Suppression effectuée avec succès");
      }
      fetchExamens(true);
    } catch (err) {
      console.error('Erreur:', err);
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        showError("Erreur lors de la suppression. Veuillez réessayer.");
      }
    } finally {
      setModalSuppression({ isOpen: false, examenId: null, suppressionMultiple: false });
    }
  };

  // Annulation de la suppression
  const handleCancelDelete = () => {
    setModalSuppression({ isOpen: false, examenId: null, suppressionMultiple: false });
  };

  const fetchExamens = async (showRefreshAnimation = false) => {
    if (showRefreshAnimation) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);
    
    try {
      const response = await axios.get('http://localhost:5000/api/examens', {
        params: {
          search: filters.nom_matiere,
          status: filters.status !== 'Tous' ? filters.status : undefined
        },
        headers: getHeaders()
      });

      if (response.data.success && Array.isArray(response.data.data)) {
        setExamens(response.data.data);
      } else {
        throw new Error('Format de réponse invalide');
      }
    } catch (err) {
      console.error('Erreur lors de la récupération des examens:', err);
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        setError("Impossible de récupérer les examens. Veuillez réessayer plus tard.");
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handlePublishToggle = async (currentStatus, examen_id) => {
    try {
      await axios.patch(`http://localhost:5000/api/examens/${examen_id}/publish`, {
        est_actif: !currentStatus
      }, {
        headers: getHeaders()
      });
      
      setExamens(examens.map(examen => 
        examen.examen_id === examen_id ? { ...examen, est_actif: !currentStatus } : examen
      ));
      fetchExamens(true)
    } catch (err) {
      console.error('Erreur:', err);
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        showError("Erreur lors de la modification du statut. Veuillez réessayer.");
      }
    }
  };

  const handleBulkPublish = async (publish) => {
    try {
      setIsLoading(true);
      
      await Promise.all(
        Array.from(selectedExamens).map(examenId =>
          axios.patch(`http://localhost:5000/api/examens/${examenId}/publish`, {
            est_actif: publish
          }, {
            headers: getHeaders()
          })
        )
      );
      
      setExamens(examens.map(examen => 
        selectedExamens.has(examen.examen_id) 
          ? { ...examen, est_actif: publish } 
          : examen
      ));
      
      setSelectedExamens(new Set());
      fetchExamens(true);
      
      // Utiliser showSuccess au lieu de showError pour les messages de succès
      showSuccess(publish 
        ? "Examens publiés avec succès" 
        : "Examens dépubliés avec succès"
      );
      
    } catch (err) {
      console.error('Erreur:', err);
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        showError(publish 
          ? "Erreur lors de la publication des examens" 
          : "Erreur lors de la dépublication des examens"
        );
      }
    } finally {
      setIsLoading(false);
    }
  };
  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  };
  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(null), 3000);
  };

  const sortedAndFilteredExamens = useMemo(() => {
    return [...examens]
      .filter(examen => {
        if (!examen.nom_matiere) return false;
        const titleMatch = examen.nom_matiere.toLowerCase().includes(filters.nom_matiere.toLowerCase());
        const statusMatch = filters.status === 'Tous' ? true : 
          (filters.status === 'Publiés' ? examen.est_actif === 1 : examen.est_actif === 0);
        return titleMatch && statusMatch;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'Date') {
          return new Date(b.date_passage) - new Date(a.date_passage);
        }
        return a.nom_matiere.localeCompare(b.nom_matiere);
      });
  }, [examens, filters]);


  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const timeUntilExam = (date_passage) => {
    const now = new Date();
    const examenDate = new Date(date_passage);
    const diff = examenDate - now;
    
    if (diff < 0) return "Terminé";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days > 0) return `Dans ${days} jour${days > 1 ? 's' : ''}`;
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours > 0) return `Dans ${hours}h`;
    
    const minutes = Math.floor(diff / (1000 * 60));
    return `Dans ${minutes}min`;
  };

  return (
        <div className="flex-1 ml-64 p-6 ">
          <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Gestion des examens</h1>
          <div className="flex items-center gap-2 text-gray-500">
            <span>{sortedAndFilteredExamens.length} examen(s)</span>
            <span>•</span>
            <span>{examens.filter(e => e.est_actif === 1).length} publié(s)</span>
            {selectedExamens.size > 0 && (
              <>
                <span>•</span>
                <span>{selectedExamens.size} sélectionné(s)</span>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchExamens(true)}
            disabled={isRefreshing}
          >
            <RefreshCcw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
          <Button 
          className="text-indigo-800"
          onClick={() => navigate('/examens/createExam')}>
            <Plus className="h-6 w-5 mr-2" />
            Nouvel examen
          </Button>
        </div>
      </div>
      {/* Messages de succès */}
    {successMessage && (
      <Alert className="animate-fadeIn mb-4">
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>{successMessage}</AlertDescription>
      </Alert>
    )}
      {/* Messages d'erreur */}
      {error && (
        <Alert variant="destructive" className="animate-fadeIn">
          <XCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Filtres */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Filtres</CardTitle>
              <CardDescription>
                Filtrez et triez la liste des examens
              </CardDescription>
            </div>
            {selectedExamens.size > 0 && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkPublish(true)}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Publier la sélection
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkPublish(false)}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Dépublier la sélection
                </Button>
                <Button
            variant="destructive"
            size="sm"
            onClick={handleDeleteMultiple}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Supprimer la sélection
          </Button>
              </div>
            )}
            {modalSuppression.isOpen && (
  <AlertDialog 
    open={modalSuppression.isOpen} 
    onOpenChange={(open) => {
      if (!open) handleCancelDelete();
    }}
  >
    <AlertDialogContent>
      <AlertDialogTitle>
        {modalSuppression.suppressionMultiple 
          ? "Supprimer les examens sélectionnés ?" 
          : "Supprimer cet examen ?"}
      </AlertDialogTitle>
      
      <AlertDialogDescription>
        {modalSuppression.suppressionMultiple
          ? `Voulez-vous vraiment supprimer les ${selectedExamens.size} examens sélectionnés ? Cette action est irréversible.`
          : "Voulez-vous vraiment supprimer cet examen ? Cette action est irréversible."}
      </AlertDialogDescription>

      <AlertDialogAction>
        <button
          onClick={handleCancelDelete}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg mr-2"
        >
          Annuler
        </button>
        <button
          onClick={handleConfirmDelete}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg"
        >
          Supprimer
        </button>
      </AlertDialogAction>
    </AlertDialogContent>
  </AlertDialog>
)}
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-gray-500" />
              <Input
                placeholder="Rechercher par titre..."
                value={filters.nom_matiere}
                onChange={(e) => setFilters(prev => ({ ...prev, nom_matiere: e.target.value }))}
              />
            </div>
          </div>
          <Select
            value={filters.status}
            onChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
          >
            <SelectTrigger>
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Tous">Tous les examens</SelectItem>
              <SelectItem value="Publiés">Publiés</SelectItem>
              <SelectItem value="Non publiés">Non publiés</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={filters.sortBy}
            onChange={(value) => setFilters(prev => ({ ...prev, sortBy: value }))}
          >
            <SelectTrigger>
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Date">Date</SelectItem>
              <SelectItem value="Titre">Titre</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Liste des examens */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des examens</CardTitle>
          <CardDescription>
            {sortedAndFilteredExamens.length} résultat(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
        <ScrollArea
              className="h-[600px] pr-4 
              scrollbar-thin 
              scrollbar-track-white 
              scrollbar-thumb-gray-800 
              hover:scrollbar-thumb-gray-600"
            type="always"
           >
            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : sortedAndFilteredExamens.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-2" />
                <p>Aucun examen ne correspond à vos critères</p>
                {filters.title && (
                  <Button
                    variant="link"
                    onClick={() => setFilters(prev => ({ ...prev, title: '' }))}
                  >
                    Réinitialiser la recherche
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {debug && (
        <div className="mb-4 p-4 bg-gray-100 rounded">
          <pre className="text-xs">
            {JSON.stringify(debug, null, 2)}
          </pre>
        </div>
      )}
   {sortedAndFilteredExamens.map((examen) => (
  <Card 
    key={examen.examen_id}
    style={{
      backgroundColor: selectedExamens.has(examen.examen_id) 
        ? 'rgb(240, 253, 244)' // Vert très clair correspondant à bg-green-50
        : 'white'
    }} 
    className={`p-4 transition-all duration-300 cursor-pointer ${
      selectedExamens.has(examen.examen_id) 
        ? 'ring-2 ring-green-200 bg-green-50 scale-[1.01] shadow-md'
        : 'hover:shadow-md hover:scale-[1.005]'
    }`}
    onClick={() => {
      const newSelected = new Set(selectedExamens);
      if (selectedExamens.has(examen.examen_id)) {
        newSelected.delete(examen.examen_id);
      } else {
        newSelected.add(examen.examen_id);
      }
      setSelectedExamens(newSelected);
    }}
  >
    <div className="flex justify-between items-start">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge 
            variant={examen.est_actif ? "success" : "secondary"}
            className="transition-colors"
          >
            {examen.est_actif ? 'Publié' : 'Brouillon'}
          </Badge>
          
          <Badge 
            variant="outline"
            className="flex items-center gap-1"
          >
            <Clock className="h-3 w-3" />
            {timeUntilExam(examen.date_passage)}
          </Badge>
        </div>
        <h3 className="font-semibold text-lg leading-tight">
          {examen.nom_matiere}
        </h3>
        <div className="text-sm text-gray-500 space-y-1">
          <p className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {formatDate(examen.date_passage)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant={examen.est_actif ? "destructive" : "success"}
          size="sm"
          className="transition-colors text-indigo-800"
          onClick={(e) => {
            e.stopPropagation();
            handlePublishToggle(examen.est_actif, examen.examen_id);
          }}
        >
          {examen.est_actif ? (
            <>
              <XCircle className="h-4 w-4 mr-2" />
              Dépublier
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Publier
            </>
          )}
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="border-transparent"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/examens/updateExam/${examen.examen_id}`);
          }}
        >
          <Edit2 className="h-4 w-4 text-green-600" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteOne(examen.examen_id);
          }}
          className="border-transparent"
        >
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </div>
    </div>

    <div className="mt-4 pt-4 border-t border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>Durée: {examen.duration || 0} minutes</span>
        </div>
      </div>
    </div>
  </Card>
))}

              </div>
            )}
          </ScrollArea>
      
        </CardContent>
      </Card>
    </div>
  );
};

export default Examens;