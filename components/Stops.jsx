import React from 'react'

import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Paper from "@material-ui/core/Paper"
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { CallMerge } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
    gridTop: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        verticalAlign: "bottom",
        borderTop: "solid lightgrey 1px",
    },
    grid: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        verticalAlign: "bottom",
    },
    // box: {
    //     borderBottom: "solid grey 1px",
    // }
}));

function PreviousStopsRow() {
    const classes = useStyles(); 

    return (
        <React.Fragment>
            <Grid item xs={3}>
                <Box pt={2.5} textAlign="center">
                    <img src={require('../assets/sidebar/previousStop.png')} style={{verticalAlign: "bottom"}}/>
                </Box>
            </Grid>
            <Grid item xs={5} className={classes.grid}>
                <Typography align='left'>
                    <Box fontWeight='fontWeightBold' fontSize='large' pt={6}>
                        Pickup
                    </Box>    
                </Typography> 
            </Grid>
            <Grid item xs={4} className={classes.grid}>
                <Typography align='left'>
                    <Box fontWeight='fontWeightBold' fontSize='large' pt={6}>
                        Dropoff
                    </Box>    
                </Typography> 
            </Grid>
        </React.Fragment>
    )
}

function StopRow({stopInformation, stopNumber, stopState}) {
    const classes = useStyles(); 
    
    let stopIcon;
    if (stopState == "bridge") {
        stopIcon = <Grid item xs={3}>
                        <Box textAlign="center">
                            <img src={require(`../assets/sidebar/sidebarStop${stopNumber}.png`)} style={{verticalAlign: "bottom"}}/>
                        </Box>
                    </Grid>
    } else if (stopState == "end") {
        stopIcon = <Grid item xs={3}>
                        <Box textAlign="center" pb={3}>
                            <img src={require(`../assets/sidebar/sidebarStopEnd${stopNumber}.png`)} style={{verticalAlign: "bottom"}}/>
                        </Box>
                    </Grid>
    }

    return (
      <React.Fragment>
        {stopIcon}
        <Grid item xs={5} className={classes.gridTop}>
            {stopInformation.pickup.map(function(rider) {
                return (
                    <Typography key={rider} align='left'>
                        <Box fontSize="14px">
                            {rider}
                        </Box>
                    </Typography>
                )
            })}
        </Grid>
        <Grid item xs={4} className={classes.gridTop}>
            {stopInformation.dropoff.map(function(rider) {
                return (
                    <Typography key={rider} align='left'>
                        <Box fontSize="14px">
                            {rider}
                        </Box>
                    </Typography>
                )
            })}
            {/* <Typography align='left'>
              <Box fontSize="14px">
                {stopInformation.dropoff.join(", ")}
              </Box>
            </Typography>     */}
        </Grid>
      </React.Fragment>
    );
  }


export default function Stops({shuttle}) {
    return (
        <Paper>
            <Grid container item xs={12} spacing={0}>
                <PreviousStopsRow/>       
            {
                shuttle.stops.map(function(stop, i) {
                    if (i == (shuttle.stops.length - 1)) {     
                        return <StopRow key={i} stopInformation={stop} stopNumber={(i+1)} stopState="end"/>
                    } else {
                        return <StopRow key={i} stopInformation={stop} stopNumber={(i+1)} stopState="bridge"/>
                    }

                })
            }
            </Grid>
        </Paper>
    )
}
