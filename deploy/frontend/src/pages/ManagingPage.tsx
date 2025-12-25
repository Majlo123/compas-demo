import { TopBar } from '@/components/top_bar/TopBar';
import { useState } from 'react';
import { WarningLevelsSidePanel } from '@/components/WarningLevelsSidePanel';
import type { WarningLevel as SharedWarningLevel } from '@shared/types/warningLevel.types';
import type { WarningLevel as ApiWarningLevel } from '@/api/warningLevel.api';

const WarningsPage = () => {
  const [selectedLevel, setSelectedLevel] = useState<SharedWarningLevel | null>(
    null
  );
  const [selectedGrouping, setSelectedGrouping] = useState<string | null>(null);

  return (
    <div className="flex min-h-screen bg-surface">
      <WarningLevelsSidePanel
        selectedLevelId={selectedLevel?.id}
        onLevelSelect={(level: ApiWarningLevel) =>
          setSelectedLevel({
            id: level.id,
            name: level.name,
            description: level.description ?? null,
          })
        }
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
  );
};

export default WarningsPage;
