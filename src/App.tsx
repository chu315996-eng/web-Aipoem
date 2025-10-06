import { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import PoemCreator from './components/PoemCreator';
import PoemGallery from './components/PoemGallery';
import Collections from './components/Collections';
import Profile from './components/Profile';

function App() {
  const [activeSection, setActiveSection] = useState('home');

  const handleNavigate = (section: string) => {
    setActiveSection(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F9F7F3]">
      <Header activeSection={activeSection} onNavigate={handleNavigate} />

      {activeSection === 'home' && (
        <Hero onStartCreate={() => handleNavigate('create')} />
      )}

      {activeSection === 'create' && <PoemCreator />}

      {activeSection === 'gallery' && <PoemGallery />}

      {activeSection === 'collections' && <Collections />}

      {activeSection === 'profile' && <Profile />}

      <footer className="bg-gray-800 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <img src="/logo.jpg" alt="Logo" className="h-8 w-auto rounded" />
                AI写诗
              </h3>
              <p className="text-gray-400 leading-relaxed">
                智能诗词创作平台，融合传统文化与现代科技，让每个人都能成为诗人。
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">快速导航</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <button
                    onClick={() => handleNavigate('create')}
                    className="hover:text-white transition-colors"
                  >
                    AI创作
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigate('gallery')}
                    className="hover:text-white transition-colors"
                  >
                    诗词长廊
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigate('collections')}
                    className="hover:text-white transition-colors"
                  >
                    我的收藏
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigate('profile')}
                    className="hover:text-white transition-colors"
                  >
                    个人中心
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">关于我们</h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                我们致力于用AI技术传承和发扬中华诗词文化，让古老的艺术形式焕发新的生命力。
              </p>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8 text-center text-gray-400 text-sm">
            <p>© 2024 AI写诗文创平台. 传承诗韵，智创未来.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
