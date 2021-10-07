const config = require('config');
const pool = require('./pgconnection');
const { validate } = require('../helpers/validation');

/**
 * Validate user login
 * @param {*} info 
 * @returns 
 */

 async function validateAddWishlist(info) {
    return new Promise(async function (resolve, reject) {
      try {
        let rules = {
            user_id: 'required'
        }
  
        const message = {}
        await validate(info, rules, []);
        resolve(true);
      } catch (error) {
        reject(error)
      }
    })
  }

  async function validateEditWishlist(info) {
    return new Promise(async function (resolve, reject) {
      try {
        let rules = {
            user_id: 'required'
        }
  
        const message = {}
        await validate(info, rules, []);
        resolve(true);
      } catch (error) {
        reject(error)
      }
    })
  }


  exports.validateAddWishlist = validateAddWishlist
  exports.validateEditWishlist = validateEditWishlist