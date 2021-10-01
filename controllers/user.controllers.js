const { returnStatus,sysErrorLog } = require('../helpers/utils');
const pool = require('../models/pgconnection');
const jwtToken = require('../helpers/jwtToken');
const iplocation = require('../helpers/iplocation');
const {validate} = require('../helpers/validation');
const mail = require('../helpers/mail');
const md5 = require('md5');
const {getEmailTemplate} = require('../models/utils.model');
const config = require('config');
const userModel = require('../models/user.model');



const create = async (req, res)=>{
    try {
        let data = req.body;
      //  req.body = filterSingleQoute(req.body);
        await userModel.validateAddUser(req.body);
     //   let token = await jwtToken.generate({ "email": data.email, action: 'verification' ,role: role}, 48)
      //  let createUser = await productModel.insertStockItemsBySupplier(req)
        let query = `INSERT INTO public.user_tbl(
            domain, meb_id, firstname,lastname, email, phone, password, creation_dt)
            VALUES ('${data.domain}','${data.meb_id}','${data.firstname}', '${data.lastname}',  '${data.email}', '${data.phone}', '${data.password}', now()) returning user_id;`;
let result = await pool.executeQuery(query,[]);
        return returnStatus(res, {}, 200, 'success')
    } catch (error) {
        if (error.stack){
            console.log("error", new Date(), ":", error)
         //   sysErrorLog(error,__filename.slice(__dirname.length + 1))
        }
        return returnStatus(res, error.erorrLog || {}, error.status || 500, error.message)
    }
}

module.exports = { 
    create, 
}