import React from 'react';
import { Layout, Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import WidgetRenderer, { WidgetConfig, WidgetComponentProps } from './WidgetRenderer';

const ResponsiveGridLayout = WidthProvider(Responsive);

// Grid layout item interface
export interface GridLayoutItem extends Layout {
  widgetConfig: WidgetConfig;
}

// Widget registry type
type WidgetComponent = React.FC<WidgetComponentProps>;
export type WidgetRegistry = Record<string, WidgetComponent>;

// Props for DashboardGrid
interface DashboardGridProps {
  layouts: GridLayoutItem[];
  widgetRegistry: WidgetRegistry;
  onLayoutChange?: (newLayout: Layout[]) => void;
  onRemoveWidget?: (widgetId: string) => void;
  enableRemove?: boolean;
  enableDrag?: boolean;
  enableResize?: boolean;
  rowHeight?: number;
  breakpoints?: { lg: number; md: number; sm: number; xs: number; xxs: number };
  cols?: { lg: number; md: number; sm: number; xs: number; xxs: number };
}

/**
 * DashboardGrid - Manages grid layout and widget rendering
 * Receives widget configurations and places each widget in the grid
 */
const DashboardGrid: React.FC<DashboardGridProps> = ({
  layouts,
  widgetRegistry,
  onLayoutChange,
  onRemoveWidget,
  enableRemove = true,
  enableDrag = true,
  enableResize = true,
  rowHeight = 100,
  breakpoints = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 },
  cols = { lg: 6, md: 4, sm: 3, xs: 2, xxs: 1 },
}) => {
  const handleLayoutChange = (newLayout: Layout[]) => {
    if (onLayoutChange) {
      onLayoutChange(newLayout);
    }
  };

  const handleRemoveWidget = (widgetId: string) => {
    if (onRemoveWidget) {
      onRemoveWidget(widgetId);
    }
  };

  const handleWidgetError = (error: Error, config: WidgetConfig) => {
    console.error(`Error rendering widget ${config.id} (type: ${config.type}):`, error);
  };

  return (
    <div className="bg-gray-100 rounded-lg p-4 min-h-[500px]">
      <ResponsiveGridLayout
        className="layout"
        layouts={{ lg: layouts }}
        breakpoints={breakpoints}
        cols={cols}
        rowHeight={rowHeight}
        onLayoutChange={handleLayoutChange}
        draggableHandle={enableDrag ? '.widget-drag-handle' : undefined}
        isDraggable={enableDrag}
        isResizable={enableResize}
        resizeHandles={enableResize ? ['se'] : []}
      >
        {layouts.map((item) => (
          <div
            key={item.i}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden relative group"
          >
            {/* Remove Widget Button */}
            {enableRemove && onRemoveWidget && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleRemoveWidget(item.i);
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                className="absolute top-2 right-2 z-50 p-1 w-6 h-6 flex items-center justify-center rounded hover:bg-red-100 text-gray-500 hover:text-red-600 transition-colors"
                title="Remove widget"
                aria-label="Remove widget"
                style={{ pointerEvents: 'auto', cursor: 'pointer' }}
              >
                ✕
              </button>
            )}

            {/* Drag Handle */}
            {enableDrag && (
              <div className="widget-drag-handle bg-gray-50 px-3 py-2 border-b border-gray-200 cursor-move flex items-center">
                <svg
                  className="w-4 h-4 text-gray-400 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 8h16M4 16h16"
                  />
                </svg>
                <span className="text-xs text-gray-500 uppercase tracking-wider">
                  Drag to move
                </span>
              </div>
            )}

            {/* Widget Content */}
            <div className={`p-3 ${enableDrag ? 'h-[calc(100%-36px)]' : 'h-full'}`}>
              <WidgetRenderer
                config={item.widgetConfig}
                registry={widgetRegistry}
                onError={handleWidgetError}
              />
            </div>
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
};

export default DashboardGrid;
