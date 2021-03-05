const axios = require('axios');
const cheerio = require('cheerio');

exports.userStats = (identifier) => new Promise((resolve, reject) => {
  // identifier can either uuid, uuid with dashes, or ign.

  const url = `https://namemc.com/profile/${identifier}`;
  axios.get(url)
    .then((response) => {
      const data = {};
      const $ = cheerio.load(response.data);

      data.username = $('body > main > h1').text();

      data.uuid = $(
        'body > main > div > div.col-lg-8.order-lg-2 > div:nth-child(1) > div.card-body.py-1 > div:nth-child(2) > div.col-12.order-md-2.col-md > samp'
      ).text();

      data.location = $(
        'body > main > div > div.col-lg-8.order-lg-2 > div:nth-child(5) > div.card-body.py-1 > div:nth-child(1) > div.col-auto'
      ).text();

      if (data.location === 'Accounts' || data.location === '\nEmerald\n') {
        data.location = '';
      }

      data.views = parseInt(
        $(
          'body > main > div > div.col-lg-8.order-lg-2 > div:nth-child(1) > div.card-body.py-1 > div:nth-child(4) > div.col-auto'
        )
          .text()
          .split(' ')[0],
        10
      );

      data.accounts = {};

      $(
        'body > main > div > div.col-lg-8.order-lg-2 > div:nth-child(5) > div.card-body.py-1 > div.row.no-gutters.align-items-center > div.col.text-right.text-md-left'
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
        'body > main > div > div.col-lg-4.order-lg-1 > div:nth-child(3) > div.card-body.text-center'
      )
        .find('a')
        .each((index, value) => {
          data.skins.skin_ids.push($(value).attr('href').split('/').pop());
        });

      for (let index = 0; index < data.skins.skin_ids.length; index += 1) {
        const element = data.skins.skin_ids[index];

        data.skins.texture_urls.push(`https://namemc.com/texture/${element}.png`);
      }

      resolve(data);
    })
    .catch((err) => {
      if (err.response.status === 503) {
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
            name = name.replace('/name/', '');
            if (!already_checked.includes(name)) {
              const to_push = {};

              to_push.name = name.replace('/name/', '');
              to_push.droptime = Date.parse(
                $(v).find('time').attr('datetime')
              ) / 1000;

              to_push.searches = $(v).find(
                'div .col-auto.col-md.order-md-3.text-right.tabular'
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
