import { useFormContext, useWatch } from 'react-hook-form'
import { Home, Zap, Sun, Target, HelpCircle } from 'lucide-react'

const FormStep2 = () => {
  const { register, control } = useFormContext()
  
  // Watch for all relevant values at once
  const watchedValues = useWatch({
    control,
    name: ['hasFveVte', 'interestedInFveVte', 'hasTransformer', 'circuitBreakerType', 'sharesElectricity', 'receivesSharedElectricity']
  })

  const [
    hasFveVte,
    interestedInFveVte,
    hasTransformer,
    circuitBreakerType,
    sharesElectricity,
    receivesSharedElectricity
  ] = watchedValues || []

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Target className="h-8 w-8 text-primary-600 mr-3" />
          <h2 className="text-2xl font-bold text-gray-900">
            Parametry odběrného místa
          </h2>
        </div>
        <p className="text-gray-600">
          Technické parametry vašeho odběrného místa a současné instalace
        </p>
      </div>

      <div className="space-y-6">
        {/* Má zákazník již instalovanou FVE / VTE */}
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <label className="form-label">
            <Sun className="inline h-5 w-5 mr-2" />
            Má zákazník již instalovanou FVE / VTE?
          </label>
          <div className="flex gap-6 mt-3">
            <label className="flex items-center">
              <input 
                type="radio" 
                className="form-radio mr-2"
                value="yes"
                {...register('hasFveVte')}
              />
              Ano
            </label>
            <label className="flex items-center">
              <input 
                type="radio" 
                className="form-radio mr-2"
                value="no"
                {...register('hasFveVte')}
              />
              Ne
            </label>
          </div>
          
          {/* Conditional inputs for FVE/VTE details */}
          {hasFveVte === 'yes' && (
            <div className="mt-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Výkon FVE:</label>
                  <div className="flex">
                    <input
                      type="number"
                      className="form-input rounded-r-none"
                      placeholder="Výkon"
                      {...register('fveVtePower')}
                    />
                    <span className="bg-gray-100 border border-l-0 border-gray-300 px-3 py-3 rounded-r-lg text-gray-600 text-sm">
                      kWp
                    </span>
                  </div>
                </div>
                <div>
                  <label className="form-label">Kolik % přetoků chce akumulovat:</label>
                  <div className="flex">
                    <input
                      type="number"
                      className="form-input rounded-r-none"
                      placeholder="Procento"
                      min="0"
                      max="100"
                      {...register('accumulationPercentage')}
                    />
                    <span className="bg-gray-100 border border-l-0 border-gray-300 px-3 py-3 rounded-r-lg text-gray-600 text-sm">
                      %
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Interest in FVE/VTE if not installed */}
          {hasFveVte === 'no' && (
            <div className="mt-4">
              <label className="form-label">
                <HelpCircle className="inline h-5 w-5 mr-2" />
                Má zákazník zájem o instalaci FVE?
              </label>
              <div className="flex gap-6 mt-2">
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    className="form-radio mr-2"
                    value="yes"
                    {...register('interestedInFveVte')}
                  />
                  Ano
                </label>
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    className="form-radio mr-2"
                    value="no"
                    {...register('interestedInFveVte')}
                  />
                  Ne
                </label>
              </div>
            </div>
          )}

          {/* Conditional question about installation processing */}
                {hasFveVte === 'no' && interestedInFveVte === 'yes' && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <label className="form-label">
                  <HelpCircle className="inline h-5 w-5 mr-2" />
                  Má zákazník zájem o zpracování instalace?
                  </label>
                  <div className="flex gap-6 mt-2">
                  <label className="flex items-center">
                    <input 
                    type="radio" 
                    className="form-radio mr-2"
                    value="yes"
                    {...register('interestedInInstallationProcessing')}
                    />
                    Ano
                  </label>
                  <label className="flex items-center">
                    <input 
                    type="radio" 
                    className="form-radio mr-2"
                    value="no"
                    {...register('interestedInInstallationProcessing')}
                    />
                    Ne
                  </label>
                  </div>
                </div>
                )}
              </div>

              {/* Elektromobilita */}
              <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                <label className="form-label">
                <Zap className="inline h-5 w-5 mr-2" />
                Má zákazník zájem o elektromobilitu?
                </label>
                <div className="flex gap-6 mt-3">
                <label className="flex items-center">
                  <input 
                  type="radio" 
                  className="form-radio mr-2"
                  value="yes"
                  {...register('interestedInElectromobility')}
                  />
                  Ano
                </label>
                <label className="flex items-center">
                  <input 
                  type="radio" 
                  className="form-radio mr-2"
                  value="no"
                  {...register('interestedInElectromobility')}
                  />
                  Ne
                </label>
                </div>
              </div>

              {/* Má trafostanici */}
        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <label className="form-label">
            <Zap className="inline h-5 w-5 mr-2" />
            Má zákazník trafostanici?
          </label>
          <div className="flex gap-6 mt-3">
            <label className="flex items-center">
              <input 
                type="radio" 
                className="form-radio mr-2"
                value="yes"
                {...register('hasTransformer')}
              />
              Ano
            </label>
            <label className="flex items-center">
              <input 
                type="radio" 
                className="form-radio mr-2"
                value="no"
                {...register('hasTransformer')}
              />
              Ne
            </label>
          </div>
        </div>

        {/* Parametry trafostanice nebo jističe */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          {hasTransformer === 'yes' ? (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Zap className="h-5 w-5 mr-2" />
                Parametry trafostanice
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Výkon trafostanice:</label>
                  <div className="flex">
                    <input
                      type="number"
                      className="form-input rounded-r-none"
                      placeholder="Výkon"
                      {...register('transformerPower')}
                    />
                    <span className="bg-gray-100 border border-l-0 border-gray-300 px-3 py-3 rounded-r-lg text-gray-600 text-sm">
                      kVA
                    </span>
                  </div>
                </div>

                <div>
                  <label className="form-label">VN strana napětí:</label>
                  <select className="form-input" {...register('transformerVoltage')}>
                    <option value="">Vyberte napětí</option>
                    <option value="22">22 kV</option>
                    <option value="35">35 kV</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Typ chlazení:</label>
                  <select className="form-input" {...register('coolingType')}>
                    <option value="">Vyberte typ chlazení</option>
                    <option value="oil">Olej</option>
                    <option value="air">Vzduch</option>
                    <option value="other">Jiné</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Rok výroby:</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="Rok výroby"
                    min="1950"
                    max="2025"
                    {...register('transformerYear')}
                  />
                </div>

                <div>
                  <label className="form-label">Typ transformátoru:</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Typ transformátoru"
                    {...register('transformerType')}
                  />
                </div>

                <div>
                  <label className="form-label">Proud transformátoru:</label>
                  <div className="flex">
                    <input
                      type="number"
                      className="form-input rounded-r-none"
                      placeholder="Proud"
                      {...register('transformerCurrent')}
                    />
                    <span className="bg-gray-100 border border-l-0 border-gray-300 px-3 py-3 rounded-r-lg text-gray-600 text-sm">
                      A
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : hasTransformer === 'no' ? (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Zap className="h-5 w-5 mr-2" />
                Výběr hlavního jističe
              </h3>
              
              <div>
                <label className="form-label">Typ hlavního jističe:</label>
                <select className="form-input" {...register('circuitBreakerType')} defaultValue="NE">
                  <option value="NE">NE</option>
                  <option value="16A">16 A</option>
                  <option value="20A">20 A</option>
                  <option value="25A">25 A</option>
                  <option value="32A">32 A</option>
                  <option value="40A">40 A</option>
                  <option value="50A">50 A</option>
                  <option value="63A">63 A</option>
                  <option value="80A">80 A</option>
                  <option value="100A">100 A</option>
                  <option value="125A">125 A</option>
                  <option value="160A">160 A</option>
                  <option value="200A">200 A</option>
                  <option value="250A">250 A</option>
                  <option value="315A">315 A</option>
                  <option value="400A">400 A</option>
                  <option value="other">Jiný</option>
                </select>
              </div>

              {circuitBreakerType === 'other' && (
                <div>
                  <label className="form-label">Specifikujte jiný typ jističe:</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Zadejte typ jističe"
                    {...register('customCircuitBreaker')}
                  />
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* Sdílení elektřiny */}
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Sdílení elektřiny
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="form-label">Sdílí elektřinu s jinými odběrnými místy?</label>
              <div className="flex gap-6 mt-2">
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    className="form-radio mr-2"
                    value="yes"
                    {...register('sharesElectricity')}
                  />
                  Ano
                </label>
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    className="form-radio mr-2"
                    value="no"
                    {...register('sharesElectricity')}
                  />
                  Ne
                </label>
              </div>
            </div>

            {sharesElectricity === 'yes' && (
              <div>
                <label className="form-label">Kolik elektřiny sdílí měsíčně:</label>
                <div className="flex">
                  <input
                    type="number"
                    className="form-input rounded-r-none"
                    placeholder="Množství"
                    {...register('electricityShared')}
                  />
                  <span className="bg-gray-100 border border-l-0 border-gray-300 px-3 py-3 rounded-r-lg text-gray-600 text-sm">
                    kWh
                  </span>
                </div>
              </div>
            )}

            <div>
              <label className="form-label">Přijímá sdílenou elektřinu?</label>
              <div className="flex gap-6 mt-2">
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    className="form-radio mr-2"
                    value="yes"
                    {...register('receivesSharedElectricity')}
                  />
                  Ano
                </label>
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    className="form-radio mr-2"
                    value="no"
                    {...register('receivesSharedElectricity')}
                  />
                  Ne
                </label>
              </div>
            </div>

            {receivesSharedElectricity === 'yes' && (
              <div>
                <label className="form-label">Kolik sdílené elektřiny získává měsíčně:</label>
                <div className="flex">
                  <input
                    type="number"
                    className="form-input rounded-r-none"
                    placeholder="Množství"
                    {...register('electricityReceived')}
                  />
                  <span className="bg-gray-100 border border-l-0 border-gray-300 px-3 py-3 rounded-r-lg text-gray-600 text-sm">
                    kWh
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Technické parametry odběrného místa */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Zap className="h-5 w-5 mr-2" />
            Technické parametry
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Hlavní jistič */}
            <div>
              <label className="form-label">Hlavní jistič:</label>
              <div className="flex">
                <input
                  type="number"
                  className="form-input rounded-r-none"
                  placeholder="Hodnota"
                  {...register('mainCircuitBreaker')}
                />
                <span className="bg-gray-100 border border-l-0 border-gray-300 px-3 py-3 rounded-r-lg text-gray-600 text-sm">
                  A
                </span>
              </div>
            </div>

            {/* Rezervovaný příkon */}
                  <div>
                    <label className="form-label">Rezervovaný příkon:</label>
                    <div className="flex">
                    <input
                      type="number"
                      className="form-input rounded-r-none"
                      placeholder="Hodnota"
                      {...register('reservedPower')}
                    />
                    <span className="bg-gray-100 border border-l-0 border-gray-300 px-3 py-3 rounded-r-lg text-gray-600 text-sm">
                      kW
                    </span>
                    </div>
                  </div>

                  {/* Rezervovaný výkon */}
                  <div>
                    <label className="form-label">Rezervovaný výkon:</label>
                    <div className="flex">
                    <input
                      type="number"
                      className="form-input rounded-r-none"
                      placeholder="Hodnota"
                      {...register('reservedOutput')}
                    />
                    <span className="bg-gray-100 border border-l-0 border-gray-300 px-3 py-3 rounded-r-lg text-gray-600 text-sm">
                      kW
                    </span>
                    </div>
                  </div>

                  {/* Měsíční spotřeba el. energie */}
            <div>
              <label className="form-label">Měsíční spotřeba el. energie:</label>
              <div className="flex">
                <input
                  type="number"
                  className="form-input rounded-r-none"
                  placeholder="Hodnota"
                  {...register('monthlyConsumption')}
                />
                <span className="bg-gray-100 border border-l-0 border-gray-300 px-3 py-3 rounded-r-lg text-gray-600 text-sm">
                  MWh
                </span>
              </div>
            </div>

            {/* Měsíční maximum odběru */}
            <div>
              <label className="form-label">Měsíční maximum odběru:</label>
              <div className="flex">
                <input
                  type="number"
                  className="form-input rounded-r-none"
                  placeholder="Hodnota"
                  {...register('monthlyMaxConsumption')}
                />
                <span className="bg-gray-100 border border-l-0 border-gray-300 px-3 py-3 rounded-r-lg text-gray-600 text-sm">
                  kW
                </span>
              </div>
            </div>

            {/* Významné odběry v konkrétní čas */}
            <div className="md:col-span-2">
              <label className="form-label">Významné odběry v konkrétní čas (např. směny):</label>
              <textarea
                className="form-input"
                rows={3}
                placeholder="Popište významné odběry, směnný provoz, špičky spotřeby..."
                {...register('significantConsumption')}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-800 text-sm">
          <strong>Tip:</strong> Přesné technické parametry nám pomohou navrhnout optimální velikost a konfiguraci bateriového úložiště.
        </p>
      </div>
    </div>
  )
}

export default FormStep2
