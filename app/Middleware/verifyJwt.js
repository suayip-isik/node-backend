import jwt from "jsonwebtoken";

const verifyJwt = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  const allowedPaths = ["/api/users/login", "/api/users/signup"];
  if (allowedPaths.includes(req.path)) {
    return next();
  } else {
    if (token == null)
      return res.status(401).json({
        message: "Token gerekli",
      });

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
      if (err) return res.status(403).json({ message: "Geçersiz token" });
      req.user = user;
      next();
    });
  }
};

export { verifyJwt };
