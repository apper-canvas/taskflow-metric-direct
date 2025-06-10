import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Input from '@/components/atoms/Input';
import FormField from '@/components/molecules/FormField';
import CategoryFilterItem from '@/components/molecules/CategoryFilterItem';

const TaskSidebar = ({
    searchQuery,
    onSearchChange,
    priorityFilter,
    onPriorityFilterChange,
    categories,
    selectedCategory,
    onCategorySelect,
    allTasksCount,
    getCategoryTaskCount,
}) => {
    const priorityOptions = [
        { value: 'all', label: 'All Priorities' },
        { value: 'high', label: 'High Priority' },
        { value: 'medium', label: 'Medium Priority' },
        { value: 'low', label: 'Low Priority' },
    ];

    return (
        <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
            <div className="p-6">
                {/* Search and Filters */}
                <div className="space-y-4 mb-6">
                    <div className="relative">
                        <ApperIcon name="Search" className="absolute left-3 top-3 text-gray-400" size={20} />
                        <Input
                            type="text"
                            value={searchQuery}
                            onChange={onSearchChange}
                            placeholder="Search tasks..."
                            className="pl-10 pr-4"
                        />
                    </div>
                    
                    <FormField
                        type="select"
                        id="priorityFilter"
                        value={priorityFilter}
                        onChange={onPriorityFilterChange}
                        options={priorityOptions}
                    />
                </div>

                {/* Categories */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">Categories</h3>
                    <div className="space-y-1">
                        <CategoryFilterItem
                            category={{ id: 'all', name: 'All Tasks', color: '#94a3b8' }} // Placeholder color for 'All Tasks'
                            isSelected={selectedCategory === 'all'}
                            onClick={() => onCategorySelect('all')}
                            taskCount={allTasksCount}
                        />
                        
                        {categories.map(category => (
                            <CategoryFilterItem
                                key={category.id}
                                category={category}
                                isSelected={selectedCategory === category.id}
                                onClick={() => onCategorySelect(category.id)}
                                taskCount={getCategoryTaskCount(category.id)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskSidebar;