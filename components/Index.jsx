//import react, data, and components
import React, { useReducer, useState } from 'react';

import belvedere from '../data/stops_before_crime_filter.json'
import fake_data from '../data/fake_shuttle.json'

import Tabs from './Tabs'
import Map from './Map'
import Legend from './Legend'

//Create context object in order to synchronize states between child components
export const AppContext = React.createContext();

//Set up initial states that will be shared between the child components
const initialState = {
  selected: '1',
  tab: 0,
  requestSelected: '',
  assignedSelected: ''
}

//define the different cases for altering the shared state
function reducer(state, action) {
  switch (action.type) {
    case 'UPDATE_SELECTED_SHUTTLE':
      return {
        ...state,
        selected: action.data
      };
    case 'UPDATE_TAB':
      return {
        ...state,
        tab: action.data
      };
    case 'UPDATE_REQUEST_SELECTED':
      return {
        ...state,
        requestSelected: action.data
      }
    case 'UPDATE_ASSIGNED_SELECTED':
      return {
        ...state,
        assignedSelected: action.data
      }
    default:
      return initialState;
  }
}

function Index() {

  //Setting up a bunch of fake data. 
  //The real version will instantiate the data states by hitting the backend server for the data
  const initialStopData = [];
  belvedere.features.forEach(stop => {
    initialStopData.push({
      latLng: {
        lat: stop.properties.Latitude,
        lng: stop.properties.Longitude
      },
      title: stop.properties.Name
    })
  });

  const initialFakeShuttleData = [];
  fake_data.shuttles.forEach(shuttle => {
    //hacky combine passengers and assigned riders lists into one, data should format riders so that passengers and assigned riders are in one list with a property called "status" that distinguishes the two.
    let riders = shuttle.passengers.concat(shuttle.assigned_riders)
    initialFakeShuttleData.push({
      latLng: {
        lat: shuttle.latLng.latitude,
        lng: shuttle.latLng.longitude
      },
      title: shuttle.name,
      riders: riders,
      driver: shuttle.driver,
      stops: shuttle.stops,
    })
  });

  const initialAssignedData = [];
  fake_data.shuttles.forEach(shuttle => {
    shuttle.assigned_riders.forEach(rider => {
      rider["driver"] = shuttle.name;
      initialAssignedData.push(rider);
    })
    
  })
  
  const initialShuttleStops = {};
  fake_data.shuttles.map(function(shuttle) {
    let shuttleStops = [];
    shuttle.stops.map(function(stop) {
      shuttleStops.push(stop.stop)
    })
    initialShuttleStops[shuttle.name] = shuttleStops
  })

  //setStates for data. Currently instantiating with fake data created above. These useState() calls will use real data once we have access to the backend server. We will then be using the setData functions to update the data on an interval. 
  const [shuttleStops, setShuttleStopsData] = useState(initialShuttleStops);
  const [shuttleData, setShuttleData] = useState(initialFakeShuttleData);
  const [unassignedData, setUnassignedData] = useState(fake_data.unassigned_riders);
  const [assignedData, setAssignedData] = useState(initialAssignedData);
  const [stopsData, setStopsData] = useState(initialStopData);

  //data that will be shared among sibling components
  const [state, dispatch] = useReducer(reducer, initialState)

  
  return (
    <AppContext.Provider value={{state, dispatch}}>
      <Map 
        shuttleData={shuttleData} 
        shuttleStops={shuttleStops} 
        unassignedData={unassignedData}
        assignedData={assignedData}
        />
      <Tabs 
        shuttleData={shuttleData} 
        unassignedData={unassignedData}

        />
      <Legend/>
    </AppContext.Provider>    
    );
  }

export default Index;
