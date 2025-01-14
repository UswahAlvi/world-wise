import React, { useEffect, useState } from 'react'
import styles from './Map.module.css'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import {useCities} from '../contexts/CitiesContext'
import { useGeoLocation } from '../hooks/useGeoLocation'
import { useUrlPosition } from '../hooks/useUrlPosition'
import Button from './Button';

function Map() {
  const {cities}=useCities();
  const [mapPosition,setMapPosition]=useState([40,0]);
  const {lat,lng}=useUrlPosition();
  useEffect(function(){
    if(lat && lng ) setMapPosition([lat,lng]);
  },[lat,lng])
  const {isLoading:isLocationLoading,
        position:geoLocation,
        getLocation:getGeoLocation}=useGeoLocation();

  useEffect(function(){
    if(geoLocation) setMapPosition([geoLocation.lat,geoLocation.lng])
  },[geoLocation]);

  return ( 
    <div className={styles.mapContainer}>
      {!geoLocation && <Button type='position' onClick={()=>getGeoLocation()}>
        {isLocationLoading?'loading...':'Get my Location'}
      </Button>}
      <MapContainer center={mapPosition} zoom={6} scrollWheelZoom={true} className={styles.map}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {cities.map((city)=>(
      <Marker position={[city.position.lat,city.position.lng]} key={city.id}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
      ))}
      
      <ChangeCenter position={mapPosition}/>
      <DetectClick />
      </MapContainer>
    </div>
  )
}
function ChangeCenter({position}){
  const map=useMap();
  map.setView(position);
  return null;
}
function DetectClick(){
  const navigate=useNavigate();
  useMapEvents({
    click: (e)=>{
      navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`)
    },
  });
}
export default Map;