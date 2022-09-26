import React, {useState, useContext, useEffect} from 'react'
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import PassengerTable from './PassengerTable'
import { makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListSubheader from '@material-ui/core/ListSubheader';
import InputLabel from '@material-ui/core/InputLabel'
import Stops from './Stops'
import { AppContext } from './Index'

const useStyles = makeStyles((theme) => ({
    root: {
        maxHeight: "80vh",

    },
    formControl: {
        width: "100%",
        backgroundColor:"#C0EDEF",
        opacity: "70%"
    },
    hidden: {
        display: "none"
    }
}))

export default function InformationScroll({shuttleData}) {
    const [shuttleSelected, setShuttleSelected] = useState("1")
    const {state, dispatch} = useContext(AppContext);
    
    //function to call dispatch function to update appcontext state
    const changeSelectedValue = (newSelected) => {
      dispatch({type: 'UPDATE_SELECTED_SHUTTLE', data: newSelected})
    }
    
    //what to do when state changes in another component
    useEffect(() => {
      setShuttleSelected(state.selected)
    }, [state])

    const classes = useStyles() 

    const handleChange = (event) => {
        setShuttleSelected(event.target.value);
        changeSelectedValue(event.target.value);
    };

    return (
            <List className={classes.root}>
                <ListSubheader>
                    <FormControl variant="filled" className={classes.formControl}>
                        <InputLabel id="demo-simple-select-label">Shuttle</InputLabel>
                        <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={shuttleSelected}
                        onChange={handleChange}
                        >
                            {shuttleData.map(function(shuttle) {
                                return <MenuItem value={shuttle.title}>Shuttle {shuttle.title}</MenuItem>
                            })}
                        </Select>
                    </FormControl> 
                </ListSubheader>
                {
                    shuttleData.map(function(shuttle) {
                        return (
                            <div className={(shuttle.title == shuttleSelected) ? "" : classes.hidden}>
                                <ListItem key={shuttle.title + "1"}>
                                    <PassengerTable list={shuttle.riders}></PassengerTable>            
                                </ListItem>
                                <ListItem key={shuttle.title + "2"}>
                                    <Stops shuttle={shuttle}/>
                                </ListItem>
                            </div>
                        )
                    })
                }       
            </List>
    )
}