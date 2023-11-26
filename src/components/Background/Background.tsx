import React from 'react';

const Background = () => {
  const backgroundStyle = {
    width: '100%',               // 宽度为100%
    height: '100vh',             // 高度为视窗的100%
    backgroundImage: 'url(/images/background.png)', // 使用图片路径
    backgroundSize: 'cover',     // 覆盖整个区域
    backgroundPosition: 'center', // 居中背景图片
    backgroundRepeat: 'no-repeat', // 不重复背景图片
    position: 'fixed',           // 固定定位
    top: 0,                      // 从顶部开始
    left: 0,                     // 从左侧开始
    zIndex: -1                   // 确保背景在内容之下
  };

  return <div style={backgroundStyle} />;
};

export default Background;
