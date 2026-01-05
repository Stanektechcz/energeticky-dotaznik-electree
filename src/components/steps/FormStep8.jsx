import { useFormContext, useWatch } from 'react-hook-form'
import { DollarSign, Zap, Share2, Flame, FileImage, Factory } from 'lucide-react'
import { useEffect } from 'react'
import FileUploadField from '../FileUploadField'

const FormStep8 = ({ formId }) => {
  const { register, control, setValue, watch } = useFormContext()
  
  // Watch for billing method to show conditional fields
  const billingMethod = useWatch({
    control,
    name: 'billingMethod'
  })

  // Watch fix and spot percentages for automatic calculation
  const fixPercentage = useWatch({
    control,
    name: 'fixPercentage'
  })
  
  const spotPercentage = useWatch({
    control,
    name: 'spotPercentage'
  })

  // Auto-calculate complementary percentage
  useEffect(() => {
    if (billingMethod === 'gradual') {
      const fixValue = parseFloat(fixPercentage) || 0
      const spotValue = parseFloat(spotPercentage) || 0
      
      // If fix percentage changed, update spot percentage
      if (fixValue > 0 && fixValue <= 100) {
        const newSpotValue = 100 - fixValue
        if (newSpotValue !== spotValue) {
          setValue('spotPercentage', newSpotValue.toString())
        }
      }
      // If spot percentage changed, update fix percentage  
      else if (spotValue > 0 && spotValue <= 100) {
        const newFixValue = 100 - spotValue
        if (newFixValue !== fixValue) {
          setValue('fixPercentage', newFixValue.toString())
        }
      }
    }
  }, [fixPercentage, spotPercentage, billingMethod, setValue])

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <DollarSign className="h-8 w-8 text-primary-600 mr-3" />
          <h2 className="text-2xl font-bold text-gray-900">
            8. Energetický dotazník
          </h2>
        </div>
        <p className="text-gray-600">
          Doplňující informace o cenách energií a dalších spotřebách
        </p>
      </div>

      <div className="space-y-6">
        {/* Způsob účtování energií */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Způsob účtování energií
          </h3>
          
          <div className="space-y-3">
            <label className="flex items-center">
              <input 
                type="radio" 
                className="form-radio mr-3"
                value="spot"
                {...register('billingMethod')}
              />
              <span className="font-medium">SPOT</span> - cena se mění podle spotového trhu
            </label>
            <label className="flex items-center">
              <input 
                type="radio" 
                className="form-radio mr-3"
                value="fix"
                {...register('billingMethod')}
              />
              <span className="font-medium">FIX</span> - fixní cena po dobu smlouvy
            </label>
            <label className="flex items-center">
              <input 
                type="radio" 
                className="form-radio mr-3"
                value="gradual"
                {...register('billingMethod')}
              />
              <span className="font-medium">Postupný nákup</span> - kombinace více způsobů
            </label>
          </div>

          {/* Podmíněná pole pro SPOT */}
          {billingMethod === 'spot' && (
            <div className="mt-4 p-4 bg-blue-100 rounded-lg border border-blue-300">
              <h4 className="font-medium text-blue-900 mb-3">Nastavení SPOT tarifu</h4>
              <div>
                <label className="form-label">Přirážka ke spotové ceně:</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.01"
                    className="form-input w-32"
                    placeholder="0.50"
                    {...register('spotSurcharge')}
                  />
                  <span className="text-gray-600">Kč/kWh</span>
                </div>
                <p className="text-xs text-blue-700 mt-1">
                  Přirážka k aktuální spotové ceně elektřiny
                </p>
              </div>
            </div>
          )}

          {/* Podmíněná pole pro FIX */}
          {billingMethod === 'fix' && (
            <div className="mt-4 p-4 bg-green-100 rounded-lg border border-green-300">
              <h4 className="font-medium text-green-900 mb-3">Nastavení FIX tarifu</h4>
              <div>
                <label className="form-label">Aktuální cena silové elektřiny:</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.01"
                    className="form-input w-32"
                    placeholder="2.50"
                    {...register('fixPrice')}
                  />
                  <span className="text-gray-600">Kč/kWh</span>
                </div>
                <p className="text-xs text-green-700 mt-1">
                  Cena bez distribučních poplatků a služeb
                </p>
              </div>
            </div>
          )}

          {/* Podmíněná pole pro postupný nákup */}
          {billingMethod === 'gradual' && (
            <div className="mt-4 p-4 bg-purple-100 rounded-lg border border-purple-300">
              <h4 className="font-medium text-purple-900 mb-4">Nastavení postupného nákupu</h4>
              
              <div className="space-y-4">
                {/* Poměr FIX/SPOT */}
                <div>
                  <label className="form-label">Poměr FIX/SPOT:</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-600">FIX podíl:</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          className="form-input w-20"
                          placeholder="60"
                          {...register('fixPercentage')}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value) || 0
                            if (value >= 0 && value <= 100) {
                              setValue('fixPercentage', e.target.value)
                              setValue('spotPercentage', (100 - value).toString())
                            }
                          }}
                        />
                        <span className="text-gray-600">%</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">SPOT podíl:</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          className="form-input w-20"
                          placeholder="40"
                          {...register('spotPercentage')}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value) || 0
                            if (value >= 0 && value <= 100) {
                              setValue('spotPercentage', e.target.value)
                              setValue('fixPercentage', (100 - value).toString())
                            }
                          }}
                        />
                        <span className="text-gray-600">%</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-purple-700 mt-2">
                    Součet musí být 100%. Při změně jedné hodnoty se druhá automaticky dopočítá.
                  </p>
                </div>

                {/* FIX cena */}
                <div>
                  <label className="form-label">FIX cena silové elektřiny:</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.01"
                      className="form-input w-32"
                      placeholder="2.50"
                      {...register('gradualFixPrice')}
                    />
                    <span className="text-gray-600">Kč/kWh</span>
                  </div>
                </div>

                {/* SPOT přirážka */}
                <div>
                  <label className="form-label">SPOT přirážka:</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.01"
                      className="form-input w-32"
                      placeholder="0.50"
                      {...register('gradualSpotSurcharge')}
                    />
                    <span className="text-gray-600">Kč/kWh</span>
                  </div>
                </div>

                <p className="text-xs text-purple-700">
                  Kombinace fixní a spotové ceny podle zadaného poměru
                </p>
              </div>
            </div>
          )}

          {/* Nahrání vyúčtování */}
          <div className="mt-4">
            <FileUploadField
              name="billingDocuments"
              label="Nahrát vyúčtování (doložit způsob účtování):"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              multiple={true}
              formId={formId}
              register={register}
              setValue={setValue}
              watch={watch}
              helpText="Podporované formáty: PDF, obrázky (JPG, PNG), Word dokumenty"
            />
          </div>
        </div>

        {/* Aktuální cena energií */}
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <DollarSign className="h-5 w-5 mr-2" />
            Aktuální cena energií
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Cena za kWh (bez DPH):</label>
              <div className="flex">
                <input
                  type="number"
                  step="0.01"
                  className="form-input rounded-r-none"
                  placeholder="Cena"
                  {...register('currentEnergyPrice')}
                />
                <span className="bg-gray-100 border border-l-0 border-gray-300 px-3 py-3 rounded-r-lg text-gray-600 text-sm">
                  Kč/kWh
                </span>
              </div>
            </div>
            <div>
              <label className="form-label">Jak je pro Vás důležitá zelená energie (1-10):</label>
              <input
                type="range"
                min="1"
                max="10"
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                {...register('priceImportance')}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1 (nejméně důležitá)</span>
                <span>10 (velmi důležitá)</span>
              </div>
            </div>
          </div>
        </div>


        {/* Sdílení elektřiny */}
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Share2 className="h-5 w-5 mr-2" />
            Sdílení elektřiny
          </h3>
          
          <div>
            <label className="form-label">Využíváte sdílení elektřiny?</label>
            <div className="flex gap-6 mt-3">
              <label className="flex items-center">
                <input 
                  type="radio" 
                  className="form-radio mr-2"
                  value="yes"
                  {...register('electricitySharing')}
                />
                Ano
              </label>
              <label className="flex items-center">
                <input 
                  type="radio" 
                  className="form-radio mr-2"
                  value="no"
                  {...register('electricitySharing')}
                />
                Ne
              </label>
            </div>
            
            {useWatch({ control, name: 'electricitySharing' }) === 'yes' && (
              <div className="mt-4">
                <label className="form-label">Detaily sdílení:</label>
                <textarea
                  className="form-input mt-2"
                  rows={3}
                  placeholder="Popište jak využíváte sdílení elektřiny, s kým sdílíte, kolik kWh..."
                  {...register('sharingDetails')}
                />
              </div>
            )}
          </div>
        </div>

        {/* Spotřeba plynu */}
        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Flame className="h-5 w-5 mr-2" />
            Spotřeba plynu
          </h3>
          
          <div>
            <label className="form-label">Máte připojený plyn?</label>
            <div className="flex gap-6 mt-3">
              <label className="flex items-center">
                <input 
                  type="radio" 
                  className="form-radio mr-2"
                  value="yes"
                  {...register('hasGas')}
                />
                Ano
              </label>
              <label className="flex items-center">
                <input 
                  type="radio" 
                  className="form-radio mr-2"
                  value="no"
                  {...register('hasGas')}
                />
                Ne
              </label>
            </div>
            
            {useWatch({ control, name: 'hasGas' }) === 'yes' && (
              <div className="mt-4 space-y-4">
                <div>
                  <label className="form-label">Roční spotřeba plynu:</label>
                  <div className="flex">
                    <input
                      type="number"
                      className="form-input rounded-r-none"
                      placeholder="Spotřeba"
                      {...register('gasConsumption')}
                    />
                    <span className="bg-gray-100 border border-l-0 border-gray-300 px-3 py-3 rounded-r-lg text-gray-600 text-sm">
                      m³/rok
                    </span>
                  </div>
                </div>
                
                <div>
                  <label className="form-label">Roční náklady na plyn:</label>
                  <div className="flex">
                    <input
                      type="number"
                      className="form-input rounded-r-none"
                      placeholder="Náklady"
                      {...register('gasBill')}
                    />
                    <span className="bg-gray-100 border border-l-0 border-gray-300 px-3 py-3 rounded-r-lg text-gray-600 text-sm">
                      Kč/rok
                    </span>
                  </div>
                </div>

                <div>
                  <label className="form-label">Využití plynu:</label>
                  <div className="space-y-2 mt-2">
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="form-checkbox mr-2"
                        {...register('gasUsage.heating')}
                      />
                      Vytápění
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="form-checkbox mr-2"
                        {...register('gasUsage.hotWater')}
                      />
                      Ohřev vody
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="form-checkbox mr-2"
                        {...register('gasUsage.technology')}
                      />
                      Technologie/výroba
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="form-checkbox mr-2"
                        {...register('gasUsage.cooking')}
                      />
                      Vaření
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Další spotřeby mimo energetickou bilanci */}
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Další spotřeby mimo energetickou bilanci
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="form-label">Spotřeba teplé vody:</label>
              <div className="flex">
                <input
                  type="number"
                  className="form-input rounded-r-none"
                  placeholder="Spotřeba"
                  {...register('hotWaterConsumption')}
                />
                <span className="bg-gray-100 border border-l-0 border-gray-300 px-3 py-3 rounded-r-lg text-gray-600 text-sm">
                  l/den
                </span>
              </div>
            </div>
            
            <div>
              <label className="form-label">Spotřeba páry:</label>
              <div className="flex">
                <input
                  type="number"
                  className="form-input rounded-r-none"
                  placeholder="Spotřeba"
                  {...register('steamConsumption')}
                />
                <span className="bg-gray-100 border border-l-0 border-gray-300 px-3 py-3 rounded-r-lg text-gray-600 text-sm">
                  kg/hod
                </span>
              </div>
            </div>
            
            <div>
              <label className="form-label">Jiné spotřeby:</label>
              <textarea
                className="form-input mt-2"
                rows={3}
                placeholder="Popište další spotřeby mimo elektřinu a plyn (chlazení, stlačený vzduch, atd.)"
                {...register('otherConsumption')}
              />
            </div>
          </div>
        </div>

        {/* Kogenerační jednotka */}
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Factory className="h-5 w-5 mr-2" />
            Kogenerační jednotka
          </h3>
          
          <div>
            <label className="form-label">Máte kogenerační jednotku (vlastní výrobní zdroj elektřiny/tepla/chladu)?</label>
            <div className="flex gap-6 mt-3">
              <label className="flex items-center">
                <input 
                  type="radio" 
                  className="form-radio mr-2"
                  value="yes"
                  {...register('hasCogeneration')}
                />
                Ano
              </label>
              <label className="flex items-center">
                <input 
                  type="radio" 
                  className="form-radio mr-2"
                  value="no"
                  {...register('hasCogeneration')}
                />
                Ne
              </label>
            </div>
            
            {useWatch({ control, name: 'hasCogeneration' }) === 'yes' && (
              <div className="mt-4 space-y-4">
                <div>
                  <label className="form-label">Detaily kogenerační jednotky:</label>
                  <textarea
                    className="form-input mt-2"
                    rows={3}
                    placeholder="Popište typ, výkon, palivo, provozní režim kogenerační jednotky..."
                    {...register('cogenerationDetails')}
                  />
                </div>
                
                <FileUploadField
                  name="cogenerationPhotos"
                  label="Nahrát foto parametrů kogenerační jednotky:"
                  accept=".jpg,.jpeg,.png,.pdf"
                  multiple={true}
                  formId={formId}
                  register={register}
                  setValue={setValue}
                  watch={watch}
                  helpText="Nahrávejte fotky štítků, technických parametrů nebo dokumentace"
                />
              </div>
            )}
          </div>
        </div>

        {/* Doplňující informace */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <label className="form-label">Doplňující informace k energetice:</label>
          <textarea
            className="form-input mt-2"
            rows={3}
            placeholder="Další důležité informace o energetických potřebách, plánech, specifických požadavcích..."
            {...register('energyNotes')}
          />
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-800 text-sm">
          <strong>Informace:</strong> Tyto údaje nám pomohou lépe pochopit vaše energetické potřeby a navrhnout optimální řešení 
          zahrnující všechny vaše spotřeby a zdroje energie.
        </p>
      </div>
    </div>
  )
}

export default FormStep8
