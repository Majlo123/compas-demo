import React from 'react';
import { WarningLevel } from '@shared/types/warningLevel.types';
import { SearchInput } from '../controls/SearchInput';
import { GroupingDropdown, GroupingOption } from '../controls/GroupingDropdown';
import { Button } from '../controls/Button';

interface TopBarProps {
    selectedGrouping?: string;
    onSearch?: (searchTerm: string) => void;
    onGroupingChange?: (grouping: string) => void;
    managingLevel?: WarningLevel;
    onFilterClick?: () => void;
    filterCount?: number;
}

export const TopBar: React.FC<TopBarProps> = ({ selectedGrouping, onSearch, onGroupingChange, managingLevel, onFilterClick, filterCount }) => {

    const options: GroupingOption[] = [
        { id: 'no-grouping', label: 'No Grouping' },
        { id: 'threshold', label: 'Group by Threshold' },
        { id: 'commodity-group', label: 'Group by Commodity Group' },
    ];

    return (
        <div className="flex flex-col gap-4">
            {managingLevel ? <div className="flex gap-3 items-center">
                <h1 className="text-h3 text-secondary m-0 font-bold">Managing: {managingLevel?.name}</h1>
                <p className="text-p2 text-disabled m-0">{managingLevel?.description}</p>
            </div> :
                <div>
                    <p className="text-p2 text-disabled m-0">Select a warning level to manage</p>
                </div>
            }
            <div className="flex gap-10 items-center">
                <SearchInput placeholder="Search Products, Codes or Categories" onSearch={onSearch} />
                <div className="flex gap-5">
                    <GroupingDropdown
                        options={options}
                        selectedOptionId={selectedGrouping}
                        onSelect={(opt) => onGroupingChange(opt.id)}
                    />
                    <Button icon='filter' variant="secondary" onClick={onFilterClick} className="w-36 justify-start pl-7">
                        {typeof filterCount === 'number' ? `Filters (${filterCount})` : 'Filters'}
                    </Button>
                </div>
            </div>
        </div>
    );
};
