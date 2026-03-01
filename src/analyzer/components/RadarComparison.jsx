import styles from "./comparsion.module.scss";

const ComparisonPanel = ({ data }) => {
  if (!data || data.length === 0) return null;

  const top = data.slice(0, 3);

  return (
    <div className={styles.panel}>
      <h3>Сравнительный анализ лучших решений</h3>

      {top.map(tool => (
        <div key={tool.id} className={styles.card}>
          <div className={styles.header}>
            <span>{tool.name}</span>
            <span className={styles.index}>{tool.index}%</span>
          </div>

          <div className={styles.metrics}>
            <div>Эффективность: {tool.rating?.effectiveness}</div>
            <div>Масштабируемость: {tool.rating?.scalability}</div>
            <div>Поддержка: {tool.rating?.support}</div>
            <div>Сложность: {tool.rating?.complexity}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ComparisonPanel;