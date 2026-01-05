import { useState, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

const PhoneInput = ({ register, setValue, name, errors, required = false, placeholder = "123 456 789", trigger, defaultValue = '' }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState('CZ')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isValid, setIsValid] = useState(null) // null = nevyplněno, true = valid, false = invalid

  const countries = [
    {
      code: 'CZ',
      name: 'Česká republika',
      prefix: '+420',
      flag: '🇨🇿',
      pattern: /^[0-9]{9}$/,
      format: (num) => num.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3'),
      placeholder: '123 456 789'
    },
    {
      code: 'SK',
      name: 'Slovensko',
      prefix: '+421',
      flag: '🇸🇰',
      pattern: /^[0-9]{9}$/,
      format: (num) => num.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3'),
      placeholder: '123 456 789'
    }
  ]

  const selectedCountryData = countries.find(c => c.code === selectedCountry)

  // Inicializace z defaultValue při načtení komponenty
  useEffect(() => {
    if (defaultValue && String(defaultValue).trim()) {
      // Parsování existující hodnoty
      const phoneRegex = /^\+(\d{1,4})\s(.+)$/
      const match = String(defaultValue).match(phoneRegex)
      
      if (match) {
        const prefix = `+${match[1]}`
        const number = match[2].replace(/\D/g, '')
        
        // Najdi zemi podle prefixu
        const country = countries.find(c => c.prefix === prefix)
        if (country) {
          setSelectedCountry(country.code)
          setPhoneNumber(number)
          setIsValid(country.pattern.test(number))
        }
      }
    }
  }, [defaultValue])

  const handleCountrySelect = (country) => {
    setSelectedCountry(country.code)
    setIsOpen(false)
    
    // Aktualizace hodnoty s novou předvolbou
    if (phoneNumber) {
      const cleanNumber = phoneNumber.replace(/\D/g, '')
      if (cleanNumber && country.pattern.test(cleanNumber)) {
        const formattedNumber = country.format(cleanNumber)
        const fullNumber = `${country.prefix} ${formattedNumber}`
        setValue(name, fullNumber)
      }
    }
  }

  const handlePhoneChange = async (e) => {
    let value = e.target.value.replace(/\D/g, '') // Pouze číslice
    
    // Povolení delšího čísla pro volnější editaci
    if (value.length > 12) {
      value = value.substring(0, 12)
    }

    setPhoneNumber(value)

    if (value.length === 0) {
      setValue(name, '')
      setIsValid(required ? false : null)
      if (trigger) await trigger(name)
      return
    }

    // Formátování podle vybrané země
    const country = countries.find(c => c.code === selectedCountry)
    if (country) {
      const formattedNumber = country.format(value)
      const fullNumber = `${country.prefix} ${formattedNumber}`
      setValue(name, fullNumber)
      
      // Realtime validace
      const isPhoneValid = country.pattern.test(value)
      setIsValid(isPhoneValid)
      
      // Spuštění validace v React Hook Form
      if (trigger) await trigger(name)
    }
  }

  const validatePhone = (value) => {
    if (!value && required) {
      return 'Telefonní číslo je povinné'
    }
    
    if (!value) return true

    // Extrakce čísla bez předvolby
    const match = String(value).match(/^\+42[01]\s(.+)$/)
    if (!match) {
      return 'Neplatný formát telefonního čísla'
    }

    const numberPart = match[1].replace(/\s/g, '')
    const country = countries.find(c => String(value).startsWith(c.prefix))
    
    if (!country) {
      return 'Nepodporovaná předvolba'
    }

    if (!country.pattern.test(numberPart)) {
      return `${country.name === 'Česká republika' ? 'České' : 'Slovenské'} telefonní číslo musí mít 9 číslic`
    }

    return true
  }

  // Inicializace při načtení existující hodnoty
  useEffect(() => {
    const currentValue = register(name, { validate: validatePhone }).value
    if (currentValue) {
      const match = String(currentValue).match(/^\+42([01])\s(.+)$/)
      if (match) {
        const countryCode = match[1] === '0' ? 'CZ' : 'SK'
        const numberPart = match[2].replace(/\s/g, '')
        setSelectedCountry(countryCode)
        setPhoneNumber(numberPart)
      }
    }
  }, [])

  return (
    <div className="space-y-1">
      <div className="flex">
        {/* Dropdown pro výběr země */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={`flex items-center justify-between h-12 px-3 py-2 bg-white border rounded-l-md hover:border-gray-400 focus:outline-none focus:ring-2 transition-colors min-w-[120px] ${
              errors[name] 
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                : isValid === true 
                  ? 'border-green-500 focus:border-green-500 focus:ring-green-500'
                  : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
            }`}
          >
            <div className="flex items-center space-x-2">
              <span className="text-lg">{selectedCountryData.flag}</span>
              <span className="text-sm font-medium text-gray-700">{selectedCountryData.prefix}</span>
            </div>
            <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {isOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
              {countries.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => handleCountrySelect(country)}
                  className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="text-lg">{country.flag}</span>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{country.name}</div>
                    <div className="text-xs text-gray-500">{country.prefix}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Input pro telefonní číslo */}
        <input
          type="tel"
          className={`flex-1 h-12 px-3 py-2 border border-l-0 rounded-r-md focus:outline-none focus:ring-2 transition-colors ${
            errors[name] 
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
              : isValid === true 
                ? 'border-green-500 focus:border-green-500 focus:ring-green-500'
                : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
          }`}
          placeholder={selectedCountryData.placeholder}
          value={selectedCountryData.format(phoneNumber || '')}
          onChange={handlePhoneChange}
          maxLength={15} // Více místa pro editaci
        />
      </div>

      {/* Chybová zpráva */}
      {errors[name] && (
        <p className="text-red-500 text-sm">{errors[name].message}</p>
      )}
      
      {/* Nápověda */}
      <p className="text-gray-500 text-xs">
        Zadejte 9místné telefonní číslo bez předvolby
      </p>

      {/* Skrytý input pro registraci s React Hook Form */}
      <input
        type="hidden"
        {...register(name, { validate: validatePhone })}
      />
    </div>
  )
}

export default PhoneInput
