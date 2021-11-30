import mongoose, { Schema } from "mongoose";

const TaskSchema = new Schema({
  name: { 
    type: String,
    required: true,
  },
  previsionDate: { 
    type: Date,
    required: true,
  },
  finishDate: { 
    type: Date,
  },
  userId: {
    type: String,
    required: true,
  }
})

export const TaskModel = (mongoose.models.tasks
  || mongoose.model('tasks', TaskSchema));