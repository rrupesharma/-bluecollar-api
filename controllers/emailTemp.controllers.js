const { returnStatus,sysErrorLog,escapeSingleQuote } = require('../helpers/utils');
const pool = require('../models/pgconnection');
const {validate} = require('../helpers/validation');
const mail = require('../helpers/mail')


const getAll = async (req, res)=>{
    try {
        let rules = {
            limit: 'required',
            offset: 'required'
        }
        await validate(req.body, rules, []);
        let limit = req.body.limit || 10;
        let offset = req.body.offset || 0;
        let query = `select * from email_tempate_tbl order by creation_dt asc limit ${limit} offset ${offset}`;
        let result =  await pool.executeQueryWithMsg(query,[],'No records available.')
        let countQuery = `select count(temp_id) as cnt from email_tempate_tbl`;

        let countResult =  await pool.executeQuery(countQuery,[])
        return returnStatus(res, {
            total_count:parseInt(countResult.rows[0].cnt),
            result:result
        }, 200, 'success')
        return returnStatus(res, result, 200, 'success')

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
        let temp_id = req.params.temp_id;

        let query = `select * from email_tempate_tbl where temp_id=${temp_id}`;

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

const create = async (req, res)=>{
    try {
        let rules = {
            temp_name: 'required',
            temp_subject: 'required',
            temp_body: 'required'
        }
    
        await validate(req.body, rules, []);

        let temp_name = req.body.temp_name;
        let temp_subject = req.body.temp_subject;
        let temp_body = req.body.temp_body;
        let query = `INSERT INTO public.email_tempate_tbl(
            temp_name,temp_subject,temp_body, createdby, creation_dt)
            VALUES ('${temp_name}','${escapeSingleQuote(temp_subject)}','${escapeSingleQuote(temp_body)}', ${req.user.id}, now());`;

        let result =  await pool.executeQuery(query,[])
        
        return returnStatus(res, {}, 200, 'success')

    } catch (error) {
        if (error.stack){
            console.log("error", new Date(), ":", error)
            sysErrorLog(error,__filename.slice(__dirname.length + 1))
        }
        return returnStatus(res, error.erorrLog || {}, error.status || 500, error.message)
    }
}

const update = async (req, res)=>{
    try {
        let rules = {
            temp_id: 'required',
            temp_name: 'required',
            temp_subject: 'required',
            temp_body: 'required'
        }
    
        await validate(req.body, rules, []);

        let temp_id = req.body.temp_id;
        let temp_name = req.body.temp_name;
        let temp_subject = req.body.temp_subject;
        let temp_body = req.body.temp_body;

        let query = `UPDATE public.email_tempate_tbl
        SET temp_name='${temp_name}', temp_subject='${escapeSingleQuote(temp_subject)}', temp_body='${escapeSingleQuote(temp_body)}', updatedby=${req.user.id}
        WHERE temp_id=${temp_id};`;

        let result =  await pool.executeQuery(query,[])
        
        return returnStatus(res, {}, 200, 'success')

    } catch (error) {
        if (error.stack){
            console.log("error", new Date(), ":", error)
            sysErrorLog(error,__filename.slice(__dirname.length + 1))
        }
        return returnStatus(res, error.erorrLog || {}, error.status || 500, error.message)
    }
}

const updateStatus = async (req, res)=>{
    try {
        let rules = {
            temp_id: 'required',
            status: 'required|boolean'
        }
    
        await validate(req.body, rules, []);

        let temp_id = req.body.temp_id;
        let status = req.body.status;

        let query = `UPDATE public.email_tempate_tbl
        SET is_active=${status}
        WHERE temp_id=${temp_id};`;

        let result =  await pool.executeQuery(query,[])
        
        return returnStatus(res, result, 200, 'success')

    } catch (error) {
        if (error.stack){
            console.log("error", new Date(), ":", error)
            sysErrorLog(error,__filename.slice(__dirname.length + 1))
        }
        return returnStatus(res, error.erorrLog || {}, error.status || 500, error.message)
    }
}

const del = async (req, res)=>{
    try {
        let temp_id = req.params.temp_id;

        query = `delete from email_tempate_tbl where temp_id=${temp_id}`;
        await pool.executeQuery(query,[])
        
        return returnStatus(res, {}, 200, 'success')

    } catch (error) {
        if (error.stack){
            console.log("error", new Date(), ":", error)
            sysErrorLog(error,__filename.slice(__dirname.length + 1))
        }
        return returnStatus(res, error.erorrLog || {}, error.status || 500, error.message)
    }
}

const checkMail = async(req,res)=>{
    try {
        let rules = {
            temp_id: 'required',
            email: 'required'
        }
        await validate(req.body, rules, []);
        let temp_id=req.body.temp_id;
        let email = req.body.email;
        let query= `select * from email_tempate_tbl where temp_id=$1`
        const result=await pool.executeQueryWithMsg(query,[temp_id],"Failed")

        let subject = result[0].temp_subject;
        let mailbody = result[0].temp_body;
        console.log(email,subject,mailbody)
        let response = mail.send(email,subject,mailbody)
        return returnStatus(res, {
            result:response
        }, 200, response==false?'failed to send mail':'successfully send mail')

    } catch (error) {
        if (error.stack){
            console.log("error", new Date(), ":", error)
            sysErrorLog(error,__filename.slice(__dirname.length + 1))
        }
        return returnStatus(res, error.erorrLog || {}, error.status || 500, error.message)
    }
}



module.exports = {
    getAll,
    getById,
    create,
    update,
    updateStatus,
    del,
    checkMail
}