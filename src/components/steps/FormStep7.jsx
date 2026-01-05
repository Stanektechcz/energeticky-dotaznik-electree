import { useFormContext, useWatch } from 'react-hook-form'
import { MessageSquare, FileText, Calendar } from 'lucide-react'

const FormStep7 = () => {
  const { register, control, watch } = useFormContext()

  // Watch for "other" procedure selection
  const otherProcedure = useWatch({
    control,
    name: 'proposedSteps.other'
  })

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">
          7. Navržený postup a poznámky
        </h2>
        <p className="text-gray-600">
          Specifické požadavky a zájem zákazníka
        </p>
      </div>

      <div className="space-y-6">
        {/* Navržený postup */}
        <div>
          <label className="form-label">
            <Calendar className="inline h-5 w-5 mr-2" />
            Navržený postup
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input 
                type="checkbox" 
                className="form-checkbox mr-3"
                {...register('proposedSteps.preliminary')}
              />
              <span>Předběžná nabídka</span>
            </label>
            <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input 
                type="checkbox" 
                className="form-checkbox mr-3"
                {...register('proposedSteps.technical')}
              />
              <span>Technická prohlídka</span>
            </label>
            <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input 
                type="checkbox" 
                className="form-checkbox mr-3"
                {...register('proposedSteps.detailed')}
              />
              <span>Příprava zakázky a připojení</span>
            </label>
            <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input 
                type="checkbox" 
                className="form-checkbox mr-3"
                {...register('proposedSteps.consultancy')}
              />
              <span>Konzultace s energetikem</span>
            </label>
            <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input 
                type="checkbox" 
                className="form-checkbox mr-3"
                {...register('proposedSteps.support')}
              />
              <span>Možnost obchodování s energií</span>
            </label>
            <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input 
                type="checkbox" 
                className="form-checkbox mr-3"
                {...register('proposedSteps.other')}
              />
              <span>Jiný postup</span>
            </label>
          </div>

          {/* Conditional textarea for "Other" procedure */}
          {otherProcedure && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <label className="form-label text-sm">
                Popište jiný postup:
                <span className="text-red-500 ml-1">*</span>
              </label>
              <textarea
                className="form-input mt-2"
                rows={4}
                placeholder="Popište podrobně, jaký alternativní postup si představujete..."
                {...register('proposedSteps.otherDescription', {
                  required: otherProcedure ? 'Popis jiného postupu je povinný' : false
                })}
              />
            </div>
          )}
        </div>

        {/* Poznámky */}
        <div>
          <label className="form-label">
            <FileText className="inline h-5 w-5 mr-2" />
            Poznámky
          </label>
          <p className="text-sm text-gray-600 mb-3">
            Doplňte vše, co považujete za důležité doplnit!
          </p>
          <textarea
            className="form-input"
            rows={6}
            placeholder="Zde můžete uvést jakékoliv dodatečné informace, specifické požadavky, dotazy nebo připomínky, které považujete za důležité pro přípravu nabídky bateriového úložiště..."
            {...register('additionalNotes')}
          />
        </div>

        {/* Souhlas s dalším postupem */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="font-semibold text-green-900 mb-4">Souhlas s dalším postupem</h3>
          <div className="space-y-3">
            <label className="flex items-start">
              <input 
                type="checkbox" 
                className="form-checkbox mt-1 mr-3 flex-shrink-0"
                {...register('agreements.dataProcessing')}
              />
              <span className="text-sm">
                Souhlasím se zpracováním osobních údajů v rozsahu uvedeném v tomto formuláři za účelem 
                přípravy nabídky bateriového úložiště, FVE nebo jiného energetického řešení a následné komunikace.
              </span>
            </label>
            <label className="flex items-start">
              <input 
                type="checkbox" 
                className="form-checkbox mt-1 mr-3 flex-shrink-0"
                {...register('agreements.technicalVisit')}
              />
              <span className="text-sm">
                Souhlasím s návštěvou technika společnosti Electree za účelem přesnějšího 
                zhodnocení možností instalace bateriového úložiště.
              </span>
            </label>
            <label className="flex items-start">
              <input 
                type="checkbox" 
                className="form-checkbox mt-1 mr-3 flex-shrink-0"
                {...register('agreements.marketing')}
              />
              <span className="text-sm">
                Souhlasím s zasíláním obchodních sdělení a informací o nových produktech 
                a službách společnosti Electree (tento souhlas můžete kdykoliv odvolat).
              </span>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-800 text-sm">
          <strong>Děkujeme</strong> za vyplnění kompletního dotazníku! Vaše údaje nám pomohou připravit 
          co nejpřesnější a nejvhodnější nabídku bateriového úložiště pro vaše potřeby. Náš specialista se vám ozve do 2 pracovních dnů.
        </p>
      </div>
    </div>
  )
}

export default FormStep7
