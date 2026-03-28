import type { PageType } from '../types';

interface NavbarProps {
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
}

const navItems: { id: PageType; label: string }[] = [
  { id: 'home', label: '首页' },
  { id: 'players', label: '球星' },
  { id: 'kits', label: '球衣' },
  { id: 'clubs', label: '俱乐部' },
];

export function Navbar({ currentPage, onPageChange }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 bg-[#6CABDD] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-[#6CABDD]" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 2v20M2 12h20" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            </div>
            <span className="text-white font-bold text-lg hidden sm:block">Jersey Shop</span>
          </div>

          {/* 导航链接 */}
          <div className="flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  currentPage === item.id
                    ? 'bg-white text-[#6CABDD]'
                    : 'text-white hover:bg-white/20'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* 右侧图标 */}
          <div className="flex items-center space-x-3">
            <button className="w-9 h-9 flex items-center justify-center text-white/90 hover:text-white hover:bg-white/20 rounded-full transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </button>
            <button className="w-9 h-9 flex items-center justify-center text-white/90 hover:text-white hover:bg-white/20 rounded-full transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
              </svg>
            </button>
            <button className="hidden sm:flex items-center space-x-2 bg-white/20 text-white px-3 py-1.5 rounded-full text-sm font-medium hover:bg-white/30 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
              <span>Account</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
