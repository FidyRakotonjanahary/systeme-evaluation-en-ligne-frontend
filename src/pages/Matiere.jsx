import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Trash2, Pencil, PlusCircle } from 'lucide-react';

const Matiere = () => {
  const [token, setToken] = useState(null);
  const [niveaux, setNiveaux] = useState([]);
  const [parcours, setParcours] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [selectedNiveauId, setSelectedNiveauId] = useState(null);
  const [selectedParcoursId, setSelectedParcoursId] = useState(null);
  const [parcoursNiveauId, setParcoursNiveauId] = useState(null);
  const [editingMatiereId, setEditingMatiereId] = useState(null);
  const [assignedMatieres, setAssignedMatieres] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMaterialName, setNewMaterialName] = useState('');
  const storedToken = localStorage.getItem('token');
  
  useEffect(() => {
    if (storedToken) {
      setToken(storedToken);
    } else {
      window.location.href = '/login';
    }
  }, []);

  // Fetch niveaux
  useEffect(() => {
    const fetchNiveaux = async () => {
      if (!token) return;
      
      try {
        const response = await fetch('http://localhost:5000/api/niveaux');
        const data = await response.json();
        setNiveaux(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des niveaux:', error);
      }
    };

    fetchNiveaux();
  }, [token]);

  // Fetch parcours when niveau is selected
  useEffect(() => {
    const fetchParcours = async () => {
      if (!token || !selectedNiveauId) return;
      
      try {
        const response = await fetch(`http://localhost:5000/api/parcours/niveau/${selectedNiveauId}`);
        const data = await response.json();
        setParcours(data);
        setSelectedParcoursId(null);
      } catch (error) {
        console.error('Erreur lors de la récupération des parcours:', error);
      }
    };

    fetchParcours();
  }, [selectedNiveauId, token]);

  const getSelectedNiveauName = () => {
    const niveau = niveaux.find(n => n.niveau_id === selectedNiveauId);
    return niveau ? niveau.nom_niveau : "Sélectionner un niveau";
  };

  const getSelectedParcoursName = () => {
    const parcour = parcours.find(p => p.parcours_id === selectedParcoursId);
    return parcour ? parcour.nom_parcours : "Sélectionner un parcours";
  };

  // Fetch assigned matieres
  useEffect(() => {
    const fetchAssignedMatieres = async () => {
      
      if (!selectedNiveauId || !selectedParcoursId || !token) {
        return;
      }
      try {
        const response = await fetch(`http://localhost:5000/api/matieres/${selectedNiveauId}/${selectedParcoursId}`, {
          method: 'GET',  
        headers: {
            'x-auth-token': storedToken
          }
        });
        const responseData = await response.json();
        setAssignedMatieres(Array.isArray(responseData.data) ? responseData.data : []);
 
        // Récupération du parcours_niveau_id
          const responsePNID = await fetch(`http://localhost:5000/api/parcours-niveaux/get-id?parcours_id=${selectedParcoursId}&niveau_id=${selectedNiveauId}`);
          const parcoursNiveauData = await responsePNID.json();
          setParcoursNiveauId(parcoursNiveauData.data.parcours_niveau_id);
      } catch (error) {
        console.error('Erreur lors de la récupération des matières assignées:', error);
      }
    };
    if (selectedNiveauId && selectedParcoursId && token) {
      fetchAssignedMatieres();
    }
  }, [selectedNiveauId, selectedParcoursId, token]);

 

  const addMaterial = async () => {
    if (!token || !selectedNiveauId || !selectedParcoursId || !newMaterialName || !parcoursNiveauId) {
      console.error('Données manquantes pour l\'ajout de matière');
      return;
    }  
    try {
     
  
      // Ajout de la nouvelle matière
      const addResponse = await fetch(`http://localhost:5000/api/matieres`, {
        method: 'POST',
        headers: {
          'x-auth-token': storedToken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          parcours_niveau_id: parcoursNiveauId,
          nom_matiere: newMaterialName
        })
      });
      if (!addResponse.ok) {
      throw new Error(`HTTP error! status: ${addResponse.status}`);
    }
  
      const newMaterial = await addResponse.json();
      setAssignedMatieres([...assignedMatieres, newMaterial]);
      setNewMaterialName('');
      setShowAddForm(false);
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la matière :', error);
    }
  };

  const updateMatiere = async (currentMatiereId, newNomMatiere) => {
    if (!token || !editingMatiereId) return;
  
    try {
      const response = await fetch(`http://localhost:5000/api/matieres/${editingMatiereId}`, {
        method: 'PUT',
        headers: {
          'x-auth-token': storedToken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nom_matiere: newNomMatiere })
      });
  
      const updatedMatiere = await response.json();
  
      // Mettre à jour la liste des matières assignées avec les nouveaux détails
      setAssignedMatieres(
        assignedMatieres.map((matiere) =>
          matiere.matiere_id === editingMatiereId
            ? { ...matiere, nom_matiere: updatedMatiere.nom_matiere }
            : matiere
        )
      );
      setEditingMatiereId(null);
    } catch (error) {
      console.error('Erreur lors de la modification de la matière :', error);
    }
  };
  const deleteMatiere = async (matiereId) => {
    if (!token || !selectedNiveauId || !selectedParcoursId) return;

    try {
      await fetch(`http://localhost:5000/api/matieres/${matiereId}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': storedToken
        }
      });

      setAssignedMatieres(assignedMatieres.filter(matiere => matiere.matiere_id !== matiereId));
    } catch (error) {
      console.error('Erreur lors de la suppression de la matière:', error);
    }
  };


  return (
    <div className="flex-1 ml-64 p-6">
    <h1 className="text-2xl font-bold mb-4">Gestion des matières</h1>
    <div className="flex justify-between gap-4 mb-4">
      <div className="flex gap-4 w-full">
        <div className="w-1/4">
          <select 
            className="w-full p-2 border rounded"
            value={selectedNiveauId || ""} 
            onChange={(e) => setSelectedNiveauId(parseInt(e.target.value))}
          >
            <option value="">Sélectionner un niveau</option>
            {niveaux.map((niveau) => (
              <option 
                key={niveau.niveau_id} 
                value={niveau.niveau_id}
              >
                {niveau.nom_niveau}
              </option>
            ))}
          </select>
        </div>
        <div className="w-1/4">
          <select
            className="w-full p-2 border rounded"
            value={selectedParcoursId || ""}
            onChange={(e) => setSelectedParcoursId(parseInt(e.target.value))}
            disabled={!selectedNiveauId}
          >
            <option value="">Sélectionner un parcours</option>
            {parcours.map((parcour) => (
              <option 
                key={parcour.parcours_id} 
                value={parcour.parcours_id}
              >
                {parcour.nom_parcours}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1"></div>
        <button
    className={`
        flex items-center 
        font-bold py-2 px-4 rounded 
        ${!selectedNiveauId || !selectedParcoursId 
            ? 'bg-gray-400 text-white cursor-not-allowed' 
            : 'bg-green-500 hover:bg-green-700 text-white'
        }
    `}
    onClick={() => setShowAddForm(!showAddForm)}
    disabled={!selectedNiveauId || !selectedParcoursId}
>
    <PlusCircle className="h-5 w-5 mr-2" />
    Nouveau
</button>
      </div>
    </div>
    {( !selectedNiveauId  || !selectedParcoursId) && (
    <div className="text-gray-400 mb-4 flex items-center justify-center">
        Veuillez sélectionner un niveau et un parcours pour afficher les matières assignées.
    </div>
  )}

    {selectedNiveauId && selectedParcoursId && (
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>
            {getSelectedParcoursName()} - {getSelectedNiveauName()}
          </CardTitle>
        </CardHeader>
        <CardContent>
        <ul>
    {assignedMatieres.map((matiere) => (
      <React.Fragment key={matiere.matiere_id}>
      
    <li key={matiere.matiere_id} className="flex items-center justify-between py-2">
      {editingMatiereId === matiere.matiere_id ? (
        <input
          type="text"
          className="w-full mr-4 p-2 border rounded"
          defaultValue={matiere.nom_matiere}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              updateMatiere(matiere.matiere_id, e.target.value);
              setEditingMatiereId(null);
            }
          }}
          onBlur={(e) => {
            updateMatiere(matiere.matiere_id, e.target.value);
            setEditingMatiereId(null);
          }}
        />
      ) : (
        <span>{matiere.nom_matiere}</span>
      )}
      <div className="flex gap-2">
        <button
          className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => setEditingMatiereId(matiere.matiere_id)}
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => deleteMatiere(matiere.matiere_id)}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </li>
    </React.Fragment>
      ))}
        <li className="flex items-center justify-between py-2">
        {showAddForm && (
  <li className="flex items-center justify-between py-2">
    <input
      type="text"
      className="w-full mr-4 p-2 border rounded"
      placeholder="Ajouter une nouvelle matière"
      value={newMaterialName}
      onChange={(e) => setNewMaterialName(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          addMaterial();
          setShowAddForm(false);
          setNewMaterialName('');
        }
      }}
    />
    <div className="flex gap-2">
      <button
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => {
          addMaterial();
          setShowAddForm(false);
          setNewMaterialName('');
        }}
      >
        <PlusCircle className="h-4 w-4" />
      </button>
    </div>
  </li>
)}
        </li>
        </ul> 
        </CardContent>
      </Card>
    )}
  </div>
);
};

export default Matiere;