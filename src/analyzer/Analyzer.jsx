import { useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import styles from "../styles/s-analyzer/analyzer.module.scss";
import { useNavigate, Link } from "react-router-dom";
import ResultBlock from './components/ResultBlock';

const Analyzer = () => {
  const navigate = useNavigate();

  const [category, setCategory] = useState("");
  const [threatLevel, setThreatLevel] = useState("");
  const [requireCrypto, setRequireCrypto] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState("any");
  const [results, setResults] = useState([]);
  const [analyzed, setAnalyzed] = useState(false);

  const levels = { low: 1, medium: 2, high: 3 };

  const handleAnalyze = async () => {
  const nothingSelected =
    !category &&
    !threatLevel &&
    !requireCrypto &&
    selectedBudget === "any";

  if (nothingSelected) {
    setResults([]);
    setAnalyzed("emptyFilters");
    return;
  }
    const snapshot = await getDocs(collection(db, "tools"));
    const tools = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

const scored = tools.map(tool => {
  let score = 0;
  let weightSum = 0;

  // Категория (вес 3)
  if (category) {
    weightSum += 3;
    if (tool.category === category) score += 3;
  }

  // Уровень угроз (вес 4)
  if (threatLevel) {
    weightSum += 4;
    if (levels[tool.minThreat] >= levels[threatLevel]) {
      score += 4;
    }
  }

  // Криптография (вес 2)
  if (requireCrypto) {
    weightSum += 2;
    if (tool.supportsCrypto) score += 2;
  }

  // Бюджет (вес 2)
  if (selectedBudget !== "any") {
    weightSum += 2;
    if (tool.budgetLevel === selectedBudget) score += 2;
  }

  const normalizedScore =
    weightSum === 0 ? 0 : Math.round((score / weightSum) * 100);

  return { ...tool, score: normalizedScore };
});

    const filtered = scored
      .filter(tool => tool.score > 0)
      .sort((a, b) => b.score - a.score);

    setResults(filtered);
    setAnalyzed(true);
  };

  return (
    <section className={styles.analyzer}>
      <div className={styles.header}>
        <button onClick={() => navigate(-1)} className={styles.backBtn}>
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z"/></svg>
        </button>
        <div className={styles.path}>
          <Link to="/">Главная</Link>
          <span>/</span>
          <span>Анализ ТСЗИ</span>
        </div>
                <h2>Анализ ТСЗИ</h2>
      </div>

      <div className={styles.grid}>

        <div className={styles.formBlock}>

          <div className={styles.formGroup}>
            <label>Категория защиты:</label>
            <select
              className={styles.select}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Любая</option>
              <option value="network">Сетевые</option>
              <option value="crypto">Криптографические</option>
              <option value="endpoint">Конечные устройства</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Требуемый уровень угроз:</label>
            <select
              value={threatLevel}
              className={styles.select}
              onChange={(e) => setThreatLevel(e.target.value)}
            >
              <option value="">Любой</option>
              <option value="low">Низкий</option>
              <option value="medium">Средний</option>
              <option value="high">Высокий</option>
            </select>
          </div>

          <div className={styles.checkbox}>
            <label>
              <input
                type="checkbox"
                checked={requireCrypto}
                onChange={(e) => setRequireCrypto(e.target.checked)}
              />
              Обязательная криптографическая защита
            </label>
          </div>

          <div className={styles.formGroup}>
            <label>Бюджет:</label>
            <select
              value={selectedBudget}
              className={styles.select}
              onChange={(e) => setSelectedBudget(e.target.value)}
            >
              <option value="any">Любой</option>
              <option value="low">Низкий</option>
              <option value="medium">Средний</option>
              <option value="high">Высокий</option>
            </select>
          </div>

          <button onClick={handleAnalyze} className={styles.button}>
            Выполнить анализ
          </button>
        </div>

        <div className={styles.resultBlock}>

  {!analyzed && (
    <p className={styles.placeholder}>
      Выберите параметры системы защиты и выполните интеллектуальный анализ
    </p>
  )}

  {analyzed === "emptyFilters" && (
    <p className={styles.warning}>
      Не выбраны критерии анализа. Укажите хотя бы один параметр фильтрации.
    </p>
  )}

  {analyzed === true && results.length === 0 && (
    <p className={styles.noResult}>
      По заданным критериям соответствующие ТСЗИ не обнаружены
    </p>
  )}

  {Array.isArray(results) && results.length > 0 && (
    <ResultBlock data={results} />
  )}

</div>
      </div>
    </section>
  );
};

export default Analyzer;