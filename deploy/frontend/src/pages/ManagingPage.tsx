import { TopBar } from '@/components/top_bar/TopBar';
import { useState, useEffect } from 'react';
import { WarningLevelsSidePanel } from '@/components/side_bar/WarningLevelsSidePanel';
import type { WarningLevel as SharedWarningLevel } from '@shared/types/warningLevel.types';

import { FiltersDialog } from '@/components/dialog/FiltersDialog';
import { ParLevelsTable } from '@/components/ParLevelsTable';
import { ParLevel } from '@/types/parLevel.types';
import { Pagination } from '@/components/controls/Pagination';
import { parLevelApi } from '@/api/parLevel.api';
import { commodityGroups } from '@shared/types/commodityGroups';


const WarningsPage = () => {
  const [selectedLevel, setSelectedLevel] = useState<SharedWarningLevel | null>(
    null
  );
  const [selectedGrouping, setSelectedGrouping] = useState<string | null>(null);
  const [paginatedData, setPaginatedData] = useState<ParLevel[]>([]);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [allParLevels, setAllParLevels] = useState<ParLevel[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch PAR levels from backend API
  useEffect(() => {
    const fetchParLevels = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await parLevelApi.getAll();
        setAllParLevels(data);
        setPaginatedData(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch PAR levels';
        setError(errorMessage);
        console.error('Error fetching PAR levels:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchParLevels();
  }, []);

  const handleApplyFilters = () => {
    setIsFiltersOpen(false);
    // Filter the data based on selected filters
    if (selectedFilters.length > 0) {
      const filtered = allParLevels.filter(
        item => item.comodity_group && selectedFilters.includes(item.comodity_group)
      );
      setPaginatedData(filtered);
    } else {
      setPaginatedData(allParLevels);
    }
  };

  const handleClearFilters = () => {
    setSelectedFilters([]);
    setPaginatedData(allParLevels);
  };

  if (error) {
    return (
      <div className="flex h-screen bg-surface pt-6 px-12 pb-0 box-border">
        <div className="flex flex-1 bg-white rounded-t-3xl overflow-hidden shadow-xl-top items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 font-semibold">Error loading PAR levels</p>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

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
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">Loading PAR levels...</p>
                </div>
              ) : (
                <ParLevelsTable parLevels={paginatedData} />
              )}
            </div>
            <div className="py-4">
              <Pagination
                data={allParLevels}
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
