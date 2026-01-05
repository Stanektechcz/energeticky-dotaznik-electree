import { Check, StickyNote, Edit3 } from 'lucide-react'
import { useState } from 'react'

const StepIndicator = ({ currentStep, totalSteps, onStepClick, visitedSteps, stepNotes, stepNames, onUpdateStepNote }) => {
  const [editingNote, setEditingNote] = useState(null)
  const [tempNote, setTempNote] = useState('')

  const steps = [
    'Identifikační údaje',
    'Parametry odběrného místa', 
    'Energetické potřeby',
    'Cíle a očekávání',
    'Infrastruktura',
    'Provozní rámec',
    'Poznámky',
    'Energetický dotazník'
  ]

  const handleNoteEdit = (stepNumber) => {
    setEditingNote(stepNumber)
    setTempNote(stepNotes[stepNumber] || '')
  }

  const handleNoteSave = (stepNumber) => {
    onUpdateStepNote(stepNumber, tempNote)
    setEditingNote(null)
    setTempNote('')
  }

  const handleNoteCancel = () => {
    setEditingNote(null)
    setTempNote('')
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Modern Progress Bar */}
      <div className="relative mb-8">
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-700 ease-out shadow-sm" 
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
        <div className="absolute -top-1 left-0 w-full flex justify-between">
          {steps.map((_, index) => {
            const stepNumber = index + 1
            const isActive = stepNumber === currentStep
            const isCompleted = stepNumber < currentStep
            const isClickable = visitedSteps.has(stepNumber)
            
            return (
              <div
                key={stepNumber}
                className={`w-5 h-5 rounded-full border-4 transition-all duration-300 ${
                  isActive 
                    ? 'bg-blue-600 border-white shadow-lg scale-125' 
                    : isCompleted 
                    ? 'bg-green-500 border-white shadow-md' 
                    : isClickable
                    ? 'bg-blue-100 border-white shadow-sm hover:bg-blue-200'
                    : 'bg-gray-300 border-white'
                }`}
                style={{ marginLeft: stepNumber === 1 ? '-10px' : '-10px' }}
              />
            )
          })}
        </div>
      </div>

      {/* Desktop Step Indicators */}
      <div className="hidden lg:block mb-8">
        {/* První řádek - kroky 1-4 */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {steps.slice(0, 4).map((step, index) => {
            const stepNumber = index + 1
            const isActive = stepNumber === currentStep
            const isCompleted = stepNumber < currentStep
            const isClickable = visitedSteps.has(stepNumber)
            const hasNote = stepNotes[stepNumber] && stepNotes[stepNumber].trim() !== ''
            
            return (
              <div key={stepNumber} className="flex flex-col items-center space-y-3">
                {/* Step Button */}
                <button
                  type="button"
                  onClick={() => isClickable && onStepClick && onStepClick(stepNumber)}
                  disabled={!isClickable}
                  className={`group relative w-16 h-16 rounded-2xl border-2 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 disabled:cursor-not-allowed disabled:transform-none ${
                    isActive 
                      ? 'bg-blue-600 border-blue-600 text-white shadow-blue-200' 
                      : isCompleted 
                      ? 'bg-green-500 border-green-500 text-white shadow-green-200' 
                      : isClickable
                      ? 'bg-white border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-400'
                      : 'bg-gray-100 border-gray-300 text-gray-400'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="h-6 w-6 mx-auto" />
                  ) : (
                    <span className="text-lg font-bold">{stepNumber}</span>
                  )}
                  
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute -inset-1 bg-blue-600 rounded-2xl animate-pulse opacity-30 -z-10"></div>
                  )}
                </button>
                
                {/* Step Title and Note Button Container */}
                <div className="text-center flex flex-col items-center space-y-2">
                  <h3 className={`text-sm font-semibold transition-colors ${
                    isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : isClickable ? 'text-gray-700 hover:text-blue-600' : 'text-gray-400'
                  }`}>
                    {step}
                  </h3>
                  
                  {/* Note Button - pouze když se neupravuje poznámka */}
                  {editingNote !== stepNumber && (
                    <button
                      type="button"
                      onClick={() => handleNoteEdit(stepNumber)}
                      className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg transition-all ${
                        hasNote 
                          ? 'text-yellow-700 bg-yellow-50 hover:bg-yellow-100 border border-yellow-200' 
                          : 'text-gray-500 bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:text-blue-600'
                      }`}
                    >
                      <Edit3 className="h-3 w-3" />
                      {hasNote ? 'Upravit poznámku' : 'Přidat poznámku'}
                    </button>
                  )}
                </div>

                {/* Note Section */}
                <div className="w-full min-h-[80px] flex flex-col items-center">
                  {editingNote === stepNumber ? (
                    <div className="w-full space-y-2">
                      <textarea
                        value={tempNote}
                        onChange={(e) => setTempNote(e.target.value)}
                        placeholder={`${step} - poznámka`}
                        className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        rows="3"
                        autoFocus
                      />
                      <div className="flex gap-2 justify-center">
                        <button
                          type="button"
                          onClick={() => handleNoteSave(stepNumber)}
                          className="px-3 py-1 text-xs bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                        >
                          Uložit
                        </button>
                        <button
                          type="button"
                          onClick={handleNoteCancel}
                          className="px-3 py-1 text-xs bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                        >
                          Zrušit
                        </button>
                      </div>
                    </div>
                  ) : hasNote && (
                    <div className="w-full space-y-2">
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 shadow-sm">
                        <div className="flex items-start gap-2">
                          <StickyNote className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                          <div className="text-xs text-gray-700">
                            <div className="font-medium text-yellow-800 mb-1">{step}</div>
                            <div className="break-words">{stepNotes[stepNumber]}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Druhý řádek - kroky 5-8 */}
        <div className="grid grid-cols-4 gap-4">
          {steps.slice(4, 8).map((step, index) => {
            const stepNumber = index + 5
            const isActive = stepNumber === currentStep
            const isCompleted = stepNumber < currentStep
            const isClickable = visitedSteps.has(stepNumber)
            const hasNote = stepNotes[stepNumber] && stepNotes[stepNumber].trim() !== ''
            
            return (
              <div key={stepNumber} className="flex flex-col items-center space-y-3">
                {/* Step Button */}
                <button
                  type="button"
                  onClick={() => isClickable && onStepClick && onStepClick(stepNumber)}
                  disabled={!isClickable}
                  className={`group relative w-16 h-16 rounded-2xl border-2 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 disabled:cursor-not-allowed disabled:transform-none ${
                    isActive 
                      ? 'bg-blue-600 border-blue-600 text-white shadow-blue-200' 
                      : isCompleted 
                      ? 'bg-green-500 border-green-500 text-white shadow-green-200' 
                      : isClickable
                      ? 'bg-white border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-400'
                      : 'bg-gray-100 border-gray-300 text-gray-400'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="h-6 w-6 mx-auto" />
                  ) : (
                    <span className="text-lg font-bold">{stepNumber}</span>
                  )}
                  
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute -inset-1 bg-blue-600 rounded-2xl animate-pulse opacity-30 -z-10"></div>
                  )}
                </button>
                
                {/* Step Title and Note Button Container */}
                <div className="text-center flex flex-col items-center space-y-2">
                  <h3 className={`text-sm font-semibold transition-colors ${
                    isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : isClickable ? 'text-gray-700 hover:text-blue-600' : 'text-gray-400'
                  }`}>
                    {step}
                  </h3>
                  
                  {/* Note Button - pouze když se neupravuje poznámka */}
                  {editingNote !== stepNumber && (
                    <button
                      type="button"
                      onClick={() => handleNoteEdit(stepNumber)}
                      className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg transition-all ${
                        hasNote 
                          ? 'text-yellow-700 bg-yellow-50 hover:bg-yellow-100 border border-yellow-200' 
                          : 'text-gray-500 bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:text-blue-600'
                      }`}
                    >
                      <Edit3 className="h-3 w-3" />
                      {hasNote ? 'Upravit poznámku' : 'Přidat poznámku'}
                    </button>
                  )}
                </div>

                {/* Note Section */}
                <div className="w-full min-h-[80px] flex flex-col items-center">
                  {editingNote === stepNumber ? (
                    <div className="w-full space-y-2">
                      <textarea
                        value={tempNote}
                        onChange={(e) => setTempNote(e.target.value)}
                        placeholder={`${step} - poznámka`}
                        className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        rows="3"
                        autoFocus
                      />
                      <div className="flex gap-2 justify-center">
                        <button
                          type="button"
                          onClick={() => handleNoteSave(stepNumber)}
                          className="px-3 py-1 text-xs bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                        >
                          Uložit
                        </button>
                        <button
                          type="button"
                          onClick={handleNoteCancel}
                          className="px-3 py-1 text-xs bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                        >
                          Zrušit
                        </button>
                      </div>
                    </div>
                  ) : hasNote && (
                    <div className="w-full space-y-2">
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 shadow-sm">
                        <div className="flex items-start gap-2">
                          <StickyNote className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                          <div className="text-xs text-gray-700">
                            <div className="font-medium text-yellow-800 mb-1">{step}</div>
                            <div className="break-words">{stepNotes[stepNumber]}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Tablet Step Indicators */}
      <div className="hidden md:block lg:hidden mb-8">
        <div className="grid grid-cols-4 gap-4 mb-6">
          {steps.slice(0, 4).map((step, index) => {
            const stepNumber = index + 1
            const isActive = stepNumber === currentStep
            const isCompleted = stepNumber < currentStep
            const isClickable = visitedSteps.has(stepNumber)
            const hasNote = stepNotes[stepNumber] && stepNotes[stepNumber].trim() !== ''
            
            return (
              <div key={stepNumber} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
                <button
                  type="button"
                  onClick={() => isClickable && onStepClick && onStepClick(stepNumber)}
                  disabled={!isClickable}
                  className={`w-full mb-3 p-3 rounded-lg transition-all duration-300 ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : isCompleted 
                      ? 'bg-green-500 text-white shadow-md' 
                      : isClickable
                      ? 'bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    {isCompleted ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <span className="text-lg font-bold">{stepNumber}</span>
                    )}
                  </div>
                </button>
                
                <h4 className="text-sm font-semibold text-center text-gray-700 mb-2">{step}</h4>
                
                {hasNote && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded p-2 mb-2">
                    <div className="flex items-center gap-1 text-xs text-yellow-700">
                      <StickyNote className="h-3 w-3" />
                      <span className="truncate">{stepNotes[stepNumber]}</span>
                    </div>
                  </div>
                )}
                
                <button
                  onClick={() => handleNoteEdit(stepNumber)}
                  className="w-full text-xs text-gray-500 hover:text-blue-600 transition-colors py-1"
                >
                  {hasNote ? 'Upravit' : '+ Poznámka'}
                </button>
              </div>
            )
          })}
        </div>
        
        <div className="grid grid-cols-4 gap-4">
          {steps.slice(4, 8).map((step, index) => {
            const stepNumber = index + 5
            const isActive = stepNumber === currentStep
            const isCompleted = stepNumber < currentStep
            const isClickable = visitedSteps.has(stepNumber)
            const hasNote = stepNotes[stepNumber] && stepNotes[stepNumber].trim() !== ''
            
            return (
              <div key={stepNumber} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
                <button
                  type="button"
                  onClick={() => isClickable && onStepClick && onStepClick(stepNumber)}
                  disabled={!isClickable}
                  className={`w-full mb-3 p-3 rounded-lg transition-all duration-300 ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : isCompleted 
                      ? 'bg-green-500 text-white shadow-md' 
                      : isClickable
                      ? 'bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    {isCompleted ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <span className="text-lg font-bold">{stepNumber}</span>
                    )}
                  </div>
                </button>
                
                <h4 className="text-sm font-semibold text-center text-gray-700 mb-2">{step}</h4>
                
                {hasNote && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded p-2 mb-2">
                    <div className="flex items-center gap-1 text-xs text-yellow-700">
                      <StickyNote className="h-3 w-3" />
                      <span className="truncate">{stepNotes[stepNumber]}</span>
                    </div>
                  </div>
                )}
                
                <button
                  onClick={() => handleNoteEdit(stepNumber)}
                  className="w-full text-xs text-gray-500 hover:text-blue-600 transition-colors py-1"
                >
                  {hasNote ? 'Upravit' : '+ Poznámka'}
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Mobile Step Indicators */}
      <div className="md:hidden">
        {/* Current Step Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                currentStep <= totalSteps ? 'bg-blue-600' : 'bg-gray-400'
              }`}>
                {currentStep < totalSteps ? (
                  currentStep
                ) : (
                  <Check className="h-6 w-6" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Krok {currentStep}</h3>
                <p className="text-sm text-gray-600">{steps[currentStep - 1]}</p>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              {currentStep} / {totalSteps}
            </div>
          </div>
          
          {/* Progress indicator */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
          
          {/* Current step note */}
          {stepNotes[currentStep] && stepNotes[currentStep].trim() !== '' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <div className="flex items-start gap-2">
                <StickyNote className="h-4 w-4 text-yellow-600 mt-0.5" />
                <div className="text-sm text-gray-700">
                  <div className="font-medium text-yellow-800 mb-1">{steps[currentStep - 1]}</div>
                  <div>{stepNotes[currentStep]}</div>
                </div>
              </div>
            </div>
          )}
          
          <button
            type="button"
            onClick={() => handleNoteEdit(currentStep)}
            className="w-full py-2 text-sm text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <Edit3 className="h-4 w-4 inline mr-2" />
            {stepNotes[currentStep] && stepNotes[currentStep].trim() !== '' ? 'Upravit poznámku' : 'Přidat poznámku'}
          </button>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-4 gap-3">
          {steps.map((step, index) => {
            const stepNumber = index + 1
            const isActive = stepNumber === currentStep
            const isCompleted = stepNumber < currentStep
            const isClickable = visitedSteps.has(stepNumber)
            const hasNote = stepNotes[stepNumber] && stepNotes[stepNumber].trim() !== ''
            
            return (
              <button
                key={stepNumber}
                type="button"
                onClick={() => isClickable && onStepClick && onStepClick(stepNumber)}
                disabled={!isClickable}
                className={`relative p-3 rounded-lg border-2 transition-all duration-200 ${
                  isActive 
                    ? 'bg-blue-600 border-blue-600 text-white shadow-lg' 
                    : isCompleted 
                    ? 'bg-green-500 border-green-500 text-white shadow-md' 
                    : isClickable
                    ? 'bg-white border-blue-300 text-blue-600 hover:bg-blue-50'
                    : 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
                }`}
              >
                <div className="flex flex-col items-center space-y-1">
                  <div className="text-lg font-bold">
                    {isCompleted ? <Check className="h-5 w-5" /> : stepNumber}
                  </div>
                  <div className="text-xs leading-tight text-center">
                    {step.split(' ').slice(0, 2).join(' ')}
                  </div>
                  {hasNote && (
                    <StickyNote className="h-3 w-3 opacity-70" />
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Note Editing Modal for Mobile/Tablet */}
      {editingNote && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">
              Poznámka ke kroku {editingNote}: {stepNames[editingNote]}
            </h3>
            <textarea
              value={tempNote}
              onChange={(e) => setTempNote(e.target.value)}
              placeholder={`${stepNames[editingNote]} - poznámka`}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows="4"
              autoFocus
            />
            <div className="flex gap-3 mt-4">
              <button
                type="button"
                onClick={() => handleNoteSave(editingNote)}
                className="flex-1 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Uložit poznámku
              </button>
              <button
                type="button"
                onClick={handleNoteCancel}
                className="flex-1 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Zrušit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StepIndicator
