const { returnStatus,sysErrorLog } = require('../helpers/utils');
const pool = require('../models/pgconnection');
const {validate} = require('../helpers/validation');
const productModel = require('../models/product.model');


const getPantryByUserId = async (req, res)=>{
    try {
        let rules = {
            user_id: 'required'
        }

        await validate(req.params, rules,[]);
        let user_id = req.params.user_id;
        let query = `select pantry_id,pantry_name from pantry_tbl where user_id=${user_id} order by pantry_name`;
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
            user_id: 'required',
            pantry_id: 'required'
        }
    
        await validate(req.body, rules, []);

        let limit = req.body.limit || 10;
        let offset = req.body.offset || 0;
        let user_id = req.body.user_id;
        let pantry_id = req.body.pantry_id || 0;
        let pantry = ''
        if(pantry_id!=0){
            pantry = ` and p.pantry_id=${pantry_id}`;
        }

        let query = `select p.pantry_id,p.pantry_name,p.user_id,p.user_accno,msi.stockcode,msi.description,msi.sellprice1,ppt.unitqyt,ppt.cartonqty 
        from pantry_prod_tbl ppt 
        inner join myob_stockitems msi on msi.id = ppt.product_id
        inner join pantry_tbl p on p.pantry_id = ppt.pantry_id
        where p.user_id=${user_id} ${pantry}
        limit ${limit} offset ${offset}`;

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



module.exports = {
    getPantryByUserId,
    getAll
}