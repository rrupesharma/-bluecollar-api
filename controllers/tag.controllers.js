const { returnStatus,sysErrorLog } = require('../helpers/utils');
const pool = require('../models/pgconnection');
const {validate} = require('../helpers/validation');


const getAll = async (req, res)=>{
    try {
        let rules = {
            limit: 'required',
            offset: 'required'
        }
        await validate(req.body, rules, []);
        let limit = req.body.limit || 10;
        let offset = req.body.offset || 0;
        let key = req.body.key!=undefined && req.body.key!=''?`and lower(pt.tag_name) like lower('%${req.body.key}%') `:"";

        let query = `select pt.*
        from product_tag pt
        where 1=1 ${key}
        order by pt.ordering asc limit ${limit} offset ${offset}`;
        let result =  await pool.executeQueryWithMsg(query,[],'No records available.')
        let countQuery = `select count(tag_id) as cnt from product_tag`;

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
        let tag_id = req.params.tag_id;

        let query = `select pt.* from product_tag pt
        where tag_id=${tag_id}`;

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
            tag_name: 'required',
            ordering: 'required|integer'
        }
    
        await validate(req.body, rules, []);

        let tag_name = req.body.tag_name;
        let ordering = req.body.ordering;
        let image = req.body.image||"";
        let image2 = req.body.image2||"";
        let background = req.body.background||"";
        let query = `INSERT INTO public.product_tag(
            tag_name,ordering, createdby, creation_dt,image,image2,background)
            VALUES ('${tag_name}',${ordering}, ${req.user.id}, now(),'${image}','${image2}','${background}');`;

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

const update = async (req, res)=>{
    try {
        let rules = {
            tag_id: 'required',
            tag_name: 'required',
            ordering: 'required|integer'
        }
    
        await validate(req.body, rules, []);

        let tag_id = req.body.tag_id;
        let tag_name = req.body.tag_name;
        let ordering = req.body.ordering;
        let image = req.body.image||"";
        let image2 = req.body.image2||"";
        let background = req.body.background||"";

        let query = `UPDATE public.product_tag
        SET tag_name='${tag_name}', ordering=${ordering}, createdby=${req.user.id},image='${image}',image2='${image2}',background='${background}'
        WHERE tag_id=${tag_id};`;

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

const updateStatus = async (req, res)=>{
    try {
        let rules = {
            tag_id: 'required',
            status: 'required|boolean'
        }
    
        await validate(req.body, rules, []);

        let tag_id = req.body.tag_id;
        let status = req.body.status;

        let query = `UPDATE public.product_tag
        SET is_active=${status}
        WHERE tag_id=${tag_id};`;

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
        let tag_id = req.params.tag_id;
        let query = `delete from public.product_tag_map where tag_id = ${tag_id}`;
        await pool.executeQuery(query,[])
        query = `delete from product_tag where tag_id=${tag_id}`;
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

const addProduct = async (req, res)=>{
    try {
        let rules = {
            stockcode: 'required',
            tag_id: 'required'
        }
    
        await validate(req.body, rules, []);

        let tag_id = req.body.tag_id;
        let stockcodeArr = req.body.stockcode;
        let admin_id = req.user.id;
        
        //delete product_tag_map data
        //let query = `delete from public.product_tag_map where tag_id = ${tag_id}`;
        //let result =  await pool.executeQuery(query,[])
        let query = `INSERT INTO public.product_tag_map(
            tag_id, stockcode, createdby,creation_dt)
            VALUES `;
        for (let key in stockcodeArr) {
            query += `(${tag_id}, '${stockcodeArr[key]}', ${admin_id},now())`;
            query += stockcodeArr.length -1 == key ? '':',';
        }
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

const delProduct = async (req, res)=>{
    try {
        let rules = {
            tag_map_id: 'required'
        }
    
        await validate(req.params, rules, []);

        let tag_map_id = req.params.tag_map_id;
        let query = `delete from public.product_tag_map where tag_map_id = ${tag_map_id}`;

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

const getTagProduct = async (req, res)=>{
    try {
        let rules = {
            tag_id: 'required',
            limit: 'required',
            offset: 'required'
        }
    
        await validate(req.body, rules, []);
        console.log(req.body)
        let tag_id = req.body.tag_id;
        let limit = req.body.limit || 10;
        let offset = req.body.offset || 0;

        let query = `select pt.tag_map_id,t.tag_id,t.tag_name,si.stockcode,si.description, pt.createdby,pt.creation_dt from product_tag_map pt
        inner join public.myob_stockitems si on si.stockcode = pt.stockcode
        inner join public.product_tag t on t.tag_id = pt.tag_id
        where pt.tag_id=${tag_id} order by pt.creation_dt desc limit ${limit} offset ${offset}`;

        let result =  await pool.executeQueryWithMsg(query,[],'No records available.')

        let countQuery = `select count(tag_map_id) as cnt
        from product_tag_map pt
        inner join public.myob_stockitems si on si.stockcode = pt.stockcode
        inner join public.product_tag t on t.tag_id = pt.tag_id
        where pt.tag_id=${tag_id}`;

        let countResult =  await pool.executeQuery(countQuery,[])
        return returnStatus(res, {
            total_count:parseInt(countResult.rows[0].cnt),
            result:result
        }, 200, 'success')

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
    addProduct,
    delProduct,
    getTagProduct
}