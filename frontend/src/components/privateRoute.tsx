import { Navigate } from "react-router-dom";
import jwt_decode from "jwt-decode";

interface AccessToken {
  Role: string;
  exp: number;
  iat: number;
  id: number;
}

function Protected({ children }) {
  const jwt = localStorage.getItem("jwt");

  if (!jwt) {
    return <Navigate to="/login" replace />;
  }

  const accessToken: AccessToken = jwt_decode(jwt);
  const role: string = accessToken.Role;

  return children;
}
export default Protected;
