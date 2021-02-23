const axios = require('axios');

exports.profile = (uuid) => new Promise((resolve, reject) => {
  const url = `https://sessionserver.mojang.com/session/minecraft/profile/${uuid}`;
  axios.get(url)
    .then((data) => {
      const ret_data = { skin: {}, cape: {} };

      const decoded_value = JSON.parse(
        Buffer.from(data.data.properties[0].value, 'base64').toString('utf-8')
      );

      // if (decoded_value.textures.SKIN.metadata === undefined) {
      //   ret_data.skin.custom = false;
      //   ret_data.skin.slim = false;
      // }

      // ret_data.skin.slim = ret_data.skin.custom = (decoded_value.textures.SKIN.metadata !== undefined);

      ret_data.skin.url = decoded_value.textures.SKIN.url;

      if (decoded_value.textures.SKIN.metadata !== undefined) {
        ret_data.skin.slim = decoded_value.textures.SKIN.metadata.model === 'slim';
      }
      else {
        ret_data.skin.slim = false;
      }

      ret_data.skin.custom = [
        'https://textures.minecraft.net/texture/3b60a1f6d562f52aaebbf1434f1de147933a3affe0e764fa49ea057536623cd3',
        'https://textures.minecraft.net/texture/1a4af718455d4aab528e7a61f86fa25e6a369d1768dcb13f7df319a713eb810b'
      ].includes(ret_data.skin.url);

      try {
        ret_data.cape.cape = true;
        ret_data.cape.url = decoded_value.textures.CAPE.url;
      }
      catch (_) {
        ret_data.cape.cape = false;
        ret_data.cape.url = '';
      }

      resolve(ret_data);
    })
    .catch((err) => {
      console.log(err);
      reject({ error: err, status: 500 });
    });
});

exports.usernameToUUID = (username) => new Promise((resolve, reject) => {
  axios.get(`https://api.mojang.com/users/profiles/minecraft/${username}`)
    .then((response) => {
      const legacy = response.data.legacy || false;
      const demo = response.data.demo || false;

      resolve({
        uuid: response.data.id,
        username: response.data.name,
        legacy,
        demo
      });
    })
    .catch((err) => {
      console.log(err);
      //   response.data.id = undefined;
      reject({ error: 'something went wrong', status: 500 });
    });
});

exports.nameHistory = (uuid) => new Promise((resolve, reject) => {
  const url = `https://api.mojang.com/user/profiles/${uuid}/names`;
  axios.get(url)
    .then((resp) => {
      resolve(resp.data);
    })
    .catch((err) => {
      console.log(err);
      reject({ error: err, status: 500 });
    });
});
