import { useState, useMemo } from 'react';
import type { Task, Skill } from '../../types';
import { X, Sparkles, Users } from 'lucide-react';

interface PackageSkillModalProps {
  task: Task;
  onClose: () => void;
  onPackage: (skill: Skill) => void;
}

const contributionTypeMap: Record<string, '开发' | '策划' | '设计' | '测试'> = {
  code: '开发',
  text: '策划',
  design: '设计',
};

export function PackageSkillModal({ task, onClose, onPackage }: PackageSkillModalProps) {
  const [name, setName] = useState(`${task.title} Skill`);
  const [description, setDescription] = useState(task.description);
  const [price, setPrice] = useState(String(Math.max(0.5, Math.round(task.reward / 100 * 10) / 10)));
  const [version, setVersion] = useState('1.0.0');

  // 从协作者生成股东
  const owners = useMemo(() => {
    const totalWeight = task.assignees.reduce((sum, a) => sum + a.weight, 0);
    if (totalWeight === 0) return [];

    return task.assignees.map(a => {
      const sharePercentage = Math.round((a.weight / totalWeight) * 100);
      // 查找该用户的主要提交类型
      const userSubs = task.submissions.filter(s => s.userId === a.userId && s.status === 'approved');
      const primaryType = userSubs.length > 0 ? userSubs[0].type : 'code';
      return {
        userId: a.userId,
        userName: a.name,
        sharePercentage,
        contributionType: contributionTypeMap[primaryType] || '开发',
      };
    });
  }, [task.assignees, task.submissions]);

  const handlePackage = () => {
    if (!name.trim()) return;

    const skill: Skill = {
      id: `s-${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      price: parseFloat(price) || 0,
      totalCalls: 0,
      rating: 5.0,
      owners,
      totalRevenue: 0,
      category: task.tags[0] || '其他',
      version,
    };

    onPackage(skill);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            <h2 className="text-lg font-bold text-gray-900">封装为 Skill</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Skill 名称</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Price & Version */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">单次调用价格 ($)</label>
              <input
                type="number"
                value={price}
                onChange={e => setPrice(e.target.value)}
                step="0.1"
                min="0"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">版本号</label>
              <input
                type="text"
                value={version}
                onChange={e => setVersion(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Equity breakdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                股权分配
              </span>
            </label>
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-3 py-2 text-gray-500 font-medium">贡献者</th>
                    <th className="text-left px-3 py-2 text-gray-500 font-medium">类型</th>
                    <th className="text-right px-3 py-2 text-gray-500 font-medium">股权</th>
                  </tr>
                </thead>
                <tbody>
                  {owners.map((owner, idx) => (
                    <tr key={owner.userId} className={idx > 0 ? 'border-t border-gray-100' : ''}>
                      <td className="px-3 py-2.5 text-gray-900 font-medium">{owner.userName}</td>
                      <td className="px-3 py-2.5 text-gray-500">{owner.contributionType}</td>
                      <td className="px-3 py-2.5 text-right text-gray-900 font-mono">{owner.sharePercentage}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-5 border-t border-gray-100">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handlePackage}
            className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            封装并发布
          </button>
        </div>
      </div>
    </div>
  );
}
