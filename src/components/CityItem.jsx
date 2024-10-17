import { Link } from 'react-router-dom';
import styles from './CityItem.module.css'
import { useCities } from '../contexts/CitiesContext';

export default function CityItem({city}) {
    const formatDate = (date) =>
        new Intl.DateTimeFormat("en", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }).format(new Date(date));
    console.log(city);
    const {cityName,date,position,id,emoji}=city;
    const {currentCity,deleteCity}=useCities();
    function handleDelete(e){
      e.preventDefault();
      deleteCity(id);
    }
  return (
    <div >
      <Link className={`${styles.cityItem} ${id===currentCity.id?styles['cityItem--active']:''}`} to={`${id}?lat=${position.lat}&lng=${position.lng}`} >
        <span className={styles.emoji}>{emoji}</span>
        <h3 className={styles.name}>{cityName}</h3>
        <time className={styles.date}>({formatDate(date)})</time>
        <button className={styles.deleteBtn} onClick={handleDelete}>&times;</button>
        </Link>
    </div>
  )
}
