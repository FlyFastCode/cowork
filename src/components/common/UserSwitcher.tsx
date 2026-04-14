import { useState, useRef, useEffect } from 'react';
import { useUsers } from '../../hooks/useData';
import { ChevronsUpDown, Check } from 'lucide-react';

export function UserSwitcher() {
  const { users, currentUser, setCurrentUser, getUserById } = useUsers();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!currentUser) return null;

  const handleSwitch = (userId: string) => {
    const user = getUserById(userId);
    if (user) {
      setCurrentUser(user);
    }
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
      >
        <img
          src={currentUser.avatar}
          alt={currentUser.name}
          className="w-6 h-6 rounded-full bg-gray-100"
        />
        <span className="text-gray-700 font-medium">{currentUser.name}</span>
        <ChevronsUpDown className="w-4 h-4 text-gray-400" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl border border-gray-200 shadow-lg z-50 max-h-80 overflow-y-auto">
          <div className="p-2 border-b border-gray-100">
            <p className="text-xs text-gray-400 px-2 py-1">切换演示用户</p>
          </div>
          <div className="p-1">
            {users.map(user => (
              <button
                key={user.id}
                onClick={() => handleSwitch(user.id)}
                className={`w-full flex items-center gap-2 px-2 py-2 rounded-lg text-sm transition-colors ${
                  user.id === currentUser.id
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-7 h-7 rounded-full bg-gray-100 flex-shrink-0"
                />
                <span className="flex-1 text-left truncate">{user.name}</span>
                {user.id === currentUser.id && (
                  <Check className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
