const mssql = require("mssql");
const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization");

    if (!token) return res.status(400).json({ msg: "Invalid Authentication." });

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!decoded)
      return res.status(400).json({ msg: "Invalid Authentication." });

    const user = await mssql.query`
      SELECT
        PE_user.UID,
        PE_user.user_name,
        PE_role.role_name,
        PE_user.status_flag AS PE_user_Status_flag,
        PE_user_role.status_flag AS PE_user_role_Status_flag
      FROM
        PE_user_role
      INNER JOIN
        PE_user ON PE_user_role.PE_user_UID = PE_user.UID
      INNER JOIN
        PE_role ON PE_user_role.PE_role_UID = PE_role.UID
      WHERE PE_user.UID = ${decoded.id}
    `;

    req.user = user.recordset[0];
    next();
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

module.exports = auth;
