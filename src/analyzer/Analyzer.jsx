import { useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import styles from "../styles/s-analyzer/analyzer.module.scss";
import { useNavigate, Link } from "react-router-dom";
import ResultBlock from "./components/ResultBlock";

const Analyzer = () => {

  const navigate = useNavigate();

  const [category, setCategory] = useState("");
  const [threatLevel, setThreatLevel] = useState("");
  const [requireCrypto, setRequireCrypto] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState("any");

  const [results, setResults] = useState([]);
  const [analyzed, setAnalyzed] = useState(false);

  const levels = { low: 1, medium: 2, high: 3 };

  // перевод "220 000 ₸" → 220000
  const parsePrice = (price) => {
    if (!price) return 0;
    return Number(price.replace(/[^\d]/g, ""));
  };

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

      const price = parsePrice(tool.price);

      // CATEGORY
      if (category) {
        weightSum += 3;
        if (tool.category === category) score += 3;
      }

      // THREAT
      if (threatLevel) {
        weightSum += 4;
        if (levels[tool.minThreat] >= levels[threatLevel]) {
          score += 4;
        }
      }

      // CRYPTO
      if (requireCrypto) {
        weightSum += 2;
        if (tool.supportsCrypto) score += 2;
      }


      if (selectedBudget !== "any") {
      const budgetValue = Number(selectedBudget);
      if (price > budgetValue) {
        // инструмент слишком дорогой, сразу исключаем
        return null; // не начисляем score и не включаем в результат
      } else {
        weightSum += 2;
        score += 2;
      }
    }

      const normalizedScore =
        weightSum === 0
          ? 0
          : Math.round((score / weightSum) * 100);

      return { ...tool, score: normalizedScore };

    });

    const filtered = scored
  .filter(tool => tool && tool.score > 0) // убираем null из-за превышения бюджета
  .sort((a, b) => b.score - a.score);

    setResults(filtered);
    setAnalyzed(true);

  };


  return (

    <section className={styles.analyzer}>

      <div className={styles.header}>

        <button
          onClick={() => navigate(-1)}
          className={styles.backBtn}
        >
          ←
        </button>

        <div className={styles.path}>
          <Link to="/">Главная</Link>
          <span>/</span>
          <span>Анализ ТСЗИ</span>
        </div>

        <h2>Интеллектуальный анализ ТСЗИ</h2>

      </div>


      <div className={styles.grid}>

        <div className={styles.formBlock}>

          <div className={styles.formGroup}>
            <label>Категория защиты</label>

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
            <label>Уровень угроз</label>

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
              Требуется криптографическая защита
            </label>
          </div>


          <div className={styles.formGroup}>
            <label>Бюджет</label>

            <select
              value={selectedBudget}
              className={styles.select}
              onChange={(e) =>
                setSelectedBudget(e.target.value)
              }
            >

              <option value="any">Любой</option>
              <option value="100000">до 100 000 ₸</option>
              <option value="300000">до 300 000 ₸</option>
              <option value="500000">до 500 000 ₸</option>
              <option value="1000000">до 1 000 000 ₸</option>

            </select>
          </div>


          <button
            onClick={handleAnalyze}
            className={styles.button}
          >
            Выполнить анализ
          </button>

        </div>


        <div className={styles.resultBlock}>

          {!analyzed && (
            <p className={styles.placeholder}>
              Выберите параметры и выполните анализ
            </p>
          )}

          {analyzed === "emptyFilters" && (
            <p className={styles.warning}>
              Укажите хотя бы один параметр
            </p>
          )}

          {analyzed === true &&
            results.length === 0 && (
              <p className={styles.noResult}>
                Подходящие ТСЗИ не найдены
              </p>
            )}

          {results.length > 0 && (
            <ResultBlock data={results} />
          )}

        </div>

      </div>

    </section>

  );

};

export default Analyzer;