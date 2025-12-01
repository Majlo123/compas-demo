import React from 'react';
import Button from '@/components/controls/button/Button';

type PageLayoutProps = {
  title: string;
  description?: string;
  action?: React.ReactNode;
  actionPosition?: 'inline' | 'below';
  isLoading: boolean;
  hasError: boolean;
  isEmpty: boolean;
  onRetry?: () => void;
  emptyMessage?: string;
  emptyDescription?: string;
  children: React.ReactNode;
};

const PageLayout: React.FC<PageLayoutProps> = ({
  title,
  description,
  action,
  actionPosition = 'inline',
  isLoading,
  hasError,
  isEmpty,
  onRetry,
  emptyMessage = 'No requests yet',
  emptyDescription,
  children,
}) => {
  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-h1 font-extrabold text-gray-800">{title}</h1>
          {action && actionPosition === 'inline' && <div>{action}</div>}
        </div>
        {description && (
          <div className="mt-2 text-gray-600">
            <p>{description}</p>
          </div>
        )}
        {action && actionPosition === 'below' && (
          <div className="mt-4">{action}</div>
        )}
      </div>

      {/* Content Area */}
      <div>
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : hasError ? (
          <div className="flex flex-col justify-center items-center py-12 text-center">
            <p className="text-gray-500 text-lg mb-4">Failed to load requests</p>
            {onRetry && (
              <Button onClick={onRetry} variant="primary" size="md">
                Try Again
              </Button>
            )}
          </div>
        ) : isEmpty ? (
          <div className="flex flex-col justify-center items-center py-12 text-center">
            <p className="text-gray-500 text-lg mb-2">{emptyMessage}</p>
            {emptyDescription && (
              <p className="text-gray-400 text-sm">{emptyDescription}</p>
            )}
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
};

export default PageLayout;
