const axios = require("axios");

exports.usernameToUUID = async (username) => {
  const response = await axios
    .get(`https://api.mojang.com/users/profiles/minecraft/${username}`)
    .catch((err) => {
      console.log("err!");
      //   response.data.id = undefined;
    });
  // console.log(response.data);
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

  let ret_data = { skin: data.data.properties };

  const skin_url = JSON.parse(
    Buffer.from(ret_data.skin[0].value, "base64").toString("utf-8")
  ).textures.SKIN.url;

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
