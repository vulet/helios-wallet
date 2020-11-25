import React from 'react';

const Button = (props) => {
  const { onClick, text } = props;
  return (
    <button
      type="button"
      className="hover:bg-blue-500 text-blue-700 hover:text-white py-2 px-4 border hover:border-transparent rounded"
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Button;
