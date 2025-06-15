import { Link } from 'react-router-dom';
import styles from './CityItem.module.css'
import { useCities } from '../contexts/CitiesContext';

export default function CityItem({ city }) {
  const formatDate = (date) =>
    new Intl.DateTimeFormat("en", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(date));

  const { cityName, dateVisited, position, _id, emoji } = city;
  const { currentCity, deleteCity } = useCities();

  function handleDelete(e) {
    e.preventDefault();
    deleteCity(_id);
  }

  return (
    <div>
      <Link
        className={`${styles.cityItem} ${_id === currentCity._id ? styles["cityItem--active"] : ""}`}
        to={`${_id}?lat=${position.lat}&lng=${position.lng}`}
      >
        <span className={styles.emoji}>{emoji}</span>
        <h3 className={styles.name}>{cityName}</h3>
        <time className={styles.date}>({formatDate(dateVisited)})</time>
        <button className={styles.deleteBtn} onClick={handleDelete}>
          &times;
        </button>
      </Link>
    </div>
  );
}
