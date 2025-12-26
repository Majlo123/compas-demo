import { TopBar } from '@/components/top_bar/TopBar';
import { useState } from 'react';
import { WarningLevelsSidePanel } from '@/components/side_bar/WarningLevelsSidePanel';
import type { WarningLevel as SharedWarningLevel } from '@shared/types/warningLevel.types';

import { ParLevelsTable } from '@/components/ParLevelsTable';
import { ParLevel } from '@/types/parLevel.types';
import { Pagination } from '@/components/controls/Pagination';
import { mockParLevels } from '@/mocks/parLevels';


const WarningsPage = () => {
  const [selectedLevel, setSelectedLevel] = useState<SharedWarningLevel | null>(
    null
  );
  const [selectedGrouping, setSelectedGrouping] = useState<string | null>(null);
  const [paginatedData, setPaginatedData] = useState<ParLevel[]>(mockParLevels);

  return (
    <div className="flex h-screen bg-surface pt-6 px-12 pb-0 box-border">
      <div className="flex flex-1 bg-white rounded-t-3xl overflow-hidden shadow-xl-top">
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
          <div className="flex-1 overflow-y-auto flex flex-col justify-between">
            <ParLevelsTable parLevels={paginatedData} />
            <div className="py-4">
              <Pagination
                data={mockParLevels}
                itemsPerPage={50}
                onChange={setPaginatedData}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default WarningsPage;
