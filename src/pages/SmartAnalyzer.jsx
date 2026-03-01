import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import ResultBlock from "../analyzer/components/ResultBlock";
import styles from "../styles/s-pages/smartAnalyzer.module.scss";
import { scoreTool } from "../scoringEngine";
import { Link, useNavigate } from "react-router-dom";

const SmartAnalyzer = () => {
  const [goal, setGoal] = useState("");
  const [budget, setBudget] = useState("any");
  const [tools, setTools] = useState([]);
  const [results, setResults] = useState([]);
  const [analyzed, setAnalyzed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadTools = async () => {
      const snapshot = await getDocs(collection(db, "tools"));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTools(data);
    };
    loadTools();
  }, []);

  const handleAnalyze = () => {
  if (!goal.trim()) return;

  const options = {
    budget,
    threat: "high", // пока фиксировано, потом вынесем в UI
    crypto: false,
    object: null,
    standard: null
  };

  const scored = tools
    .map(tool => scoreTool(tool, goal, options))
    .filter(t => t.score > 0)
    .sort((a, b) => b.score - a.score);

  setResults(scored);
  setAnalyzed(true);
};

  return (
    <section className={styles.smartAnalyzer}>

        <div className={styles.breadcrumbs}>
        <button onClick={() => navigate(-1)} className={styles.backBtn}>
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z"/></svg>
        </button>

        <div className={styles.path}>
          <Link to="/">Главная</Link>
          <span>/</span>
          <span>Интеллектуальный подбор ТСЗИ</span>
        </div>
      </div>

      <h2 className={styles.title}>Интеллектуальный подбор ТСЗИ</h2>

      <div className={styles.inputBlock}>
        <input
          type="text"
          placeholder="Опишите цель защиты, например 'защитить корпоративную сеть'"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
        />

        <select value={budget} onChange={(e) => setBudget(e.target.value)}>
          <option value="any">Любой бюджет</option>
          <option value="low">Низкий</option>
          <option value="medium">Средний</option>
          <option value="high">Высокий</option>
        </select>

        <button onClick={handleAnalyze}>Подобрать ТСЗИ</button>
      </div>

      <div className={styles.results}>
        {!analyzed && (
          <p className={styles.placeholder}>
            Введите цель для подбора
          </p>
        )}
        {analyzed && results.length === 0 && (
          <p className={styles.noResult}>
            Не найдено подходящих ТСЗИ. Попробуйте уточнить цель.
          </p>
        )}
        {results.length > 0 && <ResultBlock data={results} />}
      </div>
    </section>
  );
};

export default SmartAnalyzer;