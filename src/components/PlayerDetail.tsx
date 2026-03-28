import { useEffect, useState } from 'react';
import type { Player } from '../types';
import { leagues } from '../data/leagues';
import { getClubByName } from '../data/clubs';

interface PlayerDetailProps {
  player: Player | null;
  isOpen: boolean;
  onClose: () => void;
}

// 惯用脚文字
function getFootText(foot: 'left' | 'right' | 'both') {
  const map = { left: '左脚', right: '右脚', both: '双脚' };
  return map[foot];
}

export function PlayerDetail({ player, isOpen, onClose }: PlayerDetailProps) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setImgError(false);
      return;
    }
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

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

  if (!player || !isOpen) return null;

  const league = leagues.find(l => l.id === player.league);
  const club = getClubByName(player.team);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 背景遮罩 */}
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />

      {/* 弹窗内容 */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="overflow-y-auto max-h-[90vh]">
          {/* 头部 - 球星信息和背景 */}
          <div
            className="relative p-6 sm:p-8 text-white overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${league?.color || '#6CABDD'} 0%, ${league?.color ? `${league.color}dd` : '#1C2C5B'} 50%, ${league?.color ? `${league.color}99` : '#2d4a7c'} 100%)`
            }}
          >
            {/* 背景装饰 - 大号码 */}
            <div className="absolute -right-8 -top-12 text-[200px] font-black text-white/10 leading-none select-none">
              {player.number}
            </div>

            <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* 球星头像 - 使用球员图片 */}
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-white shadow-2xl flex-shrink-0 overflow-hidden border-4 border-white">
                {!imgError ? (
                  <img
                    src={player.image}
                    alt={player.name}
                    className="w-full h-full object-cover object-top"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center text-5xl font-black"
                    style={{ color: league?.color || '#6CABDD' }}
                  >
                    {player.name.charAt(0)}
                  </div>
                )}
              </div>

              <div className="flex-1 text-center sm:text-left">
                {/* 姓名 */}
                <h2 className="text-3xl sm:text-4xl font-black">{player.name}</h2>
                <p className="text-white/80 text-xl mt-1">{player.nameEn}</p>

                {/* 基本信息标签 */}
                <div className="flex flex-wrap gap-2 mt-4 justify-center sm:justify-start">
                  <span className="px-3 py-1.5 bg-white/20 rounded-full text-sm font-medium">
                    {player.position}
                  </span>
                  <span className="px-3 py-1.5 bg-white/20 rounded-full text-sm font-medium">
                    {player.team}
                  </span>
                  <span className="px-3 py-1.5 bg-white/20 rounded-full text-sm font-medium">
                    {player.age} 岁
                  </span>
                </div>
              </div>

              {/* 右侧大号码 */}
              <div className="hidden sm:block text-right">
                <span className="text-7xl font-black text-white/90">{player.number}</span>
                <p className="text-white/70 text-sm">球衣号码</p>
              </div>
            </div>

            {/* 底部信息栏 */}
            <div className="relative mt-8 pt-6 border-t border-white/20">
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 text-center">
                <InfoItem label="国籍" value={`${player.nationality} (${player.nationalityCode})`} />
                <InfoItem label="出生日期" value={player.birthDate} />
                <InfoItem label="身高" value={`${player.height} cm`} />
                <InfoItem label="惯用脚" value={getFootText(player.preferredFoot)} />
                <InfoItem label="联赛" value={league?.name || '-'} />
                {player.marketValue && (
                  <InfoItem label="身价" value={player.marketValue} highlight />
                )}
              </div>
            </div>
          </div>

          {/* 内容区域 */}
          <div className="p-6 space-y-6">
            {/* 所属球队 */}
            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-[#6CABDD] rounded-full"></span>
                所属球队
              </h3>
              <div
                className="rounded-xl p-4 flex items-center space-x-4"
                style={{
                  background: `linear-gradient(135deg, ${league?.color}15, ${league?.color}05)`
                }}
              >
                {club ? (
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, ${club.colors[0]}, ${club.colors[1] || club.colors[0]})`
                    }}
                  >
                    {club.icon}
                  </div>
                ) : (
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black text-white shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, ${league?.color || '#6CABDD'}, ${league?.color ? `${league.color}99` : '#1C2C5B'})`
                    }}
                  >
                    {player.team.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="font-bold text-gray-900 text-lg">{player.team}</p>
                  <p className="text-sm text-gray-500">{league?.name} · {league?.country}</p>
                </div>
              </div>
            </section>

            {/* 详细信息网格 */}
            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-[#6CABDD] rounded-full"></span>
                球员资料
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <DetailCard
                  icon="👤"
                  label="全名"
                  value={player.nameEn}
                />
                <DetailCard
                  icon="🎂"
                  label="出生日期"
                  value={player.birthDate}
                />
                <DetailCard
                  icon="📏"
                  label="身高"
                  value={`${player.height} cm`}
                />
                <DetailCard
                  icon="🌍"
                  label="国籍"
                  value={`${player.nationality} (${player.nationalityCode})`}
                />
                <DetailCard
                  icon="⚽"
                  label="位置"
                  value={player.position}
                />
                <DetailCard
                  icon="🦶"
                  label="惯用脚"
                  value={getFootText(player.preferredFoot)}
                />
              </div>
            </section>

            {/* 球衣展示区域 */}
            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-[#6CABDD] rounded-full"></span>
                2025-26 赛季球衣
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {/* 主场球衣 */}
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <div
                    className="w-full aspect-[3/4] rounded-lg flex items-center justify-center mb-3"
                    style={{
                      background: `linear-gradient(135deg, ${league?.color}20, ${league?.color}10)`,
                      border: `2px dashed ${league?.color || '#6CABDD'}40`
                    }}
                  >
                    <svg className="w-16 h-16 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <path d="M6 4h3l2 3h2l2-3h3v16H6V4z" />
                      <path d="M12 7v13" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-gray-700">主场球衣</p>
                </div>

                {/* 客场球衣 */}
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <div
                    className="w-full aspect-[3/4] rounded-lg flex items-center justify-center mb-3"
                    style={{
                      background: `linear-gradient(135deg, ${league?.color}15, ${league?.color}05)`,
                      border: `2px dashed ${league?.color || '#6CABDD'}30`
                    }}
                  >
                    <svg className="w-16 h-16 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <path d="M6 4h3l2 3h2l2-3h3v16H6V4z" />
                      <path d="M12 7v13" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-gray-700">客场球衣</p>
                </div>
              </div>
            </section>

            {/* 身价信息（如果有） */}
            {player.marketValue && (
              <section>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 bg-[#6CABDD] rounded-full"></span>
                  市场价值
                </h3>
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">当前身价</p>
                      <p className="text-3xl font-black text-green-600">{player.marketValue}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// 头部信息项
function InfoItem({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={highlight ? 'text-green-300' : ''}>
      <p className="text-white/60 text-xs mb-0.5">{label}</p>
      <p className={`font-bold text-sm ${highlight ? 'text-lg' : ''}`}>{value}</p>
    </div>
  );
}

// 详情卡片
function DetailCard({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{icon}</span>
        <span className="text-xs text-gray-500">{label}</span>
      </div>
      <p className="font-bold text-gray-900 truncate">{value}</p>
    </div>
  );
}
