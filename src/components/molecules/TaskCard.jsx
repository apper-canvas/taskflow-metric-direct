import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, isToday, isBefore, parseISO } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const TaskCard = ({ task, category, onToggle, onEdit, onDelete, getPriorityColor, index, completed = false }) => {
    const [isHovered, setIsHovered] = useState(false);

    const formatDueDate = (dueDate) => {
        if (!dueDate) return null;
        const date = typeof dueDate === 'string' ? parseISO(dueDate) : dueDate;
        
        if (isToday(date)) return 'Today';
        if (isBefore(date, new Date()) && !isToday(date)) return 'Overdue';
        return format(date, 'MMM d');
    };

    const dueDateFormatted = formatDueDate(task.dueDate);
    const isOverdue = task.dueDate && isBefore(typeof task.dueDate === 'string' ? parseISO(task.dueDate) : task.dueDate, new Date()) && !isToday(typeof task.dueDate === 'string' ? parseISO(task.dueDate) : task.dueDate);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ delay: index * 0.05 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 hover:scale-[1.02] max-w-full overflow-hidden ${
                completed ? 'opacity-60' : ''
            }`}
        >
            <div className="flex items-start gap-4 min-w-0">
                {/* Checkbox */}
                <Button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onToggle(task.id)}
                    className={`flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
                        task.completed 
                            ? 'bg-primary border-primary text-white' 
                            : 'border-gray-300 hover:border-primary'
                    }`}
                >
                    {task.completed && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="animate-checkbox-fill"
                        >
                            <ApperIcon name="Check" size={14} />
                        </motion.div>
                    )}
                </Button>

                {/* Task Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                        {/* Priority Indicator */}
                        <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)} animate-priority-pulse`} />
                        
                        {/* Category */}
                        <div className="flex items-center gap-2">
                            <div 
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: category.color }}
                            />
                            <span className="text-xs text-gray-500 uppercase tracking-wide">{category.name}</span>
                        </div>
                    </div>

                    <h3 className={`font-semibold text-gray-900 mb-1 break-words ${task.completed ? 'task-completed' : ''}`}>
                        {task.title}
                    </h3>
                    
                    {task.description && (
                        <p className={`text-gray-600 text-sm mb-3 break-words ${task.completed ? 'task-completed' : ''}`}>
                            {task.description}
                        </p>
                    )}

                    {/* Due Date and Actions */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            {dueDateFormatted && (
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                    isOverdue 
                                        ? 'bg-red-100 text-red-600' 
                                        : dueDateFormatted === 'Today' 
                                            ? 'bg-yellow-100 text-yellow-700'
                                            : 'bg-gray-100 text-gray-600'
                                }`}>
                                    {dueDateFormatted}
                                </span>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <AnimatePresence>
                            {isHovered && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className="flex items-center gap-2"
                                >
                                    {/* Edit Button */}
                                    {onEdit && (
                                        <Button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => onEdit(task)}
                                            className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                                        >
                                            <ApperIcon name="Edit2" size={16} />
                                        </Button>
                                    )}
                                    
                                    {/* Delete Button */}
                                    {onDelete && (
                                        <Button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => onDelete(task.id)}
                                            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <ApperIcon name="Trash2" size={16} />
                                        </Button>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default TaskCard;