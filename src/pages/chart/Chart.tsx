import { Navigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const Chart = () => {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) return <Navigate to="/login" />;
    
    return <div>Chart Page</div>;
  };
  
  export default Chart;