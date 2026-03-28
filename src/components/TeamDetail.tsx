import { useState, useEffect } from 'react';
import type { TeamWithJersey, KitType } from '../types';
import { leagues } from '../data/leagues';

interface TeamDetailProps {
  team: TeamWithJersey | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TeamDetail({ team, isOpen, onClose }: TeamDetailProps) {
  const [activeKit, setActiveKit] = useState<KitType>('home');

  useEffect(() => {
    setActiveKit('home');
  }, [team?.id]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!team || !isOpen) return null;

  const league = leagues.find(l => l.id === team.league);
  const kit = activeKit === 'home' ? team.jersey.homeKit : team.jersey.awayKit;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 背景遮罩 */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* 弹窗内容 */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="overflow-y-auto max-h-[90vh]">
          {/* 头部 - 球队信息 */}
          <div className="bg-[#6CABDD] p-6 sm:p-8 text-white">
            <div className="flex items-center space-x-4">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-black bg-white shadow-lg"
                style={{ color: league?.color || '#6CABDD' }}
              >
                {team.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-2xl font-black">{team.name}</h2>
                <p className="text-white/80">{team.nameEn}</p>
                <div className="flex gap-2 mt-2">
                  <span className="px-3 py-1 bg-white/20 rounded-full text-sm">{league?.name}</span>
                  <span className="px-3 py-1 bg-white/20 rounded-full text-sm">{team.city}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* 主客场切换 */}
            <div className="flex gap-2">
              <button
                onClick={() => setActiveKit('home')}
                className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                  activeKit === 'home'
                    ? 'bg-[#6CABDD] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                主场球衣
              </button>
              <button
                onClick={() => setActiveKit('away')}
                className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                  activeKit === 'away'
                    ? 'bg-[#6CABDD] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                客场球衣
              </button>
            </div>

            {/* 球衣展示 */}
            <div className="bg-gray-50 rounded-2xl p-8 flex items-center justify-center">
              <div className="text-center">
                <div className="w-48 h-64 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-24 h-24 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <path d="M6 4h3l2 3h2l2-3h3v16H6V4z" />
                    <path d="M12 7v13" />
                  </svg>
                </div>
                <p className="text-gray-500">{kit.description}</p>
              </div>
            </div>

            {/* 球队信息 */}
            <div>
              <h3 className="font-bold text-gray-900 mb-3">球队信息</h3>
              <div className="grid grid-cols-2 gap-3">
                <InfoCard label="成立年份" value={team.founded.toString()} />
                <InfoCard label="主场" value={team.stadium} />
                <InfoCard label="城市" value={team.city} />
                <InfoCard label="主教练" value={team.manager || '-'} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 rounded-xl p-3">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-semibold text-gray-900 truncate">{value}</p>
    </div>
  );
}
