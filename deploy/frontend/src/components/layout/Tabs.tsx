import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

import classNameBuilder from '@/utils/classNameBuilder';

type Tab = {
  title: string;
  key: string;
};

type TabsProps = {
  className?: string;
  tabs: Tab[];
  baseURL: string;
  onTabChange?: (key: string) => Promise<void>;
};

const Tabs: FC<TabsProps> = ({ className, tabs, baseURL, onTabChange }) => {
  const navigate = useNavigate();
  const handleTabClick = async (key: string): Promise<void> => {
    if (window.location.pathname === `${baseURL}/${key}`) {
      return;
    }

    if (onTabChange) {
      await onTabChange(key);
    }
    navigate(`${baseURL}/${key}`);
  };
  return (
    <div className={classNameBuilder(className, 'tabs-wrapper')}>
      <div className={classNameBuilder('tabs', 'w-full h-full flex flex-col')}>
        <div
          className={classNameBuilder(
            'tabs-list',
            'flex flex-row h-[60px] justify-start items-end max-w-full overflow-x-auto scrollbar-hide'
          )}
        >
          {tabs.map((tab) => {
            const isActive =
              window.location.pathname === `${baseURL}/${tab.key}`;

            return (
              <button
                key={tab.key}
                onClick={() => {
                  handleTabClick(tab.key);
                }}
                className={classNameBuilder(
                  'tab',
                  'px-4 pb-2 mb-[2px] border-teal',
                  'hover:border-b-[2px] hover:mb-0',
                  isActive && 'border-b-[2px] !mb-0'
                )}
              >
                <span className="text-p2">{tab.title}</span>
              </button>
            );
          })}
        </div>
        <div
          className={classNameBuilder(
            'tabs-underline',
            'w-full h-[1px] bg-grey'
          )}
        />
      </div>
    </div>
  );
};

export default Tabs;
