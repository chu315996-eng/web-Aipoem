import { useState } from 'react';
import { Sparkles, Download, Heart, Share2, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function PoemCreator() {
  const [theme, setTheme] = useState('');
  const [style, setStyle] = useState('classical');
  const [mood, setMood] = useState('peaceful');
  const [generating, setGenerating] = useState(false);
  const [generatedPoem, setGeneratedPoem] = useState<{
    title: string;
    content: string;
  } | null>(null);

  const styles = [
    { value: 'classical', label: '古典诗词', desc: '五言七言，格律工整' },
    { value: 'modern', label: '现代诗歌', desc: '自由表达，意境深远' },
    { value: 'haiku', label: '俳句小诗', desc: '简约凝练，禅意悠长' },
    { value: 'prose', label: '散文诗', desc: '诗意散文，情感流淌' },
  ];

  const moods = [
    { value: 'peaceful', label: '宁静', emoji: '🌙' },
    { value: 'joyful', label: '欢快', emoji: '🌸' },
    { value: 'melancholic', label: '忧郁', emoji: '🍂' },
    { value: 'romantic', label: '浪漫', emoji: '💫' },
    { value: 'contemplative', label: '沉思', emoji: '🏔️' },
    { value: 'passionate', label: '激昂', emoji: '🔥' },
  ];

  const generatePoem = async () => {
    if (!theme.trim()) {
      alert('请输入诗词主题');
      return;
    }

    setGenerating(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const poems = {
      classical: {
        peaceful: {
          title: '静夜思',
          content: `明月照窗前，\n清风抚琴弦。\n${theme}意悠然，\n诗心自安闲。`,
        },
        joyful: {
          title: '春日吟',
          content: `${theme}映春晖，\n百花齐争妍。\n欢声笑语间，\n诗意满人间。`,
        },
      },
      modern: {
        peaceful: {
          title: `${theme}的沉思`,
          content: `在${theme}的怀抱中\n时间仿佛静止\n每一丝微风\n都在诉说着永恒\n\n心灵找到了栖息\n在这片宁静的天地`,
        },
        joyful: {
          title: `${theme}的欢歌`,
          content: `当${theme}绽放笑颜\n整个世界都明亮起来\n欢乐如泉水般涌出\n洒满每一个角落\n\n让我们一起歌唱\n歌颂这美好时光`,
        },
      },
      haiku: {
        peaceful: {
          title: '静',
          content: `${theme}静悄悄\n月光洒满庭院\n心也安宁了`,
        },
        joyful: {
          title: '喜',
          content: `${theme}展笑颜\n春风拂过心田\n欢喜满人间`,
        },
      },
    };

    const selectedStyle = style as keyof typeof poems;
    const selectedMood = mood as keyof (typeof poems)[typeof selectedStyle];
    const poem =
      poems[selectedStyle]?.[selectedMood] ||
      poems.modern.peaceful;

    setGeneratedPoem(poem);
    setGenerating(false);
  };

  const savePoem = async () => {
    if (!generatedPoem) return;

    try {
      const { error } = await supabase.from('poems').insert({
        title: generatedPoem.title,
        content: generatedPoem.content,
        style,
        theme,
        mood,
        is_public: true,
      });

      if (error) throw error;

      alert('诗词已保存！');
    } catch (error) {
      console.error('Error saving poem:', error);
      alert('保存失败，请重试');
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#2A5CAA] mb-4">AI诗词创作工坊</h2>
          <p className="text-lg text-gray-600">
            输入您的灵感，让AI为您谱写专属诗篇
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <Sparkles className="text-[#F4A261]" />
              创作设置
            </h3>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  诗词主题 *
                </label>
                <input
                  type="text"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  placeholder="例如：春天、月亮、思乡、爱情..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A5CAA] focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  诗词风格
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {styles.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => setStyle(s.value)}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        style === s.value
                          ? 'border-[#2A5CAA] bg-[#2A5CAA]/5'
                          : 'border-gray-200 hover:border-[#2A5CAA]/50'
                      }`}
                    >
                      <div className="font-medium text-gray-800">{s.label}</div>
                      <div className="text-xs text-gray-500 mt-1">{s.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  情感基调
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {moods.map((m) => (
                    <button
                      key={m.value}
                      onClick={() => setMood(m.value)}
                      className={`p-3 rounded-lg border-2 transition-all text-center ${
                        mood === m.value
                          ? 'border-[#F4A261] bg-[#F4A261]/10'
                          : 'border-gray-200 hover:border-[#F4A261]/50'
                      }`}
                    >
                      <div className="text-2xl mb-1">{m.emoji}</div>
                      <div className="text-sm font-medium">{m.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={generatePoem}
                disabled={generating}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#2A5CAA] text-white rounded-lg font-medium shadow-md hover:bg-[#F4A261] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {generating ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    AI创作中...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    生成诗词
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-lg p-8 border border-gray-200">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">生成结果</h3>

            {generatedPoem ? (
              <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h4 className="text-2xl font-bold text-[#2A5CAA] mb-4 text-center">
                    {generatedPoem.title}
                  </h4>
                  <div className="text-gray-700 leading-loose whitespace-pre-line text-center text-lg">
                    {generatedPoem.content}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={savePoem}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#8AB17D] text-white rounded-lg font-medium hover:bg-[#8AB17D]/90 transition-all"
                  >
                    <Heart size={18} />
                    保存作品
                  </button>
                  <button className="flex items-center justify-center gap-2 px-4 py-3 bg-white text-gray-700 rounded-lg font-medium border border-gray-300 hover:bg-gray-50 transition-all">
                    <Share2 size={18} />
                    分享
                  </button>
                  <button className="flex items-center justify-center gap-2 px-4 py-3 bg-white text-gray-700 rounded-lg font-medium border border-gray-300 hover:bg-gray-50 transition-all">
                    <Download size={18} />
                    下载
                  </button>
                </div>

                <button
                  onClick={generatePoem}
                  className="w-full px-4 py-3 bg-white text-[#2A5CAA] rounded-lg font-medium border-2 border-[#2A5CAA] hover:bg-[#2A5CAA] hover:text-white transition-all"
                >
                  重新生成
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <Sparkles size={48} className="mb-4 opacity-50" />
                <p className="text-center">
                  设置好参数后，点击"生成诗词"
                  <br />
                  让AI为您创作专属诗篇
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
