import AdminHeader from "./admin/AdminHeader";
import AdminStats from "./admin/AdminStats";
import AdminToolsList from "./admin/AdminToolsList";
import styles from "../styles/s-pages/admin.module.scss";

const Admin = () => {
  return (
    <div className={styles.admin}>
      <AdminHeader />
      <AdminStats />
      <AdminToolsList />
    </div>
  );
};

export default Admin;