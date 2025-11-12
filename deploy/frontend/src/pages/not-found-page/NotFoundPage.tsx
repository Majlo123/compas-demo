import { FC } from 'react';

const NotFoundPage: FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[80vh] text-center gap-4">
      <h1 className="text-6xl font-bold text-blue-400">404</h1>
      <h2 className="text-3xl font-semibold text-blue-300 mb-10">
        Page not found
      </h2>
    </div>
  );
};

export default NotFoundPage;
