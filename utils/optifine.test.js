const { OptifineCape } = require('./optifine');

test('checks if mc account has optifine cape', async () => {
  expect(await OptifineCape('notch')).toEqual({ has_cape: true, cape_url: 'https://s.optifine.net/capes/notch.png' });
});
