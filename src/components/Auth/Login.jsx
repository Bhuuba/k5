import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import Form from "../form/Form";
import { setUser } from "store/slices/userSlice";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (email, password) => {
    const auth = getAuth();

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      dispatch(
        setUser({
          email: user.email,
          id: user.uid,
          token: user.accessToken,
        })
      );

      navigate("/");
    } catch (error) {
      let errorMessage = "";
      switch (error.code) {
        case "auth/user-not-found":
          errorMessage = "Пользователь с таким email не найден";
          break;
        case "auth/wrong-password":
          errorMessage = "Неверный пароль";
          break;
        case "auth/invalid-email":
          errorMessage = "Неверный формат email";
          break;
        case "auth/user-disabled":
          errorMessage = "Аккаунт заблокирован";
          break;
        case "auth/too-many-requests":
          errorMessage = "Слишком много попыток входа. Попробуйте позже";
          break;
        default:
          errorMessage = "Ошибка при входе. Попробуйте позже";
      }
      throw new Error(errorMessage);
    }
  };

  return (
    <div className="auth-wrapper">
      <Form title="Sign in" handleClick={handleLogin} />
    </div>
  );
};

export default Login;
