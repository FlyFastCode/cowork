import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RefreshCcw, AlertTriangle } from 'lucide-react';

export function ResetDataButton() {
  const { resetData } = useApp();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleReset = () => {
    resetData();
    setShowConfirm(false);
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800
                 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <RefreshCcw className="w-4 h-4" />
        重置数据
      </button>

      {showConfirm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowConfirm(false)}
        >
          <div
            className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">确认重置数据？</h3>
            </div>

            <p className="text-gray-600 mb-6">
              此操作将清除所有自定义数据并恢复初始样例数据，确定继续吗？
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium
                         text-gray-700 hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleReset}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium
                         hover:bg-red-700 transition-colors"
              >
                确认重置
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
