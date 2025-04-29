import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import api from "../api/api";
const Callback = () => {
  const { isLoading,user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = new URLSearchParams(window.location.search).get('code');
        const response = await fetch(`${api.endpoints.CALLBACK_URL}`, { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code })
        });
        
        if (response.ok) {
          const { user } = await response.json();
          navigate('/');
        }
      } catch (error) {
        console.error('Callback failed:', error);
        navigate('/login');
      }
    };
  
    handleCallback();
  }, [navigate]);
  return <div>Loading...</div>;
};

export default Callback;