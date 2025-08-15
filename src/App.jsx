import React, { useState, useCallback } from "react";
import Header from "./components/Header";
import UserInfoStep from "./components/UserInfoStep";
import UploadStep from "./components/UploadStep";
import AnalyzingStep from "./components/AnalyzingStep";
import ResultStep from "./components/ResultStep";
import Footer from "./components/Footer";
import { CorporateStyles } from "./components/SharedComponents";

export default function App() {
  const [step, setStep] = useState("userInfo"); // Controls which step of the process is shown
  const [files, setFiles] = useState([]); // Stores the uploaded XML files
  const [isDragActive, setIsDragActive] = useState(false); // For drag-and-drop UI feedback
  const [error, setError] = useState(""); // Holds any error messages for the user
  const [analysisProgress, setAnalysisProgress] = useState([]); // Messages shown during analysis
  const [analysisResult, setAnalysisResult] = useState(null); // Final result (e.g., 'PREAPROBADO')
  const [individualResults, setIndividualResults] = useState([]); // Detailed results for each invoice
  const [formData, setFormData] = useState({ email: "", phone: "" }); // User's contact info
  const [formSubmitted, setFormSubmitted] = useState(false); // Tracks if the final form was sent
  const [debtorSummaries, setDebtorSummaries] = useState([]); // Aggregated data per debtor
  const [operationId, setOperationId] = useState(null); // Unique ID for the transaction
  const [approvedAmount, setApprovedAmount] = useState(null); // Stores the pre-approved amount object {PEN:..., USD:...}

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files?.length) {
      handleFiles(e.dataTransfer.files);
    }
  }, [files]);

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files?.length) {
      handleFiles(e.target.files);
    }
    e.target.value = null;
  };

  const handleFiles = (selectedFiles) => {
    const newFiles = Array.from(selectedFiles);
    if (newFiles.some((file) => file.type !== "text/xml")) {
      setError("Por favor, sube únicamente archivos XML de tus facturas.");
      return;
    }
    setError("");
    const uniqueFiles = [...files, ...newFiles].filter(
      (file, index, self) => index === self.findIndex((f) => f.name === file.name)
    );
    setFiles(uniqueFiles);
  };

  const handleInfoSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://factura-service-598125168090.southamerica-west1.run.app/guardar_contacto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || 'No se pudo registrar el contacto.');
      }
      const data = await response.json();
      setOperationId(data.operationId);
      setStep('upload');
    } catch (err) {
      console.error("Error al guardar contacto:", err);
      alert(`Error: ${err.message}`);
    }
  };

  const startAnalysis = async () => {
    if (files.length === 0) {
      setError("Por favor, selecciona al menos un archivo XML.");
      return;
    }    
    setStep('analyzing');
    setAnalysisProgress(["Analizando facturas..."]);

    const backendFormData = new FormData();
    files.forEach((file) => backendFormData.append("xml_files", file, file.name));

    try {
      const response = await fetch('https://factura-service-598125168090.southamerica-west1.run.app/verificar_ruc', {
        method: "POST",
        body: backendFormData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Error del servidor");
      }

      const result = await response.json();
      
      setAnalysisProgress((prev) => [...prev, `✓ ${result.mensaje}`]);
      setAnalysisResult(result.resultado);
      setIndividualResults(result.resultados_individuales);
      setApprovedAmount(result.total_preaprobado);

      const summaries = result.resultados_individuales.reduce((acc, curr) => {
        const ruc = curr.datos_factura.debtor_ruc;
        if (!ruc) return acc;
        if (!acc[ruc]) {
          acc[ruc] = {
            debtorName: curr.datos_factura.debtor_name,
            debtorRuc: ruc, totalPEN: 0, totalUSD: 0,
            status: curr.resultado, invoiceCount: 0,
          };
        }
        if (curr.datos_factura.currency === "PEN") acc[ruc].totalPEN += curr.datos_factura.total_amount;
        else if (curr.datos_factura.currency === "USD") acc[ruc].totalUSD += curr.datos_factura.total_amount;
        acc[ruc].invoiceCount++;
        return acc;
      }, {});
      setDebtorSummaries(Object.values(summaries));
      
      setTimeout(() => {
        setAnalysisProgress((prev) => [...prev, "✓ ¡Análisis completado!"]);
        setStep("result");
      }, 800);
    } catch (err) {
      setError(`Error de comunicación: ${err.message}`);
      setStep("upload");
    }
  };
  
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const confirmationFormData = new FormData();
    confirmationFormData.append('email', formData.email);
    confirmationFormData.append('phone', formData.phone);
    confirmationFormData.append('operationId', operationId); // This will now be the correct ID
    confirmationFormData.append('individualResults', JSON.stringify(individualResults));
    files.forEach(file => confirmationFormData.append('xml_files', file, file.name));

    try {
      const response = await fetch('https://factura-service-598125168090.southamerica-west1.run.app/confirmar_operacion', {
        method: 'POST',
        body: confirmationFormData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'No se pudo guardar el contacto.');
      }
      setFormSubmitted(true);
    } catch (err) {
      console.error("Error al guardar el formulario:", err);
      alert(`Error al guardar: ${err.message}`);
    }
  };

  const resetApp = () => {
    setStep('userInfo');
    setFiles([]);
    setError('');
    setAnalysisProgress([]);
    setAnalysisResult(null);
    setFormData({ email: '', phone: '' });
    setFormSubmitted(false);
    setDebtorSummaries([]);
    setOperationId(null);
    setApprovedAmount(null);
  };

  const renderStep = () => {
    switch (step) {
      case 'userInfo':
        return <UserInfoStep formData={formData} onFormChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })} onFormSubmit={handleInfoSubmit} />;
      case 'upload':
        return <UploadStep onDrag={handleDrag} onDrop={handleDrop} onChange={handleChange} isDragActive={isDragActive} error={error} files={files} onStartAnalysis={startAnalysis} />;
      case 'result':
        return <ResultStep result={analysisResult} approvedAmount={approvedAmount} summaries={debtorSummaries} formSubmitted={formSubmitted} onFormSubmit={handleFormSubmit} onReset={resetApp} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col items-center justify-center font-sans p-4 sm:p-6 md:p-8">
      <CorporateStyles />
      <Header />
      <main className="w-full max-w-2xl mx-auto z-10">
        <div className="bg-white rounded-xl shadow-2xl transition-all duration-500 p-5 md:p-10">
          {renderStep()}
        </div>
      </main>
      {step === 'analyzing' && <AnalyzingStep progress={analysisProgress} />}
      <Footer />
    </div>
  );
}
