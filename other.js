const axios = require("axios");

exports.OptifineCape = async (username) => {
  url = `http://s.optifine.net/capes/${username}.png`;
  let ret = { has_cape: false, cape_url: null }; // the user does have the cape

  resp = await axios.get(url).catch((err) => {
    if (err.response === 404) {
    }
  });

  if (resp.status === 200) {
    ret.has_cape = true
    ret.cape_url = `https://s.optifine.net/capes/${username}.png`
  }

  return ret;
};
