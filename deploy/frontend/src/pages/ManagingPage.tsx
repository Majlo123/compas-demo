import { TopBar } from '@/components/top_bar/TopBar';
import { useState } from 'react';
import { WarningLevelsSidePanel } from '@/components/side_bar/WarningLevelsSidePanel';
import type { WarningLevel as SharedWarningLevel } from '@shared/types/warningLevel.types';

import { FiltersDialog } from '@/components/dialog/FiltersDialog';
import { ParLevelsTable } from '@/components/ParLevelsTable';
import { ParLevel } from '@/types/parLevel.types';
import { Pagination } from '@/components/controls/Pagination';
import { mockParLevels } from '@/mocks/parLevels';
import { commodityGroups } from '@shared/types/commodityGroups';


const WarningsPage = () => {
  const [selectedLevel, setSelectedLevel] = useState<SharedWarningLevel | null>(
    null
  );
  const [selectedGrouping, setSelectedGrouping] = useState<string | null>(null);
  const [paginatedData, setPaginatedData] = useState<ParLevel[]>(mockParLevels);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const handleApplyFilters = () => {
    setIsFiltersOpen(false);
    // TODO: integrate actual filtering once backend data is wired
  };

  const handleClearFilters = () => {
    setSelectedFilters([]);
  };

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
            onFilterClick={() => setIsFiltersOpen(true)}
          />
          <div className="flex flex-col max-h-screen overflow-y-auto">
            <div className="flex-1">
              <ParLevelsTable parLevels={paginatedData} />
            </div>
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
      <FiltersDialog
        open={isFiltersOpen}
        onOpenChange={setIsFiltersOpen}
        categories={commodityGroups}
        selectedFilters={selectedFilters}
        onFiltersChange={setSelectedFilters}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
      />
    </div>
  );
};

export default WarningsPage;
