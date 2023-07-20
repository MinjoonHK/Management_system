import Login from "./view/login";
import {
  BrowserRouter,
  Route,
  Routes,
  useNavigate,
  useNavigation,
} from "react-router-dom";
import Protected from "./components/privateRoute";
import Dashboard from "./view/dashboard/dashBoard";
import Signup from "./view/signUp";
import ForgotPassword from "./view/forgotPassword";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { useEffect } from "react";

function App({}) {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route
            path="*"
            element={
              <Protected>
                <Dashboard />
              </Protected>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
