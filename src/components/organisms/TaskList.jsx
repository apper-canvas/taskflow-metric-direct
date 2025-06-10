import React from 'react';
import { AnimatePresence } from 'framer-motion';
import TaskCard from '@/components/molecules/TaskCard';
import EmptyState from '@/components/organisms/EmptyState';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const TaskList = ({
    activeTasks,
    completedTasks,
    getCategoryInfo,
    getPriorityColor,
    onToggle,
    onEdit,
    onDelete,
    showQuickAddForm,
    searchQuery,
    priorityFilter,
}) => {
    const allTasksCount = activeTasks.length + completedTasks.length;

    if (allTasksCount === 0) {
        return (
            <EmptyState
                iconName="CheckSquare"
                title={searchQuery || priorityFilter !== 'all' ? 'No tasks match your filters' : 'No tasks yet'}
                description={searchQuery || priorityFilter !== 'all' ? 'Try adjusting your search or filters' : 'Create your first task to get started with TaskFlow'}
                actionButtonText={!searchQuery && priorityFilter === 'all' ? 'Create Your First Task' : null}
                onActionClick={!searchQuery && priorityFilter === 'all' ? () => showQuickAddForm(true) : null}
            />
        );
    }

    return (
        <div className="space-y-6">
            {/* Active Tasks */}
            {activeTasks.length > 0 && (
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Active Tasks ({activeTasks.length})
                    </h2>
                    <div className="space-y-3">
                        <AnimatePresence>
                            {activeTasks.map((task, index) => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    category={getCategoryInfo(task.categoryId)}
                                    onToggle={onToggle}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                    getPriorityColor={getPriorityColor}
                                    index={index}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            )}

            {/* Completed Tasks */}
            {completedTasks.length > 0 && (
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Completed ({completedTasks.length})
                    </h2>
                    <div className="space-y-3">
                        <AnimatePresence>
                            {completedTasks.map((task, index) => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    category={getCategoryInfo(task.categoryId)}
                                    onToggle={onToggle}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                    getPriorityColor={getPriorityColor}
                                    index={index}
                                    completed
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskList;