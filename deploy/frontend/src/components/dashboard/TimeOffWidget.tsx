import React, { useEffect, useState } from 'react';
import { getMyTimeOffSummary } from '@/api/widget/widget.actions';
import { isApiSuccess } from '@/api/shared.types';
import { TimeOffSummary } from '@/api/widget/widget.types';

const TimeOffWidget: React.FC = () => {
  const [summary, setSummary] = useState<TimeOffSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await getMyTimeOffSummary();
      if (isApiSuccess(res)) {
        setSummary(res.content);
      }
      setLoading(false);
    })();
  }, []);

  const maxDays = summary?.breakdown.reduce((max, b) => Math.max(max, b.days), 0) || 0;

  return (
    <div className="h-full flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">Time off this month</h3>
        {summary && <span className="text-xs text-gray-500">Current month</span>}
      </div>

      <div className="bg-primary/10 rounded-lg p-3 flex items-center gap-3">
        <div className="text-3xl font-bold text-primary">
          {loading ? '—' : summary?.totalDays ?? 0}
        </div>
        <div className="text-xs text-gray-600 leading-tight">
          Days taken<br />this month
        </div>
      </div>

      <div className="flex-1 border border-gray-100 rounded-lg p-3">
        <div className="text-xs font-semibold text-gray-600 mb-2">By leave type</div>
        {loading && <div className="text-xs text-gray-500">Loading…</div>}
        {!loading && summary && summary.breakdown.length === 0 && (
          <div className="text-xs text-gray-500">No approved leaves this month</div>
        )}
        {!loading && summary && summary.breakdown.length > 0 && (
          <div className="space-y-2">
            {summary.breakdown.map((item) => {
              const widthPct = maxDays === 0 ? 0 : Math.max((item.days / maxDays) * 100, 8);
              return (
                <div key={item.type}>
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span className="capitalize">{item.type.replace('_', ' ')}</span>
                    <span className="font-semibold text-gray-800">{item.days}d</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-2 bg-primary rounded-full"
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeOffWidget;
