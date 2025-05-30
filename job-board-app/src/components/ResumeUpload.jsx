import React, { useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUploadCloud, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

export default function ResumeUpload() {
  const navigate = useNavigate();
  const fileInputRef = useRef();
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileSelection = (file) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (!allowedTypes.includes(file.type)) {
      setError('Unsupported file type. Please upload PDF or Word documents.');
      setSelectedFile(null);
      return;
    }
    setSelectedFile(file);
    setError('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleFileSelection(file);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert('Please upload your resume.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('resume', selectedFile);

      const response = await fetch('https://hirebuddy-project-assingment-3.onrender.com/api/upload-resume', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to analyze resume');
        setLoading(false);
        return;
      }

      setLoading(false);
      navigate('/results', { state: { jobs: data.jobs } });
    } catch (err) {
      setError('Server error: ' + err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 sm:p-10 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3">
          Let’s Find Your Dream Job
        </h1>
        <p className="text-gray-500 mb-8 text-base sm:text-lg">
          Drop your resume below and we’ll match you with the right roles
        </p>

        <form
          onSubmit={handleUpload}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className="space-y-6"
        >
          <label
            htmlFor="resume-upload"
            className={`flex flex-col items-center justify-center w-full h-56 sm:h-64 p-6 sm:p-8 border-4 rounded-2xl cursor-pointer transition
              ${
                dragActive
                  ? 'border-blue-600 bg-blue-50 shadow-lg'
                  : 'border-blue-400 bg-white hover:bg-blue-50'
              }`}
            aria-describedby="file-upload-desc"
          >
            <FiUploadCloud
              size={56}
              className={`mb-4 transition-colors ${
                dragActive ? 'text-blue-700' : 'text-blue-500'
              }`}
            />
            {!selectedFile ? (
              <>
                <span className="text-xl text-gray-700 font-medium">
                  Click to upload or drag & drop
                </span>
                <span
                  id="file-upload-desc"
                  className="text-sm text-gray-400 mt-2 select-none"
                >
                  Accepted: PDF, DOC, DOCX
                </span>
              </>
            ) : (
              <div className="flex items-center space-x-3 px-2">
                <FiCheckCircle className="text-green-600" size={24} />
                <span
                  className="text-lg text-gray-800 font-semibold truncate max-w-xs"
                  title={selectedFile.name}
                >
                  {selectedFile.name}
                </span>
              </div>
            )}

            <input
              ref={fileInputRef}
              id="resume-upload"
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>

          {error && (
            <div className="flex items-center justify-center text-red-600 space-x-2">
              <FiAlertCircle />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !selectedFile}
            className={`w-full py-3 rounded-xl text-lg font-semibold text-white transition
              ${
                loading || !selectedFile
                  ? 'bg-blue-300 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            aria-busy={loading}
          >
            {loading ? 'Analyzing...' : 'Analyze Resume'}
          </button>
        </form>
      </div>
    </div>
  );
}
