import { useFormContext, useWatch } from 'react-hook-form'
import { Home, MapPin, Ruler, AlertTriangle, FileText, Truck } from 'lucide-react'
import FileUploadField from '../FileUploadField'

const FormStep5 = ({ formId }) => {
  const { register, control, setValue, watch } = useFormContext()
  
  // Watch for conditional fields
  const hasOutdoorSpace = useWatch({
    control,
    name: 'hasOutdoorSpace'
  })

  const hasIndoorSpace = useWatch({
    control,
    name: 'hasIndoorSpace'
  })

  const accessibility = useWatch({
    control,
    name: 'accessibility'
  })

  const hasProjectDocumentation = useWatch({
    control,
    name: 'hasProjectDocumentation'
  })

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Home className="h-8 w-8 text-primary-600 mr-3" />
          <h2 className="text-2xl font-bold text-gray-900">
            Infrastruktura a prostor
          </h2>
        </div>
        <p className="text-gray-600">
          Informace o dostupném prostoru pro instalaci bateriového úložiště
        </p>
      </div>

      <div className="space-y-6">
        {/* Nahrání fotek a vizualizací */}
        <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Fotografie a vizualizace místa
          </h3>
          
          <div className="space-y-4">
            <FileUploadField
              name="sitePhotos"
              label="Nahrát fotografie místa instalace:"
              accept=".jpg,.jpeg,.png,.heic"
              multiple={true}
              formId={formId}
              register={register}
              setValue={setValue}
              watch={watch}
              helpText="Přiložte fotografie místa kde bude baterie instalována, přístupové cesty, rozvaděče"
            />
            
            <FileUploadField
              name="visualizations"
              label="Nahrát vizualizace/nákresy:"
              accept=".jpg,.jpeg,.png,.pdf,.dwg"
              multiple={true}
              formId={formId}
              register={register}
              setValue={setValue}
              watch={watch}
              helpText="Podporované formáty: obrázky (JPG, PNG), PDF, AutoCAD (DWG)"
            />
            
            <div>
              <label className="form-label">Slovní popis místa:</label>
              <textarea
                className="form-input mt-2"
                rows={3}
                placeholder="Popište podrobně místo instalace, přístupnost, specifika prostoru..."
                {...register('siteDescription')}
              />
            </div>
          </div>
        </div>

        {/* K dispozici venkovní prostor */}
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <label className="form-label">
            <MapPin className="inline h-5 w-5 mr-2" />
            K dispozici venkovní prostor?
          </label>
          <div className="flex gap-6 mt-3">
            <label className="flex items-center">
              <input 
                type="radio" 
                className="form-radio mr-2"
                value="yes"
                {...register('hasOutdoorSpace')}
              />
              Ano
            </label>
            <label className="flex items-center">
              <input 
                type="radio" 
                className="form-radio mr-2"
                value="no"
                {...register('hasOutdoorSpace')}
              />
              Ne
            </label>
          </div>
          
          {hasOutdoorSpace === 'yes' && (
            <div className="mt-4">
              <label className="form-label">Velikost venkovního prostoru:</label>
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="number"
                  className="form-input w-32"
                  placeholder="Velikost"
                  {...register('outdoorSpaceSize')}
                />
                <span className="text-gray-600">m²</span>
              </div>
            </div>
          )}
        </div>

        {/* K dispozici vnitřní prostor */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <label className="form-label">
            <Home className="inline h-5 w-5 mr-2" />
            K dispozici vnitřní prostor?
          </label>
          <div className="flex gap-6 mt-3">
            <label className="flex items-center">
              <input 
                type="radio" 
                className="form-radio mr-2"
                value="yes"
                {...register('hasIndoorSpace')}
              />
              Ano
            </label>
            <label className="flex items-center">
              <input 
                type="radio" 
                className="form-radio mr-2"
                value="no"
                {...register('hasIndoorSpace')}
              />
              Ne
            </label>
          </div>
          
          {hasIndoorSpace === 'yes' && (
            <div className="mt-4 space-y-3">
              <div>
                <label className="form-label">Typ prostoru:</label>
                <input
                  type="text"
                  className="form-input mt-1"
                  placeholder="např. technická místnost, sklad, suterén..."
                  {...register('indoorSpaceType')}
                />
              </div>
              <div>
                <label className="form-label">Velikost vnitřního prostoru:</label>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="number"
                    className="form-input w-32"
                    placeholder="Velikost"
                    {...register('indoorSpaceSize')}
                  />
                  <span className="text-gray-600">m²</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Přístupnost místa */}
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <label className="form-label">
            <Truck className="inline h-5 w-5 mr-2" />
            Přístupnost místa (pro dopravu kontejneru, jeřáb, VZV):
          </label>
          <div className="flex gap-6 mt-3">
            <label className="flex items-center">
              <input 
                type="radio" 
                className="form-radio mr-2"
                value="unlimited"
                {...register('accessibility')}
              />
              Bez omezení
            </label>
            <label className="flex items-center">
              <input 
                type="radio" 
                className="form-radio mr-2"
                value="limited"
                {...register('accessibility')}
              />
              Omezený
            </label>
          </div>
          
          {accessibility === 'limited' && (
            <div className="mt-4">
              <label className="form-label">Specifikace omezení:</label>
              <textarea
                className="form-input mt-2"
                rows={3}
                placeholder="Popište omezení přístupnosti - úzké průjezdy, nízké mosty, měkký terén, hmotnostní omezení..."
                {...register('accessibilityLimitations')}
              />
            </div>
          )}
        </div>

        {/* K dispozici projektová dokumentace */}
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <label className="form-label">
            <FileText className="inline h-5 w-5 mr-2" />
            K dispozici projektová dokumentace areálu / rozvaděče?
          </label>
          <div className="flex gap-6 mt-3">
            <label className="flex items-center">
              <input 
                type="radio" 
                className="form-radio mr-2"
                value="yes"
                {...register('hasProjectDocumentation')}
              />
              Ano
            </label>
            <label className="flex items-center">
              <input 
                type="radio" 
                className="form-radio mr-2"
                value="no"
                {...register('hasProjectDocumentation')}
              />
              Ne
            </label>
          </div>
          
          {hasProjectDocumentation === 'yes' && (
            <div className="mt-4 space-y-3">
              <FileUploadField
                name="projectDocumentationFiles"
                label="Nahrát projektovou dokumentaci:"
                accept=".pdf,.dwg,.jpg,.jpeg,.png,.doc,.docx"
                multiple={true}
                formId={formId}
                register={register}
                setValue={setValue}
                watch={watch}
                helpText="Podporované formáty: PDF, DWG, obrázky (JPG, PNG), Word dokumenty"
              />
              <div>
                <label className="form-label">Typ dokumentace:</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="form-checkbox mr-2"
                      {...register('documentationTypes.sitePlan')}
                    />
                    Situační plán areálu
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="form-checkbox mr-2"
                      {...register('documentationTypes.electricalPlan')}
                    />
                    Elektrická dokumentace
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="form-checkbox mr-2"
                      {...register('documentationTypes.buildingPlan')}
                    />
                    Půdorysy budov
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="form-checkbox mr-2"
                      {...register('documentationTypes.other')}
                    />
                    Jiná dokumentace
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Doplňující informace */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <label className="form-label">Doplňující informace k prostoru a infrastruktuře:</label>
          <textarea
            className="form-input mt-2"
            rows={3}
            placeholder="Další důležité informace o prostoru, infrastruktuře, specifických požadavcích..."
            {...register('infrastructureNotes')}
          />
        </div>
      </div>

      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <div className="flex items-start">
          <AlertTriangle className="h-5 w-5 text-orange-600 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-orange-800 text-sm">
              <strong>Důležité:</strong> Přesné informace o dostupném prostoru a přístupnosti jsou kritické pro plánování instalace. 
              Nedostatečný prostor nebo špatná dostupnost mohou významně ovlivnit náklady a způsob realizace projektu.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FormStep5
