// import { useState, useEffect } from "react";
// import { collection, getDocs } from "firebase/firestore";
// import { db } from "../firebase";
// import ResultBlock from "../analyzer/components/ResultBlock";
// import styles from "../styles/s-pages/smartAnalyzer.module.scss";
// import { Link, useNavigate } from "react-router-dom";

// const SmartAnalyzer = () => {
//   const [goal, setGoal] = useState("");
//   const [budget, setBudget] = useState("any");
//   const [tools, setTools] = useState([]);
//   const [results, setResults] = useState([]);
//   const [analyzed, setAnalyzed] = useState(false);
//   const [error, setError] = useState("");

//   const navigate = useNavigate();

//   useEffect(() => {
//     const loadTools = async () => {
//       const snapshot = await getDocs(collection(db, "tools"));
//       const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//       setTools(data);
//     };
//     loadTools();
//   }, []);

//   const parsePrice = (price) => price ? Number(price.replace(/[^\d]/g, "")) : 0;

//   const handleAnalyze = () => {
//     if (!goal.trim()) return;

//     const words = goal.toLowerCase().split(/\s+/);

//     const scored = tools.map(tool => {
//       let score = 0;
//       let weightSum = 0;

//       // 🔹 CATEGORY
//       weightSum += 2;
//       if (tool.category && words.some(w => tool.category.toLowerCase().includes(w))) {
//         score += 2;
//       }

//       // 🔹 FEATURES
//       weightSum += 3;
//       const featureMatches = tool.features?.filter(f =>
//         words.some(w => f.toLowerCase().includes(w))
//       ) || [];
//       score += featureMatches.length;

//       // 🔹 FULL DESCRIPTION
//       weightSum += 2;
//       const descMatches = tool.fullDescription
//         ? words.filter(w => tool.fullDescription.toLowerCase().includes(w))
//         : [];
//       score += descMatches.length;

//       // 🔹 Бюджет
//       weightSum += 2;
//       const price = parsePrice(tool.price);
//       if (budget !== "any" && price <= Number(budget)) score += 2;

//       // 🔹 Нормализуем
//       const normalizedScore = weightSum === 0 ? 0 : Math.round((score / weightSum) * 100);

//       return { ...tool, score: normalizedScore };
//     });

//     // фильтруем только реальные совпадения
//     const filtered = scored.filter(t => t.score > 0).sort((a, b) => b.score - a.score);

//     setResults(filtered);
//     setAnalyzed(true);
//     setError("");
//   };

//   return (
//     <section className={styles.smartAnalyzer}>
//       <div className={styles.breadcrumbs}>
//         <button onClick={() => navigate(-1)} className={styles.backBtn}>←</button>
//         <div className={styles.path}>
//           <Link to="/">Главная</Link>
//           <span>/</span>
//           <span>Интеллектуальный подбор ТСЗИ</span>
//         </div>
//       </div>

//       <h2 className={styles.title}>Интеллектуальный подбор ТСЗИ</h2>

//       <div className={styles.inputBlock}>
//         <input
//           type="text"
//           placeholder="Опишите цель защиты (например: защита сети или мониторинг)"
//           value={goal}
//           onChange={(e) => setGoal(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
//         />

//         <select value={budget} onChange={(e) => setBudget(e.target.value)}>
//           <option value="any">Любой бюджет</option>
//           <option value="100000">до 100 000 ₸</option>
//           <option value="300000">до 300 000 ₸</option>
//           <option value="500000">до 500 000 ₸</option>
//           <option value="1000000">до 1 000 000 ₸</option>
//         </select>

//         <button onClick={handleAnalyze}>Подобрать ТСЗИ</button>
//       </div>

//       <div className={styles.results}>
//         {!analyzed && <p className={styles.placeholder}>Введите цель для подбора</p>}
//         {analyzed && results.length === 0 && <p className={styles.noResult}>Подходящие ТСЗИ не найдены</p>}
//         {results.length > 0 && <ResultBlock data={results} />}
//         {error && <p className={styles.noResult}>{error}</p>}
//       </div>
//     </section>
//   );
// };

// export default SmartAnalyzer;



import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import ResultBlock from "../analyzer/components/ResultBlock";
import styles from "../styles/s-pages/smartAnalyzer.module.scss";
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

  const parsePrice = (price) => price ? Number(price.replace(/[^\d]/g, "")) : 0;


const tagDictionary = {

  network: [
    "сеть",
    "сети",
    "сетей",
    "сетевой",
    "сетевые",
    "сетевая",
    "сетевую",
    "сетевым",
    "сетевыми",
    "сетевого",
    "сетевом",

    "трафик",
    "сетевой трафик",
    "фильтрация трафика",
    "анализ трафика",
    "мониторинг сети",
    "контроль сети",

    "firewall",
    "fw",
    "ngfw",
    "межсетевой",
    "межсетевого",
    "межсетевые",
    "межсетевой экран",
    "межсетевой экран безопасности",

    "vpn",
    "vpn-соединение",
    "vpn канал",
    "vpn туннель",
    "ipsec",
    "openvpn",

    "маршрутизация",
    "маршрутизатор",
    "router",
    "routing",

    "сетевой шлюз",
    "gateway",

    "ids",
    "ips",
    "система обнаружения атак",
    "система предотвращения атак",

    "сетевые атаки",
    "ddos",
    "dos",

    "lan",
    "wan",
    "локальная сеть",
    "корпоративная сеть",
    "интернет"
  ],

  crypto: [
    "крипто",
    "криптография",
    "криптографический",
    "криптографическая",
    "криптографические",

    "шифр",
    "шифрование",
    "зашифровать",
    "зашифрованный",
    "зашифрованные",

    "дешифрование",
    "расшифровка",

    "rsa",
    "aes",
    "gost",
    "gost28147",
    "gost34",

    "tls",
    "ssl",
    "https",

    "электронная подпись",
    "цифровая подпись",
    "эдс",
    "эп",

    "ключ",
    "ключи",
    "криптоключ",
    "криптографический ключ",
    "управление ключами",

    "сертификат",
    "сертификаты",
    "pki",

    "защита канала",
    "криптозащита",
    "криптографическая защита",
    "защита связи",

    "vpn",
    "ipsec",
    "шифрованный канал",
    "защищённый канал"
  ],

  endpoint: [
    "компьютер",
    "компьютеры",
    "пк",
    "персональный компьютер",

    "рабочая станция",
    "рабочие станции",
    "рабочего места",

    "endpoint",
    "endpoints",

    "хост",
    "узел",

    "антивирус",
    "antivirus",
    "antimalware",
    "malware",
    "защита от вирусов",

    "вредоносное по",
    "вирус",
    "троян",
    "троянская программа",
    "червь",

    "edr",
    "xdr",

    "контроль устройств",
    "device control",

    "usb",
    "носители",
    "съемные носители",
    "флешка",

    "защита рабочей станции",
    "защита компьютера",
    "защита хоста",

    "контроль приложений",
    "application control",

    "обнаружение угроз",
    "анализ поведения",

    "безопасность endpoint",
    "endpoint security"
  ]

};

const handleAnalyze = () => {
  if (!goal.trim()) return;

  const stopWords = [
  "защита",
  "система",
  "системы",
  "для",
  "и",
  "в",
  "на",
  "по",
  "обеспечение",
  "средство"
];


const words = goal
  .toLowerCase()
  .trim()
  .split(/\s+/)
  .filter(w => w && !stopWords.includes(w));


    
    const normalizeWord = (word) => {
  return word
    .toLowerCase()
    .replace(/(ая|ое|ые|ий|ой|ая|яя|ые|ие|а|я|ы|и)$/,"");
};

  // 🔹 Определяем категории через словарь
  const matchedCategories = Object.entries(tagDictionary)
    .filter(([category, tags]) =>
      words.some(word =>
        tags.some(tag => tag.includes(word) || word.includes(tag))
      )
    )
    .map(([category]) => category);

  const scored = tools.map(tool => {

    const textFields = [
      tool.name,
      tool.description,
      tool.fullDescription,
      ...(tool.features || [])
    ]
      .filter(Boolean)
      .map(t => t.toLowerCase());

    // 🔹 проверка текста
const textWords = textFields
  .join(" ")
  .toLowerCase()
  .split(/\s+/)
  .map(normalizeWord);

const textMatch = words.every(word => {
  const w = normalizeWord(word);
  return textWords.some(tw => tw.includes(w));
});

    // 🔹 проверка категории через словарь
    const categoryMatch = matchedCategories.includes(tool.category);

if (!textMatch && !categoryMatch) return { ...tool, score: 0 };

    let score = 0;

    const nameMatch = words.some(w => tool.name?.toLowerCase().includes(w));
    if (nameMatch) score += 30;

    if (categoryMatch) score += 40;

    const featureMatches = (tool.features || []).filter(f =>
      words.some(w => f.toLowerCase().includes(w))
    );

    score += featureMatches.length * 10;

    const price = parsePrice(tool.price);

    if (budget !== "any" && price > Number(budget)) {
      return { ...tool, score: 0 };
    }

    score += 10;

    return { ...tool, score };
  });

  const filtered = scored
    .filter(t => t.score > 0)
    .sort((a, b) => b.score - a.score);

  setResults(filtered);
  setAnalyzed(true);
};  

return (
    <section className={styles.smartAnalyzer}>
      <div className={styles.breadcrumbs}>
        <button onClick={() => navigate(-1)} className={styles.backBtn}>←</button>
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
          placeholder="Опишите цель защиты (например: защита сети)"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
        />

        <select value={budget} onChange={(e) => setBudget(e.target.value)}>
          <option value="any">Любой бюджет</option>
          <option value="100000">до 100 000 ₸</option>
          <option value="300000">до 300 000 ₸</option>
          <option value="500000">до 500 000 ₸</option>
          <option value="1000000">до 1 000 000 ₸</option>
        </select>

        <button onClick={handleAnalyze}>Подобрать ТСЗИ</button>
      </div>

      <div className={styles.results}>
        {!analyzed && <p className={styles.placeholder}>Введите цель для подбора</p>}
        {analyzed && results.length === 0 && <p className={styles.noResult}>Подходящие ТСЗИ не найдены</p>}
        {results.length > 0 && <ResultBlock data={results} />}
      </div>
    </section>
  );
};

export default SmartAnalyzer;