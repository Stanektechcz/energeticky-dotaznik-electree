import React from 'react'
import { useFormContext } from 'react-hook-form'
import { Building, Calendar, Users, TrendingUp, MapPin, FileText, Phone, Globe, Mail, DollarSign, Shield, Award, ExternalLink } from 'lucide-react'

const CompanyDetailsDisplay = () => {
    const { watch } = useFormContext()
    const companyDetails = watch('companyDetails')
    const companyName = watch('companyName')
    const ico = watch('ico')
    const dic = watch('dic')
    const rawData = companyDetails?.raw_data

    if (!companyDetails || !companyName) {
        return null
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'Neuvedeno'
        try {
            return new Date(dateString).toLocaleDateString('cs-CZ')
        } catch {
            return dateString
        }
    }

    const formatYearsInBusiness = (years) => {
        if (!years) return 'Neuvedeno'
        return `${years} let`
    }

    const formatCurrency = (amount) => {
        if (!amount) return 'Neuvedeno'
        return new Intl.NumberFormat('cs-CZ', {
            style: 'currency',
            currency: 'CZK',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount)
    }

    return (
        <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <Building className="w-6 h-6 mr-3 text-blue-600" />
                Detailní informace o společnosti z MERK databáze
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Základní údaje */}
                <div className="bg-white p-5 rounded-lg shadow-sm">
                    <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                        <FileText className="w-4 h-4 mr-2 text-gray-600" />
                        Základní údaje
                    </h4>
                    <div className="space-y-3">
                        <div>
                            <label className="text-sm font-medium text-gray-600">Název společnosti</label>
                            <p className="text-gray-900 font-medium">{companyName}</p>
                        </div>
                        
                        <div>
                            <label className="text-sm font-medium text-gray-600">IČO</label>
                            <p className="text-gray-900 font-mono">{ico}</p>
                        </div>
                        
                        <div>
                            <label className="text-sm font-medium text-gray-600">DIČ</label>
                            <p className="text-gray-900 font-mono">{dic || 'Neuvedeno'}</p>
                        </div>

                        {companyDetails.legal_form && (
                            <div>
                                <label className="text-sm font-medium text-gray-600">Právní forma</label>
                                <p className="text-gray-900">{companyDetails.legal_form}</p>
                            </div>
                        )}

                        {companyDetails.status && (
                            <div>
                                <label className="text-sm font-medium text-gray-600">Stav společnosti</label>
                                <p className="text-gray-900 flex items-center">
                                    <span className={`w-2 h-2 rounded-full mr-2 ${
                                        companyDetails.status.includes('bez omezení') ? 'bg-green-500' : 'bg-yellow-500'
                                    }`}></span>
                                    {companyDetails.status}
                                </p>
                            </div>
                        )}

                        <div className="flex items-center">
                            <label className="text-sm font-medium text-gray-600 mr-3">Plátce DPH:</label>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                                companyDetails.is_vatpayer 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-gray-100 text-gray-800'
                            }`}>
                                {companyDetails.is_vatpayer ? 'Ano' : 'Ne'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Podnikání a činnost */}
                <div className="bg-white p-5 rounded-lg shadow-sm">
                    <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                        <TrendingUp className="w-4 h-4 mr-2 text-green-600" />
                        Podnikání a činnost
                    </h4>
                    <div className="space-y-3">
                        {companyDetails.estab_date && (
                            <div className="flex items-start">
                                <Calendar className="w-4 h-4 mr-2 mt-1 text-gray-500" />
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Datum založení</label>
                                    <p className="text-gray-900">{formatDate(companyDetails.estab_date)}</p>
                                </div>
                            </div>
                        )}

                        {companyDetails.years_in_business && (
                            <div className="flex items-start">
                                <Award className="w-4 h-4 mr-2 mt-1 text-gray-500" />
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Doba podnikání</label>
                                    <p className="text-gray-900">{formatYearsInBusiness(companyDetails.years_in_business)}</p>
                                </div>
                            </div>
                        )}

                        {companyDetails.industry && (
                            <div>
                                <label className="text-sm font-medium text-gray-600">Hlavní obor činnosti</label>
                                <p className="text-gray-900 text-sm">{companyDetails.industry}</p>
                            </div>
                        )}

                        {rawData && rawData.secondary_industries && rawData.secondary_industries.length > 0 && (
                            <div>
                                <label className="text-sm font-medium text-gray-600">Vedlejší činnosti</label>
                                <div className="text-xs text-gray-700 max-h-20 overflow-y-auto">
                                    {rawData.secondary_industries.slice(0, 5).map((industry, index) => (
                                        <div key={index} className="py-1">• {industry.text}</div>
                                    ))}
                                    {rawData.secondary_industries.length > 5 && (
                                        <div className="text-gray-500 italic">... a {rawData.secondary_industries.length - 5} dalších</div>
                                    )}
                                </div>
                            </div>
                        )}

                        {companyDetails.magnitude && (
                            <div className="flex items-start">
                                <Users className="w-4 h-4 mr-2 mt-1 text-gray-500" />
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Velikost společnosti</label>
                                    <p className="text-gray-900 text-sm">{companyDetails.magnitude}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Financ a kontakty */}
                <div className="bg-white p-5 rounded-lg shadow-sm">
                    <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                        <DollarSign className="w-4 h-4 mr-2 text-green-600" />
                        Finance & Kontakty
                    </h4>
                    <div className="space-y-3">
                        {companyDetails.turnover && (
                            <div>
                                <label className="text-sm font-medium text-gray-600">Obrat</label>
                                <p className="text-gray-900 text-sm font-semibold text-green-700">{companyDetails.turnover}</p>
                            </div>
                        )}

                        {rawData && rawData.profit && rawData.profit.amount && (
                            <div>
                                <label className="text-sm font-medium text-gray-600">Zisk ({rawData.profit.year})</label>
                                <p className="text-gray-900 text-sm font-semibold text-green-700">
                                    {formatCurrency(rawData.profit.amount)}
                                </p>
                            </div>
                        )}

                        {rawData && rawData.company_index && (
                            <div>
                                <label className="text-sm font-medium text-gray-600">Index společnosti ({rawData.company_index.year})</label>
                                <p className="text-gray-900 text-sm font-semibold">{rawData.company_index.value}/100</p>
                            </div>
                        )}

                        {companyDetails.databox_id && (
                            <div>
                                <label className="text-sm font-medium text-gray-600">ID datové schránky</label>
                                <p className="text-gray-900 font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                                    {companyDetails.databox_id}
                                </p>
                            </div>
                        )}

                        {rawData && rawData.emails && rawData.emails.length > 0 && (
                            <div>
                                <label className="text-sm font-medium text-gray-600">Emails</label>
                                <div className="space-y-1">
                                    {rawData.emails.map((emailData, index) => {
                                        // Email může být string nebo objekt
                                        let emailAddress = '';
                                        if (typeof emailData === 'string') {
                                            emailAddress = emailData;
                                        } else if (emailData && typeof emailData === 'object') {
                                            emailAddress = emailData.email || emailData.address || emailData.value || '';
                                        }
                                        
                                        return emailAddress ? (
                                            <a key={index} href={`mailto:${emailAddress}`} 
                                               className="text-blue-600 hover:underline text-sm flex items-center">
                                                <Mail className="w-3 h-3 mr-1" />
                                                {emailAddress}
                                            </a>
                                        ) : null;
                                    })}
                                </div>
                            </div>
                        )}

                        {rawData && rawData.phones && rawData.phones.length > 0 && (
                            <div>
                                <label className="text-sm font-medium text-gray-600">Telefony</label>
                                <div className="space-y-1">
                                    {rawData.phones.map((phoneData, index) => {
                                        // Telefon může být string nebo objekt
                                        let phoneNumber = '';
                                        if (typeof phoneData === 'string') {
                                            phoneNumber = phoneData;
                                        } else if (phoneData && typeof phoneData === 'object') {
                                            phoneNumber = phoneData.phone || phoneData.number || phoneData.value || '';
                                        }
                                        
                                        return phoneNumber ? (
                                            <a key={index} href={`tel:${phoneNumber}`} 
                                               className="text-blue-600 hover:underline text-sm flex items-center">
                                                <Phone className="w-3 h-3 mr-1" />
                                                {phoneNumber}
                                            </a>
                                        ) : null;
                                    })}
                                </div>
                            </div>
                        )}

                        {rawData && rawData.webs && rawData.webs.length > 0 && (
                            <div>
                                <label className="text-sm font-medium text-gray-600">Webové stránky</label>
                                <div className="space-y-1">
                                    {rawData.webs.map((web, index) => (
                                        <a key={index} href={web.url} target="_blank" rel="noopener noreferrer"
                                           className="text-blue-600 hover:underline text-sm flex items-center">
                                            <Globe className="w-3 h-3 mr-1" />
                                            {web.url}
                                            <ExternalLink className="w-3 h-3 ml-1" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Rozšířené informace */}
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Soud a registrace */}
                {(companyDetails.court || companyDetails.court_file || rawData) && (
                    <div className="bg-white p-5 rounded-lg shadow-sm">
                        <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                            <Shield className="w-4 h-4 mr-2 text-gray-600" />
                            Registrace a soud
                        </h4>
                        {companyDetails.court && (
                            <div className="flex items-start mb-3">
                                <FileText className="w-4 h-4 mr-2 mt-1 text-gray-500" />
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Registrační soud</label>
                                    <p className="text-gray-900 text-sm">{companyDetails.court}</p>
                                    {companyDetails.court_file && (
                                        <p className="text-gray-600 text-xs">Spisová značka: {companyDetails.court_file}</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {rawData && rawData.vat_registration_date && (
                            <div className="mb-3">
                                <label className="text-sm font-medium text-gray-600">Registrace DPH</label>
                                <p className="text-gray-900 text-sm">{formatDate(rawData.vat_registration_date)}</p>
                            </div>
                        )}

                        {rawData && rawData.active_licenses_count && (
                            <div className="mb-3">
                                <label className="text-sm font-medium text-gray-600">Aktivní licence</label>
                                <p className="text-gray-900 text-sm font-semibold">{rawData.active_licenses_count}</p>
                            </div>
                        )}

                        {rawData && rawData.insolvency && (
                            <div className="mb-3">
                                <label className="text-sm font-medium text-gray-600">Insolvenční řízení</label>
                                <p className={`text-sm font-semibold ${rawData.insolvency.is_insolvent ? 'text-red-600' : 'text-green-600'}`}>
                                    {rawData.insolvency.is_insolvent ? 'Ano' : 'Ne'}
                                </p>
                                {rawData.insolvency.proceedings_count > 0 && (
                                    <p className="text-xs text-gray-500">
                                        Počet řízení: {rawData.insolvency.proceedings_count}
                                    </p>
                                )}
                            </div>
                        )}

                        {rawData && rawData.execution && (
                            <div className="mb-3">
                                <label className="text-sm font-medium text-gray-600">Exekuce</label>
                                <p className={`text-sm font-semibold ${rawData.execution.has_execution ? 'text-red-600' : 'text-green-600'}`}>
                                    {rawData.execution.has_execution ? 'Ano' : 'Ne'}
                                </p>
                                {rawData.execution.executions_count > 0 && (
                                    <p className="text-xs text-gray-500">
                                        Počet exekucí: {rawData.execution.executions_count}
                                    </p>
                                )}
                            </div>
                        )}

                        {rawData && rawData.court_cases && rawData.court_cases.total > 0 && (
                            <div className="mb-3">
                                <label className="text-sm font-medium text-gray-600">Soudní spory</label>
                                <p className="text-gray-900 text-sm font-semibold">{rawData.court_cases.total}</p>
                                {rawData.court_cases.as_plaintiff > 0 && (
                                    <p className="text-xs text-gray-500">Jako žalobce: {rawData.court_cases.as_plaintiff}</p>
                                )}
                                {rawData.court_cases.as_defendant > 0 && (
                                    <p className="text-xs text-gray-500">Jako žalovaný: {rawData.court_cases.as_defendant}</p>
                                )}
                            </div>
                        )}

                        {rawData && rawData.subsidies && rawData.subsidies.total_amount && (
                            <div>
                                <label className="text-sm font-medium text-gray-600">Dotace celkem</label>
                                <p className="text-gray-900 text-sm font-semibold text-green-700">
                                    {formatCurrency(rawData.subsidies.total_amount)}
                                </p>
                                {rawData.subsidies.grants_count > 0 && (
                                    <p className="text-xs text-gray-500">Počet dotací: {rawData.subsidies.grants_count}</p>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Bankovní účty */}
                {rawData && rawData.bank_accounts && rawData.bank_accounts.length > 0 && (
                    <div className="bg-white p-5 rounded-lg shadow-sm">
                        <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                            <DollarSign className="w-4 h-4 mr-2 text-green-600" />
                            Bankovní účty
                        </h4>
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                            {rawData.bank_accounts.slice(0, 8).map((account, index) => (
                                <div key={index} className="text-sm">
                                    <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                                        {account.account_number}
                                    </span>
                                    <span className="text-gray-600 ml-2">({account.bank_code})</span>
                                </div>
                            ))}
                            {rawData.bank_accounts.length > 8 && (
                                <div className="text-gray-500 italic text-xs">
                                    ... a {rawData.bank_accounts.length - 8} dalších účtů
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Statutární orgány */}
                {rawData && rawData.body && rawData.body.persons && rawData.body.persons.length > 0 && (
                    <div className="bg-white p-5 rounded-lg shadow-sm lg:col-span-2">
                        <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                            <Users className="w-4 h-4 mr-2 text-blue-600" />
                            Statutární orgány a vedení společnosti
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {rawData.body.persons.slice(0, 6).map((person, index) => (
                                <div key={index} className="border border-gray-200 rounded-lg p-3">
                                    <div className="font-medium text-gray-900">
                                        {person.degree_before && `${person.degree_before} `}
                                        {person.first_name} {person.last_name}
                                        {person.degree_after && `, ${person.degree_after}`}
                                    </div>
                                    <div className="text-sm text-gray-600">{person.company_role}</div>
                                    {person.age && (
                                        <div className="text-xs text-gray-500">Věk: {person.age} let</div>
                                    )}
                                    {person.address && person.address.municipality && (
                                        <div className="text-xs text-gray-500 flex items-center mt-1">
                                            <MapPin className="w-3 h-3 mr-1" />
                                            {person.address.municipality}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        {rawData.body.persons.length > 6 && (
                            <div className="text-gray-500 italic text-sm mt-3">
                                ... a {rawData.body.persons.length - 6} dalších osob
                            </div>
                        )}
                        {rawData.body.average_age && (
                            <div className="mt-3 text-sm text-gray-600">
                                Průměrný věk vedení: <strong>{rawData.body.average_age} let</strong>
                            </div>
                        )}
                    </div>
                )}

                {/* Další ekonomické údaje */}
                {rawData && (rawData.employees || rawData.rating || rawData.assets) && (
                    <div className="bg-white p-5 rounded-lg shadow-sm lg:col-span-2">
                        <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                            <TrendingUp className="w-4 h-4 mr-2 text-green-600" />
                            Další ekonomické údaje
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {rawData.employees && (
                                <div className="text-center p-3 bg-gray-50 rounded">
                                    <label className="text-sm font-medium text-gray-600">Zaměstnanci</label>
                                    <p className="text-2xl font-bold text-gray-900">{rawData.employees.count || 'N/A'}</p>
                                    {rawData.employees.year && (
                                        <p className="text-xs text-gray-500">({rawData.employees.year})</p>
                                    )}
                                </div>
                            )}
                            
                            {rawData.rating && (
                                <div className="text-center p-3 bg-gray-50 rounded">
                                    <label className="text-sm font-medium text-gray-600">Rating</label>
                                    <p className="text-2xl font-bold text-blue-600">{rawData.rating.grade}</p>
                                    {rawData.rating.description && (
                                        <p className="text-xs text-gray-500">{rawData.rating.description}</p>
                                    )}
                                </div>
                            )}

                            {rawData.assets && rawData.assets.total && (
                                <div className="text-center p-3 bg-gray-50 rounded">
                                    <label className="text-sm font-medium text-gray-600">Aktiva celkem</label>
                                    <p className="text-lg font-bold text-green-600">{formatCurrency(rawData.assets.total)}</p>
                                    {rawData.assets.year && (
                                        <p className="text-xs text-gray-500">({rawData.assets.year})</p>
                                    )}
                                </div>
                            )}

                            {rawData.liabilities && rawData.liabilities.total && (
                                <div className="text-center p-3 bg-gray-50 rounded">
                                    <label className="text-sm font-medium text-gray-600">Závazky celkem</label>
                                    <p className="text-lg font-bold text-red-600">{formatCurrency(rawData.liabilities.total)}</p>
                                    {rawData.liabilities.year && (
                                        <p className="text-xs text-gray-500">({rawData.liabilities.year})</p>
                                    )}
                                </div>
                            )}

                            {rawData.equity && rawData.equity.total && (
                                <div className="text-center p-3 bg-gray-50 rounded">
                                    <label className="text-sm font-medium text-gray-600">Vlastní kapitál</label>
                                    <p className="text-lg font-bold text-blue-600">{formatCurrency(rawData.equity.total)}</p>
                                    {rawData.equity.year && (
                                        <p className="text-xs text-gray-500">({rawData.equity.year})</p>
                                    )}
                                </div>
                            )}

                            {rawData.turnover_detailed && rawData.turnover_detailed.amount && (
                                <div className="text-center p-3 bg-gray-50 rounded">
                                    <label className="text-sm font-medium text-gray-600">Obrat ({rawData.turnover_detailed.year})</label>
                                    <p className="text-lg font-bold text-green-700">{formatCurrency(rawData.turnover_detailed.amount)}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Ochranné známky */}
                {rawData && rawData.trademarks && rawData.trademarks.length > 0 && (
                    <div className="bg-white p-5 rounded-lg shadow-sm lg:col-span-2">
                        <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                            <Award className="w-4 h-4 mr-2 text-purple-600" />
                            Ochranné známky ({rawData.trademarks.length})
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-h-40 overflow-y-auto">
                            {rawData.trademarks.slice(0, 12).map((trademark, index) => (
                                <div key={index} className="border border-gray-200 rounded p-2">
                                    <div className="font-medium text-sm text-gray-900">{trademark.wording}</div>
                                    <div className="text-xs text-gray-600">{trademark.status}</div>
                                    <div className="text-xs text-gray-500">{trademark.tm_type}</div>
                                </div>
                            ))}
                        </div>
                        {rawData.trademarks.length > 12 && (
                            <div className="text-gray-500 italic text-sm mt-3">
                                ... a {rawData.trademarks.length - 12} dalších ochranných známek
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Link na MERK */}
            {rawData && rawData.link && (
                <div className="mt-6 text-center">
                    <a href={rawData.link} target="_blank" rel="noopener noreferrer"
                       className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Zobrazit kompletní profil na MERK.cz
                    </a>
                </div>
            )}
        </div>
    )
}

export default CompanyDetailsDisplay
