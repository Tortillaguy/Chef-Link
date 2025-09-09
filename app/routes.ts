import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("search", "routes/search.tsx"),
  route("profile", "routes/profile.tsx"),
  route("chef/:username", "routes/chef-profile.tsx"),
] satisfies RouteConfig;
