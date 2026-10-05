import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Upload,
  ArrowRight,
  RefreshCw,
  Download,
  AlertCircle,
  Shirt,
  User,
  Key,
  Layers,
  Sliders,
  Check,
  ExternalLink
} from 'lucide-react';

const SAMPLE_GARMENTS = [
  {
    id: 1,
    name: 'Tailored Double-Breasted Wool Blazer',
    category: 'Outerwear',
    color: 'Pitch Black',
    description: 'Structured shoulders, peak lapels, horn buttons, architectural silhouette.',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 2,
    name: 'Bias-Cut Silk Charmeuse Evening Gown',
    category: 'Dresses',
    color: 'Champagne Ivory',
    description: 'Floor-length fluid drape, delicate cowl neck, low open back.',
    image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 3,
    name: 'Oversized Poplin French Cuff Shirt',
    category: 'Tops',
    color: 'Optic White',
    description: '100% Egyptian long-staple cotton, crisp spread collar, mother-of-pearl buttons.',
    image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 4,
    name: 'Pleated Wide-Leg Wool Trousers',
    category: 'Bottoms',
    color: 'Charcoal Grey',
    description: 'High-rise waist, deep double pleats, relaxed fluid leg line.',
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&auto=format&fit=crop&q=80'
  }
];

const VirtualTryOn = () => {
  const [clothingImage, setClothingImage] = useState(null);
  const [clothingFile, setClothingFile] = useState(null);
  const [personImage, setPersonImage] = useState(null);
  const [personFile, setPersonFile] = useState(null);
  const [clothingName, setClothingName] = useState('');
  const [clothingDesc, setClothingDesc] = useState('');

  // API Key state (read from server or input by user)
  const [apiKey, setApiKey] = useState('');
  const [showKeySettings, setShowKeySettings] = useState(false);

  // Status & results
  const [loading, setLoading] = useState(false);
  const [resultImage, setResultImage] = useState(null);
  const [resultNote, setResultNote] = useState('');
  const [errorInfo, setErrorInfo] = useState(null);

  // Interactive Fitting Studio Canvas
  const [fittingMode, setFittingMode] = useState(false);
  const [garmentScale, setGarmentScale] = useState(1);
  const [garmentY, setGarmentY] = useState(0);
  const [garmentX, setGarmentX] = useState(0);
  const [garmentOpacity, setGarmentOpacity] = useState(0.95);
  const [blendMode, setBlendMode] = useState('normal');

  const canvasRef = useRef(null);

  const handleClothingUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setClothingFile(file);
      setClothingImage(URL.createObjectURL(file));
      setErrorInfo(null);
      setResultImage(null);
    }
  };

  const handlePersonUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPersonFile(file);
      setPersonImage(URL.createObjectURL(file));
      setErrorInfo(null);
      setResultImage(null);
    }
  };

  const handleSelectSampleGarment = async (sample) => {
    setClothingName(sample.name);
    setClothingDesc(sample.description);
    setClothingImage(sample.image);
    setErrorInfo(null);

    try {
      const response = await fetch(sample.image);
      const blob = await response.blob();
      const file = new File([blob], `${sample.name.replace(/\s+/g, '_')}.jpg`, { type: 'image/jpeg' });
      setClothingFile(file);
    } catch {
      // keep preview
    }
  };

  const handleGenerate = async () => {
    if (!clothingFile && !clothingImage) {
      setErrorInfo({ message: 'Please upload or select a clothing item.' });
      return;
    }
    if (!personFile && !personImage) {
      setErrorInfo({ message: 'Please upload your portrait.' });
      return;
    }

    setLoading(true);
    setErrorInfo(null);
    setResultImage(null);

    try {
      const formData = new FormData();
      if (clothingFile) {
        formData.append('clothingImage', clothingFile);
      }
      if (personFile) {
        formData.append('personImage', personFile);
      }
      formData.append('clothingName', clothingName || 'Tailored Designer Garment');
      formData.append('clothingDescription', clothingDesc || 'Structured silhouette, high-end textile');
      if (apiKey) {
        formData.append('apiKey', apiKey.trim());
      }

      const res = await fetch('/api/try-on', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.success && data.image) {
        setResultImage(data.image);
        setResultNote(data.description || 'Photorealistic fitting rendered successfully by Gemini.');
      } else {
        setErrorInfo({
          message: data.error || 'The model could not generate the try-on image.',
          details: data.details,
          isQuotaError: data.isQuotaError,
          tip: data.tip,
        });
      }
    } catch (err) {
      console.error('Try-on error:', err);
      setErrorInfo({
        message: 'Could not communicate with the try-on server.',
        details: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  // Render combined interactive canvas
  useEffect(() => {
    if (fittingMode && canvasRef.current && personImage && clothingImage) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const personImg = new Image();
      personImg.crossOrigin = 'anonymous';
      personImg.src = personImage;

      personImg.onload = () => {
        canvas.width = personImg.naturalWidth || 800;
        canvas.height = personImg.naturalHeight || 1200;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Draw person portrait base
        ctx.drawImage(personImg, 0, 0, canvas.width, canvas.height);

        // Draw clothing overlay
        const clothImg = new Image();
        clothImg.crossOrigin = 'anonymous';
        clothImg.src = clothingImage;

        clothImg.onload = () => {
          ctx.save();
          ctx.globalAlpha = garmentOpacity;
          ctx.globalCompositeOperation = blendMode;

          const baseWidth = canvas.width * 0.75 * garmentScale;
          const aspect = clothImg.naturalHeight / clothImg.naturalWidth || 1;
          const baseHeight = baseWidth * aspect;

          const x = (canvas.width - baseWidth) / 2 + garmentX;
          const y = canvas.height * 0.25 + garmentY;

          ctx.drawImage(clothImg, x, y, baseWidth, baseHeight);
          ctx.restore();
        };
      };
    }
  }, [fittingMode, personImage, clothingImage, garmentScale, garmentY, garmentX, garmentOpacity, blendMode]);

  const downloadCanvasImage = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = 'maison-studio-fitting.png';
      link.href = canvasRef.current.toDataURL('image/png');
      link.click();
    }
  };

  const handleReset = () => {
    setClothingImage(null);
    setClothingFile(null);
    setPersonImage(null);
    setPersonFile(null);
    setClothingName('');
    setClothingDesc('');
    setResultImage(null);
    setErrorInfo(null);
    setFittingMode(false);
  };

  return (
    <div className="bg-white text-black min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header & API Key Toggle */}
        <div className="flex flex-col items-center text-center space-y-4 max-w-2xl mx-auto">
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-400 font-medium">
            Atelier Intelligence
          </p>
          <h1 className="font-serif text-4xl sm:text-6xl font-light tracking-tight text-black">
            Virtual Fitting Room
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 font-light leading-relaxed">
            Provide the garment and your portrait. Powered by Google Gemini, MAISON composites the piece directly onto your silhouette with photorealistic draping and natural poise.
          </p>

          <button
            onClick={() => setShowKeySettings(!showKeySettings)}
            className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-semibold text-neutral-500 hover:text-black border-b border-neutral-300 pb-0.5 pt-2"
          >
            <Key className="w-3.5 h-3.5" />
            {showKeySettings ? 'Hide API Settings' : 'Configure Gemini API Key'}
          </button>
        </div>

        {/* API Settings Panel */}
        {showKeySettings && (
          <div className="max-w-xl mx-auto border border-neutral-200 p-6 bg-neutral-50/60 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest font-semibold text-black">
                Gemini API Key
              </span>
              <a
                href="https://aistudio.google.com/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-neutral-500 hover:text-black flex items-center gap-1 underline"
              >
                Google AI Studio <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy... or paste your Gemini key"
              className="w-full text-xs font-mono border border-neutral-300 p-2.5 bg-white text-black focus:border-black outline-none"
            />
            <p className="text-[11px] text-neutral-500 leading-relaxed font-light">
              <strong>Notice on Google AI Quotas:</strong> Google limits image generation models (<code className="font-mono text-black">gemini-3.1-flash-image</code>) to billing-enabled projects on Google Cloud. Free tier projects have a daily quota limit of 0. Linking a billing account on AI Studio unlocks full image synthesis.
            </p>
          </div>
        )}

        {/* Sample Selector */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
            <h2 className="text-xs uppercase tracking-[0.2em] font-semibold text-black">
              Try A Piece From The Current MAISON Boutique
            </h2>
            <span className="text-xs text-neutral-400">Click to select garment</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {SAMPLE_GARMENTS.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelectSampleGarment(item)}
                className={`group text-left border p-3 transition-all ${
                  clothingName === item.name
                    ? 'border-black bg-neutral-50 ring-1 ring-black'
                    : 'border-neutral-200 hover:border-black bg-white'
                }`}
              >
                <div className="aspect-[3/4] overflow-hidden bg-neutral-100 mb-2">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <p className="text-[10px] uppercase tracking-wider text-neutral-400">{item.category}</p>
                <p className="font-serif text-sm text-black font-normal line-clamp-1">{item.name}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Upload Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Garment Card */}
          <div className="border border-neutral-200 p-8 space-y-6 bg-white shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest font-semibold text-black flex items-center gap-2">
                  <Shirt className="w-4 h-4" /> 01. The Garment
                </span>
                {clothingImage && (
                  <button
                    onClick={() => {
                      setClothingImage(null);
                      setClothingFile(null);
                    }}
                    className="text-xs text-neutral-400 hover:text-black underline"
                  >
                    Remove
                  </button>
                )}
              </div>

              {clothingImage ? (
                <div className="aspect-[3/4] max-h-96 w-full border border-neutral-200 overflow-hidden bg-neutral-50 mx-auto">
                  <img
                    src={clothingImage}
                    alt="Selected garment"
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <label className="aspect-[3/4] max-h-96 border-2 border-dashed border-neutral-200 hover:border-black transition-colors flex flex-col items-center justify-center p-6 text-center cursor-pointer bg-neutral-50/50">
                  <Upload className="w-8 h-8 text-neutral-400 mb-3" />
                  <p className="font-serif text-lg text-black font-normal">Upload Garment Image</p>
                  <p className="text-xs text-neutral-500 mt-1">PNG, JPG, or WebP</p>
                  <p className="text-[11px] text-neutral-400 mt-3 border border-neutral-200 px-3 py-1 bg-white">
                    Drop flat-lay or store photo
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleClothingUpload}
                    className="hidden"
                  />
                </label>
              )}

              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-neutral-700 mb-1">
                    Garment Title
                  </label>
                  <input
                    type="text"
                    value={clothingName}
                    onChange={(e) => setClothingName(e.target.value)}
                    placeholder="e.g. Grey Tailored Blazer"
                    className="w-full text-sm border border-neutral-200 px-3 py-2.5 focus:border-black outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-neutral-700 mb-1">
                    Fabric & Fit Notes (Optional)
                  </label>
                  <input
                    type="text"
                    value={clothingDesc}
                    onChange={(e) => setClothingDesc(e.target.value)}
                    placeholder="e.g. Slim peak lapel, wool blend"
                    className="w-full text-sm border border-neutral-200 px-3 py-2.5 focus:border-black outline-none transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Portrait Card */}
          <div className="border border-neutral-200 p-8 space-y-6 bg-white shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest font-semibold text-black flex items-center gap-2">
                  <User className="w-4 h-4" /> 02. Your Portrait / Model
                </span>
                {personImage && (
                  <button
                    onClick={() => {
                      setPersonImage(null);
                      setPersonFile(null);
                    }}
                    className="text-xs text-neutral-400 hover:text-black underline"
                  >
                    Remove
                  </button>
                )}
              </div>

              {personImage ? (
                <div className="aspect-[3/4] max-h-96 w-full border border-neutral-200 overflow-hidden bg-neutral-50 mx-auto">
                  <img
                    src={personImage}
                    alt="Target person"
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <label className="aspect-[3/4] max-h-96 border-2 border-dashed border-neutral-200 hover:border-black transition-colors flex flex-col items-center justify-center p-6 text-center cursor-pointer bg-neutral-50/50">
                  <Upload className="w-8 h-8 text-neutral-400 mb-3" />
                  <p className="font-serif text-lg text-black font-normal">Upload Your Portrait</p>
                  <p className="text-xs text-neutral-500 mt-1">Full-body or half-body portrait</p>
                  <p className="text-[11px] text-neutral-400 mt-3 border border-neutral-200 px-3 py-1 bg-white">
                    Clear lighting works best
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePersonUpload}
                    className="hidden"
                  />
                </label>
              )}

              <div className="p-4 bg-neutral-50 border border-neutral-200 text-xs text-neutral-600 space-y-2">
                <p className="font-semibold text-black uppercase tracking-wider text-[10px]">Fitting Protocol</p>
                <ul className="space-y-1 list-disc list-inside text-neutral-500 text-[11px]">
                  <li>Stand facing the camera with arms slightly away from the torso</li>
                  <li>The AI preserves your face, hair, and posture precisely</li>
                  <li>You can also preview on the interactive fitting canvas below</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Error / Quota Alert with Explanation & Alternative */}
        {errorInfo && (
          <div className="border border-neutral-900 bg-neutral-50 p-6 space-y-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-black mt-0.5" />
              <div className="space-y-2 text-xs">
                <p className="font-semibold text-sm text-black uppercase tracking-wider">
                  {errorInfo.message}
                </p>
                {errorInfo.isQuotaError && (
                  <>
                    <p className="text-neutral-700 leading-relaxed">
                      Google Cloud requires a <strong>Pay-As-You-Go billing account</strong> linked in Google AI Studio to generate images via <code className="font-mono bg-white px-1 py-0.5 border border-neutral-200">gemini-3.1-flash-image</code> (the free tier has a limit of 0 daily requests for image generation).
                    </p>
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <a
                        href="https://aistudio.google.com"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-black text-white text-[11px] uppercase tracking-wider font-semibold hover:bg-neutral-800"
                      >
                        Enable Billing on AI Studio <ExternalLink className="w-3 h-3" />
                      </a>
                      <button
                        onClick={() => setFittingMode(true)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 border border-black text-black text-[11px] uppercase tracking-wider font-semibold hover:bg-white"
                      >
                        <Layers className="w-3 h-3" />
                        Use Interactive Studio Fitting Canvas
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={handleGenerate}
            disabled={loading || (!clothingImage && !clothingFile) || (!personImage && !personFile)}
            className="w-full sm:w-auto px-10 py-4 bg-black text-white hover:bg-neutral-800 disabled:bg-neutral-200 disabled:text-neutral-400 text-xs uppercase tracking-[0.25em] font-semibold transition-all inline-flex items-center justify-center gap-3 shadow-sm"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Calling Gemini API...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Gemini AI Try-On</span>
              </>
            )}
          </button>

          {(clothingImage && personImage) && (
            <button
              onClick={() => setFittingMode(!fittingMode)}
              className={`w-full sm:w-auto px-8 py-4 border text-xs uppercase tracking-[0.2em] font-semibold transition-all inline-flex items-center justify-center gap-2 ${
                fittingMode
                  ? 'bg-black text-white border-black'
                  : 'border-black text-black hover:bg-neutral-50'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>{fittingMode ? 'Hide Fitting Canvas' : 'Live Fitting Canvas'}</span>
            </button>
          )}

          {(clothingImage || personImage) && !loading && (
            <button
              onClick={handleReset}
              className="text-xs text-neutral-400 hover:text-black uppercase tracking-wider underline px-4 py-2"
            >
              Reset
            </button>
          )}
        </div>

        {/* Interactive Fitting Studio Canvas */}
        {fittingMode && clothingImage && personImage && (
          <div className="border border-black p-8 sm:p-12 space-y-8 bg-white animate-fadeIn">
            <div className="text-center space-y-2">
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-neutral-400">
                Atelier Fitting Studio
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-light text-black">
                Live Garment Silhouette Fitting
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 max-w-xl mx-auto font-light">
                Position, scale, and contour the {clothingName || 'garment'} directly onto your portrait in real time.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              {/* Controls */}
              <div className="border border-neutral-200 p-6 space-y-6 bg-neutral-50/50">
                <div className="flex items-center gap-2 border-b border-neutral-200 pb-3">
                  <Sliders className="w-4 h-4 text-black" />
                  <span className="text-xs uppercase tracking-widest font-semibold text-black">
                    Tailoring Adjustments
                  </span>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <div className="flex justify-between text-neutral-600 mb-1 font-medium">
                      <span>Scale / Size</span>
                      <span>{Math.round(garmentScale * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="1.8"
                      step="0.05"
                      value={garmentScale}
                      onChange={(e) => setGarmentScale(parseFloat(e.target.value))}
                      className="w-full accent-black"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-neutral-600 mb-1 font-medium">
                      <span>Vertical Drape (Y)</span>
                      <span>{garmentY}px</span>
                    </div>
                    <input
                      type="range"
                      min="-200"
                      max="300"
                      step="5"
                      value={garmentY}
                      onChange={(e) => setGarmentY(parseInt(e.target.value))}
                      className="w-full accent-black"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-neutral-600 mb-1 font-medium">
                      <span>Horizontal Shift (X)</span>
                      <span>{garmentX}px</span>
                    </div>
                    <input
                      type="range"
                      min="-200"
                      max="200"
                      step="5"
                      value={garmentX}
                      onChange={(e) => setGarmentX(parseInt(e.target.value))}
                      className="w-full accent-black"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-neutral-600 mb-1 font-medium">
                      <span>Fabric Opacity</span>
                      <span>{Math.round(garmentOpacity * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="1"
                      step="0.05"
                      value={garmentOpacity}
                      onChange={(e) => setGarmentOpacity(parseFloat(e.target.value))}
                      className="w-full accent-black"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-600 mb-1 font-medium">
                      Blend Contouring
                    </label>
                    <select
                      value={blendMode}
                      onChange={(e) => setBlendMode(e.target.value)}
                      className="w-full border border-neutral-300 p-2 text-xs bg-white text-black outline-none"
                    >
                      <option value="normal">Normal</option>
                      <option value="multiply">Multiply (Drape Shadow)</option>
                      <option value="overlay">Overlay</option>
                      <option value="darken">Darken</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={downloadCanvasImage}
                    className="w-full py-3 bg-black text-white text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 hover:bg-neutral-800"
                  >
                    <Download className="w-3.5 h-3.5" /> Download Studio Portrait
                  </button>
                </div>
              </div>

              {/* Live Canvas Preview */}
              <div className="lg:col-span-2 flex justify-center">
                <div className="border-2 border-black max-w-md w-full bg-neutral-100 overflow-hidden shadow-xl">
                  <canvas ref={canvasRef} className="w-full h-auto block" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI Result Showcase (when returned from Gemini) */}
        {resultImage && (
          <div className="border border-black p-8 sm:p-12 space-y-8 bg-white animate-fadeIn">
            <div className="text-center space-y-2">
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-neutral-400">
                Gemini AI Composite Output
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-light text-black">
                Your Atelier Fitting Preview
              </h2>
              {resultNote && (
                <p className="text-xs sm:text-sm text-neutral-600 max-w-xl mx-auto font-light">
                  {resultNote}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="text-center space-y-2">
                <p className="text-[10px] uppercase tracking-widest text-neutral-400">01. Garment</p>
                <div className="aspect-[3/4] border border-neutral-200 bg-neutral-50 overflow-hidden">
                  <img src={clothingImage} alt="Garment" className="w-full h-full object-contain" />
                </div>
              </div>

              <div className="text-center space-y-2">
                <p className="text-[10px] uppercase tracking-widest text-neutral-400">02. Portrait</p>
                <div className="aspect-[3/4] border border-neutral-200 bg-neutral-50 overflow-hidden">
                  <img src={personImage} alt="Portrait" className="w-full h-full object-contain" />
                </div>
              </div>

              <div className="text-center space-y-2">
                <p className="text-[10px] uppercase tracking-widest text-black font-bold">
                  03. AI Fitted Output
                </p>
                <div className="aspect-[3/4] border-2 border-black bg-white overflow-hidden shadow-xl">
                  <img src={resultImage} alt="Virtual try-on result" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <a
                href={resultImage}
                download="maison-virtual-tryon.png"
                className="w-full sm:w-auto px-8 py-3 bg-black text-white text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 hover:bg-neutral-800 transition-colors"
              >
                <Download className="w-4 h-4" /> Download AI Portrait
              </a>
              <button
                onClick={handleReset}
                className="w-full sm:w-auto px-8 py-3 border border-black text-black text-xs uppercase tracking-widest font-semibold hover:bg-neutral-50 transition-colors"
              >
                Try Another Garment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VirtualTryOn;
