import styles from "../../styles/s-pages/admin.module.scss";

const AdminHeader = () => {
  return (
    <div className={styles.header}>
      <h1>Панель администратора</h1>
      <p>Управление техническими средствами защиты информации</p>
    </div>
  );
};

export default AdminHeader;