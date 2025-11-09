import { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { Box, Snackbar, Alert } from "@mui/material";
import TaskViewer from "./components/TaskViewer.jsx";
import NewTaskForm from "./components/NewTaskForm.jsx";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const TASKS_ENDPOINT = `${API_URL}/api/tasks`;

export default function AppMain() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasTasks = useMemo(() => tasks.length > 0, [tasks]);

  const loadTasks = useCallback(async ({ signal } = {}) => {
    try {
      setLoading(true);
      const res = await axios.get(TASKS_ENDPOINT, { signal });
      setTasks(Array.isArray(res.data) ? res.data : []);
      setFetchError("");
    } catch (err) {
      if (err.code === "ERR_CANCELED") return;
      setFetchError(err?.response?.data?.message || "Не вдалося завантажити завдання.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadTasks({ signal: controller.signal });
    return () => controller.abort();
  }, [loadTasks]);

  const addTask = async (taskText) => {
    if (!taskText?.trim()) {
      setSubmitError("Текст завдання не може бути порожнім.");
      return false;
    }
    try {
      setIsSubmitting(true);
      const res = await axios.post(TASKS_ENDPOINT, { title: taskText.trim() });
      setTasks((prev) => [...prev, res.data]);
      setSubmitError("");
      return true;
    } catch (err) {
      setSubmitError(err?.response?.data?.message || "Не вдалося додати завдання.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: (theme) => theme.palette.background.default }}>
        <TaskViewer
            items={tasks}
            loading={loading}
            error={fetchError}
            hasItems={hasTasks}
            retry={() => loadTasks()}
        />
        <NewTaskForm addTask={addTask} isDisabled={isSubmitting} />
        <Snackbar
            open={Boolean(submitError)}
            autoHideDuration={4000}
            onClose={() => setSubmitError("")}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert onClose={() => setSubmitError("")} severity="error" variant="filled">
            {submitError}
          </Alert>
        </Snackbar>
      </Box>
  );
}
