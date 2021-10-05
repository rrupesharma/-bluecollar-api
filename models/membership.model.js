const config = require('config');
const pool = require('./pgconnection');
const { validate } = require('../helpers/validation');

/**
 * Validate user login
 * @param {*} info 
 * @returns 
 */