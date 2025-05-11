const jsonwebtoken = require("jsonwebtoken");

module.exports = jwtManager = (user) => {
  return jsonwebtoken.sign(
    {
      _id: user._id,
      username: user.username,
      role: user.role,
    },
    process.env.jwt_salt
  );
};
