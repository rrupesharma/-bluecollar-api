const { returnStatus, sysErrorLog } = require('../helpers/utils');
const pool = require('../models/pgconnection');
const jwtToken = require('../helpers/jwtToken');
const iplocation = require('../helpers/iplocation');
const { validate } = require('../helpers/validation');
const mail = require('../helpers/mail');
const md5 = require('md5');
const { getEmailTemplate } = require('../models/utils.model');
const config = require('config');
const productsModel = require('../models/products.model');



const create = async (req, res) => {
    try {
        let data = req.body;
        //  req.body = filterSingleQoute(req.body);
        await productsModel.validateAddProduct(req.body);
        let query = `INSERT INTO public.product_tbl(
             cat_id, domain, prod_name, prod_desc, prod_feature, prod_tech_spec, prod_image1, prod_image2, prod_image3, prod_image4, prod_price, prod_tax, country_origin, creation_dt)
            VALUES ('${data.cat_id}','${data.domain}','${data.prod_name}', '${data.prod_desc}',  '${data.prod_feature}', '${data.prod_tech_spec}', '${data.prod_image1}','${data.prod_image2}', '${data.prod_image3}','${data.prod_image4}','${data.prod_tax}','${data.country_origin}',now()) returning prod_id;`;
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

const getAll = async (req, res) => {
    try {
        let rules = {
            limit: 'required',
            offset: 'required',
        }

        await validate(req.body, rules, []);
        let limit = req.body.limit;
        let offset = req.body.offset;
        let key = req.body.key != undefined && req.body.key != '' ? `and (lower(prod_name) like lower('%${req.body.key}%') or lower(prod_feature) like lower('%${req.body.key}%') or lower(prod_tech_spec) like lower('%${req.body.key}%')) ` : "";
        let query = `select * from public.product_tbl where is_delete = false ${key} order by creation_dt desc limit ${limit} offset ${offset}`;
        let result = await pool.executeQueryWithMsg(query, [], 'No records available.')
        query = `select count(prod_id) as cnt from public.product_tbl where is_delete = false ${key}`;
        let resultCount = await pool.executeQuery(query, [])
        let data = {
            totalCount: parseInt(resultCount.rows[0]['cnt']),
            result: result
        }
        return returnStatus(res, data, 200, 'success')

    } catch (error) {
        if (error.stack) {
            console.log("error", new Date(), ":", error)
        }
        return returnStatus(res, error.erorrLog || {}, error.status || 500, error.message)
    }
}

const getById = async (req, res) => {
    try {
        let id = req.user.user_id;
        let query = `select *
        from public.product_tbl product
        where product.prod_id = ${id}`;
        //console.log("getById====",id,query)
        let result = await pool.executeQueryWithMsg(query, [], 'No records available.')
        let data = result[0];
        return returnStatus(res, data, 200, 'success')

    } catch (error) {
        if (error.stack) {
            console.log("error", new Date(), ":", error);
            // sysErrorLog(error,__filename.slice(__dirname.length + 1))
        }
        return returnStatus(res, error.erorrLog || {}, error.status || 500, error.message)
    }
}



module.exports = {
    create,
    getAll,
    getById
}