// Utility funkce pro určení statusu validace pole

/**
 * Získá CSS třídy pro input na základě chyb a hodnoty
 * @param {Object} errors - Chyby z React Hook Form
 * @param {string} fieldName - Název pole
 * @param {any} value - Hodnota pole
 * @param {boolean} required - Je pole povinné?
 * @returns {string} CSS třídy
 */
export const getInputClassName = (errors, fieldName, value, required = false) => {
  const baseClasses = 'form-input transition-colors'
  
  // Pokud je chyba, červený rámeček
  if (errors[fieldName]) {
    return `${baseClasses} border-red-500 focus:border-red-500 focus:ring-red-500`
  }
  
  // Pokud je pole vyplněné a nepovinné, nebo povinné a vyplněné správně
  if (value && value.toString().trim() !== '') {
    // Pro povinná pole - zelený pouze pokud je vyplněné
    // Pro nepovinná pole - zelený pokud je vyplněné
    return `${baseClasses} border-green-500 focus:border-green-500 focus:ring-green-500`
  }
  
  // Defaultní stav
  return `${baseClasses} border-gray-300 focus:border-primary-500 focus:ring-primary-500`
}

/**
 * Získá CSS třídy pro textarea na základě chyb a hodnoty
 */
export const getTextareaClassName = (errors, fieldName, value, required = false) => {
  const baseClasses = 'form-textarea transition-colors'
  
  if (errors[fieldName]) {
    return `${baseClasses} border-red-500 focus:border-red-500 focus:ring-red-500`
  }
  
  if (value && value.toString().trim() !== '') {
    return `${baseClasses} border-green-500 focus:border-green-500 focus:ring-green-500`
  }
  
  return `${baseClasses} border-gray-300 focus:border-primary-500 focus:ring-primary-500`
}

/**
 * Získá CSS třídy pro select na základě chyb a hodnoty
 */
export const getSelectClassName = (errors, fieldName, value, required = false) => {
  const baseClasses = 'form-select transition-colors'
  
  if (errors[fieldName]) {
    return `${baseClasses} border-red-500 focus:border-red-500 focus:ring-red-500`
  }
  
  if (value && value.toString().trim() !== '') {
    return `${baseClasses} border-green-500 focus:border-green-500 focus:ring-green-500`
  }
  
  return `${baseClasses} border-gray-300 focus:border-primary-500 focus:ring-primary-500`
}
