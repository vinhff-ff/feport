import { LoadingOutlined } from '@ant-design/icons';
import './LoadingSpinner.scss';

type Props = {
  fullScreen?: boolean;
};

export const LoadingSpinner = ({ fullScreen }: Props) => {
  return (
    <div className={`loading-spinner ${fullScreen ? 'loading-spinner--fullscreen' : ''}`}>
      <LoadingOutlined className="loading-spinner__icon" spin />
    </div>
  );
};