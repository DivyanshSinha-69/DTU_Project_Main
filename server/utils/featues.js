import jwt from 'jsonwebtoken';

export const sendCookie = (user, res, message, statusCode = 200) => {
  try {
    // console.log(user.id);
    const token = jwt.sign({ user}, "dtuece");
    // console.log('Generated token:', token);

    res
      .status(statusCode)
      .cookie("token", token, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000
      })
      .json({
        success: true,
        message,
        user
      });
  } catch (error) {
    console.error('Error in sendCookie:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

export const getDataFromToken = (req,res) => {
  try {
    // Get the token from the cookie
    const token = req.cookies.token;
    // console.log(token);
    if (!token) {
      // Handle case where token is not present
      return null;
    }

    // Verify and decode the token
    const decoded = jwt.verify(token,  "dtuece");
    // console.log(decoded);
    res.status(200).json({ user: decoded.user });
  } catch (error) {
    // Handle token verification errors
    res.status(401).json({ error: "No existing token" });
    
  }
};