const { returnStatus, sysErrorLog } = require('../helpers/utils');
const pool = require('../models/pgconnection');
const {validate} = require('../helpers/validation');

const getAll = async (req, res) => {
    let tbl_name = "public.myob_salesorder";
    let tbl_query = "";
    try {
        let rules = {
            limit: 'required',
            offset: 'required'
        };
        await validate(req.body, rules, []);
        let limit = req.body.limit || 10;
        let offset = req.body.offset || 0;
        tbl_query = `SELECT * FROM ${tbl_name} ORDER BY id DESC LIMIT ${limit} OFFSET ${offset}`;
        let result = await pool.executeQueryWithMsg(tbl_query, [], 'No records available.');
        tbl_query = `SELECT COUNT(id) AS cnt FROM ${tbl_name}`;
        let countResult = await pool.executeQuery(tbl_query, []);
        let data = {
            totalCount: parseInt(countResult.rows[0]['cnt']),
            result: result,
            requestBody: req.body
        };
        return returnStatus(res, data, 200, 'success');
    } catch (error) {
        if (error.stack){
            console.log("error", new Date(), ":", error);
            sysErrorLog(error,__filename.slice(__dirname.length + 1));
        }
        return returnStatus(res, error.erorrLog || {}, error.status || 500, error.message);
    }
}

const getById = async (req, res) => {
    let tbl_name = "public.myob_salesorder";
    let tbl_name1 = "public.myob_salesorderline";
    let tbl_query = "";
    try {
        let rules = {
            id: 'required'
        };
        await validate(req.params, rules, []);
        let id = req.params.id || 0;
        tbl_query = `SELECT * FROM ${tbl_name} WHERE id = '${id}'`;
        let result = await pool.executeQueryWithMsg(tbl_query, [], 'No records available.');
        if(result.length > 0) {
            for (let [count, item] of result.entries()) {
                let seqno = item["seqno"];
                tbl_query = `SELECT * FROM ${tbl_name1} WHERE hdr_seqno = '${seqno}'`;
                let result1 = await pool.executeQuery(tbl_query, []);
                result[0]["orderline"] = result1.rows;
            }
        }
        let data = result[0];
        return returnStatus(res, data, 200, 'success');
    } catch (error) {
        if (error.stack){
            console.log("error", new Date(), ":", error);
            sysErrorLog(error,__filename.slice(__dirname.length + 1));
        }
        return returnStatus(res, error.erorrLog || {}, error.status || 500, error.message);
    }
}

module.exports = {
    getAll,
    getById
}