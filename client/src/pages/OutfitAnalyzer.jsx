import React, { useState } from 'react';
import { outfitAPI } from '../services/api';
import { Sparkles, Upload, CheckCircle2, XCircle, Search, ArrowRight } from 'lucide-react';

const OutfitAnalyzer = () => {
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setAnalyzing(true);

    try {
      const formData = new FormData();
      if (imageFile) {
        formData.append('image', imageFile);
      } else {
        formData.append('imageUrl', '/assets/city-look-CO6tnpbW.webp');
      }

      const res = await outfitAPI.analyzeInspo(formData);
      setAnalysisResult(res.data);
    } catch (err) {
      console.error('Inspo analysis error:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAFAFA] border border-[#D4D4D4] text-xs font-semibold uppercase tracking-wider text-[#000000]">
          <Search className="w-3.5 h-3.5" />
          Street Style & Pinterest Matcher
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#000000]">
          Inspiration Outfit Matcher
        </h1>
        <p className="text-sm text-[#525252]">
          Found an outfit you love on Pinterest or Instagram? Upload the image to discover which pieces you already own in your digital closet and identify what's missing.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Upload & Analyze Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E5E5] shadow-sm space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#000000]">
              Upload Look
            </span>
            <h3 className="font-serif text-2xl font-bold text-[#000000] mt-1">
              Select Inspiration Image
            </h3>
          </div>

          <form onSubmit={handleAnalyze} className="space-y-4">
            <label className="flex flex-col items-center justify-center aspect-[4/3] rounded-2xl border-2 border-dashed border-[#D4D4D4] hover:border-[#000000] bg-[#FFFFFF] cursor-pointer overflow-hidden transition-colors relative group">
              {preview ? (
                <img
                  src={preview}
                  alt="Inspo Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-center p-6">
                  <Upload className="w-8 h-8 text-[#000000]" />
                  <span className="text-sm font-semibold text-[#000000]">
                    Upload Pinterest / Runway / Street Look
                  </span>
                  <span className="text-xs text-[#404040]">
                    JPG, PNG, WEBP (or click Analyze to use sample look)
                  </span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>

            <button
              type="submit"
              disabled={analyzing}
              className="w-full py-3.5 rounded-full bg-[#000000] text-[#FFFFFF] font-semibold text-xs uppercase tracking-wider hover:bg-[#171717] transition-all flex items-center justify-center gap-2"
            >
              {analyzing ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Breakdown Look & Match Closet</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results Column */}
        <div>
          {analysisResult ? (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E5E5] shadow-sm space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between pb-4 border-b border-[#E5E5E5]">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#000000]">
                    {analysisResult.overallStyleAesthetic}
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#000000] mt-1">
                    Closet Match: {analysisResult.wardrobeMatchPercentage}%
                  </h3>
                </div>
                <div className="w-14 h-14 rounded-full bg-[#000000] text-[#FFFFFF] flex items-center justify-center text-sm font-bold shadow-md">
                  {analysisResult.wardrobeMatchPercentage}%
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#525252] leading-relaxed">
                {analysisResult.stylingNotes}
              </p>

              {/* Breakdown Slots */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#000000] block">
                  Piece-by-Piece Audit:
                </span>
                {analysisResult.breakdown?.map((slot, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E5E5E5] flex items-center justify-between gap-4"
                  >
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#000000]">
                        {slot.slot}
                      </span>
                      <h4 className="text-sm font-bold text-[#000000]">
                        {slot.name}
                      </h4>
                      <p className="text-xs text-[#404040]">{slot.color}</p>
                    </div>

                    <div className="shrink-0">
                      {slot.closetMatch ? (
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Owned in Closet</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Missing Staple</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-[#E5E5E5] space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#FAFAFA] text-[#000000] flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#000000]">
                Awaiting Outfit Photo
              </h3>
              <p className="text-xs text-[#525252] max-w-sm mx-auto">
                Upload any streetwear or celebrity snapshot to see what you can recreate today with your current wardrobe.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OutfitAnalyzer;
