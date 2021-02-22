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

      if (data.location === 'Accounts') {
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

      data.skins = {};

      data.skins.skin_ids = [];
      data.skins.texture_urls = [];

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
