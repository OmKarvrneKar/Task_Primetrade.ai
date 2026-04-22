const Task = require('../models/Task');

// @route  POST /api/v1/tasks
exports.createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;
    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      user: req.user._id,
    });
    res.status(201).json({ success: true, message: 'Task created', data: task });
  } catch (err) {
    next(err);
  }
};

// @route  GET /api/v1/tasks
exports.getTasks = async (req, res, next) => {
  try {
    // Admins see all tasks; users see only their own
    const filter = req.user.role === 'admin' ? {} : { user: req.user._id };

    // Search by title or description
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    // Filter by status/priority
    if (req.query.status) filter.status = req.query.status;
    if (req.query.priority) filter.priority = req.query.priority;

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    // Sorting (e.g., sort=dueDate:asc,createdAt:desc)
    let sort = { createdAt: -1 };
    if (req.query.sort) {
      const parts = req.query.sort.split(':');
      sort = { [parts[0]]: parts[1] === 'desc' ? -1 : 1 };
    }

    const total = await Task.countDocuments(filter);
    const tasks = await Task.find(filter)
      .populate('user', 'name email role')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      count: tasks.length,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
      data: tasks,
    });
  } catch (err) {
    next(err);
  }
};

// @route  GET /api/v1/tasks/:id
exports.getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id).populate('user', 'name email');
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    if (task.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view this task' });
    }

    res.json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};

// @route  PUT /api/v1/tasks/:id
exports.updateTask = async (req, res, next) => {
  try {
    let task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    if (task.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this task' });
    }

    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, message: 'Task updated', data: task });
  } catch (err) {
    next(err);
  }
};

// @route  DELETE /api/v1/tasks/:id
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    if (task.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this task' });
    }

    await task.deleteOne();
    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (err) {
    next(err);
  }
};
