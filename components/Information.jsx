import React, { useContext, useEffect } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import classNames from 'classnames';

import PassengerTable from './PassengerTable';
import Stops from './Stops'
import { AppContext } from './Index'


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  grid: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    verticalAlign: "bottom",
    //borderBottom: "solid black 1px"
  },
  heading: {
    fontSize: theme.typography.pxToRem(20),
    flex: '1',
    flexShrink: 0,
    display: "flex",
    alignItems: "center"
  },
  label: {
    fontSize: theme.typography.pxToRem(20),
    // textAlign: "center"
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    flex: '2',
    color: theme.palette.text.secondary,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  summary: {
    backgroundColor: "#DCF5EF",
    "&:hover": {
        backgroundColor: "#A8F1E6"
    } 
  },
  opened: {
    border: "5px solid black",
    backgroundColor: "#D4ECE6",
      "&:hover": {
        backgroundColor: "#A8F1E6"
      },
    maxHeight: "300px"
  },
  collapsed: {
    border: "none",
    backgroundColor: "white",
      "&:hover": {
        backgroundColor: "#A8F1E6"
      }  
  },
  passenger: { 
    background: "lightgreen",
  },
  rider: {
    background: "#EFC275"
  },
  entry: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    border: "1px dashed black",
  }, 
  typography: {
    textAlign: "middle"
  }

}));

const addShuttle = (shuttleData) => {
    const classes = useStyles();

    const [expanded, setExpanded] = React.useState(false);
    const {state, dispatch} = useContext(AppContext);
    
    //function to call dispatch function to update appcontext state
    const changeSelectedValue = (newSelected) => {
      dispatch({type: 'UPDATE_SELECTED_SHUTTLE', data: newSelected})
    }
    
    //what to do when state changes in another component
    useEffect(() => {
      setExpanded(state.selected)
    }, [state])

    const handleChange = (panel) => (event, isExpanded) => {
      setExpanded(isExpanded ? panel : false);
      changeSelectedValue((panel == state.selected ? '' : panel));
    }

    const opened = classNames(classes.opened,)
    
    const collapsed = classNames(classes.collapsed, )

    const shuttles = shuttleData.map(
        function (shuttle) {
            return (
                <Accordion 
                  key={shuttle.title} 
                  className={expanded === shuttle.title ? opened : collapsed} 
                  expanded={expanded === shuttle.title} 
                  onChange={handleChange(shuttle.title)}>
                    <AccordionSummary
                    className={classes.summary}
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                    >
                      <Typography className={classes.heading}>Shuttle {shuttle.title}</Typography>
                      <Typography className={classes.secondaryHeading}>{shuttle.driver} </Typography>
                      <Typography className={classes.secondaryHeading}>Active</Typography>

                    </AccordionSummary>
                    <PassengerTable list={shuttle.riders}></PassengerTable>
                    <Stops shuttle={shuttle}/>
                </Accordion>
            )
        }
    )
    return <div>
        {shuttles}
    </div>
}

export default function Information({shuttleData}) {
    return (
        <div>
          {addShuttle(shuttleData)}
        </div>
    ) 
  };

  
