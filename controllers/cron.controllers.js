const pool = require('../models/pgconnection');
const { returnStatus, sysErrorLog, pgFormat } = require('../helpers/utils');
const { validate } = require('../helpers/validation');

const getCron = async () => {
    let tbl_name = "public.myob_cron";
    let tbl_query = "";
    try {
        tbl_query = `SELECT * FROM ${tbl_name} WHERE isdelete = 'false' ORDER BY id DESC`;
        let result = await pool.executeQuery(tbl_query);
        return result.rows;
    } catch (error) {
        console.log("tbl_query: ", tbl_query);
        sysErrorLog(error,__filename.slice(__dirname.length + 1),true)
        console.log("ERROR==========", error);
    }
}

const getAll = async (req, res) => {
    let tbl_name = "public.myob_cron";
    let tbl_query = "";
    try {
        let rules = {
            limit: 'required',
            offset: 'required'
        }
        await validate(req.body, rules, []);
        let limit = req.body.limit || 10;
        let offset = req.body.offset || 0;
        tbl_query = `SELECT * from ${tbl_name} WHERE isdelete = 'false' ORDER BY id DESC LIMIT ${limit} OFFSET ${offset}`;
        let result =  await pool.executeQueryWithMsg(tbl_query, [], 'No records available.');
        tbl_query = `SELECT COUNT(id) AS cnt FROM ${tbl_name} WHERE isdelete = 'false'`;
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
    let tbl_name = "public.myob_cron";
    let tbl_query = "";
    try {
        let id = req.params.id || 0;
        tbl_query = `SELECT * FROM ${tbl_name} WHERE id = '${id}' AND isdelete = 'false'`;
        let result =  await pool.executeQueryWithMsg(tbl_query, [], 'No records available.');
        return returnStatus(res, result, 200, 'success');
    } catch (error) {
        if (error.stack){
            console.log("error", new Date(), ":", error);
            sysErrorLog(error, __filename.slice(__dirname.length + 1));
        }
        return returnStatus(res, error.erorrLog || {}, error.status || 500, error.message);
    }
}

const del = async (req, res) => {
    let tbl_name = "public.myob_cron";
    let tbl_query = "";
    try {
        let id = req.params.id || 0;
        tbl_query = `UPDATE ${tbl_name} SET (isdelete, scheduled) = ('true', 'false') WHERE id = '${id}'`;
        await pool.executeQuery(tbl_query, []);
        return returnStatus(res, {}, 200, 'success');
    } catch (error) {
        if (error.stack){
            console.log("error", new Date(), ":", error);
            sysErrorLog(error, __filename.slice(__dirname.length + 1));
        }
        return returnStatus(res, error.erorrLog || {}, error.status || 500, error.message);
    }
}

const updateStatus = async (req, res) => {
    let tbl_name = "public.myob_cron";
    let tbl_query = "";
    try {
        let rules = {
            id: 'required',
            status: 'required'
        }
        await validate(req.body, rules, []);
        let id = req.body.id || 0;
        let status = req.body.status;
        tbl_query = `UPDATE ${tbl_name} SET scheduled = '${status}' WHERE id = '${id}' AND isdelete = 'false'`;
        let result =  await pool.executeQuery(tbl_query, []);
        return returnStatus(res, result, 200, 'success');
    } catch (error) {
        if (error.stack){
            console.log("error", new Date(), ":", error);
            sysErrorLog(error, __filename.slice(__dirname.length + 1));
        }
        return returnStatus(res, error.erorrLog || {}, error.status || 500, error.message);
    }
}

const create = async (req, res) => {
    let tbl_name = "public.myob_cron";
    let tbl_query = "";
    try {
        let rules = {
            apiname: 'required',
            timezone: 'required',
            croninterval: 'required',
            crontime: 'required',
            crontype: 'required'
        }
        await validate(req.body, rules, []);
        let apiname = req.body.apiname || "";
        let timezone = req.body.timezone || "";
        let croninterval = req.body.croninterval || 0;
        let crontime = req.body.crontime || "";
        let crontype = req.body.crontype || "";
        let crondesc = req.body.crondesc || "";
        let name = req.body.name || "";
        tbl_query = `INSERT INTO ${tbl_name} (apiname, timezone, croninterval, crontime, crontype, crondesc, name, createdon) VALUES ('${apiname}', '${timezone}', '${croninterval}', '${crontime}', '${crontype}', '${crondesc}', '${name}', NOW())`;
        let result =  await pool.executeQuery(tbl_query, []);
        return returnStatus(res, result, 200, 'success');
    } catch (error) {
        if (error.stack){
            console.log("error", new Date(), ":", error);
            sysErrorLog(error, __filename.slice(__dirname.length + 1));
        }
        return returnStatus(res, error.erorrLog || {}, error.status || 500, error.message);
    }
}

const update = async (req, res) => {
    let tbl_name = "public.myob_cron";
    let tbl_query = "";
    try {
        let rules = {
            id: 'required'
        }
        await validate(req.body, rules, []);
        let id = req.body.id || 0;
        let apiname = req.body.apiname;
        let timezone = req.body.timezone;
        let croninterval = req.body.croninterval;
        let crontime = req.body.crontime;
        let crontype = req.body.crontype;
        let crondesc = req.body.crondesc;
        let name = req.body.name;
        let fields = [];
        let rows = [];
        if(apiname){
            fields.push('apiname');
            rows.push(apiname);
        }
        if(timezone){
            fields.push('timezone');
            rows.push(timezone);
        }
        if(croninterval){
            fields.push('croninterval');
            rows.push(croninterval);
        }
        if(crontime){
            fields.push('crontime');
            rows.push(crontime);
        }
        if(crontype){
            fields.push('crontype');
            rows.push(crontype);
        }
        if(crondesc){
            fields.push('crondesc');
            rows.push(crondesc);
        }
        if(name){
            fields.push('name');
            rows.push(name);
        }
        rows = pgFormat(rows);
        tbl_query = `UPDATE ${tbl_name} SET (${fields}, updatedon) = (${rows}, NOW()) WHERE id = '${id}' AND isdelete = 'false'`;
        let result =  await pool.executeQuery(tbl_query, []);
        return returnStatus(res, result, 200, 'success');
    } catch (error) {
        if (error.stack){
            console.log("error", new Date(), ":", error);
            sysErrorLog(error, __filename.slice(__dirname.length + 1));
        }
        return returnStatus(res, error.erorrLog || {}, error.status || 500, error.message);
    }
}

module.exports = {
    getCron,
    getAll,
    getById,
    del,
    updateStatus,
    create,
    update
}