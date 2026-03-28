import { useState, useEffect } from 'react';
import type { PageType, Player } from './types';
import { Navbar } from './components/Navbar';
import { PlayerCard } from './components/PlayerCard';
import { PlayerDetail } from './components/PlayerDetail';
import { PlayersPage } from './components/PlayersPage';
import { players } from './data/players';

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // 监听滚动
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 回到顶部
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlayerClick = (player: Player) => {
    setSelectedPlayer(player);
    setIsDetailOpen(true);
  };

  // 热门球星（首页显示）
  const featuredPlayers = players.slice(0, 12);

  // 渲染首页（精选热门球星）
  const renderHomePage = () => (
    <>
      {/* 头部横幅 */}
      <div className="bg-[#6CABDD] pb-12 pt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">
            五大联赛热门球星
          </h1>
          <p className="text-white/80 text-lg">
            2025-26 赛季精选球星收藏
          </p>
        </div>
      </div>

      {/* 球星网格 */}
      <main className="max-w-[1600px] mx-auto px-2 sm:px-3 lg:px-4 py-6 pb-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          {featuredPlayers.map((player) => (
            <PlayerCard
              key={player.id}
              player={player}
              onClick={() => handlePlayerClick(player)}
            />
          ))}
        </div>

        {/* 查看更多按钮 */}
        <div className="text-center mt-10">
          <button
            onClick={() => setCurrentPage('players')}
            className="px-8 py-3 bg-[#6CABDD] text-white font-semibold rounded-full hover:bg-[#5a9ac9] transition-colors"
          >
            查看全部球星 →
          </button>
        </div>
      </main>
    </>
  );

  // 渲染球衣页面（占位）
  const renderKitsPage = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">球衣页面</h2>
      <p className="text-gray-500">功能开发中...</p>
    </div>
  );

  // 渲染俱乐部页面（占位）
  const renderClubsPage = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">俱乐部页面</h2>
      <p className="text-gray-500">功能开发中...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* 顶部导航 */}
      <Navbar currentPage={currentPage} onPageChange={setCurrentPage} />

      {/* 页面内容 */}
      {currentPage === 'home' && renderHomePage()}
      {currentPage === 'players' && (
        <PlayersPage
          onPlayerClick={handlePlayerClick}
        />
      )}
      {currentPage === 'kits' && renderKitsPage()}
      {currentPage === 'clubs' && renderClubsPage()}

      {/* 球星详情弹窗 */}
      <PlayerDetail
        player={selectedPlayer}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />

      {/* 回到顶部按钮 */}
      <button
        onClick={scrollToTop}
        className={`fixed right-6 bottom-6 z-50 w-12 h-12 rounded-full bg-[#6CABDD] text-white shadow-lg hover:bg-[#5a9ac9] transition-all duration-300 ${
          showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
      >
        <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>

      {/* 页脚 */}
      <footer className="bg-gray-100 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-sm text-gray-500">
            © 2025 Jersey Shop. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
