import React, { useState, useCallback, useEffect } from 'react';

// --- Helper Components & Icons ---

const UploadIcon = () => (
  <svg className="w-12 h-12 mx-auto text-gray-400 group-hover:text-corporate-red transition-colors duration-300" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CheckCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const InfoCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-blue-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const StickyLoader = () => (
    <div className="flex items-center justify-center space-x-2">
        <div className="w-4 h-4 rounded-full bg-corporate-red animate-bounce" style={{ animationDelay: '0s' }}></div>
        <div className="w-4 h-4 rounded-full bg-corporate-red animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-4 h-4 rounded-full bg-corporate-red animate-bounce" style={{ animationDelay: '0.4s' }}></div>
    </div>
);

const CorporateStyles = () => (
  <style jsx global>{`
    :root {
      --corporate-red: #E85A4F;
      --corporate-dark: #2D2D2D;
      --corporate-red-light: #FBECEB;
    }
    .bg-corporate-red { background-color: var(--corporate-red); }
    .bg-corporate-red-light { background-color: var(--corporate-red-light); }
    .text-corporate-red { color: var(--corporate-red); }
    .text-corporate-dark { color: var(--corporate-dark); }
    .border-corporate-red { border-color: var(--corporate-red); }
    .hover\\:bg-corporate-red-dark:hover { background-color: #D04A3F; } /* Darker shade for hover */
    .hover\\:border-corporate-red:hover { border-color: var(--corporate-red); }
    .focus\\:ring-corporate-red:focus { --tw-ring-color: var(--corporate-red); }
    
    @keyframes confetti {
      0% { transform: translateY(0%) rotate(0deg); opacity: 1; }
      100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
    }
    .animate-confetti {
        animation: confetti 3s ease-out forwards;
    }
  `}</style>
);
const Confetti = () => {
    const confettiCount = 100;
    const colors = ['#E85A4F', '#2D2D2D', '#3b82f6', '#10b981', '#f59e0b'];
    return (
        <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
            {Array.from({ length: confettiCount }).map((_, i) => (
                <div
                    key={i}
                    className="absolute w-2 h-2 rounded-full animate-confetti"
                    style={{
                        backgroundColor: colors[i % colors.length],
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 2}s`,
                        transform: `rotate(${Math.random() * 360}deg)`,
                    }}
                ></div>
            ))}
        </div>
    );
};
const AnimatedCounter = ({ to, duration = 1500 }) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
        let start = 0;
        const end = parseInt(String(to).replace(/,/g, ''));
        if (start === end) return;

        let startTime = null;
        const animate = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            const currentNum = Math.floor(progress * end);
            setCount(currentNum);
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        requestAnimationFrame(animate);
    }, [to, duration]);

    return <span>{count.toLocaleString('es-PE')}</span>;
};
const InvoiceSummaryCard = ({ data }) => (
    <div className="my-6 p-4 bg-gray-100 rounded-lg border border-gray-200 text-left">
        <h3 className="text-sm font-bold text-corporate-dark mb-3">Resumen de la Factura</h3>
        <div className="space-y-2 text-sm">
            <div className="flex justify-between">
                <span className="text-gray-500">Factura:</span>
                <span className="font-medium text-corporate-dark">{data.document_id}</span>
            </div>
             <div className="flex justify-between">
                <span className="text-gray-500">Tu RUC (Emisor):</span>
                <span className="font-medium text-corporate-dark">{data.client_ruc}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-gray-500">Deudor:</span>
                <span className="font-medium text-corporate-dark">{data.debtor_name}</span>
            </div>
             <div className="flex justify-between">
                <span className="text-gray-500">RUC Deudor:</span>
                <span className="font-medium text-corporate-dark">{data.debtor_ruc}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-gray-500">Fecha Emisión:</span>
                <span className="font-medium text-corporate-dark">{data.issue_date ? new Date(data.issue_date).toLocaleDateString('es-PE') : 'N/A'}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-gray-500">Monto Total:</span>
                <span className="font-bold text-corporate-red">{data.currency} {data.total_amount?.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            {data.fileCount > 1 && (
                 <div className="pt-2 text-center text-xs text-gray-500 border-t border-gray-200 mt-2">
                    Y {data.fileCount - 1} factura(s) más.
                </div>
            )}
        </div>
    </div>
);

export default function App() {
  const [step, setStep] = useState('upload');
  const [files, setFiles] = useState([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState('');
  const [analysisProgress, setAnalysisProgress] = useState([]);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analysisData, setAnalysisData] = useState({});
  const [formData, setFormData] = useState({ email: '', phone: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setIsDragActive(true);
    else if (e.type === "dragleave") setIsDragActive(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files);
  }, []);
  
  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files?.length) handleFiles(e.target.files);
  };

  const handleFiles = (selectedFiles) => {
    const filesArray = Array.from(selectedFiles);
    if (filesArray.some(file => file.type !== 'text/xml')) {
        setError('Por favor, sube únicamente archivos XML de tus facturas.');
        return;
    }
    setError('');
    setFiles(filesArray);
    setStep('analyzing');
    uploadAndAnalyzeFiles(filesArray);
  };

  const uploadAndAnalyzeFiles = async (filesToAnalyze) => {
    setAnalysisProgress(['Analizando factura(s)...']);
    const file = filesToAnalyze[0];
    const backendFormData = new FormData();
    backendFormData.append('xml_file', file);

    try {
      const response = await fetch('http://127.0.0.1:8000/verificar_ruc', {
        method: 'POST',
        body: backendFormData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error del servidor');
      }

      const result = await response.json();
      const { resultado, datos_factura, mensaje } = result;

      setAnalysisProgress(prev => [...prev, `✓ ${mensaje}`]);
      
      setAnalysisResult(resultado); 
      
      setAnalysisData({
          ...datos_factura,
          approvedAmount: resultado === 'PREAPROBADO' ? datos_factura.total_amount : 0,
          fileCount: filesToAnalyze.length,
      });

      setTimeout(() => {
          setAnalysisProgress(prev => [...prev, '✓ ¡Análisis completado!']);
          setStep('result');
      }, 800);

    } catch (err) {
      setError(`Error de comunicación con el servidor: ${err.message}`);
      setStep('upload');
    }
  };
  
  const handleFormChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const leadData = {
      email: formData.email,
      phone: formData.phone,
      analysisData: analysisData,
      result: analysisResult,
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/guardar_contacto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'No se pudo guardar el contacto.');
      }

      console.log("Lead guardado exitosamente:", leadData);
      setFormSubmitted(true);

    } catch (err) {
      console.error("Error al guardar el formulario:", err);
      alert(`Error al guardar: ${err.message}`);
    }
}

  const resetApp = () => {
    setStep('upload');
    setFiles([]);
    setError('');
    setAnalysisProgress([]);
    setAnalysisResult(null);
    setAnalysisData({});
    setFormData({ email: '', phone: '' });
    setFormSubmitted(false);
  }

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col items-center justify-center font-sans p-4">
      <CorporateStyles />
      <header className="w-full max-w-2xl mx-auto text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-corporate-dark">
          Capital<span className="text-corporate-red">Express</span>
        </h1>
        <p className="text-lg text-gray-600 mt-2">El Analizador de Facturas Inteligente</p>
      </header>
      
      <main className="w-full max-w-2xl mx-auto z-10">
        <div className="bg-white rounded-xl shadow-2xl transition-all duration-500 p-6 md:p-10">
          {step !== 'result' ? (
             <UploadStep 
                onDrag={handleDrag} onDrop={handleDrop} onChange={handleChange} 
                isDragActive={isDragActive} error={error} files={files}
              />
          ) : (
            <ResultStep 
              result={analysisResult} data={analysisData} formData={formData}
              formSubmitted={formSubmitted} onFormChange={handleFormChange}
              onFormSubmit={handleFormSubmit} onReset={resetApp}
            />
          )}
        </div>
      </main>
      
      {step === 'analyzing' && <AnalyzingStep progress={analysisProgress} />}

      <footer className="w-full max-w-2xl mx-auto text-center mt-8 z-10">
        <p className="text-sm text-gray-500">© 2025 Capital Express. Todos los derechos reservados.</p>
        <p className="text-xs text-gray-400 mt-1">Tu información es analizada de forma segura y confidencial.</p>
      </footer>
    </div>
  );
}

const UploadStep = ({ onDrag, onDrop, onChange, isDragActive, error, files }) => (
  <div className="text-center">
    <h2 className="text-2xl md:text-3xl font-bold text-corporate-dark">Liquidez para tu negocio en 60 segundos.</h2>
    <p className="mt-2 text-gray-600">Sube uno o varios archivos <strong className="font-semibold text-corporate-red">XML</strong> de tus facturas y descubre al instante si califican para un adelanto.</p>
    
    <form id="form-file-upload" onDragEnter={onDrag} onSubmit={(e) => e.preventDefault()} className="mt-6">
      <label 
        htmlFor="input-file-upload" 
        className={`group relative block w-full rounded-lg border-2 border-dashed ${isDragActive ? 'border-corporate-red bg-corporate-red-light' : 'border-gray-300'} p-12 text-center hover:border-corporate-red focus:outline-none focus:ring-2 focus:ring-corporate-red focus:ring-offset-2 cursor-pointer transition-all duration-300`}
      >
        <UploadIcon />
        <span className="mt-2 block text-sm font-medium text-corporate-dark">
          Arrastra y suelta tus facturas aquí
        </span>
        <span className="block text-xs text-gray-500">o haz clic para seleccionar los archivos</span>
        <input type="file" id="input-file-upload" name="input-file-upload" className="sr-only" accept=".xml,text/xml" onChange={onChange} multiple />
      </label>
      {isDragActive && (
        <div className="absolute inset-0 w-full h-full rounded-lg" onDragEnter={onDrag} onDragLeave={onDrag} onDragOver={onDrag} onDrop={onDrop}></div>
      )}
    </form>
    {error && <p className="mt-4 text-sm text-red-600 font-semibold">{error}</p>}
    {files.length > 0 && !error && <p className="mt-4 text-sm text-green-600 font-semibold">{files.length} factura(s) seleccionada(s) y lista(s) para analizar.</p>}
    <p className="mt-6 text-xs text-gray-500">Solo aceptamos archivos XML para garantizar un análisis preciso e instantáneo.</p>
  </div>
);

const AnalyzingStep = ({ progress }) => (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex flex-col items-center justify-center z-50 animate-fade-in">
        <div className="bg-white rounded-xl shadow-2xl p-8 text-center w-11/12 max-w-md">
            <StickyLoader />
            <h2 className="text-2xl font-bold text-corporate-dark mt-6">Analizando...</h2>
            <p className="mt-2 text-gray-600">Estamos consultando nuestra data en tiempo real.</p>
            <div className="mt-6 space-y-2 text-left">
                {progress.map((step, index) => (
                    <div key={index} className="flex items-center text-md text-corporate-dark animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                        <svg className="w-5 h-5 text-corporate-red mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <span>{step}</span>
                    </div>
                ))}
            </div>
        </div>
    </div>
);
const ResultStep = ({ result, data, formData, formSubmitted, onFormChange, onFormSubmit, onReset }) => {
  if (formSubmitted) {
    return (
      <div className="text-center py-8 animate-fade-in-up">
        <CheckCircleIcon />
        <h2 className="text-2xl md:text-3xl font-bold text-corporate-dark mt-4">¡Perfecto!</h2>
        <p className="mt-2 text-gray-600">Hemos recibido tu información. Un ejecutivo se pondrá en contacto contigo en breve.</p>
        <button onClick={onReset} className="mt-8 w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-corporate-red bg-corporate-red-light hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-corporate-red transition-colors">
          Analizar otras facturas
        </button>
      </div>
    );
  }
  
  const renderResultContent = () => {
    switch(result) {
      case 'PREAPROBADO':
        return (
          <>
            <CheckCircleIcon />
            <h2 className="text-2xl md:text-3xl font-bold text-corporate-dark mt-4">¡Excelentes noticias!</h2>
            <p className="mt-2 text-lg text-gray-600">Tu(s) factura(s) ha(n) sido pre aprobada(s), hasta por un monto de </p>
            <p className="my-4 text-4xl md:text-5xl font-extrabold text-green-600 tracking-tight">{data.currency} <AnimatedCounter to={data.approvedAmount} /></p>
          </>
        );
      case 'INTERMEDIO':
        return (
          <>
            <InfoCircleIcon />
            <h2 className="text-2xl md:text-3xl font-bold text-corporate-dark mt-4">¡Tu factura tiene potencial!</h2>
            <p className="mt-2 text-lg text-gray-600">
              Hemos procesado tus factura. Para darte la mejor oferta, uno de nuestros especialistas necesita hacer una validación adicional.
            </p>
          </>
        );
      case 'RECHAZADO':
        return (
          <>
            <InfoCircleIcon />
            <h2 className="text-2xl md:text-3xl font-bold text-corporate-dark mt-4">¡Tu factura tiene potencial!</h2>
            <p className="mt-2 text-lg text-gray-600">
              Esta operación tiene características especiales que queremos evaluar con un experto para construir una solución a tu medida.
            </p>
          </>
        );
      default: return null;
    }
  }

  return (
    <div className="animate-fade-in-up relative">
      {result === 'PREAPROBADO' && <Confetti />}
      <div className="text-center">{renderResultContent()}</div>
      
      {/* --- NEW: Invoice summary is now displayed here --- */}
      <InvoiceSummaryCard data={data} />

      <form onSubmit={onFormSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
          <div className="mt-1">
            <input id="email" name="email" type="email" autoComplete="email" required value={formData.email} onChange={onFormChange}
              className="appearance-none block w-full px-3 text-gray-700 bg-white py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-corporate-red focus:border-corporate-red sm:text-sm"
              placeholder="tu@empresa.com" />
          </div>
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Teléfono / Celular</label>
          <div className="mt-1">
            <input id="phone" name="phone" type="tel" autoComplete="tel" required value={formData.phone} onChange={onFormChange}
              className="appearance-none block w-full px-3 text-gray-700 bg-white py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-corporate-red focus:border-corporate-red sm:text-sm"
              placeholder="987 654 321" />
          </div>
        </div>
        <div>
          <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-lg text-lg font-medium text-white bg-corporate-red hover:bg-corporate-red-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-corporate-red transition-all transform hover:scale-105">
            Quiero obtener mi linea.
          </button>
        </div>
      </form>
    </div>
  );
};
