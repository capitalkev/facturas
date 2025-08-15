import React from 'react';
import { StickyLoader } from './SharedComponents';

const AnalyzingStep = ({ progress }) => (
  <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex flex-col items-center justify-center z-50 animate-fade-in">
    <div className="bg-white rounded-xl shadow-2xl p-8 text-center w-11/12 max-w-md">
      <StickyLoader />
      <h2 className="text-2xl font-bold text-corporate-dark mt-6">
        Analizando...
      </h2>
      <p className="mt-2 text-gray-600">
        Estamos consultando nuestra data en tiempo real.
      </p>
      <div className="mt-6 space-y-2 text-left">
        {progress.map((step, index) => (
          <div
            key={index}
            className="flex items-center text-md text-corporate-dark animate-fade-in-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <svg
              className="w-5 h-5 text-corporate-red mr-2 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span>{step}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default AnalyzingStep;