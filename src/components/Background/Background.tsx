import React from 'react';

const Background = () => {
  const backgroundStyle: React.CSSProperties = {
    width: '100%',
    height: '100vh',
    backgroundImage: 'url(/images/background.png)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    position: 'fixed', // 确保使用明确的字符串类型
    top: 0,
    left: 0,
    zIndex: -1
  };

  return <div style={backgroundStyle} />;
};

export default Background;
