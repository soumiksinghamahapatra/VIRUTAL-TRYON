import React from 'react';
import { Trash2, Heart, Sparkles } from 'lucide-react';

const WardrobeItemCard = ({ item, onDelete, onToggleFavorite }) => {
  return (
    <div className="group bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col">
      {/* Image & Badges */}
      <div className="relative aspect-[3/4] bg-[#FAFAFA] overflow-hidden">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            // Fallback placeholder
            e.target.src = '/assets/brunch-top-DyVfbOn4.webp';
          }}
        />

        {/* Category Tag */}
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-white/90 backdrop-blur-sm text-[#000000] shadow-sm">
          {item.category}
        </span>

        {/* Favorite Button */}
        <button
          onClick={() => onToggleFavorite && onToggleFavorite(item)}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-[#000000] hover:text-rose-500 transition-colors shadow-sm"
          title="Favorite"
        >
          <Heart
            className={`w-4 h-4 ${
              item.isFavorite ? 'fill-rose-500 text-rose-500' : ''
            }`}
          />
        </button>

        {/* Color Match Badge */}
        {item.colorMatchScore && (
          <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#000000]/90 backdrop-blur-sm text-[#FFFFFF] flex items-center gap-1 shadow-sm">
            <Sparkles className="w-3 h-3 text-[#D4D4D4]" />
            <span>{item.colorMatchScore}% Palette Match</span>
          </div>
        )}
      </div>

      {/* Item Details */}
      <div className="p-4 flex flex-col justify-between flex-grow">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="w-3 h-3 rounded-full border border-black/10 shrink-0"
              style={{ backgroundColor: item.colorHex || '#333' }}
              title={item.primaryColor}
            />
            <span className="text-xs text-[#404040] font-medium">
              {item.primaryColor || 'Neutral'}
            </span>
          </div>
          <h3 className="font-serif text-base font-bold text-[#000000] line-clamp-1">
            {item.name}
          </h3>
          <p className="text-xs text-[#525252] mt-0.5">
            {item.aesthetic || 'Classic'} • {item.seasons?.join(', ') || 'All-Season'}
          </p>
        </div>

        <div className="pt-3 mt-3 border-t border-[#E5E5E5] flex items-center justify-between">
          <span className="text-xs text-[#404040] capitalize">
            {item.occasions?.slice(0, 2).join(', ') || 'Everyday'}
          </span>
          {onDelete && (
            <button
              onClick={() => onDelete(item._id)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
              title="Delete item"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default WardrobeItemCard;
