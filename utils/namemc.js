const axios = require('axios');
const cheerio = require('cheerio');

function textureUrl(hash) {
  return `https://texture.namemc.com/${hash[0]}${hash[1]}/${hash[2]}${hash[3]}/${hash}.png`;
}

exports.userStats = (identifier) => new Promise((resolve, reject) => {
  // identifier can either uuid, uuid with dashes, or ign.

  const url = `https://namemc.com/profile/${identifier}`;
  axios.get(url)
    .then((response) => {
      const data = {};
      const $ = cheerio.load(response.data);

      data.username = $('body > main > h1').text();

      data.uuid = $(
        '.col-md-7 > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(3) > samp:nth-child(1)'
      ).text();

      data.uuid_dashes = $(
        'div.align-items-center:nth-child(1) > div:nth-child(3) > samp:nth-child(1)'
      ).text();

      data.location = $(
        '.col-md-7 > div:nth-child(5) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2)'
      ).text();

      if (data.location === 'Accounts' || data.location === '\nEmerald\n') {
        data.location = '';
      }

      data.views = parseInt(
        $(
          '.col-md-7 > div:nth-child(1) > div:nth-child(2) > div:nth-child(4) > div:nth-child(2)'
        )
          .text()
          .split(' ')[0],
        10
      );

      data.accounts = {};

      $(
        '.text-lg-left'
      )
        .find('a')
        .each((i, v) => {
          const acc_type = $(v)
            .find('img')
            .attr('src')
            .split('/')
            .pop()
            .split('.')[0];
          const link_or_void = $(v).attr('href');
          // eslint-disable-next-line no-script-url
          if (link_or_void === 'javascript:void(0)') {
            data.accounts[acc_type] = $(v).data('content');
          }
          else {
            data.accounts[acc_type] = link_or_void;
          }
        });

      data.skins = {
        skin_ids: [],
        texture_urls: []
      };

      $(
        'div.card:nth-child(3) > div:nth-child(2)'
      )
        .find('a')
        .each((index, value) => {
          data.skins.skin_ids.push($(value).attr('href').split('/').pop());
        });

      for (let index = 0; index < data.skins.skin_ids.length; index += 1) {
        const element = data.skins.skin_ids[index];

        data.skins.texture_urls.push(`https://namemc.com/texture/${element}.png`);
      }

      data.optifine_cape = $(
        '.cape-2d'
      ).attr('data-cape-hash');

      if (data.optifine_cape === undefined) {
        data.optifine_cape = null;
      }
      else {
        data.optifine_cape = textureUrl(data.optifine_cape);
      }

      resolve(data);
    })
    .catch((err) => {
      if (err.response !== undefined && err.response.status === 503) {
        reject({ error: 'failed to connect to namemc', status: 500 });
      }
      else {
        reject({ error: err, status: 500 });
      }
    });
});

exports.droptime = (username) => new Promise((resolve, reject) => {
  const url = `https://namemc.com/name/${username}`;
  axios.get(url)
    .then((resp) => {
      const $ = cheerio.load(resp.data);

      const time_attr = $('#availability-time').attr('datetime');
      if (time_attr === undefined) {
        reject({ error: `${username} is not dropping`, status: 400 });
      }
      else {
        resolve({ droptime: Date.parse(time_attr.replace('.000', '')) / 1000 });
      }
    })
    .catch((err) => {
      console.log(err);
      reject({ error: err, status: 500 });
    });
});

exports.upcoming = (length_op = '', length = '', lang = '', searches = '') => new Promise((resolve, reject) => {
  let operator = null;
  switch (length_op) {
    case '<':
      operator = 'le';
      break;
    case '=':
      operator = 'eq';
      break;
    case '>':
      operator = 'ge';
      break;
    default:
      operator = '';
  }
  const url = `https://namemc.com/minecraft-names?sort=&length_op=${operator}length=${length}&lang=${lang}&searches=${searches}`;
  console.log(url);
  axios.get(url)
    .then((resp) => {
      const ret = [];
      const already_checked = [];
      const $ = cheerio.load(resp.data);
      $('.p-0')
        .find('div')
        .each((i, v) => {
          let name = $(v).find('a').attr('href');
          if (name !== undefined) {
            name = name.split('q=');
            name = name[name.length - 1];
            if (!already_checked.includes(name)) {
              const to_push = {};

              to_push.name = name.replace('/name/', '');
              to_push.droptime = Date.parse(
                $(v).find('time').attr('datetime')
              ) / 1000;

              to_push.searches = $(v).find(
                'div .col-auto.col-lg.order-lg-3'
              ).text();

              if (to_push.searches === '‒') {
                to_push.searches = 0;
              }
              else {
                to_push.searches = parseInt(to_push.searches, 10);
              }
              ret.push(to_push);
              already_checked.push(name);
            }
          }
        });
      resolve(ret);
    })
    .catch((err) => {
      reject({ error: err, status: 500 });
    });
});
// https://namemc.com/minecraft-names?sort=asc&length_op=le&length=3&lang=&searches=123

exports.searches = (username) => new Promise((resolve, reject) => {
  const url = `https://namemc.com/search?q=${username}`;
  axios.get(url)
    .then((resp) => {
      const $ = cheerio.load(resp.data);
      const searches = parseInt(
        $(
          '.tabular'
        ).text().split(' ')[0],
        10
      );
      resolve(searches);
    })
    .catch((err) => {
      console.log(err);
      reject({ error: err, status: 500 });
    });
});

exports.skinHash = (hash) => new Promise((resolve) => {
  resolve(`https://texture.namemc.com/${hash[0]}${hash[1]}/${hash[2]}${hash[3]}/${hash}.png`);
});
