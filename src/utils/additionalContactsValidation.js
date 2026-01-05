// Validation schema updates for additional contacts
// Add this to your existing validation schema

export const additionalContactsValidation = {
  additionalContacts: {
    validate: (contacts) => {
      if (!contacts || !Array.isArray(contacts)) return true;
      
      // Check if there's more than one primary contact
      const primaryContacts = contacts.filter(contact => contact.isPrimary);
      if (primaryContacts.length > 1) {
        return 'Můžete označit pouze jeden kontakt jako primární';
      }
      
      // Validate each contact
      for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i];
        
        // Name is required if contact exists
        if (contact.name || contact.phone || contact.email || contact.position) {
          if (!contact.name || String(contact.name).trim() === '') {
            return `Jméno je povinné pro kontakt #${i + 1}`;
          }
        }
        
        // Email validation if provided
        if (contact.email && String(contact.email).trim() !== '') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(contact.email)) {
            return `Neplatný email u kontaktu #${i + 1}`;
          }
        }
        
        // Phone validation if provided
        if (contact.phone && String(contact.phone).trim() !== '') {
          const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
          if (!phoneRegex.test(contact.phone)) {
            return `Neplatné telefonní číslo u kontaktu #${i + 1}`;
          }
        }
      }
      
      return true;
    }
  }
};

// Enhanced form validation with MERK API data
export const merkApiEnhancedValidation = {
  companyName: {
    required: 'Název společnosti je povinný',
    minLength: {
      value: 2,
      message: 'Název společnosti musí mít alespoň 2 znaky'
    }
  },
  
  ico: {
    required: 'IČO je povinné',
    pattern: {
      value: /^\d{8}$/,
      message: 'IČO musí obsahovat přesně 8 číslic'
    },
    validate: {
      checksum: (value) => {
        // Czech IČO checksum validation
        if (!value || value.length !== 8) return true;
        
        const digits = value.split('').map(Number);
        const weights = [8, 7, 6, 5, 4, 3, 2];
        
        let sum = 0;
        for (let i = 0; i < 7; i++) {
          sum += digits[i] * weights[i];
        }
        
        const remainder = sum % 11;
        let checkDigit;
        
        if (remainder < 2) {
          checkDigit = remainder;
        } else {
          checkDigit = 11 - remainder;
        }
        
        return digits[7] === checkDigit || 'Neplatné IČO (kontrolní součet)';
      }
    }
  },
  
  dic: {
    pattern: {
      value: /^(CZ|SK)?\d{8,10}$/,
      message: 'DIČ musí být ve formátu CZ12345678 nebo 12345678'
    }
  }
};

// Usage example in FormStep1.jsx:
/*
const { register, formState: { errors }, setValue, control, trigger, watch } = useFormContext({
  mode: 'onChange',
  defaultValues: {
    additionalContacts: []
  }
});

// Register additional contacts validation
useEffect(() => {
  register('additionalContacts', additionalContactsValidation.additionalContacts);
}, [register]);
*/
