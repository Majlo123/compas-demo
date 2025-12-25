import { useState } from 'react';
import { WarningLevelsSidePanel } from '@/components/WarningLevelsSidePanel';
import { WarningLevel } from '@/api/warningLevel.api';

const ManagingPage = () => {
  const [selectedLevel, setSelectedLevel] = useState<WarningLevel | null>(null);

  const handleLevelSelect = (level: WarningLevel) => {
    setSelectedLevel(level);
  };

  return (
    <div className="flex min-h-screen bg-surface">
      {/* Side Panel Component */}
      <WarningLevelsSidePanel
        selectedLevelId={selectedLevel?.id ?? null}
        onLevelSelect={handleLevelSelect}
      />

      {/* Main Panel */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="p-xl bg-white border-b border-gray-200 shadow-sm">
          <h1 className="text-h1 text-secondary m-0">
            {selectedLevel ? `Managing: ${selectedLevel.name}` : 'Managing: Level'}
          </h1>
        </div>
        <div className="flex-1 p-xl overflow-y-auto">
          {/* Empty main content area */}
          <div className="flex items-center justify-center h-full min-h-[400px]">
            <p className="text-p1 text-disabled m-0">
              {selectedLevel
                ? `${selectedLevel.name} selected`
                : 'Select a warning level from the sidebar to view details'}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ManagingPage;
