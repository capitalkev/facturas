import React from 'react';

const DebtorSummaryCard = ({ summary }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'PREAPROBADO': return 'bg-green-100 text-green-800';
      case 'REVISANDO': return 'bg-blue-100 text-blue-800';
      case 'RECHAZADO': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="my-3 p-4 bg-gray-50 rounded-lg border border-gray-200 text-left text-sm">
      <div className="flex justify-between items-center">
        <div>
          <p className="font-bold text-corporate-dark">{summary.debtorName}</p>
          <p className="text-gray-500">RUC: {summary.debtorRuc}</p>
        </div>
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(summary.status)}`}>
          { summary.status === 'PREAPROBADO' ? 'PREAPROBADO' : 'REVISANDO'}
        </span>
      </div>
      <div className="mt-3 pt-3 border-t border-gray-200 space-y-1">
        <p className="text-xs text-gray-500">{summary.invoiceCount} factura(s) de este deudor suman:</p>
        {summary.totalPEN > 0 && (
          <p className="font-medium text-corporate-dark">
            S/ {summary.totalPEN.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        )}
        {summary.totalUSD > 0 && (
          <p className="font-medium text-corporate-dark">
            $ {summary.totalUSD.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        )}
      </div>
    </div>
  );
};

export default DebtorSummaryCard;