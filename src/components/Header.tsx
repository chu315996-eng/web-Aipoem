import { Sparkles, BookOpen, Heart, User, PenTool } from 'lucide-react';

type HeaderProps = {
  activeSection: string;
  onNavigate: (section: string) => void;
};

export default function Header({ activeSection, onNavigate }: HeaderProps) {
  const navItems = [
    { id: 'home', label: '首页', icon: Sparkles },
    { id: 'create', label: 'AI创作', icon: PenTool },
    { id: 'gallery', label: '诗词长廊', icon: BookOpen },
    { id: 'collections', label: '我的收藏', icon: Heart },
    { id: 'profile', label: '个人中心', icon: User },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => onNavigate('home')}
          >
            <img src="/logo.jpg" alt="AI写诗" className="h-12 w-auto rounded-lg shadow-sm" />
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-[#2A5CAA]">AI写诗</span>
              <span className="text-sm text-[#F4A261] tracking-wider">智能诗词创作平台</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-300 ${
                    isActive
                      ? 'bg-[#2A5CAA] text-white shadow-md'
                      : 'text-gray-700 hover:bg-[#2A5CAA]/10 hover:text-[#2A5CAA]'
                  }`}
                >
                  <Icon size={18} />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <button className="md:hidden p-2 hover:bg-gray-100 rounded-lg">
            <div className="w-6 h-5 flex flex-col justify-between">
              <span className="w-full h-0.5 bg-gray-700 rounded"></span>
              <span className="w-full h-0.5 bg-gray-700 rounded"></span>
              <span className="w-full h-0.5 bg-gray-700 rounded"></span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
