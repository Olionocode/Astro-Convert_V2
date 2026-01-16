import React, { useState, useMemo } from 'react';

// Constantes astronomiques normalisées (source : IAU / NASA)
const units = [
  {
    category: 'Distances humaines',
    units: [
      {
        name: 'Kilomètre (km)',
        explanation: "Le Kilomètre est une unité de mesure de distance équivalente à 1 000 mètres. Il est couramment utilisé pour exprimer des distances sur Terre.",
        conversionFactor: 1000 // mètres
      },
      {
        name: 'Million de kilomètres (10^6 km)',
        explanation: "Un Million de kilomètres est une unité de mesure de distance équivalente à 1 000 000 de kilomètres. Il est utilisé pour exprimer de grandes distances dans le système solaire.",
        conversionFactor: 1e9 // mètres
      },
      {
        name: 'Milliard de kilomètres (10^9 km)',
        explanation: "Un Milliard de kilomètres est une unité de mesure de distance équivalente à 1 000 000 000 de kilomètres. Il est utilisé pour exprimer des distances interplanétaires.",
        conversionFactor: 1e12 // mètres
      }
    ]
  },
  {
    category: 'Astronomie du système solaire',
    units: [
      {
        name: 'Unité Astronomique (UA)',
        explanation: "L'Unité Astronomique est la distance moyenne de la Terre au Soleil, soit environ 149,6 millions de kilomètres. Elle est utilisée pour exprimer les distances au sein de notre système solaire.",
        conversionFactor: 149597870700 // mètres
      }
    ]
  },
  {
    category: 'Astronomie stellaire',
    units: [
      {
        name: 'Rayon solaire (R☉)',
        explanation: "Le Rayon solaire est une unité de distance utilisée pour exprimer la taille des étoiles. Un rayon solaire est égal à 695 700 kilomètres.",
        conversionFactor: 695700000 // mètres, source: NASA
      }
    ]
  },
  {
    category: 'Astronomie interstellaire',
    units: [
      {
        name: 'Année-Lumière (al)',
        explanation: "Une Année-Lumière est la distance que la lumière parcourt dans le vide en une année julienne. Elle est utilisée pour exprimer les distances astronomiques en dehors du système solaire.",
        conversionFactor: 9.460730472e15 // mètres
      },
      {
        name: 'Parsec (pc)',
        explanation: "Un Parsec est la distance à laquelle une unité astronomique sous-tend un angle d'une seconde d'arc. Il est couramment utilisé en astronomie pour mesurer de grandes distances vers des objets astronomiques en dehors du système solaire.",
        conversionFactor: 3.085677581e16 // mètres
      }
    ]
  }
];

// Fonction pure pour convertir une valeur donnée en toutes les unités
const convertToAllUnits = (value, fromUnit) => {
  const valueInMeters = value * fromUnit.conversionFactor;
  return units.flatMap(category => category.units.map(unit => ({
    name: unit.name,
    value: valueInMeters / unit.conversionFactor
  })));
};

// Fonction de formatage des nombres selon la convention française
const formatNumberFR = (number) => {
  const [integerPart, decimalPart] = number.toFixed(4).split('.');
  return integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ',' + decimalPart;
};

function App() {
  const [value, setValue] = useState('');
  const [selectedUnit, setSelectedUnit] = useState(units[0].units[0]);
  const [error, setError] = useState('');

  const handleConversion = (e) => {
    const inputValue = e.target.value;
    if (inputValue === '' || isNaN(inputValue) || parseFloat(inputValue) < 0) {
      setError('Veuillez entrer une valeur numérique positive.');
      setValue('');
    } else {
      setError('');
      setValue(inputValue);
    }
  };

  const handleUnitChange = (e) => {
    const selectedUnitName = e.target.value;
    const unit = units.flatMap(category => category.units).find(unit => unit.name === selectedUnitName);
    setSelectedUnit(unit);
    setValue(''); // Reset value when unit changes
    setError(''); // Clear error when unit changes
  };

  // Utilisation de useMemo pour éviter les recalculs inutiles
  const conversionResults = useMemo(() => {
    if (value && !error) {
      return convertToAllUnits(value, selectedUnit);
    }
    return [];
  }, [value, selectedUnit, error]);

  return (
    <div className="container">
      <div className="section input-section">
        <h1>Convertisseur d'Unités Astronomiques</h1>
        <div className="unit">
          <h2>{selectedUnit.name}</h2>
          <p>{selectedUnit.explanation}</p>
          <label htmlFor="valueInput">Valeur à convertir (unité sélectionnée ci-dessous)</label>
          <input
            id="valueInput"
            type="number"
            value={value}
            onChange={handleConversion}
            placeholder={`Entrez la valeur en ${selectedUnit.name}`}
          />
          {error && <p className="error">{error}</p>}
          <label htmlFor="unitSelect">Unité à convertir :</label>
          <select id="unitSelect" value={selectedUnit.name} onChange={handleUnitChange}>
            {units.flatMap(category => category.units).map(unit => (
              <option key={unit.name} value={unit.name}>{unit.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="section results-section">
        {conversionResults.length > 0 && (
          <div className="results">
            <h3>Résultats de Conversion (approximations scientifiques) :</h3>
            <ul>
              {conversionResults.map(result => (
                <li key={result.name}>
                  <span className="value">{formatNumberFR(result.value)}</span>
                  <span className="unit-name">{result.name}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="sources">
          <h3>Sources et Références :</h3>
          <ul>
            <li>International Astronomical Union (2012)</li>
            <li>NASA – Units of Distance</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
