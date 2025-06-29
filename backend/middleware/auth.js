import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
  const token = req.headers.token;
  if (!token) {
    return res.status(401).json({ success: false, message: "Login required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id };  
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
};

export default authUser;
