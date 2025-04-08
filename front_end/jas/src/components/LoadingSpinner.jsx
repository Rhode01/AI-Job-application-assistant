import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useTheme } from '../context/ThemeContext';

const LoadingSpinner = ({
  tip = 'Loading...',
  fullScreen = false,
  size = 'large',
  delay = 0
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const antIcon = <LoadingOutlined style={{ fontSize: size === 'large' ? 40 : 24 }} spin />;

  const containerClass = fullScreen
    ? 'h-screen flex items-center justify-center'
    : 'flex items-center justify-center p-8';

  return (
    <div className={containerClass}>
      <Spin
        indicator={antIcon}
        tip={tip}
        size={size}
        delay={delay}
        className={isDark ? 'text-white' : ''}
      />
    </div>
  );
};

export default LoadingSpinner;
