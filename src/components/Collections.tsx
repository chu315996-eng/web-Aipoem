import { useState, useEffect } from 'react';
import { BookHeart, Plus, FolderOpen, Trash2 } from 'lucide-react';
import { supabase, type Collection } from '../lib/supabase';

export default function Collections() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionDesc, setNewCollectionDesc] = useState('');

  useEffect(() => {
    loadCollections();
  }, []);

  const loadCollections = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCollections(data || []);
    } catch (error) {
      console.error('Error loading collections:', error);
    } finally {
      setLoading(false);
    }
  };

  const createCollection = async () => {
    if (!newCollectionName.trim()) {
      alert('请输入收藏集名称');
      return;
    }

    try {
      const { error } = await supabase.from('collections').insert({
        name: newCollectionName,
        description: newCollectionDesc || null,
        user_id: 'demo-user',
        is_public: false,
      });

      if (error) throw error;

      setNewCollectionName('');
      setNewCollectionDesc('');
      setShowCreateModal(false);
      loadCollections();
    } catch (error) {
      console.error('Error creating collection:', error);
      alert('创建失败，请重试');
    }
  };

  const deleteCollection = async (id: string) => {
    if (!confirm('确定要删除这个收藏集吗？')) return;

    try {
      const { error } = await supabase.from('collections').delete().eq('id', id);

      if (error) throw error;
      loadCollections();
    } catch (error) {
      console.error('Error deleting collection:', error);
      alert('删除失败，请重试');
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-6 bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl font-bold text-[#2A5CAA] mb-2">我的收藏</h2>
            <p className="text-lg text-gray-600">管理您珍藏的诗词作品</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-[#2A5CAA] text-white rounded-lg font-medium shadow-md hover:bg-[#F4A261] transition-all hover:scale-105"
          >
            <Plus size={20} />
            新建收藏集
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-12 h-12 border-4 border-[#2A5CAA] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">加载中...</p>
          </div>
        ) : collections.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
            <BookHeart size={64} className="mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 text-lg mb-6">还没有收藏集</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#2A5CAA] text-white rounded-lg font-medium hover:bg-[#F4A261] transition-all"
            >
              <Plus size={20} />
              创建第一个收藏集
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map((collection) => (
              <div
                key={collection.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-[#8AB17D] group"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[#8AB17D]/10 rounded-lg flex items-center justify-center group-hover:bg-[#8AB17D]/20 transition-colors">
                        <FolderOpen className="text-[#8AB17D]" size={24} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-800 group-hover:text-[#2A5CAA] transition-colors">
                          {collection.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {collection.is_public ? '公开' : '私密'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteCollection(collection.id)}
                      className="p-2 rounded-lg hover:bg-red-50 text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  {collection.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {collection.description}
                    </p>
                  )}

                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                      创建于 {new Date(collection.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">创建新收藏集</h3>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  收藏集名称 *
                </label>
                <input
                  type="text"
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                  placeholder="例如：春天的诗"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A5CAA] focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  描述（可选）
                </label>
                <textarea
                  value={newCollectionDesc}
                  onChange={(e) => setNewCollectionDesc(e.target.value)}
                  placeholder="简单描述这个收藏集..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A5CAA] focus:border-transparent outline-none resize-none"
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
                onClick={createCollection}
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
