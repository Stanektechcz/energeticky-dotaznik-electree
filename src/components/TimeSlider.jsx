import React, { useEffect, useState } from 'react';
import { Clock, Zap, Moon, Sun, Sunset, SunDim } from 'lucide-react';

const TimeSlider = ({ register, watch, control, prefix, label }) => {
  const [timeRange1, setTimeRange1] = useState({ start: 6, end: 10 }); // Ranní špička
  const [timeRange2, setTimeRange2] = useState({ start: 12, end: 14 }); // Polední minimum
  const [timeRange3, setTimeRange3] = useState({ start: 16, end: 20 }); // Odpolední špička
  const [timeRange4, setTimeRange4] = useState({ start: 22, end: 6 }); // Noční minimum
  
  const [consumption1, setConsumption1] = useState(''); // Ranní špička
  const [consumption2, setConsumption2] = useState(''); // Polední minimum
  const [consumption3, setConsumption3] = useState(''); // Odpolední špička
  const [consumption4, setConsumption4] = useState(''); // Noční minimum

  // Watch values from react-hook-form
  const watchedData = watch ? watch() : {};

  // Calculate quarterly consumption based on time ranges and consumption values
  const calculateQuarterlyConsumption = () => {
    // Hodinové spotřeby (kW/h)
    const cons1 = parseFloat(consumption1) || 0; // Ranní špička (kW/h)
    const cons2 = parseFloat(consumption2) || 0; // Polední minimum (kW/h)
    const cons3 = parseFloat(consumption3) || 0; // Odpolední špička (kW/h)
    const cons4 = parseFloat(consumption4) || 0; // Noční minimum (kW/h)

    // Calculate quarterly values (each quarter = 15 minutes = 0.25 hours)
    // Pro čtvrthodinu vynásobíme hodinovou spotřebu 0.25
    const q1 = (cons1 * 0.25).toFixed(2); // kWh per quarter hour - ranní špička
    const q2 = (cons2 * 0.25).toFixed(2); // kWh per quarter hour - polední minimum
    const q3 = (cons3 * 0.25).toFixed(2); // kWh per quarter hour - odpolední špička
    const q4 = (cons4 * 0.25).toFixed(2); // kWh per quarter hour - noční minimum

    // Calculate period lengths
    const period1Hours = timeRange1.end - timeRange1.start;
    const period2Hours = timeRange2.end - timeRange2.start;
    const period3Hours = timeRange3.end - timeRange3.start;
    
    // Handle night period (can wrap around midnight)
    let period4Hours;
    if (timeRange4.end > timeRange4.start) {
      period4Hours = timeRange4.end - timeRange4.start;
    } else {
      period4Hours = (24 - timeRange4.start) + timeRange4.end;
    }

    const remainingHours = Math.max(0, 24 - period1Hours - period2Hours - period3Hours - period4Hours);

    // Calculate total daily consumption
    // Každé období: hodinová spotřeba × počet hodin
    const dailyTotal = (
      cons1 * period1Hours +    // Ranní špička: kW/h × hodiny
      cons2 * period2Hours +    // Polední minimum: kW/h × hodiny  
      cons3 * period3Hours +    // Odpolední špička: kW/h × hodiny
      cons4 * period4Hours +    // Noční minimum: kW/h × hodiny
      (cons1 * 0.7) * remainingHours // Zbývající hodiny na 70% ranní špičky
    );

    return {
      q1,
      q2, 
      q3,
      q4,
      totalHours: {
        period1: period1Hours,
        period2: period2Hours,
        period3: period3Hours,
        period4: period4Hours,
        remaining: remainingHours
      },
      dailyTotal: dailyTotal.toFixed(2)
    };
  };

  const quarterly = calculateQuarterlyConsumption();

  // Update form data when values change
  useEffect(() => {
    if (register) {
      // Register the time and consumption fields for all 4 periods
      register(`${prefix}Pattern.morningPeakStart`, { value: timeRange1.start });
      register(`${prefix}Pattern.morningPeakEnd`, { value: timeRange1.end });
      register(`${prefix}Pattern.morningPeakConsumption`, { value: consumption1 });
      
      register(`${prefix}Pattern.noonLowStart`, { value: timeRange2.start });
      register(`${prefix}Pattern.noonLowEnd`, { value: timeRange2.end });
      register(`${prefix}Pattern.noonLowConsumption`, { value: consumption2 });
      
      register(`${prefix}Pattern.afternoonPeakStart`, { value: timeRange3.start });
      register(`${prefix}Pattern.afternoonPeakEnd`, { value: timeRange3.end });
      register(`${prefix}Pattern.afternoonPeakConsumption`, { value: consumption3 });
      
      register(`${prefix}Pattern.nightLowStart`, { value: timeRange4.start });
      register(`${prefix}Pattern.nightLowEnd`, { value: timeRange4.end });
      register(`${prefix}Pattern.nightLowConsumption`, { value: consumption4 });
      
      register(`${prefix}Pattern.q1Consumption`, { value: quarterly.q1 });
      register(`${prefix}Pattern.q2Consumption`, { value: quarterly.q2 });
      register(`${prefix}Pattern.q3Consumption`, { value: quarterly.q3 });
      register(`${prefix}Pattern.q4Consumption`, { value: quarterly.q4 });
    }
  }, [register, prefix, timeRange1, timeRange2, timeRange3, timeRange4, consumption1, consumption2, consumption3, consumption4, quarterly]);

  const formatTime = (hour) => {
    return `${hour.toString().padStart(2, '0')}:00`;
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <div className="flex items-center mb-4">
        <Clock className="h-5 w-5 mr-2 text-blue-600" />
        <h4 className="font-medium text-gray-800">{label} - Detailní časové vzorce spotřeby</h4>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* První období - Ranní špička */}
        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <div className="flex items-center mb-3">
            <Sun className="h-4 w-4 mr-2 text-orange-600" />
            <h5 className="text-sm font-medium text-orange-800">Ranní špička (vysoká spotřeba)</h5>
          </div>
          
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Začátek:</label>
                <input
                  type="range"
                  min="4"
                  max="12"
                  value={timeRange1.start}
                  onChange={(e) => setTimeRange1({ ...timeRange1, start: parseInt(e.target.value) })}
                  className="w-full h-2 bg-orange-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="text-center text-xs text-gray-600 mt-1">
                  {formatTime(timeRange1.start)}
                </div>
              </div>
              
              <div>
                <label className="block text-xs text-gray-600 mb-1">Konec:</label>
                <input
                  type="range"
                  min={timeRange1.start + 1}
                  max="14"
                  value={timeRange1.end}
                  onChange={(e) => setTimeRange1({ ...timeRange1, end: parseInt(e.target.value) })}
                  className="w-full h-2 bg-orange-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="text-center text-xs text-gray-600 mt-1">
                  {formatTime(timeRange1.end)}
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                Spotřeba za hodinu v tomto období ({timeRange1.end - timeRange1.start}h):
              </label>
              <div className="flex">
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={consumption1}
                  onChange={(e) => setConsumption1(e.target.value)}
                  className="form-input rounded-r-none text-sm"
                  placeholder="kW/h"
                />
                <span className="bg-gray-100 border border-l-0 border-gray-300 px-2 py-2 rounded-r-lg text-gray-600 text-xs">
                  kW/h
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Druhé období - Polední minimum */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center mb-3">
            <SunDim className="h-4 w-4 mr-2 text-blue-600" />
            <h5 className="text-sm font-medium text-blue-800">Polední minimum (nízká spotřeba)</h5>
          </div>
          
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Začátek:</label>
                <input
                  type="range"
                  min="11"
                  max="15"
                  value={timeRange2.start}
                  onChange={(e) => setTimeRange2({ ...timeRange2, start: parseInt(e.target.value) })}
                  className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="text-center text-xs text-gray-600 mt-1">
                  {formatTime(timeRange2.start)}
                </div>
              </div>
              
              <div>
                <label className="block text-xs text-gray-600 mb-1">Konec:</label>
                <input
                  type="range"
                  min={timeRange2.start + 1}
                  max="17"
                  value={timeRange2.end}
                  onChange={(e) => setTimeRange2({ ...timeRange2, end: parseInt(e.target.value) })}
                  className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="text-center text-xs text-gray-600 mt-1">
                  {formatTime(timeRange2.end)}
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                Spotřeba za hodinu v tomto období ({timeRange2.end - timeRange2.start}h):
              </label>
              <div className="flex">
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={consumption2}
                  onChange={(e) => setConsumption2(e.target.value)}
                  className="form-input rounded-r-none text-sm"
                  placeholder="kW/h"
                />
                <span className="bg-gray-100 border border-l-0 border-gray-300 px-2 py-2 rounded-r-lg text-gray-600 text-xs">
                  kW/h
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Třetí období - Odpolední špička */}
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <div className="flex items-center mb-3">
            <Sunset className="h-4 w-4 mr-2 text-red-600" />
            <h5 className="text-sm font-medium text-red-800">Odpolední špička (vysoká spotřeba)</h5>
          </div>
          
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Začátek:</label>
                <input
                  type="range"
                  min="14"
                  max="20"
                  value={timeRange3.start}
                  onChange={(e) => setTimeRange3({ ...timeRange3, start: parseInt(e.target.value) })}
                  className="w-full h-2 bg-red-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="text-center text-xs text-gray-600 mt-1">
                  {formatTime(timeRange3.start)}
                </div>
              </div>
              
              <div>
                <label className="block text-xs text-gray-600 mb-1">Konec:</label>
                <input
                  type="range"
                  min={timeRange3.start + 1}
                  max="22"
                  value={timeRange3.end}
                  onChange={(e) => setTimeRange3({ ...timeRange3, end: parseInt(e.target.value) })}
                  className="w-full h-2 bg-red-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="text-center text-xs text-gray-600 mt-1">
                  {formatTime(timeRange3.end)}
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                Spotřeba za hodinu v tomto období ({timeRange3.end - timeRange3.start}h):
              </label>
              <div className="flex">
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={consumption3}
                  onChange={(e) => setConsumption3(e.target.value)}
                  className="form-input rounded-r-none text-sm"
                  placeholder="kW/h"
                />
                <span className="bg-gray-100 border border-l-0 border-gray-300 px-2 py-2 rounded-r-lg text-gray-600 text-xs">
                  kW/h
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Čtvrté období - Noční minimum */}
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center mb-3">
            <Moon className="h-4 w-4 mr-2 text-purple-600" />
            <h5 className="text-sm font-medium text-purple-800">Noční minimum (nízká spotřeba)</h5>
          </div>
          
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Začátek:</label>
                <input
                  type="range"
                  min="20"
                  max="23"
                  value={timeRange4.start}
                  onChange={(e) => setTimeRange4({ ...timeRange4, start: parseInt(e.target.value) })}
                  className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="text-center text-xs text-gray-600 mt-1">
                  {formatTime(timeRange4.start)}
                </div>
              </div>
              
              <div>
                <label className="block text-xs text-gray-600 mb-1">Konec (příští den):</label>
                <input
                  type="range"
                  min="4"
                  max="8"
                  value={timeRange4.end}
                  onChange={(e) => setTimeRange4({ ...timeRange4, end: parseInt(e.target.value) })}
                  className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="text-center text-xs text-gray-600 mt-1">
                  {formatTime(timeRange4.end)} (+1d)
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                Spotřeba za hodinu v tomto období (
                {timeRange4.end > timeRange4.start 
                  ? timeRange4.end - timeRange4.start 
                  : (24 - timeRange4.start) + timeRange4.end
                }h):
              </label>
              <div className="flex">
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={consumption4}
                  onChange={(e) => setConsumption4(e.target.value)}
                  className="form-input rounded-r-none text-sm"
                  placeholder="kW/h"
                />
                <span className="bg-gray-100 border border-l-0 border-gray-300 px-2 py-2 rounded-r-lg text-gray-600 text-xs">
                  kW/h
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Kontrolní výpočet na čtvrt hodiny */}
      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mt-6">
        <div className="flex items-center mb-3">
          <Zap className="h-4 w-4 mr-2 text-slate-600" />
          <h5 className="text-sm font-medium text-slate-800">Kontrolní výpočet spotřeby</h5>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs mb-4">
          <div className="bg-orange-100 p-3 rounded">
            <div className="font-medium text-orange-800">Ranní špička</div>
            <div className="text-orange-600 font-bold text-lg">{quarterly.q1} kWh</div>
            <div className="text-orange-600">na čtvrt hodiny</div>
            <div className="text-gray-600 mt-1">{quarterly.totalHours.period1}h × {consumption1 || 0} kW/h</div>
          </div>
          
          <div className="bg-blue-100 p-3 rounded">
            <div className="font-medium text-blue-800">Polední minimum</div>
            <div className="text-blue-600 font-bold text-lg">{quarterly.q2} kWh</div>
            <div className="text-blue-600">na čtvrt hodiny</div>
            <div className="text-gray-600 mt-1">{quarterly.totalHours.period2}h × {consumption2 || 0} kW/h</div>
          </div>
          
          <div className="bg-red-100 p-3 rounded">
            <div className="font-medium text-red-800">Odpolední špička</div>
            <div className="text-red-600 font-bold text-lg">{quarterly.q3} kWh</div>
            <div className="text-red-600">na čtvrt hodiny</div>
            <div className="text-gray-600 mt-1">{quarterly.totalHours.period3}h × {consumption3 || 0} kW/h</div>
          </div>
          
          <div className="bg-purple-100 p-3 rounded">
            <div className="font-medium text-purple-800">Noční minimum</div>
            <div className="text-purple-600 font-bold text-lg">{quarterly.q4} kWh</div>
            <div className="text-purple-600">na čtvrt hodiny</div>
            <div className="text-gray-600 mt-1">{quarterly.totalHours.period4}h × {consumption4 || 0} kW/h</div>
          </div>
        </div>
        
        <div className="bg-white p-3 rounded border border-slate-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <div>
              <span className="font-medium text-slate-700">Celková denní spotřeba:</span>
              <span className="ml-2 text-slate-900 font-bold">{quarterly.dailyTotal} kWh</span>
            </div>
            <div>
              <span className="font-medium text-slate-700">Pokryto obdobími:</span>
              <span className="ml-2 text-slate-900">{24 - quarterly.totalHours.remaining}h</span>
            </div>
            <div>
              <span className="font-medium text-slate-700">Zbývající hodiny:</span>
              <span className="ml-2 text-slate-900">{quarterly.totalHours.remaining}h</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeSlider;
