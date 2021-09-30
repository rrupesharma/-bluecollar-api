const { returnStatus,sysErrorLog } = require('../helpers/utils');
const pool = require('../models/pgconnection');
const {validate} = require('../helpers/validation');
const config = require('config');



const create = async (req, res)=>{
    try {
        let rules = {
            ext_id: 'required',
            img_type: 'required'
        }
    
        await validate(req.body, rules, []);
        let ext_id = req.body.ext_id;
        /* let img_name = config.imageDomain+req.body.img_name;
        let img_name2 = config.imageDomain+req.body.img_name2; */
        let img_name = req.body.img_name||"";
        let img_name2 = req.body.img_name2||"";
        let img_type = req.body.img_type;

        let query = `select * from public.images_tbl where ext_id=${ext_id} and img_type='${img_type}'`;
        let checkResult =  await pool.executeQuery(query,[])
        if(checkResult.rows.length == 0){
            query = `INSERT INTO public.images_tbl(
                ext_id, img_name, img_name2, img_type, createdby, creation_dt)
                VALUES (${ext_id},'${img_name}','${img_name2}','${img_type}', ${req.user.id}, now());`;
    
            await pool.executeQuery(query,[])
        }else{
            query = `UPDATE public.images_tbl
            SET img_name='${img_name}', img_name2='${img_name2}', updatedby=${req.user.id}
            WHERE ext_id=${ext_id} and img_type='${img_type}';`;
    
            await pool.executeQuery(query,[])
        }
        
        
        
        return returnStatus(res, {}, 200, 'success')

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
            ext_id: 'required',
            img_type: 'required'
        }
    
        await validate(req.body, rules, []);
        let ext_id = req.body.ext_id;
        let img_type = req.body.img_type;

        let query = `select * from public.images_tbl where ext_id=${ext_id} and img_type='${img_type}'`;

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

const del = async (req, res)=>{
    try {
        let img_id = req.params.img_id;

        query = `delete from images_tbl where img_id=${img_id}`;
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
    getById,
    create,
    del
}