import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import styles from "../styles/s-shared/header.module.scss";
import Preloader from "./Preloader";

const Header = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        setIsAdmin(docSnap.exists() && !!docSnap.data().admin);
      } catch (err) {
        console.error("Ошибка проверки админа:", err);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [user]);

  const handleLogout = async () => {
    await signOut(auth);
  };

  if (loading) return <Preloader />;

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logo}>
        CyberGuard
      </Link>

      <button className={styles.menu_toggle} onClick={() => setMenuOpen(prev => !prev)}>
        ☰
      </button>

      <nav className={`${styles.nav} ${menuOpen ? styles.open : ""}`}>
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `${styles.link} ${isActive ? styles.active : ""}`
          }
          onClick={()=>{setMenuOpen(false);}}
        >
          Главная
        </NavLink>

        <NavLink
          to="/requirements"
          className={({ isActive }) =>
            `${styles.link} ${isActive ? styles.active : ""}`
          }
                  onClick={()=>{setMenuOpen(false);}}
        >
          Подбор
        </NavLink>

        <NavLink
          to="/expert"
          className={({ isActive }) =>
            `${styles.link} ${isActive ? styles.active : ""}`
          }
                    onClick={()=>{setMenuOpen(false);}}
        >
          Экспертный подбор
        </NavLink>

        <NavLink
          to="/tools"
          className={({ isActive }) =>
            `${styles.link} ${isActive ? styles.active : ""}`
          }
                    onClick={()=>{setMenuOpen(false);}}
        >
          Каталог
        </NavLink>

        {user ? (
          <>
            {isAdmin && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `${styles.link} ${isActive ? styles.active : ""}`
                }
                          onClick={()=>{setMenuOpen(false);}}
              >
                Админка
              </NavLink>
            )}
            <button className={styles.button} onClick={handleLogout}>
              Выйти
            </button>
          </>
        ) : (
          <NavLink
            to="/login"
                      onClick={()=>{setMenuOpen(false);}}
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.active : ""}`
            }
          >
            Войти
          </NavLink>
        )}
      </nav>
    </header>
  );
};

export default Header;