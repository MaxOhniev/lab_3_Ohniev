import { useState } from "react";
import PropTypes from "prop-types";
import { Box, Button, TextField, Typography } from "@mui/material";

export default function NewTaskForm({ addTask, isDisabled }) {
    const [input, setInput] = useState("");

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const trimmed = input.trim();
        if (!trimmed) return;
        const success = await addTask(trimmed);
        if (success) setInput("");
    };

    return (
        <Box
            component="section"
            sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: 4,
                gap: 3,
                backgroundColor: (theme) => theme.palette.grey[50],
            }}
        >
            <Typography variant="h5">Додати нове завдання</Typography>
            <Box
                component="form"
                onSubmit={handleFormSubmit}
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    width: "100%",
                    maxWidth: 420,
                }}
            >
                <TextField
                    label="Опис завдання"
                    placeholder="Введіть текст завдання"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    required
                    disabled={isDisabled}
                />
                <Button
                    type="submit"
                    variant="contained"
                    disabled={isDisabled || !input.trim()}
                >
                    Додати
                </Button>
            </Box>
        </Box>
    );
}

NewTaskForm.propTypes = {
    addTask: PropTypes.func.isRequired,
    isDisabled: PropTypes.bool,
};

NewTaskForm.defaultProps = {
    isDisabled: false,
};
