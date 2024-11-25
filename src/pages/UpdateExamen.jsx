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
  XCircle, Edit2, HelpCircle, RefreshCw, Loader2
} from 'lucide-react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const UpdateExamens = () => {
  const navigate = useNavigate();
  const { examen_id } = useParams();
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
  const [editingQuestionIndex, setEditingQuestionIndex] = useState(null);

  const [currentQuestion, setCurrentQuestion] = useState({
    question_text: '',
    reponses: [
      { reponse_text: '', est_correcte: false },
      { reponse_text: '', est_correcte: false }
    ]
  });

  // Chargement des détails de l'examen
  useEffect(() => {
    const fetchExamDetails = async () => {
      try {
        const [examResponse, niveauxResponse] = await Promise.all([
          axios.get(`http://localhost:5000/api/examens/${examen_id}`, {
            headers: { 'x-auth-token': localStorage.getItem('token') }
          }),
          axios.get('http://localhost:5000/api/niveaux')
        ]);
        
        const examData = examResponse.data.data;
        const formattedDate = new Date(examData.date_passage).toLocaleString('sv-SE', { 
          year: 'numeric', 
          month: '2-digit', 
          day: '2-digit', 
          hour: '2-digit', 
          minute: '2-digit', 
          hour12: false 
        }).replace(' ', 'T');
        setExamens({
          ...examData,
          date_passage: formattedDate
        });
        setNiveaux(niveauxResponse.data);
        setSelectedNiveauId(examData.niveau_id);
        setSelectedParcoursId(examData.parcours_id);
        
        await Promise.all([
          fetchParcours(examData.niveau_id),
          examData.niveau_id && examData.parcours_id 
            ? fetchMatieres(examData.niveau_id, examData.parcours_id)
            : null
        ]);

      } catch (err) {
        setError("Erreur lors du chargement des détails de l'examen");
      } finally {
        setLoading(false);
      }
    };

    fetchExamDetails();
  }, [examen_id]);

  // Récupération des parcours
  const fetchParcours = async (niveauId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/parcours/niveau/${niveauId}`);
      setFilteredParcours(response.data);
    } catch (error) {
      setError("Erreur lors du chargement des parcours");
    }
  };

  // Récupération des matières
  const fetchMatieres = async (niveauId, parcoursId) => {
      if (!niveauId || !parcoursId) {
        console.error('ID de niveau ou de parcours manquant');
        return;
      }
      
    
    try {
      const matieresResponse = await axios.get(
        `http://localhost:5000/api/matieres/${niveauId}/${parcoursId}`,
        {
          headers: { 'x-auth-token': localStorage.getItem('token') }
        }
      );
      
      setFilteredMatieres(matieresResponse.data.data || []);
    } catch (error) {
      setError("Erreur lors du chargement des matières");
    }
  };

  // Gestion des changements de formulaire
  const handleExamenChange = (e) => {
    const { name, value } = e.target;
    setExamens(prev => ({ ...prev, [name]: value }));
  };

  // Activation/désactivation de l'examen
  const handleStatusToggle = (checked) => {
    setExamens(prev => ({ ...prev, est_actif: checked }));
  };

  // Gestion du texte de la question
  const handleQuestionTextChange = (e) => {
    setCurrentQuestion(prev => ({ ...prev, question_text: e.target.value }));
  };

  // Gestion des choix de réponse
  const handleChoiceChange = (index, e) => {
    const newReponses = [...currentQuestion.reponses];
    newReponses[index].reponse_text = e.target.value;
    setCurrentQuestion(prev => ({ ...prev, reponses: newReponses }));
  };

  // Basculement de la réponse correcte
  const handleCorrectAnswerToggle = (index) => {
    const newReponses = [...currentQuestion.reponses];
    newReponses[index].est_correcte = !newReponses[index].est_correcte;
    setCurrentQuestion(prev => ({ ...prev, reponses: newReponses }));
  };

  // Ajout d'un choix de réponse
  const addChoice = () => {
    setCurrentQuestion(prev => ({
      ...prev,
      reponses: [...prev.reponses, { reponse_text: '', est_correcte: false }]
    }));
  };

  // Suppression d'un choix de réponse
  const removeChoice = (index) => {
    if (currentQuestion.reponses.length > 2) {
      const newReponses = currentQuestion.reponses.filter((_, i) => i !== index);
      setCurrentQuestion(prev => ({ ...prev, reponses: newReponses }));
    }
  };

  // Validation d'une question
  const validateQuestion = (question) => {
    if (!question.question_text.trim()) return "Le texte de la question est requis";
    if (question.reponses.filter(r => r.est_correcte).length === 0) return "Au moins une réponse doit être correcte";
    return null;
  };

  // Soumission d'une question
  const handleQuestionSubmit = () => {
    const validationError = validateQuestion(currentQuestion);
    if (validationError) {
      setError(validationError);
      return;
    }

    const newQuestions = [...examens.questions];
    if (editingQuestionIndex !== null) {
      newQuestions[editingQuestionIndex] = currentQuestion;
    } else {
      newQuestions.push(currentQuestion);
    }

    setExamens(prev => ({ ...prev, questions: newQuestions }));
    resetQuestionForm();
  };

  // Début de l'édition d'une question
  const startEditingQuestion = (index) => {
    setEditingQuestionIndex(index);
    setCurrentQuestion(examens.questions[index]);
  };

  // Annulation de l'édition
  const cancelEditing = () => {
    setEditingQuestionIndex(null);
    resetQuestionForm();
  };

  // Suppression d'une question
  const removeQuestion = (index) => {
    const newQuestions = examens.questions.filter((_, i) => i !== index);
    setExamens(prev => ({ ...prev, questions: newQuestions }));
  };

  // Réinitialisation du formulaire de question
  const resetQuestionForm = () => {
    setCurrentQuestion({
      question_text: '',
      reponses: [
        { reponse_text: '', est_correcte: false },
        { reponse_text: '', est_correcte: false }
      ]
    });
    setEditingQuestionIndex(null);
  };

  // Validation de l'examen
  const validateExamens = () => {
    if (!examens.matiere_id) return "Sélectionnez une matière";
    if (!examens.duration) return "La durée est requise";
    if (!examens.date_passage) return "La date de passage est requise";
    if (examens.questions.length === 0) return "Aucune question n'a été ajoutée";
    return null;
  };

  // Soumission de l'examen
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationError = validateExamens();
    if (validationError) {
      setError(validationError);
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
        questions: examens.questions
      };

      await axios.put(
        `http://localhost:5000/api/examens/${examen_id}`,
        examensData,
        {
          headers: {
            'x-auth-token': localStorage.getItem('token')
          }
        }
      ); 
      
      setShowSuccess(true);
      setTimeout(() => {
        navigate('/examens');
      }, 2000);
      
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error ||
                          "Une erreur est survenue lors de la modification de l'examen";
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
          <h1 className="text-2xl font-bold">Modification d'un examen</h1>
          <p className="text-gray-500">
  {examens?.questions?.length || 0} question(s) • {examens?.est_actif ? 'Actif' : 'Inactif'}
  {examens?.nom_matiere && ` • ${examens.nom_matiere}`}
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
          {isSubmitting ? 'Modification...' : 'Modifier'}
        </Button>
      </div>

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
            Questions ({examens?.questions?.length || 0})
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

export default UpdateExamens;



