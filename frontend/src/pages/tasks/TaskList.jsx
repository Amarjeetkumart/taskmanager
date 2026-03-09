import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { taskService } from '../../services/task.service';
import toast from 'react-hot-toast';
import { Plus, Search, Filter, Calendar, Tag } from 'lucide-react';
import { formatDate } from '../../utils/helpers';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    search: '',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
      };
      const data = await taskService.getAllTasks(params);
      setTasks(data.tasks || []);
      setPagination((prev) => data.pagination || prev);
    } catch (error) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.page, pagination.limit]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
    setPagination({ ...pagination, page: 1 });
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await taskService.updateTaskStatus(taskId, newStatus);
      toast.success('Task status updated');
      loadTasks();
    } catch (error) {
      toast.error('Failed to update task status');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      await taskService.deleteTask(taskId);
      toast.success('Task deleted successfully');
      loadTasks();
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  return (
    <Layout>
      <div className="animate-fade-in">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
          <Link to="/tasks/new" className="btn-primary inline-flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            New Task
          </Link>
        </div>

        {/* Filters */}
        <div className="card mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Search className="h-4 w-4 inline mr-1" />
                Search
              </label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Search tasks..."
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Filter className="h-4 w-4 inline mr-1" />
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="input-field"
              >
                <option value="">All Statuses</option>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                value={filters.priority}
                onChange={(e) => handleFilterChange('priority', e.target.value)}
                className="input-field"
              >
                <option value="">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>
        </div>

        {/* Task List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : tasks.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-500 text-lg">No tasks found</p>
            <Link to="/tasks/new" className="btn-primary inline-flex items-center mt-4">
              <Plus className="h-5 w-5 mr-2" />
              Create Your First Task
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {tasks.map((task) => (
                <div key={task._id} className="card hover:shadow-lg transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <Link to={`/tasks/${task._id}`}>
                          <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600">
                            {task.title}
                          </h3>
                        </Link>
                        <div className="flex items-center space-x-2 ml-4">
                          <span className={`badge ${getStatusColor(task.status)}`}>
                            {task.status}
                          </span>
                          <span className={`badge ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                        </div>
                      </div>

                      {task.description && (
                        <p className="text-gray-600 mt-2 line-clamp-2">{task.description}</p>
                      )}

                      <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
                        {task.dueDate && (
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            Due: {formatDate(task.dueDate)}
                            {task.isOverdue && (
                              <span className="ml-2 text-red-600 font-medium">Overdue!</span>
                            )}
                          </div>
                        )}
                        {task.tags && task.tags.length > 0 && (
                          <div className="flex items-center">
                            <Tag className="h-4 w-4 mr-1" />
                            {task.tags.join(', ')}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 mt-4 md:mt-0 md:ml-4">
                      <select
                        value={task.status}
                        onChange={(e) => handleStatusChange(task._id, e.target.value)}
                        className="text-sm px-3 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="todo">To Do</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>

                      <Link
                        to={`/tasks/${task._id}/edit`}
                        className="btn-secondary text-sm py-1.5"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() => handleDeleteTask(task._id)}
                        className="btn-danger text-sm py-1.5"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-8">
                <button
                  onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                  disabled={pagination.page === 1}
                  className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-gray-700">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                  disabled={pagination.page === pagination.totalPages}
                  className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

const getStatusColor = (status) => {
  const colors = {
    todo: 'bg-blue-100 text-blue-800',
    'in-progress': 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-gray-100 text-gray-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

const getPriorityColor = (priority) => {
  const colors = {
    low: 'bg-slate-100 text-slate-800',
    medium: 'bg-blue-100 text-blue-800',
    high: 'bg-orange-100 text-orange-800',
    urgent: 'bg-red-100 text-red-800',
  };
  return colors[priority] || 'bg-gray-100 text-gray-800';
};

export default TaskList;
