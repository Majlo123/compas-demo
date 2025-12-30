import type { WarningLevel as SharedWarningLevel } from '@shared/types/warningLevel.types';
import { useState, useEffect, useRef, useMemo } from 'react';

import { parLevelApi } from '@/api/parLevel.api';
import { warningLevelApi } from '@/api/warningLevel.api';
import { Pagination } from '@/components/controls/Pagination';
import { FiltersDialog } from '@/components/dialog/FiltersDialog';
import { ParLevelsTable, GroupingType } from '@/components/ParLevelsTable';
import { WarningLevelsSidePanel } from '@/components/side_bar/WarningLevelsSidePanel';
import { TopBar } from '@/components/top_bar/TopBar';
import { type CommodityGroup, commodityGroups } from '@/types/commodityGroups';
import { ParLevel } from '@/types/parLevel.types';

const WarningsPage = (): JSX.Element => {
  const [selectedLevel, setSelectedLevel] = useState<SharedWarningLevel | null>(
    null
  );
  const [selectedGrouping, setSelectedGrouping] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<CommodityGroup[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [allParLevels, setAllParLevels] = useState<ParLevel[]>([]);
  const [error, setError] = useState<string | null>(null);
  const searchDebounceTimer = useRef<NodeJS.Timeout | null>(null);
  const updateTimersRef = useRef<Record<string, NodeJS.Timeout>>({});

  const itemsPerPage = 50;
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return allParLevels.slice(startIndex, endIndex);
  }, [allParLevels, currentPage, itemsPerPage]);

  useEffect(() => {
    warningLevelApi.getAll().then((levels) => {
      setSelectedLevel(levels[0]);
    });
  }, []);

  // Fetch PAR levels from backend API (supports selected warning level)
  useEffect(() => {
    const fetchParLevels = async (): Promise<void> => {
      try {
        setIsLoading(true);
        setError(null);

        // Always fetch detailed rows through getAll, applying current filters/search
        const [detailed] = await Promise.all([
          parLevelApi.getAll(
            selectedFilters.length > 0 ? selectedFilters : undefined,
            searchTerm.trim() ? searchTerm.trim() : undefined,
            selectedLevel?.id
          ),
        ]);

        setAllParLevels(detailed);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to fetch PAR levels';
        setError(errorMessage);
        // eslint-disable-next-line no-console
        console.error('Error fetching PAR levels:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchParLevels();
  }, [selectedFilters, searchTerm, selectedLevel?.id]);

  const handleSearch = (term: string): void => {
    // Debounce the search; only update state after delay
    if (searchDebounceTimer.current) {
      clearTimeout(searchDebounceTimer.current);
    }
    searchDebounceTimer.current = setTimeout(() => {
      setSearchTerm(term.trim());
    }, 300);
  };

  // Clear pending debounce on unmount
  useEffect(() => {
    return (): void => {
      if (searchDebounceTimer.current) {
        clearTimeout(searchDebounceTimer.current);
      }
    };
  }, []);

  const applyLocalParLevelChange = (
    prodId: string,
    newThreshold: number
  ): void => {
    setAllParLevels((prev) =>
      prev.map((p) =>
        p.product_id === prodId
          ? {
              ...p,
              threshhold: newThreshold,
              status: p.stockLevel < newThreshold ? 'TRIGGERED' : 'OK',
            }
          : p
      )
    );
  };

  const persistParLevelDebounced = (
    prodId: string,
    newThreshold: number,
    warningLevelId: string
  ): void => {
    const existingTimer = updateTimersRef.current[prodId];
    if (existingTimer) clearTimeout(existingTimer);

    updateTimersRef.current[prodId] = setTimeout(async (): Promise<void> => {
      try {
        const updated = await parLevelApi.updateThreshold(
          prodId,
          newThreshold,
          warningLevelId
        );
        if (!updated && warningLevelId) {
          // If not found, try create (upsert behavior)
          await parLevelApi.create(prodId, newThreshold, warningLevelId);
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to persist PAR level', err);
        // Optionally: refetch or show toast; for now, leave optimistic value
      } finally {
        delete updateTimersRef.current[prodId];
      }
    }, 500); // debounce rapid clicks
  };

  const handleThresholdChange = (prodId: string, newValue: number): void => {
    const selectedLevelId = selectedLevel?.id;
    const clamped = Math.max(0, Math.round(newValue));
    applyLocalParLevelChange(prodId, clamped);
    persistParLevelDebounced(prodId, clamped, selectedLevelId);
  };

  const handleApplyFilters = (): void => {
    setIsFiltersOpen(false);
    // Filters are automatically applied through useEffect dependency
  };

  const handleClearFilters = (): void => {
    setSelectedFilters([]);
  };

  if (error) {
    return (
      <div className="flex h-screen bg-surface pt-6 px-12 pb-0 box-border">
        <div className="flex flex-1 bg-white rounded-t-3xl overflow-hidden shadow-xl-top items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 font-semibold">
              Error loading PAR levels
            </p>
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
            onSearch={handleSearch}
            onGroupingChange={(grouping) => setSelectedGrouping(grouping)}
            managingLevel={selectedLevel ?? undefined}
            filterCount={
              selectedFilters.length > 0 || searchTerm.trim().length > 0
                ? allParLevels.length
                : undefined
            }
            onFilterClick={() => setIsFiltersOpen(true)}
          />
          <div className="flex flex-col max-h-screen overflow-y-auto">
            <div className="flex-1">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">Loading PAR levels...</p>
                </div>
              ) : (
                <ParLevelsTable
                  parLevels={
                    selectedGrouping && selectedGrouping !== 'no-grouping'
                      ? allParLevels
                      : paginatedData
                  }
                  grouping={selectedGrouping as GroupingType}
                  onThresholdChange={handleThresholdChange}
                />
              )}
            </div>
            {(!selectedGrouping || selectedGrouping === 'no-grouping') && (
              <div className="py-4">
                <Pagination
                  totalPages={Math.ceil(allParLevels.length / itemsPerPage)}
                  onChange={setCurrentPage}
                />
              </div>
            )}
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
