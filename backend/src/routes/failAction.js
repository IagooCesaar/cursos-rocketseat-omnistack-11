const failAction = (req, h, err) => {
  throw err;
};

module.exports = failAction;
