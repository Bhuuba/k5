import { useSelector } from "react-redux";
export const useAuth = () => {
  const state = useSelector((state) => state.user);
  console.log("Current auth state:", state);
  const { email, id, token } = state;
  const isAuth = !!email;
  console.log("Is authenticated:", isAuth);
  return {
    isAuth,
    email,
    id,
    token,
  };
};
