import { useState, useEffect } from 'react';

/**
 * Un hook personnalisé qui crée une version debounced d'une valeur.
 * 
 * @param {any} value - La valeur à debouncer
 * @param {number} delay - Le délai en millisecondes avant que la valeur ne soit mise à jour
 * @returns {any} La valeur debouncée
 * 
 * @example
 * const SearchComponent = () => {
 *   const [searchTerm, setSearchTerm] = useState('');
 *   const debouncedSearchTerm = useDebounce(searchTerm, 300);
 * 
 *   useEffect(() => {
 *     // Cet effet ne s'exécutera que lorsque debouncedSearchTerm change
 *     searchAPI(debouncedSearchTerm);
 *   }, [debouncedSearchTerm]);
 * 
 *   return (
 *     <input
 *       value={searchTerm}
 *       onChange={(e) => setSearchTerm(e.target.value)}
 *     />
 *   );
 * };
 */
function useDebounce(value, delay = 500) {
  // État pour stocker la valeur debouncée
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Créer un timeout pour mettre à jour la valeur debouncée
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Nettoyer le timeout si la valeur change avant que le délai ne soit passé
    // ou si le composant est démonté
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]); // Ne réexécuter l'effet que si value ou delay change

  return debouncedValue;
}

export default useDebounce;