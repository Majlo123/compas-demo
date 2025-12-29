import { ChevronDown, ChevronUp, CopyIcon } from 'lucide-react';
import React, { useState } from 'react';

import { Counter } from '@/components/controls/Counter';
import { Label } from '@/components/controls/Label';
import { StatusLabel } from '@/components/controls/StatusLabel';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';
import { ParLevel } from '@/types/parLevel.types';

export type GroupingType = 'no-grouping' | 'threshold' | 'commodity-group';

interface ParLevelsTableProps {
  parLevels: ParLevel[];
  grouping?: GroupingType;
  onThresholdChange?: (prodId: string, newValue: number) => void;
}

const ParLevelList: React.FC<{
  parLevels: ParLevel[];
  onThresholdChange?: (prodId: string, newValue: number) => void;
}> = ({ parLevels, onThresholdChange }) => (
  <Table>
    <TableHeader className="sticky top-0 bg-white z-10">
      <TableRow>
        <TableHead>PRODUCT</TableHead>
        <TableHead>COMMODITY GROUP</TableHead>
        <TableHead>STOCK QTY</TableHead>
        <TableHead>THRESHOLD</TableHead>
        <TableHead className="w-32">STATUS</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {parLevels.map((level) => (
        <TableRow key={level.product_id}>
          <TableCell className="font-medium">
            <div className="flex gap-2 flex-col">
              <p className="text-p2 m-0 font-bold">{level.product_name}</p>
              <div className="flex gap-1 items-center">
                <button className="p-0">
                  <CopyIcon size={12} />
                </button>
                <p className="text-p2 m-0">{level.product_id}</p>
              </div>
            </div>
          </TableCell>
          <TableCell>
            <Label category={level.comodity_group}>
              {level.comodity_group}
            </Label>
          </TableCell>
          <TableCell>{level.stockLevel}</TableCell>
          <TableCell>
            <Counter
              value={level.threshhold}
              onIncrement={() =>
                onThresholdChange &&
                onThresholdChange(
                  level.product_id,
                  Math.max(0, level.threshhold + 1)
                )
              }
              onDecrement={() =>
                onThresholdChange &&
                onThresholdChange(
                  level.product_id,
                  Math.max(0, level.threshhold - 1)
                )
              }
              onChange={
                onThresholdChange
                  ? (v): void =>
                    onThresholdChange(level.product_id, Math.max(0, v))
                  : undefined
              }
              min={0}
            />{' '}
          </TableCell>
          <TableCell>
            <StatusLabel status={level.status} />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

const GroupSection: React.FC<{
  title: string;
  count: number;
  children: React.ReactNode;
  defaultOpen?: boolean;
}> = ({ title, count, children, defaultOpen = false }): JSX.Element => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 w-full p-4 bg-gray-100 rounded-t-lg hover:bg-gray-200 transition-colors text-left"
      >
        <span className="font-bold text-lg">{title}</span>
        <span className="bg-black text-white rounded-full flex items-center justify-center text-sm font-bold min-w-[24px] h-6 px-1">
          {count}
        </span>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      {isOpen && (
        <div className="bg-white border border-gray-200 rounded-b-lg p-0 overflow-hidden">
          {children}
        </div>
      )}
    </div>
  );
};

export const ParLevelsTable: React.FC<ParLevelsTableProps> = ({
  parLevels,
  grouping = 'no-grouping',
  onThresholdChange,
}) => {
  if (grouping === 'threshold') {
    const withThreshold = parLevels.filter((l) => l.threshhold > 0);
    const noThreshold = parLevels.filter((l) => l.threshhold === 0);
    return (
      <div className="w-full h-full overflow-y-auto pb-4">
        <GroupSection
          title="With Threshold"
          count={withThreshold.length}
          defaultOpen
        >
          <ParLevelList
            parLevels={withThreshold}
            onThresholdChange={onThresholdChange}
          />
        </GroupSection>
        <GroupSection
          title="No Threshold"
          count={noThreshold.length}
          defaultOpen
        >
          <ParLevelList
            parLevels={noThreshold}
            onThresholdChange={onThresholdChange}
          />
        </GroupSection>
      </div>
    );
  }

  if (grouping === 'commodity-group') {
    const groups = parLevels.reduce(
      (acc, level) => {
        const group = level.comodity_group || 'Other';
        return {
          ...acc,
          [group]: [...(acc[group] || []), level],
        };
      },
      {} as Record<string, ParLevel[]>
    );

    return (
      <div className="w-full h-full overflow-y-auto pb-4">
        {Object.entries(groups).map(([groupName, levels]) => (
          <GroupSection
            key={groupName}
            title={groupName}
            count={levels.length}
            defaultOpen
          >
            <ParLevelList
              parLevels={levels}
              onThresholdChange={onThresholdChange}
            />
          </GroupSection>
        ))}
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <ParLevelList
        parLevels={parLevels}
        onThresholdChange={onThresholdChange}
      />
    </div>
  );
};
