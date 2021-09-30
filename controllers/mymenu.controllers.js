const { returnStatus,sysErrorLog } = require('../helpers/utils');
const pool = require('../models/pgconnection');
const {validate} = require('../helpers/validation');
const productModel = require('../models/product.model');


const getMenuByUserId = async (req, res)=>{
    try {
        let rules = {
            user_id: 'required'
        }

        await validate(req.params, rules,[]);
        let user_id = req.params.user_id;
        let query = `select menu_id,menu_name from menu_tbl where user_id=${user_id} order by menu_name`;
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

const getMealByMenu = async (req, res)=>{
    try {
        let rules = {
            menu_id: 'required'
        }

        await validate(req.params, rules,[]);
        let menu_id = req.params.menu_id;
        let query = `select meal_id,meal_name from meal_tbl where menu_id=${menu_id} order by meal_name`;
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
            menu_id: 'required'
        }
    
        await validate(req.body, rules, []);

        let limit = req.body.limit || 10;
        let offset = req.body.offset || 0;
        let user_id = req.body.user_id;
        let menu_id = req.body.menu_id;
        let meal_id = req.body.meal_id || 0;
        let meal = ''
        if(meal_id!=0){
            meal = ` and ml.meal_id=${meal_id}`;
        }

        let query = `select m.menu_id,m.menu_name,m.user_id,m.user_accno,m.user_accno,ml.meal_id,ml.meal_name,msi.stockcode,msi.description,msi.sellprice1,mpt.unitqyt,mpt.cartonqty 
        from meal_prod_tbl mpt 
        inner join myob_stockitems msi on msi.id = mpt.product_id
        inner join meal_tbl ml on ml.meal_id = mpt.meal_id
        inner join menu_tbl m on m.menu_id = ml.menu_id
        where m.user_id=${user_id} and m.menu_id=${menu_id} ${meal}
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
    getMenuByUserId,
    getMealByMenu,
    getAll
}