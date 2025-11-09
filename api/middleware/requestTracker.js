import logAgent from "../core/loggerAgent.js";

const TRACK_METHODS = ["GET", "POST"];

const requestTracker = (req, res, next) => {
    if (!TRACK_METHODS.includes(req.method)) {
        return next();
    }

    const startTime = Date.now();

    res.on("finish", () => {
        const duration = Date.now() - startTime;
        const status = res.statusCode;
        const severity = status >= 500 ? "error" : "info";

        let message = `${req.method} ${req.originalUrl} → ${status} (${duration}ms)`;

        if (req.method === "POST" && typeof req.body?.title === "string") {
            message += ` | title: "${req.body.title.trim()}"`;
        }

        logAgent.write({ level: severity, message }).catch((err) => {
            console.error("Failed to record request log:", err.message);
        });
    });

    next();
};

export default requestTracker;
