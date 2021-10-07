const config = require('config');
const axios = require('axios');
const { returnStatus,sysErrorLog,filterSingleQoute, pgFormat } = require('../helpers/utils');
const pool = require('../models/pgconnection');
const {validate} = require('../helpers/validation');
const wishlistModel = require('../models/wishlist.model');

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
        let query = `select * from public.wishlist_tbl order by creation_dt desc limit ${limit} offset ${offset}`;
        let result =  await pool.executeQueryWithMsg(query,[],'No records available.')
        query = `select count(wish_id) as cnt from public.wishlist_tbl `;
        let resultCount =  await pool.executeQuery(query,[])
        let data = {
            totalCount : parseInt(resultCount.rows[0]['cnt']),
            result : result
        }
        return returnStatus(res, data, 200, 'success')

    } catch (error) {
        if (error.stack){
            console.log("error", new Date(), ":", error)
        }
        return returnStatus(res, error.erorrLog || {}, error.status || 500, error.message)
    }
}

const getById = async (req, res)=>{
    try {
        let rules = {
           wish_id: 'required'
        }
       // await validate(req.params, rules,[]);
        let id = req.params.wish_id;
        let query = `select *
        from public.wishlist_tbl wish
        where wish.wish_id = ${wish_id}`;
        //console.log("getById====",id,query)
        let result =  await pool.executeQueryWithMsg(query,[],'No records available.')
        let data = result[0];
        return returnStatus(res, data, 200, 'success')

    } catch (error) {
        if (error.stack){
            console.log("error", new Date(), ":", error);
           // sysErrorLog(error,__filename.slice(__dirname.length + 1))
        }
        return returnStatus(res, error.erorrLog || {}, error.status || 500, error.message)
    }
}

const create = async (req, res)=>{
    try {
        let data = req.body;
      //  req.body = filterSingleQoute(req.body);
        await wishlistModel.validateAddWishlist(req.body);
     //   let token = await jwtToken.generate({ "email": data.email, action: 'verification' ,role: role}, 48)
      //  let createUser = await productModel.insertStockItemsBySupplier(req)
        let query = `INSERT INTO public.wishlist_tbl(
           user_id, creation_dt)
            VALUES ('${data.user_id}', now()) returning wish_id;`;
        let result = await pool.executeQuery(query,[]);
        return returnStatus(res, {}, 200, 'success')
    } catch (error) {
        if (error.stack){
            console.log("error", new Date(), ":", error)
         //   sysErrorLog(error,__filename.slice(__dirname.length + 1))
        }
        return returnStatus(res, error.erorrLog || {}, error.status || 500, error.message)
    }
}

const updateById = async (req, res)=>{
    try {
        let rules = {
            wish_id: 'required',
            user_id: 'required'
        }

        await validate(req.body, rules,[]);
        let data = req.body;
        let query = `UPDATE public.wishlist_tbl
        SET user_id='${data.user_id}'
        WHERE wish_id = ${data.wish_id}`

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

const deleteById = async (req, res)=>{
    try {
        let rules = {
            id: 'required'
        }

        await validate(req.params, rules,[]);
        let id = req.params.wish_id
        let query = `update public.wishlist_tbl set is_delete = true where wish_id = ${id}`;
        let countResult = await pool.executeQuery(query, []);
        return returnStatus(res, {}, 200, 'success')

    } catch (error) {
        if (error.stack){
            console.log("error", new Date(), ":", error)
          //  sysErrorLog(error,__filename.slice(__dirname.length + 1))
        }
        return returnStatus(res, error.erorrLog || {}, error.status || 500, error.message)
    }
}


module.exports = {
    getAll,
    getById,
    create,
    updateById,
    deleteById
}