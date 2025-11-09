const PORT = process.env.LOGGER_PORT ?? 4000;
const TARGET_URL = process.env.LOGGING_URL ?? `http://auditlog:${PORT}/log`;
const SERVICE = process.env.SERVICE_NAME ?? "backend";
const TIMEOUT = Number(process.env.LOGGER_TIMEOUT ?? 2000);

// Helper to send log requests safely with a timeout
const safeRequest = async (data) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT);

    try {
        const response = await fetch(TARGET_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
            signal: controller.signal,
        });

        if (!response.ok) {
            const body = await response.text();
            console.error(`Logger responded ${response.status}: ${body}`);
        }
    } catch (err) {
        if (err.name === "AbortError") {
            console.error("Logger request timed out");
        } else {
            console.error("Logger request failed:", err.message);
        }
    } finally {
        clearTimeout(timer);
    }
};

// Log agent interface
const logAgent = {
    async write({ message, level = "info", service = SERVICE }) {
        if (!message) return;
        const payload = { message, level, service };
        await safeRequest(payload);
    },
};

export default logAgent;
