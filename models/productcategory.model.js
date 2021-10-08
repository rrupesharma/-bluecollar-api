const config = require('config');
const pool = require('./pgconnection');
const { validate } = require('../helpers/validation');


/**
 * Validate user login
 * @param {*} info 
 * @returns 
 */

 async function validateAddCategory(info) {
    return new Promise(async function (resolve, reject) {
      try {
        let rules = {
            cat_pid: 'required',
            domain: 'required',
            cat_name: 'required',
            cat_desc: 'required',
            cat_image1: 'required',
            cat_image2: 'required',
            orderno: 'required',
        }
  
        const message = {}
        await validate(info, rules, []);
        resolve(true);
      } catch (error) {
        reject(error)
      }
    })
  }

  async function validateEditCategory(info) {
    return new Promise(async function (resolve, reject) {
      try {
        let rules = {
            cat_id: 'required',
            cat_pid: 'required',
            domain: 'required',
            cat_name: 'required',
            cat_desc: 'required',
            cat_image1: 'required',
            cat_image2: 'required',
            orderno: 'required',
        }
  
        const message = {}
        await validate(info, rules, []);
        resolve(true);
      } catch (error) {
        reject(error)
      }
    })
  }


 exports.validateAddCategory = validateAddCategory
 exports.validateEditCategory = validateEditCategory