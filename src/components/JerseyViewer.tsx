import { useState } from 'react';
import type { KitType, SeasonJersey } from '../types';

interface JerseyViewerProps {
  jersey: SeasonJersey;
  teamName: string;
  size?: 'sm' | 'md' | 'lg';
}

export function JerseyViewer({ jersey, teamName, size = 'md' }: JerseyViewerProps) {
  const [activeKit, setActiveKit] = useState<KitType>('home');
  const [imageError, setImageError] = useState(false);

  const kit = activeKit === 'home' ? jersey.homeKit : jersey.awayKit;

  const sizeClasses = {
    sm: 'h-40',
    md: 'h-48',
    lg: 'h-64',
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="w-full">
      {/* 球衣展示区域 */}
      <div className={`relative ${sizeClasses[size]} rounded-xl overflow-hidden mb-4 bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-white/5`}>
        {!imageError ? (
          <img
            src={kit.image}
            alt={`${teamName} ${activeKit === 'home' ? '主场' : '客场'}球衣`}
            className="w-full h-full object-contain p-4"
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
            {/* 球衣轮廓图标 */}
            <svg
              className="w-16 h-16 mb-3 opacity-50"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            >
              <path d="M6 4h3l2 3h2l2-3h3v16H6V4z" />
              <path d="M12 7v13" />
              <path d="M9 4v3" />
              <path d="M15 4v3" />
            </svg>
            <span className="text-sm font-bold text-gray-400">{teamName}</span>
            <span className="text-xs text-gray-600 mt-1">
              {activeKit === 'home' ? 'Home Kit' : 'Away Kit'}
            </span>
          </div>
        )}

        {/* 赛季标签 */}
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full border border-white/10 font-medium">
          {jersey.season}
        </div>
      </div>

      {/* 主客场切换按钮 */}
      <div className="flex space-x-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setActiveKit('home');
            setImageError(false);
          }}
          className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-bold transition-all duration-300 ${
            activeKit === 'home'
              ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/30'
              : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
          }`}
        >
          主场
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setActiveKit('away');
            setImageError(false);
          }}
          className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-bold transition-all duration-300 ${
            activeKit === 'away'
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30'
              : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
          }`}
        >
          客场
        </button>
      </div>
    </div>
  );
}
