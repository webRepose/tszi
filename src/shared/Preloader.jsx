import styles from "../styles/s-shared/preloader.module.scss";

const Preloader = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.loader}></div>
      <p>Загрузка CyberGuard...</p>
    </div>
  );
};

export default Preloader;