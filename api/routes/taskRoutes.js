import { Router } from "express";
import TaskEntity from "../entities/TaskEntity.js";

const router = Router();

// Retrieve all tasks
router.get("/", async (req, res, next) => {
  try {
    const data = await TaskEntity.fetchAll();
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
});

// Create a new task
router.post("/", async (req, res, next) => {
  try {
    const newTask = await TaskEntity.insert(req.body || {});
    res.status(201).json(newTask);
  } catch (err) {
    next(err);
  }
});

export default router;
