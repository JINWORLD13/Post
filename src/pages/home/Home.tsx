import styles from "./Home.module.scss";

const Home = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Welcome</h1>
        <p className={styles.subtitle}>
          Explore your data with beautiful charts and manage your posts
        </p>
        <div className={styles.features}>
          <div className={styles.featureCard}>
            <div className={styles.icon}>📊</div>
            <h3>Charts</h3>
            <p>Visualize your data with interactive charts</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.icon}>📝</div>
            <h3>Posts</h3>
            <p>Create and manage your posts easily</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.icon}>🔐</div>
            <h3>Secure</h3>
            <p>Safe and secure authentication system</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;