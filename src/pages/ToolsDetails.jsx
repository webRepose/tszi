import { useParams, useNavigate, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import styles from "../styles/s-pages/tools.module.scss";

const ToolsDetails = () => {
  const { id } = useParams();
  const [tool, setTool] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadTool = async () => {
      const snapshot = await getDoc(doc(db, "tools", id));
      if (snapshot.exists()) {
        setTool(snapshot.data());
      }
    };
    loadTool();
  }, [id]);

  if (!tool) return <div>Загрузка...</div>;

  const getAvgRating = () => {
    if (!tool.rating) return 0;
    const values = Object.values(tool.rating);
    return (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);
  };

  return (
    <div className={styles.details}>
      <div className={styles.breadcrumbs}>
        <button onClick={() => navigate(-1)} className={styles.backBtn}>
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z"/></svg>
        </button>

        <div className={styles.path}>
          <Link to="/">Главная</Link>
          <span>/</span>
          <Link to="/tools">Каталог ТСЗИ</Link>
          <span>/</span>
          <span>{tool.name}</span>
        </div>
      </div>
      <div className={styles.hero}>
        <div className={styles.imageWrapper}>
          <img src={tool.imageUrl || "/placeholder.png"} alt={tool.name} />
        </div>

        <div className={styles.summary}>
          <h1>{tool.name}</h1>
          <p className={styles.vendor}>{tool.vendor}</p>

          <div className={styles.badges}>
            <span className={`${styles.badge} ${styles[tool.category]}`}>
              {tool.category}
            </span>

            <span className={`${styles.badge} ${styles[tool.minThreat]}`}>
              {tool.minThreat}
            </span>

            <span className={styles.budget}>
              Бюджет: {tool.budgetLevel}
            </span>
          </div>

          <div className={styles.price}>{tool.price}</div>

          <div className={styles.ratingBlock}>
            ⭐ Средняя оценка: {getAvgRating()} / 5
          </div>
        </div>
      </div>

      <div className={styles.contentGrid}>
        <div className={styles.main}>
          <div className={styles.card}>
            <h2>Описание</h2>
            <p>{tool.fullDescription || tool.description}</p>
          </div>

          <div className={styles.card}>
            <h2>Функциональные возможности</h2>
            <ul>
              {tool.features?.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </div>

          {tool.expertComment && (
            <div className={styles.card}>
              <h2>Экспертная оценка</h2>
              <p>{tool.expertComment}</p>
            </div>
          )}
        </div>

        <div className={styles.sidebar}>
          <div className={styles.infoCard}>
            <h3>Параметры подбора</h3>

            <p><strong>Целевой сегмент:</strong> {tool.targetObjects?.join(", ")}</p>
            <p><strong>Тип внедрения:</strong> {tool.deployment?.join(", ")}</p>
            <p><strong>Мин. сотрудников:</strong> {tool.minEmployees}</p>
            <p><strong>Криптография:</strong> {tool.supportsCrypto ? "Да" : "Нет"}</p>
            <p><strong>Стандарты:</strong> {tool.standards?.join(", ")}</p>
            <p><strong>Страна:</strong> {tool.country}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolsDetails;