import { useState } from 'react';
import { WarningLevelsSidePanel } from '@/components/WarningLevelsSidePanel';
import { WarningLevel } from '@/api/warningLevel.api';

const WarningsPage = () => {
  const [selectedLevel, setSelectedLevel] = useState<WarningLevel | null>(null);

  return (
    <div className="flex min-h-screen bg-surface">
      <WarningLevelsSidePanel
        selectedLevelId={selectedLevel?.id}
        onLevelSelect={setSelectedLevel}
      />

      {/* Main Panel */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="p-xl bg-white border-b border-gray-200 shadow-sm">
          <h1 className="text-h1 text-secondary m-0">
            {selectedLevel
              ? `Managing: ${selectedLevel.name}`
              : 'Select a Level'}
          </h1>
        </div>
        <div className="flex-1 p-xl overflow-y-auto">
          {selectedLevel ? (
            <div>
              {/* Content for the selected level will go here */}
              <p className="text-p1 text-secondary">
                Details for {selectedLevel.name}
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full min-h-[400px]">
              <p className="text-p1 text-disabled m-0">
                Select an item from the sidebar to view details
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default WarningsPage;
