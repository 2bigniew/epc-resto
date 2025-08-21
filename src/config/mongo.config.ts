import { cleanEnv, str } from 'envalid';
import { registerAs } from '@nestjs/config';
import { ConfigNames } from '@config/config-names.enum';

const env = cleanEnv(process.env, {
  MONGO_URI: str({ devDefault: 'mongodb://mongo/epc' }),
});

export const MongoConfig = registerAs(ConfigNames.Mongo, () => ({
  mongoUri: env.MONGO_URI,
}));
