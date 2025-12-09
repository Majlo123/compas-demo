import React from 'react';
import CustomDialog from './dialog-props';
import Button from '@/components/controls/button/Button';

export interface WidgetType {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  defaultSize: { w: number; h: number };
  minSize: { w: number; h: number };
}

interface DialogAddWidgetProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onAddWidget: (widgetType: WidgetType) => void;
  existingWidgets: string[];
  widgetTypes: WidgetType[];
}

const DialogAddWidget: React.FC<DialogAddWidgetProps> = ({
  isOpen,
  onOpenChange,
  onAddWidget,
  existingWidgets,
  widgetTypes,
}) => {
  return (
    <CustomDialog
      title="Add Widget"
      description="Choose a widget to add to your dashboard"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      classContent="w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col"
    >
      <div className="overflow-y-auto flex-1 -mx-lg -mb-lg px-lg pb-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {widgetTypes.map((widgetType) => {
            const alreadyAdded = existingWidgets.includes(widgetType.id);
            return (
              <div
                key={widgetType.id}
                className={`border rounded-lg p-4 transition-all ${
                  alreadyAdded
                    ? 'border-gray-200 bg-gray-50 opacity-60'
                    : 'border-gray-300 hover:border-primary hover:shadow-md cursor-pointer'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 p-3 bg-gray-50 rounded-lg">
                    {widgetType.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 mb-1">
                      {widgetType.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {widgetType.description}
                    </p>
                    <Button
                      onClick={() => {
                        if (!alreadyAdded) {
                          onAddWidget(widgetType);
                          onOpenChange(false);
                        }
                      }}
                      disabled={alreadyAdded}
                      variant={alreadyAdded ? 'secondary' : 'primary'}
                      size="sm"
                    >
                      {alreadyAdded ? 'Already Added' : 'Add Widget'}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </CustomDialog>
  );
};

export default DialogAddWidget;
