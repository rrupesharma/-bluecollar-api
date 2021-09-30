const { returnStatus,sysErrorLog } = require('../helpers/utils');
const pool = require('../models/pgconnection');
const {validate} = require('../helpers/validation');
const config = require('config');



const getAll = async (req, res)=>{
    try {
        let query = `select *
        from public.contain_tbl where contain_type = 'contain' order by contain_order`;
        
        let result = await pool.executeQueryWithMsg(query,[],'No records available.')
        let data = {
            totalCount : parseInt(result.length),
            result : result
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
        
        let query = `select *
        from public.contain_tbl 
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

// create data
const create = async (req, res)=>{
    try {
        let rules = {
            contain_name: 'required',
            contain_order: 'required',
            contain_image: 'required'
        }

        await validate(req.body, rules,[]);
        let contain_name = req.body.contain_name;
        let contain_order = req.body.contain_order;
        let contain_body = req.body.contain_body;
        let contain_image = req.body.contain_image;
        let contain_type = 'contain';
        let userid = req.user.id;

        
        let query = `INSERT INTO public.contain_tbl (contain_name,contain_order,contain_body,contain_image,contain_type,createdby,creation_dt) 
        VALUES ('${contain_name}','${contain_order}','${contain_body}','${contain_image}','${contain_type}',${userid},now())`;

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

// update data
const update = async (req, res)=>{
    try {
        let rules = {
            id: 'required',
            contain_name: 'required',
            contain_order: 'required',
            contain_image: 'required'
        }

        await validate(req.body, rules,[]);
        let id = req.body.id;
        let contain_name = req.body.contain_name;
        let contain_order = req.body.contain_order;
        let contain_body = req.body.contain_body;
        let contain_image = req.body.contain_image;
        let userid = req.user.id;

        
        let query = `UPDATE public.contain_tbl
        SET contain_name='${contain_name}',contain_order='${contain_order}',contain_body='${contain_body}',contain_image='${contain_image}', updatedby=${userid}
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

const del = async (req, res)=>{
    try {
        let rules = {
            id: 'required'
        }

        await validate(req.params, rules,[]);
        let id = req.params.id;
        
        let query = `DELETE
        from public.contain_tbl 
        where id = ${id}`;

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



module.exports = {
    getAll,
    getById,
    create,
    update,
    del
}