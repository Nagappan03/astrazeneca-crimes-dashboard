import { Paper, Typography, Box } from '@mui/material';

const StateModal = ({ data }) => {
    if (!data) return null;

    return (
        <Paper
            elevation={8}
            sx={{
                position: 'fixed',
                bottom: '1rem',
                left: '25%',
                transform: 'translateX(-50%)',
                width: 'auto',
                minWidth: '300px',
                maxWidth: '400px',
                borderRadius: 2,
                overflow: 'hidden',
                animation: 'slideUp 0.3s ease-out',
                '@keyframes slideUp': {
                    from: {
                        transform: 'translate(-50%, 100%)',
                        opacity: 0
                    },
                    to: {
                        transform: 'translate(-50%, 0)',
                        opacity: 1
                    }
                }
            }}
        >
            <Box
                sx={{
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    p: 2,
                }}
            >
                <Typography
                    variant="h6"
                    component="h3"
                    sx={{
                        fontWeight: 600,
                        textAlign: 'center',
                        textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                    }}
                >
                    {data.name}
                </Typography>
            </Box>

            <Box
                sx={{
                    p: 2,
                    bgcolor: 'background.paper',
                }}
            >
                {data.crimeData ? (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: 2,
                            p: 1,
                            bgcolor: 'grey.50',
                            borderRadius: 1,
                        }}
                    >
                        <Typography
                            variant="subtitle1"
                            color="text.secondary"
                            sx={{ fontWeight: 500 }}
                        >
                            Total Cases:
                        </Typography>
                        <Typography
                            variant="h6"
                            color="error.main"
                            sx={{
                                fontWeight: 700,
                                fontFamily: 'monospace'
                            }}
                        >
                            {data.crimeData.total_crimes.toLocaleString()}
                        </Typography>
                    </Box>
                ) : (
                    <Typography
                        color="text.secondary"
                        textAlign="center"
                    >
                        No data available
                    </Typography>
                )}
            </Box>

            <Box
                sx={{
                    p: 1,
                    bgcolor: 'grey.50',
                    borderTop: 1,
                    borderColor: 'grey.200'
                }}
            >
                <Typography
                    variant="caption"
                    component="p"
                    textAlign="center"
                    color="text.secondary"
                >
                    Click to view detailed statistics
                </Typography>
            </Box>
        </Paper>
    );
};

export default StateModal;