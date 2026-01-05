import { useFormContext, useWatch } from 'react-hook-form'
import { TrendingUp, Activity, FileText, Zap, Target, Shield, Battery, HelpCircle, Clock } from 'lucide-react'
import TimeSlider from '../TimeSlider'
import FileUploadField from '../FileUploadField'

const FormStep3 = ({ formId }) => {
  const { register, control, setValue, watch } = useFormContext()
  
  // Watch for conditional fields
  const hasDistributionCurves = useWatch({
    control,
    name: 'hasDistributionCurves'
  })

  const measurementType = useWatch({
    control,
    name: 'measurementType'
  })

  const hasCriticalConsumption = useWatch({
    control,
    name: 'hasCriticalConsumption'
  })

  const energyAccumulation = useWatch({
    control,
    name: 'energyAccumulation'
  })

  const requiresBackup = useWatch({
    control,
    name: 'requiresBackup'
  })

  // Watch for supplementary questions
  const hasElectricityProblems = useWatch({
    control,
    name: 'hasElectricityProblems'
  })

  const hasEnergyAudit = useWatch({
    control,
    name: 'hasEnergyAudit'
  })

  const hasOwnEnergySource = useWatch({
    control,
    name: 'hasOwnEnergySource'
  })

  const canProvideLoadSchema = useWatch({
    control,
    name: 'canProvideLoadSchema'
  })

  const backupDuration = useWatch({
    control,
    name: 'backupDuration'
  })

return (
    <div className="space-y-6">
        <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
                <TrendingUp className="h-8 w-8 text-primary-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">
                    Energetické potřeby
                </h2>
            </div>
            <p className="text-gray-600">
                Detailní informace o energetické spotřebě a požadavcích
            </p>
        </div>

        <div className="space-y-6">
            {/* Má zákazník odběrové křivky z distribuční soustavy */}
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <label className="form-label">
                            <FileText className="inline h-5 w-5 mr-2" />
                            Má zákazník odběrové diagramy z distribučního portálu (např. ČEZ, PRE, E.GD)?
                        </label>
                        <div className="flex gap-6 mt-3">
                            <label className="flex items-center">
                                <input 
                            type="radio" 
                            className="form-radio mr-2"
                            value="yes"
                            {...register('hasDistributionCurves')}
                                />
                                Ano
                            </label>
                            <label className="flex items-center">
                                <input 
                            type="radio" 
                            className="form-radio mr-2"
                            value="no"
                            {...register('hasDistributionCurves')}
                                />
                                Ne
                            </label>
                        </div>
                        
                        {hasDistributionCurves === 'yes' && (
                            <div className="mt-4 p-3 bg-white rounded border">
                                <p className="text-sm text-blue-800 font-medium mb-2">
                            Vyžádáme data za minimálně 3 měsíce
                                </p>
                                <FileUploadField
                                  name="distributionCurvesFile"
                                  label="Nahrát soubor s odběrovými křivkami:"
                                  accept=".csv,.xlsx,.xls"
                                  multiple={false}
                                  formId={formId}
                                  register={register}
                                  setValue={setValue}
                                  watch={watch}
                                />
                            </div>
                        )}
                    </div>

                    {/* Distribuční území */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <label className="form-label">
                            <FileText className="inline h-5 w-5 mr-2" />
                            Zákazník se nachází v distribučním území:
                        </label>
                        <div className="flex flex-wrap gap-6 mt-3">
                            <label className="flex items-center">
                                <input 
                            type="radio" 
                            className="form-radio mr-3"
                            value="cez"
                            {...register('distributionTerritory')}
                                />
                                <span>ČEZ</span>
                            </label>
                            <label className="flex items-center">
                                <input 
                            type="radio" 
                            className="form-radio mr-3"
                            value="pre"
                            {...register('distributionTerritory')}
                                />
                                <span>PRE</span>
                            </label>
                            <label className="flex items-center">
                                <input 
                            type="radio" 
                            className="form-radio mr-3"
                            value="egd"
                            {...register('distributionTerritory')}
                                />
                                <span>E.GD</span>
                            </label>
                            <label className="flex items-center">
                                <input 
                            type="radio" 
                            className="form-radio mr-3"
                            value="lds"
                            {...register('distributionTerritory')}
                                />
                                <span>LDS</span>
                            </label>
                        </div>
                        
                        {useWatch({ control, name: 'distributionTerritory' }) === 'lds' && (
                            <div className="mt-3 space-y-3">
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Název lokální distribuční soustavy"
                                    {...register('ldsName')}
                                />
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Majitel LDS (název společnosti)"
                                    {...register('ldsOwner')}
                                />
                                <textarea
                                    className="form-input"
                                    rows="2"
                                    placeholder="Dodatečné informace o LDS"
                                    {...register('ldsNotes')}
                                />
                            </div>
                        )}
                    </div>

                    {/* Typ měření spotřeby */}
            <div className="bg-gray-50 p-4 rounded-lg">
                <label className="form-label">
                    <Activity className="inline h-5 w-5 mr-2" />
                    Typ měření spotřeby
                </label>
                <div className="flex gap-6 mt-3">
                    <label className="flex items-center">
                        <input 
                            type="radio" 
                            className="form-radio mr-3"
                            value="quarter-hour"
                            {...register('measurementType')}
                        />
                        <span>Čtvrthodinové měření (A-měření)</span>
                    </label>
                    <label className="flex items-center">
                        <input 
                            type="radio" 
                            className="form-radio mr-3"
                            value="other"
                            {...register('measurementType')}
                        />
                        <span>Jiné</span>
                    </label>
                </div>
                
                {measurementType === 'other' && (
                    <div className="mt-3">
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Popište typ měření"
                            {...register('measurementTypeOther')}
                        />
                    </div>
                )}
            </div>

            {/* Slider pro spotřební vzorce */}
            <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    Denní spotřební vzorce (0-24h)
                </h3>
                
                {/* Pracovní dny (Po-Pá) */}
                <div className="mb-6">
                    <h4 className="text-md font-medium text-gray-800 mb-3">Pracovní dny (Pondělí - Pátek)</h4>
                    <TimeSlider 
                        register={register}
                        watch={useWatch}
                        control={control}
                        prefix="weekday"
                        label="Pracovní dny"
                    />
                </div>



                {/* Víkendy a svátky */}
                <div>
                    <h4 className="text-md font-medium text-gray-800 mb-3">Víkendy a svátky</h4>
                    <TimeSlider 
                        register={register}
                        watch={useWatch}
                        control={control}
                        prefix="weekend"
                        label="Víkendy"
                    />
                </div>
            </div>



            {/* Energetické parametry */}
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Zap className="h-5 w-5 mr-2" />
                    Energetické parametry
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Roční spotřeba elektřiny */}
                    <div>
                        <label className="form-label">Roční spotřeba elektřiny:</label>
                        <div className="flex">
                            <input
                                type="number"
                                className="form-input rounded-r-none"
                                placeholder="Hodnota"
                                {...register('yearlyConsumption')}
                            />
                            <span className="bg-gray-100 border border-l-0 border-gray-300 px-3 py-3 rounded-r-lg text-gray-600 text-sm">
                                MWh
                            </span>
                        </div>
                    </div>

                    {/* Průměrná denní spotřeba */}
                    <div>
                        <label className="form-label">Průměrná denní spotřeba:</label>
                        <div className="flex">
                            <input
                                type="number"
                                className="form-input rounded-r-none"
                                placeholder="Hodnota"
                                {...register('dailyAverageConsumption')}
                            />
                            <span className="bg-gray-100 border border-l-0 border-gray-300 px-3 py-3 rounded-r-lg text-gray-600 text-sm">
                                kWh
                            </span>
                        </div>
                    </div>

                    {/* Maximální odběr (špička) */}
                    <div>
                        <label className="form-label">Maximální odběr v kW (špička):</label>
                        <div className="flex">
                            <input
                                type="number"
                                className="form-input rounded-r-none"
                                placeholder="Hodnota"
                                {...register('maxConsumption')}
                            />
                            <span className="bg-gray-100 border border-l-0 border-gray-300 px-3 py-3 rounded-r-lg text-gray-600 text-sm">
                                kW
                            </span>
                        </div>
                    </div>

                    {/* Minimální odběr */}
                    <div>
                        <label className="form-label">Minimální odběr (v noci / o víkendu):</label>
                        <div className="flex">
                            <input
                                type="number"
                                className="form-input rounded-r-none"
                                placeholder="Hodnota"
                                {...register('minConsumption')}
                            />
                            <span className="bg-gray-100 border border-l-0 border-gray-300 px-3 py-3 rounded-r-lg text-gray-600 text-sm">
                                kW
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Kritické spotřeby nebo stroje se špičkami */}
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <label className="form-label">
                    <Target className="inline h-5 w-5 mr-2" />
                    Kritické spotřeby nebo stroje se špičkami?
                </label>
                <div className="flex gap-6 mt-3">
                    <label className="flex items-center">
                        <input 
                            type="radio" 
                            className="form-radio mr-2"
                            value="yes"
                            {...register('hasCriticalConsumption')}
                        />
                        Ano
                    </label>
                    <label className="flex items-center">
                        <input 
                            type="radio" 
                            className="form-radio mr-2"
                            value="no"
                            {...register('hasCriticalConsumption')}
                        />
                        Ne
                    </label>
                </div>
                
                {hasCriticalConsumption === 'yes' && (
                    <div className="mt-3">
                        <textarea
                            className="form-input"
                            rows={3}
                            placeholder="Popište kritické spotřeby nebo stroje se špičkami..."
                            {...register('criticalConsumptionDescription')}
                        />
                    </div>
                )}
            </div>

            {/* Kolik energie denně by chtěl zákazník akumulovat */}
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <label className="form-label">
                    <Battery className="inline h-5 w-5 mr-2" />
                    Kolik energie denně by chtěl zákazník akumulovat?
                </label>
                <div className="flex gap-6 mt-3">
                    <label className="flex items-center">
                        <input 
                            type="radio" 
                            className="form-radio mr-2"
                            value="unknown"
                            {...register('energyAccumulation')}
                        />
                        Neví
                    </label>
                    <label className="flex items-center">
                        <input 
                            type="radio" 
                            className="form-radio mr-2"
                            value="specific"
                            {...register('energyAccumulation')}
                        />
                        Konkrétní hodnota
                    </label>
                </div>
                
                {energyAccumulation === 'specific' && (
                    <div className="mt-3 flex items-center gap-2">
                        <input
                            type="number"
                            className="form-input w-32"
                            placeholder="Hodnota"
                            {...register('energyAccumulationAmount')}
                        />
                        <span className="text-gray-600">kWh</span>
                    </div>
                )}
            </div>

            {/* Požadovaný počet cyklů baterie denně */}
            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                <label className="form-label">Požadovaný počet cyklů baterie denně:</label>
                <div className="flex flex-wrap gap-6 mt-3">
                    <label className="flex items-center">
                        <input 
                            type="radio" 
                            className="form-radio mr-2"
                            value="once"
                            {...register('batteryCycles')}
                        />
                        1x denně
                    </label>
                    <label className="flex items-center">
                        <input 
                            type="radio" 
                            className="form-radio mr-2"
                            value="multiple"
                            {...register('batteryCycles')}
                        />
                        Vícekrát denně
                    </label>
                    <label className="flex items-center">
                        <input 
                            type="radio" 
                            className="form-radio mr-2"
                            value="recommend"
                            {...register('batteryCycles')}
                        />
                        Neznámo - doporučit
                    </label>
                </div>
            </div>

            {/* Je požadavek na zálohování objektu při výpadku */}
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <label className="form-label">
                    <Shield className="inline h-5 w-5 mr-2" />
                    Je požadavek na zálohování objektu při výpadku?
                </label>
                <div className="flex gap-6 mt-3">
                    <label className="flex items-center">
                        <input 
                            type="radio" 
                            className="form-radio mr-2"
                            value="yes"
                            {...register('requiresBackup')}
                        />
                        Ano
                    </label>
                    <label className="flex items-center">
                        <input 
                            type="radio" 
                            className="form-radio mr-2"
                            value="no"
                            {...register('requiresBackup')}
                        />
                        Ne
                    </label>
                </div>
                
                {requiresBackup === 'yes' && (
                    <div className="mt-3">
                        <label className="form-label text-sm">Pro které části je zálohování žádoucí:</label>
                        <textarea
                            className="form-input"
                            rows={2}
                            placeholder="Popište které části objektu chcete zálohovat..."
                            {...register('backupDescription')}
                        />
                    </div>
                )}
            </div>

            {/* Jak dlouhou výdrž zálohy zákazník požaduje */}
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <label className="form-label">Jak dlouhou výdrž zálohy zákazník požaduje?</label>
                <div className="flex flex-wrap gap-6 mt-3">
                    <label className="flex items-center">
                        <input 
                            type="radio" 
                            className="form-radio mr-2"
                            value="minutes"
                            {...register('backupDuration')}
                        />
                        Desítky minut
                    </label>
                    <label className="flex items-center">
                        <input 
                            type="radio" 
                            className="form-radio mr-2"
                            value="hours-1-3"
                            {...register('backupDuration')}
                        />
                        1-3 hodiny
                    </label>
                    <label className="flex items-center">
                        <input 
                            type="radio" 
                            className="form-radio mr-2"
                            value="hours-3-plus"
                            {...register('backupDuration')}
                        />
                        Více než 3 hodiny
                    </label>
                    <label className="flex items-center">
                        <input 
                            type="radio" 
                            className="form-radio mr-2"
                            value="exact-time"
                            {...register('backupDuration')}
                        />
                        Přesný čas
                    </label>
                </div>
                
                {backupDuration === 'exact-time' && (
                    <div className="mt-3 flex items-center gap-2">
                        <label className="form-label text-sm mr-2">Počet hodin:</label>
                        <input
                            type="number"
                            className="form-input w-32"
                            placeholder="Např. 8"
                            min="0.5"
                            step="0.5"
                            {...register('backupDurationHours')}
                        />
                        <span className="text-gray-600">hodin</span>
                    </div>
                )}
            </div>

            {/* Má být baterie řízena podle ceny elektřiny */}
            <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
                <label className="form-label">
                    Má být baterie řízena podle ceny elektřiny (např. spotový trh, optimalizace nákupů)?
                </label>
                <div className="flex gap-6 mt-3">
                    <label className="flex items-center">
                        <input 
                            type="radio" 
                            className="form-radio mr-2"
                            value="yes"
                            {...register('priceOptimization')}
                        />
                        Ano
                    </label>
                    <label className="flex items-center">
                        <input 
                            type="radio" 
                            className="form-radio mr-2"
                            value="no"
                            {...register('priceOptimization')}
                        />
                        Ne
                    </label>
                </div>
            </div>

            {/* Doplňující technické otázky */}
            <div className="bg-amber-50 p-6 rounded-lg border border-amber-200">
                <h3 className="font-semibold text-amber-900 mb-4 flex items-center">
                    <HelpCircle className="h-5 w-5 mr-2" />
                    Doplňující technické otázky
                </h3>
                
                <div className="space-y-6">
                    <div className="bg-white p-4 rounded-lg border border-amber-100">
                        <label className="form-label">Máte problémy s výpadky elektřiny?</label>
                        <div className="flex gap-6 mt-2">
                            <label className="flex items-center">
                                <input 
                                    type="radio" 
                                    className="form-radio mr-2"
                                    value="yes"
                                    {...register('hasElectricityProblems')}
                                />
                                Ano
                            </label>
                            <label className="flex items-center">
                                <input 
                                    type="radio" 
                                    className="form-radio mr-2"
                                    value="no"
                                    {...register('hasElectricityProblems')}
                                />
                                Ne
                            </label>
                        </div>
                        {hasElectricityProblems === 'yes' && (
                            <input
                                type="text"
                                className="form-input mt-3"
                                placeholder="Uveďte jaké výpadky za rok"
                                {...register('electricityProblemsDetails')}
                            />
                        )}
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-amber-100">
                        <label className="form-label">Máte zpracovaný energetický audit?</label>
                        <div className="flex gap-6 mt-2">
                            <label className="flex items-center">
                                <input 
                                    type="radio" 
                                    className="form-radio mr-2"
                                    value="yes"
                                    {...register('hasEnergyAudit')}
                                />
                                Ano
                            </label>
                            <label className="flex items-center">
                                <input 
                                    type="radio" 
                                    className="form-radio mr-2"
                                    value="no"
                                    {...register('hasEnergyAudit')}
                                />
                                Ne
                            </label>
                        </div>
                        {hasEnergyAudit === 'yes' && (
                            <input
                                type="text"
                                className="form-input mt-3"
                                placeholder="Prosíme zaslat emailem"
                                {...register('energyAuditDetails')}
                            />
                        )}
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-amber-100">
                        <label className="form-label">Máte vlastní výrobní zdroj elektřiny/tepla?</label>
                        <div className="flex gap-6 mt-2">
                            <label className="flex items-center">
                                <input 
                                    type="radio" 
                                    className="form-radio mr-2"
                                    value="yes"
                                    {...register('hasOwnEnergySource')}
                                />
                                Ano
                            </label>
                            <label className="flex items-center">
                                <input 
                                    type="radio" 
                                    className="form-radio mr-2"
                                    value="no"
                                    {...register('hasOwnEnergySource')}
                                />
                                Ne
                            </label>
                        </div>
                        {hasOwnEnergySource === 'yes' && (
                            <input
                                type="text"
                                className="form-input mt-3"
                                placeholder="Popište jaký zdroj máte a jak ho využíváte"
                                {...register('ownEnergySourceDetails')}
                            />
                        )}
                    </div>

                </div>
            </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 text-sm">
                <strong>Informace:</strong> Tyto údaje jsou klíčové pro návrh optimálního bateriového úložiště přesně podle vašich potřeb.
            </p>
        </div>
    </div>
)
}

export default FormStep3
