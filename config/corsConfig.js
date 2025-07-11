
import { WHITE_LIST_URLS } from "../constants/forntEndUrl.js";

export const corsOptions = {
    origin: function (origin, callback) {
      var originIsWhitelisted = WHITE_LIST_URLS.indexOf(origin) !== -1
      callback(null, originIsWhitelisted)
          },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS','PATCH', 'HEAD'],
  }

  