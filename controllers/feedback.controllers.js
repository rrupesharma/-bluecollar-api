const pool = require('../models/pgconnection');
const { returnStatus, sysErrorLog, pgFormat } = require('../helpers/utils');
const { validate } = require('../helpers/validation');


const getAll = async (req, res) => {
    let tbl_name = "public.feedback";
    let tbl_query = "";
    try {
        let rules = {
            limit: 'required',
            offset: 'required'
        }
        await validate(req.body, rules, []);
        let limit = req.body.limit || 10;
        let offset = req.body.offset || 0;
        let key = req.body.key!=undefined && req.body.key!=''?`where f.feedback_msg like '%${req.body.key}%'`:'';
        tbl_query = `SELECT u.user_email,u.first_name,u.last_name,f.* from public.feedback f 
        inner join users u on u.user_id = f.user_id
        ${key} ORDER BY f.id DESC LIMIT ${limit} OFFSET ${offset}`;
        let result =  await pool.executeQueryWithMsg(tbl_query, [], 'No records available.');
        tbl_query = `SELECT COUNT(f.id) AS cnt from public.feedback f 
        inner join users u on u.user_id = f.user_id
        ${key}`;
        let countResult =  await pool.executeQuery(tbl_query, []);
        return returnStatus(res, {
            total_count: parseInt(countResult.rows[0].cnt),
            result: result
        }, 200, 'success');
    } catch (error) {
        if (error.stack){
            console.log("error", new Date(), ":", error);
            sysErrorLog(error, __filename.slice(__dirname.length + 1));
        }
        return returnStatus(res, error.erorrLog || {}, error.status || 500, error.message);
    }
}

const getById = async (req, res) => {
    let tbl_name = "public.feedback";
    let tbl_query = "";
    try {
        let id = req.params.id || 0;
        tbl_query = `SELECT u.user_email,u.first_name,u.last_name,f.* from public.feedback f 
        inner join users u on u.user_id = f.user_id WHERE f.id = '${id}'`;
        let result =  await pool.executeQueryWithMsg(tbl_query, [], 'No records available.');
        return returnStatus(res, result[0], 200, 'success');
    } catch (error) {
        if (error.stack){
            console.log("error", new Date(), ":", error);
            sysErrorLog(error, __filename.slice(__dirname.length + 1));
        }
        return returnStatus(res, error.erorrLog || {}, error.status || 500, error.message);
    }
}


module.exports = {
    getAll,
    getById
}