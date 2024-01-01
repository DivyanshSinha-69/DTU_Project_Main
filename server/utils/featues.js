import jwt from 'jsonwebtoken';

export const sendCookie = (user, res, message, statusCode = 200) => {
  try {
    console.log(user.id);
    const token = jwt.sign({ _id: user?.id }, "dtuece");
    console.log('Generated token:', token);

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
