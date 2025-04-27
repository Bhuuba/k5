import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import Form from "../form/Form";
import { setUser } from "store/slices/userSlice";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = (email, password) => {
    const auth = getAuth();

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("Successful login:", user);

        dispatch(
          setUser({
            email: user.email,
            id: user.uid,
            token: user.accessToken,
          })
        );

        navigate("/");
      })
      .catch((error) => {
        console.error("Login error:", error);
        alert(`Login failed: ${error.message}`);
      });
  };

  return (
    <div className="auth-wrapper">
      <Form title="Sign in" handleClick={handleLogin} />
    </div>
  );
};

export default Login;
