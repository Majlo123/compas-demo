import { useState, useEffect } from 'react';

import {
  warningLevelApi,
  type WarningLevel,
  type WarningLevelWithCount,
} from '@/api/warningLevel.api';
import { CreateWarningLevelDialog } from '@/components/dialog/CreateWarningLevelDialog';

interface WarningLevelsSidePanelProps {
  onLevelSelect?: (level: WarningLevel) => void;
  selectedLevelId?: string | null;
  className?: string;
}

export const WarningLevelsSidePanel = ({
  selectedLevelId,
  onLevelSelect,
  className = '',
}: WarningLevelsSidePanelProps): JSX.Element => {
  const [warningLevels, setWarningLevels] = useState<WarningLevelWithCount[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWarningLevels = async (): Promise<void> => {
      try {
        setIsLoading(true);
        setError(null);
        const levels = await warningLevelApi.getAll();
        setWarningLevels(levels);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to fetch warning levels'
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchWarningLevels();
  }, []);

  const handleLevelSelect = (level: WarningLevelWithCount): void => {
    onLevelSelect?.(level);
  };

  const handleCreateSuccess = async (newLevel: WarningLevel): Promise<void> => {
    const levels = await warningLevelApi.getAll();
    setWarningLevels(levels);
    onLevelSelect?.(newLevel);
  };

  // Extract level number from name (e.g., "Level 5" -> 5)
  const extractLevelNumber = (name: string): string => {
    const match = name.match(/\d+/);
    return match ? match[0] : name;
  };

  return (
    <aside className={`w-96 bg-surface flex flex-col ${className}`}>
      <div className="pl-3 pr-4 pt-6 pb-6">
        <h3 className="text-h3 text-secondary m-0 mb-3 font-bold">
          PAR Level Management
        </h3>
        <p className="text-p2 text-indicator font-medium m-0 leading-relaxed">
          Create or select a warning level to configure automated stock level
          alerts
        </p>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <p className="text-p2 text-disabled">Loading warning levels...</p>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center py-8">
            <p className="text-p2 text-red-500">{error}</p>
          </div>
        )}

        {!isLoading && !error && warningLevels.length === 0 && (
          <div className="flex items-center justify-center py-8">
            <p className="text-p2 text-disabled">No warning levels available</p>
          </div>
        )}

        {!isLoading &&
          !error &&
          warningLevels.map((level) => (
            <button
              key={level.id}
              onClick={() => handleLevelSelect(level)}
              className={`w-full text-left pr-2 rounded-lg transition-all flex items-start gap-3 mb-md last:mb-0 ${
                selectedLevelId === level.id
                  ? 'pl-3 py-4 bg-secondary text-white shadow-md'
                  : 'pl-0 py-2 text-secondary hover:bg-gray-100'
              }`}
            >
              {/* Indicator Dot */}
              <div className="flex-shrink-0 mt-1">
                <div className="w-4 h-4 rounded-full bg-warning" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col">
                  <span
                    className={`text-h4 font-bold leading-tight ${
                      selectedLevelId === level.id
                        ? 'text-white'
                        : 'text-secondary'
                    }`}
                  >
                    {level.name}
                  </span>

                  <span
                    className={`text-sm mt-0.5 ${
                      selectedLevelId === level.id
                        ? 'text-gray-300'
                        : 'text-secondary'
                    }`}
                  >
                    Level {extractLevelNumber(level.name)}
                  </span>

                  <div
                    className={`flex items-center gap-2 mt-1 font-bold ${
                      selectedLevelId === level.id
                        ? 'text-white'
                        : 'text-secondary'
                    }`}
                  >
                    <span>0%</span>
                    <span className="font-normal">|</span>
                    <span>{level.productCount} Products</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
      </nav>

      {/* Create Warning Level Button */}
      <div className="p-3 pt-0">
        <CreateWarningLevelDialog onSuccess={handleCreateSuccess} />
      </div>
    </aside>
  );
};
