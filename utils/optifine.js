const axios = require('axios');

exports.OptifineCape = async (username) => {
  const url = `http://s.optifine.net/capes/${username}.png`;
  const ret = { has_cape: false, cape_url: '' }; // the user does have the cape

  const resp = await axios.get(url).catch((err) => {
    if (err.response.status === 404) {
      return { status: 404 };
    } // TODO: fix.
  });

  if (resp.status === 200) {
    ret.has_cape = true;
    ret.cape_url = `https://s.optifine.net/capes/${username}.png`;
  }

  return ret;
};
