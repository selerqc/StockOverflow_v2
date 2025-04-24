const jsonwebtoken = require("jsonwebtoken");

module.exports = jwtManager = (user) => {
  return jsonwebtoken.sign(
    {
      _id: user._id,
      username: user.username,
    },
    process.env.jwt_salt
  );
};
