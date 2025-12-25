import { TopBar } from '@/components/top_bar/TopBar';
import { WarningLevel } from '@shared/types/warningLevel.types';
import { useState } from 'react';

const WarningsPage = () => {
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [selectedGrouping, setSelectedGrouping] = useState<string | null>(null);
  const [managingLevel, setManagingLevel] = useState<WarningLevel | null>({
    name: 'Warning Level 1',
    description: 'Warning Level 1 description',
  });

  return (
    <div className="h-screen w-screen bg-surface px-8 py-4">
      <div className="flex w-full h-full rounded-[20px] shadow-xl overflow-hidden">
        {/* Side Navigation */}
        <aside className="w-96 bg-white border-r border-gray-200 flex flex-col shadow-sm">
          <div className="p-lg border-b border-gray-200 bg-gray-50">
            <h2 className="text-h1 text-secondary m-0">Par Level Managment</h2>
          </div>
          <nav className="flex-1 overflow-y-auto p-md">
            {/* Empty navigation - ready for future items */}
            <div className="flex items-center justify-center p-xl text-center">
              <p className="text-p2 text-disabled m-0">No items available</p>
            </div>
          </nav>
        </aside>

        {/* Main Panel */}
        <main className="flex-1 flex flex-col overflow-hidden gap-7 px-5 py-6 bg-white">
          <TopBar
            selectedGrouping={selectedGrouping}
            onSearch={(searchTerm) => console.log(searchTerm)}
            onGroupingChange={(grouping) => setSelectedGrouping(grouping)}
            managingLevel={managingLevel}
          />
          <div className="flex-1 p-xl overflow-y-auto">
            {/* Empty main content area */}
            <div className="flex items-center justify-center h-full min-h-[400px]">
              <p className="text-p1 text-disabled m-0">Select an item from the sidebar to view details</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default WarningsPage;
