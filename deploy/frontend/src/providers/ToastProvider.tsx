import { ToastIcon } from 'node_modules/react-toastify/dist/types';
import { IconProps, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CustomIcon: ToastIcon = ({ isLoading, type }: IconProps) => {
  if (isLoading) return null;

  switch (type) {
    case 'success':
      return <span className="stroke-white">✓</span>;
    case 'error':
      return <span className="stroke-white">✕</span>;
    default:
      return null;
  }
};

export const ToastProvider = (): JSX.Element => {
  return (
    <ToastContainer
      icon={CustomIcon}
      position="bottom-right"
      autoClose={4000}
      closeButton={false}
      hideProgressBar
      newestOnTop
      closeOnClick
      draggable
      pauseOnHover
      theme="colored"
    />
  );
};
