const { returnStatus,sysErrorLog } = require('../helpers/utils');
const pool = require('../models/pgconnection');
const {validate} = require('../helpers/validation');
const {getEmailTemplate} = require('../models/utils.model');
const jwtToken = require('../helpers/jwtToken');
const mail = require('../helpers/mail');
const config = require('config');

const all = async (req, res)=>{
    try {
        let query = `select accno,name,email,phone from myob_cr_accs order by name`;
        let result =  await pool.executeQueryWithMsg(query,[],'No records available.')
        return returnStatus(res, result, 200, 'success')

    } catch (error) {
        if (error.stack){
            console.log("error", new Date(), ":", error)
            sysErrorLog(error,__filename.slice(__dirname.length + 1))
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
        let limit = req.body.limit || 10;
        let offset = req.body.offset || 0;
        let key = req.body.key!=undefined && req.body.key!=''?` where (lower(c.name) like lower('%${req.body.key}%') or lower(c.email) like lower('%${req.body.key}%'))`:"";

        let query = `select c.*,case when (select count(id) from admin_tbl where extid = c.accno and role = 'supplier') > 0 then true else false end as has_register
        from public.myob_cr_accs c ${key}
        order by c.id desc limit ${limit} offset ${offset}`;
        let result =  await pool.executeQueryWithMsg(query,[],'No records available.')
        query = `select count(c.id) as cnt from public.myob_cr_accs c ${key}`;
        let countResult = await pool.executeQuery(query, []);
        let data = {
            totalCount : parseInt(countResult.rows[0]['cnt']),
            result : result,
            requestBody:req.body
        }
        return returnStatus(res, data, 200, 'success')

    } catch (error) {
        if (error.stack){
            console.log("error", new Date(), ":", error)
            sysErrorLog(error,__filename.slice(__dirname.length + 1))
        }
        return returnStatus(res, error.erorrLog || {}, error.status || 500, error.message)
    }
}

const getById = async (req, res)=>{
    try {
        let rules = {
            id: 'required'
        }

        await validate(req.params, rules,[]);
        let id = req.params.id;
        let query = `select * from public.myob_cr_accs
        where id = ${id}`;
        let result =  await pool.executeQueryWithMsg(query,[],'No records available.')
        let data = result[0];
        return returnStatus(res, data, 200, 'success')

    } catch (error) {
        if (error.stack){
            console.log("error", new Date(), ":", error)
            sysErrorLog(error,__filename.slice(__dirname.length + 1))
        }
        return returnStatus(res, error.erorrLog || {}, error.status || 500, error.message)
    }
}

const sendVerifcaltionlink = async (req, res)=>{
    try {
        let rules = {
            email: 'required|email',
            name: 'required'
        }

        await validate(req.body, rules,[]);
        let role = 'supplier';
        let email = req.body.email;
        let token = await jwtToken.generate({ "email": email, action: 'verification', role: role}, 10)
        let result = await getEmailTemplate('Dashboard Verification Link');
        email = config.to_mail;
        let name = req.body.name;
        let link = `${config.dasboardUrl}/#/set-pwd?token=${token}`;
        let subject = result['temp_subject'].replace('{ROLE}',role);
        let body = result['temp_body'].replace('{NAME}',name).replace('{LINK}',link);
        mail.send(email,subject,body)
        return returnStatus(res, {}, 200, 'successfully send email')

    } catch (error) {
        if (error.stack){
            console.log("error", new Date(), ":", error)
            sysErrorLog(error,__filename.slice(__dirname.length + 1))
        }
        return returnStatus(res, error.erorrLog || {}, error.status || 500, error.message)
    }
}



module.exports = {
    all,
    getAll,
    getById,
    sendVerifcaltionlink
}