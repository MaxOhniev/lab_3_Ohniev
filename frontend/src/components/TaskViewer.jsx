import PropTypes from "prop-types";
import {
    Box,
    Button,
    CircularProgress,
    List,
    ListItem,
    ListItemText,
    Typography,
    Alert,
} from "@mui/material";

export default function TaskViewer({ items, loading, error, hasItems, retry }) {
    return (
        <Box
            component="section"
            sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: 4,
                gap: 2,
                backgroundColor: (theme) => theme.palette.background.paper,
                borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
                overflowY: "auto",
            }}
        >
            <Typography variant="h4" gutterBottom>
                Список завдань
            </Typography>

            {loading && <CircularProgress size={48} sx={{ mt: 4 }} />}

            {!loading && error && (
                <Alert
                    severity="error"
                    action={
                        <Button color="inherit" size="small" onClick={retry}>
                            Повторити
                        </Button>
                    }
                    sx={{ alignSelf: "stretch", maxWidth: 480 }}
                >
                    {error}
                </Alert>
            )}

            {!loading && !error && !hasItems && (
                <Typography variant="body1" color="text.secondary">
                    Завдань поки немає. Додайте перше!
                </Typography>
            )}

            {!loading && !error && hasItems && (
                <List sx={{ width: "100%", maxWidth: 480, bgcolor: "background.paper" }}>
                    {items.map((task, idx) => {
                        const label = task?.title ?? task?.name ?? task?.task ?? task;
                        return (
                            <ListItem key={task?.id ?? `${idx}-${label}`} divider>
                                <ListItemText primary={label} />
                            </ListItem>
                        );
                    })}
                </List>
            )}
        </Box>
    );
}

TaskViewer.propTypes = {
    items: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.string.isRequired,
    hasItems: PropTypes.bool.isRequired,
    retry: PropTypes.func.isRequired,
};
