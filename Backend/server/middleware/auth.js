const jsonwebtoken = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    const accessToken = req.headers.authorization.replace("Bearer ", "");
    const jwtPayload = jsonwebtoken.verify(accessToken, process.env.jwt_salt);

    req.user = jwtPayload;
  } catch (error) {
    res.status(401).json({
      status: error.message,
      message: "Unauthorized",
    });
    return;
  }

  next();
};

module.exports = auth;
