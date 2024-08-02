const Admin = require("../models/admin");
const bcrypt = require("bcrypt");
const { createJWT } = require("../middleware/jwt");

// REGISTER ADMIN
const RegisterAdmin = async (req, res, next) => {
  const { name, email, password } = req.body;
  const safeEmail = email.toLowerCase();

  const secret = req.headers["x-admin-secret"];

  if (secret !== process.env.ADMIN_REGISTER_SECRET) {
    return res.status(403).json({ message: "Forbidden: Invalid secret" });
  }

  try {
    const existingAdmin = await Admin.findOne({ email: safeEmail });
    if (existingAdmin) {
      return next({
        error: { message: "Admin with this email already exists" },
        status: 409,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      name,
      email: safeEmail,
      password: hashedPassword,
    });

    await newAdmin.save();

    req.user = newAdmin.toObject();
    delete req.user.password;

    createJWT(req, res);
  } catch (error) {
    next({ error });
  }
};

// LOGIN ADMIN
const LoginAdmin = async (req, res, next) => {
  const { email, password } = req.body;
  const safeEmail = email.toLowerCase();

  try {
    const admin = await Admin.findOne({ email: safeEmail });

    if (!admin) {
      return next({
        error: { message: "Invalid email or password" },
        status: 401,
      });
    }

    const passwordMatch = await bcrypt.compare(password, admin.password);
    if (!passwordMatch) {
      return next({
        error: { message: "Invalid email or password" },
        status: 401,
      });
    }

    req.user = admin.toObject();
    delete req.user.password;

    createJWT(req, res);
  } catch (error) {
    next({ error });
  }
};

module.exports = {
  RegisterAdmin,
  LoginAdmin,
};
