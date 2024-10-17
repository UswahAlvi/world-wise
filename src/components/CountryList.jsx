import CountryItem from './CountryItem'
import styles from './CountryList.module.css'
import Spinner from './Spinner'
import Message from './Message'
import { useCities } from '../contexts/CitiesContext.jsx'

export default function CityList() {
  const {cities,isLoading}=useCities();
  if(isLoading) return <Spinner />
  if(!cities.length) return <Message message="Add your first city by cicking on a city on the map"/>

  const countries=cities.reduce((accumulator,currentCity)=>{
    if(!accumulator.map((el)=>(el.country)).includes(currentCity.country))
        return [...accumulator,{country:currentCity.country, emoji:currentCity.emoji}]
    else return accumulator
  },[])

  return(
    <div className={styles.countryList}>
        {countries.map(country=><CountryItem country={country} key={country.country}/>)}
    </div>
  )
}
