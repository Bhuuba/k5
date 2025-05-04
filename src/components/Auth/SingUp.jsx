import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import Form from "../form/Form";
import { setUser } from "store/slices/userSlice";

const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

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
          errorMessage = t("This email is already registered");
          break;
        case "auth/invalid-email":
          errorMessage = t("Invalid email format");
          break;
        case "auth/operation-not-allowed":
          errorMessage = t("Email registration is temporarily unavailable");
          break;
        case "auth/weak-password":
          errorMessage = t("Password is too weak");
          break;
        default:
          errorMessage = t("Registration error. Please try again later");
      }
      throw new Error(errorMessage);
    }
  };

  return (
    <div className="auth-wrapper">
      <Form title={t("Sign up")} handleClick={handleRegister} />
    </div>
  );
};

export default SignUp;
