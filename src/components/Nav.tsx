import { NavLink, useLocation } from "react-router-dom";

export default function Nav({
  workspacename,
}: {
  readonly workspacename: string;
}) {
  const location = useLocation();

  return (
    <nav className="w-1/6 inline-block align-top px-4">
      <ul className="flex flex-col text-center [&>li>a]:p-4 [&>li>a]:rounded-lg [&>li>a]:block">
        <li>
          <NavLink
            to={`/${workspacename}`}
            className={
              location.pathname == `/${workspacename}`
                ? "bg-blue text-white"
                : ""
            }
          >
            Overview
          </NavLink>
        </li>
        <li>
          <NavLink
            to={`/${workspacename}/board`}
            className={
              location.pathname == `/${workspacename}/board`
                ? "bg-blue text-white"
                : ""
            }
          >
            Board
          </NavLink>
        </li>
        <li>
          <NavLink
            to={`/${workspacename}/design`}
            className={
              location.pathname == `/${workspacename}/design`
                ? "bg-blue text-white"
                : ""
            }
          >
            Design
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
