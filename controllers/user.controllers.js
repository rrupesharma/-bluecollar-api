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

const loginDomainCheck = async (req, res) => {
    try {
        let rules = {
            email: 'required',
            password: 'required',
            domain: 'required'
        }

        await validate(req.body, rules, []);
        let email = req.body.email;
        let password = req.body.password;
        let domain = req.body.domain;
        //  let query = `select * from admin_tbl where username='${username}' and password='${md5(password)}' and is_active = true`;
        let query = `select * from user_tbl
                     INNER JOIN domain_tbl on domain_tbl.d_id::character varying = any (user_tbl.domain) WHERE email= '${email}' and password='${password}' and domain='${domain}' and user_tbl.is_active = true`;

        let result = await pool.executeQueryWithMsg(query, [], 'INVALID USERNAME, PASSWORD OR DOMAIN');
        let iplocations = await iplocation.getIpLocation(req);
        let data = result[0];
        data.iplocation = iplocations
        let token = await jwtToken.generateLogin(data);
        console.log(res);
        return returnStatus(res, {userData: data, token: token}, 200, 'success')
    } catch (error) {
        if (error.stack) {
            console.log("error", new Date(), ":", error)
            //    sysErrorLog(error,__filename.slice(__dirname.length + 1))
        }
        return returnStatus(res, error.erorrLog || {}, error.status || 500, error.message)
    }
}

const getAll = async (req, res)=>{
    try {
        let rules = {
            limit: 'required',
            offset: 'required',
        }

        await validate(req.body, rules,[]);
        let limit = req.body.limit;
        let offset = req.body.offset;
        let key = req.body.key!=undefined && req.body.key!=''?`and (lower(firstname) like lower('%${req.body.key}%') or lower(lastname) like lower('%${req.body.key}%') or lower(email) like lower('%${req.body.key}%')) `:"";
        let query = `select * from public.user_tbl where is_delete = false ${key} order by creation_dt desc limit ${limit} offset ${offset}`;
        let result =  await pool.executeQueryWithMsg(query,[],'No records available.')
        query = `select count(id) as cnt from public.user_tbl where is_delete = false ${key}`;
        let resultCount =  await pool.executeQuery(query,[])
        let data = {
            totalCount : parseInt(resultCount.rows[0]['cnt']),
            result : result
        }
        return returnStatus(res, data, 200, 'success')

    } catch (error) {
        if (error.stack){
            console.log("error", new Date(), ":", error)
        }
        return returnStatus(res, error.erorrLog || {}, error.status || 500, error.message)
    }
}

const getById = async (req, res)=>{
    try {
        let id = req.user.user_id;
        let query = `select *
        from public.user_tbl user
        where user.user_id = ${id}`;
        //console.log("getById====",id,query)
        let result =  await pool.executeQueryWithMsg(query,[],'No records available.')
        let data = result[0];
        return returnStatus(res, data, 200, 'success')

    } catch (error) {
        if (error.stack){
            console.log("error", new Date(), ":", error);
           // sysErrorLog(error,__filename.slice(__dirname.length + 1))
        }
        return returnStatus(res, error.erorrLog || {}, error.status || 500, error.message)
    }
}


const setForgotPassword = async (req, res)=>{
    try {

        let rules = {
            token: 'required|checkToken',
            password: 'required|conf_password:'+req.body.confpassword
        }

        await validate(req.body, rules,[]);
        let token = req.body.token;
        let password = req.body.password;
        let query = `update usre_tbl set password='${md5(password)}',token='' where token='${token}'`;
        // console.log(query);
        let result = await pool.executeQuery(query, [])

        return returnStatus(res, {}, 200, 'success')

    } catch (error) {
        if (error.stack){
            console.log("error", new Date(), ":", error)
            sysErrorLog(error,__filename.slice(__dirname.length + 1))
        }
        return returnStatus(res, error.erorrLog || {}, error.status || 500, error.message)
    }
}

const setChangePassword = async (req, res)=>{
    try {
        console.log("req.user===",req.user)
        let rules = {
            password: 'required|conf_password:'+req.body.confpassword
        }

        await validate(req.body, rules,[]);
        let token = req.body.token;
        let password = req.body.password;
        let query = `update user_tbl set password='${md5(password)}' where id='${req.user.user_id}'`;
        let result = await pool.executeQuery(query, [])

        return returnStatus(res, {}, 200, 'success')

    } catch (error) {
        if (error.stack){
            console.log("error", new Date(), ":", error)
            sysErrorLog(error,__filename.slice(__dirname.length + 1))
        }
        return returnStatus(res, error.erorrLog || {}, error.status || 500, error.message)
    }
}

const sendForgotPasswordLink = async (req, res)=>{
    try {

        let rules = {
            email: 'required|email|checkLink'
        }

        await validate(req.body, rules,[]);
        let email = req.body.email;
        let token = await jwtToken.generate({ "email": email, action: 'reset'}, 0.5)
        //let jwtDataDecord = await jwtToken.verify(jwtData)

        let query = `update user_tbl set token='${token}' where email = '${email}' Returning *;`;
        // console.log(query);
        let resultAdmin = await pool.executeQuery(query, [])
        //mail.send(email,'Sunshine reset password token',`Hi, <br><br>
        //please use below token to reset password <a href='https://sunshine-admin-frontend-dev.herokuapp.com/#/set-pwd?token=${token}'>link</a>`)
        //let result = await getEmailTemplate('Dashboard Forgot Password Link');
        //let name = resultAdmin.rows[0].first_name+' '+resultAdmin.rows[0].last_name;
        //let link = `${config.dasboardUrl}/#/set-pwd?token=${token}`;
        //let subject = result['temp_subject'];
        //let body = result['temp_body'].replace('{NAME}',name).replace('{TOKEN}',token);
        //mail.send(email,subject,body);
        return returnStatus(res, {}, 200, 'successfully send mail')

    } catch (error) {
        if (error.stack){
            console.log("error", new Date(), ":", error)
            sysErrorLog(error,__filename.slice(__dirname.length + 1))
        }
        return returnStatus(res, error.erorrLog || {}, error.status || 500, error.message)
    }
}


module.exports = { 
    create,
    loginDomainCheck,
    getAll, 
    getById,
    setForgotPassword,
    setChangePassword,
    sendForgotPasswordLink
}