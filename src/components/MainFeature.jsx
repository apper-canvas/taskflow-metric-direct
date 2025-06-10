import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format, isToday, isBefore, parseISO } from 'date-fns'
import { toast } from 'react-toastify'
import ApperIcon from './ApperIcon'
import { taskService, categoryService } from '../services'

function MainFeature() {
  const [tasks, setTasks] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    categoryId: '',
    priority: 'medium',
    dueDate: ''
  })

  // Load data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      setError(null)
      try {
        const [tasksData, categoriesData] = await Promise.all([
          taskService.getAll(),
          categoryService.getAll()
        ])
        setTasks(tasksData)
        setCategories(categoriesData)
        if (categoriesData.length > 0 && !taskForm.categoryId) {
          setTaskForm(prev => ({ ...prev, categoryId: categoriesData[0].id }))
        }
      } catch (err) {
        setError(err.message || 'Failed to load data')
        toast.error('Failed to load data')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // Create or update task
  const handleSaveTask = async (e) => {
    e.preventDefault()
    if (!taskForm.title.trim()) return

    try {
      const taskData = {
        ...taskForm,
        title: taskForm.title.trim(),
        dueDate: taskForm.dueDate ? new Date(taskForm.dueDate) : null
      }

      if (editingTask) {
        const updatedTask = await taskService.update(editingTask.id, taskData)
        setTasks(prev => prev.map(t => t.id === editingTask.id ? updatedTask : t))
        toast.success('Task updated successfully!')
      } else {
        const newTask = await taskService.create(taskData)
        setTasks(prev => [newTask, ...prev])
        toast.success('Task created successfully!')
      }

      closeModal()
    } catch (err) {
      toast.error(`Failed to ${editingTask ? 'update' : 'create'} task`)
    }
  }

  // Open modal for editing
  const openEditModal = (task) => {
    setEditingTask(task)
    setTaskForm({
      title: task.title,
      description: task.description,
      categoryId: task.categoryId,
      priority: task.priority,
      dueDate: task.dueDate ? format(typeof task.dueDate === 'string' ? parseISO(task.dueDate) : task.dueDate, 'yyyy-MM-dd') : ''
    })
    setShowTaskModal(true)
  }

  // Open modal for creating
  const openCreateModal = () => {
    setEditingTask(null)
    setTaskForm({
      title: '',
      description: '',
      categoryId: categories[0]?.id || '',
      priority: 'medium',
      dueDate: ''
    })
    setShowTaskModal(true)
  }

  // Close modal
  const closeModal = () => {
    setShowTaskModal(false)
    setEditingTask(null)
    setTaskForm({
      title: '',
      description: '',
      categoryId: categories[0]?.id || '',
      priority: 'medium',
      dueDate: ''
    })
  }

  // Toggle task completion
  const toggleTask = async (taskId) => {
    try {
      const task = tasks.find(t => t.id === taskId)
      const updatedTask = await taskService.update(taskId, {
        completed: !task.completed,
        completedAt: !task.completed ? new Date() : null
      })
      
      setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t))
      
      if (!task.completed) {
        toast.success('Task completed! 🎉')
      }
    } catch (err) {
      toast.error('Failed to update task')
    }
  }

  // Delete task
  const deleteTask = async (taskId) => {
    try {
      await taskService.delete(taskId)
      setTasks(prev => prev.filter(t => t.id !== taskId))
      toast.success('Task deleted')
    } catch (err) {
      toast.error('Failed to delete task')
    }
  }

  // Get category info
  const getCategoryInfo = (categoryId) => {
    return categories.find(c => c.id === categoryId) || { name: 'Uncategorized', color: '#94a3b8' }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center py-12"
      >
        <ApperIcon name="AlertCircle" className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Tasks</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Try Again
        </button>
      </motion.div>
    )
  }

  const activeTasks = tasks.filter(task => !task.completed)
  const completedTasks = tasks.filter(task => task.completed)

  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 font-heading">Your Tasks</h2>
          <p className="text-gray-600">
            {activeTasks.length} active • {completedTasks.length} completed
          </p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={openCreateModal}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm"
        >
          <ApperIcon name="Plus" size={20} />
          New Task
        </motion.button>
      </div>

      {/* Task Lists */}
      {tasks.length === 0 ? (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center py-16"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <ApperIcon name="CheckSquare" className="w-20 h-20 text-gray-300 mx-auto" />
          </motion.div>
          <h3 className="mt-6 text-xl font-semibold text-gray-900">No tasks yet</h3>
          <p className="mt-2 text-gray-500">Create your first task to get started</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={openCreateModal}
            className="mt-6 px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Create Your First Task
          </motion.button>
        </motion.div>
      ) : (
        <div className="space-y-8">
          {/* Active Tasks */}
          {activeTasks.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Active Tasks ({activeTasks.length})
              </h3>
              <div className="space-y-3">
                <AnimatePresence>
                  {activeTasks.map((task, index) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      category={getCategoryInfo(task.categoryId)}
                      onToggle={toggleTask}
                      onEdit={openEditModal}
                      onDelete={deleteTask}
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
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Completed ({completedTasks.length})
              </h3>
              <div className="space-y-3">
                <AnimatePresence>
                  {completedTasks.map((task, index) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      category={getCategoryInfo(task.categoryId)}
                      onToggle={toggleTask}
                      onEdit={openEditModal}
                      onDelete={deleteTask}
                      index={index}
                      completed
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Task Modal */}
      <AnimatePresence>
        {showTaskModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={closeModal}
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
                  <button
                    onClick={closeModal}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <ApperIcon name="X" size={20} />
                  </button>
                </div>

                <form onSubmit={handleSaveTask} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={taskForm.title}
                      onChange={(e) => setTaskForm(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      placeholder="Enter task title"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={taskForm.description}
                      onChange={(e) => setTaskForm(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      placeholder="Enter task description"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <select
                        value={taskForm.categoryId}
                        onChange={(e) => setTaskForm(prev => ({ ...prev, categoryId: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      >
                        {categories.map(category => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Priority
                      </label>
                      <select
                        value={taskForm.priority}
                        onChange={(e) => setTaskForm(prev => ({ ...prev, priority: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={taskForm.dueDate}
                      onChange={(e) => setTaskForm(prev => ({ ...prev, dueDate: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="flex-1 px-4 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      {editingTask ? 'Update Task' : 'Create Task'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

// Task Card Component
function TaskCard({ task, category, onToggle, onEdit, onDelete, index, completed = false }) {
  const [isHovered, setIsHovered] = useState(false)

  const formatDueDate = (dueDate) => {
    if (!dueDate) return null
    const date = typeof dueDate === 'string' ? parseISO(dueDate) : dueDate
    
    if (isToday(date)) return 'Today'
    if (isBefore(date, new Date()) && !isToday(date)) return 'Overdue'
    return format(date, 'MMM d')
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500'
      case 'medium': return 'bg-yellow-500'  
      case 'low': return 'bg-gray-400'
      default: return 'bg-gray-400'
    }
  }

  const dueDateFormatted = formatDueDate(task.dueDate)
  const isOverdue = task.dueDate && isBefore(typeof task.dueDate === 'string' ? parseISO(task.dueDate) : task.dueDate, new Date()) && !isToday(typeof task.dueDate === 'string' ? parseISO(task.dueDate) : task.dueDate)

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
        <motion.button
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
        </motion.button>

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
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onEdit(task)}
                    className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                  >
                    <ApperIcon name="Edit2" size={16} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onDelete(task.id)}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <ApperIcon name="Trash2" size={16} />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default MainFeature