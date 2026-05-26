import { NavLink } from "react-router";

export const About = () => {
  return (
    <div>
      <h1>About me</h1>
      <nav>
        <NavLink to="/" end>
          Home
        </NavLink>
      </nav>
    </div>
  );
};
