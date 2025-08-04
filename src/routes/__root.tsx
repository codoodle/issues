import { createRootRoute, Link, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => (
    <>
      <div style={{ display: "flex", gap: "1rem" }}>
        <Link to="/">Home</Link>
        <Link to="/one">One</Link>
        <Link to="/two">Two</Link>
      </div>
      <hr />
      <Outlet />
    </>
  ),
});
