import { useState, useEffect } from 'react';
import { Heart, Eye, Calendar, Filter } from 'lucide-react';
import { supabase, type Poem } from '../lib/supabase';

export default function PoemGallery() {
  const [poems, setPoems] = useState<Poem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStyle, setFilterStyle] = useState<string>('all');

  useEffect(() => {
    loadPoems();
  }, [filterStyle]);

  const loadPoems = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('poems')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(20);

      if (filterStyle !== 'all') {
        query = query.eq('style', filterStyle);
      }

      const { data, error } = await query;

      if (error) throw error;
      setPoems(data || []);
    } catch (error) {
      console.error('Error loading poems:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (poemId: string) => {
    try {
      const { error } = await supabase.from('poem_likes').insert({
        poem_id: poemId,
        user_id: 'anonymous',
      });

      if (error) throw error;
      loadPoems();
    } catch (error) {
      console.error('Error liking poem:', error);
    }
  };

  const styles = [
    { value: 'all', label: '全部' },
    { value: 'classical', label: '古典诗词' },
    { value: 'modern', label: '现代诗歌' },
    { value: 'haiku', label: '俳句小诗' },
    { value: 'prose', label: '散文诗' },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 px-6 bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#2A5CAA] mb-4">诗词长廊</h2>
          <p className="text-lg text-gray-600">探索AI创作的诗意世界</p>
        </div>

        <div className="flex items-center gap-4 mb-8 bg-white rounded-lg p-4 shadow-sm">
          <Filter className="text-[#2A5CAA]" size={20} />
          <span className="font-medium text-gray-700">筛选风格：</span>
          <div className="flex gap-2 flex-wrap">
            {styles.map((style) => (
              <button
                key={style.value}
                onClick={() => setFilterStyle(style.value)}
                className={`px-4 py-2 rounded-full font-medium transition-all ${
                  filterStyle === style.value
                    ? 'bg-[#2A5CAA] text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {style.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-12 h-12 border-4 border-[#2A5CAA] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">加载中...</p>
          </div>
        ) : poems.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
            <p className="text-gray-500 text-lg">暂无诗词作品</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {poems.map((poem) => (
              <div
                key={poem.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-[#2A5CAA]/30 group"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-[#2A5CAA] group-hover:text-[#F4A261] transition-colors">
                      {poem.title}
                    </h3>
                    <span className="px-3 py-1 bg-[#8AB17D]/10 text-[#8AB17D] text-xs rounded-full font-medium">
                      {poem.style === 'classical' && '古典'}
                      {poem.style === 'modern' && '现代'}
                      {poem.style === 'haiku' && '俳句'}
                      {poem.style === 'prose' && '散文'}
                    </span>
                  </div>

                  <div className="text-gray-700 leading-relaxed mb-4 whitespace-pre-line min-h-32 text-sm">
                    {poem.content.length > 150
                      ? poem.content.substring(0, 150) + '...'
                      : poem.content}
                  </div>

                  {poem.theme && (
                    <div className="mb-4">
                      <span className="text-xs text-gray-500">主题：</span>
                      <span className="text-sm text-[#F4A261] font-medium ml-1">
                        {poem.theme}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Eye size={16} />
                        <span>{poem.views_count}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart size={16} />
                        <span>{poem.likes_count}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={16} />
                        <span>{new Date(poem.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleLike(poem.id)}
                      className="p-2 rounded-full hover:bg-[#F4A261]/10 text-[#F4A261] transition-all hover:scale-110"
                    >
                      <Heart size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
