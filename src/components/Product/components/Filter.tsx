import React, { useCallback, useState } from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {
    Button,
    Box,
    CardActions,
    Typography,
    FormGroup,
    FormControlLabel,
    Checkbox
} from "@mui/material";

/**
 * A component to allow users to filter for certain items.
 */
export default function Filter() {
    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

    /**
     * Callback used to either add or remove a filter based on user input.
     */
    const addFilter = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        if (selectedFilters.includes(event.target.value)) {
            return setSelectedFilters(selectedFilters.filter((value) => value !== event.target.value));
        }

        return setSelectedFilters([...selectedFilters, event.target.value]);
    }, [selectedFilters]);

    /**
     * Function used to apply the selectedFilters and retrieve a set products that relate
     * to them.
     * TODO: Implement API in order to apply filters.
     */
    const applyFilter = () => {
        console.log(selectedFilters);
    };

    /**
     * Filter related information to display to the user.
     */
    const displayCard = (
        <React.Fragment>
            <CardContent>
                <Typography variant="h3">Filter</Typography>
                <FormGroup>
                    <FormControlLabel value="filter1" control={<Checkbox onChange={addFilter}/>} label="Filter 1" />
                    <FormControlLabel control={<Checkbox />} label="Filter 2" />
                    <FormControlLabel control={<Checkbox />} label="Filter 3" />
                </FormGroup>
            </CardContent>
            <CardActions>
                <Button 
                    variant="outlined" 
                    size="medium" 
                    sx={{width: 1}} 
                    onClick={() => applyFilter()}
                >
                    Apply filter
                </Button>
            </CardActions>
        </React.Fragment>
    );

    return (
        <Box sx={{ minWidth: 275 }}>
            <Card variant="outlined">{displayCard}</Card>
        </Box>
    )
}
