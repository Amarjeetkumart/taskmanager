import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { taskService } from '../../services/task.service';
import toast from 'react-hot-toast';
import { ArrowLeft, Edit, Trash2, Calendar, Tag, Clock } from 'lucide-react';
import { formatDate } from '../../utils/helpers';

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTask();
  }, [id]);

  const loadTask = async () => {
    try {
      const data = await taskService.getTaskById(id);
      setTask(data.task);
    } catch (error) {
      toast.error('Failed to load task');
      navigate('/tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      await taskService.deleteTask(id);
      toast.success('Task deleted successfully');
      navigate('/tasks');
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await taskService.updateTaskStatus(id, newStatus);
      toast.success('Task status updated');
      loadTask();
    } catch (error) {
      toast.error('Failed to update task status');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  if (!task) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-gray-500">Task not found</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto animate-fade-in">
        <div className="mb-6">
          <Link
            to="/tasks"
            className="inline-flex items-center text-primary-600 hover:text-primary-700"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Tasks
          </Link>
        </div>

        <div className="card">
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{task.title}</h1>
              <div className="flex items-center space-x-2">
                <span className={`badge ${getStatusColor(task.status)}`}>
                  {task.status}
                </span>
                <span className={`badge ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
                {task.isOverdue && (
                  <span className="badge bg-red-100 text-red-800">Overdue</span>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Link to={`/tasks/${id}/edit`} className="btn-secondary inline-flex items-center">
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Link>
              <button onClick={handleDelete} className="btn-danger inline-flex items-center">
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </button>
            </div>
          </div>

          {task.description && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{task.description}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {task.dueDate && (
              <div>
                <div className="flex items-center text-sm text-gray-600 mb-1">
                  <Calendar className="h-4 w-4 mr-1" />
                  Due Date
                </div>
                <p className="text-gray-900 font-medium">{formatDate(task.dueDate)}</p>
              </div>
            )}

            {task.tags && task.tags.length > 0 && (
              <div>
                <div className="flex items-center text-sm text-gray-600 mb-1">
                  <Tag className="h-4 w-4 mr-1" />
                  Tags
                </div>
                <div className="flex flex-wrap gap-2">
                  {task.tags.map((tag, index) => (
                    <span key={index} className="badge bg-gray-100 text-gray-800">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center text-sm text-gray-600 mb-1">
                <Clock className="h-4 w-4 mr-1" />
                Created
              </div>
              <p className="text-gray-900 font-medium">{formatDate(task.createdAt)}</p>
            </div>

            <div>
              <div className="flex items-center text-sm text-gray-600 mb-1">
                <Clock className="h-4 w-4 mr-1" />
                Last Updated
              </div>
              <p className="text-gray-900 font-medium">{formatDate(task.updatedAt)}</p>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Update Status</h3>
            <div className="flex flex-wrap gap-2">
              {['todo', 'in-progress', 'completed', 'cancelled'].map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  disabled={task.status === status}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    task.status === status
                      ? 'bg-primary-600 text-white cursor-default'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
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

export default TaskDetail;
