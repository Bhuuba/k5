import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import SignUpForm from "./form/SignUpForm";
import { setUser } from "store/slices/userSlice";

const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleRegister = async (email, password) => {
    const auth = getAuth();
    console.log("Starting registration process...");

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("Registration successful");
      const user = userCredential.user;

      dispatch(
        setUser({
          email: user.email,
          id: user.uid,
          token: user.accessToken,
        })
      );
      console.log("User state updated");

      navigate("/");
    } catch (error) {
      console.error("Registration error:", error.code, error.message);
      let errorMessage = "";
      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = t("Ця електронна пошта вже зареєстрована");
          break;
        case "auth/invalid-email":
          errorMessage = t("Невірний формат електронної пошти");
          break;
        case "auth/operation-not-allowed":
          errorMessage = t("Реєстрація через email тимчасово недоступна");
          break;
        case "auth/weak-password":
          errorMessage = t("Пароль занадто слабкий");
          break;
        default:
          errorMessage = t("Помилка реєстрації. Будь ласка, спробуйте пізніше");
      }
      throw new Error(errorMessage);
    }
  };

  return (
    <div className="auth-wrapper">
      <SignUpForm title={t("Зареєструватися")} handleClick={handleRegister} />
    </div>
  );
};

export default SignUp;
