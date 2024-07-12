import jwt from "jsonwebtoken";

const createAccessToken = (user) => {
  const data = { userId: user._id };
  return jwt.sign(data, process.env.JWT_SECRET, { expiresIn: "6h" });
};

const verifyAccessToken = (req, res, next) => {
  try {
    if (req.headers.authorization !== undefined) {
      const token = req.headers.authorization.split(" ")[1];

      const { userId } = jwt.verify(token, process.env.JWT_SECRET);
      req.body.userID = userId;
      next();
    } else {
      return res.status(401).send({
        message: "Access token missing.",
      });
    }
  } catch (error) {
    console.error(error.message);
    res.status(403).send({ message: error.message });
  }
};

export { createAccessToken, verifyAccessToken };
