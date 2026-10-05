import React, { useState, useEffect } from 'react';
import { colorAPI } from '../services/api';
import ColorPaletteCard from '../components/ColorPaletteCard';
import { Palette, Sparkles, Upload, Check, RefreshCw } from 'lucide-react';

const ColorAnalysis = () => {
  const [analysis, setAnalysis] = useState(null);
  const [allPalettes, setAllPalettes] = useState({});
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  // Selector inputs
  const [undertone, setUndertone] = useState('warm');
  const [contrast, setContrast] = useState('high');
  const [selfieFile, setSelfieFile] = useState(null);
  const [selfiePreview, setSelfiePreview] = useState(null);

  const fetchAnalysis = async () => {
    try {
      setLoading(true);
      const [analysisRes, palettesRes] = await Promise.all([
        colorAPI.getAnalysis(),
        colorAPI.getAllPalettes(),
      ]);
      setAnalysis(analysisRes.data.data);
      setAllPalettes(palettesRes.data.data);
    } catch (err) {
      console.error('Failed to load color analysis:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysis();
  }, []);

  const handleSelfieChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelfieFile(file);
      setSelfiePreview(URL.createObjectURL(file));
    }
  };

  const handleRunAnalysis = async (e) => {
    e.preventDefault();
    setAnalyzing(true);

    try {
      const formData = new FormData();
      formData.append('undertone', undertone);
      formData.append('contrast', contrast);
      if (selfieFile) {
        formData.append('selfie', selfieFile);
      }

      const res = await colorAPI.runAnalysis(formData);
      setAnalysis(res.data.data);
    } catch (err) {
      console.error('Error running analysis:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSelectSeason = async (seasonName) => {
    try {
      setAnalyzing(true);
      const res = await colorAPI.runAnalysis({ seasonOverride: seasonName });
      setAnalysis(res.data.data);
    } catch (err) {
      console.error('Season override failed:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAFAFA] border border-[#D4D4D4] text-xs font-semibold uppercase tracking-wider text-[#000000]">
          <Sparkles className="w-3.5 h-3.5" />
          12-Season Scientific Draping
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#000000]">
          Your Signature Color Season
        </h1>
        <p className="text-sm text-[#525252]">
          Colors that harmonize with your skin undertone, eye depth, and hair contrast bring instant radiance and eliminate washing out.
        </p>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center items-center">
          <div className="w-8 h-8 border-4 border-[#D4D4D4] border-t-[#000000] rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column: Interactive Draping Analyzer */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E5E5] shadow-sm space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#000000]">
                Draping Test
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#000000] mt-1">
                Analyze Features
              </h3>
              <p className="text-xs text-[#525252] mt-1">
                Upload a natural light selfie or calibrate your temperature and contrast manually.
              </p>
            </div>

            <form onSubmit={handleRunAnalysis} className="space-y-4">
              {/* Selfie photo upload */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#000000] mb-1.5">
                  Natural Light Selfie (Optional)
                </label>
                <label className="flex flex-col items-center justify-center aspect-[4/3] rounded-2xl border-2 border-dashed border-[#D4D4D4] hover:border-[#000000] bg-[#FFFFFF] cursor-pointer overflow-hidden transition-colors relative group">
                  {selfiePreview ? (
                    <img
                      src={selfiePreview}
                      alt="Selfie Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-center p-4">
                      <Upload className="w-6 h-6 text-[#000000]" />
                      <span className="text-xs font-semibold text-[#000000]">
                        Upload No-Makeup Photo
                      </span>
                      <span className="text-[11px] text-[#404040]">
                        Daylight facing window gives 100% precision
                      </span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleSelfieChange}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Undertone */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#000000] mb-1.5">
                  Skin Undertone
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['warm', 'cool', 'neutral'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setUndertone(t)}
                      className={`py-2 text-xs font-semibold uppercase tracking-wider rounded-xl border capitalize transition-all ${
                        undertone === t
                          ? 'bg-[#000000] text-[#FFFFFF] border-[#000000]'
                          : 'bg-white text-[#525252] border-[#D4D4D4]'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Contrast */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#000000] mb-1.5">
                  Natural Contrast
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['low', 'medium', 'high'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setContrast(c)}
                      className={`py-2 text-xs font-semibold uppercase tracking-wider rounded-xl border capitalize transition-all ${
                        contrast === c
                          ? 'bg-[#000000] text-[#FFFFFF] border-[#000000]'
                          : 'bg-white text-[#525252] border-[#D4D4D4]'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={analyzing}
                className="w-full py-3 rounded-full bg-[#000000] text-[#FFFFFF] font-semibold text-xs uppercase tracking-wider hover:bg-[#171717] transition-all flex items-center justify-center gap-2 mt-4"
              >
                {analyzing ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    <span>Recalculate Palette</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Column: Active Palette Card */}
          <div className="lg:col-span-2">
            <ColorPaletteCard analysis={analysis} />
          </div>
        </div>
      )}

      {/* 12-Season Reference Explorer */}
      <div className="pt-12 border-t border-[#E5E5E5] space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <h3 className="font-serif text-2xl font-bold text-[#000000]">
            Explore All 12 Seasons
          </h3>
          <p className="text-xs text-[#525252] mt-1">
            Curious about another season? Click any palette below to instantly preview and apply it to your profile.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {Object.entries(allPalettes).map(([seasonName, p]) => {
            const isCurrent = analysis?.season === seasonName;
            return (
              <button
                key={seasonName}
                onClick={() => handleSelectSeason(seasonName)}
                className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-[#000000] text-[#FFFFFF] border-[#000000] shadow-md scale-105'
                    : 'bg-white text-[#000000] border-[#D4D4D4] hover:border-[#000000]'
                }`}
              >
                <div>
                  <div className="flex gap-1 mb-2">
                    {p.paletteHexes?.slice(0, 4).map((h, i) => (
                      <span
                        key={i}
                        className="w-3.5 h-3.5 rounded-full border border-black/10"
                        style={{ backgroundColor: h }}
                      />
                    ))}
                  </div>
                  <h4 className="text-xs font-bold leading-tight line-clamp-1">
                    {seasonName}
                  </h4>
                  <p className={`text-[10px] mt-0.5 capitalize ${isCurrent ? 'text-[#D4D4D4]' : 'text-[#404040]'}`}>
                    {p.undertone} • {p.contrast}
                  </p>
                </div>

                {isCurrent && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#D4D4D4] mt-2">
                    <Check className="w-3 h-3" /> Active
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ColorAnalysis;
