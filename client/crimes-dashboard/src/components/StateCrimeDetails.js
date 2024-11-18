import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TableSortLabel,
    Box,
    CircularProgress,
    Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';


const StyledTableCell = styled(TableCell)(({ theme }) => ({
    '&.MuiTableCell-head': {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
        fontWeight: 'bold',
    },
    '&.MuiTableCell-body': {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    '&:last-child td, &:last-child th': {
        border: 0,
    },
    '&:hover': {
        backgroundColor: theme.palette.action.selected,
        cursor: 'pointer',
    },
}));

const StateCrimeDetails = () => {
    const { state } = useParams();
    const [crimeData, setCrimeData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: 'year', direction: 'desc' });

    useEffect(() => {
        fetch(`/api/crimes/${encodeURIComponent(state)}`)
            .then(response => response.json())
            .then(data => {
                setCrimeData(data);
                setLoading(false);
            })
            .catch(err => {
                setError('Failed to load crime data');
                setLoading(false);
            });
    }, [state]);

    const handleSort = (key) => {
        setSortConfig(prevConfig => ({
            key,
            direction:
                prevConfig.key === key && prevConfig.direction === 'asc'
                    ? 'desc'
                    : 'asc'
        }));
    };

    const sortedData = React.useMemo(() => {
        if (!crimeData) return [];

        return [...crimeData].sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
    }, [crimeData, sortConfig]);

    const formatNumber = (num) => {
        return num.toLocaleString();
    };

    const columns = [
        { key: 'year', label: 'Year' },
        { key: 'rape_cases', label: 'Rape Cases' },
        { key: 'kidnap_assault', label: 'Kidnapping' },
        { key: 'dowry_deaths', label: 'Dowry Deaths' },
        { key: 'assault_on_women', label: 'Assault on Women' },
        { key: 'assault_on_modesty', label: 'Assault on Modesty' },
        { key: 'domestic_violence', label: 'Domestic Violence' },
        { key: 'women_trafficking', label: 'Women Trafficking' },
        { key: 'total_crimes', label: 'Total Crimes' }
    ];

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: '95%', margin: '20px auto', padding: '20px' }}>
            <Typography variant="h4" component="h1" gutterBottom color="primary">
                Crime Statistics: {state}
            </Typography>
            <Typography variant="subtitle1" gutterBottom color="text.secondary">
                Yearly breakdown from 2001 to 2021
            </Typography>

            <TableContainer component={Paper} sx={{ mt: 3, boxShadow: 3 }}>
                <Table sx={{ minWidth: 700 }} aria-label="crime statistics table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <StyledTableCell key={column.key}>
                                    <TableSortLabel
                                        active={sortConfig.key === column.key}
                                        direction={sortConfig.key === column.key ? sortConfig.direction : 'asc'}
                                        onClick={() => handleSort(column.key)}
                                    >
                                        {column.label}
                                    </TableSortLabel>
                                </StyledTableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedData.map((row) => (
                            <StyledTableRow key={row.year}>
                                <TableCell>{row.year}</TableCell>
                                <TableCell>{formatNumber(row.rape_cases)}</TableCell>
                                <TableCell>{formatNumber(row.kidnap_assault)}</TableCell>
                                <TableCell>{formatNumber(row.dowry_deaths)}</TableCell>
                                <TableCell>{formatNumber(row.assault_on_women)}</TableCell>
                                <TableCell>{formatNumber(row.assault_on_modesty)}</TableCell>
                                <TableCell>{formatNumber(row.domestic_violence)}</TableCell>
                                <TableCell>{formatNumber(row.women_trafficking)}</TableCell>
                                <TableCell>{formatNumber(row.total_crimes)}</TableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default StateCrimeDetails;