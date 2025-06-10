import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const EmptyState = ({ title, description, iconName, actionButtonText, onActionClick, className = '' }) => {
    return (
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`text-center py-16 ${className}`}
        >
            <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
            >
                <ApperIcon name={iconName} className="w-20 h-20 text-gray-300 mx-auto" />
            </motion.div>
            <h3 className="mt-6 text-xl font-semibold text-gray-900">
                {title}
            </h3>
            <p className="mt-2 text-gray-500">
                {description}
            </p>
            {actionButtonText && onActionClick && (
                <Button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onActionClick}
                    className="mt-6 px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                    {actionButtonText}
                </Button>
            )}
        </motion.div>
    );
};

export default EmptyState;