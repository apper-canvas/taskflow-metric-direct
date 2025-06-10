import React from 'react';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const CategoryFilterItem = ({ category, isSelected, onClick, taskCount }) => {
    return (
        <Button
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                isSelected ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'
            }`}
        >
            {category.id === 'all' ? (
                <ApperIcon name="List" size={16} />
            ) : (
                <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: category.color }}
                />
            )}
            <span className="flex-1">{category.name}</span>
            <span className="text-sm opacity-75">{taskCount}</span>
        </Button>
    );
};

export default CategoryFilterItem;