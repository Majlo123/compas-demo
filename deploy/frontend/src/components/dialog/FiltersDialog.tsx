import type { CommodityGroup } from '@/types/commodityGroups';

import { Button } from '@/components/controls/Button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/controls/Dialog';
import {
  ToggleGroup,
  ToggleGroupItem,
} from '@/components/controls/ToggleGroup';

export type FiltersDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: ReadonlyArray<CommodityGroup>;
  selectedFilters: ReadonlyArray<CommodityGroup>;
  onFiltersChange: (next: CommodityGroup[]) => void;
  onApply: () => void;
  onClear: () => void;
};

export const FiltersDialog = ({
  open,
  onOpenChange,
  categories,
  selectedFilters,
  onFiltersChange,
  onApply,
  onClear,
}: FiltersDialogProps): JSX.Element => {
  const handleValueChange = (value: string[] | string): void => {
    let raw: string[];
    if (Array.isArray(value)) {
      raw = value;
    } else {
      raw = value ? [value] : [];
    }
    const next = raw.filter((v): v is CommodityGroup =>
      categories.includes(v as CommodityGroup)
    );
    onFiltersChange(next);
  };

  const handleApply = (): void => {
    onApply();
    onOpenChange(false);
  };

  const handleClear = (): void => {
    onFiltersChange([]);
    onClear();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[315px] p-0 rounded-2xl border-none overflow-hidden shadow-xl">
        <DialogHeader className="px-5 py-4">
          <DialogTitle className="text-base font-bold text-black">
            Filter Products
          </DialogTitle>
        </DialogHeader>

        <div className="px-5 py-4 flex flex-col gap-4 bg-white">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-gray-800">
              Commodity Groups
            </span>
            <ToggleGroup
              type="multiple"
              variant="outline"
              className="flex flex-wrap justify-start gap-2 max-w-md"
              value={Array.from(selectedFilters)}
              onValueChange={handleValueChange}
            >
              {categories.map((category) => (
                <ToggleGroupItem
                  key={category}
                  value={category}
                  aria-label={`Toggle ${category}`}
                >
                  {category}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <Button
              variant="black"
              className="w-full h-8 rounded-full"
              onClick={handleApply}
            >
              Show All Products
            </Button>
            <Button
              variant="secondary"
              className="w-full h-8 rounded-full border-black text-black"
              onClick={handleClear}
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
