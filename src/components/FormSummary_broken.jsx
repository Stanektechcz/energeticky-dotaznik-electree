import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { Eye, X, User, FileText, Building, Zap, Target, Battery, DollarSign, MessageSquare, HelpCircle } from 'lucide-react'

const FormSummary = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false)
  const { watch } = useFormContext()
  const formData = watch()

  // Helper function to format values for display
  const formatValue = (value, defaultText = 'Neuvedeno') => {
    if (value === null || value === undefined || value === '' || value === false) {
      return defaultText
    }
    if (typeof value === 'boolean') {
      return value ? 'Ano' : 'Ne'
    }
    if (typeof value === 'object' && value.length === 0) {
      return defaultText
    }
    return String(value)
  }

  // Helper function to format radio and select values to Czech
  const formatCzechValue = (value, fieldType) => {
    if (!value || value === '') return 'Neuvedeno'
    
    const translations = {
      // Grid connection
      gridConnectionPlanned: {
        'yes': 'Ano',
        'no': 'Ne'
      },
      // Connection application
      connectionApplicationBy: {
        'customer': 'Zákazník sám',
        'electree': 'Firma Electree na základě plné moci',
        'undecided': 'Ještě nerozhodnuto'
      },
      // Power of attorney
      willingToSignPowerOfAttorney: {
        'yes': 'Ano',
        'no': 'Ne'
      },
      // Energetic specialist
      hasEnergeticSpecialist: {
        'yes': 'Ano',
        'no': 'Ne'
      },
      specialistPosition: {
        'specialist': 'Specialista',
        'manager': 'Správce'
      },
      // Space and infrastructure
      hasOutdoorSpace: {
        'yes': 'Ano',
        'no': 'Ne'
      },
      hasIndoorSpace: {
        'yes': 'Ano',
        'no': 'Ne'
      },
      accessibility: {
        'unlimited': 'Bez omezení',
        'limited': 'Omezený'
      },
      hasProjectDocumentation: {
        'yes': 'Ano',
        'no': 'Ne'
      },
      // Distribution curves and territory
      hasDistributionCurves: {
        'yes': 'Ano',
        'no': 'Ne'
      },
      distributionTerritory: {
        'cez': 'ČEZ',
        'pre': 'PRE',
        'egd': 'E.GD',
        'lds': 'LDS'
      },
      // Measurement type
      measurementType: {
        'quarter-hour': 'Čtvrthodinové měření (A-měření)',
        'other': 'Jiné'
      },
      // Critical consumption
      hasCriticalConsumption: {
        'yes': 'Ano',
        'no': 'Ne'
      },
      // Energy accumulation
      energyAccumulation: {
        'unknown': 'Neví',
        'specific': 'Konkrétní hodnota'
      },
      // Battery cycles
      batteryCycles: {
        'once': '1x denně',
        'multiple': 'Vícekrát denně',
        'recommend': 'Neznámo - doporučit'
      },
      // Backup requirements
      requiresBackup: {
        'yes': 'Ano',
        'no': 'Ne'
      },
      // Backup duration
      backupDuration: {
        'minutes': 'Desítky minut',
        'hours-1-3': '1-3 hodiny',
        'hours-3-plus': 'Více než 3 hodiny'
      },
      // Price optimization
      priceOptimization: {
        'yes': 'Ano',
        'no': 'Ne'
      },
      // Technical questions
      hasElectricityProblems: {
        'yes': 'Ano',
        'no': 'Ne'
      },
      hasEnergyAudit: {
        'yes': 'Ano',
        'no': 'Ne'
      },
      hasOwnEnergySource: {
        'yes': 'Ano',
        'no': 'Ne'
      },
      canProvideLoadSchema: {
        'yes': 'Ano',
        'no': 'Ne'
      },
      // Different address
      differentAddress: {
        'yes': 'Ano',
        'no': 'Ne'
      }
    }

    return translations[fieldType]?.[value] || formatValue(value)
  }

  // Helper function to format file names
  const formatFileName = (file) => {
    if (!file || !file[0]) return 'Žádný soubor'
    return file[0].name
  }

  // Helper function to format multiple files
  const formatFileNames = (files) => {
    if (!files || files.length === 0) return 'Žádné soubory'
    return Array.from(files).map(file => file.name).join(', ')
  }

  // Helper function to get selected customer types
  const getSelectedCustomerTypes = () => {
    const customerType = formData.customerType || {}
    const selectedTypes = []
    
    const typeLabels = {
      industrial: '🏭 Průmysl',
      commercial: '🏢 Komerční objekt',
      services: '🚚 Služby / Logistika',
      agriculture: '🌾 Zemědělství',
      public: '🏛️ Veřejný sektor',
      other: '❓ Jiný'
    }

    Object.keys(customerType).forEach(key => {
      if (customerType[key] && typeLabels[key]) {
        selectedTypes.push(typeLabels[key])
      }
    })

    return selectedTypes.length > 0 ? selectedTypes.join(', ') : 'Nevybráno'
  }

  // Helper function to get selected goals
  const getSelectedGoals = () => {
    const goals = formData.goals || {}
    const selectedGoals = []
    
    const goalLabels = {
      fveOverflow: 'Úspora z přetoků z FVE',
      peakShaving: 'Posun spotřeby (peak shaving)',
      backupPower: 'Záloha při výpadku sítě',
      machineSupport: 'Podpora výkonu strojů',
      powerReduction: 'Snížení rezervovaného příkonu',
      energyTrading: 'Možnost obchodování s energií',
      subsidy: 'Získání dotace',
      other: 'Jiný účel'
    }

    Object.keys(goals).forEach(key => {
      if (goals[key] && goalLabels[key]) {
        selectedGoals.push(goalLabels[key])
      }
    })

    return selectedGoals.length > 0 ? selectedGoals.join(', ') : 'Nevybráno'
  }

  // Helper function to get priorities
  const getPriorities = () => {
    const priorityLabels = {
      'fve-overflow': 'Úspora z přetoků z FVE',
      'peak-shaving': 'Posun spotřeby (peak shaving)',
      'backup-power': 'Záloha při výpadku sítě',
      'machine-support': 'Podpora výkonu strojů',
      'power-reduction': 'Snížení rezervovaného příkonu',
      'energy-trading': 'Možnost obchodování s energií',
      'subsidy': 'Získání dotace',
      'other': 'Jiný účel'
    }

    return {
      priority1: priorityLabels[formData.priority1] || 'Nevybráno',
      priority2: priorityLabels[formData.priority2] || 'Nevybráno',
      priority3: priorityLabels[formData.priority3] || 'Nevybráno'
    }
  }

  // Helper function to get proposed steps
  const getProposedSteps = () => {
    const steps = formData.proposedSteps || {}
    const selectedSteps = []
    
    const stepLabels = {
      preliminary: 'Předběžná nabídka',
      technical: 'Technická prohlídka',
      detailed: 'Příprava zakázky a připojení',
      consultancy: 'Konzultace s energetikem',
      support: 'Možnost obchodování s energií',
      other: 'Jiný postup'
    }

    Object.keys(steps).forEach(key => {
      if (steps[key] && stepLabels[key]) {
        selectedSteps.push(stepLabels[key])
      }
    })

    return selectedSteps.length > 0 ? selectedSteps.join(', ') : 'Nevybráno'
  }

  // Helper function to get selected documentation types
  const getSelectedDocumentationTypes = () => {
    const docTypes = formData.documentationTypes || {}
    const selectedTypes = []
    
    const typeLabels = {
      sitePlan: 'Situační plán areálu',
      electricalPlan: 'Elektrická dokumentace',
      buildingPlan: 'Půdorysy budov',
      other: 'Jiná dokumentace'
    }

    Object.keys(docTypes).forEach(key => {
      if (docTypes[key] && typeLabels[key]) {
        selectedTypes.push(typeLabels[key])
      }
    })

    return selectedTypes.length > 0 ? selectedTypes.join(', ') : 'Nevybráno'
  }

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="btn-secondary flex items-center gap-2"
      >
        <Eye className="h-4 w-4" />
        Zobrazit souhrn
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Souhrn formuláře</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-6">
            {/* Informace o uživateli */}
            {user && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <User className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold text-blue-900">Formulář vypracoval</h3>
                </div>
                <div className="bg-white rounded p-3">
                  <div className="text-sm text-blue-600">Jméno a příjmení</div>
                  <div className="font-medium text-blue-900">{user.fullName}</div>
                </div>
              </div>
            )}

            {/* Krok 1 - Identifikační údaje zákazníka */}
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                <Building className="h-5 w-5 mr-2 text-blue-600" />
                1. Identifikační údaje zákazníka
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div><span className="font-medium">Název společnosti/jméno:</span> {formatValue(formData.companyName)}</div>
                <div><span className="font-medium">IČO:</span> {formatValue(formData.ico)}</div>
                <div><span className="font-medium">DIČ:</span> {formatValue(formData.dic)}</div>
                <div><span className="font-medium">Kontaktní osoba:</span> {formatValue(formData.contactPerson)}</div>
                <div><span className="font-medium">Telefon:</span> {formatValue(formData.phone)}</div>
                <div><span className="font-medium">Email:</span> {formatValue(formData.email)}</div>
                <div className="md:col-span-2"><span className="font-medium">Adresa sídla firmy:</span> {formatValue(formData.companyAddress)}</div>
                <div className="md:col-span-2"><span className="font-medium">Adresa odběrného místa:</span> {formatValue(formData.address)}</div>
                <div><span className="font-medium">Stejná adresa jako sídlo:</span> {formatValue(formData.sameAsCompanyAddress, 'Ne')}</div>
                <div className="md:col-span-2"><span className="font-medium">Typ zákazníka:</span> {getSelectedCustomerTypes()}</div>
                {formData.customerType?.other && formData.customerType?.otherSpecification && (
                  <div className="md:col-span-2"><span className="font-medium">Upřesnění typu:</span> {formatValue(formData.customerType.otherSpecification)}</div>
                )}
              </div>
            </div>

            {/* Krok 2 - Parametry odběrného místa */}
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                <Zap className="h-5 w-5 mr-2 text-orange-600" />
                2. Parametry odběrného místa
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div><span className="font-medium">Odběrové diagramy:</span> {formatCzechValue(formData.hasDistributionCurves, 'hasDistributionCurves')}</div>
                <div><span className="font-medium">Distribuční území:</span> {formatCzechValue(formData.distributionTerritory, 'distributionTerritory')}</div>
                {formData.distributionTerritory === 'lds' && formData.ldsName && (
                  <div className="md:col-span-2"><span className="font-medium">Název LDS:</span> {formatValue(formData.ldsName)}</div>
                )}
                <div><span className="font-medium">Typ měření:</span> {formatCzechValue(formData.measurementType, 'measurementType')}</div>
                {formData.measurementType === 'other' && formData.measurementTypeOther && (
                  <div className="md:col-span-2"><span className="font-medium">Jiné měření:</span> {formatValue(formData.measurementTypeOther)}</div>
                )}
                <div><span className="font-medium">Kritická spotřeba:</span> {formatCzechValue(formData.hasCriticalConsumption, 'hasCriticalConsumption')}</div>
                {formData.hasCriticalConsumption === 'yes' && formData.criticalConsumptionValue && (
                  <div><span className="font-medium">Hodnota kritické spotřeby:</span> {formatValue(formData.criticalConsumptionValue)} kW</div>
                )}
                {formData.hasCriticalConsumption === 'yes' && formData.criticalConsumptionDevices && (
                  <div className="md:col-span-2"><span className="font-medium">Kritická zařízení:</span> {formatValue(formData.criticalConsumptionDevices)}</div>
                )}
                <div><span className="font-medium">Akumulace energie:</span> {formatCzechValue(formData.energyAccumulation, 'energyAccumulation')}</div>
                {formData.energyAccumulation === 'specific' && formData.energyAccumulationValue && (
                  <div><span className="font-medium">Konkrétní hodnota:</span> {formatValue(formData.energyAccumulationValue)} kWh</div>
                )}
                <div><span className="font-medium">Cykly baterie:</span> {formatCzechValue(formData.batteryCycles, 'batteryCycles')}</div>
              </div>
            </div>

            {/* Krok 3 - Energetické potřeby se všemi údaji */}
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                <Zap className="h-5 w-5 mr-2 text-yellow-600" />
                3. Energetické potřeby
              </h4>
              <div className="space-y-3 text-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div><span className="font-medium">Roční spotřeba:</span> {formatValue(formData.yearlyConsumption)} MWh</div>
                  <div><span className="font-medium">Denní spotřeba:</span> {formatValue(formData.dailyAverageConsumption)} kWh</div>
                  <div><span className="font-medium">Max. odběr:</span> {formatValue(formData.maxConsumption)} kW</div>
                  <div><span className="font-medium">Min. odběr:</span> {formatValue(formData.minConsumption)} kW</div>
                  <div><span className="font-medium">Akumulace energie:</span> {formatCzechValue(formData.energyAccumulation, 'energyAccumulation')}</div>
                  {formData.energyAccumulation === 'specific' && (
                    <div><span className="font-medium">Množství:</span> {formatValue(formData.energyAccumulationAmount)} kWh</div>
                  )}
                  <div><span className="font-medium">Cykly baterie:</span> {formatCzechValue(formData.batteryCycles, 'batteryCycles')}</div>
                  <div><span className="font-medium">Zálohování:</span> {formatCzechValue(formData.requiresBackup, 'requiresBackup')}</div>
                  {formData.requiresBackup === 'yes' && (
                    <div className="md:col-span-2"><span className="font-medium">Co zálohovat:</span> {formatValue(formData.backupDescription)}</div>
                  )}
                  <div><span className="font-medium">Výdrž zálohy:</span> {formatCzechValue(formData.backupDuration, 'backupDuration')}</div>
                  <div><span className="font-medium">Řízení podle ceny:</span> {formatCzechValue(formData.priceOptimization, 'priceOptimization')}</div>
                </div>
              </div>
            </div>
                </div>

                <div className="border-t pt-3">
                  <h5 className="font-medium mb-2">Doplňující technické otázky:</h5>
                  <div className="grid grid-cols-1 gap-3">
                    <div><span className="font-medium">Problémy s výpadky:</span> {formatCzechValue(formData.hasElectricityProblems, 'hasElectricityProblems')}</div>
                    {formData.hasElectricityProblems === 'yes' && (
                      <div><span className="font-medium">Detaily výpadků:</span> {formatValue(formData.electricityProblemsDetails)}</div>
                    )}
                    <div><span className="font-medium">Energetický audit:</span> {formatCzechValue(formData.hasEnergyAudit, 'hasEnergyAudit')}</div>
                    {formData.hasEnergyAudit === 'yes' && (
                      <div><span className="font-medium">Detaily auditu:</span> {formatValue(formData.energyAuditDetails)}</div>
                    )}
                    <div><span className="font-medium">Vlastní zdroj energie:</span> {formatCzechValue(formData.hasOwnEnergySource, 'hasOwnEnergySource')}</div>
                    {formData.hasOwnEnergySource === 'yes' && (
                      <div><span className="font-medium">Detaily zdroje:</span> {formatValue(formData.ownEnergySourceDetails)}</div>
                    )}
                    <div><span className="font-medium">Schéma zatížení:</span> {formatCzechValue(formData.canProvideLoadSchema, 'canProvideLoadSchema')}</div>
                    {formData.canProvideLoadSchema === 'yes' && (
                      <div><span className="font-medium">Detaily schématu:</span> {formatValue(formData.loadSchemaDetails)}</div>
                    )}
                  </div>
                </div>

                {formData.distributionCurvesFile && (
                  <div className="border-t pt-3">
                    <div><span className="font-medium">Nahraný soubor:</span> {formatFileName(formData.distributionCurvesFile)}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Krok 4 - Cíle a priority */}
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                <Target className="h-5 w-5 mr-2 text-purple-600" />
                4. Cíle a očekávání
              </h4>
              <div className="space-y-3 text-sm">
                <div><span className="font-medium">Vybrané cíle:</span> {getSelectedGoals()}</div>
                {formData.goals?.other && (
                  <div><span className="font-medium">Jiný účel:</span> {formatValue(formData.otherPurposeDescription)}</div>
                )}
                <div><span className="font-medium">Doplňující informace:</span> {formatValue(formData.goalDetails)}</div>
                <div className="border-t pt-3">
                  <h5 className="font-medium mb-2">Priorita cílů:</h5>
                  <div>1. {getPriorities().priority1}</div>
                  <div>2. {getPriorities().priority2}</div>
                  <div>3. {getPriorities().priority3}</div>
                </div>
              </div>
            </div>

            {/* Krok 5 - Infrastruktura a prostor */}
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                <Building className="h-5 w-5 mr-2 text-green-600" />
                5. Infrastruktura a prostor
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div><span className="font-medium">Venkovní prostor:</span> {formatCzechValue(formData.hasOutdoorSpace, 'hasOutdoorSpace')}</div>
                {formData.hasOutdoorSpace === 'yes' && (
                  <div><span className="font-medium">Velikost venkovního prostoru:</span> {formatValue(formData.outdoorSpaceSize)} m²</div>
                )}
                <div><span className="font-medium">Vnitřní prostor:</span> {formatCzechValue(formData.hasIndoorSpace, 'hasIndoorSpace')}</div>
                {formData.hasIndoorSpace === 'yes' && (
                  <>
                    <div><span className="font-medium">Typ prostoru:</span> {formatValue(formData.indoorSpaceType)}</div>
                    <div><span className="font-medium">Velikost vnitřního prostoru:</span> {formatValue(formData.indoorSpaceSize)} m²</div>
                  </>
                )}
                <div><span className="font-medium">Přístupnost:</span> {formatCzechValue(formData.accessibility, 'accessibility')}</div>
                {formData.accessibility === 'limited' && (
                  <div className="md:col-span-2"><span className="font-medium">Omezení přístupnosti:</span> {formatValue(formData.accessibilityLimitations)}</div>
                )}
                <div><span className="font-medium">Projektová dokumentace:</span> {formatCzechValue(formData.hasProjectDocumentation, 'hasProjectDocumentation')}</div>
                {formData.hasProjectDocumentation === 'yes' && (
                  <>
                    <div className="md:col-span-2"><span className="font-medium">Typ dokumentace:</span> {getSelectedDocumentationTypes()}</div>
                    <div className="md:col-span-2"><span className="font-medium">Soubory dokumentace:</span> {formatFileNames(formData.projectDocumentationFiles)}</div>
                  </>
                )}
                <div className="md:col-span-2"><span className="font-medium">Poznámky k infrastruktuře:</span> {formatValue(formData.infrastructureNotes)}</div>
              </div>
            </div>

            {/* Krok 6 - Provozní a legislativní rámec */}
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-indigo-600" />
                6. Provozní a legislativní rámec
              </h4>
              <div className="space-y-3 text-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div><span className="font-medium">Připojení k DS/ČEPS:</span> {formatCzechValue(formData.gridConnectionPlanned, 'gridConnectionPlanned')}</div>
                  <div><span className="font-medium">Žádost o připojení podá:</span> {formatCzechValue(formData.connectionApplicationBy, 'connectionApplicationBy')}</div>
                  <div><span className="font-medium">Ochota podepsat plnou moc:</span> {formatCzechValue(formData.willingToSignPowerOfAttorney, 'willingToSignPowerOfAttorney')}</div>
                  <div><span className="font-medium">Má energetického specialistu:</span> {formatCzechValue(formData.hasEnergeticSpecialist, 'hasEnergeticSpecialist')}</div>
                </div>
                
                {formData.hasEnergeticSpecialist === 'yes' && (
                  <div className="border-t pt-3">
                    <h5 className="font-medium mb-2">Údaje o specialistovi:</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div><span className="font-medium">Jméno:</span> {formatValue(formData.specialistName)}</div>
                      <div><span className="font-medium">Pozice:</span> {formatCzechValue(formData.specialistPosition, 'specialistPosition')}</div>
                      <div><span className="font-medium">Telefon:</span> {formatValue(formData.specialistPhone)}</div>
                      <div><span className="font-medium">Email:</span> {formatValue(formData.specialistEmail)}</div>
                    </div>
                  </div>
                )}
                
                <div className="border-t pt-3">
                  <div><span className="font-medium">Poznámky k legislativě:</span> {formatValue(formData.legislativeNotes)}</div>
                </div>
              </div>
            </div>

            {/* Krok 7 - Navržený postup a poznámky */}
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                <MessageSquare className="h-5 w-5 mr-2 text-orange-600" />
                7. Poznámky a další postup
              </h4>
              <div className="space-y-3 text-sm">
                <div><span className="font-medium">Navržené kroky:</span> {getProposedSteps()}</div>
                {formData.proposedSteps?.other && (
                  <div><span className="font-medium">Jiný postup:</span> {formatValue(formData.proposedSteps?.otherDescription)}</div>
                )}
                <div><span className="font-medium">Dodatečné poznámky:</span> {formatValue(formData.additionalNotes)}</div>
                
                <div className="border-t pt-3">
                  <h5 className="font-medium mb-2">Souhlasy:</h5>
                  <div className="space-y-1">
                    <div><span className="font-medium">Zpracování osobních údajů:</span> {formatValue(formData.agreements?.dataProcessing, 'Ne')}</div>
                    <div><span className="font-medium">Návštěva technika:</span> {formatValue(formData.agreements?.technicalVisit, 'Ne')}</div>
                    <div><span className="font-medium">Obchodní sdělení:</span> {formatValue(formData.agreements?.marketing, 'Ne')}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={() => setIsOpen(false)}
            className="btn-primary w-full"
          >
            Zavřít souhrn
          </button>
        </div>
      </div>
    </div>
  )
}

export default FormSummary
