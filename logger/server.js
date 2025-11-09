import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.LOGGER_PORT || 4000;
const LOGS_DIR = path.join(__dirname, "logs");
const LOG_FILE_PATH = path.join(LOGS_DIR, "app.log");

// This makes sure the log folder is ready before writing files.
if (!fs.existsSync(LOGS_DIR)) {
  fs.mkdirSync(LOGS_DIR, { recursive: true });
}

app.use(express.json({ limit: "1mb" }));

let writeQueue = Promise.resolve();

// This helper writes each log line to the file one after another.
const appendLog = (entry) => {
  writeQueue = writeQueue
    .catch(() => {})
    .then(() => fs.promises.appendFile(LOG_FILE_PATH, entry, "utf8"));

  return writeQueue;
};

// This route accepts log messages from other services.
app.post("/log", async (req, res) => {
  const { service, level, message } = req.body || {};

  if (!service || !level || !message) {
    return res.status(400).json({
      message: "Fields 'service', 'level', and 'message' are required",
    });
  }

  const timestamp = new Date().toISOString();
  const logLine = `${timestamp} | ${service} | ${level.toUpperCase()} | ${message}\n`;

  try {
    await appendLog(logLine);
    res.status(200).json({ status: "logged" });
  } catch (error) {
    console.error("Failed to write log entry", error);
    res.status(500).json({ message: "Unable to persist log entry" });
  }
});

app.use((req, res) => {
  res.status(404).json({ message: "Endpoint not found" });
});

app.listen(PORT, () => {
  console.log(`Logger service listening on port ${PORT}`);
});
