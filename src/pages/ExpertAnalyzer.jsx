import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { scoreExpertTool } from "../expertScoringEngine";
import ResultBlock from "../analyzer/components/ResultBlock";
import styles from "../styles/s-pages/smartAnalyzer.module.scss";
import { useNavigate, Link } from "react-router-dom";
import RadarComparison from "../analyzer/components/RadarComparison";

const ExpertAnalyzer = () => {
  const [tools, setTools] = useState([]);
  const [results, setResults] = useState([]);
  const [analyzed, setAnalyzed] = useState(false);
  const navigate = useNavigate();

  const [criteria, setCriteria] = useState({
    object: "",
    threat: "",
    crypto: false,
    standard: "",
    deployment: "",
    employees: 0
  });

  useEffect(() => {
    const loadTools = async () => {
      const snapshot = await getDocs(collection(db, "tools"));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTools(data);
    };
    loadTools();
  }, []);

  const handleAnalyze = () => {
  // если вообще ничего не выбрано
  const isEmpty =
    !criteria.object &&
    !criteria.threat &&
    !criteria.crypto &&
    !criteria.standard &&
    !criteria.deployment &&
    !criteria.employees;

  if (isEmpty) {
    setAnalyzed(true);
    setResults([]);
    return;
  }

  const scored = tools
    .map(tool => scoreExpertTool(tool, criteria))
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
          <span>Экспертный подбор ТСЗИ</span>
        </div>
      </div>

      <h2 className={styles.title}>Экспертный подбор ТСЗИ</h2>

      <div className={styles.inputBlock}>
        <select onChange={e => setCriteria({...criteria, object: e.target.value})}>
          <option value="">Тип объекта</option>
          <option value="small">Малый бизнес</option>
          <option value="medium">Средний бизнес</option>
          <option value="enterprise">Крупная компания</option>
          <option value="gov">Госсектор</option>
        </select>

        <select onChange={e => setCriteria({...criteria, threat: e.target.value})}>
          <option value="">Уровень угроз</option>
          <option value="low">Низкий</option>
          <option value="medium">Средний</option>
          <option value="high">Высокий</option>
        </select>

        <select onChange={e => setCriteria({...criteria, deployment: e.target.value})}>
          <option value="">Тип внедрения</option>
          <option value="cloud">Cloud</option>
          <option value="onprem">On-Premise</option>
          <option value="hybrid">Hybrid</option>
        </select>

        <select onChange={e => setCriteria({...criteria, standard: e.target.value})}>
          <option value="">Стандарт</option>
          <option value="ГОСТ">ГОСТ</option>
          <option value="ISO">ISO</option>
        </select>

        <input
          type="number"
          placeholder="Количество сотрудников"
          onChange={e => setCriteria({...criteria, employees: Number(e.target.value)})}
        />

        <label>
          <input
            type="checkbox"
            onChange={e => setCriteria({...criteria, crypto: e.target.checked})}
          />
          Требуется криптография
        </label>

        <button onClick={handleAnalyze}>Рассчитать</button>
      </div>

      <div className={styles.results}>
        {!analyzed && <p className={styles.placeholder}>Выберите параметры</p>}
        {analyzed && results.length === 0 && (
          <p className={styles.noResult}>Подходящие решения не найдены</p>
        )}
        {results.length > 0 && <ResultBlock data={results} />}
        {results.length > 0 && <RadarComparison data={results} />}
      </div>
    </section>
  );
};

export default ExpertAnalyzer;