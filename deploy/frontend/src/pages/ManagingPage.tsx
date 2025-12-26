import { TopBar } from '@/components/top_bar/TopBar';
import { WarningLevel } from '@shared/types/warningLevel.types';
import { useState } from 'react';

import { ParLevelsTable } from '@/components/ParLevelsTable';
import { ParLevel } from '@/types/parLevel.types';
import { Pagination } from '@/components/controls/Pagination';
export const mockParLevels: ParLevel[] = [
  {
    product_name: 'Coca Cola 330ml',
    product_id: 1001,
    comodity_group: 'COLD BEVERAGES',
    stockLevel: 150,
    threshhold: 200,
    status: 'TRIGGERED',
  },
  {
    product_name: 'Still Water 500ml',
    product_id: 1002,
    comodity_group: 'COLD BEVERAGES',
    stockLevel: 300,
    threshhold: 100,
    status: 'OK',
  },
  {
    product_name: 'Croissant Plain',
    product_id: 2001,
    comodity_group: 'BREAD PRODUCTS',
    stockLevel: 15,
    threshhold: 50,
    status: 'TRIGGERED',
  },
  {
    product_name: 'Chocolate Muffin',
    product_id: 2002,
    comodity_group: 'CONFECTIONERY',
    stockLevel: 45,
    threshhold: 40,
    status: 'OK',
  },
  {
    product_name: 'Lays Salted',
    product_id: 3001,
    comodity_group: 'CRISPS AND SNACKS',
    stockLevel: 80,
    threshhold: 100,
    status: 'TRIGGERED',
  },
  {
    product_name: 'KitKat Chunky',
    product_id: 3002,
    comodity_group: 'SWEET PRODUCTS',
    stockLevel: 120,
    threshhold: 60,
    status: 'OK',
  },
  {
    product_name: 'Orange Juice 250ml',
    product_id: 1003,
    comodity_group: 'COLD BEVERAGES',
    stockLevel: 10,
    threshhold: 30,
    status: 'TRIGGERED',
  },
  {
    product_name: 'Sandwich Ham & Cheese',
    product_id: 4001,
    comodity_group: 'SANDWICHES',
    stockLevel: 5,
    threshhold: 20,
    status: 'TRIGGERED',
  },
  {
    product_name: 'Espresso Beans 1kg',
    product_id: 5001,
    comodity_group: 'HOT BEVERAGES',
    stockLevel: 5,
    threshhold: 2,
    status: 'OK',
  },
  {
    product_name: 'Sugar Sticks',
    product_id: 5002,
    comodity_group: 'HOT BEVERAGES',
    stockLevel: 400,
    threshhold: 500,
    status: 'TRIGGERED',
  },
];

const WarningsPage = () => {
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [selectedGrouping, setSelectedGrouping] = useState<string | null>(null);
  const [managingLevel, setManagingLevel] = useState<WarningLevel | null>({
    name: 'Warning Level 1',
    description: 'Warning Level 1 description',
  });
  const [paginatedData, setPaginatedData] = useState<ParLevel[]>(mockParLevels);

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
          <div className="flex-1 overflow-y-auto flex flex-col">
            <div className="flex-1">
              <ParLevelsTable parLevels={paginatedData} />
            </div>
            <div className="py-4">
              <Pagination
                data={mockParLevels}
                itemsPerPage={5}
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
