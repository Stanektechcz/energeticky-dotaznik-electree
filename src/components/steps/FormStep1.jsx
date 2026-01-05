import { useFormContext, useWatch } from 'react-hook-form'
import { User, Building, Phone, Mail, MapPin } from 'lucide-react'
import { useState, useEffect } from 'react'
import { validateEmail } from '../../utils/validation'
import { getInputClassName } from '../../utils/fieldStyles'
import PhoneInput from '../PhoneInput'
import CompanyDetailsDisplay from '../CompanyDetailsDisplay'

// Helper function for local address suggestions (fallback)
const generateLocalAddressSuggestions = (value) => {
    const czechCities = [
        'Praha', 'Brno', 'Ostrava', 'Plzeň', 'Liberec', 'Olomouc', 'Ústí nad Labem', 'České Budějovice',
        'Hradec Králové', 'Pardubice', 'Zlín', 'Havířov', 'Kladno', 'Most', 'Opava', 'Frýdek-Místek',
        'Karviná', 'Jihlava', 'Teplice', 'Děčín', 'Karlovy Vary', 'Jablonec nad Nisou', 'Mladá Boleslav',
        'Prostějov', 'Přerov', 'Česká Lípa', 'Třebíč', 'Uherské Hradiště', 'Kroměříž', 'Tábor'
    ]
    
    const lowerValue = value.toLowerCase()
    return czechCities
        .filter(city => city.toLowerCase().includes(lowerValue))
        .map(city => `${value}, ${city}`)
        .slice(0, 5)
}

