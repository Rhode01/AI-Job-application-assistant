import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Callback = () => {
  const { isLoading } = useAuth();
  const navigate = useNavigate();

  if (!isLoading) {
    navigate("/"); 
  }
  return <div>Loading...</div>;
};

export default Callback;