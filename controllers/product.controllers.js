const config = require('config');
const axios = require('axios');
const { returnStatus,sysErrorLog,filterSingleQoute, pgFormat } = require('../helpers/utils');
const pool = require('../models/pgconnection');
const {validate} = require('../helpers/validation');
const productModel = require('../models/product.model');

const getProductByTag = async (req, res)=>{
    try {
        let tag_id = req.params.tag_id
        let query = `select si.stockcode,si.description
        from public.myob_stockitems si
        where si.stockcode not in (select stockcode from product_tag_map where tag_id = ${tag_id})
        order by si.last_updated desc`;

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

const getAll = async (req, res)=>{
    try {
        let rules = {
            limit: 'required',
            offset: 'required',
        }

        await validate(req.body, rules,[]);
        let limit = req.body.limit || 10;
        let offset = req.body.offset || 0;
        let supplier = req.user.extid!=undefined && req.user.extid!='' ? `and si.supplierno = ${req.user.extid}`:"";
        supplier = req.body.filter!=undefined && req.body.filter.supplierno!=undefined && req.body.filter.supplierno!=0 ?`and si.supplierno = ${req.body.filter.supplierno}`:supplier;
        let suppstatus = req.body.filter!=undefined && req.body.filter.suppstatus!=undefined && req.body.filter.suppstatus!=null?`and si.m__suppstatus=${req.body.filter.suppstatus}`:"";
        let key = req.body.filter!=undefined && req.body.filter.key!=undefined && req.body.filter.key!=''?`and (lower(si.stockcode) like lower('%${req.body.filter.key}%') or lower(si.description) like lower('%${req.body.filter.key}%'))`:"";
        let query = `select si.*,
        c.groupname as cat_name,sc.groupname as scat_name
        from public.myob_stockitems si 
        left join public.myob_stockgroups c on c.groupno = si.stockgroup
        left join public.myob_stock_group2 sc on sc.groupno = si.stockgroup2
        where 1=1 ${suppstatus} ${supplier} ${key}
        order by si.id desc limit ${limit} offset ${offset}`;

        let result =  await pool.executeQueryWithMsg(query,[],'No records available.')
        query = `select count(si.id) as cnt from public.myob_stockitems si 
        left join  public.products_tbl p on p.product_code = si.stockcode
        where 1=1 ${suppstatus} ${supplier} ${key}`;
        
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

// getting data from stock table by it id
const getById = async (req, res)=>{
    try {
        let rules = {
            id: 'required'
        }

        await validate(req.params, rules,[]);
        let id = req.params.id;
        let query = `select si.*,
        c.groupname as cat_name,sc.groupname as scat_name
        from public.myob_stockitems si 
        left join public.myob_stockgroups c on c.groupno = si.stockgroup
        left join public.myob_stock_group2 sc on sc.groupno = si.stockgroup2
        where si.id = ${id}`;
        //console.log("getById====",id,query)
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



const create = async (req, res)=>{
    try {
        req.body = filterSingleQoute(req.body);
        await productModel.validateAddStockItems(req.body);
        let stockStatus = await productModel.insertStockItems(req)
        //console.log(stockStatus,productStatus)
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
        req.body = filterSingleQoute(req.body);
        await productModel.validateEditStockItems(req.body);
        let stockStatus = await productModel.updateStockItems(req)
        return returnStatus(res, {}, 200, 'success')
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
            product_code: 'required'
        }

        await validate(req.params, rules,[]);
        let id = req.params.product_code
        let query = `update from public.myob_stockitems set is_delete = true where product_code = ${product_code}`;
        let countResult = await pool.executeQuery(query, []);
        return returnStatus(res, {}, 200, 'success')

    } catch (error) {
        if (error.stack){
            console.log("error", new Date(), ":", error)
            sysErrorLog(error,__filename.slice(__dirname.length + 1))
        }
        return returnStatus(res, error.erorrLog || {}, error.status || 500, error.message)
    }
}

const category = async (req, res)=>{
    try {
        const { status_code, status_message, data } = await productModel.getcategoryList(req);
        return returnStatus(res, data, status_code, status_message)
    } catch (error) {
        if(error.stack) console.log("error",new Date(),":",error)
        return returnStatus(res, error.erorrLog||{}, error.status||500, error.message)
    }
}

const subCategory = async (req, res)=>{
    try {
        const { status_code, status_message, data } = await productModel.getsubCategoryList(req);
        return returnStatus(res, data, status_code, status_message)
    } catch (error) {
        if(error.stack) console.log("error",new Date(),":",error)
        return returnStatus(res, error.erorrLog||{}, error.status||500, error.message)
    }
}

const filtersList = async (req, res)=>{
    try {
        const { status_code, status_message, data } = await productModel.getFiltersList(req);
        return returnStatus(res, data, status_code, status_message)
    } catch (error) {
        if(error.stack) console.log("error",new Date(),":",error)
        return returnStatus(res, error.erorrLog||{}, error.status||500, error.message)
    }
}

const updateSupp = async (req, res)=>{
    try {
        let rules = {
            stockcode: 'required',
            suppstatus: 'required'
        }

        await validate(req.body, rules,[]);
        let query = `Update public.myob_stockitems Set m__suppstatus=${req.body.suppstatus}, m__suppcomment='${req.body.suppcomment}' where stockcode = '${req.body.stockcode}'`;
        let result = await pool.executeQuery(query, [])
        //query = `Update public.products_tbl Set updatedby='${req.user.id}' where product_code='${req.body.stockcode}'`
        //let result2 = await pool.executeQuery(query, [])
        return returnStatus(res, {}, 200, 'success')
    } catch (error) {
        if(error.stack) console.log("error",new Date(),":",error)
        return returnStatus(res, error.erorrLog||{}, error.status||500, error.message)
    }
}

const unApproveStock = async (req, res)=>{
    try {
        let query = `SELECT count(id) as cnt FROM public.myob_stockitems where m__suppstatus=true and m__suppcomment is not null `;
        let result = await pool.executeQuery(query, [])
        return returnStatus(res, {count:result.rows[0].cnt}, 200, 'success')
    } catch (error) {
        if(error.stack) console.log("error",new Date(),":",error)
        return returnStatus(res, error.erorrLog||{}, error.status||500, error.message)
    }
}

async function upsertStockItems(stockcodeArr){
    let tbl_name = "public.myob_stockitems";
    let tbl_query = "";
    let postarr = [];
    let putarr = [];
    let axiosConfig = "";
    let postStatus = "";
    let putStatus = "";
    try {
        tbl_query = `SELECT * FROM ${tbl_name} WHERE stockcode IN (${pgFormat(stockcodeArr)})`;
        let result = await pool.executeQuery(tbl_query);
        let total_len = result.rows.length;
        if(total_len > 0) {
            for (let [count, item] of result.rows.entries()) {
                let is_sync = item["is_sync"];
                let obj = {
                    "STOCKCODE": item["stockcode"] || "",
                    "DESCRIPTION": item["description"] || "",
                    "STOCKGROUP": item["stockgroup"] || "",
                    "STATUS": item["status"] || "",
                    "SELLPRICE1": item["sellprice1"] || "",
                    "MINSTOCK": item["minstock"] || "",
                    "MAXSTOCK": item["maxstock"] || "",
                    "SUPPLIERNO": item["supplierno"] || "",
                    "MONTHUNITS": item["monthunits"] || "",
                    "YEARUNITS": item["yearunits"] || "",
                    "BINCODE": item["bincode"] || "",
                    "DISCOUNTLEVEL": item["discountlevel"] || "",
                    "DEFDAYS": item["defdays"] || "",
                    "BARCODE1": item["barcode1"] || "",
                    "BARCODE2": item["barcode2"] || "",
                    "SALES_GL_CODE": item["sales_gl_code"] || "",
                    "PURCH_GL_CODE": item["purch_gl_code"] || "",
                    "WEB_SHOW": item["web_show"] || "",
                    "ISACTIVE": item["isactive"] || "",
                    "WEIGHT": item["weight"] || "",
                    "CUBIC": item["cubic"] || "",
                    "ALERT": item["alert"] || "",
                    "NOTES": item["notes"] || "",
                    "PQTY": item["pqty"] || "",
                    "PACK": item["pack"] || "",
                    "HAS_SN": item["has_sn"] || "",
                    "STDCOST": item["stdcost"] || "",
                    "SALES_GLSUBCODE": item["sales_glsubcode"] || "",
                    "PURCH_GLSUBCODE": item["purch_glsubcode"] || "",
                    "BRANCHNO": item["branchno"] || "",
                    "COS_GL_CODE": item["cos_gl_code"] || "",
                    "COS_GLSUBCODE": item["cos_glsubcode"] || "",
                    "STOCKPRICEGROUP": item["stockpricegroup"] || "",
                    "SUPPLIERCOST": item["suppliercost"] || "",
                    "ECONORDERQTY": item["econorderqty"] || "",
                    "STOCK_CLASSIFICATION": item["stock_classification"] || "",
                    "STOCKGROUP2": item["stockgroup2"] || "",
                    "TOTALSTOCK": item["totalstock"] || "",
                    "HAS_BN": item["has_bn"] || "",
                    "HAS_EXPIRY": item["has_expiry"] || "",
                    "EXPIRY_DAYS": item["expiry_days"] || "",
                    "DUTY": item["duty"] || "",
                    "SERIALNO_TYPE": item["serialno_type"] || "",
                    "LABEL_QTY": item["label_qty"] || "",
                    "IS_DISCOUNTABLE": item["is_discountable"] || "",
                    "RESTRICTED_ITEM": item["restricted_item"] || "",
                    "NUMDECIMALS": item["numdecimals"] || "",
                    "COGSMETHOD": item["cogsmethod"] || "",
                    "DEFAULTWARRANTYNO": item["defaultwarrantyno"] || "",
                    "DIMENSIONS": item["dimensions"] || "",
                    "AUTO_NARRATIVE": item["auto_narrative"] || "",
                    "X_SIZEID": item["x_sizeid"] || "",
                    "X_COLOURID": item["x_colourid"] || "",
                    "VARIABLECOST": item["variablecost"] || "",
                    "LOOKUP_RECOVERABLE": item["lookup_recoverable"] || "",
                    "X_WholeUnitsOnly": item["x_wholeunitsonly"] || "",
                    "X_DONOTSHOWONWEB": item["x_donotshowonweb"] || "",
                    "X_BRAND": item["x_brand"] || "",
                    "X_SGROUP3": item["x_sgroup3"] || "",
                    "X_STORAGE": item["x_storage"] || "",
                    "X_CARTON": item["x_carton"] || "",
                    "X_UNIT": item["x_unit"] || "",
                    "X_SIZE": item["x_size"] || "",
                    "X_UNITS_PER_CARTON": item["x_units_per_carton"] || "",
                    "X_UNITS_PER_SERVE": item["x_units_per_serve"] || "",
                    "X_SERVES_PER_UNIT": item["x_serves_per_unit"] || "",
                    "X_QUANTITY": item["x_quantity"] || "",
                    "X_SERVES_PER_CARTON": item["x_serves_per_carton"] || "",
                    "X_CARTON_WEIGHT": item["x_carton_weight"] || "",
                    "X_SERVING_SIZE": item["x_serving_size"] || "",
                    "X_COST_PER_SERVE": item["x_cost_per_serve"] || "",
                    "X_SUGGESTED_SERVING_SIZE": item["x_suggested_serving_size"] || "",
                    "X_Seafood": item["x_seafood"] || "",
                    "X_Dietary": item["x_dietary"] || "",
                    "X_Certification": item["x_certification"] || "",
                    "X_UNIT_OF_MEASURE": item["x_unit_of_measure"] || "",
                    "x_wet": item["x_wet"] || "",
                    "X_SCAN_WARN": item["x_scan_warn"] || "",
                    "x_hidefromallstockreports": item["x_hidefromallstockreports"] || "",
                    "X_IMAGE1": item["x_image1"] || "",
                    "X_IMAGE2": item["x_image2"] || "",
                    "X_IMAGE3": item["x_image3"] || "",
                    "X_IMAGE4": item["x_image4"] || ""
                };
                for (let prop in obj) {
                    if (!obj[prop]) {
                        delete obj[prop];
                    }
                }
                if(is_sync){
                    putarr.push(obj);
                }else{
                    postarr.push(obj);
                }
            }
            if(postarr.length > 0){
                axiosConfig = {
                    method: 'POST',
                    url: `${config.get('external').url}/StockItems`,
                    data: postarr,
                    headers: {
                        'ApiAddress': config.get('external').api_address,
                        'Cache-Control': config.get('external').cache_control,
                        'Authorization': config.get('external').auth
                    }
                };
                let response = await axios(axiosConfig);
                if(response) {
                    postStatus = response.data.payload.Payload.Status;
                }
            }
            if(putarr.length > 0){
                axiosConfig = {
                    method: 'PUT',
                    url: `${config.get('external').url}/StockItems`,
                    data: putarr,
                    headers: {
                        'ApiAddress': config.get('external').api_address,
                        'Cache-Control': config.get('external').cache_control,
                        'Authorization': config.get('external').auth
                    }
                };
                let response = await axios(axiosConfig);
                if(response) {
                    putStatus = response.data.payload.Payload.Status;
                }
            }
            return {postStatus, putStatus};
        }
    } catch (error) {
        console.log("tbl_query: ", tbl_query);
        sysErrorLog(error,__filename.slice(__dirname.length + 1),true);
        console.log("ERROR==========", error);
    }
}

const createBySupplier = async (req, res)=>{
    try {
        req.body = filterSingleQoute(req.body);
        await productModel.validateAddProduct(req.body);
        let stockStatus = await productModel.insertStockItemsBySupplier(req)
        return returnStatus(res, {}, 200, 'success')
    } catch (error) {
        if (error.stack){
            console.log("error", new Date(), ":", error)
            sysErrorLog(error,__filename.slice(__dirname.length + 1))
        }
        return returnStatus(res, error.erorrLog || {}, error.status || 500, error.message)
    }
}

const updateBySupplier = async (req, res)=>{
    try {
        req.body = filterSingleQoute(req.body);
        await productModel.validateEditProduct(req.body);
        let stockStatus = await productModel.updateStockItemsBySupplier(req)
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
    create,
    getById,
    getAll,
    update,
    del,
    category,
    subCategory,
    filtersList,
    updateSupp,
    unApproveStock,
    upsertStockItems,
    getProductByTag,
    createBySupplier,
    updateBySupplier
}