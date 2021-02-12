const { OptifineCape } = require("./other");

test("checks if mc account has optifine cape", async () => {
  expect(await OptifineCape('notch')).toEqual(true);
});
