import styles from "./Product.module.css";
import PageNav from '../components/PageNav'

export default function Product() {
  return (
    <main className={styles.product}>
      <PageNav />
      <section>
        <img
          src="img-1.jpg"
          alt="Person exploring a mountain landscape at sunset"
        />
        <div>
          <h2>About WorldWide</h2>
          <p>
            WorldWide is your personal travel log and map companion. Whether you're
            a casual explorer or a seasoned adventurer, our app helps you mark the cities you've visited, store memories,
            and plan your future journeys — all on a sleek interactive map.
          </p>
          <p>
            With features like geolocation tagging, trip notes, and emoji flags for each country, WorldWide turns your travel history into a colorful visual story.
            Say goodbye to forgetting where you've been — and hello to exploring with purpose.
          </p>
        </div>
      </section>
    </main>
  );
}
