import React from 'react';
import './LoadingSpinner.scss';

const LoadingSpinner = () => {
  return (
    <div className="loading-overlay">
      <div className="spinner">
        <div className="spinner-circle"></div>
        <div className="spinner-text">טוען...</div>
      </div>
    </div>
  );
};

export default LoadingSpinner;