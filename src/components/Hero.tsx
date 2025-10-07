import { Sparkles, Feather, BookHeart } from 'lucide-react';

type HeroProps = {
  onStartCreate: () => void;
};

export default function Hero({ onStartCreate }: HeroProps) {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-orange-50 to-green-50 opacity-60"></div>

      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 10% 20%, rgba(42,92,170,0.3) 0%, transparent 50%),
                           radial-gradient(circle at 90% 80%, rgba(244,162,97,0.3) 0%, transparent 50%)`,
        }}
      ></div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md">
          <Sparkles className="text-[#F4A261]" size={20} />
          <span className="text-sm font-medium text-gray-700">Ai辅助的诗词创作体验</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-[#2A5CAA] mb-6 leading-tight">
          诗意人生，Ai相伴
        </h1>

        <p className="text-xl md:text-2xl text-[#F4A261] mb-8 tracking-wide">
          千年诗韵，智能传承 · 让每个人都能成为诗人
        </p>

        <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
          通过先进的Ai技术，结合中华传统诗词文化，为您打造专属的诗意创作空间。
          无论是古风雅韵，还是现代诗情，让灵感在指尖流转。
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <button
            onClick={onStartCreate}
            className="group flex items-center gap-3 px-8 py-4 bg-[#2A5CAA] text-white rounded-full text-lg font-medium shadow-lg hover:bg-[#F4A261] hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <Feather className="group-hover:rotate-12 transition-transform" size={22} />
            开始创作
          </button>

          <button className="flex items-center gap-3 px-8 py-4 bg-white text-[#2A5CAA] rounded-full text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-[#2A5CAA] hover:bg-[#2A5CAA] hover:text-white">
            <BookHeart size={22} />
            浏览作品
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-[#8AB17D]/20 rounded-full flex items-center justify-center mb-4 mx-auto">
              <Sparkles className="text-[#8AB17D]" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">智能创作</h3>
            <p className="text-gray-600 text-sm">Ai辅助，激发灵感，创作专属诗词</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-[#F4A261]/20 rounded-full flex items-center justify-center mb-4 mx-auto">
              <BookHeart className="text-[#F4A261]" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">作品收藏</h3>
            <p className="text-gray-600 text-sm">建立个人诗集，珍藏每一份灵感</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-[#2A5CAA]/20 rounded-full flex items-center justify-center mb-4 mx-auto">
              <Feather className="text-[#2A5CAA]" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">文化传承</h3>
            <p className="text-gray-600 text-sm">融合古今，传承中华诗词文化</p>
          </div>
        </div>
      </div>
    </div>
  );
}
