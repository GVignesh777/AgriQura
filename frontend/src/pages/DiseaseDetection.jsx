import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import { Bug, Upload, Camera, ShieldAlert, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

export default function DiseaseDetection() {
  const { t, i18n } = useTranslation();
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const abortControllerRef = React.useRef(null);
  const navigate = useNavigate();

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    setLoading(true);
    setErrorMsg('');
    setAnalysis(null);
    try {
      const res = await api.post('/disease/analyze', {
        description,
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1592417817098-8f3d6ef23a81?w=800',
        language: i18n.language || 'en',
      }, {
        signal: abortController.signal
      });
      setAnalysis(res.data.analysis);
    } catch (err) {
      if (err.name === 'CanceledError' || err.code === 'ERR_CANCELED') {
        console.log('Request canceled');
        return;
      }
      console.error(err);
      setErrorMsg(err.response?.data?.error || 'An error occurred while analyzing the image.');
    } finally {
      if (abortControllerRef.current === abortController) {
        setLoading(false);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex p-3 bg-red-500/20 text-red-400 rounded-2xl border border-red-500/30">
          <Bug className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold text-white">{t('disease.title', 'AI Crop Disease Screening')}</h1>
        <p className="text-xs text-slate-400">
          {t('disease.subtitle', 'Upload or snap leaf photos to get instant symptom analysis and treatment advice.')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Upload Form */}
        <form onSubmit={handleAnalyze} className="glass-card p-6 space-y-4">
          <h2 className="text-lg font-bold text-white">{t('disease.submitIssue', 'Submit Crop Issue')}</h2>
          
          {errorMsg && (
            <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-start gap-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>{errorMsg}</p>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">{t('disease.describeSymptoms', 'Describe Visible Symptoms')}</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Yellow leaves with brown spots on the underside..."
              className="input-field text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">{t('disease.sampleImage', 'Upload Sample Image')}</label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-agri-500/30 border-dashed rounded-xl cursor-pointer bg-slate-900/40 hover:bg-slate-800/60 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 text-agri-400 mb-2" />
                  <p className="text-sm text-slate-300 mb-1"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                  <p className="text-xs text-slate-500">PNG, JPG or JPEG (MAX. 5MB)</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => setImageUrl(reader.result);
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>
            </div>
            {imageUrl && (
              <div className="mt-4 relative rounded-xl overflow-hidden border border-agri-500/30 bg-slate-900/60 flex items-center justify-center min-h-[12rem]">
                <img src={imageUrl} alt="Preview" className="w-full max-h-64 object-contain" />
                <button
                  type="button"
                  onClick={() => setImageUrl('')}
                  className="absolute top-2 right-2 bg-red-500/90 hover:bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-medium transition-colors"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-sm">
            {loading ? t('disease.screening', 'Screening Crop Image...') : t('disease.screenButton', 'Screen Crop Leaf Image')}
          </button>

          <p className="text-[11px] text-slate-500 text-center">
            ⚠️ {t('disease.screeningNotice', 'AI-assisted screening, not certified lab diagnosis.')}
          </p>
        </form>

        {/* Results Panel */}
        <div className="space-y-4">
          {analysis ? (
            <div className="glass-card p-6 space-y-4 border-agri-500/40">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-lg font-bold text-white">{analysis.detectedDisease}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] font-bold rounded uppercase">
                      {t('disease.identifiedCrop', 'Crop')}: {analysis.cropName || 'Unknown'}
                    </span>
                    <span className="text-xs text-agri-400 font-semibold">{t('disease.confidence', 'AI Confidence')}: {analysis.confidenceScore}%</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold rounded-lg uppercase">
                  {t('disease.screeningOutput', 'Screening Output')}
                </span>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-300 mb-1">{t('disease.observedSymptoms', 'Observed Symptoms:')}</h4>
                <ul className="list-disc list-inside text-xs text-slate-400 space-y-1">
                  {analysis.symptoms.map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-300 mb-1">{t('disease.recommendedTreatment', 'Recommended Treatment:')}</h4>
                <div className="p-3 bg-agri-950/40 border border-agri-500/30 rounded-xl space-y-1 text-xs text-slate-300">
                  <p><strong className="text-agri-400">{t('disease.chemical', 'Chemical:')}</strong> {analysis.chemicalTreatment?.join(', ')}</p>
                  <p><strong className="text-emerald-400">{t('disease.organic', 'Organic:')}</strong> {analysis.organicTreatment?.join(', ')}</p>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  onClick={() => navigate('/expert')}
                  className="btn-secondary w-full text-xs py-2.5"
                >
                  {t('disease.escalateExpert', 'Escalate to Human Expert')} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="glass-card p-12 text-center text-slate-500 space-y-3">
              <Bug className="w-12 h-12 mx-auto text-slate-700" />
              <p className="text-xs">{t('common.submit', 'Submit')} symptoms or image to view AI screening results.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