const FormStep1 = () => {
    const { register, formState: { errors }, setValue, control, trigger, watch, getValues } = useFormContext()
    const [addressSuggestions, setAddressSuggestions] = useState([])
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [additionalContacts, setAdditionalContacts] = useState([])

    // Watch values pro realtime validaci
    const companyName = watch('companyName')
    const contactPerson = watch('contactPerson')
    const email = watch('email')
    const phone = watch('phone')
    const address = watch('address')
    const companyAddress = watch('companyAddress')
    const sameAsCompanyAddress = watch('sameAsCompanyAddress')

    // Watch for "other" customer type
    const customerTypeOther = useWatch({
        control,
        name: 'customerType.other'
    })

    // Automatické odkliknutí checkboxu při změně adresy odběrného místa
    useEffect(() => {
        if (sameAsCompanyAddress && address && companyAddress && address !== companyAddress) {
            setValue('sameAsCompanyAddress', false)
        }
    }, [address, companyAddress, sameAsCompanyAddress, setValue])

    // Synchronizace dodatečných kontaktů s react-hook-form
    useEffect(() => {
        setValue('additionalContacts', additionalContacts)
    }, [additionalContacts, setValue])

    // Funkce pro přidání další kontaktní osoby
    const addAdditionalContact = () => {
        const newContact = {
            id: Date.now(),
            name: '',
            position: '',
            phone: '',
            email: '',
            isPrimary: false
        }
        setAdditionalContacts(prev => [...prev, newContact])
    }

    // Funkce pro odebrání kontaktní osoby
    const removeAdditionalContact = (contactId) => {
        setAdditionalContacts(prev => prev.filter(contact => contact.id !== contactId))
    }

    // Funkce pro aktualizaci kontaktní osoby
    const updateAdditionalContact = (contactId, field, value) => {
        setAdditionalContacts(prev => 
            prev.map(contact => 
                contact.id === contactId ? { ...contact, [field]: value } : contact
            )
        )
    }

    return (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-4">
                    <User className="h-8 w-8 text-primary-600 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900">
                        Identifikační údaje zákazníka
                    </h2>
                </div>
                <p className="text-gray-600">
                    Zadejte prosím základní údaje o vaší společnosti nebo domácnosti
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Název společnosti */}
                <div className="md:col-span-2">
                    <label className="form-label">
                        <Building className="inline h-4 w-4 mr-2" />
                        Název společnosti / jméno
                    </label>
                    <input
                        type="text"
                        className={getInputClassName(errors, 'companyName', companyName, false)}
                        placeholder="Zadejte název společnosti nebo jméno"
                        {...register('companyName', {
                            onChange: () => trigger('companyName')
                        })}
                    />
                    {errors.companyName && (
                        <p className="text-red-500 text-sm mt-1">{errors.companyName.message}</p>
                    )}
                </div>

                {/* IČO */}
                <div>
                    <label className="form-label">
                        IČO
                    </label>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="12345678"
                        {...register('ico', {
                            onChange: async (e) => {
                                const ico = e.target.value.replace(/\s/g, '')
                                if (ico.length === 8 && /^\d{8}$/.test(ico)) {
                                    try {
                                        // Automatické načtení údajů z MERK API přes backend
                                        console.log('Volám MERK API pro IČO:', ico)
                                        const response = await fetch(`/company-lookup.php?ico=${ico}`)
                                        
                                        console.log('Response status:', response.status)
                                        console.log('Response headers:', response.headers)
                                        
                                        if (response.ok) {
                                            const result = await response.json()
                                            console.log('MERK API Response:', result)
                                            
                                            // Enhanced debugging for data structure
                                            if (result.debug) {
                                                console.log('Debug informace:', result.debug)
                                            }
                                            
                                            if (result.success && result.data) {
                                                const company = result.data

                                                console.log('Zpracovávám data společnosti:', company)
                                                console.log('Struktura company objektu:', Object.keys(company))

                                                // Automatické vyplnění názvu společnosti
                                                if (company.name) {
                                                    setValue('companyName', company.name)
                                                    console.log('Vyplněn název:', company.name)
                                                }

                                                // Automatické vyplnění DIČ
                                                if (company.dic) {
                                                    setValue('dic', company.dic)
                                                    console.log('Vyplněno DIČ:', company.dic)
                                                }

                                                // Vyplnění adresy společnosti
                                                if (company.address) {
                                                    setValue('companyAddress', company.address)
                                                    trigger('companyAddress')
                                                    console.log('Vyplněna adresa:', company.address)
                                                }

                                                // Pro OSVČ (bez DIČ) nastavíme kontaktní osobu stejnou jako název
                                                if (!company.dic && company.name) {
                                                    setValue('contactPerson', company.name)
                                                    console.log('Vyplněna kontaktní osoba pro OSVČ:', company.name)
                                                }

                                                // Uložení dodatečných informací pro zobrazení v detailu
                                                setValue('companyDetails', {
                                                    legal_form: company.legal_form || '',
                                                    estab_date: company.estab_date || '',
                                                    is_vatpayer: company.is_vatpayer || false,
                                                    status: company.status || '',
                                                    court: company.court || '',
                                                    court_file: company.court_file || '',
                                                    industry: company.industry || '',
                                                    magnitude: company.magnitude || '',
                                                    turnover: company.turnover || '',
                                                    years_in_business: company.years_in_business || '',
                                                    databox_id: company.databox_id || ''
                                                })

                                                // Pokusíme se extrahovat kontaktní osobu z osob ve společnosti
                                                if (company.raw_data && company.raw_data.body && company.raw_data.body.persons && company.raw_data.body.persons.length > 0) {
                                                    // Najdeme první osobu s rolí jednatel, ředitel nebo předseda
                                                    const importantRoles = ['jednatel', 'ředitel', 'předseda', 'člen představenstva'];
                                                    let contactPerson = null;

                                                    for (const person of company.raw_data.body.persons) {
                                                        const role = person.company_role ? person.company_role.toLowerCase() : '';
                                                        if (importantRoles.some(r => role.includes(r))) {
                                                            contactPerson = `${person.first_name} ${person.last_name}`;
                                                            break;
                                                        }
                                                    }

                                                    // Pokud nenajdeme důležitou roli, vezměme první osobu
                                                    if (!contactPerson && company.raw_data.body.persons.length > 0) {
                                                        const firstPerson = company.raw_data.body.persons[0];
                                                        contactPerson = `${firstPerson.first_name} ${firstPerson.last_name}`;
                                                    }

                                                    if (contactPerson) {
                                                        setValue('contactPerson', contactPerson);
                                                        console.log('Vyplněna kontaktní osoba:', contactPerson);
                                                    }
                                                }

                                                // Zpracování kontaktů z MERK raw_data
                                                if (company.raw_data && company.raw_data.emails && company.raw_data.emails.length > 0) {
                                                    const emailData = company.raw_data.emails[0];
                                                    console.log('Email data struktura:', emailData);
                                                    
                                                    // Email může být string nebo objekt s vlastností email/address
                                                    let emailAddress = '';
                                                    if (typeof emailData === 'string') {
                                                        emailAddress = emailData;
                                                    } else if (emailData && typeof emailData === 'object') {
                                                        emailAddress = emailData.email || emailData.address || emailData.value || '';
                                                    }
                                                    
                                                    console.log('Extrahovaná email adresa:', emailAddress);
                                                    
                                                    if (emailAddress && String(emailAddress).trim()) {
                                                        setValue('email', String(emailAddress).trim());
                                                        console.log('Vyplněn email do formuláře:', String(emailAddress).trim());
                                                    }
                                                }

                                                // Zpracování telefonů z MERK raw_data
                                                if (company.raw_data && company.raw_data.phones && company.raw_data.phones.length > 0) {
                                                    const phoneData = company.raw_data.phones[0];
                                                    console.log('Phone data struktura:', phoneData);
                                                    
                                                    // Telefon může být string nebo objekt s vlastností phone/number
                                                    let phoneNumber = '';
                                                    if (typeof phoneData === 'string') {
                                                        phoneNumber = phoneData;
                                                    } else if (phoneData && typeof phoneData === 'object') {
                                                        phoneNumber = phoneData.phone || phoneData.number || phoneData.value || '';
                                                    }
                                                    
                                                    console.log('Extrahované telefonní číslo:', phoneNumber);
                                                    
                                                    if (phoneNumber && String(phoneNumber).trim()) {
                                                        setValue('phone', String(phoneNumber).trim());
                                                        console.log('Vyplněn telefon do formuláře:', String(phoneNumber).trim());
                                                    }
                                                } else if (company.raw_data && company.raw_data.mobiles && company.raw_data.mobiles.length > 0) {
                                                    const mobileData = company.raw_data.mobiles[0];
                                                    console.log('Mobile data struktura:', mobileData);
                                                    
                                                    // Mobile může být string nebo objekt s vlastností phone/number
                                                    let mobileNumber = '';
                                                    if (typeof mobileData === 'string') {
                                                        mobileNumber = mobileData;
                                                    } else if (mobileData && typeof mobileData === 'object') {
                                                        mobileNumber = mobileData.phone || mobileData.number || mobileData.value || '';
                                                    }
                                                    
                                                    console.log('Extrahované mobilní číslo:', mobileNumber);
                                                    
                                                    if (mobileNumber && String(mobileNumber).trim()) {
                                                        setValue('phone', String(mobileNumber).trim());
                                                        console.log('Vyplněn mobil do formuláře:', String(mobileNumber).trim());
                                                    }
                                                }

                                                // Spuštění validace pro všechna vyplněná pole
                                                trigger(['companyName', 'dic', 'contactPerson', 'phone', 'email', 'companyAddress'])
                                                
                                                // Log pro uživatele
                                                console.log(`Automaticky vyplněny údaje pro ${company.name} z MERK API`)
                                            } else if (result.error) {
                                                console.error('Chyba MERK API:', result.message)
                                            } else {
                                                console.log('Společnost nebyla nalezena nebo nemá dostupná data')
                                            }
                                        } else {
                                            console.error('Chyba při načítání údajů společnosti - response not ok')
                                            console.error('Status:', response.status)
                                            const responseText = await response.text()
                                            console.error('Response text:', responseText)
                                        }
                                    } catch (error) {
                                        console.error('Chyba při načítání údajů společnosti:', error)
                                        console.error('Error type:', error.constructor.name)
                                        console.error('Error message:', error.message)
                                    }
                                }
                            }
                        })}
                    />
                </div>

                {/* DIČ */}
                <div>
                    <label className="form-label">
                        DIČ
                    </label>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="CZ12345678"
                        {...register('dic')}
                    />
                </div>

                {/* Kontaktní osoba */}
                <div>
                    <label className="form-label">
                        <User className="inline h-4 w-4 mr-2" />
                        Kontaktní osoba
                        <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                        type="text"
                        className={getInputClassName(errors, 'contactPerson', contactPerson, true)}
                        placeholder="Jméno a příjmení"
                        {...register('contactPerson', {
                            required: 'Kontaktní osoba je povinná',
                            onChange: () => trigger('contactPerson')
                        })}
                    />
                    {errors.contactPerson && (
                        <p className="text-red-500 text-sm mt-1">{errors.contactPerson.message}</p>
                    )}
                </div>

                {/* Telefon */}
                <div>
                    <label className="form-label">
                        <Phone className="inline h-4 w-4 mr-2" />
                        Telefon
                        <span className="text-red-500 ml-1">*</span>
                    </label>
                    <PhoneInput
                        register={register}
                        setValue={setValue}
                        name="phone"
                        errors={errors}
                        required={true}
                        trigger={trigger}
                        defaultValue={phone ? String(phone) : ''}
                    />
                </div>

                {/* Email */}
                <div>
                    <label className="form-label">
                        <Mail className="inline h-4 w-4 mr-2" />
                        E-mailová adresa
                        <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                        type="email"
                        className={getInputClassName(errors, 'email', email, true)}
                        placeholder="vas@email.cz"
                        {...register('email', {
                            required: 'E-mail je povinný',
                            validate: validateEmail,
                            onChange: () => trigger('email')
                        })}
                    />
                    {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                    <p className="text-gray-500 text-xs mt-1">
                        Ověřujeme existenci domény a platnost formátu
                    </p>
                </div>

                {/* Tlačítko pro přidání další kontaktní osoby */}
                <div>
                    <label className="form-label">
                        <Mail className="inline h-4 w-4 mr-2" />
                        Další kontakty
                        <span className="text-gray-400 ml-1">(volitelné)</span>
                    </label>
                    <button
                        type="button"
                        className="flex items-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-400 hover:bg-primary-50 transition-colors text-gray-600 hover:text-primary-600"
                        onClick={addAdditionalContact}
                    >
                        <User className="h-5 w-5 mr-2" />
                        Přidat další kontaktní osobu
                    </button>
                </div>

                {/* Dodatečné kontaktní osoby */}
                {additionalContacts.map((contact, index) => (
                    <div key={contact.id} className="md:col-span-2 p-4 border border-gray-200 rounded-lg bg-gray-50">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-lg font-medium text-gray-900">
                                Dodatečná kontaktní osoba #{index + 1}
                            </h4>
                            <button
                                type="button"
                                onClick={() => removeAdditionalContact(contact.id)}
                                className="text-red-500 hover:text-red-700 text-sm"
                            >
                                ✕ Odebrat
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="form-label">
                                    <User className="inline h-4 w-4 mr-2" />
                                    Jméno a příjmení
                                </label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Jméno a příjmení"
                                    value={contact.name}
                                    onChange={(e) => updateAdditionalContact(contact.id, 'name', e.target.value)}
                                />
                            </div>
                            
                            <div>
                                <label className="form-label">
                                    Pozice / funkce
                                </label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Např. Technický ředitel"
                                    value={contact.position}
                                    onChange={(e) => updateAdditionalContact(contact.id, 'position', e.target.value)}
                                />
                            </div>
                            
                            <div>
                                <label className="form-label">
                                    <Phone className="inline h-4 w-4 mr-2" />
                                    Telefon
                                </label>
                                <input
                                    type="tel"
                                    className="form-input"
                                    placeholder="+420 123 456 789"
                                    value={contact.phone}
                                    onChange={(e) => updateAdditionalContact(contact.id, 'phone', e.target.value)}
                                />
                            </div>
                            
                            <div>
                                <label className="form-label">
                                    <Mail className="inline h-4 w-4 mr-2" />
                                    E-mail
                                </label>
                                <input
                                    type="email"
                                    className="form-input"
                                    placeholder="email@firma.cz"
                                    value={contact.email}
                                    onChange={(e) => updateAdditionalContact(contact.id, 'email', e.target.value)}
                                />
                            </div>
                            
                            <div className="md:col-span-2">
                                <label className="flex items-center text-sm text-gray-600">
                                    <input
                                        type="checkbox"
                                        className="form-checkbox mr-2"
                                        checked={contact.isPrimary}
                                        onChange={(e) => {
                                            // Pokud označujeme jako primární, odoznačíme ostatní
                                            if (e.target.checked) {
                                                setAdditionalContacts(prev => 
                                                    prev.map(c => ({
                                                        ...c, 
                                                        isPrimary: c.id === contact.id
                                                    }))
                                                )
                                            } else {
                                                updateAdditionalContact(contact.id, 'isPrimary', false)
                                            }
                                        }}
                                    />
                                    Označit jako primární kontakt pro tento projekt
                                </label>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Adresa sídla firmy */}
                <div>
                    <label className="form-label">
                        <Building className="inline h-4 w-4 mr-2" />
                        Adresa sídla firmy
                    </label>
                    <input
                        type="text"
                        className={getInputClassName(errors, 'companyAddress', companyAddress, false)}
                        placeholder="Automaticky vyplněno podle IČ"
                        {...register('companyAddress')}

                    />
                    {errors.companyAddress && (
                        <p className="text-red-500 text-sm mt-1">{errors.companyAddress.message}</p>
                    )}
                    <p className="text-gray-500 text-xs mt-1">
                        Adresa se automaticky načte po zadání IČ
                    </p>
                </div>

                {/* Adresa odběrného místa */}
                <div className="relative">
                    <label className="form-label">
                        <MapPin className="inline h-4 w-4 mr-2" />
                        Adresa odběrného místa
                        <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                        type="text"
                        className={getInputClassName(errors, 'address', address, true)}
                        placeholder="Ulice a číslo popisné, město, PSČ"
                        {...register('address', {
                            required: 'Adresa je povinná',
                            onChange: async (e) => {
                                const value = e.target.value.trim()

                                if (value.length < 3) {
                                    setShowSuggestions(false)
                                    return
                                }

                                try {
                                    // Use Nominatim API for Czech and Slovak addresses
                                    const response = await fetch(
                                        `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=8&countrycodes=cz,sk&q=${encodeURIComponent(value)}`,
                                        {
                                            headers: {
                                                'User-Agent': 'Bateree-Formular/1.0'
                                            }
                                        }
                                    )

                                    if (response.ok) {
                                        const data = await response.json()
                                        const suggestions = data.map(item => {
                                            const addr = item.address
                                            const parts = []

                                            // Build address string
                                            if (addr.house_number && addr.road) {
                                                parts.push(`${addr.road} ${addr.house_number}`)
                                            } else if (addr.road) {
                                                parts.push(addr.road)
                                            }

                                            if (addr.city || addr.town || addr.village) {
                                                parts.push(addr.city || addr.town || addr.village)
                                            }

                                            if (addr.postcode) {
                                                parts.push(addr.postcode)
                                            }

                                            return parts.join(', ')
                                        }).filter(addr => addr.length > 0)

                                        setAddressSuggestions([...new Set(suggestions)].slice(0, 6))
                                        setShowSuggestions(suggestions.length > 0)
                                    }
                                } catch (error) {
                                    console.error('Chyba při načítání adres:', error)

                                    // Fallback to local suggestions
                                    const localSuggestions = generateLocalAddressSuggestions(value)
                                    setAddressSuggestions(localSuggestions)
                                    setShowSuggestions(localSuggestions.length > 0)
                                }
                            }
                        })}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                        onFocus={(e) => {
                            if (e.target.value.length >= 3) {
                                setShowSuggestions(addressSuggestions.length > 0)
                            }
                        }}
                        autoComplete="off"
                    />
                    {showSuggestions && addressSuggestions.length > 0 && (
                        <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto">
                            {addressSuggestions.map((suggestion, index) => (
                                <div
                                    key={index}
                                    className="px-4 py-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0 text-sm transition-colors"
                                    onClick={() => {
                                        setValue('address', suggestion)
                                        setShowSuggestions(false)
                                    }}
                                >
                                    <div className="flex items-center">
                                        <MapPin className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                                        <span className="text-gray-900">{suggestion}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    {errors.address && (
                        <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
                    )}

                    {/* Checkbox pro kopírování adresy ze sídla */}
                    <div className="mt-2">
                        <label className="flex items-center text-sm text-gray-600">
                            <input
                                type="checkbox"
                                className="form-checkbox mr-2"
                                {...register('sameAsCompanyAddress')}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        const companyAddress = getValues('companyAddress')
                                        if (companyAddress) {
                                            setValue('address', companyAddress)
                                            trigger('address')
                                        }
                                    } else {
                                        // Pokud odškrtneme, vymažeme adresu odběrného místa
                                        setValue('address', '')
                                        trigger('address')
                                    }
                                }}
                            />
                            Adresa odběrného místa je stejná jako sídlo firmy
                        </label>
                    </div>
                </div>

                {/* Zobrazení detailních informací o společnosti - celá šířka */}
                <div className="md:col-span-2">
                    <CompanyDetailsDisplay />
                </div>

                {/* Typ zákazníka */}
                <div className="md:col-span-2">
                    <label className="form-label mb-4">Typ zákazníka</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
                        <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                            <input
                                type="checkbox"
                                className="form-checkbox mr-3 text-primary-600"
                                {...register('customerType.industrial')}
                            />
                            <div>
                                <div className="font-medium text-gray-900">🏭 Průmysl</div>
                                <div className="text-xs text-gray-500">Výrobní společnosti</div>
                            </div>
                        </label>
                        <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                            <input
                                type="checkbox"
                                className="form-checkbox mr-3 text-primary-600"
                                {...register('customerType.commercial')}
                            />
                            <div>
                                <div className="font-medium text-gray-900">🏢 Komerční objekt</div>
                                <div className="text-xs text-gray-500">Obchody, kanceláře</div>
                            </div>
                        </label>
                        <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                            <input
                                type="checkbox"
                                className="form-checkbox mr-3 text-primary-600"
                                {...register('customerType.services')}
                            />
                            <div>
                                <div className="font-medium text-gray-900">🚚 Služby / Logistika</div>
                                <div className="text-xs text-gray-500">Doprava, sklady</div>
                            </div>
                        </label>
                        <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                            <input
                                type="checkbox"
                                className="form-checkbox mr-3 text-primary-600"
                                {...register('customerType.agriculture')}
                            />
                            <div>
                                <div className="font-medium text-gray-900">🌾 Zemědělství</div>
                                <div className="text-xs text-gray-500">Farmy, skleníky</div>
                            </div>
                        </label>
                        <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                            <input
                                type="checkbox"
                                className="form-checkbox mr-3 text-primary-600"
                                {...register('customerType.public')}
                            />
                            <div>
                                <div className="font-medium text-gray-900">🏛️ Veřejný sektor</div>
                                <div className="text-xs text-gray-500">Úřady, školy</div>
                            </div>
                        </label>
                        <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                            <input
                                type="checkbox"
                                className="form-checkbox mr-3 text-primary-600"
                                {...register('customerType.other')}
                            />
                            <div>
                                <div className="font-medium text-gray-900">❓ Jiný</div>
                                <div className="text-xs text-gray-500">Upřesněte níže</div>
                            </div>
                        </label>
                    </div>

                    {/* Conditional input for "Other" customer type */}
                    {customerTypeOther && (
                        <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                            <label className="form-label text-sm mb-2">
                                Upřesněte typ zákazníka
                                <span className="text-red-500 ml-1">*</span>
                            </label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Např: Zdravotnictví, IT sektor, Retail..."
                                {...register('customerType.otherSpecification', {
                                    required: customerTypeOther ? 'Upřesnění typu zákazníka je povinné' : false
                                })}
                            />
                            {errors.customerType?.otherSpecification && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.customerType.otherSpecification.message}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                <p className="text-blue-800 text-sm">
                    <strong>Tip:</strong> Přesné identifikační údaje nám pomohou připravit co nejpřesnější nabídku na míru vašim potřebám.
                </p>
            </div>
        </div>
    )
}

export default FormStep1
