const config = require('config');
const pool = require('./pgconnection');
const { validate } = require('../helpers/validation');

/**
 * Validate user login
 * @param {*} info 
 * @returns 
 */

 async function validateAddProfile(info) {
    return new Promise(async function (resolve, reject) {
      try {
        let rules = {
          user_id: 'required',
            meb_id: 'required',
            firstname: 'required',
            lastname: 'required',
            email: 'required',
            phone: 'required',
            password: 'required',
        }
  
        const message = {}
        await validate(info, rules, []);
        resolve(true);
      } catch (error) {
        reject(error)
      }
    })
  }


  exports.validateAddProfile = validateAddProfile