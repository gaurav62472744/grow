const jwt = require("jsonwebtoken");

const authorization = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, "grow_calculator", (err, decoded) => {
      if (decoded) {
        req.body.user = decoded.userID;
        next();
      } else {
        res.send("Please login first");
      }
    });
  } else {
    res.send("login again");
  }
};

module.exports = authorization;
