// controllers/authController.js
const bcrypt = require('bcrypt');
const Creator = require('../models/Creator');

exports.loginCreator = async (email, password) => {
  const creator = await Creator.findOne({ email });
  if (!creator || !(await bcrypt.compare(password, creator.password))) {
    return null;
  }
  return creator;
};

exports.registerCreator = async (data) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const creator = new Creator({ ...data, password: hashedPassword });
  return await creator.save();
};
