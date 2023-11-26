import React from 'react';

const InputBox = ({ value, onChange, onKeyPress, onSend }) => {
  return (

// InputBox.tsx
<div className="fixed bottom-0 left-0 right-0 p-4 bg-white bg-opacity-75 backdrop-filter backdrop-blur-lg shadow-inner rounded-t-lg border-t-2 border-gray-200">
  <div className="flex items-center justify-between max-w-3xl mx-auto">
    <input
      type="text"
      className="flex-grow border-2 border-gray-300 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white bg-opacity-75"
      value={value}
      onChange={onChange}
      onKeyPress={onKeyPress}
      placeholder="请输入乳腺癌相关的问题"
    />
    <button
      className="ml-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full transition-colors"
      onClick={onSend}
    >
      发送
    </button>
  </div>
</div>

  );
};

export default InputBox;
