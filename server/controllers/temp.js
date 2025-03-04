export const facultyLogin = (req, res) => {
    const { faculty_id, password } = req.body;
  
    if (!faculty_id || !password) {
      return res
        .status(400)
        .json({ message: "Faculty ID and password are required!" });
    }
  
    pool.query(
      "SELECT * FROM faculty_auth WHERE faculty_id = ?",
      [faculty_id],
      (err, results) => {
        if (err) {
          console.error("Database Error:", err);
          return res.status(500).json({ message: "Server error!" });
        }
  
        if (results.length === 0) {
          return res.status(404).json({ message: "Faculty ID not found!" });
        }
  
        const user = results[0];
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) return res.status(500).json({ message: "Server error!" });
          if (!isMatch)
            return res.status(401).json({ message: "Invalid password!" });
  
          pool.query(
            `SELECT fd.faculty_name, fa.designation 
             FROM faculty_details fd 
             LEFT JOIN faculty_association fa ON fd.faculty_id = fa.faculty_id 
             WHERE fd.faculty_id = ?`,
            [faculty_id],
            (err, facultyResults) => {
              if (err) {
                console.error("Database Error:", err);
                return res.status(500).json({ message: "Server error!" });
              }
          
              if (facultyResults.length === 0) {
                return res
                  .status(404)
                  .json({ message: "Faculty details not found!" });
              }
          
              const { faculty_name, designation } = facultyResults[0];
          
              // Fetch counts from all tables in a single query
              pool.query(
                `SELECT 
                    (SELECT COUNT(*) FROM faculty_research_paper WHERE faculty_id = ?) AS research_papers,
                    (SELECT COUNT(*) FROM faculty_sponsored_research WHERE faculty_id = ?) AS sponsorships,
                    (SELECT COUNT(*) FROM faculty_patents WHERE faculty_id = ?) AS patents,
                    (SELECT COUNT(*) FROM faculty_Book_records WHERE faculty_id = ?) AS book_records,
                    (SELECT COUNT(*) FROM faculty_consultancy WHERE faculty_id = ?) AS consultancy`,
                [faculty_id, faculty_id, faculty_id, faculty_id, faculty_id],
                (err, countResults) => {
                  if (err) {
                    console.error("Database Error:", err);
                    return res.status(500).json({ message: "Server error!" });
                  }
          
                  const {
                    research_papers,
                    sponsorships,
                    patents,
                    book_records,
                    consultancy,
                  } = countResults[0];
          
          
          const accessToken = generateAccessToken(user.faculty_id);
          const refreshToken = generateRefreshToken(user.faculty_id);
  
          // Set the refresh token in an HTTP-only cookie
          res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Set to true in production (HTTPS only)
            sameSite: "Strict", // Prevent CSRF attacks
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
          });
  
          console.log("Setting Refresh Token Cookie:", refreshToken);
          console.log("Cookies Set in Response:", res.getHeaders()['set-cookie']); // ✅ Log cookies
  
          res.json({
            message: "Login successful!",
            accessToken, // Only send access token in response
            user: {
              faculty_id: user.faculty_id,
              faculty_name: faculty_name,
              faculty_designation: designation,
              Position: "faculty",
              researchCount: research_papers,
              sponsorCount: sponsorships,
              patentCount: patents,
              bookCount: book_records,
              consultancyCount: consultancy,
            },
          });
        });
      });
    });
  });
};


  export const refreshToken = (req, res) => {
    const refreshToken = req.cookies.refreshToken; // Get token from cookie
  
    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token is required!" });
    }
  
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Invalid or expired refresh token!" });
      }
  
      // Generate a new access token
      const newAccessToken = generateAccessToken(decoded.faculty_id);
  
      res.json({ accessToken: newAccessToken });
    });
  };
  
  
  // ==================== Logout Controller ====================
  export const logout = (req, res) => {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });
    res.json({ message: "Logged out successfully!" });
  };