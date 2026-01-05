import { useFormContext, useWatch } from 'react-hook-form'
import { CheckCircle, Target, TrendingUp, Shield, Zap, DollarSign, Sun, BarChart3, Gift } from 'lucide-react'

const FormStep4 = () => {
  const { register, control } = useFormContext()

  // Watch for "other" purpose selection
  const otherPurpose = useWatch({
    control,
    name: 'goals.other'
  })

  // Watch for priorities to filter out selected options
  const priority1 = useWatch({ control, name: 'priority1' })
  const priority2 = useWatch({ control, name: 'priority2' })
  const priority3 = useWatch({ control, name: 'priority3' })

  // Priority options
  const priorityOptions = [
    { value: 'fve-overflow', label: 'Úspora z přetoků z FVE' },
    { value: 'peak-shaving', label: 'Posun spotřeby (peak shaving)' },
    { value: 'backup-power', label: 'Záloha při výpadku sítě' },
    { value: 'machine-support', label: 'Podpora výkonu strojů' },
    { value: 'power-reduction', label: 'Snížení rezervovaného příkonu' },
    { value: 'energy-trading', label: 'Možnost obchodování s energií' },
    { value: 'subsidy', label: 'Získání dotace' },
    { value: 'other', label: 'Jiný účel' }
  ]

  // Function to get available options for each priority select
  const getAvailableOptions = (currentPriority, excludePriorities) => {
    const selectedValues = excludePriorities.filter(Boolean)
    return priorityOptions.filter(option => 
      !selectedValues.includes(option.value) || option.value === currentPriority
    )
  }

  const goals = [
    { 
      id: 'fveOverflow', 
      label: 'Úspora z přetoků z FVE', 
      icon: Sun,
      description: 'Maximalizace využití energie z fotovoltaické elektrárny'
    },
    { 
      id: 'peakShaving', 
      label: 'Posun spotřeby (peak shaving)', 
      icon: BarChart3,
      description: 'Snížení nákladů na elektřinu optimalizací spotřeby'
    },
    { 
      id: 'backupPower', 
      label: 'Záloha při výpadku sítě', 
      icon: Shield,
      description: 'Zajištění dodávek při výpadku distribuční sítě'
    },
    { 
      id: 'machineSupport', 
      label: 'Podpora výkonu strojů', 
      icon: Zap,
      description: 'Podpora při startu a provozu náročných strojů'
    },
    { 
      id: 'powerReduction', 
      label: 'Snížení rezervovaného příkonu', 
      icon: TrendingUp,
      description: 'Optimalizace rezervovaného příkonu a snížení fixních nákladů'
    },
    { 
      id: 'energyTrading', 
      label: 'Možnost obchodování s energií', 
      icon: DollarSign,
      description: 'Aktivní obchodování s elektřinou na trhu'
    },
    { 
      id: 'subsidy', 
      label: 'Získání dotace', 
      icon: Gift,
      description: 'Využití dostupných dotačních programů'
    },
    { 
      id: 'other', 
      label: 'Jiný účel', 
      icon: Target,
      description: 'Specifické požadavky na využití baterie'
    }
  ]

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Target className="h-8 w-8 text-primary-600 mr-3" />
          <h2 className="text-2xl font-bold text-gray-900">
            Cíle a očekávání
          </h2>
        </div>
        <p className="text-gray-600">
          Vyberte všechny cíle, kterých chcete dosáhnout pomocí bateriového úložiště
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map((goal) => {
          const IconComponent = goal.icon
          return (
            <div key={goal.id} className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 hover:shadow-md transition-all duration-200">
              <label className="flex items-start cursor-pointer">
                <input 
                  type="checkbox" 
                  className="form-checkbox mt-1 mr-3 flex-shrink-0"
                  {...register(`goals.${goal.id}`)}
                />
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <IconComponent className="h-5 w-5 text-primary-600 mr-2" />
                    <span className="font-semibold text-gray-900">
                      {goal.label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {goal.description}
                  </p>
                </div>
              </label>
            </div>
          )
        })}
      </div>

      {/* Conditional textarea for "other" purpose */}
      {otherPurpose && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <label className="form-label">
            Popište jiný účel využití bateriového úložiště:
          </label>
          <textarea
            className="form-input mt-2"
            rows={3}
            placeholder="Popište detailněji váš specifický účel..."
            {...register('otherPurposeDescription')}
          />
        </div>
      )}

      {/* Doplňující informace */}
      <div className="mt-8">
        <label className="form-label">
          Doplňující informace k vašim cílům
        </label>
        <textarea
          className="form-input"
          rows={4}
          placeholder="Popište detailněji vaše očekávání a specifické požadavky..."
          {...register('goalDetails')}
        />
      </div>

      {/* Priorita cílů */}
      <div className="bg-blue-50 p-6 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-4">Priorita vašich cílů</h3>
        <div className="space-y-3">
          <div>
            <label className="form-label">1. Nejvyšší priorita</label>
            <select className="form-input" {...register('priority1')}>
              <option value="">Vyberte primární cíl</option>
              {getAvailableOptions(priority1, [priority2, priority3]).map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="form-label">2. Druhá priorita</label>
            <select className="form-input" {...register('priority2')}>
              <option value="">Vyberte sekundární cíl</option>
              {getAvailableOptions(priority2, [priority1, priority3]).map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">3. Třetí priorita (volitelně)</label>
            <select className="form-input" {...register('priority3')}>
              <option value="">Vyberte terciární cíl</option>
              {getAvailableOptions(priority3, [priority1, priority2]).map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-green-800 text-sm">
          <strong>Tip:</strong> Jasně definované cíle a jejich priorita nám pomohou navrhnout bateriové úložiště, které bude maximálně efektivní pro vaše potřeby a přinese nejvyšší návratnost investice.
        </p>
      </div>
    </div>
  )
}

export default FormStep4
