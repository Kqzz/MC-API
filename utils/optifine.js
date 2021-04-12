const axios = require("axios");

exports.OptifineCape = (username) =>
  new Promise((resolve, reject) => {
    const url = `http://s.optifine.net/capes/${username}.png`;

    axios
      .get(url)
      .then((resp) => {
        if (resp.status === 200) {
          resolve({
            has_cape: true,
            cape_url: `https://optifine.net/capes/${username}.png`,
          });
        } else {
          resolve({ has_cape: false, cape_url: "" });
        }
      })
      .catch((err) => {
        if (err.response.status === 404) {
          resolve({ has_cape: false, cape_url: "" });
        } else {
          reject({ error: err, status: 500 });
        }
      });
  });
