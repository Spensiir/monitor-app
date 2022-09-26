import React, { useContext, useEffect } from 'react';
import SwipeableViews from 'react-swipeable-views';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Information from './Information'
import Requests from './Requests';
import InformationScroll from './InformationScroll';

import { AppContext } from './Index';

const useStyles = makeStyles((theme) => ({
    root: {
        width: 500,
        height: 200,           
        position: "absolute",
        top: 12,
        left: 12,
        zIndex: 500,
    },
    
  }));

export default function FullWidthTabs({shuttleData, unassignedData}) {

    const {state, dispatch} = useContext(AppContext);

    const changeSelectedValue = (newSelected) => {
        dispatch({type: 'UPDATE_SELECTED_SHUTTLE', data: newSelected})
    }

    useEffect(() => {
        setValue(state.tab)
      }, [state.tab])
  
  const changeTabValue = (newTab) => {
    dispatch({type: 'UPDATE_TAB', data: newTab})
  }

    const classes = useStyles();
    const theme = useTheme();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        if (newValue == 1) {
            changeTabValue(1)
            changeSelectedValue('')
            //console.log(state);
        } else {
            changeTabValue(0)
        }   
    };

    const handleChangeIndex = (index) => {
        setValue(index);
    };

    return (
        <div className={classes.root}>
            <AppBar position="static" color="default">
                <Tabs
                value={value}
                onChange={handleChange}
                indicatorColor="primary"
                textColor="primary"
                variant="fullWidth"
                >
                    <Tab label="Shuttles" value={0}/>
                    <Tab label="Riders" value={1}/>
                </Tabs>
            </AppBar>
            <SwipeableViews
                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                index={value}
                onChangeIndex={handleChangeIndex}
            >
                {/* <Information shuttleData={shuttleData} value={value} index={0} dir={theme.direction}/>
                 */}
                <InformationScroll shuttleData={shuttleData}></InformationScroll>
                <Requests unassignedData={unassignedData} value={value} index={1} dir={theme.direction}/>

            </SwipeableViews>
        </div>
    );
}