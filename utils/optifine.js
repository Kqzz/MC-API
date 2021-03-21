const axios = require('axios');
const Jimp = require('jimp');

exports.OptifineCape = (username) => new Promise((resolve, reject) => {
  const url = `http://s.optifine.net/capes/${username}.png`;

  axios.get(url)
    .then((resp) => {
      if (resp.status === 200) {
        resolve({ has_cape: true, cape_url: `https://optifine.net/capes/${username}.png` });
      }
      else {
        resolve({ has_cape: false, cape_url: '' });
      }
    })
    .catch((err) => {
      if (err.response.status === 404) {
        resolve({ has_cape: false, cape_url: '' });
      }
      else {
        reject({ error: err, status: 500 });
      }
    });
});

exports.CroppedOptifineCape = (username, scale) => new Promise((resolve, reject) => {
  const url = `http://s.optifine.net/capes/${username}.png`;
  if (scale > 100) {
    reject({ error: 'use a lower scale LOL', status: 400 });
  }
  Jimp.read(url)
    .then((cape) => {
      try {
        resolve(cape
          .crop(2, 2, 20, 32)
          .scale(scale, Jimp.RESIZE_NEAREST_NEIGHBOR)
          .getBufferAsync('image/png'));
      }
      catch (err) {
        resolve(cape
          .crop(1, 1, 10, 16)
          .scale(scale, Jimp.RESIZE_NEAREST_NEIGHBOR)
          .getBufferAsync('image/png'));
      }
    })
    .catch((err) => reject({ error: err, status: 500 }));
});
