import { air } from 'openweather';
import * as dotenv from 'dotenv';

dotenv.config();

air.defaultKey(process.env.OPENWEATHER_API_KEY);

const denverCoords = {
  "x": 39.742043,
  "y": -104.991531,
};

const req = air.ozone()
  .coords(denverCoords.x, denverCoords.y)
  .datetime(new Date());

console.log(req.url());

req.exec()
  .then(res => {
    console.log(res);
  })
  .catch(err => {
    console.log(err);
    throw err;
  });
