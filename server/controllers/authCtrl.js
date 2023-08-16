const mssql = require("mssql");
const jwt = require("jsonwebtoken");
const authentication = require("../utils/authenticationLDAP");

const authCtrl = {
  signin: async (req, res) => {
    try {
      const { username, password } = req.body;
      let newUserName = username.toLowerCase().replace(/ /g, "");

      if (!newUserName) {
        return res.status(400).json({ msg: "Please add your username!" });
      }

      if (!password) {
        return res.status(400).json({ msg: "Please add your password!" });
      }

      const userAd = await authentication(username, password);

      if (userAd === null) {
        return res.status(400).json({ msg: "Username or password incorrect!" });
      }

      const checkUserDB = await mssql.query`
        SELECT 
          * 
        FROM 
          PE_user
        WHERE 
          user_name = ${userAd.accountName}
      `;

      if (checkUserDB.rowsAffected[0] === 0) {
        await mssql.query`
          INSERT INTO 
            PE_user (user_name, cuser, cwhen, muser, mwhen, status_flag)
          VALUES 
            (${userAd.accountName}, 0, GETDATE(), 0, GETDATE(), 'inactive');
        `;

        const user = await mssql.query`
          SELECT
            UID
          FROM 
            PE_user
          WHERE
            PE_user.user_name = ${userAd.accountName} 
        `;

        await mssql.query`
          INSERT INTO
            PE_user_role (PE_user_UID, PE_role_UID, cuser, cwhen, muser, mwhen, status_flag)
          VALUES 
            (${user.recordset[0]?.UID}, 3, 0, GETDATE(), 0, GETDATE(), 'inactive');
        `;
      }

      const user = await mssql.query`
        SELECT
          PE_user.UID, PE_user.status_flag, PE_user.user_name, PE_role.role_name 
        FROM
          PE_user_role
        INNER JOIN 
          PE_user ON PE_user_role.PE_user_UID = PE_user.UID
        INNER JOIN 
          PE_role ON PE_user_role.PE_role_UID = PE_role.UID
        WHERE PE_user.user_name = ${userAd.accountName}
      `;

      if (user.recordset[0]?.status_flag === "inactive") {
        return res
          .status(400)
          .json({ msg: "Access is not allowed, please contact supervisor!" });
      }

      const access_token = createAccessToken({
        id: user.recordset[0]?.UID,
      });

      const refresh_token = createRefreshToken({
        id: user.recordset[0]?.UID,
      });

      res.cookie("refreshtoken", refresh_token, {
        httpOnly: true,
        path: "/api/refresh_token",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      res.json({
        msg: "Sign in success.",
        token: access_token,
        user: {
          id: user.recordset[0]?.UID,
          account: user.recordset[0]?.user_name,
          role: user.recordset[0]?.role_name,
          status_flag: user.recordset[0]?.status_flag,
        },
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  signout: async (req, res) => {
    try {
      res.clearCookie("refreshtoken", { path: "/api/refresh_token" });

      return res.json({ msg: "Sign out." });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  generateAccessToken: async (req, res) => {
    try {
      const rf_token = req.cookies.refreshtoken;
      if (!rf_token)
        return res.status(400).json({ msg: "Please sign in now!" });

      jwt.verify(
        rf_token,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, result) => {
          if (err) return res.status(400).json({ msg: "Please sign in now!" });

          const user = await mssql.query`
            SELECT
              PE_user.UID, PE_user.status_flag, PE_user.user_name, PE_role.role_name 
            FROM
              PE_user_role
            INNER JOIN 
              PE_user ON PE_user_role.PE_user_UID = PE_user.UID
            INNER JOIN 
              PE_role ON PE_user_role.PE_role_UID = PE_role.UID
            WHERE PE_user.UID = ${result.id}
          `;

          if (!user)
            return res.status(400).json({ msg: "This does not exist!" });

          const access_token = createAccessToken({ id: result.id });

          res.json({
            token: access_token,
            user: {
              id: user.recordset[0]?.UID,
              account: user.recordset[0]?.user_name,
              role: user.recordset[0]?.role_name,
              status_flag: user.recordset[0]?.status_flag,
            },
          });
        }
      );
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });
};

const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = authCtrl;
