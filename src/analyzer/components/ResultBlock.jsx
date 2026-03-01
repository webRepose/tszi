import { useNavigate } from "react-router-dom";
import styles from "./resultblock.module.scss";

const ResultBlock = ({ data }) => {
  const navigate = useNavigate();

  return (
    <div className={styles.result}>
      <h3>Рекомендуемые ТСЗИ:</h3>

      <div className={styles.grid}>
        {data.map((tool, index) => (
          <div
            key={tool.id}
            className={`${styles.card} ${
              index === 0 ? styles.best : ""
            }`}
            onClick={() => navigate(`/tools/${tool.id}`)}
          >
            {tool.imageUrl && (
              <img
                src={tool.imageUrl}
                alt={tool.name}
                className={styles.image}
              />
            )}

            <div className={styles.header}>
              <h4>{tool.name}</h4>

              <span
                className={`${styles.level} ${styles[tool.minThreat]}`}
              >
                {tool.minThreat.toUpperCase()}
              </span>
            </div>

            <div className={styles.meta}>
              <span
                className={`${styles.badge} ${styles[tool.category]}`}
              >
                {tool.category}
              </span>

              {tool.supportsCrypto && (
                <span className={styles.crypto}>Crypto</span>
              )}
            </div>

            <p className={styles.description}>
              {tool.description?.slice(0, 100) ||
                "Описание отсутствует"}
            </p>

            <div className={styles.score}>
              Индекс соответствия: {tool.score}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultBlock;