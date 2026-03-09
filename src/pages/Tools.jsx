// import { useEffect, useState, useMemo } from "react";
// import { collection, getDocs } from "firebase/firestore";
// import { db } from "../firebase";
// import { useNavigate, Link } from "react-router-dom";
// import styles from "../styles/s-pages/toolsDetail.module.scss";

// const Tools = () => {
//   const [tools, setTools] = useState([]);
//   const navigate = useNavigate();

//   // состояния фильтров
//   const [categoryFilter, setCategoryFilter] = useState("all");
//   const [threatFilter, setThreatFilter] = useState("all");
//   const [budgetFilter, setBudgetFilter] = useState("all");

//   useEffect(() => {
//     const loadTools = async () => {
//       const snapshot = await getDocs(collection(db, "tools"));
//       const data = snapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       setTools(data);
//     };

//     loadTools();
//   }, []);

//   const getAvgRating = (rating) => {
//     if (!rating) return 0;
//     const values = Object.values(rating);
//     return (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);
//   };

//   // 🔥 Фильтрация
//   const filteredTools = useMemo(() => {
//     return tools.filter(tool => {
//       const categoryMatch =
//         categoryFilter === "all" || tool.category === categoryFilter;

//       const threatMatch =
//         threatFilter === "all" || tool.minThreat === threatFilter;

//       const budgetMatch =
//         budgetFilter === "all" || tool.budgetLevel === budgetFilter;

//       return categoryMatch && threatMatch && budgetMatch;
//     });
//   }, [tools, categoryFilter, threatFilter, budgetFilter]);

//   return (
//     <div className={styles.tools}>
//         <div className={styles.breadcrumbs}>
//         <button onClick={() => navigate(-1)} className={styles.backBtn}>
// <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z"/></svg>
//         </button>

//         <div className={styles.path}>
//           <Link to="/">Главная</Link>
//           <span>/</span>
//           <span>Каталог ТСЗИ</span>
//         </div>
//       </div>
//       <h1>Каталог ТСЗИ</h1>

//       {/* ===== ФИЛЬТРЫ ===== */}
//       <div className={styles.filters}>
//         <select
//           value={categoryFilter}
//           onChange={(e) => setCategoryFilter(e.target.value)}
//         >
//           <option value="all">Все категории</option>
//           <option value="network">Сетевые</option>
//           <option value="crypto">Криптографические</option>
//           <option value="endpoint">Конечные устройства</option>
//         </select>

//         <select
//           value={threatFilter}
//           onChange={(e) => setThreatFilter(e.target.value)}
//         >
//           <option value="all">Любой уровень угроз</option>
//           <option value="low">Низкий</option>
//           <option value="medium">Средний</option>
//           <option value="high">Высокий</option>
//         </select>

//         <select
//           value={budgetFilter}
//           onChange={(e) => setBudgetFilter(e.target.value)}
//         >
//           <option value="all">Любой бюджет</option>
//           <option value="low">Низкий</option>
//           <option value="medium">Средний</option>
//           <option value="high">Высокий</option>
//         </select>
//       </div>

//       {/* ===== GRID ===== */}
//       <div className={styles.grid}>
//         {filteredTools.length === 0 && (
//           <p className={styles.empty}>
//             Подходящие средства защиты не найдены
//           </p>
//         )}

//         {filteredTools.map(tool => {
//           const avgRating = getAvgRating(tool.rating);

//           return (
//             <div
//               key={tool.id}
//               className={styles.card}
//               onClick={() => navigate(`/tools/${tool.id}`)}
//             >
//               <img
//                 src={tool.imageUrl || "/placeholder.png"}
//                 alt={tool.name}
//                 className={styles.image}
//               />

//               <div className={styles.body}>
//                 <h3>{tool.name}</h3>

//                 <div className={styles.badges}>
//                   <span className={`${styles.badge} ${styles[tool.category]}`}>
//                     {tool.category}
//                   </span>

//                   <span className={`${styles.badge} ${styles[tool.minThreat]}`}>
//                     {tool.minThreat}
//                   </span>

//                   <span className={styles.budget}>
//                     {tool.budgetLevel}
//                   </span>
//                 </div>

//                 <p>
//                   {tool.description?.slice(0, 100) || "Описание отсутствует"}
//                 </p>

