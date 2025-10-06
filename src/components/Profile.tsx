import { useState, useEffect } from 'react';
import { User, BookOpen, Heart, Award, TrendingUp } from 'lucide-react';
import { supabase, type Poem } from '../lib/supabase';

export default function Profile() {
  const [myPoems, setMyPoems] = useState<Poem[]>([]);
  const [stats, setStats] = useState({
    totalPoems: 0,
    totalLikes: 0,
    totalViews: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    setLoading(true);
    try {
      const { data: poems, error } = await supabase
        .from('poems')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      const totalPoems = poems?.length || 0;
      const totalLikes = poems?.reduce((sum, p) => sum + p.likes_count, 0) || 0;
      const totalViews = poems?.reduce((sum, p) => sum + p.views_count, 0) || 0;

      setMyPoems(poems || []);
      setStats({ totalPoems, totalLikes, totalViews });
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-6 bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-[#2A5CAA] to-[#F4A261] rounded-full flex items-center justify-center">
              <User size={48} className="text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">诗词创作者</h2>
              <p className="text-gray-600">用AI书写心中的诗意</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-[#2A5CAA] rounded-full flex items-center justify-center mx-auto mb-3">
                <BookOpen className="text-white" size={24} />
              </div>
              <div className="text-3xl font-bold text-[#2A5CAA] mb-1">
                {stats.totalPoems}
              </div>
              <div className="text-sm text-gray-600">创作诗词</div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-[#F4A261] rounded-full flex items-center justify-center mx-auto mb-3">
                <Heart className="text-white" size={24} />
              </div>
              <div className="text-3xl font-bold text-[#F4A261] mb-1">
                {stats.totalLikes}
              </div>
              <div className="text-sm text-gray-600">获得点赞</div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-[#8AB17D] rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="text-white" size={24} />
              </div>
              <div className="text-3xl font-bold text-[#8AB17D] mb-1">
                {stats.totalViews}
              </div>
              <div className="text-sm text-gray-600">作品浏览</div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Award className="text-white" size={24} />
              </div>
              <div className="text-3xl font-bold text-purple-500 mb-1">初心</div>
              <div className="text-sm text-gray-600">创作等级</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <BookOpen className="text-[#2A5CAA]" />
            我的作品
          </h3>

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block w-12 h-12 border-4 border-[#2A5CAA] border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600">加载中...</p>
            </div>
          ) : myPoems.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen size={64} className="mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500 text-lg">还没有创作作品</p>
            </div>
          ) : (
            <div className="space-y-4">
              {myPoems.map((poem) => (
                <div
                  key={poem.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all hover:border-[#2A5CAA]"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="text-xl font-bold text-[#2A5CAA]">{poem.title}</h4>
                    <span className="px-3 py-1 bg-[#8AB17D]/10 text-[#8AB17D] text-xs rounded-full">
                      {poem.style === 'classical' && '古典'}
                      {poem.style === 'modern' && '现代'}
                      {poem.style === 'haiku' && '俳句'}
                      {poem.style === 'prose' && '散文'}
                    </span>
                  </div>

                  <div className="text-gray-700 leading-relaxed mb-3 whitespace-pre-line text-sm">
                    {poem.content.length > 200
                      ? poem.content.substring(0, 200) + '...'
                      : poem.content}
                  </div>

                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Heart size={16} />
                      <span>{poem.likes_count} 点赞</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp size={16} />
                      <span>{poem.views_count} 浏览</span>
                    </div>
                    <div className="text-xs">
                      {new Date(poem.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
