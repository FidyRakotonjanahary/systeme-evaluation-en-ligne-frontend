import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Badge } from '../components/ui/badge';
import { ScrollArea } from '../components/ui/scroll-area';
import { Separator } from '../components/ui/separator';
import { 
  Trash2, Plus, Save, Clock, Calendar, CheckCircle, 
  XCircle, Edit2, HelpCircle, RefreshCw, Loader2, BookOpen, GraduationCap
} from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateExamen = () => {
  const navigate = useNavigate();
  const [examens, setExamens] = useState({
    matiere_id: '',
    nom_matiere: '',
    parcours_niveau_id: '',
    duration: '',
    est_actif: false,
    maxTentative: 1,
    date_passage: '',
    questions: []
  });

  const [niveaux, setNiveaux] = useState([]);
  const [selectedNiveauId, setSelectedNiveauId] = useState('');
  const [selectedParcoursId, setSelectedParcoursId] = useState('');
  const [filteredParcours, setFilteredParcours] = useState([]);
  const [filteredMatieres, setFilteredMatieres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('info');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [questionSuccess, setQuestionSuccess] = useState(false);
  const [editingQuestionIndex, setEditingQuestionIndex] = useState(null);

  
  const [editingAnswers, setEditingAnswers] = useState(false);
  const [tempAnswers, setTempAnswers] = useState([]);

  const [currentQuestion, setCurrentQuestion] = useState({
    question_text: '',
    reponses: [ // Changer 'choices' en 'reponses'
      { reponse_text: '', est_correcte: false },
      { reponse_text: '', est_correcte: false }
    ]
  });

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [niveauxResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/niveaux'),
        ]);

        setNiveaux(niveauxResponse.data);
      } catch (err) {
        setError("Erreur lors du chargement des données");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch parcours when niveau is selected
  useEffect(() => {
    const fetchParcours = async () => {
      if (!selectedNiveauId) return;
      try {
        const response = await axios.get(`http://localhost:5000/api/parcours/niveau/${selectedNiveauId}`);
        setFilteredParcours(response.data);
        setSelectedParcoursId('');
        setExamens(prev => ({
          ...prev,
          matiere_id: '',
          nom_matiere: ''
        }));
      } catch (error) {
        setError("Erreur lors du chargement des parcours");
      }
    };

    fetchParcours();
  }, [selectedNiveauId]);

  // Fetch matieres when parcours is selected
  useEffect(() => {
    const fetchMatieres = async () => {
      if (!selectedNiveauId || !selectedParcoursId) {
        setFilteredMatieres([]);  // Réinitialiser les matières si pas de sélection
        return;
      }
      
      try {
        const matieresResponse = await axios.get(
          `http://localhost:5000/api/matieres/${selectedNiveauId}/${selectedParcoursId}`,
          {
            headers: {
              'x-auth-token': localStorage.getItem('token')
            }
          }
        );
        
        setFilteredMatieres(matieresResponse.data.data || []);
        
        // Réinitialiser la matière sélectionnée
        setExamens(prev => ({
          ...prev,
          matiere_id: '',
          nom_matiere: ''
        }));
        
        // Récupération du parcours_niveau_id
        const parcoursNiveauResponse = await axios.get(
          `http://localhost:5000/api/parcours-niveaux/get-id`,
          {
            params: {
              parcours_id: selectedParcoursId,
              niveau_id: selectedNiveauId
            },
            headers: {
              'x-auth-token': localStorage.getItem('token')
            }
          }
        );
        
        const pnId = parcoursNiveauResponse.data.data.parcours_niveau_id;
        setExamens(prev => ({
          ...prev,
          parcours_niveau_id: pnId
        }));
        
      } catch (error) {
        console.error('Erreur détaillée:', error);
        setError(error.response?.data?.message || "Erreur lors du chargement des matières");
        setFilteredMatieres([]); // Réinitialiser en cas d'erreur
      }
    };
    fetchMatieres();
  }, [selectedNiveauId, selectedParcoursId]);

  const handleCorrectAnswerToggle = (index) => {
    setCurrentQuestion(prev => ({
      ...prev,
      reponses: prev.reponses.map((reponse, i) => 
        i === index ? { ...reponse, est_correcte: !reponse.est_correcte } : reponse
      )
    }));
  };

  const handleQuestionSubmit = () => {
    const validationError = validateQuestion(currentQuestion);
    if (validationError) {
      setError(validationError);
      setTimeout(() => setError(null), 3000);
      return;
    }
  setExamens(prev => ({
    ...prev,
    questions: editingQuestionIndex !== null
      ? prev.questions.map((q, index) => 
          index === editingQuestionIndex ? currentQuestion : q
        )
      : [...prev.questions, currentQuestion]
  }));


  setCurrentQuestion({
    question_text: '',
    reponses: [
      { reponse_text: '', est_correcte: false },
      { reponse_text: '', est_correcte: false }
    ]
  });
  setEditingQuestionIndex(null);
  setQuestionSuccess(true);
  setTimeout(() => setQuestionSuccess(false), 3000);
};

// Fonction pour annuler l'édition
const cancelEditing = () => {
  setEditingQuestionIndex(null);
  setCurrentQuestion({
    reponse_text: '',
    reponses: [
      { reponse_text: '', est_correcte: false },
      { reponse_text: '', est_correcte: false }
    ]
  });
};
const startEditingQuestion = (questionIndex) => {
  const questionToEdit = examens.questions[questionIndex];
  setCurrentQuestion({...questionToEdit});
  setEditingQuestionIndex(questionIndex);
  setActiveTab('questions');
};
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 3000); // Disparaît après 3 secondes

      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
        navigate('/examens');
      }, 2000); // Disparaît après 2 secondes

      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  useEffect(() => {
    if (questionSuccess) {
      const timer = setTimeout(() => {
        setQuestionSuccess(false);
      }, 2000); // Disparaît après 2 secondes

      return () => clearTimeout(timer);
    }
  }, [questionSuccess]);

  const handleExamenChange = (e) => {
    const { name, value } = e.target;
    setExamens(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStatusToggle = () => {
    setExamens(prev => ({
      ...prev,
      est_actif: !prev.est_actif
    }));
  };

  const handleQuestionTextChange = (e) => {
    setCurrentQuestion(prev => ({
      ...prev,
      question_text: e.target.value
    }));
  };
 
  
  const handleChoiceChange = (index, e) => {
    const { value } = e.target;
    setCurrentQuestion(prev => ({
      ...prev,
      reponses: prev.reponses.map((reponse, i) => 
        i === index ? { ...reponse, reponse_text: value } : reponse // Corriger 'choice' en 'reponse'
      )
    }));
  };


  const addChoice = () => {
    setCurrentQuestion(prev => ({
      ...prev,
      reponses: [...prev.reponses, { reponse_text: '', est_correcte: false }]
    }));
  };

  const removeChoice = (index) => {
    if (currentQuestion.reponses.length <= 2) return;
    setCurrentQuestion(prev => ({
      ...prev,
      reponses: prev.reponses.filter((_, i) => i !== index)
    }));
  };
  const validateQuestion = (question) => {
    if (!question.question_text.trim()) return "Le texte de la question est requis";
    if (question.reponses.length < 2) return "Au moins deux choix sont requis";
    if (!question.reponses.some(reponse => reponse.est_correcte)) {
      return "Au moins une réponse correcte est requise";
    }
    if (question.reponses.some(reponse => !reponse.reponse_text.trim())) {
      return "Tous les choix doivent avoir un texte";
    }
    return null;
  };  
  // Validation
  const validateExamens = () => {
    if (!examens.matiere_id) return "La matière est requise";
    if (!examens.parcours_niveau_id) return "Le parcours et niveau sont requis";
    if (!examens.duration) return "La durée de l'examen est requise";
    if (!examens.date_passage) return "La date de passage est requise";
    if (examens.questions.length === 0) return "L'examen doit contenir au moins une question";
    return null;
  };
  const removeQuestion = (index) => {
    setExamens(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  const handleNiveauChange = (niveauId) => {
    setSelectedNiveauId(niveauId);
  };
  
  const handleParcoursChange = (parcoursId) => {
    setSelectedParcoursId(parcoursId);
  };
  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationError = validateExamens();
    if (validationError) {
      setError(validationError);
      setTimeout(() => setError(null), 1500);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const examensData = {
        ...examens,
        duration: parseInt(examens.duration),
        date_passage: new Date(examens.date_passage).toISOString(),
        maxTentative: parseInt(examens.maxTentative),
        questions: examens.questions.map(question => ({
          question_text: question.question_text,
          reponses: question.reponses.map(reponse => ({
            reponse_text: reponse.reponse_text,
            est_correcte: reponse.est_correcte
          }))
        }))
      };

      await axios.post(
        'http://localhost:5000/api/examens',
        examensData,
        {
          headers: {
            'x-auth-token': localStorage.getItem('token')
          }
        }
      ); 
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 2000);
      navigate('/examen');
      
    }catch (err) {
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error ||
                          "Une erreur est survenue lors de la création de l'examen";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Selection Components
   const SelectionComponents = () => (
    <div className="flex gap-4 w-full mb-6">
      <div className="w-1/3">
        <Label htmlFor="niveau">Niveau</Label>
        <select
          id="niveau"
          className="w-full p-2 border rounded mt-1"
          value={selectedNiveauId}
          onChange={(e) => handleNiveauChange(e.target.value ? parseInt(e.target.value) : '')}
        >
          <option value="">Sélectionner un niveau</option>
          {niveaux.map((niveau) => (
            <option key={niveau.niveau_id} value={niveau.niveau_id}>
              {niveau.nom_niveau}
            </option>
          ))}
        </select>
      </div>

      <div className="w-1/3">
        <Label htmlFor="parcours">Parcours</Label>
        <select
          id="parcours"
          className="w-full p-2 border rounded mt-1"
          value={selectedParcoursId}
          onChange={(e) => handleParcoursChange(e.target.value ? parseInt(e.target.value) : '')}
          disabled={!selectedNiveauId}
        >
          <option value="">Sélectionner un parcours</option>
          {filteredParcours.map((parcour) => (
            <option key={parcour.parcours_id} value={parcour.parcours_id}>
              {parcour.nom_parcours}
            </option>
          ))}
        </select>
      </div>

      <div className="w-1/3">
        <Label htmlFor="matiere">Matière</Label>
        <select
          id="matiere"
          className="w-full p-2 border rounded mt-1"
          value={examens.matiere_id}
          onChange={(e) => {
            const matiereId = e.target.value;
            const selectedMatiere = filteredMatieres.find(
              m => m.matiere_id === parseInt(matiereId)
            );
            setExamens(prev => ({
              ...prev,
              matiere_id: matiereId,
              nom_matiere: selectedMatiere?.nom_matiere || ''
            }));
          }}
          disabled={!selectedNiveauId || !selectedParcoursId}
        >
          <option value="">Sélectionner une matière</option>
          {filteredMatieres.map((matiere) => (
            <option key={matiere.matiere_id} value={matiere.matiere_id}>
              {matiere.nom_matiere}
            </option>
          ))}
        </select>
      </div>
    </div>
  );


  return (
    <div className="flex-1 ml-64 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Création d'un examen</h1>
          <p className="text-gray-500">
            {examens.questions.length} question(s) • {examens.est_actif ? 'Actif' : 'Inactif'}
            {examens.nom_matiere && ` • ${examens.nom_matiere}`}
          </p>
        </div>
        <Button 
          onClick={handleSubmit} 
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          {isSubmitting ? 'Sauvegarde...' : 'Sauvegarder'}
        </Button>
      </div>
    {/* Messages d'erreur */}
      {error && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {showSuccess && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription>Examen créé avec succès!</AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="info" className="flex items-center">
            <Edit2 className="h-4 w-4 mr-2" />
            Informations
          </TabsTrigger>
          <TabsTrigger value="questions" className="flex items-center">
            <HelpCircle className="h-4 w-4 mr-2" />
            Questions ({examens.questions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle>Informations de l'examen</CardTitle>
              <CardDescription>
                Configurez les paramètres généraux de l'examen
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <SelectionComponents />

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="duration">
                    <Clock className="h-4 w-4 inline mr-2" />
                    Durée (minutes)
                  </Label>
                  <Input
                    id="duration"
                    name="duration"
                    type="number"
                    value={examens.duration}
                    onChange={handleExamenChange}
                    placeholder="90"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date_passage">
                    <Calendar className="h-4 w-4 inline mr-2" />
                    Date de passage
                  </Label>
                  <Input
                    id="date_passage"
                    name="date_passage"
                    type="datetime-local"
                    value={examens.date_passage}
                    onChange={handleExamenChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxTentative">
                    <RefreshCw className="h-4 w-4 inline mr-2" />
                    Nombre de tentatives
                  </Label>
                  <Input
                    id="maxTentative"
                    name="maxTentative"
                    type="number"
                    min="1"
                    value={examens.maxTentative}
                    onChange={handleExamenChange}
                    placeholder="1"
                  />
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Statut de l'examen</h3>
                  <p className="text-sm text-gray-500">
                    L'examen sera disponible une fois activé
                  </p>
                </div>
                <Switch
                  checked={examens.est_actif}
                  onCheckedChange={handleStatusToggle}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="questions">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Liste des questions */}
            <Card>
              <CardHeader>
                <CardTitle>Questions existantes</CardTitle>
                <CardDescription>
                  Liste des questions déjà créées
                </CardDescription>
              </CardHeader>
              <CardContent>
              <ScrollArea className="h-[600px] pr-4">
      <div className="space-y-4">
        {examens.questions.map((question, qIndex) => (
          <Card key={qIndex} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge>Question {qIndex + 1}</Badge>
                  <Badge variant="secondary">
                    {question.reponses.filter(c => c.est_correcte).length} réponse(s) correcte(s)
                  </Badge>
                </div>
                <p className="font-medium mb-2">{question.question_text}</p>
                <ul className="space-y-2">
                  {question.reponses.map((reponse, cIndex) => (
                    <li key={cIndex} className="flex items-center gap-2">
                      {reponse.est_correcte ? 
                        <CheckCircle className="h-4 w-4 text-green-600" /> :
                        <XCircle className="h-4 w-4 text-red-400" />
                      }
                      <span className={reponse.est_correcte ? "text-green-600" : ""}>{reponse.reponse_text}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => startEditingQuestion(qIndex)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeQuestion(qIndex)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
        {examens.questions.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <HelpCircle className="h-12 w-12 mx-auto mb-2" />
            <p>Aucune question n'a été créée pour cet examen</p>
          </div>
        )}
      </div>
    </ScrollArea>
  );

              </CardContent>
            </Card>

            {/* Formulaire nouvelle question */}
            <Card>
      <CardHeader>
        <CardTitle>
          {editingQuestionIndex !== null 
            ? `Modifier la question ${editingQuestionIndex + 1}` 
            : 'Nouvelle question'}
        </CardTitle>
        <CardDescription>
          {editingQuestionIndex !== null 
            ? 'Modifier les détails de la question existante'
            : 'Créer une nouvelle question à choix multiples'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="questionText">Texte de la question</Label>
            <Input
              id="questionText"
              value={currentQuestion.question_text}
              onChange={handleQuestionTextChange}
              placeholder="Saisissez votre question ici"
              className="mt-1"
            />
          </div>

          <div className="space-y-3">
            <Label>Choix multiples</Label>
            {currentQuestion.reponses.map((reponse, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={reponse.reponse_text}
                  onChange={(e) => handleChoiceChange(index, e)}
                  placeholder={`Choix ${index + 1}`}
                  className="flex-1"
                />
                <div className="flex items-center gap-2">
                  <Switch
                    id={`correct-${index}`}
                    checked={reponse.est_correcte}
                    onCheckedChange={() => handleCorrectAnswerToggle(index)}
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeChoice(index)}
                    disabled={currentQuestion.reponses.length <= 2}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addChoice}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un choix
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleQuestionSubmit}
              disabled={!currentQuestion.question_text.trim()}
              className="flex-1"
            >
              {editingQuestionIndex !== null ? (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Mettre à jour
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter
                </>
              )}
            </Button>
            {editingQuestionIndex !== null && (
              <Button
                variant="outline"
                onClick={cancelEditing}
                className="flex-1"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Annuler
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CreateExamen;