const alasql = require('alasql');

const { GENDER, AREA } = require('../utils/constans');

const getProfileQuery = profileCode => `SELECT * FROM panelists WHERE profile = ${profileCode}`;

const getQueryByField = (filterQuery, field, value) => `SELECT * FROM (${filterQuery}) WHERE ${field} = ${value}`;

const getLimitedQueryByField = (filterQuery, field, value, limit) =>
  ` SELECT * FROM (SELECT * FROM (${filterQuery}) WHERE ${field} = ${value} LIMIT ${limit}) `;

const buildCompleteQueryByField = (config, filterQuery, field) =>
  config.reduce((query, fieldConfig) => {
    let specificQuery = '';
    if (fieldConfig.limit) {
      if (query.length) {
        query += 'UNION ALL';
      }
      specificQuery = getLimitedQueryByField(filterQuery, field, fieldConfig.value, fieldConfig.limit);
    }
    return query + specificQuery;
  }, '');

const getGendersQuery = (genderLimits, profileQuery) => {
  const { limitMale, limitFemale } = genderLimits;
  const gendersConfig = [{ value: GENDER.MALE, limit: limitMale }, { value: GENDER.FEMALE, limit: limitFemale }];
  const field = 'gender';
  return buildCompleteQueryByField(gendersConfig, profileQuery, field);
};

const calculateGenderLimits = (genderFilter, profileQuery) => {
  const { male = 0, female = 0 } = genderFilter;
  const field = 'gender';
  const panelistsMale = alasql(getQueryByField(profileQuery, field, GENDER.MALE));
  const panelistsFemale = alasql(getQueryByField(profileQuery, field, GENDER.FEMALE));

  let limitMale, limitFemale;
  if (male > female) {
    limitMale = parseInt(panelistsMale.length);
    limitFemale = parseInt((limitMale * female) / male);
  } else {
    limitFemale = parseInt(panelistsFemale.length);
    limitMale = parseInt((limitFemale * male) / female);
  }
  return { limitMale, limitFemale };
};

const calculateAreaLimits = (area, genderLimitsQuery) => {
  const { noreste = 0, levante = 0, sur = 0, centro = 0 } = area;
  const field = 'area';
  const panelistsAreaNoreste = alasql(getQueryByField(genderLimitsQuery, field, AREA.NORESTE));
  const panelistsAreaLevante = alasql(getQueryByField(genderLimitsQuery, field, AREA.LEVANTE));
  const panelistsAreaSur = alasql(getQueryByField(genderLimitsQuery, field, AREA.SUR));
  const panelistsAreaCentro = alasql(getQueryByField(genderLimitsQuery, field, AREA.CENTRO));

  let limitNoreste, limitLevante, limitSur, limitCentro;
  if (noreste > levante && noreste > sur && noreste > centro) {
    limitNoreste = parseInt(panelistsAreaNoreste.length);
    limitLevante = parseInt((limitNoreste * levante) / noreste);
    limitSur = parseInt((limitNoreste * sur) / noreste);
    limitCentro = parseInt((limitNoreste * centro) / noreste);
  } else if (levante > noreste && levante > sur && levante > centro) {
    limitLevante = parseInt(panelistsAreaLevante.length);
    limitNoreste = parseInt((limitLevante * noreste) / levante);
    limitSur = parseInt((limitLevante * sur) / levante);
    limitCentro = parseInt((limitLevante * centro) / levante);
  } else if (sur > noreste && sur > levante && sur > centro) {
    limitSur = parseInt(panelistsAreaSur.length);
    limitNoreste = parseInt((limitSur * noreste) / sur);
    limitLevante = parseInt((limitSur * levante) / sur);
    limitCentro = parseInt((limitSur * centro) / sur);
  } else {
    limitCentro = parseInt(panelistsAreaCentro.length);
    limitNoreste = parseInt((limitCentro * noreste) / centro);
    limitLevante = parseInt((limitCentro * levante) / centro);
    limitSur = parseInt((limitCentro * sur) / centro);
  }
  return { limitNoreste, limitLevante, limitSur, limitCentro };
};

const getAvailableSample = (profileCode, genderFilter, areaFilter) => {
  const profileQuery = getProfileQuery(profileCode);
  const genderLimits = calculateGenderLimits(genderFilter, profileQuery);
  const genderQuery = getGendersQuery(genderLimits, profileQuery);
  const areaLimits = calculateAreaLimits(areaFilter, genderQuery);
  const limitValues = Object.values(areaLimits);
  return limitValues.reduce((acc, limit) => acc + limit, 0);
};

module.exports = { getAvailableSample };
