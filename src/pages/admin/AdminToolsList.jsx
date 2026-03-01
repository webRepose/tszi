import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import AdminToolForm from "./AdminToolForm";
import styles from "../../styles/s-pages/admin.module.scss";

const AdminToolsList = () => {
  const [tools, setTools] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [currentTool, setCurrentTool] = useState(null);
  const [loading, setLoading] = useState(true);

  const [filterCategory, setFilterCategory] = useState("all");
  const [filterThreat, setFilterThreat] = useState("all");
  const [filterCrypto, setFilterCrypto] = useState("all");

  const loadTools = async () => {
    setLoading(true);
    const snapshot = await getDocs(collection(db, "tools"));
    const data = snapshot.docs.map(d => ({
      id: d.id,
      ...d.data(),
    }));
    setTools(data);
    setLoading(false);
  };

  const handleAdd = () => {
    setCurrentTool(null);
    setShowForm(true);
  };

  const handleEdit = (tool) => {
    setCurrentTool(tool);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Удалить ТСЗИ?");
    if (!confirm) return;

    await deleteDoc(doc(db, "tools", id));
    loadTools();
  };

  useEffect(() => {
    loadTools();
  }, []);



const filteredTools = tools.filter(tool => {
  if (filterCategory !== "all" && tool.category !== filterCategory) return false;
  if (filterThreat !== "all" && tool.minThreat !== filterThreat) return false;
  if (filterCrypto !== "all") {
    if (filterCrypto === "yes" && !tool.supportsCrypto) return false;
    if (filterCrypto === "no" && tool.supportsCrypto) return false;
  }
  return true;
});

  return (
    <section className={styles.list}>
      <div className={styles.listHeader}>
        <h2>Технические средства защиты</h2>
        <button className={styles.addBtn} onClick={handleAdd}>
          ➕ Добавить ТСЗИ
        </button>
      </div>

      {loading ? (
        <p className={styles.loading}>Загрузка...</p>
      ) : tools.length === 0 ? (
        <p className={styles.empty}>ТСЗИ не добавлены</p>
      ) : (
        <div className={styles.table}>
          <div className={styles.rowHead}>
          </div>


          <div className={styles.filters}>
  <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
    <option value="all">Все категории</option>
    <option value="network">Network</option>
    <option value="crypto">Crypto</option>
    <option value="endpoint">Endpoint</option>
  </select>

  <select value={filterThreat} onChange={e => setFilterThreat(e.target.value)}>
    <option value="all">Любая угроза</option>
    <option value="low">Low</option>
    <option value="medium">Medium</option>
    <option value="high">High</option>
  </select>

  <select value={filterCrypto} onChange={e => setFilterCrypto(e.target.value)}>
    <option value="all">Криптография</option>
    <option value="yes">Требуется</option>
    <option value="no">Не требуется</option>
  </select>

  <button
    className={styles.reset}
    onClick={() => {
      setFilterCategory("all");
      setFilterThreat("all");
      setFilterCrypto("all");
    }}
  >
    Сбросить
  </button>
</div>

            <div className={styles.grid}>
            {filteredTools.map(tool => (
                <div className={styles.card} key={tool.id}>
                <div className={styles.cardHeader}>
                    <h3>{tool.name}</h3>
                    <span className={`${styles.badge} ${styles[tool.category]}`}>
                    {tool.category}
                    </span>
                </div>

                <p className={styles.desc}>
                    {tool.description || "Описание отсутствует"}
                </p>

                <div className={styles.meta}>
                    <span className={styles.level}>
                    Угроза: <b>{tool.minThreat}</b>
                    </span>

                    <span className={styles.crypto}>
                    Крипто: {tool.supportsCrypto ? "✔" : "—"}
                    </span>

                    <span className={styles.standards}>
                    {tool.standards?.join(", ") || "Без стандартов"}
                    </span>
                </div>

                <div className={styles.cardActions}>
                    <button onClick={() => handleEdit(tool)}>✏️</button>
                    <button onClick={() => handleDelete(tool.id)}>🗑</button>
                </div>
                </div>
            ))}
            </div>
        </div>
      )}

      {showForm && (
        <AdminToolForm
          current={currentTool}
          onClose={() => {
            setShowForm(false);
            loadTools();
          }}
        />
      )}
    </section>
  );
};

export default AdminToolsList;
