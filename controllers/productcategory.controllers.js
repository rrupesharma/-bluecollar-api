const { returnStatus,sysErrorLog } = require('../helpers/utils');
const pool = require('../models/pgconnection');
const jwtToken = require('../helpers/jwtToken');
const iplocation = require('../helpers/iplocation');
const {validate} = require('../helpers/validation');
const mail = require('../helpers/mail');
const md5 = require('md5');
const productcategoryModel = require('../models/productcategory.model');
const {getEmailTemplate} = require('../models/utils.model');
const config = require('config');


const create = async (req, res) => {
    try {
        let data = req.body;
        //  req.body = filterSingleQoute(req.body);
        await productcategoryModel.validateAddCategory(req.body);
        let query = `INSERT INTO public.category_tbl(
             cat_pid, domain, cat_name, cat_desc, cat_image1, cat_image2, orderno, creation_dt)
            VALUES ('${data.cat_pid}','${data.domain}', '${data.cat_name}',  '${data.cat_desc}', '${data.cat_image1}', '${data.cat_image2}',  '${data.orderno}', now()) returning cat_id;`;
        let result = await pool.executeQuery(query, []);
        return returnStatus(res, {}, 200, 'success')
    } catch (error) {
        if (error.stack) {
            console.log("error", new Date(), ":", error)
            //   sysErrorLog(error,__filename.slice(__dirname.length + 1))
        }
        return returnStatus(res, error.erorrLog || {}, error.status || 500, error.message)
    }
}

const updateById = async (req, res)=>{
    try {
        let data = req.body;
        await productcategoryModel.validateEditCategory(req.body);
        let query = `UPDATE public.category_tbl
        SET  cat_pid='${data.cat_pid}', domain='${data.domain}', cat_name='${data.cat_name}', cat_desc='${data.cat_desc}', cat_image1='${data.cat_image1}', cat_image2='${data.cat_image2}', orderno='${data.orderno}'
        WHERE cat_id = ${data.cat_id}`

        let result = await pool.executeQuery(query, [])
        return returnStatus(res, {}, 200, 'success')
    } catch (error) {
        if (error.stack){
            console.log("error", new Date(), ":", error)
          //  sysErrorLog(error,__filename.slice(__dirname.length + 1))
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
        let limit = req.body.limit;
        let offset = req.body.offset;
       // let key = req.body.key!=undefined && req.body.key!=''?`and (lower(user_id) like lower('%${req.body.key}%')) `:"";
        let query = `SELECT * FROM category_tbl catcc
        INNER JOIN category_tbl CATYP
        ON catcc.cat_pid = CATYP.cat_id order by catcc.cat_id desc limit ${limit} offset ${offset}`;
        let result =  await pool.executeQueryWithMsg(query,[],'No records available.')
        query = `select count(catyparent.cat_id) as cnt FROM category_tbl catcc
        INNER JOIN category_tbl catyparent
        ON catcc.cat_pid = catyparent.cat_id `;
        let resultCount =  await pool.executeQuery(query,[])
        let data = {
            totalCount : parseInt(resultCount.rows[0]['cnt']),
            result : result
        }
        console.log(data);
        return returnStatus(res, data, 200, 'success')

    } catch (error) {
        if (error.stack){
            console.log("error", new Date(), ":", error)
        }
        return returnStatus(res, error.erorrLog || {}, error.status || 500, error.message)
    }
}


module.exports = {
    create,
    updateById,
    getAll
  
}