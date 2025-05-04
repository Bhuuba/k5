import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import Form from "../form/Form";
import { setUser } from "store/slices/userSlice";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

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
          errorMessage = t("User with this email not found");
          break;
        case "auth/wrong-password":
          errorMessage = t("Wrong password");
          break;
        case "auth/invalid-email":
          errorMessage = t("Invalid email format");
          break;
        case "auth/user-disabled":
          errorMessage = t("Account is blocked");
          break;
        case "auth/too-many-requests":
          errorMessage = t("Too many login attempts. Try again later");
          break;
        default:
          errorMessage = t("Login error. Please try again later");
      }
      throw new Error(errorMessage);
    }
  };

  return (
    <div className="auth-wrapper">
      <Form title={t("Sign in")} handleClick={handleLogin} />
    </div>
  );
};

export default Login;
