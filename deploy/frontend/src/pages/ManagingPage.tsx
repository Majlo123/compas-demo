import { TopBar } from '@/components/top_bar/TopBar';
import { useState } from 'react';
import { WarningLevelsSidePanel } from '@/components/side_bar/WarningLevelsSidePanel';
import type { WarningLevel as SharedWarningLevel } from '@shared/types/warningLevel.types';

const WarningsPage = () => {
  const [selectedLevel, setSelectedLevel] = useState<SharedWarningLevel | null>(
    null
  );
  const [selectedGrouping, setSelectedGrouping] = useState<string | null>(null);

  return (
    <div className="flex h-screen bg-surface pt-6 px-12 pb-0 box-border">
      <div className="flex flex-1 bg-white rounded-t-3xl overflow-hidden shadow-xl">
        <WarningLevelsSidePanel
          className="h-full"
          selectedLevelId={selectedLevel?.id}
          onLevelSelect={(level) => setSelectedLevel(level)}
        />

        {/* Main Panel */}
        <main className="flex-1 flex flex-col overflow-hidden gap-7 px-5 py-6 bg-white">
          <TopBar
            selectedGrouping={selectedGrouping ?? undefined}
            onSearch={(searchTerm) => console.log(searchTerm)}
            onGroupingChange={(grouping) => setSelectedGrouping(grouping)}
            managingLevel={selectedLevel ?? undefined}
          />
          <div className="flex-1 p-xl overflow-y-auto">
            {selectedLevel ? (
              <div>
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
    </div>
  );
};

export default WarningsPage;
