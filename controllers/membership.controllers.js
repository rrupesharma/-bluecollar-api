const config = require('config');
const axios = require('axios');
const { returnStatus,sysErrorLog,filterSingleQoute, pgFormat } = require('../helpers/utils');
const pool = require('../models/pgconnection');
const {validate} = require('../helpers/validation');
const membershipModel = require('../models/membership.model');

const getAll = async (req, res)=>{
    try {
        let rules = {
            limit: 'required',
            offset: 'required',
        }

        await validate(req.body, rules,[]);
        let limit = req.body.limit;
        let offset = req.body.offset;
        let key = req.body.key!=undefined && req.body.key!=''?`and (lower(domain) like lower('%${req.body.key}%') or lower(title) like lower('%${req.body.key}%') or lower(description) like lower('%${req.body.key}%')) `:"";
        let query = `select * from public.membership_tbl where is_delete = false ${key} order by creation_dt desc limit ${limit} offset ${offset}`;
        let result =  await pool.executeQueryWithMsg(query,[],'No records available.')
        query = `select count(meb_id) as cnt from public.membership_tbl where is_delete = false ${key}`;
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
        let rules = {
            id: 'required'
        }
        await validate(req.params, rules,[]);
        let id = req.params.meb_id;
        let query = `select *
        from public.membership_tbl msp
        where msp.meb_id = ${id}`;
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


module.exports = {
    getAll,
    getById

}