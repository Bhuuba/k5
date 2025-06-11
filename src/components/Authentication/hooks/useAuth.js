import { useSelector } from "react-redux";
export const useAuth = () => {
  const state = useSelector((state) => state.user);
  const { email, id, token } = state;
  const isAuth = !!email;
  return {
    isAuth,
    email,
    id,
    token,
  };
};
