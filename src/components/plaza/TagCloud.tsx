import type { SkillTag } from '../../types';

interface TagCloudProps {
  tags: SkillTag[];
  selectedTag: SkillTag | null;
  onSelect: (tag: SkillTag) => void;
  onClear: () => void;
}

export function TagCloud({ tags, selectedTag, onSelect, onClear }: TagCloudProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-gray-700">筛选技能标签</h3>
        {selectedTag && (
          <button
            onClick={onClear}
            className="text-sm text-purple-600 hover:text-purple-700 font-medium"
          >
            清除选择
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => onSelect(tag)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              selectedTag === tag
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
