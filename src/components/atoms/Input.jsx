import React from 'react';

const Input = ({ className = '', ...props }) => {
    return (
        <input
            className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none ${className}`}
            {...props}
        />
    );
};

export default Input;