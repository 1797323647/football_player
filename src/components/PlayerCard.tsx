import { useState } from 'react';
import type { Player } from '../types';
import { leagues } from '../data/leagues';

interface PlayerCardProps {
  player: Player;
  onClick?: () => void;
}

export function PlayerCard({ player, onClick }: PlayerCardProps) {
  const league = leagues.find(l => l.id === player.league);
  const lastName = player.nameEn.split(' ').pop()?.toUpperCase() || player.nameEn.toUpperCase();
  const [imgError, setImgError] = useState(false);

  return (
    <div
      onClick={onClick}
      className="group relative bg-gray-100 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
    >
      {/* 背景渐变 - 根据联赛颜色 */}
      <div
        className="absolute inset-0 opacity-25"
        style={{
          background: `linear-gradient(135deg, ${league?.color || '#6CABDD'} 0%, transparent 50%)`
        }}
      />

      {/* 浅色网格背景 */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0,0,0,0.02) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,0,0,0.02) 1px, transparent 1px)
          `,
          backgroundSize: '16px 16px'
        }}
      />

      {/* 球员照片区域 */}
      <div className="relative aspect-[3/4] overflow-hidden">
        {/* 球员图片或首字母占位 */}
        <div className="absolute inset-0 flex items-center justify-center p-4">
          {!imgError ? (
            <img
              src={player.image}
              alt={player.name}
              className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-300"
              onError={() => setImgError(true)}
            />
          ) : (
            <div
              className="w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full flex items-center justify-center text-5xl font-black text-white shadow-2xl"
              style={{
                background: `linear-gradient(135deg, ${league?.color || '#6CABDD'}, ${league?.color ? `${league.color}99` : '#1C2C5B'})`
              }}
            >
              {player.name.charAt(0)}
            </div>
          )}
        </div>

      </div>

      {/* 底部信息栏 - 渐变遮罩 */}
      <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 pt-12 bg-gradient-to-t from-[#1C2C5B] via-[#1C2C5B]/90 to-transparent">
        <p className="text-white font-black text-base sm:text-lg tracking-wide">
          {lastName}
        </p>
      </div>
    </div>
  );
}
