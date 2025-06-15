// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from "react";

import "react-datepicker/dist/react-datepicker.css";
import styles from "./Form.module.css";
import Button from './Button'
import BackButton from "./BackButton";
import { useUrlPosition } from '../hooks/useUrlPosition'
import {useCities} from '../contexts/CitiesContext'
import Spinner from "./Spinner";
import Message from "./Message";
import DatePicker from "react-datepicker";
import { useNavigate } from "react-router-dom";


function convertToEmoji(countryCode) {
  // Ensure the input is in uppercase
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt()); // Regional indicator symbols start at 127397

  return String.fromCodePoint(...codePoints);
}



export default function Form() {
  const [isLoadingGeoCode,setIsLoadingGeoCode]=useState(false);
  const [geoCodeError,setGeoCodeError]=useState('');
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [emoji,setEmoji]=useState("");
  const {lat,lng}=useUrlPosition();
  const navigate=useNavigate();
  const {createCity,isLoading}=useCities();

  useEffect(function(){
    if(!lat && !lng ) return ;
    async function fetchCityData(){
      try{
        setGeoCodeError('')
        setIsLoadingGeoCode(true);
        const res=await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}`);
        const data=await res.json();
        if(!data.countryCode){
          throw new Error('That does not seem to be city.Click somewhere else');
        }
        setCityName(data.city || data.locality || "");
        setCountry(data.countryName);
        setEmoji(convertToEmoji(data.countryCode));
      }catch(err){
        setGeoCodeError(err.message);
      }finally{
        setIsLoadingGeoCode(false);
      }
    }
    fetchCityData();
  },[lat,lng])

  async function handleSubmit(e){
    e.preventDefault();
    if(!cityName || !date) return;
    const newCity={
      cityName,
      country,
      emoji,
      dateVisited: date,
      notes,
      position:{
        lat,
        lng
      }
    }
    console.log(newCity)
    await createCity(newCity);
    navigate('/app/cities');
  }
  if(!lat && !lng) return<Message message='Start by clicking somewhere on the map'/>
  if(isLoadingGeoCode) return <Spinner/>
  if(geoCodeError) return <Message message={geoCodeError}/>
  return (
    <form className={`${styles.form} ${isLoading?'styles.loading':''}`} onSubmit={handleSubmit}>
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        {/* <input
          id="date"
          onChange={(e) => setDate(e.target.value)}
          value={date}
        /> */}
        <DatePicker id='date' onChange={(date) => setDate(date)} selected={date} dateFormat='dd/MM/yyyy'/>
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type='primary'>Add</Button>
        <BackButton />
      </div>
    </form>
  );
}
