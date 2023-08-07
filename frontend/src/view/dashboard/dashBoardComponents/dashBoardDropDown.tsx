import { MenuProps } from "antd";
import { Link } from "react-router-dom";
import { t } from "i18next";

function logout() {
  localStorage.clear();
}
export const DashboardDropdown = (UserRole: string): MenuProps["items"] => {
  if (UserRole === "admin") {
    return [
      {
        label: (
          <Link style={{ textDecoration: "none" }} to="/admininformation">
            {t("profile")}
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
            {t("logOut")}
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
