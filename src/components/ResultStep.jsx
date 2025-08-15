import React, { useState } from 'react';
import { CheckCircleIcon } from './Icons';
import { Confetti, AnimatedCounter } from './SharedComponents';
import DebtorSummaryCard from './DebtorSummaryCard';

const ResultStep = ({ result, approvedAmount, summaries, formSubmitted, onFormSubmit, onReset }) => {
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);

  if (formSubmitted) {
    return (
      <div className="text-center py-8 animate-fade-in-up">
        <CheckCircleIcon />
        <h2 className="text-2xl md:text-3xl font-bold text-corporate-dark mt-4">¡Perfecto!</h2>
        <p className="mt-2 text-gray-600">Hemos recibido tu información. Un ejecutivo se pondrá en contacto contigo en breve.</p>
        <button 
          onClick={onReset} 
          className="bg-corporate-red hover:bg-corporate-red-dark mt-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-corporate-red transform hover:scale-105"
        >
          Analizar otras facturas
        </button>
      </div>
    );
  }

  const hasPreapproved = summaries.some(s => s.status === 'PREAPROBADO');
  const displayResult = hasPreapproved ? 'PREAPROBADO' : result;
  
  const sortedSummaries = [...summaries].sort((a, b) => {
    if (a.status === 'PREAPROBADO' && b.status !== 'PREAPROBADO') return -1;
    if (a.status !== 'PREAPROBADO' && b.status === 'PREAPROBADO') return 1;
    if (a.status === 'REVISANDO' && b.status === 'RECHAZADO') return -1;
    if (a.status === 'RECHAZADO' && b.status === 'REVISANDO') return 1;
    return 0;
  });

  const renderApprovedAmount = () => {
    if (!approvedAmount) return null;

    return (
      <div className="my-4 text-[36px] md:text-5xl font-extrabold text-green-600 tracking-tight">
        {approvedAmount.PEN > 0 && (
          <div>PEN <AnimatedCounter to={approvedAmount.PEN} /></div>
        )}
        {approvedAmount.USD > 0 && (
          <div className="mt-2">USD <AnimatedCounter to={approvedAmount.USD} /></div>
        )}
      </div>
    );
  };
  
  const renderResultContent = () => {
    switch(displayResult) {
      case 'PREAPROBADO':
        return (
          <>
            <CheckCircleIcon />
            <h2 className="text-2xl md:text-3xl font-bold text-corporate-dark mt-4">¡Excelentes noticias!</h2>
            <p className="mt-2 text-lg text-gray-600">
              Tu(s) factura(s) ha(n) sido pre aprobada(s), hasta por un monto de
            </p>
            {renderApprovedAmount()}
          </>
        );
      case 'REVISANDO':
        return (
          <>
            <CheckCircleIcon />
            <h2 className="text-2xl md:text-3xl font-bold text-corporate-dark mt-4">
              ¡Tu lote tiene potencial!
            </h2>
            <p className="mt-2 text-lg text-gray-600">
              Hemos procesado tus facturas. Para darte la mejor oferta, uno de nuestros especialistas necesita hacer una validación adicional.
            </p>
          </>
        );
      case 'RECHAZADO':
        return (
          <>
            <CheckCircleIcon />
            <h2 className="text-2xl md:text-3xl font-bold text-corporate-dark mt-4">
              ¡Tu lote tiene potencial!
            </h2>
            <p className="mt-2 text-lg text-gray-600">
              Esta operación tiene características especiales que queremos evaluar con un experto para construir una solución a tu medida.
            </p>
          </>
        );
      default: return null;
    }
  };

  return (
    <div className="animate-fade-in-up relative">
      {displayResult === 'PREAPROBADO' && <Confetti />}
      <div className="text-center">{renderResultContent()}</div>
      
      {sortedSummaries.length > 0 && (
        <div className="mt-6 w-full">
          {sortedSummaries.length > 1 ? (
            <div>
              <button 
                onClick={() => setIsSummaryExpanded(!isSummaryExpanded)}
                className="w-full flex justify-between items-center p-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-left font-bold text-corporate-dark transition-colors"
              >
                <span>Ver resumen detallado por deudor</span>
                <svg className={`w-5 h-5 transition-transform transform ${isSummaryExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              {isSummaryExpanded && (
                <div className="mt-2 animate-fade-in-up">
                  {sortedSummaries.map((summary) => (
                      <DebtorSummaryCard key={summary.debtorRuc} summary={summary} />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-bold text-corporate-dark text-left mb-2">Resumen del Deudor</h3>
              <DebtorSummaryCard summary={sortedSummaries[0]} />
            </div>
          )}
        </div>
      )}

      <form onSubmit={onFormSubmit} className="mt-8">
        <div>
          <button type="submit" className="w-full flex justify-center py-3 px-4 bg-corporate-red hover:bg-corporate-red-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-corporate-red transform hover:scale-105">
            Quiero obtener mi línea
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResultStep;