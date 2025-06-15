// Uses the same styles as Product
import styles from "./Product.module.css";
import PageNav from '../components/PageNav';

export default function Product() {
  return (
    <main className={styles.product}>
      <PageNav />
      <section>
        <div>
          <h2>
            Free to use.
            <br />
            More features coming soon.
          </h2>
          <p>
            WorldWide is completely free — no sign-up fees, no subscriptions. Just start exploring and logging your favorite cities right away.
          </p>
          <p>
            We're working on new features to make your travel journaling even better. Stay tuned for updates and enhancements in the near future.
          </p>
        </div>
        <img src="img-2.jpg" alt="overview of a large city with skyscrapers" />
      </section>
    </main>
  );
}
