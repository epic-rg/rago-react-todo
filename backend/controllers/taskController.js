import Task from "../models/Task.js";
import User from "../models/User.js";
import validateObjectId from "../utils/validateObjectId.js";

/* ================= ADMIN ================= */

// Create Task
export const createTask = async (req, res) => {
  try {
    const { title, description, assignedTo } = req.body;

    if (!title || !assignedTo) {
      return res.status(400).json({
        success: false,
        message: "Title and assignedTo are required",
      });
    }

    if (!validateObjectId(assignedTo)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const member = await User.findById(assignedTo);

    if (!member || member.role !== "member") {
      return res.status(404).json({
        success: false,
        message: "Assigned user must be a valid member",
      });
    }

    if (String(member.managedBy) !== String(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: "You can only assign tasks to your own members",
      });
    }

    const task = await Task.create({
      title,
      description,
      assignedTo,
      createdBy: req.user.id,
    });

    return res.status(201).json({
      success: true,
      data: task,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Tasks
export const getAllTasks = async (req, res) => {
  try {
    const members = await User.find({
      role: "member",
      managedBy: req.user.id,
    }).select("_id");

    const memberIds = members.map((member) => member._id);

    const tasks = await Task.find({ assignedTo: { $in: memberIds } })
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    return res.json({ success: true, data: tasks });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get Tasks By User
export const getTasksByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!validateObjectId(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const member = await User.findOne({
      _id: userId,
      role: "member",
      managedBy: req.user.id,
    });

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found under your account",
      });
    }

    const tasks = await Task.find({ assignedTo: userId });

    return res.json({ success: true, data: tasks });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Update Task
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!validateObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
    }

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    const currentAssignee = await User.findById(task.assignedTo).select("managedBy role");

    if (
      !currentAssignee ||
      currentAssignee.role !== "member" ||
      String(currentAssignee.managedBy) !== String(req.user.id)
    ) {
      return res.status(403).json({
        success: false,
        message: "You can only update tasks of your own members",
      });
    }

    if (req.body.assignedTo) {
      if (!validateObjectId(req.body.assignedTo)) {
        return res.status(400).json({
          success: false,
          message: "Invalid user ID",
        });
      }

      const nextAssignee = await User.findById(req.body.assignedTo).select("managedBy role");
      if (
        !nextAssignee ||
        nextAssignee.role !== "member" ||
        String(nextAssignee.managedBy) !== String(req.user.id)
      ) {
        return res.status(403).json({
          success: false,
          message: "You can only assign tasks to your own members",
        });
      }
    }

    const updatedTask = await Task.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    return res.json({ success: true, data: updatedTask });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Task
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!validateObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
    }

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    const assignee = await User.findById(task.assignedTo).select("managedBy role");

    if (!assignee || assignee.role !== "member" || String(assignee.managedBy) !== String(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: "You can only delete tasks of your own members",
      });
    }

    await Task.findByIdAndDelete(id);

    return res.json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= MEMBER ================= */

// Get My Tasks
export const getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user.id });

    return res.json({ success: true, data: tasks });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Complete Task
export const completeTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!validateObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
    }

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    if (String(task.assignedTo) !== String(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: "You can only complete your own tasks",
      });
    }

    if (task.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Task already completed",
      });
    }

    const completedAt = new Date();
    const timeTaken = completedAt - task.createdAt;

    task.status = "completed";
    task.completedAt = completedAt;
    task.timeTaken = timeTaken;

    await task.save();

    return res.json({
      success: true,
      data: task,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
