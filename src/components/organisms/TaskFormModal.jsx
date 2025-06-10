import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';

const TaskFormModal = ({ isOpen, onClose, onSubmit, taskForm, setTaskForm, categories, editingTask }) => {
    if (!isOpen) return null;

    const categoryOptions = categories.map(cat => ({ value: cat.id, label: cat.name }));
    const priorityOptions = [
        { value: 'low', label: 'Low' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-40"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-semibold text-gray-900">
                                    {editingTask ? 'Edit Task' : 'Create New Task'}
                                </h3>
                                <Button
                                    onClick={onClose}
                                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <ApperIcon name="X" size={20} />
                                </Button>
                            </div>

                            <form onSubmit={onSubmit} className="space-y-4">
                                <FormField
                                    label="Title *"
                                    id="title"
                                    type="text"
                                    value={taskForm.title}
                                    onChange={(e) => setTaskForm(prev => ({ ...prev, title: e.target.value }))}
                                    placeholder="Enter task title"
                                    required
                                />

                                <FormField
                                    label="Description"
                                    id="description"
                                    isTextArea
                                    value={taskForm.description}
                                    onChange={(e) => setTaskForm(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="Enter task description"
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        label="Category"
                                        id="categoryId"
                                        type="select"
                                        value={taskForm.categoryId}
                                        onChange={(e) => setTaskForm(prev => ({ ...prev, categoryId: e.target.value }))}
                                        options={categoryOptions}
                                    />

                                    <FormField
                                        label="Priority"
                                        id="priority"
                                        type="select"
                                        value={taskForm.priority}
                                        onChange={(e) => setTaskForm(prev => ({ ...prev, priority: e.target.value }))}
                                        options={priorityOptions}
                                    />
                                </div>

                                <FormField
                                    label="Due Date"
                                    id="dueDate"
                                    type="date"
                                    value={taskForm.dueDate}
                                    onChange={(e) => setTaskForm(prev => ({ ...prev, dueDate: e.target.value }))}
                                />

                                <div className="flex gap-3 pt-4">
                                    <Button
                                        type="button"
                                        onClick={onClose}
                                        className="flex-1 px-4 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="flex-1 px-4 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
                                    >
                                        {editingTask ? 'Update Task' : 'Create Task'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default TaskFormModal;