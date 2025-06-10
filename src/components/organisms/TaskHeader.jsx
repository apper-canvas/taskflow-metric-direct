import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import ProgressRing from '@/components/atoms/ProgressRing';

const TaskHeader = ({
    title,
    subtitle,
    completionPercentage,
    showQuickAdd,
    onToggleQuickAdd,
    quickAddValue,
    onQuickAddChange,
    onQuickAddSubmit,
}) => {
    return (
        <div className="flex-shrink-0 bg-white border-b border-gray-200 z-40">
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 font-heading">{title}</h1>
                        <p className="text-gray-600">{subtitle}</p>
                    </div>
                    
                    <ProgressRing percentage={completionPercentage} />
                </div>
                
                <AnimatePresence>
                    {showQuickAdd ? (
                        <motion.form
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            onSubmit={onQuickAddSubmit}
                            className="flex gap-3"
                        >
                            <Input
                                type="text"
                                value={quickAddValue}
                                onChange={onQuickAddChange}
                                placeholder="What needs to be done?"
                                autoFocus
                            />
                            <Button
                                type="submit"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transform hover:scale-105 active:scale-95 transition-all duration-150"
                            >
                                Add Task
                            </Button>
                            <Button
                                type="button"
                                onClick={() => onToggleQuickAdd(false)}
                                className="px-4 py-3 text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                <ApperIcon name="X" size={20} />
                            </Button>
                        </motion.form>
                    ) : (
                        <Button
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            onClick={() => onToggleQuickAdd(true)}
                            className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-primary hover:text-primary transition-colors duration-200 flex items-center justify-center gap-2"
                        >
                            <ApperIcon name="Plus" size={20} />
                            <span>Add a new task (Ctrl + /)</span>
                        </Button>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default TaskHeader;