/* eslint-disable consistent-return, no-param-reassign */

import joi from 'joi';

const schema = {
  page: joi.number().default(1),
  limit: joi.number().default(25),
  filter: joi.object().keys({
    name: joi.string(),
    rent: joi.number(),
    sqft: joi.number(),
    bedrooms: joi.number(),
    floor: joi.number(),
    wantVacant: joi.boolean(),
  }),
  sort: joi.object(),
};

module.exports = (req, res, next) => {
  const result = joi.validate(req.query, schema);

  if (result.error) {
    res.status(400).send({ messages: result.error.details.map(d => d.message) });
  } else {
    if (result.value.wantRented) res.locals.renter = null;
    res.locals = result.value;
    res.locals.skip = (res.locals.page - 1) * res.locals.limit;
    console.log(res.locals);
    next();
  }
};
