import { useState, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import type { Task, SkillTag } from '../../types';
import { TaskInput } from './TaskInput';
import { SkillSelector } from './SkillSelector';
import { WeightChart } from './WeightChart';
import { TaskPreview } from './TaskPreview';

const ALL_SKILLS: SkillTag[] = [
  'React', 'TypeScript', 'Node.js', 'Python', 'UI Design',
  '写作', '视频剪辑', 'TTS', 'FFmpeg', '项目管理', '爬虫', 'API Integration'
];

export function TaskPublishPage() {
  const { addTask, state } = useApp();
  const [description, setDescription] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<{ tag: SkillTag; weight: number }[]>([]);
  const [reward, setReward] = useState(5000);
  const [showPreview, setShowPreview] = useState(false);

  // 模拟技能标签自动提取 - 使用关键词到 SkillTag 的映射
  const handleAnalyzeSkills = useCallback(() => {
    const lowerDesc = description.toLowerCase();
    const extracted: Set<SkillTag> = new Set();

    // React
    if (lowerDesc.includes('react') || lowerDesc.includes('组件') || lowerDesc.includes('前端')) {
      extracted.add('React');
    }
    // TypeScript
    if (lowerDesc.includes('typescript') || lowerDesc.includes('类型') || lowerDesc.includes('ts')) {
      extracted.add('TypeScript');
    }
    // Python
    if (lowerDesc.includes('python') || lowerDesc.includes('脚本')) {
      extracted.add('Python');
    }
    // 爬虫
    if (lowerDesc.includes('爬虫') || lowerDesc.includes('抓取') || lowerDesc.includes('采集') || lowerDesc.includes('spider')) {
      extracted.add('爬虫');
    }
    // 视频剪辑
    if (lowerDesc.includes('视频') || lowerDesc.includes('剪辑')) {
      extracted.add('视频剪辑');
    }
    // TTS
    if (lowerDesc.includes('tts') || lowerDesc.includes('配音') || lowerDesc.includes('语音')) {
      extracted.add('TTS');
    }
    // FFmpeg
    if (lowerDesc.includes('ffmpeg') || lowerDesc.includes('转码')) {
      extracted.add('FFmpeg');
    }
    // 写作
    if (lowerDesc.includes('写作') || lowerDesc.includes('小说') || lowerDesc.includes('文章') || lowerDesc.includes('文案')) {
      extracted.add('写作');
    }
    // UI Design
    if (lowerDesc.includes('ui') || lowerDesc.includes('设计') || lowerDesc.includes('视觉')) {
      extracted.add('UI Design');
    }
    // Node.js
    if (lowerDesc.includes('node') || lowerDesc.includes('服务器')) {
      extracted.add('Node.js');
    }
    // 项目管理
    if (lowerDesc.includes('项目管理') || lowerDesc.includes('策划') || lowerDesc.includes('统筹')) {
      extracted.add('项目管理');
    }
    // API Integration
    if (lowerDesc.includes('api') || lowerDesc.includes('集成') || lowerDesc.includes('接口')) {
      extracted.add('API Integration');
    }

    // 如果提取到技能，平均分配权重
    if (extracted.size > 0) {
      const tags = Array.from(extracted);
      const baseWeight = Math.floor(100 / tags.length);
      const remainder = 100 - baseWeight * tags.length;

      const newSkills = tags.map((tag, index) => ({
        tag,
        weight: index < remainder ? baseWeight + 1 : baseWeight,
      }));

      setSelectedSkills(newSkills);
    }
  }, [description]);

  // 更新技能权重
  const handleUpdateWeight = useCallback((tag: SkillTag, weight: number) => {
    setSelectedSkills(prev =>
      prev.map(s => s.tag === tag ? { ...s, weight } : s)
    );
  }, []);

  // 移除技能
  const handleRemoveSkill = useCallback((tag: SkillTag) => {
    setSelectedSkills(prev => prev.filter(s => s.tag !== tag));
  }, []);

  // 添加技能
  const handleAddSkill = useCallback((tag: SkillTag) => {
    if (!selectedSkills.find(s => s.tag === tag)) {
      const newWeight = selectedSkills.length > 0 ? Math.floor(100 / (selectedSkills.length + 1)) : 100;

      setSelectedSkills(prev => {
        const updated = prev.map(s => ({
          ...s,
          weight: Math.floor(100 / (prev.length + 1)),
        }));
        const remainder = 100 - updated.reduce((sum, s) => sum + s.weight, 0);
        return [...updated, { tag, weight: newWeight + remainder }];
      });
    }
  }, [selectedSkills]);

  // 发布任务
  const handlePublish = useCallback(() => {
    const newTask: Task = {
      id: `t${Date.now()}`,
      title: description.slice(0, 50) + (description.length > 50 ? '...' : ''),
      description,
      skills: selectedSkills,
      reward,
      status: 'available',
      publisherId: state.currentUser?.id,
      createdAt: new Date().toISOString().split('T')[0],
      tags: selectedSkills.map(s => s.tag),
    };

    addTask(newTask);
    setShowPreview(false);
    setDescription('');
    setSelectedSkills([]);
    setReward(5000);
  }, [description, selectedSkills, reward, addTask, state.currentUser]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">发布任务</h1>

      <div className="space-y-6">
        {/* 任务描述输入 */}
        <TaskInput
          description={description}
          onChange={setDescription}
          onAnalyze={handleAnalyzeSkills}
        />

        {/* 技能选择器 */}
        {selectedSkills.length > 0 && (
          <SkillSelector
            selectedSkills={selectedSkills}
            allSkills={ALL_SKILLS.filter(s => !selectedSkills.find(ss => ss.tag === s))}
            onRemove={handleRemoveSkill}
            onAdd={handleAddSkill}
          />
        )}

        {/* 权重分配图表和滑块 */}
        {selectedSkills.length > 0 && (
          <WeightChart
            skills={selectedSkills}
            onUpdateWeight={handleUpdateWeight}
          />
        )}

        {/* 奖励设置 */}
        <div className="bg-white rounded-lg shadow p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            任务奖励
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="1000"
              max="50000"
              step="500"
              value={reward}
              onChange={(e) => setReward(Number(e.target.value))}
              className="flex-1"
            />
            <span className="text-lg font-semibold text-purple-600">
              {reward.toLocaleString()} 积分
            </span>
          </div>
        </div>

        {/* 发布按钮 */}
        <div className="flex gap-4">
          <button
            onClick={() => setShowPreview(true)}
            disabled={!description || selectedSkills.length === 0}
            className="flex-1 bg-purple-600 text-white py-3 px-6 rounded-lg font-medium
                     disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-purple-700
                     transition-colors"
          >
            预览任务
          </button>
        </div>
      </div>

      {/* 预览对话框 */}
      {showPreview && (
        <TaskPreview
          task={{
            title: description.slice(0, 50) + (description.length > 50 ? '...' : ''),
            description,
            skills: selectedSkills,
            reward,
          }}
          onConfirm={handlePublish}
          onCancel={() => setShowPreview(false)}
        />
      )}
    </div>
  );
}
