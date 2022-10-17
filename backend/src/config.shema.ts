import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  FT_CLIENT_ID: Joi.string().required(),
  FT_CLIENT_SECRET: Joi.string().required(),
  DATABASE_SCHEMA: Joi.string().required(),
  DATABASE_HOST: Joi.string().required(),
  DATABASE_USER: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
});
