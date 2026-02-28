const Task = require('../models/task.model');
const { validationResult } = require('express-validator');

/**
 * Create a new task
 */
const createTask = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, priority, dueDate, tags } = req.body;

    const task = new Task({
      userId: req.user.userId,
      title,
      description,
      priority: priority || 'medium',
      dueDate: dueDate ? new Date(dueDate) : undefined,
      tags: tags || []
    });

    await task.save();

    res.status(201).json({
      message: 'Task created successfully',
      task
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Get all tasks for the authenticated user
 */
const getTasks = async (req, res) => {
  try {
    const { 
      status, 
      priority, 
      page = 1, 
      limit = 10,
      sort = '-createdAt',
      search
    } = req.query;

    const query = { userId: req.user.userId };

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by priority
    if (priority) {
      query.priority = priority;
    }

    // Search in title and description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    const tasks = await Task.find(query)
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Task.countDocuments(query);

    res.status(200).json({
      tasks,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Get task by ID
 */
const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findOne({
      _id: id,
      userId: req.user.userId
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(200).json({ task });
  } catch (error) {
    console.error('Get task error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid task ID' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Update task
 */
const updateTask = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { title, description, priority, dueDate, tags } = req.body;

    const task = await Task.findOne({
      _id: id,
      userId: req.user.userId
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Update fields
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate ? new Date(dueDate) : null;
    if (tags !== undefined) task.tags = tags;

    await task.save();

    res.status(200).json({
      message: 'Task updated successfully',
      task
    });
  } catch (error) {
    console.error('Update task error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid task ID' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Update task status
 */
const updateTaskStatus = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { status } = req.body;

    const task = await Task.findOne({
      _id: id,
      userId: req.user.userId
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    task.status = status;

    // Set completedAt when task is completed
    if (status === 'completed' && !task.completedAt) {
      task.completedAt = new Date();
    } else if (status !== 'completed') {
      task.completedAt = null;
    }

    await task.save();

    res.status(200).json({
      message: 'Task status updated successfully',
      task
    });
  } catch (error) {
    console.error('Update task status error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid task ID' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Delete task
 */
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findOneAndDelete({
      _id: id,
      userId: req.user.userId
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid task ID' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Get task statistics
 */
const getTaskStats = async (req, res) => {
  try {
    const userId = req.user.userId;

    const stats = await Task.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const priorityStats = await Task.aggregate([
      { $match: { userId, status: { $nin: ['completed', 'cancelled'] } } },
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);

    const total = await Task.countDocuments({ userId });
    const overdue = await Task.countDocuments({
      userId,
      status: { $nin: ['completed', 'cancelled'] },
      dueDate: { $lt: new Date() }
    });

    res.status(200).json({
      total,
      overdue,
      byStatus: stats.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      byPriority: priorityStats.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {})
    });
  } catch (error) {
    console.error('Get task stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask,
  getTaskStats
};
