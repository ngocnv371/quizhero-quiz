import { Link, Outlet } from "react-router-dom";

import AuthStatus from "./AuthStatus";

export default function Layout() {
  return (
    <div>
      <AuthStatus />

      <ul>
        <li>
          <Link to="/">Quizzes</Link>
        </li>
      </ul>

      <Outlet />
    </div>
  );
}
