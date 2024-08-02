const { verifyJWT } = require("./jwt");

const excludeRoutes = [
  { method: "GET", path: "/" },
  { method: "POST", path: "/user/login" },
  { method: "POST", path: "/user/register" },
  { method: "POST", path: "/user/register/verify" },
  { method: "POST", path: "/user/register/resend" },
  { method: "POST", path: "/user/reset" },
  { method: "POST", path: "/user/reset/verify" },
  { method: "POST", path: "/user/reset/resend" },
  { method: "POST", path: "/user/new-password" },
  { method: "POST", path: "/worker/verify" },
  { method: "POST", path: "/worker/login" },
  { method: "POST", path: "/admin/register" },
  { method: "POST", path: "/admin/login" },
];

const globalAuthMiddleware = (req, res, next) => {
  const isExcluded = excludeRoutes.some(
    (route) => route.method === req.method && route.path === req.path
  );

  if (isExcluded) {
    return next();
  }

  verifyJWT(req, res, next);
};

module.exports = globalAuthMiddleware;
