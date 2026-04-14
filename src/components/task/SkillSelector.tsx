import { X, Plus } from 'lucide-react';
import type { SkillTag } from '../../types';

interface SkillSelectorProps {
  selectedSkills: { tag: SkillTag; weight: number }[];
  allSkills: SkillTag[];
  onRemove: (tag: SkillTag) => void;
  onAdd: (tag: SkillTag) => void;
}

export function SkillSelector({ selectedSkills, allSkills, onRemove, onAdd }: SkillSelectorProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-sm font-medium text-gray-700 mb-4">已选技能标签</h3>

      {/* 已选技能 */}
      <div className="flex flex-wrap gap-2 mb-4">
        {selectedSkills.map(({ tag, weight }) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-100 text-purple-700
                     rounded-full text-sm font-medium"
          >
            {tag} ({weight}%)
            <button
              onClick={() => onRemove(tag)}
              className="hover:bg-purple-200 rounded-full p-0.5 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </span>
        ))}
      </div>

      {/* 添加技能 */}
      {allSkills.length > 0 && (
        <>
          <h3 className="text-sm font-medium text-gray-700 mb-2">添加更多技能</h3>
          <div className="flex flex-wrap gap-2">
            {allSkills.map((skill) => (
              <button
                key={skill}
                onClick={() => onAdd(skill)}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700
                         rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                {skill}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
