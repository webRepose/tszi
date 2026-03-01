import { useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import styles from "../styles/s-pages/login.module.scss";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isRegister) {
        // 🔐 регистрация
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        const user = userCredential.user;

        // 📦 создаём пользователя в Firestore
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          admin: false,
          createdAt: new Date(),
        });

        navigate("/");
      } else {
        // 🔑 вход
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        const user = userCredential.user;

        // можно сразу проверить роль
        const snap = await getDoc(doc(db, "users", user.uid));
        if (!snap.exists()) {
          setError("Пользователь не найден в базе");
          return;
        }

        navigate("/");
      }
    } catch (err) {
     console.error(err);

        if (err.code === "auth/email-already-in-use") {
            setError("Этот email уже зарегистрирован. Попробуйте войти.");
        } else if (err.code === "auth/wrong-password") {
            setError("Неверный пароль");
        } else if (err.code === "auth/user-not-found") {
            setError("Пользователь не найден");
        } else if (err.code === "auth/invalid-email") {
            setError("Некорректный email");
        } else if (err.code === "auth/weak-password") {
            setError("Пароль должен быть не менее 6 символов");
        } else {
            setError("Ошибка авторизации");
        }
    }
  };

  return (
    <div className={styles.wrapper}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2>{isRegister ? "Регистрация" : "Вход администратора"}</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className={styles.error}>{error}</p>}

        <button type="submit">
          {isRegister ? "Зарегистрироваться" : "Войти"}
        </button>

        <span
          className={styles.switch}
          onClick={() => setIsRegister(!isRegister)}
        >
          {isRegister
            ? "Уже есть аккаунт? Войти"
            : "Нет аккаунта? Зарегистрироваться"}
        </span>
      </form>
    </div>
  );
};

export default Login;
