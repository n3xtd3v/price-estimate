const mssql = require("mssql");

const userCtrl = {
  getUsers: async (req, res) => {
    try {
      const { role_name, PE_user_Status_flag, PE_user_role_Status_flag } =
        req.user;

      if (
        PE_user_Status_flag !== "active" ||
        PE_user_role_Status_flag !== "active"
      ) {
        return res
          .status(400)
          .json({ msg: "Access is not allowed, please contact supervisor!" });
      }

      if (role_name !== "admin" && role_name !== "supervisor") {
        return res
          .status(400)
          .json({ msg: "This role access is not allowed!" });
      }

      const users = await mssql.query`
        SELECT
          PE_user.UID AS id,
          PE_user.status_flag,
          PE_user.user_name,
          PE_role.role_name,
          PE_user_role.cuser,
          PE_user_role.cwhen,
          PE_user_role.muser,
          PE_user_role.mwhen
        FROM
          PE_user_role
        INNER JOIN 
          PE_user ON PE_user_role.PE_user_UID = PE_user.UID
        INNER JOIN 
          PE_role ON PE_user_role.PE_role_UID = PE_role.UID
      `;

      res.json({
        msg: "Get users success.",
        users: users.recordset,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  updateSwitchIsActive: async (req, res) => {
    try {
      const { role_name, PE_user_Status_flag, PE_user_role_Status_flag } =
        req.user;

      const { selected } = req.body;

      if (
        PE_user_Status_flag !== "active" ||
        PE_user_role_Status_flag !== "active"
      ) {
        return res
          .status(400)
          .json({ msg: "Access is not allowed, please contact supervisor!" });
      }

      if (role_name !== "admin" && role_name !== "supervisor") {
        return res
          .status(400)
          .json({ msg: "This role access is not allowed!" });
      }

      let selectedUsers = [];
      for (i = 0; selected.length > i; i++) {
        const users = await mssql.query`
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
          WHERE PE_user.UID = ${selected[i]}
        `;

        selectedUsers.push(users.recordset[0]);
      }

      if (role_name === "supervisor") {
        const checkRole = selectedUsers.some(
          (selectedUser) => selectedUser.role_name === "admin"
        );
        if (checkRole) {
          return res
            .status(500)
            .json({ msg: "Supervisor are not allowed to update." });
        }
      }

      for (i = 0; selectedUsers.length > i; i++) {
        if (
          selectedUsers[i].PE_user_Status_flag === "active" &&
          selectedUsers[i].PE_user_role_Status_flag === "active"
        ) {
          await mssql.query`
            UPDATE PE_user
            SET status_flag = 'inactive'
            WHERE PE_user.UID = ${selectedUsers[i].UID}
          `;

          await mssql.query`
            UPDATE PE_user_role
            SET status_flag = 'inactive'
            WHERE PE_user_role.UID = ${selectedUsers[i].UID}
          `;
        } else {
          await mssql.query`
            UPDATE PE_user
            SET status_flag = 'active'
            WHERE PE_user.UID = ${selectedUsers[i].UID}
          `;

          await mssql.query`
            UPDATE PE_user_role
            SET status_flag = 'active'
            WHERE PE_user_role.UID = ${selectedUsers[i].UID}
          `;
        }
      }

      const users = await mssql.query`
        SELECT
          PE_user.UID AS id,
          PE_user.status_flag,
          PE_user.user_name,
          PE_role.role_name
        FROM
          PE_user_role
        INNER JOIN 
          PE_user ON PE_user_role.PE_user_UID = PE_user.UID
        INNER JOIN 
          PE_role ON PE_user_role.PE_role_UID = PE_role.UID
      `;

      res.json({
        msg: "Update users success.",
        users: users.recordset,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  updateRoleAdmin: async (req, res) => {
    try {
      const { role_name, PE_user_Status_flag, PE_user_role_Status_flag } =
        req.user;

      const { selected } = req.body;

      if (
        PE_user_Status_flag !== "active" ||
        PE_user_role_Status_flag !== "active"
      ) {
        return res
          .status(400)
          .json({ msg: "Access is not allowed, please contact supervisor!" });
      }

      if (role_name !== "admin" && role_name !== "supervisor") {
        return res
          .status(400)
          .json({ msg: "This role access is not allowed!" });
      }

      let selectedUsers = [];
      for (i = 0; selected.length > i; i++) {
        const users = await mssql.query`
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
          WHERE PE_user.UID = ${selected[i]}
        `;

        selectedUsers.push(users.recordset[0]);
      }

      if (role_name === "supervisor") {
        const checkRole = selectedUsers.some(
          (selectedUser) => selectedUser.role_name === "admin"
        );
        if (checkRole) {
          return res
            .status(500)
            .json({ msg: "Supervisor are not allowed to update." });
        }
      }

      for (i = 0; selected.length > i; i++) {
        await mssql.query`
          UPDATE PE_user_role
          SET PE_role_UID = 1
          WHERE UID = ${selected[i]}
        `;
      }

      const users = await mssql.query`
        SELECT
          PE_user.UID AS id,
          PE_user.status_flag,
          PE_user.user_name,
          PE_role.role_name
        FROM
          PE_user_role
        INNER JOIN 
          PE_user ON PE_user_role.PE_user_UID = PE_user.UID
        INNER JOIN 
          PE_role ON PE_user_role.PE_role_UID = PE_role.UID
      `;

      res.json({
        msg: "Update admin success.",
        users: users.recordset,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  updateRoleSupervisor: async (req, res) => {
    try {
      const { role_name, PE_user_Status_flag, PE_user_role_Status_flag } =
        req.user;

      const { selected } = req.body;

      if (
        PE_user_Status_flag !== "active" ||
        PE_user_role_Status_flag !== "active"
      ) {
        return res
          .status(400)
          .json({ msg: "Access is not allowed, please contact supervisor!" });
      }

      if (role_name !== "admin" && role_name !== "supervisor") {
        return res
          .status(400)
          .json({ msg: "This role access is not allowed!" });
      }

      let selectedUsers = [];
      for (i = 0; selected.length > i; i++) {
        const users = await mssql.query`
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
          WHERE PE_user.UID = ${selected[i]}
        `;

        selectedUsers.push(users.recordset[0]);
      }

      if (role_name === "supervisor") {
        const checkRole = selectedUsers.some(
          (selectedUser) => selectedUser.role_name === "admin"
        );
        if (checkRole) {
          return res
            .status(500)
            .json({ msg: "Supervisor are not allowed to update." });
        }
      }

      for (i = 0; selected.length > i; i++) {
        await mssql.query`
          UPDATE PE_user_role
          SET PE_role_UID = 2
          WHERE UID = ${selected[i]}
        `;
      }

      const users = await mssql.query`
        SELECT
          PE_user.UID AS id,
          PE_user.status_flag,
          PE_user.user_name,
          PE_role.role_name
        FROM
          PE_user_role
        INNER JOIN 
          PE_user ON PE_user_role.PE_user_UID = PE_user.UID
        INNER JOIN 
          PE_role ON PE_user_role.PE_role_UID = PE_role.UID
      `;

      res.json({
        msg: "Update supervisor success.",
        users: users.recordset,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  updateRoleStaff: async (req, res) => {
    try {
      const { role_name, PE_user_Status_flag, PE_user_role_Status_flag } =
        req.user;

      const { selected } = req.body;

      if (
        PE_user_Status_flag !== "active" ||
        PE_user_role_Status_flag !== "active"
      ) {
        return res
          .status(400)
          .json({ msg: "Access is not allowed, please contact supervisor!" });
      }

      if (role_name !== "admin" && role_name !== "supervisor") {
        return res
          .status(400)
          .json({ msg: "This role access is not allowed!" });
      }

      let selectedUsers = [];
      for (i = 0; selected.length > i; i++) {
        const users = await mssql.query`
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
          WHERE PE_user.UID = ${selected[i]}
        `;

        selectedUsers.push(users.recordset[0]);
      }

      if (role_name === "supervisor") {
        const checkRole = selectedUsers.some(
          (selectedUser) => selectedUser.role_name === "admin"
        );
        if (checkRole) {
          return res
            .status(500)
            .json({ msg: "Supervisor are not allowed to update." });
        }
      }

      for (i = 0; selected.length > i; i++) {
        await mssql.query`
          UPDATE PE_user_role
          SET PE_role_UID = 3
          WHERE UID = ${selected[i]}
        `;
      }

      const users = await mssql.query`
        SELECT
          PE_user.UID AS id,
          PE_user.status_flag,
          PE_user.user_name,
          PE_role.role_name
        FROM
          PE_user_role
        INNER JOIN 
          PE_user ON PE_user_role.PE_user_UID = PE_user.UID
        INNER JOIN 
          PE_role ON PE_user_role.PE_role_UID = PE_role.UID
      `;

      res.json({
        msg: "Update staff success.",
        users: users.recordset,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = userCtrl;
