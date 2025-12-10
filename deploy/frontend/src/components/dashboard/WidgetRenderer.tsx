import React from 'react';

// Widget configuration interface
export interface WidgetConfig {
  id: string;
  type: string;
  settings?: Record<string, any>;
  data?: Record<string, any>;
}

// Widget component props interface
export interface WidgetComponentProps {
  settings?: Record<string, any>;
  data?: Record<string, any>;
}

// Widget registry type
type WidgetComponent = React.FC<WidgetComponentProps>;
type WidgetRegistry = Record<string, WidgetComponent>;

// Props for WidgetRenderer
interface WidgetRendererProps {
  config: WidgetConfig;
  registry: WidgetRegistry;
  onError?: (error: Error, config: WidgetConfig) => void;
}

// Fallback component for unknown widget types
const UnknownWidgetFallback: React.FC<{ type: string }> = ({ type }) => (
  <div className="h-full flex flex-col items-center justify-center text-gray-500 p-4">
    <div className="text-4xl mb-2">⚠️</div>
    <p className="font-semibold">Unknown Widget Type</p>
    <p className="text-sm text-gray-400 mt-1">Type: {type}</p>
  </div>
);

// Error boundary fallback component
const ErrorWidgetFallback: React.FC<{ error: string; type: string }> = ({ error, type }) => (
  <div className="h-full flex flex-col items-center justify-center text-red-500 p-4">
    <div className="text-4xl mb-2">❌</div>
    <p className="font-semibold">Widget Error</p>
    <p className="text-sm text-gray-600 mt-1">Type: {type}</p>
    <p className="text-xs text-gray-400 mt-2 text-center">{error}</p>
  </div>
);

/**
 * WidgetRenderer - Generic component that resolves and renders widgets
 * based on their configuration
 */
const WidgetRenderer: React.FC<WidgetRendererProps> = ({ config, registry, onError }) => {
  const { type, settings, data } = config;

  // Resolve widget component from registry
  const WidgetComponent = registry[type];

  // Handle unknown widget type
  if (!WidgetComponent) {
    return <UnknownWidgetFallback type={type} />;
  }

  // Render widget with error boundary
  try {
    return <WidgetComponent settings={settings} data={data} />;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    // Call error handler if provided
    if (onError) {
      onError(error as Error, config);
    }

    return <ErrorWidgetFallback error={errorMessage} type={type} />;
  }
};

export default WidgetRenderer;
