import React, { useEffect, useContext } from 'react';
import { AppContext } from './Index'
import '../app.css'
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import belvedere from '../data/stops_before_crime_filter.json'

const style = {
  width: "100%",
};

const stopIcons = {}

for (let i=1; i<5; i++) {
  stopIcons[i] = new L.Icon({
    iconUrl: require(`../assets/map/stops/stop${i}.png`),
    iconSize: new L.Point(20, 20),
  });
}

const shuttleIcon = new L.Icon({
  iconUrl: require('../assets/map/van/vanFrontActive.png'),
  iconSize: new L.Point(30, 30),
  popupAnchor: [0, -15],
});

const unassignedRiderIcon = new L.Icon({
  iconUrl: require('../assets/map/passenger/passengerUnassigned1.png'),
  iconSize: new L.Point(20, 20),
  popupAnchor: [0, -15],
})

const assignedRiderIcon = new L.Icon({
  iconUrl: require('../assets/map/passenger/passenger1.png'),
  iconSize: new L.Point(20, 20),
  popupAnchor: [0, -15],
})


function Map({shuttleData, shuttleStops, unassignedData, assignedData}) {
    // create maps
    const mapRef = React.useRef(null);
    const shuttleLayerRef = React.useRef(null);
    const ridersLayerRef = React.useRef(null);
    const assignedLayerRef = React.useRef(null)
    const pathLayerRef = React.useRef(null);
    const markers = React.useRef({})
    const riders = React.useRef({})

    const {state, dispatch} = useContext(AppContext);

    const changeSelectedValue = (newSelected) => {
      dispatch({type: 'UPDATE_SELECTED_SHUTTLE', data: newSelected})
    }

    const changeTabValue = (newTab) => {
      dispatch({type: 'UPDATE_TAB', data: newTab})
    }

    const changeRequestValue = (newRequestSelected) => {
      dispatch({type: 'UPDATE_REQUEST_SELECTED', data: newRequestSelected})
    }

    const changeAssignedValue = (newAssignedSelected) => {
      dispatch({type: 'UPDATE_ASSIGNED_SELECTED', data: newAssignedSelected})
    }

    useEffect(() => {
      //initialize map
      mapRef.current = L.map('map', {
        center: [33.755, -84.285],
        zoom: 16,
        layers: [
          L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution:
              '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          }),
        ]
      })
      .on('click', function() {
        changeSelectedValue('');
        changeRequestValue('');
        changeAssignedValue('');
      });
      
      //move zoomControl to the top right after map is initialized
      mapRef.current.whenReady(function() {
        this.zoomControl.setPosition('topright')
      })

      //instantiate layers
      pathLayerRef.current = L.featureGroup().addTo(mapRef.current);
      shuttleLayerRef.current = L.featureGroup().addTo(mapRef.current);
      ridersLayerRef.current = L.featureGroup().addTo(mapRef.current);
      assignedLayerRef.current = L.featureGroup().addTo(mapRef.current);

    }, []);

    function drawPath(stops) {
      var latlngs = [];
      stops.forEach((stop, index) => {
        latlngs.push(
          [
            belvedere.features.find(e => e.properties.Name === stop).properties.Latitude, 
            belvedere.features.find(e => e.properties.Name === stop).properties.Longitude
          ]
        )
        L.polyline(latlngs, {color: 'black'}).addTo(pathLayerRef.current);

        L.marker(
          [
            belvedere.features.find(e => e.properties.Name === stop).properties.Latitude, 
            belvedere.features.find(e => e.properties.Name === stop).properties.Longitude
          ], {title: stop, icon: stopIcons[index + 1]})
            .bindPopup('stop number: ' + stop)
            .addTo(pathLayerRef.current);
      });
    }



    useEffect( () => {
      ridersLayerRef.current.clearLayers();
      unassignedData.forEach(rider => {
        const marker = new L.marker(rider.latLng, {title: rider.name, icon: unassignedRiderIcon});
        marker.myId = rider.name;
        riders.current[rider.name] = marker;
        marker.addTo(
          ridersLayerRef.current
        );
        //assign which rider is selected
        marker.bindPopup(`<h2> ${rider.name} <h2/>`, {closeButton: false, className: 'popup'})
          .on('click', function() {
            if (!this._popup.isOpen()) {
              //fires when popup is open and you click on marker
              changeRequestValue('');
            } else {
              //fires when popup is closed and you click on marker
              changeRequestValue(rider.name);
              changeTabValue(1);

            }
          })
    })}, [unassignedData])

    useEffect( () => {
      assignedLayerRef.current.clearLayers();
      assignedData.forEach(rider => {
        const latLng = [belvedere.features.find(e => e.properties.Name === rider.pickup).properties.Latitude, 
                        belvedere.features.find(e => e.properties.Name === rider.pickup).properties.Longitude]
        const marker = new L.marker(latLng, {title: rider.name, icon: assignedRiderIcon});
        marker.myId = rider.name;
        riders.current[rider.name] = marker;
        marker.addTo(
          assignedLayerRef.current
        );
        //assign which rider is selected
        marker.bindPopup(`<h2> ${rider.name} <h2/>`, {closeButton: false, className: 'popup'})
          .on('click', function() {
            if (!this._popup.isOpen()) {
              //fires when popup is open and you click on marker
              changeAssignedValue('');
            } else {
              //fires when popup is closed and you click on marker
              changeAssignedValue(rider);
              changeTabValue(0);

            }
          })
    })}, [assignedData])

    useEffect(
      () => {
        shuttleLayerRef.current.clearLayers();

        shuttleData.forEach(shuttle => {
          const marker = new L.marker(shuttle.latLng, {title: shuttle.title, icon: shuttleIcon});
          marker.myId = shuttle.title;
          markers.current[shuttle.title] = marker;
          marker.addTo(
            shuttleLayerRef.current
          );
          //assign which shuttle is selected
          marker.bindPopup(`<h2>Shuttle ${shuttle.title} <h2/>`, {closeButton: false, className: 'popup'})
            .on('click', function() {
              if (!this._popup.isOpen()) {
                //fires when popup is open and you click on marker
                changeSelectedValue('');
              } else {
                //fires when popup is closed and you click on marker
                changeSelectedValue(shuttle.title);
                changeTabValue(0);

              }
            })
          })  
      }, [shuttleData]);

    useEffect(
      () => {
        if (state.selected !== '') {
          pathLayerRef.current.clearLayers();
          markers.current[state.selected].openPopup();
          const id = state.selected;
          drawPath(shuttleStops[id]);
          mapRef.current.setView(markers.current[state.selected]._latlng);
          changeRequestValue('');
          changeAssignedValue('');

        } else {
          pathLayerRef.current.clearLayers();
          shuttleLayerRef.current.eachLayer(marker => marker.closePopup());
        }
      }, [state.selected])

    useEffect(
      () => {     
        if (state.requestSelected !== '') {
          changeSelectedValue('');
          riders.current[state.requestSelected].openPopup();
          mapRef.current.setView(riders.current[state.requestSelected]._latlng);
        } else {
          ridersLayerRef.current.eachLayer(marker => marker.closePopup());
        }
      }, [state.requestSelected])

    useEffect(
      () => {     
        if (state.assignedSelected !== '') {
          // console.log(state.assignedSelected);
          riders.current[state.assignedSelected.name].openPopup();
          mapRef.current.setView(riders.current[state.assignedSelected.name]._latlng);
          changeSelectedValue(state.assignedSelected.driver)
        } else {
        assignedLayerRef.current.eachLayer(marker => marker.closePopup());
        }
      }, [state.assignedSelected])

    return (
      <div>
        <div id="map" style={style}/>
      </div>

    )
}

export default Map;