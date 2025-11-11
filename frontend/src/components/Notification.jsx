import React, { useEffect } from 'react';
import { FiX, FiCheckCircle, FiAlertCircle, FiInfo } from 'react-icons/fi';

const Notification = ({ message, type = 'info', onClose, duration = 5000 }) => {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const types = {
    success: {
      bg: 'bg-green-50 border-green-500',
      text: 'text-green-800',
      icon: <FiCheckCircle className="text-green-500 text-xl" />,
    },
    error: {
      bg: 'bg-red-50 border-red-500',
      text: 'text-red-800',
      icon: <FiAlertCircle className="text-red-500 text-xl" />,
    },
    info: {
      bg: 'bg-blue-50 border-blue-500',
      text: 'text-blue-800',
      icon: <FiInfo className="text-blue-500 text-xl" />,
    },
  };

  const config = types[type] || types.info;

  return (
    <div
      className={`${config.bg} ${config.text} border-l-4 p-4 rounded-lg shadow-lg mb-4 animate-slide-in flex items-start justify-between`}
    >
      <div className="flex items-start gap-3">
        {config.icon}
        <p className="font-medium">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="text-gray-500 hover:text-gray-700 transition-colors"
      >
        <FiX />
      </button>
    </div>
  );
};

export default Notification;
