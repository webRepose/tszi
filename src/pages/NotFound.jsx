import { Link } from "react-router-dom";
import styles from "../styles/s-pages/notfound.module.scss";

const NotFound = () => {
  return (
    <section className={styles.wrapper}>
      <div className={styles.code}>404</div>

      <h1 className={styles.title}>
        Страница не найдена
      </h1>

      <p className={styles.description}>
        Запрашиваемый ресурс не существует либо был удалён.
        <br />
        Возможно, вы перешли по устаревшей ссылке или ввели неверный адрес.
      </p>

      <div className={styles.actions}>
        <Link to="/" className={styles.primary}>
          На главную
        </Link>

        <Link to="/analyzer" className={styles.secondary}>
          Перейти к анализу ТСЗИ
        </Link>
      </div>

      <div className={styles.hint}>
        CyberGuard · Система поддержки принятия решений в области ИБ
      </div>
    </section>
  );
};

export default NotFound;
