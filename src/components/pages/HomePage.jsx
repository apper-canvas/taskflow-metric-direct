import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { taskService, categoryService } from '@/services';
import TaskHeader from '@/components/organisms/TaskHeader';
import TaskSidebar from '@/components/organisms/TaskSidebar';
import TaskList from '@/components/organisms/TaskList';
import TaskFormModal from '@/components/organisms/TaskFormModal';
import SkeletonCard from '@/components/molecules/SkeletonCard';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

function HomePage() {
    const [tasks, setTasks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [showQuickAdd, setShowQuickAdd] = useState(false);
    const [quickAddTitle, setQuickAddTitle] = useState('');
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [taskForm, setTaskForm] = useState({
        title: '',
        description: '',
        categoryId: '',
        priority: 'medium',
        dueDate: ''
    });

    // Load initial data
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setError(null);
            try {
                const [tasksData, categoriesData] = await Promise.all([
                    taskService.getAll(),
                    categoryService.getAll()
                ]);
                setTasks(tasksData);
                setCategories(categoriesData);
                if (categoriesData.length > 0 && !taskForm.categoryId) {
                    setTaskForm(prev => ({ ...prev, categoryId: categoriesData[0].id }));
                }
            } catch (err) {
                setError(err.message || 'Failed to load data');
                toast.error('Failed to load tasks and categories');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    // Keyboard shortcuts for quick add
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === '/' && e.ctrlKey) {
                e.preventDefault();
                setShowQuickAdd(true);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Filter tasks based on current filters
    const filteredTasks = tasks.filter(task => {
        if (selectedCategory !== 'all' && task.categoryId !== selectedCategory) return false;
        if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;
        if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
            !task.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
    });

    const activeTasks = filteredTasks.filter(task => !task.completed);
    const completedTasks = filteredTasks.filter(task => task.completed);
    const totalCompletionPercentage = tasks.length > 0 ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) : 0;

    // Quick add task handler
    const handleQuickAdd = async (e) => {
        e.preventDefault();
        if (!quickAddTitle.trim()) return;

        try {
            const newTask = {
                title: quickAddTitle.trim(),
                description: '',
                categoryId: selectedCategory !== 'all' ? selectedCategory : categories[0]?.id || '',
                priority: 'medium',
                dueDate: null,
                completed: false
            };
            
            const createdTask = await taskService.create(newTask);
            setTasks(prev => [createdTask, ...prev]);
            setQuickAddTitle('');
            setShowQuickAdd(false);
            toast.success('Task created successfully!');
        } catch (err) {
            toast.error('Failed to create task');
        }
    };

    // Task CRUD operations
    const handleSaveTask = async (e) => {
        e.preventDefault();
        if (!taskForm.title.trim()) return;

        try {
            const taskData = {
                ...taskForm,
                title: taskForm.title.trim(),
                dueDate: taskForm.dueDate ? new Date(taskForm.dueDate) : null
            };

            if (editingTask) {
                const updatedTask = await taskService.update(editingTask.id, taskData);
                setTasks(prev => prev.map(t => t.id === editingTask.id ? updatedTask : t));
                toast.success('Task updated successfully!');
            } else {
                const newTask = await taskService.create(taskData);
                setTasks(prev => [newTask, ...prev]);
                toast.success('Task created successfully!');
            }

            closeTaskModal();
        } catch (err) {
            toast.error(`Failed to ${editingTask ? 'update' : 'create'} task`);
        }
    };

    const toggleTask = async (taskId) => {
        try {
            const task = tasks.find(t => t.id === taskId);
            const updatedTask = await taskService.update(taskId, {
                completed: !task.completed,
                completedAt: !task.completed ? new Date() : null
            });
            
            setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));
            
            if (!task.completed) {
                toast.success('Task completed! 🎉');
            } else {
                toast.info('Task marked as incomplete');
            }
        } catch (err) {
            toast.error('Failed to update task');
        }
    };

    const deleteTask = async (taskId) => {
        try {
            await taskService.delete(taskId);
            setTasks(prev => prev.filter(t => t.id !== taskId));
            toast.success('Task deleted');
        } catch (err) {
            toast.error('Failed to delete task');
        }
    };

    // Modal control
    const openEditModal = useCallback((task) => {
        setEditingTask(task);
        setTaskForm({
            title: task.title,
            description: task.description,
            categoryId: task.categoryId,
            priority: task.priority,
            dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
        });
        setShowTaskModal(true);
    }, []);

    const openCreateModal = useCallback(() => {
        setEditingTask(null);
        setTaskForm({
            title: '',
            description: '',
            categoryId: categories[0]?.id || '',
            priority: 'medium',
            dueDate: ''
        });
        setShowTaskModal(true);
    }, [categories]);

    const closeTaskModal = useCallback(() => {
        setShowTaskModal(false);
        setEditingTask(null);
        setTaskForm({
            title: '',
            description: '',
            categoryId: categories[0]?.id || '',
            priority: 'medium',
            dueDate: ''
        });
    }, [categories]);

    // Helper functions for data display
    const getCategoryInfo = useCallback((categoryId) => {
        return categories.find(c => c.id === categoryId) || { name: 'Uncategorized', color: '#94a3b8', icon: 'Circle' };
    }, [categories]);

    const getPriorityColor = useCallback((priority) => {
        switch (priority) {
            case 'high': return 'bg-red-500';
            case 'medium': return 'bg-yellow-500';  
            case 'low': return 'bg-gray-400';
            default: return 'bg-gray-400';
        }
    }, []);

    const getCategoryTaskCount = useCallback((categoryId) => {
        return tasks.filter(t => t.categoryId === categoryId).length;
    }, [tasks]);

    if (loading) {
        return (
            <div className="h-screen flex flex-col overflow-hidden bg-gray-50">
                <div className="flex-shrink-0 bg-white border-b border-gray-200 p-6">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
                        <div className="h-12 bg-gray-200 rounded"></div>
                    </div>
                </div>
                
                <div className="flex-1 flex overflow-hidden">
                    <div className="w-80 bg-white border-r border-gray-200 p-6">
                        <div className="animate-pulse space-y-4">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="h-10 bg-gray-200 rounded"></div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="flex-1 p-6 space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <SkeletonCard key={i} />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center p-8">
                    <ApperIcon name="AlertCircle" className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <Button 
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col overflow-hidden bg-gray-50">
            <TaskHeader
                title="TaskFlow"
                subtitle="Stay organized and get things done"
                completionPercentage={totalCompletionPercentage}
                showQuickAdd={showQuickAdd}
                onToggleQuickAdd={setShowQuickAdd}
                quickAddValue={quickAddTitle}
                onQuickAddChange={(e) => setQuickAddTitle(e.target.value)}
                onQuickAddSubmit={handleQuickAdd}
            />

            <div className="flex-1 flex overflow-hidden">
                <TaskSidebar
                    searchQuery={searchQuery}
                    onSearchChange={(e) => setSearchQuery(e.target.value)}
                    priorityFilter={priorityFilter}
                    onPriorityFilterChange={(e) => setPriorityFilter(e.target.value)}
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onCategorySelect={setSelectedCategory}
                    allTasksCount={tasks.length}
                    getCategoryTaskCount={getCategoryTaskCount}
                />
                
                <div className="flex-1 overflow-y-auto p-6">
                    <TaskList
                        activeTasks={activeTasks}
                        completedTasks={completedTasks}
                        getCategoryInfo={getCategoryInfo}
                        getPriorityColor={getPriorityColor}
                        onToggle={toggleTask}
                        onEdit={openEditModal}
                        onDelete={deleteTask}
                        showQuickAddForm={setShowQuickAdd}
                        searchQuery={searchQuery}
                        priorityFilter={priorityFilter}
                    />
                </div>
            </div>

            <TaskFormModal
                isOpen={showTaskModal}
                onClose={closeTaskModal}
                onSubmit={handleSaveTask}
                taskForm={taskForm}
                setTaskForm={setTaskForm}
                categories={categories}
                editingTask={editingTask}
            />
        </div>
    );
}

export default HomePage;