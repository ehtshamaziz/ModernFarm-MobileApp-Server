const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Admin = require("../models/admin");

function createJWT(req, res) {
  const token = jwt.sign(
    {
      userId: req.user._id,
    },
    process.env.JWT_SECRET
  );

  // Send the JWT token to the frontend
  res.status(200).json({
    token: token,
    user: req.user,
  });
}

const verifyJWT = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Authorization token is missing" });
  }

  // Verify the token
  jwt.verify(
    token.replace("Bearer ", ""),
    process.env.JWT_SECRET,
    async (err, decoded) => {
      if (err) {
        return res.status(401).json({
          message: "Authorization token has expired. Please sign in again",
        });
      }

      req.user = decoded;

      try {
        const user = await User.findById(req.user.userId).select("-password");
        if (user) {
          // if (!user.isActive) {
          //   return res.status(403).json({
          //     message:
          //       "User account is Banned. Contact Support for further details.",
          //   });
          // }
          req.user = user;
          req.userType = "user";
          return next();
        }

        const admin = await Admin.findById(req.user.userId).select("-password");
        if (admin) {
          req.user = admin;
          req.userType = "admin";
          return next();
        }

        return res.status(401).json({ message: "Unauthorized access" });
      } catch (error) {
        return res
          .status(500)
          .json({ message: "Internal server error", error });
      }
    }
  );
};

const isAdmin = (req, res, next) => {
  if (req.userType !== "admin") {
    return res.status(403).json({ message: "Forbidden: Admins only" });
  }
  next();
};

module.exports = {
  verifyJWT,
  createJWT,
  isAdmin,
};
