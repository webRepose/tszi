import { useState, useEffect } from "react";
import { collection, addDoc, updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
import styles from "../../styles/s-pages/admin.module.scss";

const emptyTool = {
  name: "",
  category: "network",
  minThreat: "low",
  supportsCrypto: false,
  standards: [],

  description: "",
  fullDescription: "",
  vendor: "",
  country: "",
  price: "",
  imageUrl: "",
  features: [],

  // 🔥 Для интеллектуального подбора
  targetObjects: [],
  supportedDataTypes: [],
  deployment: [],
  minEmployees: 0,
  budgetLevel: "low",

  // 🔥 Экспертная оценка
  rating: {
    effectiveness: 3,
    scalability: 3,
    complexity: 3,
    support: 3
  },

  expertComment: ""
};

const AdminToolForm = ({ current, onClose }) => {
  const [tool, setTool] = useState(emptyTool);

    const toggleArrayField = (field, value) => {
    setTool(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(v => v !== value)
        : [...prev[field], value]
    }));
  };

  const handleRatingChange = (field, value) => {
    setTool(prev => ({
      ...prev,
      rating: {
        ...prev.rating,
        [field]: Number(value)
      }
    }));
  };

  useEffect(() => {
    if (current) setTool(current);
  }, [current]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTool(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const toggleStandard = (value) => {
    setTool(prev => ({
      ...prev,
      standards: prev.standards.includes(value)
        ? prev.standards.filter(s => s !== value)
        : [...prev.standards, value],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (current?.id) {
      await updateDoc(doc(db, "tools", current.id), {
        ...tool,
        updatedAt: serverTimestamp(),
      });
    } else {
      await addDoc(collection(db, "tools"), {
        ...tool,
        createdAt: serverTimestamp(),
      });
    }

    onClose();
  };

  const handleFeaturesChange = (e) => {
  const value = e.target.value.split(",");
  setTool(prev => ({
    ...prev,
    features: value.map(f => f.trim()),
  }));
};

  return (
    <div className={styles.modal}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2>{current ? "Редактирование ТСЗИ" : "Добавление ТСЗИ"}</h2>

        <input
          name="name"
          placeholder="Название"
          value={tool.name}
          onChange={handleChange}
          required
        />

        <select name="category" value={tool.category} onChange={handleChange}>
          <option value="network">Network</option>
          <option value="crypto">Crypto</option>
          <option value="endpoint">Endpoint</option>
        </select>

        <select name="minThreat" value={tool.minThreat} onChange={handleChange}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <label className={styles.checkbox}>
          <input
            type="checkbox"
            name="supportsCrypto"
            checked={tool.supportsCrypto}
            onChange={handleChange}
          />
          Требует криптографию
        </label>

        <div className={styles.standards}>
          <label>
            <input
              type="checkbox"
              checked={tool.standards.includes("ISO")}
              onChange={() => toggleStandard("ISO")}
            />
            ISO
          </label>

          <label>
            <input
              type="checkbox"
              checked={tool.standards.includes("ГОСТ")}
              onChange={() => toggleStandard("ГОСТ")}
            />
            ГОСТ
          </label>
        </div>

        <textarea
          name="description"
          placeholder="Описание"
          value={tool.description}
          onChange={handleChange}
        />

        <div className={styles.section}>
        <h4>Целевой сегмент</h4>

          {[
            { label: "Малый бизнес", value: "small" },
            { label: "Средний бизнес", value: "medium" },
            { label: "Крупная компания", value: "enterprise" },
            { label: "Госсектор", value: "gov" }
          ].map(item => (
            <label key={item.value}>
              <input
                type="checkbox"
                checked={tool.targetObjects.includes(item.value)}
                onChange={() => toggleArrayField("targetObjects", item.value)}
              />
              {item.label}
            </label>
          ))}
        </div>

        <select
        name="budgetLevel"
        value={tool.budgetLevel}
        onChange={handleChange}
      >
        <option value="low">Низкий</option>
        <option value="medium">Средний</option>
        <option value="high">Высокий</option>
      </select>


        <div className={styles.section}>
          <h4>Тип внедрения</h4>

          {["cloud", "onprem", "hybrid"].map(dep => (
            <label key={dep}>
              <input
                type="checkbox"
                checked={tool.deployment.includes(dep)}
                onChange={() => toggleArrayField("deployment", dep)}
              />
              {dep}
            </label>
          ))}
        </div>

        <input
          type="number"
          name="minEmployees"
          placeholder="Минимальное количество сотрудников"
          value={tool.minEmployees}
          onChange={handleChange}
        />

        <div className={styles.section}>
        <h4>Экспертная оценка (1–5)</h4>

      {["effectiveness", "scalability", "complexity", "support"].map(field => (
        <div key={field} className={styles.ratingRow}>
          <label>{field}</label>
          <input
            type="number"
            min="1"
            max="5"
            value={tool.rating[field]}
            onChange={(e) => handleRatingChange(field, e.target.value)}
          />
        </div>
      ))}
    </div>

      <textarea
        name="expertComment"
        placeholder="Экспертная оценка, преимущества, ограничения, рекомендации по применению"
        value={tool.expertComment}
        onChange={handleChange}
      />
        <input
          name="vendor"
          placeholder="Производитель"
          value={tool.vendor}
          onChange={handleChange}
        />

        <input
          name="price"
          placeholder="Цена"
          value={tool.price}
          onChange={handleChange}
        />

        <input
          name="country"
          placeholder="Страна"
          value={tool.country}
          onChange={handleChange}
        />

        <input
          name="imageUrl"
          placeholder="Ссылка на изображение"
          value={tool.imageUrl}
          onChange={handleChange}
        />

        <textarea
          name="fullDescription"
          placeholder="Полное описание"
          value={tool.fullDescription}
          onChange={handleChange}
        />

        <input
          placeholder="Характеристики (через запятую)"
          value={tool.features.join(", ")}
          onChange={handleFeaturesChange}
        />

        <div className={styles.formActions}>
          <button type="submit">Сохранить</button>
          <button type="button" onClick={onClose}>Отмена</button>
        </div>
      </form>
    </div>
  );
};

export default AdminToolForm;
