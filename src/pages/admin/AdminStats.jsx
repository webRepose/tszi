import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import styles from "../../styles/s-pages/admin.module.scss";

const AdminStats = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const loadStats = async () => {
      const snapshot = await getDocs(collection(db, "tools"));
      setCount(snapshot.size);
    };

    loadStats();
  }, []);

  return (
    <section className={styles.stats}>
      <div className={styles.card}>
        <span>ТСЗИ в базе</span>
        <strong>{count}</strong>
      </div>

      <div className={styles.card}>
        <span>Категории</span>
        <strong>3</strong>
      </div>

      <div className={styles.card}>
        <span>Обновление</span>
        <strong>Firestore</strong>
      </div>
    </section>
  );
};

export default AdminStats;
