const axios = require("axios");

const cape_uuids = {};

exports.usernameToUUID = async (username) => {
  const response = await axios
    .get(`https://api.mojang.com/users/profiles/minecraft/${username}`)
    .catch((err) => {
      console.log("err!");
      //   response.data.id = undefined;
    });
  let legacy = false;
  let demo = false;

  if (response.data.legacy != undefined) {
    legacy = true;
  }
  if (response.data.demo != undefined) {
    demo = true;
  }

  return {
    uuid: response.data.id,
    username: response.data.name,
    legacy: legacy,
    demo: demo,
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

  console.log(data.data);

  let ret_data = { skin: {}, cape: {} };

  const decoded_value = JSON.parse(
    Buffer.from(data.data.properties[0].value, "base64").toString("utf-8")
  );

  if (decoded_value.textures.SKIN.metadata === undefined) {
    ret_data.skin.custom = false;
    ret_data.skin.slim = false;
  } else {
    ret_data.skin.custom = true;
    ret_data.skin.slim =
      decoded_value.textures.SKIN.metadata.model === "slim" ? true : false;
  }

  ret_data.skin.url = decoded_value.textures.SKIN.url;

  try {
    ret_data.cape.url = decoded_value.textures.CAPE.url;
    ret_data.cape.cape = true;
  } catch {
    ret_data.cape.cape = false;
    ret_data.cape.url = '';
  }
  

  return ret_data;
};

// exports.created = async (id, name, lower, upper, side, accurate) => {
//     var date, middle, response;
//     if (lower == null) {
//       lower = 1242518400000;
//     }
//     if (upper == null) {
//       upper = Math.floor(Date.now());
//     }
//     if (side == null) {
//       side = 0;
//     }
//     if (accurate == null) {
//       accurate = false;
//     }
//     if (!(date = await(BIRTHDAYS.get(id, "text")))) {
//       middle = lower + Math.floor((upper - lower) / 2);
//       if (lower.asDay() === upper.asDay()) {
//         await(BIRTHDAYS.put(id, date = accurate ? middle.asDay() : "null"));
//       } else if (response = await(this.usernameToUuid(name, Math.floor(middle / 1000)))) {
//         return created(id, name, lower, middle, -1, accurate || side - 1 === 0);
//       } else {
//         return created(id, name, middle, upper, +1, accurate || side + 1 === 0);
//       }
//     }
//     if (date === "null") {
//       return null;
//     } else {
//       return date;
//     }
// };
