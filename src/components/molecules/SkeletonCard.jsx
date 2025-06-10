import React from 'react';
import { motion } from 'framer-motion';

const SkeletonCard = ({ className = '' }) => {
    return (
        <div className={`bg-white rounded-xl p-6 shadow-sm ${className}`}>
            <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
        </div>
    );
};

export default SkeletonCard;