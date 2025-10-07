import { useState, useEffect } from 'react';
import { Upload, Plus, Trash2, FileText, Loader2, CheckCircle, XCircle, Bot } from 'lucide-react';
import { supabase } from '../lib/supabase';

type CustomAgent = {
  id: string;
  name: string;
  description: string | null;
  personality: string | null;
  training_status: string;
  created_at: string;
};

type TrainingFile = {
  id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  upload_date: string;
};

export default function CustomAgentTrainer() {
  const [agents, setAgents] = useState<CustomAgent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<CustomAgent | null>(null);
  const [trainingFiles, setTrainingFiles] = useState<TrainingFile[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  const [newAgentName, setNewAgentName] = useState('');
  const [newAgentDesc, setNewAgentDesc] = useState('');
  const [newAgentPersonality, setNewAgentPersonality] = useState('');

  useEffect(() => {
    loadAgents();
  }, []);

  useEffect(() => {
    if (selectedAgent) {
      loadTrainingFiles(selectedAgent.id);
    }
  }, [selectedAgent]);

  const loadAgents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('custom_agents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAgents(data || []);
      if (data && data.length > 0) {
        setSelectedAgent(data[0]);
      }
    } catch (error) {
      console.error('Error loading agents:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTrainingFiles = async (agentId: string) => {
    try {
      const { data, error } = await supabase
        .from('training_data')
        .select('id, file_name, file_type, file_size, upload_date')
        .eq('agent_id', agentId)
        .order('upload_date', { ascending: false });

      if (error) throw error;
      setTrainingFiles(data || []);
    } catch (error) {
      console.error('Error loading training files:', error);
    }
  };

  const createAgent = async () => {
    if (!newAgentName.trim()) {
      alert('请输入智能体名称');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('custom_agents')
        .insert({
          user_id: 'demo-user',
          name: newAgentName,
          description: newAgentDesc || null,
          personality: newAgentPersonality || null,
          training_status: 'ready',
        })
        .select()
        .single();

      if (error) throw error;

      setNewAgentName('');
      setNewAgentDesc('');
      setNewAgentPersonality('');
      setShowCreateModal(false);
      loadAgents();
      alert('智能体创建成功！');
    } catch (error) {
      console.error('Error creating agent:', error);
      alert('创建失败，请重试');
    }
  };

  const deleteAgent = async (id: string) => {
    if (!confirm('确定要删除这个智能体吗？所有训练数据也将被删除。')) return;

    try {
      const { error } = await supabase.from('custom_agents').delete().eq('id', id);

      if (error) throw error;
      loadAgents();
      setSelectedAgent(null);
    } catch (error) {
      console.error('Error deleting agent:', error);
      alert('删除失败，请重试');
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedAgent) {
      alert('请先选择一个智能体');
      return;
    }

    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      for (const file of Array.from(files)) {
        const content = await readFileContent(file);

        const { error } = await supabase.from('training_data').insert({
          agent_id: selectedAgent.id,
          file_name: file.name,
          file_type: file.type || getFileExtension(file.name),
          file_size: file.size,
          content: content,
        });

        if (error) throw error;
      }

      loadTrainingFiles(selectedAgent.id);
      alert('文件上传成功！');
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('上传失败，请重试');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const readFileContent = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const content = e.target?.result as string;
        resolve(content || '');
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      if (file.type.includes('text') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
        reader.readAsText(file);
      } else {
        resolve(`[文件名: ${file.name}, 类型: ${file.type}, 大小: ${formatFileSize(file.size)}]\n注意：该文件类型的内容提取需要服务器端处理。`);
      }
    });
  };

  const getFileExtension = (filename: string): string => {
    return filename.split('.').pop() || 'unknown';
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const deleteTrainingFile = async (fileId: string) => {
    if (!confirm('确定要删除这个训练文件吗？')) return;

    try {
      const { error } = await supabase.from('training_data').delete().eq('id', fileId);

      if (error) throw error;
      if (selectedAgent) {
        loadTrainingFiles(selectedAgent.id);
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('删除失败，请重试');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-[#2A5CAA] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Bot className="text-[#8AB17D]" />
          我的智能体
        </h3>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#2A5CAA] text-white rounded-lg font-medium hover:bg-[#F4A261] transition-all"
        >
          <Plus size={18} />
          创建智能体
        </button>
      </div>

      {agents.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-300">
          <Bot size={64} className="mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500 mb-4">还没有自定义智能体</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#2A5CAA] text-white rounded-lg font-medium hover:bg-[#F4A261] transition-all"
          >
            <Plus size={20} />
            创建第一个智能体
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-3">
            {agents.map((agent) => (
              <div
                key={agent.id}
                onClick={() => setSelectedAgent(agent)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedAgent?.id === agent.id
                    ? 'border-[#2A5CAA] bg-[#2A5CAA]/5 shadow-md'
                    : 'border-gray-200 hover:border-[#2A5CAA]/50 bg-white'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-bold text-gray-800">{agent.name}</h4>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteAgent(agent.id);
                    }}
                    className="p-1 hover:bg-red-50 rounded text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                {agent.description && (
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{agent.description}</p>
                )}
                <div className="flex items-center gap-2 text-xs">
                  {agent.training_status === 'ready' && (
                    <span className="flex items-center gap-1 text-green-600">
                      <CheckCircle size={14} />
                      就绪
                    </span>
                  )}
                  {agent.training_status === 'training' && (
                    <span className="flex items-center gap-1 text-blue-600">
                      <Loader2 size={14} className="animate-spin" />
                      训练中
                    </span>
                  )}
                  {agent.training_status === 'error' && (
                    <span className="flex items-center gap-1 text-red-600">
                      <XCircle size={14} />
                      错误
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="md:col-span-2 bg-white rounded-xl p-6 border border-gray-200">
            {selectedAgent ? (
              <div>
                <div className="mb-6">
                  <h4 className="text-xl font-bold text-gray-800 mb-2">{selectedAgent.name}</h4>
                  {selectedAgent.description && (
                    <p className="text-gray-600 mb-3">{selectedAgent.description}</p>
                  )}
                  {selectedAgent.personality && (
                    <p className="text-sm text-gray-500">
                      <span className="font-semibold">性格特征：</span>
                      {selectedAgent.personality}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="font-semibold text-gray-800">训练数据</h5>
                    <label className="flex items-center gap-2 px-4 py-2 bg-[#8AB17D] text-white rounded-lg font-medium cursor-pointer hover:bg-[#8AB17D]/90 transition-all">
                      <Upload size={18} />
                      {uploading ? '上传中...' : '上传文件'}
                      <input
                        type="file"
                        multiple
                        accept=".txt,.pdf,.doc,.docx,.ppt,.pptx,.md"
                        onChange={handleFileUpload}
                        disabled={uploading}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <p className="text-sm text-gray-500 mb-4">
                    支持格式：TXT, PDF, Word, PPT, Markdown
                  </p>

                  {trainingFiles.length === 0 ? (
                    <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                      <FileText size={48} className="mx-auto mb-2 text-gray-300" />
                      <p className="text-gray-500 text-sm">还没有上传训练数据</p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {trainingFiles.map((file) => (
                        <div
                          key={file.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="text-[#2A5CAA]" size={20} />
                            <div>
                              <p className="font-medium text-gray-800 text-sm">{file.file_name}</p>
                              <p className="text-xs text-gray-500">
                                {formatFileSize(file.file_size)} · {new Date(file.upload_date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => deleteTrainingFile(file.id)}
                            className="p-2 hover:bg-red-50 rounded text-red-500 transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <p>选择一个智能体查看详情</p>
              </div>
            )}
          </div>
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">创建自定义智能体</h3>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  智能体名称 *
                </label>
                <input
                  type="text"
                  value={newAgentName}
                  onChange={(e) => setNewAgentName(e.target.value)}
                  placeholder="例如：我的诗词助手"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A5CAA] focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  描述（可选）
                </label>
                <textarea
                  value={newAgentDesc}
                  onChange={(e) => setNewAgentDesc(e.target.value)}
                  placeholder="简单描述这个智能体的用途..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A5CAA] focus:border-transparent outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  性格特征（可选）
                </label>
                <input
                  type="text"
                  value={newAgentPersonality}
                  onChange={(e) => setNewAgentPersonality(e.target.value)}
                  placeholder="例如：温和、专业、幽默"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A5CAA] focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all"
              >
                取消
              </button>
              <button
                onClick={createAgent}
                className="flex-1 px-4 py-3 bg-[#2A5CAA] text-white rounded-lg font-medium hover:bg-[#F4A261] transition-all"
              >
                创建
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
