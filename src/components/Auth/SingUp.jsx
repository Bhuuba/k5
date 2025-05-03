import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import Form from "../form/Form";
import { setUser } from "store/slices/userSlice";

const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRegister = async (email, password) => {
    const auth = getAuth();

    try {
      const userCredential = await createUserWithEmailAndPassword(
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
        case "auth/email-already-in-use":
          errorMessage = "Этот email уже зарегистрирован";
          break;
        case "auth/invalid-email":
          errorMessage = "Неверный формат email";
          break;
        case "auth/operation-not-allowed":
          errorMessage = "Регистрация через email временно недоступна";
          break;
        case "auth/weak-password":
          errorMessage = "Слишком слабый пароль";
          break;
        default:
          errorMessage = "Ошибка при регистрации. Попробуйте позже";
      }
      throw new Error(errorMessage);
    }
  };

  return (
    <div className="auth-wrapper">
      <Form title="Sign up" handleClick={handleRegister} />
    </div>
  );
};

export default SignUp;
