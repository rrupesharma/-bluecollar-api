const { returnStatus,sysErrorLog } = require('../helpers/utils');
const pool = require('../models/pgconnection');
const {validate} = require('../helpers/validation');
const {getEmailTemplate} = require('../models/utils.model');
const jwtToken = require('../helpers/jwtToken');
const mail = require('../helpers/mail');
const config = require('config');

const allByMenu = async (req, res)=>{
    try {
        let query = `select u.user_id,case when c.name is null then CAST(u.first_name ||' '|| u.last_name as character varying) else c.name end as fullname, c.accno,c.email
        from public.users u
        left join public.myob_dr_accs c on c.accno = u.accno
        inner join public.menu_tbl m on m.user_id = u.user_id
        group by u.user_id,fullname,c.accno,c.email
        order by fullname`;
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

const allByPantry = async (req, res)=>{
    try {
        let query = `select u.user_id,case when c.name is null then CAST(u.first_name ||' '|| u.last_name as character varying) else c.name end as fullname, c.accno,c.email
        from public.users u
        left join public.myob_dr_accs c on c.accno = u.accno
        inner join public.pantry_tbl m on m.user_id = u.user_id
        group by u.user_id,fullname,c.accno,c.email
        order by fullname`;
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
        let key = req.body.key!=undefined && req.body.key!=''?`and (lower(d.name) like lower('%${req.body.key}%') or lower(d.email) like lower('%${req.body.key}%'))`:"";

        let query = `select d.*,case when (select count(user_id) from users where accno = d.accno) > 0 then true else false end as has_register
        from public.myob_dr_accs d
        where d.is_sync = true ${key}
        order by d.id desc limit ${limit} offset ${offset}`;
        let result =  await pool.executeQueryWithMsg(query,[],'No records available.')
        query = `select count(d.id) as cnt from public.myob_dr_accs d where is_sync = true ${key}`;
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
        let query = `select * from public.myob_dr_accs
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
        let email = req.body.email;
        let token = await jwtToken.generate({ "email": email, action: 'verification'}, 10)
        let result = await getEmailTemplate('Customer Verification Link');
        email = config.to_mail;
        let name = req.body.name;
        let link = `${config.siteUrl}/verify-user?token=${token}`;
        let subject = result['temp_subject'];
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
    allByMenu,
    allByPantry,
    getAll,
    getById,
    sendVerifcaltionlink
}