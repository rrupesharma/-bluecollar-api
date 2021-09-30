const { returnStatus,sysErrorLog } = require('../helpers/utils');
const pool = require('../models/pgconnection');
const {validate} = require('../helpers/validation');
const config = require('config');



const getAll = async (req, res)=>{
    try {
        let rules = {
            limit: 'required',
            offset: 'required',
        }

        await validate(req.body, rules,[]);
        let limit = req.body.limit || 10;
        let offset = req.body.offset || 0;
        let key = req.body.key!=undefined && req.body.key!=''?`and lower(sg.groupname) like lower('%${req.body.key}%') `:"";
        
        let query = `select sg.*
        from public.myob_stockgroups sg 
        where 1=1 ${key}
        order by sg.id limit ${limit} offset ${offset}`;

        let result =  await pool.executeQueryWithMsg(query,[],'No records available.')
        query = `select count(sg.id) as cnt from public.myob_stockgroups sg
        where 1=1 ${key}`;
        
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

// getting data
const getById = async (req, res)=>{
    try {
        let rules = {
            id: 'required'
        }

        await validate(req.params, rules,[]);
        let id = req.params.id;
        
        let query = `select sg.*
        from public.myob_stockgroups sg 
        where sg.id = ${id}`;

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

// update data
const update = async (req, res)=>{
    try {
        let rules = {
            id: 'required',
            popular: 'required'
        }

        await validate(req.body, rules,[]);
        let id = req.body.id;
        let image = req.body.image||"";
        let image2 = req.body.image2||"";
        let popular = req.body.popular;
        let background = req.body.background||"";
        let userid = req.user.id;

        
        let query = `UPDATE public.myob_stockgroups
        SET m__is_popular=${popular}, m__image='${image}', m__image2='${image2}', m__background='${background}', m__userid=${userid}
        WHERE id = ${id}`;

        let result =  await pool.executeQuery(query,[])
        return returnStatus(res, {}, 200, 'successfully updated')

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
    update
}