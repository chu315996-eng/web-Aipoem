import { useState } from 'react';
import { Sparkles, Download, Heart, Share2, Loader2, Lightbulb, BookOpen, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

type CreativeAdvice = {
  suggestions: string[];
  referencePoems: { title: string; content: string; author: string }[];
  technicalTips: string[];
};

export default function PoemCreator() {
  const [theme, setTheme] = useState('');
  const [style, setStyle] = useState('classical');
  const [mood, setMood] = useState('peaceful');
  const [generating, setGenerating] = useState(false);
  const [showAdvice, setShowAdvice] = useState(false);
  const [advice, setAdvice] = useState<CreativeAdvice | null>(null);
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

  const generateAdvice = async () => {
    if (!theme.trim()) {
      alert('请输入诗词主题');
      return;
    }

    setGenerating(true);
    setShowAdvice(false);
    setGeneratedPoem(null);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const adviceData: { [key: string]: any } = {
      classical: {
        peaceful: {
          suggestions: [
            '采用平仄相间的格律，营造音韵之美',
            '借景抒情，通过自然景物表达内心宁静',
            '运用对仗手法，增强诗词的工整感',
            '选用"月"、"云"、"水"等意象烘托氛围',
          ],
          referencePoems: [
            {
              title: '山居秋暝',
              author: '王维',
              content: '空山新雨后，天气晚来秋。\n明月松间照，清泉石上流。',
            },
            {
              title: '宿建德江',
              author: '孟浩然',
              content: '移舟泊烟渚，日暮客愁新。\n野旷天低树，江清月近人。',
            },
          ],
          technicalTips: [
            '注意平仄押韵，保持音律和谐',
            '每句字数保持一致（五言或七言）',
            '末尾押韵，通常采用平声韵',
          ],
        },
        joyful: {
          suggestions: [
            '选择明快的意象，如"春花"、"朝阳"、"飞燕"',
            '运用欢快的节奏，表现愉悦的心情',
            '适当使用叠词，增强诗歌的生动性',
            '可以描绘欢聚、盛会等喜庆场景',
          ],
          referencePoems: [
            {
              title: '春日',
              author: '朱熹',
              content: '胜日寻芳泗水滨，无边光景一时新。\n等闲识得东风面，万紫千红总是春。',
            },
            {
              title: '登科后',
              author: '孟郊',
              content: '昔日龌龊不足夸，今朝放荡思无涯。\n春风得意马蹄疾，一日看尽长安花。',
            },
          ],
          technicalTips: [
            '选用响亮的韵脚，增强欢快感',
            '多用动词，展现活力与动态美',
            '适当使用夸张手法',
          ],
        },
      },
      modern: {
        peaceful: {
          suggestions: [
            '采用自由诗形式，不必拘泥于格律',
            '运用细腻的感官描写，营造静谧氛围',
            '通过留白和分行，创造诗意空间',
            '注重意象的选择，追求意境深远',
          ],
          referencePoems: [
            {
              title: '面朝大海，春暖花开',
              author: '海子',
              content: '从明天起，做一个幸福的人\n喂马，劈柴，周游世界\n从明天起，关心粮食和蔬菜\n我有一所房子，面朝大海，春暖花开',
            },
          ],
          technicalTips: [
            '注意分行的节奏感',
            '运用意象呼应，增强诗歌整体性',
            '避免直白叙述，追求含蓄美',
          ],
        },
        joyful: {
          suggestions: [
            '用跳跃的节奏表现欢快情绪',
            '选择明亮、温暖的意象',
            '可以加入对话或呼告，增强感染力',
            '适当运用排比，营造气势',
          ],
          referencePoems: [
            {
              title: '相信未来',
              author: '食指',
              content: '当蜘蛛网无情地查封了我的炉台\n当灰烬的余烟叹息着贫困的悲哀\n我依然固执地铺平失望的灰烬\n用美丽的雪花写下：相信未来',
            },
          ],
          technicalTips: [
            '运用积极向上的意象',
            '控制好诗歌的节奏和韵律',
            '结尾要有力量感',
          ],
        },
      },
      haiku: {
        peaceful: {
          suggestions: [
            '遵循5-7-5的音节结构',
            '捕捉瞬间的感受，强调"物哀"之美',
            '包含季节意象，营造时空感',
            '注重留白，给读者想象空间',
          ],
          referencePoems: [
            {
              title: '古池',
              author: '松尾芭蕉',
              content: '古池塘\n青蛙跳入\n水之音',
            },
            {
              title: '秋夜',
              author: '与谢芜村',
              content: '秋之夜\n听着棋声\n月色寒',
            },
          ],
          technicalTips: [
            '三行结构，简洁凝练',
            '必须包含季节词（季语）',
            '运用"切字"，增强诗意停顿',
          ],
        },
      },
    };

    const selectedAdvice =
      adviceData[style]?.[mood] || adviceData.modern.peaceful;

    setAdvice(selectedAdvice);
    setShowAdvice(true);
    setGenerating(false);
  };

  const generatePoem = async () => {
    setGenerating(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const poems = {
      classical: {
        peaceful: {
          title: `${theme}思`,
          content: `明月照${theme}前，\n清风抚琴弦。\n悠然心自在，\n诗意满人间。`,
        },
        joyful: {
          title: `${theme}赋`,
          content: `${theme}映春晖，\n百花齐争妍。\n欢声笑语间，\n快意满心田。`,
        },
        melancholic: {
          title: `${theme}愁`,
          content: `${theme}惹离愁，\n秋风落叶稠。\n天涯孤旅客，\n何处是归舟。`,
        },
        romantic: {
          title: `${theme}吟`,
          content: `${theme}系相思，\n月下诉情丝。\n愿得一心人，\n白首不相离。`,
        },
        contemplative: {
          title: `${theme}悟`,
          content: `${theme}引深思，\n人生几何时。\n古今多少事，\n都付笑谈中。`,
        },
        passionate: {
          title: `${theme}歌`,
          content: `${theme}壮志豪，\n长风破万涛。\n男儿当自强，\n功名立今朝。`,
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
        melancholic: {
          title: `${theme}的低语`,
          content: `${theme}在秋风中摇曳\n带着说不出的忧伤\n那些逝去的时光\n如落叶般飘零\n\n我只能静静伫立\n任回忆在心中荡漾`,
        },
        romantic: {
          title: `${theme}的情书`,
          content: `${theme}是我写给你的情书\n每一个字都是思念\n每一行都是温柔\n\n愿这份情意\n如同星辰般永恒\n照亮我们的未来`,
        },
        contemplative: {
          title: `关于${theme}的思考`,
          content: `${theme}让我思考\n生命的意义\n在时光的长河中\n我们如此渺小\n\n但正是这份渺小\n让每个瞬间都弥足珍贵`,
        },
        passionate: {
          title: `${theme}的呐喊`,
          content: `${theme}点燃了我的激情\n如同烈火般燃烧\n冲破一切束缚\n向着梦想奔跑\n\n这是属于我的时代\n我要放声高歌`,
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
        melancholic: {
          title: '秋',
          content: `${theme}飘零时\n秋风带走往事\n空留一声叹`,
        },
        romantic: {
          title: '恋',
          content: `${theme}相思意\n明月千里共婵娟\n心系一人间`,
        },
        contemplative: {
          title: '禅',
          content: `${theme}引深思\n万物归于寂静\n悟得本心来`,
        },
        passionate: {
          title: '志',
          content: `${theme}壮志酬\n长风破浪会有时\n扬帆济沧海`,
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

  const resetCreation = () => {
    setShowAdvice(false);
    setAdvice(null);
    setGeneratedPoem(null);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#2A5CAA] mb-4">Ai辅助诗词创作工坊</h2>
          <p className="text-lg text-gray-600">
            输入您的创作需求，Ai将为您提供专业建议和参考范例
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <Sparkles className="text-[#F4A261]" />
              创作需求
            </h3>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  诗词主题 *
                </label>
                <input
                  type="text"
                  value={theme}
                  onChange={(e) => {
                    setTheme(e.target.value);
                    resetCreation();
                  }}
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
                      onClick={() => {
                        setStyle(s.value);
                        resetCreation();
                      }}
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
                      onClick={() => {
                        setMood(m.value);
                        resetCreation();
                      }}
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

              {!showAdvice && !generatedPoem && (
                <button
                  onClick={generateAdvice}
                  disabled={generating}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#2A5CAA] text-white rounded-lg font-medium shadow-md hover:bg-[#F4A261] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {generating ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      生成建议中...
                    </>
                  ) : (
                    <>
                      <Lightbulb size={20} />
                      获取创作建议
                    </>
                  )}
                </button>
              )}

              {showAdvice && !generatedPoem && (
                <button
                  onClick={generatePoem}
                  disabled={generating}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#8AB17D] text-white rounded-lg font-medium shadow-md hover:bg-[#8AB17D]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {generating ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Ai创作中...
                    </>
                  ) : (
                    <>
                      <Sparkles size={20} />
                      开始创作诗词
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-lg p-8 border border-gray-200">
            {!showAdvice && !generatedPoem && (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <Lightbulb size={64} className="mb-4 opacity-50" />
                <p className="text-center">
                  设置好创作需求后
                  <br />
                  点击"获取创作建议"
                  <br />
                  Ai将为您提供专业指导
                </p>
              </div>
            )}

            {showAdvice && advice && !generatedPoem && (
              <div className="space-y-6 max-h-[600px] overflow-y-auto">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Lightbulb className="text-[#F4A261]" />
                    创作建议
                  </h3>
                  <ul className="space-y-2">
                    {advice.suggestions.map((suggestion, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-sm text-gray-700 bg-white p-3 rounded-lg"
                      >
                        <ChevronRight size={16} className="text-[#8AB17D] mt-0.5 flex-shrink-0" />
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <BookOpen className="text-[#2A5CAA]" />
                    参考诗歌
                  </h3>
                  <div className="space-y-4">
                    {advice.referencePoems.map((poem, idx) => (
                      <div key={idx} className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-[#2A5CAA]">{poem.title}</h4>
                          <span className="text-sm text-gray-500">{poem.author}</span>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                          {poem.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Sparkles className="text-[#8AB17D]" />
                    技术要点
                  </h3>
                  <ul className="space-y-2">
                    {advice.technicalTips.map((tip, idx) => (
                      <li
                        key={idx}
                        className="text-sm text-gray-700 bg-white p-3 rounded-lg flex items-start gap-2"
                      >
                        <span className="text-[#F4A261] font-bold">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {generatedPoem && (
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">创作成果</h3>
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
                  onClick={() => {
                    setShowAdvice(true);
                    setGeneratedPoem(null);
                  }}
                  className="w-full px-4 py-3 bg-white text-[#2A5CAA] rounded-lg font-medium border-2 border-[#2A5CAA] hover:bg-[#2A5CAA] hover:text-white transition-all"
                >
                  查看创作建议
                </button>

                <button
                  onClick={generatePoem}
                  className="w-full px-4 py-3 bg-white text-[#8AB17D] rounded-lg font-medium border-2 border-[#8AB17D] hover:bg-[#8AB17D] hover:text-white transition-all"
                >
                  重新生成
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
