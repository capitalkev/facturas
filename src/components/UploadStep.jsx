import React from 'react';
import { UploadIcon } from './Icons';

const UploadStep = ({
  onDrag,
  onDrop,
  onChange,
  isDragActive,
  error,
  files,
  onStartAnalysis,
}) => (
  <div className="text-center">
    <h2 className="text-xl md:text-3xl font-bold text-corporate-dark">
      Liquidez para tu negocio en 60 segundos.
    </h2>
    <p className="mt-2 text-gray-600 text-sm md:text-base">
      Sube uno o varios archivos{" "}
      <strong className="font-semibold text-corporate-red">XML</strong> de tus
      facturas y descubre al instante si califican para un adelanto.
    </p>

    <div onDragEnter={onDrag} className="mt-6">
      <label
        htmlFor="input-file-upload"
        className={`group relative block w-full rounded-lg border-2 border-dashed ${
          isDragActive
            ? "border-corporate-red bg-corporate-red-light"
            : "border-gray-300"
        } p-8 md:p-12 text-center hover:border-corporate-red focus:outline-none focus:ring-2 focus:ring-corporate-red focus:ring-offset-2 cursor-pointer transition-all duration-300`}
      >
        <UploadIcon />
        <span className="mt-2 block text-sm font-medium text-corporate-dark">
          Arrastra y suelta tus XML(s) aquí
        </span>
        <span className="block text-xs text-gray-500">
          o haz clic para seleccionar los archivos
        </span>
        <input
          type="file"
          id="input-file-upload"
          name="input-file-upload"
          className="sr-only"
          accept=".xml,text/xml"
          onChange={onChange}
          multiple
        />
      </label>
      {isDragActive && (
        <div
          className="absolute inset-0 w-full h-full rounded-lg"
          onDragEnter={onDrag}
          onDragLeave={onDrag}
          onDragOver={onDrag}
          onDrop={onDrop}
        ></div>
      )}
    </div>

    {error && (
      <p className="mt-4 text-sm text-red-600 font-semibold">{error}</p>
    )}

    <div className="mt-4">
      <p className="text-sm text-green-600 font-semibold h-5 mb-2">
        {files.length > 0 && !error
          ? `${files.length} factura(s) seleccionada(s).`
          : ""}
      </p>
      <button
        onClick={onStartAnalysis}
        disabled={files.length === 0}
        className={`
              w-full sm:w-auto inline-flex justify-center items-center px-5 py-2 border border-transparent 
              text-base md:text-lg font-medium rounded-md text-white transition-colors duration-300
              ${
                files.length > 0
                  ? "bg-corporate-red hover:bg-corporate-red-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-corporate-red transform hover:scale-105"
                  : "bg-gray-500 cursor-not-allowed"
              }
          `}
      >
        Analizar Facturas
      </button>
    </div>

    <p className="mt-6 text-xs font-bold text-black">
      <strong>Solo aceptamos archivos XML para garantizar un análisis preciso e instantáneo.</strong>
    </p>
  </div>
);
export default UploadStep;