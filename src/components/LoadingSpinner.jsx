import React from 'react';

function LoadingSpinner({ message = '스토리보드를 생성하는 중...' }) {
  return (
    <div className="loading-spinner">
      <div className="spinner"></div>
      <p>{message}</p>
    </div>
  );
}

export default LoadingSpinner;
