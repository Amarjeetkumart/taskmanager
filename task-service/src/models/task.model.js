const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    trim: true,
    maxlength: 2000
  },
  status: {
    type: String,
    enum: ['todo', 'in-progress', 'completed', 'cancelled'],
    default: 'todo',
    index: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
    index: true
  },
  dueDate: {
    type: Date
  },
  tags: [{
    type: String,
    trim: true
  }],
  completedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for querying user tasks
taskSchema.index({ userId: 1, createdAt: -1 });
taskSchema.index({ userId: 1, status: 1 });
taskSchema.index({ userId: 1, priority: 1 });

// Virtual for checking if task is overdue
taskSchema.virtual('isOverdue').get(function() {
  if (this.status === 'completed' || this.status === 'cancelled') {
    return false;
  }
  return this.dueDate && this.dueDate < new Date();
});

// Ensure virtuals are included in JSON
taskSchema.set('toJSON', { virtuals: true });

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