//                 <div className={styles.rating}>
//                   ⭐ {avgRating} / 5
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };


// export default Tools;



import { useEffect, useState, useMemo } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import styles from "../styles/s-pages/toolsDetail.module.scss";

const Tools = () => {

  const [tools, setTools] = useState([]);
  const navigate = useNavigate();

  const [categoryFilter, setCategoryFilter] = useState("all");
  const [threatFilter, setThreatFilter] = useState("all");
  const [budgetFilter, setBudgetFilter] = useState("all");

  useEffect(() => {

    const loadTools = async () => {

      const snapshot = await getDocs(collection(db, "tools"));

      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setTools(data);
    };

    loadTools();

  }, []);


  const getAvgRating = (rating) => {
    if (!rating) return 0;
    const values = Object.values(rating);
    return (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);
  };


  // 🔥 перевод "220 000 ₸" -> 220000
  const parsePrice = (priceString) => {
    if (!priceString) return 0;

    return Number(
      priceString
        .replace(/[^\d]/g, "")
    );
  };


  const filteredTools = useMemo(() => {

    return tools.filter(tool => {

      const categoryMatch =
        categoryFilter === "all" ||
        tool.category === categoryFilter;

      const threatMatch =
        threatFilter === "all" ||
        tool.minThreat === threatFilter;

      const price = parsePrice(tool.price);

      const budgetMatch =
        budgetFilter === "all" ||
        price <= Number(budgetFilter);

      return categoryMatch && threatMatch && budgetMatch;

    });

  }, [tools, categoryFilter, threatFilter, budgetFilter]);


  return (

    <div className={styles.tools}>

      <div className={styles.breadcrumbs}>

        <button
          onClick={() => navigate(-1)}
          className={styles.backBtn}
        >

          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3">
            <path d="M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z"/>
          </svg>

        </button>

        <div className={styles.path}>
          <Link to="/">Главная</Link>
          <span>/</span>
          <span>Каталог ТСЗИ</span>
        </div>

      </div>


      <h1>Каталог ТСЗИ</h1>


      <div className={styles.filters}>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >

          <option value="all">Все категории</option>
          <option value="network">Сетевые</option>
          <option value="crypto">Криптографические</option>
          <option value="endpoint">Конечные устройства</option>

        </select>


        <select
          value={threatFilter}
          onChange={(e) => setThreatFilter(e.target.value)}
        >

          <option value="all">Любой уровень угроз</option>
          <option value="low">Низкий</option>
          <option value="medium">Средний</option>
          <option value="high">Высокий</option>

        </select>


        {/* 🔥 бюджет теперь реальный */}

        <select
          value={budgetFilter}
          onChange={(e) => setBudgetFilter(e.target.value)}
        >

          <option value="all">Любой бюджет</option>
          <option value="100000">до 100 000 ₸</option>
          <option value="300000">до 300 000 ₸</option>
          <option value="500000">до 500 000 ₸</option>
          <option value="1000000">до 1 000 000 ₸</option>

        </select>

      </div>


      <div className={styles.grid}>

        {filteredTools.length === 0 && (
          <p className={styles.empty}>
            Подходящие средства защиты не найдены
          </p>
        )}


        {filteredTools.map(tool => {

          const avgRating = getAvgRating(tool.rating);

          return (

            <div
              key={tool.id}
              className={styles.card}
              onClick={() => navigate(`/tools/${tool.id}`)}
            >

              <img
                src={tool.imageUrl || "/placeholder.png"}
                alt={tool.name}
                className={styles.image}
              />

              <div className={styles.body}>

                <h3>{tool.name}</h3>


                <div className={styles.badges}>

                  <span className={`${styles.badge} ${styles[tool.category]}`}>
                    {tool.category}
                  </span>

                  <span className={`${styles.badge} ${styles[tool.minThreat]}`}>
                    {tool.minThreat}
                  </span>

                </div>


                <p>
                  {tool.description?.slice(0, 100) ||
                    "Описание отсутствует"}
                </p>


                <div className={styles.price}>
                  💰 {tool.price || "цена не указана"}
                </div>


                <div className={styles.rating}>
                  ⭐ {avgRating} / 5
                </div>

              </div>

            </div>

          );

        })}

      </div>

    </div>

  );

};

export default Tools;