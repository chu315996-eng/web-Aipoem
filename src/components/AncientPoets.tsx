import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, Sparkles, BookOpen, ChevronRight, Users } from 'lucide-react';
import { supabase } from '../lib/supabase';

type Poet = {
  id: string;
  name: string;
  dynasty: string;
  title: string;
  bio: string;
  style_description: string;
  famous_works: string[];
  personality_traits: string[];
  avatar_url: string | null;
};

type Message = {
  id: string;
  message: string;
  is_user_message: boolean;
  created_at: string;
};

export default function AncientPoets() {
  const [poets, setPoets] = useState<Poet[]>([]);
  const [selectedPoet, setSelectedPoet] = useState<Poet | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadPoets();
  }, []);

  useEffect(() => {
    if (selectedPoet) {
      loadConversation(selectedPoet.id);
    }
  }, [selectedPoet]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadPoets = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('ancient_poets')
        .select('*')
        .order('name');

      if (error) throw error;
      setPoets(data || []);
      if (data && data.length > 0) {
        setSelectedPoet(data[0]);
      }
    } catch (error) {
      console.error('Error loading poets:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadConversation = async (poetId: string) => {
    try {
      const { data, error } = await supabase
        .from('poet_conversations')
        .select('*')
        .eq('poet_id', poetId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error loading conversation:', error);
    }
  };

  const generatePoetResponse = (poet: Poet, userMessage: string): string => {
    const responses: { [key: string]: string[] } = {
      李白: [
        `哈哈！${userMessage}？吾观此言，颇有见地。人生得意须尽欢，莫使金樽空对月！不如随我一同饮酒赋诗，共赏这大好河山。`,
        `${userMessage}，说得好！正如我所言："天生我材必有用，千金散尽还复来。" 人生在世，当纵情山水，潇洒自在。`,
        `听君此言，让我想起当年在黄鹤楼所见之景。"孤帆远影碧空尽，唯见长江天际流。" ${userMessage}确有几分道理啊！`,
      ],
      杜甫: [
        `${userMessage}，此言甚是。如今世事艰难，正如我诗中所写："安得广厦千万间，大庇天下寒士俱欢颜。" 愿天下百姓皆能安居乐业。`,
        `听闻${userMessage}，不禁让我感慨万千。国破山河在，城春草木深。望君能多关注民生疾苦，心系天下苍生。`,
        `${userMessage}，确实如此。正所谓"烽火连三月，家书抵万金"，此等世道，更应珍惜眼前，关爱家人。`,
      ],
      苏轼: [
        `哈哈哈！${userMessage}？妙哉妙哉！正如我常言："人有悲欢离合，月有阴晴圆缺，此事古难全。" 看开些，一切随缘便好。`,
        `听君所言，让我想起当年在黄州。${userMessage}确有道理，但人生无常，不妨豁达些。"竹杖芒鞋轻胜马，谁怕？一蓑烟雨任平生。"`,
        `${userMessage}说得极是！此情此景，不禁让我想起赤壁之游。"大江东去，浪淘尽，千古风流人物。" 人生短暂，当及时行乐！`,
      ],
      李清照: [
        `${userMessage}，我听到了你的心声。"寻寻觅觅，冷冷清清，凄凄惨惨戚戚。" 人生总有不如意之时，但也不失希望。`,
        `你说的${userMessage}，让我想起当年在东篱下采菊的时光。"帘卷西风，人比黄花瘦。" 世事无常，唯有珍惜当下。`,
        `${userMessage}确实如此。"生当作人杰，死亦为鬼雄。" 无论男女，都应有自己的志向和追求，不负此生。`,
      ],
      白居易: [
        `${userMessage}，你说得对。我常说"文章合为时而著，歌诗合为事而作"，诗歌应当贴近生活，关注民生。`,
        `听到${userMessage}，我深有同感。正如我在《长恨歌》中所写，"在天愿作比翼鸟，在地愿为连理枝。" 情深意重，令人动容。`,
        `${userMessage}，这让我想起江州司马青衫湿的往事。"同是天涯沦落人，相逢何必曾相识。" 人生际遇各不相同，但情感相通。`,
      ],
      王维: [
        `${userMessage}……嗯，此言有理。"行到水穷处，坐看云起时。" 万物有道，顺其自然便好。`,
        `阿弥陀佛。${userMessage}，确实如此。"空山新雨后，天气晚来秋。" 山水之间，自有禅意，心静方能见真。`,
        `听闻${userMessage}，让我想起竹里馆的宁静。"独坐幽篁里，弹琴复长啸。" 世间纷扰，不如归隐山林，静心修禅。`,
      ],
    };

    const poetResponses = responses[poet.name] || [
      `${userMessage}，你说得很有道理。让我们继续探讨诗词之道吧。`,
    ];

    return poetResponses[Math.floor(Math.random() * poetResponses.length)];
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !selectedPoet || sending) return;

    setSending(true);
    const userMsg = inputMessage.trim();
    setInputMessage('');

    try {
      const { error: userError } = await supabase.from('poet_conversations').insert({
        user_id: 'demo-user',
        poet_id: selectedPoet.id,
        message: userMsg,
        is_user_message: true,
      });

      if (userError) throw userError;

      await new Promise((resolve) => setTimeout(resolve, 800));

      const poetResponse = generatePoetResponse(selectedPoet, userMsg);

      const { error: poetError } = await supabase.from('poet_conversations').insert({
        user_id: 'demo-user',
        poet_id: selectedPoet.id,
        message: poetResponse,
        is_user_message: false,
      });

      if (poetError) throw poetError;

      loadConversation(selectedPoet.id);
    } catch (error) {
      console.error('Error sending message:', error);
      alert('发送失败，请重试');
    } finally {
      setSending(false);
    }
  };

  const startNewConversation = async () => {
    if (!selectedPoet) return;

    if (messages.length > 0) {
      const confirm = window.confirm('确定要开启新对话吗？当前对话将被清空。');
      if (!confirm) return;
    }

    try {
      const { error } = await supabase
        .from('poet_conversations')
        .delete()
        .eq('poet_id', selectedPoet.id)
        .eq('user_id', 'demo-user');

      if (error) throw error;
      setMessages([]);
    } catch (error) {
      console.error('Error clearing conversation:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-6 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-[#2A5CAA] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-6 bg-gradient-to-br from-amber-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-[#2A5CAA] mb-4 flex items-center justify-center gap-3">
            <Users className="text-[#F4A261]" size={40} />
            古人智能体
          </h2>
          <p className="text-lg text-gray-600">与古代诗人对话，探索千年诗词文化</p>
        </div>

        <div className="grid md:grid-cols-12 gap-6">
          <div className="md:col-span-4 bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <BookOpen className="text-[#8AB17D]" size={24} />
              选择诗人
            </h3>

            <div className="space-y-3">
              {poets.map((poet) => (
                <button
                  key={poet.id}
                  onClick={() => setSelectedPoet(poet)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    selectedPoet?.id === poet.id
                      ? 'border-[#2A5CAA] bg-[#2A5CAA]/5 shadow-md'
                      : 'border-gray-200 hover:border-[#2A5CAA]/50 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-lg text-gray-800">{poet.name}</h4>
                    <span className="text-sm text-[#F4A261] font-medium">{poet.title}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{poet.dynasty}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {poet.personality_traits.slice(0, 3).map((trait, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2 py-1 bg-[#8AB17D]/10 text-[#8AB17D] rounded-full"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-8 bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
            {selectedPoet ? (
              <>
                <div className="bg-gradient-to-r from-[#2A5CAA] to-[#F4A261] p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">
                        {selectedPoet.name} · {selectedPoet.title}
                      </h3>
                      <p className="text-sm opacity-90 mb-3">{selectedPoet.dynasty}</p>
                      <p className="text-sm leading-relaxed opacity-95 mb-3">
                        {selectedPoet.bio}
                      </p>
                      <p className="text-sm leading-relaxed opacity-90">
                        <span className="font-semibold">诗风：</span>
                        {selectedPoet.style_description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-white/20">
                    <p className="text-sm font-semibold mb-2">代表作品：</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedPoet.famous_works.map((work, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-3 py-1 bg-white/20 rounded-full backdrop-blur-sm"
                        >
                          {work}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="h-96 overflow-y-auto p-6 bg-gradient-to-b from-gray-50 to-white">
                  {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                      <MessageCircle size={64} className="mb-4 opacity-50" />
                      <p className="text-center mb-2">与{selectedPoet.name}开启对话</p>
                      <p className="text-sm text-center">
                        尝试问问关于诗词创作、人生感悟或历史故事
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.is_user_message ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[75%] p-4 rounded-2xl ${
                              msg.is_user_message
                                ? 'bg-[#2A5CAA] text-white rounded-br-sm'
                                : 'bg-white border-2 border-gray-200 text-gray-800 rounded-bl-sm shadow-sm'
                            }`}
                          >
                            {!msg.is_user_message && (
                              <div className="flex items-center gap-2 mb-2 text-[#F4A261] text-sm font-semibold">
                                <Sparkles size={16} />
                                {selectedPoet.name}
                              </div>
                            )}
                            <p className="leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                            <p
                              className={`text-xs mt-2 ${
                                msg.is_user_message ? 'text-white/70' : 'text-gray-400'
                              }`}
                            >
                              {new Date(msg.created_at).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </div>

                <div className="p-4 border-t border-gray-200 bg-gray-50">
                  <div className="flex gap-2 mb-3">
                    <button
                      onClick={startNewConversation}
                      className="text-sm px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-100 transition-all"
                    >
                      新对话
                    </button>
                    <div className="flex-1"></div>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder={`向${selectedPoet.name}提问...`}
                      disabled={sending}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A5CAA] focus:border-transparent outline-none disabled:opacity-50"
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!inputMessage.trim() || sending}
                      className="px-6 py-3 bg-[#2A5CAA] text-white rounded-lg font-medium hover:bg-[#F4A261] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {sending ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          发送中
                        </>
                      ) : (
                        <>
                          <Send size={18} />
                          发送
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center p-12">
                <div className="text-center text-gray-400">
                  <ChevronRight size={64} className="mx-auto mb-4 opacity-50" />
                  <p>请选择一位诗人开始对话</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
