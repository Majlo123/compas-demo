import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Layout, Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import PageLayout from '@/components/layout/PageLayout';
import { createWidget, deleteWidget, getMyWidgets, saveWidgetsLayout } from '@/api/widget/widget.actions';
import { isApiSuccess } from '@/api/shared.types';
import { Widget, WidgetLayoutItem } from '@/api/widget/widget.types';
import DialogAddWidget, { WidgetType } from '@/components/dialog/DialogAddWidget';
import Button from '@/components/controls/button/Button';
import { X } from 'lucide-react';
import TimeOffWidget from '@/components/dashboard/TimeOffWidget';
import HeatmapWidget from '@/components/dashboard/HeatmapWidget';
import PieChartWidget from '@/components/dashboard/PieChartWidget';
import UpcomingLeavesWidget from '@/components/dashboard/UpcomingLeavesWidget';
import TeamOverviewWidget from '@/components/dashboard/TeamOverviewWidget';
import { widgetTypes } from '@/components/dashboard/widgetTypes';

const ResponsiveGridLayout = WidthProvider(Responsive);

// --------------- Main Dashboard Component ----------------

const DashboardPage: React.FC = () => {
  const [layout, setLayout] = useState<Layout[]>([]);
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Map widget type strings to React components
  const widgetComponents: Record<string, React.FC> = {
    time_off: TimeOffWidget,
    piechart: PieChartWidget,
    heatmap: HeatmapWidget,
    upcoming: UpcomingLeavesWidget,
    team: TeamOverviewWidget,
  };

  // Quick lookup from widget id to widget object
  const widgetById = useMemo(() => {
    const map: Record<string, Widget> = {};
    (Array.isArray(widgets) ? widgets : []).forEach((w) => {
      if (w && w.id) map[w.id] = w;
    });
    return map;
  }, [widgets]);

  // Fetch widgets from DB on mount
  const loadWidgets = async () => {
    const res = await getMyWidgets();
    if (isApiSuccess(res)) {
      const raw = res.content as any;
      const data: Widget[] = Array.isArray(raw) ? raw : Array.isArray(raw?.data) ? raw.data : [];
      setWidgets(data);
      const mapped: Layout[] = data.map((w) => ({
        i: w.id,
        x: w.x,
        y: w.y,
        w: w.width,
        h: w.height,
        minW: 2,
        minH: 2,
      }));
      setLayout(mapped);
      lastLayoutSignature.current = JSON.stringify(mapped);
    }
  };

  useEffect(() => {
    loadWidgets();
  }, []);

  const lastLayoutSignature = useRef<string>('');

  // Update layout in state and persist to backend
  const handleLayoutChange = (newLayout: Layout[]) => {
    const signature = JSON.stringify(
      newLayout.map(({ i, x, y, w, h, minW, minH }) => ({ i, x, y, w, h, minW, minH }))
    );
    if (signature === lastLayoutSignature.current) return;
    lastLayoutSignature.current = signature;
    setLayout(newLayout);

    const payload: WidgetLayoutItem[] = newLayout.map((item) => ({
      id: item.i,
      x: item.x,
      y: item.y,
      width: item.w,
      height: item.h,
    }));
    if (payload.length > 0) {
      saveWidgetsLayout(payload);
    }
  };

  // Add new widget via backend and reload list
  const handleAddWidget = async (widgetType: WidgetType) => {
    // Calculate next free y
    const maxY = layout.length > 0 ? Math.max(...layout.map((item) => item.y + item.h)) : 0;

    const res = await createWidget({
      type: widgetType.id,
      x: 0,
      y: maxY,
      width: widgetType.defaultSize.w,
      height: widgetType.defaultSize.h,
    });

    if (isApiSuccess(res)) {
      await loadWidgets();
    } else if ('message' in res) {
      // Surface API errors (e.g., unique constraint)
      alert(res.message);
    }
  };

  // Remove widget via backend and reload list
  const handleRemoveWidget = async (widgetId: string) => {
    const res = await deleteWidget(widgetId);
    if (isApiSuccess(res)) {
      await loadWidgets();
    }
  };

  // Derive list of existing widget type ids for the dialog (to grey out already added)
  const existingWidgetTypes = widgets.map((w) => w.type);

  return (
    <PageLayout
      title="Dashboard"
      description="Drag widgets to rearrange"
      action={
        <Button onClick={() => setIsModalOpen(true)} className="text-lg font-medium">
          + Add Widget
        </Button>
      }
      actionPosition="inline"
      isLoading={false}
      hasError={false}
      isEmpty={false}
    >
      {/* Grid Layout */}
      <div className="bg-gray-100 rounded-lg p-4 min-h-[500px]">
        <ResponsiveGridLayout
          className="layout"
          layouts={{ lg: layout }}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 6, md: 4, sm: 3, xs: 2, xxs: 1 }}
          rowHeight={100}
          onLayoutChange={handleLayoutChange}
          draggableHandle=".widget-drag-handle"
          isResizable={true}
          resizeHandles={['se']}
        >
          {layout.map((item) => {
            const widget = widgetById[item.i];
            const WidgetComponent = widget ? widgetComponents[widget.type] : undefined;
            return (
              <div
                key={item.i}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              >
                <div className="widget-drag-handle bg-gray-50 px-3 py-2 border-b border-gray-200 cursor-move flex items-center justify-between">
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 text-gray-400 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                    </svg>
                    <span className="text-xs text-gray-500 uppercase tracking-wider">
                      {widget?.type.replace('_', ' ') || 'Widget'}
                    </span>
                  </div>
                  <button
                    onClick={() => handleRemoveWidget(item.i)}
                    className="p-1 rounded hover:bg-gray-200 text-gray-400 hover:text-red-500"
                    title="Remove widget"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-3 h-[calc(100%-36px)]">{WidgetComponent && <WidgetComponent />}</div>
              </div>
            );
          })}
        </ResponsiveGridLayout>
      </div>

      {/* Add Widget Dialog */}
      <DialogAddWidget
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        onAddWidget={handleAddWidget}
        existingWidgets={existingWidgetTypes}
        widgetTypes={widgetTypes}
      />
    </PageLayout>
  );
};

export default DashboardPage;

