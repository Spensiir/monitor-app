import React, { useState, useContext, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import RiderTable from './RiderTable';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import classNames from 'classnames'
import '@fontsource/roboto'

import { AppContext } from './Index'

const useStyles = makeStyles((theme) => ({
    heading: {
        fontSize: theme.typography.pxToRem(20),
        flexShrink: 0,
        display: "flex",
        alignItems: "center"
      },
    opened: {
        border: "5px solid black",
        borderRadius: "10px",

    },
    collapsed: {
        border: "none",
        backgroundColor: "white",
            "&:hover": {
            backgroundColor: "#A8F1E6"
            }  
    },
    summary: {
        backgroundColor: "#DCF5EF",
        "&:hover": {
            backgroundColor: "#A8F1E6"
        } 
    },
    rider: {
        height: "32px",
        border: "1px solid black", 
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",  
        background: "#E29C9C"
      }
}));

const addUnassigned = (unassignedData) => {
    const classes = useStyles();
    const unassigned = unassignedData.map(
        function(rider) {
            return (
                <AccordionDetails key={rider.name} className={classes.rider}>
                    <Typography>
                        {rider.name}
                    </Typography>
                    <Typography>
                        {rider.request_time}
                    </Typography>
                </AccordionDetails>
            )
        }
    )
    return <div>
        {unassigned}
    </div>;
}

export default function Requests({unassignedData}) {
    const classes = useStyles();

    const [expanded, setExpanded] = useState(false);

    const {state, dispatch} = useContext(AppContext);
    
    //function to call dispatch function to update appcontext state
    const changeRequestValue = (newRequestSelected) => {
      dispatch({type: 'UPDATE_REQUEST_SELECTED', data: newRequestSelected})
    }
    
    //what to do when state changes in another component
    useEffect(() => {
        if (state.requestSelected !== '') {
            setExpanded(true);
        }
    }, [state.requestSelected])

    const handleChange = () => (event, isExpanded) => {
        setExpanded(isExpanded);
        if (!isExpanded) {
            changeRequestValue('')
        }
    }

    return (
        <div>
            <Accordion 
                key={"opened"} 
                className={expanded ? classes.opened : classes.collapsed} 
                expanded={expanded} 
                onChange={handleChange()}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                    className={classes.summary}
                    >
                    <Typography className={classes.heading}>Unassigned Riders</Typography>
                </AccordionSummary>
                <RiderTable list={unassignedData}/>
            </Accordion>        
        </div>
    ) 
  };