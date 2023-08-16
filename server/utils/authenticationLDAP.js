const ldap = require("ldapjs");

function getADUser(username) {
  const client = ldap.createClient({
    url: process.env.LDAP_URL,
    idleTimeout: 1000,
    tlsOptions: {
      rejectUnauthorized: false,
    },
  });
  client.on("error", function (err) {
    console.warn("LDAP connection failed", err);
  });

  var adUser = null;
  const opts = {
    filter: `(&(objectClass=user)(samAccountName=${username}))`,
    scope: "sub",
  };

  const searchUser = new Promise((resolve, reject) => {
    client.bind(process.env.LDAP_USER, process.env.LDAP_PASSWORD, (err) => {
      if (err) {
        console.error("Unable to start a service due to invalid service users");
        reject();
      }

      client.search(`${process.env.LDAP_BASE_DN}`, opts, (err, res) => {
        if (err) {
          console.log(err);
          reject();
        }

        res.on("searchEntry", function (entry) {
          const { attributes } = entry.pojo;

          const sAMAccountNameFilter = attributes.filter(
            (attribute) => attribute.type === "sAMAccountName"
          );

          const distinguishedNameFilter = attributes.filter(
            (attribute) => attribute.type === "distinguishedName"
          );

          adUser = {
            accountName: sAMAccountNameFilter[0].values[0],
            dn: distinguishedNameFilter[0].values[0],
          };
        });

        res.on("error", (err) => {
          client.destroy();
          reject();
        });
        res.on("end", () => {
          client.destroy();
          resolve(adUser);
        });
      });
    });
  });

  return searchUser;
}

const authenticate = async (username, password) => {
  const client = ldap.createClient({
    url: process.env.LDAP_URL,
    tlsOptions: {
      rejectUnauthorized: false,
    },
  });
  client.on("error", function (err) {
    console.warn("LDAP connection failed", err);
  });

  const adUser = await getADUser(username);
  if (!adUser) {
    return null;
  }

  const checkUser = new Promise((resolve, reject) => {
    client.bind(
      process.env.LDAP_USER,
      process.env.LDAP_PASSWORD,
      (err, res) => {
        if (err) {
          console.err("Unable to start a service due to invalid service users");
          client.destroy();
          reject();
        }

        const c = ldap.createClient({
          url: process.env.LDAP_URL,
          tlsOptions: {
            rejectUnauthorized: false,
          },
        });

        client.on("error", function (err) {
          console.warn("LDAP connection failed", err);
        });

        c.bind(adUser.dn, password, (err) => {
          if (err) {
            client.destroy();
            resolve(null);
          }
          client.destroy();
          resolve({ accountName: adUser.accountName });
        });
      }
    );
  });

  return await checkUser;
};

module.exports = authenticate;
