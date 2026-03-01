import { Link } from "react-router-dom";
import styles from "../styles/s-pages/home.module.scss";

const Home = () => {
  return (
    <main className={styles.wrapper}>
      
      {/* HERO */}
      <section className={styles.hero}>
        <h1>CyberGuard DSS</h1>
        <p className={styles.subtitle}>
          Информационная система поддержки принятия решений
          по выбору технических средств защиты информации
        </p>

        <div className={styles.actions}>
          <Link to="/analyzer" className={styles.primaryBtn}>
            Перейти к анализатору
          </Link>

          <Link to="/tools" className={styles.secondaryBtn}>
            Открыть каталог ТСЗИ
          </Link>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className={styles.process}>
        <h2>Принцип работы системы</h2>

        <div className={styles.steps}>
          <div className={styles.step}>
            <span>1</span>
            <h3>Ввод параметров</h3>
            <p>Определение уровня угроз, бюджета и характеристик объекта защиты.</p>
          </div>

          <div className={styles.step}>
            <span>2</span>
            <h3>Анализ требований</h3>
            <p>Обработка входных данных и сопоставление с параметрами ТСЗИ.</p>
          </div>

          <div className={styles.step}>
            <span>3</span>
            <h3>Формирование рекомендаций</h3>
            <p>Вывод оптимального перечня технических средств защиты.</p>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className={styles.features}>
        <div className={styles.card}>
          <h3>Комплексный подход</h3>
          <p>
            Учитываются нормативные требования, сценарии угроз и бюджетные ограничения.
          </p>
        </div>

        <div className={styles.card}>
          <h3>Снижение ошибок</h3>
          <p>
            Минимизация человеческого фактора при выборе средств защиты.
          </p>
        </div>

        <div className={styles.card}>
          <h3>Соответствие стандартам</h3>
          <p>
            Поддержка нормативной базы в области информационной безопасности.
          </p>
        </div>
      </section>

      {/* PURPOSE */}
      <section className={styles.textBlock}>
        <h2>Назначение системы</h2>
        <p>
          CyberGuard DSS предназначена для автоматизации процесса подбора
          технических средств защиты информации на основе заданных требований.
        </p>
        <p>
          Использование системы повышает обоснованность принимаемых решений
          и сокращает время анализа.
        </p>
      </section>

    </main>
  );
};

export default Home;