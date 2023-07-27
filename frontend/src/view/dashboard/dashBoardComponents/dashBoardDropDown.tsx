import { MenuProps } from "antd";
import { Link } from "react-router-dom";

function logout() {
  localStorage.clear();
}
export const DashboardDropdown = (UserRole: string): MenuProps["items"] => {
  if (UserRole === "admin") {
    return [
      {
        label: (
          <Link style={{ textDecoration: "none" }} to="/admininformation">
            Profile
          </Link>
        ),
        key: "0",
      },
      {
        label: (
          <Link
            onClick={logout}
            style={{ fontWeight: "bold", textDecoration: "none" }}
            to="/login"
          >
            Logout
          </Link>
        ),
        key: "1",
      },
    ];
  } else {
    return [
      {
        label: (
          <Link style={{ textDecoration: "none" }} to="/userinformation">
            Profile
          </Link>
        ),
        key: "0",
      },
      {
        label: (
          <Link
            onClick={logout}
            style={{ fontWeight: "bold", textDecoration: "none" }}
            to="/login"
          >
            Logout
          </Link>
        ),
        key: "1",
      },
    ];
  }
};
