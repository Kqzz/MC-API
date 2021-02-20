const axios = require('axios');

exports.usernameToUUID = async (username) => {
  const response = await axios
    .get(`https://api.mojang.com/users/profiles/minecraft/${username}`)
    .catch((err) => {
      console.log(err);
      //   response.data.id = undefined;
    });
  let legacy = false;
  let demo = false;

  if (response.data.legacy !== undefined) {
    legacy = true;
  }
  if (response.data.demo !== undefined) {
    demo = true;
  }

  return {
    uuid: response.data.id,
    username: response.data.name,
    legacy,
    demo
  };
};

exports.nameHistory = async (uuid) => {
  const url = `https://api.mojang.com/user/profiles/${uuid}/names`;
  const data = await axios.get(url).catch((err) => {
    console.log(err);
  });

  return data.data;
};

exports.textures = async (uuid) => {
  const url = `https://sessionserver.mojang.com/session/minecraft/profile/${uuid}`;
  const data = await axios.get(url).catch((err) => {
    data.data = undefined;
    console.log(err);
  });

  const ret_data = { skin: {}, cape: {} };

  const decoded_value = JSON.parse(
    Buffer.from(data.data.properties[0].value, 'base64').toString('utf-8')
  );

  if (decoded_value.textures.SKIN.metadata === undefined) {
    ret_data.skin.custom = false;
    ret_data.skin.slim = false;
  }
  else {
    ret_data.skin.custom = true;
    ret_data.skin.slim = decoded_value.textures.SKIN.metadata.model === 'slim';
  }

  ret_data.skin.url = decoded_value.textures.SKIN.url;

  try {
    ret_data.cape.url = decoded_value.textures.CAPE.url;
    ret_data.cape.cape = true;
  }
  catch (_) {
    ret_data.cape.cape = false;
    ret_data.cape.url = '';
  }

  return ret_data;
};


exports.usernameToUUID = new Promise((resolve, reject) => {
  const response = await axios
    .get(`https://api.mojang.com/users/profiles/minecraft/${username}`)
    .catch((err) => {
      console.log(err);
      //   response.data.id = undefined;
    });
  let legacy = false;
  let demo = false;

  let legacy = response.data.legacy || false;
  let demo = response.data.demo || false;


  return {
    uuid: response.data.id,
    username: response.data.name,
    legacy,
    demo
  };
})