import styles from "./Home.module.scss";

const Home = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>환영합니다</h1>
        <p className={styles.subtitle}>
          아름다운 차트로 데이터를 탐색하고 게시글을 관리하세요
        </p>
        <div className={styles.features}>
          <div className={styles.featureCard}>
            <div className={styles.icon}>📊</div>
            <h3>차트</h3>
            <p>인터랙티브 차트로 데이터를 시각화하세요</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.icon}>📝</div>
            <h3>게시글</h3>
            <p>게시글을 쉽게 생성하고 관리하세요</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.icon}>🔐</div>
            <h3>보안</h3>
            <p>안전하고 보안된 인증 시스템</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;