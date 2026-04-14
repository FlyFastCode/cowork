import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import type { SkillTag } from '../../types';

interface WeightChartProps {
  skills: { tag: SkillTag; weight: number }[];
  onUpdateWeight: (tag: SkillTag, weight: number) => void;
}

const COLORS = ['#9333ea', '#7c3aed', '#6d28d9', '#5b21b6', '#4c1d95', '#3b0764'];

export function WeightChart({ skills, onUpdateWeight }: WeightChartProps) {
  const totalWeight = skills.reduce((sum, s) => sum + s.weight, 0);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-sm font-medium text-gray-700 mb-4">
        技能权重分配 {totalWeight !== 100 && (
          <span className="text-red-500">（当前总和：{totalWeight}%，需要调整为 100%）</span>
        )}
      </h3>

      <div className="grid grid-cols-2 gap-6">
        {/* 饼图 */}
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={skills}
                dataKey="weight"
                nameKey="tag"
                cx="50%"
                cy="50%"
                outerRadius={60}
                label={false}
                labelLine={false}
              >
                {skills.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 滑块调整 */}
        <div className="space-y-3">
          {skills.map(({ tag, weight }, index) => (
            <div key={tag} className="flex items-center gap-3">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-sm font-medium text-gray-700 w-24">{tag}</span>
              <input
                type="range"
                min="0"
                max="100"
                value={weight}
                onChange={(e) => onUpdateWeight(tag, Number(e.target.value))}
                className="flex-1"
              />
              <span className="text-sm font-medium text-gray-900 w-12 text-right">
                {weight}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
