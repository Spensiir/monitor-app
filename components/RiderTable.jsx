import React, { useState, useContext, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import { AppContext } from './Index'

const useStyles = makeStyles({
    table: {
      width: '100%',
    },
    cell: {
      backgroundColor: "white",
      "&:hover": {
        backgroundColor: "#A8F1E6"
      }  
    },
    selected: {
      backgroundColor: "#A8F1E6"
    },
    labels: {
      fontWeight: "bold"
    }
  });

// function createData(name, pickup, dropoff, waittime, transittime) {
//     return { name, calories, fat, carbs, protein };
// }
  
// const rows = [
//     createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
//     createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
//     createData('Eclair', 262, 16.0, 24, 6.0),
//     createData('Cupcake', 305, 3.7, 67, 4.3),
//     createData('Gingerbread', 356, 16.0, 49, 3.9),
//     ];


export default function RiderTable({list}) {
        const classes = useStyles();

        const [selectedRow, setSelectedRow] = useState('')

        const {state, dispatch} = useContext(AppContext);
    
        //function to call dispatch function to update appcontext state
        const changeRequestValue = (newRequestSelected) => {
          dispatch({type: 'UPDATE_REQUEST_SELECTED', data: newRequestSelected})
        }
        
        //what to do when state changes in another component
        useEffect(() => {
          setSelectedRow(state.requestSelected)
        }, [state.requestSelected])

        const tableClick = (rider) => {
          changeRequestValue(rider);
        }

      
        return (
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell className={classes.labels}>Name</TableCell>
                  <TableCell className={classes.labels} align="right">Pickup</TableCell>
                  <TableCell className={classes.labels} align="right">Dropoff</TableCell>
                  <TableCell className={classes.labels} align="right">Wait&nbsp;Time</TableCell>
                  <TableCell className={classes.labels} align="right">Transit&nbsp;Time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  list.map(function(rider) {
                    return ( 
                      <TableRow key={rider.name} onClick={() => tableClick(rider.name)} className={selectedRow == rider.name ? classes.selected : classes.cell}>
                        <TableCell component="th" scope="row">{rider.name}</TableCell>
                        <TableCell align="right">{rider.pickup}</TableCell>
                        <TableCell align="right">{rider.dropoff}</TableCell>
                        <TableCell align="right">{rider.wait_time}</TableCell>
                        <TableCell align="right">{rider.transit_time}</TableCell>
                      </TableRow>
                    )
                  })
                }
              </TableBody>
            </Table>
          </TableContainer>
        );
}