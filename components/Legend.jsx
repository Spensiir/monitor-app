import React from 'react'

import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Paper from "@material-ui/core/Paper"
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
    root: {
        width: 250,
        height: 300,           
        position: "absolute",
        bottom: 12,
        right: 12,
        zIndex: 500,
    },
    center: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        verticalAlign: "bottom",
    },
    icon: {
        height: 30,
        width: "auto"
    }
    
  }));

function Label({label}) {
    const classes = useStyles();

    return (

        <Grid item className={classes.center} xs={9}>
            <Typography align='left'>
                <Box pl={2}>
                    {label}
                </Box>    
            </Typography> 
        </Grid>

    )
}

function Icon({path}) {
    const classes = useStyles();

    return (

        <Grid item className={classes.center} item xs={3}>
            <Box textAlign="center">
            {console.log(typeof path)}
                <img className={classes.icon} src={require(`../assets${path}`)}/>
            </Box>
        </Grid>

    )
}

function Row({label, path}) {
    const classes = useStyles();

    return (
        <React.Fragment>
            <Grid item className={classes.center} item xs={3}>
                <Box textAlign="center">
                    <img className={classes.icon} src={require(`../assets${path}`)}/>
                </Box>
            </Grid>
            <Grid item className={classes.center} xs={9}>
                <Typography align='left'>
                    <Box>
                        {label}
                    </Box>    
                </Typography> 
            </Grid>
        </React.Fragment>
    )
}

export default function Legend() {
    const classes = useStyles();
    return (
        <Paper className={classes.root}>
            <Grid container item xs={12} spacing={1}>
                <Grid item xs={12}>
                    <Typography align='center'>
                        <Box fontWeight='fontWeightBold' fontSize='large' py={2}>
                            Legend
                        </Box>    
                    </Typography> 
                </Grid>

                <Row label="Assigned Passenger" path="/map/passenger/passenger1.png"/>
                <Row label="Unassigned Passenger" path="/map/passenger/passengerUnassigned1.png"/>
                <Row label="Active Van" path="/map/van/vanFrontActive.png"/>
                <Row label="Inactive Van" path="/map/van/vanFrontBreak.png"/>
                <Row label="Late Van" path="/map/van/vanFrontLate.png"/>
            </Grid>
        </Paper>
    )
}