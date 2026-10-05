import React, { useState } from 'react';
import { Copy, Check, Sparkles, AlertTriangle, ShieldCheck } from 'lucide-react';

const ColorPaletteCard = ({ analysis }) => {
  const [copiedHex, setCopiedHex] = useState(null);

  if (!analysis) return null;

  const handleCopy = (hex) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E5E5E5] shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5E5E5]">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-[#000000]">
            12-Season Color Analysis
          </span>
          <h2 className="font-serif text-3xl font-bold text-[#000000] mt-1">
            {analysis.season}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#FAFAFA] text-[#525252] border border-[#D4D4D4]">
            {analysis.undertone} Undertone
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#FAFAFA] text-[#525252] border border-[#D4D4D4]">
            {analysis.contrast} Contrast
          </span>
        </div>
      </div>

      {/* Description */}
      {analysis.description && (
        <p className="text-sm sm:text-base text-[#525252] leading-relaxed">
          {analysis.description}
        </p>
      )}

      {/* Signature Power Colors */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#000000] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#000000]" />
            Signature Power Palette
          </h3>
          <span className="text-xs text-[#404040]">Click swatch to copy HEX</span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
          {analysis.paletteHexes?.map((hex, idx) => (
            <button
              key={idx}
              onClick={() => handleCopy(hex)}
              className="group relative flex flex-col items-center focus:outline-none"
              title={`Copy ${hex}`}
            >
              <div
                className="w-full aspect-square rounded-xl shadow-inner border border-black/10 group-hover:scale-105 group-hover:shadow-md transition-all flex items-center justify-center"
                style={{ backgroundColor: hex }}
              >
                {copiedHex === hex ? (
                  <Check className="w-4 h-4 text-white drop-shadow-md" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-white/0 group-hover:text-white/80 transition-opacity drop-shadow-sm" />
                )}
              </div>
              <span className="text-[11px] font-mono text-[#525252] mt-1 uppercase">
                {hex}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Neutral Staples & Avoid Hues */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#E5E5E5]">
        {/* Neutrals */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#000000] mb-2 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Flattering Neutral Staples
          </h4>
          <div className="flex items-center gap-2">
            {analysis.neutralHexes?.map((hex, idx) => (
              <div
                key={idx}
                className="w-10 h-10 rounded-lg border border-black/10 shadow-inner flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
                style={{ backgroundColor: hex }}
                onClick={() => handleCopy(hex)}
                title={`Copy ${hex}`}
              />
            ))}
          </div>
        </div>

        {/* Avoid */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#000000] mb-2 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-rose-500" />
            Hues to Avoid (Washes Out Face)
          </h4>
          <div className="flex items-center gap-2">
            {analysis.avoidHexes?.map((hex, idx) => (
              <div
                key={idx}
                className="w-10 h-10 rounded-lg border border-black/10 shadow-inner flex items-center justify-center relative opacity-85"
                style={{ backgroundColor: hex }}
                title={`Avoid ${hex}`}
              >
                <div className="w-full h-0.5 bg-rose-500/80 rotate-45 transform"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Best Metals */}
      {analysis.bestMetals && analysis.bestMetals.length > 0 && (
        <div className="pt-4 border-t border-[#E5E5E5] flex items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#000000]">
            Recommended Hardware & Metals:
          </span>
          <div className="flex flex-wrap gap-2">
            {analysis.bestMetals.map((metal, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-md text-xs font-medium bg-[#FAFAFA] text-[#525252] border border-[#D4D4D4]"
              >
                {metal}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Styling Advice list */}
      {analysis.stylingAdvice && analysis.stylingAdvice.length > 0 && (
        <div className="pt-4 border-t border-[#E5E5E5]">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#000000] mb-3">
            MAISON Styling Directives
          </h4>
          <ul className="space-y-2">
            {analysis.stylingAdvice.map((advice, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-[#525252]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#000000] mt-1.5 shrink-0" />
                <span>{advice}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ColorPaletteCard;
