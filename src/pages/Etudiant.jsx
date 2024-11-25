import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Card, CardHeader, CardTitle, CardContent
} from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
  TableBody
} from '../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { 
  Trash2, Plus, Edit2, Search, UserPlus, Loader2, XCircle, CheckCircle
} from 'lucide-react';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Separator } from '../components/ui/separator';
import { ScrollArea } from '../components/ui/scroll-area';
import { Select } from '../components/ui/select';
import { Navigate } from 'react-router-dom';
import { ConfirmDelete } from '../components/ui/confirmDelete';


// Composant StudentForm
const StudentForm = ({ studentToEdit = null, onSuccess, onCancel }) => {
  const [mentions, setMentions] = useState([]);
  const [parcours, setParcours] = useState([]);
  const [niveaux, setNiveaux] = useState([]);
  const [selectedMention, setSelectedMention] = useState('');
  const [selectedParcours, setSelectedParcours] = useState('');
  const [selectedNiveau, setSelectedNiveau] = useState('');
  const [parcoursNiveauId, setParcoursNiveauId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    matricule: '',
    nom: '',
    prenom: '',
    email: '',
    parcours_niveau_id: null
  });
  useEffect(() => {
    // Lors du chargement initial, afficher le loader
    setLoading(true);

    // Simuler une opération de chargement
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    // Nettoyer le timer lors du démontage du composant
    return () => clearTimeout(timer);
  }, []);
  // Charger les données de l'étudiant si en mode édition
  useEffect(() => {
    if (studentToEdit) {
      const fetchStudentData = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/students/${studentToEdit.etudiant_id}`, {
            headers: { 'x-auth-token': localStorage.getItem('token') }
          });
          const data = response.data;
          
          setFormData({
            matricule: data.matricule,
            nom: data.nom,
            prenom: data.prenom,
            email: data.email,
          });
          
          setSelectedMention(data.mention_id);
          setSelectedParcours(data.parcours_id);
          setSelectedNiveau(data.niveau_id);
        } catch (error) {
          setError('Erreur lors du chargement des données');
        }
      };

      fetchStudentData();
    }
  }, [studentToEdit]);

  // Charger les mentions
  useEffect(() => {
    const fetchMentions = async () => {
      try {
        // Simulé - remplacer par un vrai appel API
        const response = await fetch('http://localhost:5000/api/mentions');
        const data = await response.json();
        setMentions(data);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors du chargement des mentions:', error);
        setLoading(false);
      }
    };

    fetchMentions();
  }, []);

  // Charger les parcours quand une mention est sélectionnée
  useEffect(() => {
    const fetchParcours = async () => {
      if (selectedMention) {
        try {
          // Simulé - remplacer par un vrai appel API
          const response = await fetch(`http://localhost:5000/api/parcours/${selectedMention}`);
          const data = await response.json();
          setParcours(data);
        } catch (error) {
          console.error('Erreur lors du chargement des parcours:', error);
        }
      } else {
        setParcours([]);
      }
    };

    fetchParcours();
  }, [selectedMention]);

  // Charger les niveaux quand un parcours est sélectionné
  useEffect(() => {
    const fetchNiveaux = async () => {
      if (selectedParcours) {
        try {
          // Simulé - remplacer par un vrai appel API
          const response = await fetch(`http://localhost:5000/api/niveaux/${selectedParcours}`);
          const data = await response.json();
          setNiveaux(data);
        } catch (error) {
          console.error('Erreur lors du chargement des niveaux:', error);
        }
      } else {
        setNiveaux([]);
      }
    };

    fetchNiveaux();
  }, [selectedParcours]);

  // Obtenir le parcours_niveau_id
  useEffect(() => {
    const fetchParcoursNiveauId = async () => {
      if (selectedParcours && selectedNiveau) {
        try {
          const response = await fetch(`http://localhost:5000/api/parcours-niveaux/get-id?parcours_id=${selectedParcours}&niveau_id=${selectedNiveau}`);
          const data = await response.json();
          setParcoursNiveauId(data);
          // Mettre à jour formData avec le nouveau parcours_niveau_id
          setFormData(prev => ({
            ...prev,
            parcours_niveau_id: data.data.parcours_niveau_id
          }));
        } catch (error) {
          console.error('Erreur lors de la récupération du parcours_niveau_id:', error);
        }
      }
    };

    fetchParcoursNiveauId();
  }, [selectedParcours, selectedNiveau]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const endpoint = studentToEdit 
        ? `http://localhost:5000/api/students/${studentToEdit.etudiant_id}`
        : 'http://localhost:5000/api/students';
      
      const method = studentToEdit ? 'PUT' : 'POST';
      
      const dataToSend = {
        ...formData,
        parcours_niveau_id: Number(formData.parcours_niveau_id)
      };

      const response = await axios({
        method,
        url: endpoint,
        data: dataToSend,
        headers: {
          'x-auth-token': localStorage.getItem('token'),
          'Content-Type': 'application/json',
        }
      });

      if (response.status === 200 || response.status === 201) {
        onSuccess();
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Une erreur est survenue');
    }
  };


  const handleCancel = (e) => {
    e.preventDefault();
    onCancel(); // Appel du callback d'annulation
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[600px]">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {studentToEdit ? 'Modifier un étudiant' : 'Ajouter un étudiant'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Matricule</label>
              <input
                type="text"
                className="w-full border rounded p-2"
                value={formData.matricule}
                onChange={(e) => setFormData({...formData, matricule: e.target.value})}
                required
                disabled={!!studentToEdit} // Désactivé en mode édition
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Nom</label>
              <input
                type="text"
                className="w-full border rounded p-2"
                value={formData.nom}
                onChange={(e) => setFormData({...formData, nom: e.target.value})}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Prénom</label>
              <input
                type="text"
                className="w-full border rounded p-2"
                value={formData.prenom}
                onChange={(e) => setFormData({...formData, prenom: e.target.value})}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                className="w-full border rounded p-2"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Mention</label>
              <select
                className="w-full border rounded p-2"
                value={selectedMention}
                onChange={(e) => {
                  setSelectedMention(e.target.value);
                  setSelectedParcours('');
                  setSelectedNiveau('');
                }}
                required
              >
                <option value="">Sélectionner une mention</option>
                {mentions.map(mention => (
                  <option key={mention.mention_id} value={mention.mention_id}>
                    {mention.nom_mention}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Parcours</label>
              <select
                className="w-full border rounded p-2"
                value={selectedParcours}
                onChange={(e) => {
                  setSelectedParcours(e.target.value);
                  setSelectedNiveau('');
                }}
                required
                disabled={!selectedMention}
              >
                <option value="">Sélectionner un parcours</option>
                {parcours.map(p => (
                  <option key={p.parcours_id} value={p.parcours_id}>
                    {p.nom_parcours}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Niveau</label>
              <select
                className="w-full border rounded p-2"
                value={selectedNiveau}
                onChange={(e) => setSelectedNiveau(e.target.value)}
                required
                disabled={!selectedParcours}
              >
                <option value="">Sélectionner un niveau</option>
                {niveaux.map(niveau => (
                  <option key={niveau.niveau_id} value={niveau.niveau_id}>
                    {niveau.nom_niveau}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              {studentToEdit ? 'Modifier' : 'Ajouter'}
              
            </button>
            <button
              type="button"
              className="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
              onClick={onCancel}
            >
              Annuler
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

// Composant StudentTable
const StudentTable = ({ students, onEdit, onDelete }) => {// Vérifier les données reçues

  if (!students || students.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[600px]">
        <p>Aucun étudiant à afficher</p>
        <p className="text-sm text-gray-500">
          Nombre d'étudiants: {students ? students.length : 'undefined'}
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Matricule</TableHead>
          <TableHead>Nom</TableHead>
          <TableHead>Prénom</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Parcours</TableHead>
          <TableHead>Niveau</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {students.map((student) => (
          <TableRow key={student.etudiant_id}>
            <TableCell>{student.matricule}</TableCell>
            <TableCell>{student.nom}</TableCell>
            <TableCell>{student.prenom}</TableCell>
            <TableCell>{student.email}</TableCell>
            <TableCell>{student.nom_parcours}</TableCell>
            <TableCell>{student.nom_niveau}</TableCell>
            <TableCell>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(student)}
                >
                  <Edit2 className="h-4 w-4 text-green-600" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(student.etudiant_id)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

// Composant principal Etudiant
const Etudiant = () => {
  const [students, setStudents] = useState([]);
  const [parcoursNiveaux, setParcoursNiveaux] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    matricule: '',
    nom: '',
    prenom: '',
    email: '',
    parcours_niveau_id: ''
  });
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const token = localStorage.getItem('token') || '';

  useEffect(() => {
  if (!token) {
    setError("Token manquant");
    return;
  }
  fetchStudents();
}, [token]);

  const [isLoading, setIsLoading] = useState(true);

const fetchStudents = async () => {
  setIsLoading(true);
  try {
    const config = {
      headers: { 'x-auth-token': localStorage.getItem('token') }
    };
    const response = await axios.get('http://localhost:5000/api/students', config);
    setStudents(response.data || []); // Assurez-vous d'avoir un tableau vide si response.data est null
  } catch (error) {
    console.error(error);
    setError("Erreur lors du chargement des étudiants");
    setStudents([]); // En cas d'erreur, définir un tableau vide
  } finally {
    setIsLoading(false);
  }
};

  const fetchParcoursNiveaux = async () => {
    try {
      const config = {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      };
      const response = await axios.get('http://localhost:5000/api/students/parcours-niveau', config);
      setParcoursNiveaux(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearchQueryChange = (e) => {
    setSearchQuery(e.target.value);
    setIsSearchLoading(true);
    setTimeout(() => {
      setIsSearchLoading(false);
    }, 500);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddSuccess = async () => {
    // Fermer le modal
    setShowAddDialog(false);
    
    // Rafraîchir la liste des étudiants
    await fetchStudents();
    
    // Afficher le message de succès
    setShowSuccess(true);
    
    // Masquer le message après 3 secondes
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  const handleDeleteClick = (studentId) => {
    setStudentToDelete(studentId);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const config = {
        headers: { 'x-auth-token': token }
      };
      await axios.delete(`http://localhost:5000/api/students/${studentToDelete}`, config);
      await fetchStudents();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      setError("Erreur lors de la suppression");
    } finally {
      setIsDeleteModalOpen(false);
      setStudentToDelete(null);
    }
  };

  const handleEditSuccess = async () => {
    await fetchStudents(); // Recharger la liste des étudiants
    setShowEditDialog(false);
    setEditingStudent(null);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleEditClick = (student) => {
    setEditingStudent(student);
    setShowEditDialog(true);
  };
  const handleInitEdit = (student) => {
    setEditingStudent(student);
    setShowEditDialog(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const config = {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };
      await axios.put(`http://localhost:5000/api/etudiants/${editingStudent.etudiant_id}`, formData, config);
      await fetchStudents();
      setShowEditDialog(false);
      setEditingStudent(null);
      setFormData({
        matricule: '',
        nom: '',
        prenom: '',
        email: '',
        parcours_niveau_id: ''
      });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la modification");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Modifiez la partie du filtrage pour ajouter une vérification
const filteredStudents = students.filter((student) => {
  return Object.values(student).some((value) => {
    const result = String(value).toLowerCase().includes(searchQuery.toLowerCase());
    return result;
  });
});

  return (
    <div className="flex-1 ml-64 p-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Liste des étudiants</CardTitle>
            <div className="flex gap-2">
              <Input 
                placeholder="Rechercher un étudiant..." 
                className="w-64"
                value={searchQuery}
                onChange={handleSearchQueryChange}
              />
              {isSearchLoading ? (
                <Button disabled>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Recherche en cours...
                </Button>
              ) : (
                <Button onClick={() => setShowAddDialog(true)}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Ajouter
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        
        {showSuccess && (
          <Alert className="mx-6 mt-2">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>Opération réussie !</AlertDescription>
          </Alert>
        )}
        
        <CardContent>
          <ScrollArea className="h-[600px]">
            {isLoading ? (
              <div className="flex justify-center items-center h-[600px]">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <StudentTable 
                students={filteredStudents}
                onEdit={handleInitEdit}
                onDelete={handleDeleteClick}
              />
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Modal de confirmation de suppression */}
      {isDeleteModalOpen && (
        <ConfirmDelete
          title="Supprimer l'étudiant ?"
          message="Cette action est irréversible"
          onConfirm={handleConfirmDelete}
          onCancel={() => {
            setIsDeleteModalOpen(false);
            setStudentToDelete(null);
          }}
        />
      )}

<Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un étudiant</DialogTitle>
          </DialogHeader>
          <StudentForm 
            onSuccess={handleAddSuccess}
            onCancel={() => setShowAddDialog(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier un étudiant</DialogTitle>
          </DialogHeader>
          <StudentForm 
            studentToEdit={editingStudent}
            onSuccess={handleEditSuccess}
            onCancel={() => {
              setShowEditDialog(false);
              setEditingStudent(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Etudiant;