
const jwt = require("jsonwebtoken");

// const verifyToken = (req, res, next) => {
//   const authHeader = req.headers.token;
//   if (authHeader) {
//     const token = authHeader && authHeader.split(" ")[1];
//     jwt.verify(token, process.env.JWT_SEC, (err, user) => {
//       if (err) res.status(403).json("Token is not valid!");
//       req.user = user;
//       next();
//     });
//   } else {
//     return res.status(401).json("You are not authenticated!");
//   }
// };
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization; // Use req.headers.authorization instead of req.headers.token

  if (authHeader) {
    const token = authHeader && authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SEC, (err, user) => {
      if (err) res.status(403).json("Token is not valid!");
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json("You are not authenticated!");
  }
};

// const verifyToken = (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (authHeader) {
//     const token = authHeader.split(" ")[1];
//     try {
//       const user = jwt.verify(token, process.env.JWT_SEC);
//       req.user = user; // Attach the user object to req.user
//       next();
//     } catch (err) {
//       res.status(403).json({ error: "Token is not valid!" });
//     }
//   } else {
//     res.status(401).json({ error: "You are not authenticated!" });
//   }
// };

const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.body.id === req.params.id || req.body.isAdmin) {
      next();
    } else {
      res.status(403).json("You are not alowed to do that!");
    }
  });
};

const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("You are not alowed to do that!");
    }
  });
};

module.exports = {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
};