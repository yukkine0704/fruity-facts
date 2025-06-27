import appJson from "./app.json";

export default {
  ...appJson,
  expo: {
    ...appJson.expo,
    extra: {
      ...appJson.expo.extra,
      FDC_API_KEY: process.env.FDC_API_KEY,
    },
  },
};
