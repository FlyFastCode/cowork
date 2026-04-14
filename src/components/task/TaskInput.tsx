import { Edit2, Sparkles } from 'lucide-react';

interface TaskInputProps {
  description: string;
  onChange: (value: string) => void;
  onAnalyze: () => void;
}

export function TaskInput({ description, onChange, onAnalyze }: TaskInputProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-gray-700">
          任务描述
        </label>
        <span className="text-xs text-gray-500">
          用自然语言描述你的任务，系统会自动分析所需技能
        </span>
      </div>

      <div className="relative">
        <textarea
          value={description}
          onChange={(e) => onChange(e.target.value)}
          placeholder="例如：我想开发一个能自动抓取推特信息并自动配音生成短视频的小说推文程序..."
          rows={6}
          className="w-full border border-gray-300 rounded-lg p-4 pr-12 focus:ring-2
                   focus:ring-purple-500 focus:border-transparent resize-none"
        />
        <Edit2 className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
      </div>

      <button
        onClick={onAnalyze}
        disabled={!description.trim()}
        className="mt-3 flex items-center gap-2 text-purple-600 hover:text-purple-700
                 disabled:text-gray-400 disabled:cursor-not-allowed font-medium
                 transition-colors"
      >
        <Sparkles className="w-4 h-4" />
        智能分析技能标签
      </button>
    </div>
  );
}
