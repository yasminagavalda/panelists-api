const { getAvailableSample } = require('../data/data');

const checkFeasibility = (req, res) => {
  const { profileCode } = req.params;
  const { gender, area } = req.query;
  const availableSample = getAvailableSample(profileCode, gender, area);
  res.send({ availableSample });
};

module.exports = checkFeasibility;
