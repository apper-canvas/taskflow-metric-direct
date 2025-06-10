import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format, isToday, isBefore, parseISO } from 'date-fns'
import { toast } from 'react-toastify'
import MainFeature from '../components/MainFeature'
import ApperIcon from '../components/ApperIcon'
import { taskService } from '../services'
import { categoryService } from '../services'

function Home() {
  const [tasks, setTasks] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [showQuickAdd, setShowQuickAdd] = useState(false)
  const [quickAddTitle, setQuickAddTitle] = useState('')

  // Load initial data
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
      } catch (err) {
        setError(err.message || 'Failed to load data')
        toast.error('Failed to load tasks')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // Filter tasks based on current filters
  const filteredTasks = tasks.filter(task => {
    if (selectedCategory !== 'all' && task.categoryId !== selectedCategory) return false
    if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !task.description.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  // Group tasks by completion status
  const activeTasks = filteredTasks.filter(task => !task.completed)
  const completedTasks = filteredTasks.filter(task => task.completed)

  // Calculate completion percentage
  const completionPercentage = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0

  // Quick add task
  const handleQuickAdd = async (e) => {
    e.preventDefault()
    if (!quickAddTitle.trim()) return

    try {
      const newTask = {
        title: quickAddTitle.trim(),
        description: '',
        categoryId: selectedCategory !== 'all' ? selectedCategory : categories[0]?.id || '',
        priority: 'medium',
        dueDate: null,
        completed: false
      }
      
      const createdTask = await taskService.create(newTask)
      setTasks(prev => [createdTask, ...prev])
      setQuickAddTitle('')
      setShowQuickAdd(false)
      toast.success('Task created successfully!')
    } catch (err) {
      toast.error('Failed to create task')
    }
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
      } else {
        toast.info('Task marked as incomplete')
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
    return categories.find(c => c.id === categoryId) || { name: 'Uncategorized', color: '#94a3b8', icon: 'Circle' }
  }

  // Priority colors
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500'
      case 'medium': return 'bg-yellow-500'  
      case 'low': return 'bg-gray-400'
      default: return 'bg-gray-400'
    }
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && e.ctrlKey) {
        e.preventDefault()
        setShowQuickAdd(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  if (loading) {
    return (
      <div className="h-screen flex flex-col overflow-hidden bg-gray-50">
        {/* Header Skeleton */}
        <div className="flex-shrink-0 bg-white border-b border-gray-200 p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
        
        {/* Content Skeleton */}
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
              <div key={i} className="animate-pulse">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <ApperIcon name="AlertCircle" className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50">
      {/* Header with Quick Add */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 z-40">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 font-heading">TaskFlow</h1>
              <p className="text-gray-600">Stay organized and get things done</p>
            </div>
            
            {/* Progress Ring */}
            <div className="relative w-16 h-16">
              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                <circle
                  cx="32" cy="32" r="28"
                  fill="none" stroke="#e5e7eb" strokeWidth="4"
                />
                <circle
                  cx="32" cy="32" r="28"
                  fill="none" stroke="#5B5CFF" strokeWidth="4"
                  strokeDasharray={`${completionPercentage * 1.76} 176`}
                  className="transition-all duration-300"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-semibold text-gray-900">{completionPercentage}%</span>
              </div>
            </div>
          </div>
          
          {/* Quick Add Bar */}
          <AnimatePresence>
            {showQuickAdd ? (
              <motion.form
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleQuickAdd}
                className="flex gap-3"
              >
                <input
                  type="text"
                  value={quickAddTitle}
                  onChange={(e) => setQuickAddTitle(e.target.value)}
                  placeholder="What needs to be done?"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transform hover:scale-105 active:scale-95 transition-all duration-150"
                >
                  Add Task
                </button>
                <button
                  type="button"
                  onClick={() => setShowQuickAdd(false)}
                  className="px-4 py-3 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <ApperIcon name="X" size={20} />
                </button>
              </motion.form>
            ) : (
              <motion.button
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setShowQuickAdd(true)}
                className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-primary hover:text-primary transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <ApperIcon name="Plus" size={20} />
                <span>Add a new task (Ctrl + /)</span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-6">
            {/* Search and Filters */}
            <div className="space-y-4 mb-6">
              <div className="relative">
                <ApperIcon name="Search" className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tasks..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
              </div>
              
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              >
                <option value="all">All Priorities</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">Categories</h3>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    selectedCategory === 'all' ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <ApperIcon name="List" size={16} />
                  <span className="flex-1">All Tasks</span>
                  <span className="text-sm opacity-75">{tasks.length}</span>
                </button>
                
                {categories.map(category => {
                  const categoryTasks = tasks.filter(t => t.categoryId === category.id)
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        selectedCategory === category.id ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="flex-1">{category.name}</span>
                      <span className="text-sm opacity-75">{categoryTasks.length}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Task List */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredTasks.length === 0 ? (
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
              <h3 className="mt-6 text-xl font-semibold text-gray-900">
                {searchQuery || priorityFilter !== 'all' ? 'No tasks match your filters' : 'No tasks yet'}
              </h3>
              <p className="mt-2 text-gray-500">
                {searchQuery || priorityFilter !== 'all' 
                  ? 'Try adjusting your search or filters' 
                  : 'Create your first task to get started with TaskFlow'
                }
              </p>
              {!searchQuery && priorityFilter === 'all' && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowQuickAdd(true)}
                  className="mt-6 px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Create Your First Task
                </motion.button>
              )}
            </motion.div>
          ) : (
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
                          onToggle={toggleTask}
                          onDelete={deleteTask}
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
                          onToggle={toggleTask}
                          onDelete={deleteTask}
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
          )}
        </div>
      </div>
    </div>
  )
}

// Task Card Component
function TaskCard({ task, category, onToggle, onDelete, getPriorityColor, index, completed = false }) {
  const [isHovered, setIsHovered] = useState(false)

  const formatDueDate = (dueDate) => {
    if (!dueDate) return null
    const date = typeof dueDate === 'string' ? parseISO(dueDate) : dueDate
    
    if (isToday(date)) return 'Today'
    if (isBefore(date, new Date()) && !isToday(date)) return 'Overdue'
    return format(date, 'MMM d')
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

            {/* Delete Button */}
            <AnimatePresence>
              {isHovered && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onDelete(task.id)}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <ApperIcon name="Trash2" size={16} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default Home