const config = require('config');
const pool = require('./pgconnection');
const { validate } = require('../helpers/validation');

/**
 * Validate user login
 * @param {*} info 
 * @returns 
 */
async function validateAddProduct(info) {
  return new Promise(async function (resolve, reject) {
    try {
      let rules = {
        stockcode: 'required|checkProductCode',
        product_name: 'required',
        x_carton_description: 'required',
        x_production_dating_exp: 'required',
        x_production_dating_prod: 'required',
        pqty: 'required',
        supplierno: 'required',
        product_desc: 'required',
        stockgroup: 'required',
        stockgroup2: 'required'
      }

      const message = {}
      await validate(info, rules, []);
      resolve(true);
    } catch (error) {
      reject(error)
    }
  })
}

async function validateEditProduct(info) {
  return new Promise(async function (resolve, reject) {
    try {
      let rules = {
        stockcode: 'required',
        product_name: 'required',
        x_carton_description: 'required',
        x_production_dating_exp: 'required',
        x_production_dating_prod: 'required',
        pqty: 'required',
        supplierno: 'required',
        product_desc: 'required',
        stockgroup: 'required',
        stockgroup2: 'required'
      }

      const message = {}
      await validate(info, rules, []);
      resolve(true);
    } catch (error) {
      reject(error)
    }
  })
}

async function validateAddStockItems(info) {
  return new Promise(async function (resolve, reject) {
    try {
      let rules = {
        stockcode: 'required|checkProductCode',
        product_name: 'required',
        pqty: 'required',
        supplierno: 'required',
        product_desc: 'required',
        stockgroup: 'required',
        stockgroup2: 'required',
        totalstock: 'required',
        sellprice1: 'required'
      }

      const message = {}
      await validate(info, rules, []);
      resolve(true);
    } catch (error) {
      reject(error)
    }
  })
}

async function validateEditStockItems(info) {
  return new Promise(async function (resolve, reject) {
    try {
      let rules = {
        stockcode: 'required',
        product_name: 'required',
        pqty: 'required',
        supplierno: 'required',
        product_desc: 'required',
        stockgroup: 'required',
        stockgroup2: 'required',
        totalstock: 'required',
        sellprice1: 'required'
      }

      const message = {}
      await validate(info, rules, []);
      resolve(true);
    } catch (error) {
      reject(error)
    }
  })
}

async function insertStockItems(req) {
  return new Promise(async function (resolve, reject) {
    try {
      let x_seafood = req.body.x_seafood || "";
      let x_certification = req.body.x_certification || "";

      let x_image1 = req.body.product_image1 || ""
      let x_image2 = req.body.product_image2 || ""
      let x_image3 = req.body.product_image3 || ""
      let x_image4 = req.body.product_image4 || ""
      let x_factory_gate_cost_ex_gst = req.body.x_factory_gate_cost_ex_gst;

      let stock_classification = req.body.stock_classification || 0;
      let totalstock = req.body.totalstock || 10;
      let has_expiry = req.body.has_expiry || "N";
      let duty = req.body.duty || 0;
      let serialno_type = req.body.serialno_type || 0;
      let label_qty = req.body.label_qty || 1;
      let is_discountable = req.body.is_discountable || "Y";
      let restricted_item = req.body.restricted_item || "N";
      let cogsmethod = req.body.cogsmethod || 0;
      let dimensions = req.body.dimensions || 0;
      let variablecost = req.body.variablecost || "N";
      let x_hidefromallstockreports = req.body.x_hidefromallstockreports || "N";
      let x_wet = req.body.x_wet || "N";
      let numdecimals = req.body.numdecimals || -1
      let defaultwarrantyno = req.body.defaultwarrantyno || -2
      let x_wholeunitsonly = req.body.x_wholeunitsonly || "N";
      let sales_gl_code = req.body.sales_gl_code || 41000;
      let purch_gl_code = req.body.purch_gl_code || 51000;
      let sellprice1 = req.body.sellprice1 || parseInt(x_factory_gate_cost_ex_gst) + ((parseInt(x_factory_gate_cost_ex_gst)*25)/100);
      let supplierno = req.body.supplierno;

      let stockgroup = req.body.stockgroup || 0
      let stockgroup2 = req.body.stockgroup2 || 0
      let stockcode = req.body.stockcode;
      let description = req.body.product_name;
      let pqty = req.body.pqty;
      let x_brand = req.body.x_brand;
      let x_storage = req.body.x_storage;
      let x_dietary = req.body.x_dietary;
      let x_units_per_carton = req.body.x_units_per_carton;
      let x_serves_per_carton = req.body.x_serves_per_carton;

      let carton_weight = req.body.x_ctn_weight;//x_ctn_weight
      let serves_per_pack = req.body.serves_per_pack;//x_serves_per_unit 
      let product_desc = req.body.product_desc;//notes 
      let landed_gate_cost_gst= req.body.suppliercost;//suppliercost 

      /* 
      new data set
      */
      let x_storage_dry = req.body.x_storage_dry;
      let x_storage_chilled = req.body.x_storage_chilled;
      let x_storage_frozen = req.body.x_storage_frozen;
      let x_storage_temp6_12 = req.body.x_storage_temp6_12;
      let x_carton_description = req.body.x_carton_description;
      let x_pack_description = req.body.x_pack_description;
      let x_serve_description = req.body.x_serve_description;
      let x_shelf_life = req.body.x_shelf_life;
      let x_min_receival_shelf_life = req.body.x_min_receival_shelf_life;
      let x_production_dating_exp = req.body.x_production_dating_exp;
      let x_production_dating_prod = req.body.x_production_dating_prod;
      let x_dangerous_goods_code = req.body.x_dangerous_goods_code;
      let x_outer_height = req.body.x_outer_height;
      let x_width = req.body.x_width;
      let x_length = req.body.x_length;
      let x_ctn_per_layer = req.body.x_ctn_per_layer;
      let x_ctn_per_pallet = req.body.x_ctn_per_pallet;
      let x_total_ctn_per_pallet = req.body.x_total_ctn_per_pallet;
      let x_alternative_product_name = req.body.x_alternative_product_name;
      let x_country_of_origin = req.body.x_country_of_origin;
      let x_aust_ingredients_percent = req.body.x_aust_ingredients_percent;
      let x_certifications_organic = req.body.x_certifications_organic;
      let x_certifications_kosher = req.body.x_certifications_kosher;
      let x_certifications_halal = req.body.x_certifications_halal;
      let x_certifications_other = req.body.x_certifications_other;
      let x_dietary_gluten_free = req.body.x_dietary_gluten_free;
      let x_dietary_vegan = req.body.x_dietary_vegan;
      let x_dietary_vegetarian = req.body.x_dietary_vegetarian;
      let x_dietary_cholesterol_free = req.body.x_dietary_cholesterol_free;
      let x_dietary_lactose_free = req.body.x_dietary_lactose_free;
      let x_dietary_egg_free = req.body.x_dietary_egg_free;
      let x_dietary_other = req.body.x_dietary_other;
      let x_allergens_wheat = req.body.x_allergens_wheat;
      let x_allergens_peanuts = req.body.x_allergens_peanuts;
      let x_allergens_tree_nuts = req.body.x_allergens_tree_nuts;
      let x_allergens_lupins = req.body.x_allergens_lupins;
      let x_allergens_seafood = req.body.x_allergens_seafood;
      let x_allergens_shellfish = req.body.x_allergens_shellfish;
      let x_allergens_sesame_seeds = req.body.x_allergens_sesame_seeds;
      let x_allergens_soy = req.body.x_allergens_soy;
      let x_allergens_eggs = req.body.x_allergens_eggs;
      let x_allergens_milk = req.body.x_allergens_milk;
      let x_allergens_other = req.body.x_allergens_other;
      let x_meat_blood_line = req.body.x_meat_blood_line;
      let x_meat_breed = req.body.x_meat_breed;
      let x_meat_region = req.body.x_meat_region;
      let x_meat_state = req.body.x_meat_state;
      let x_meat_grade = req.body.x_meat_grade;
      let x_meat_marble_score = req.body.x_meat_marble_score;
      let x_meat_feed_type = req.body.x_meat_feed_type;
      let x_meat_ham_no = req.body.x_meat_ham_no;
      let x_meat_cut_type = req.body.x_meat_cut_type;
      let x_meat_portion_cut = req.body.x_meat_portion_cut;
      let x_meat_whole_cut = req.body.x_meat_whole_cut;
      let x_meat_other = req.body.x_meat_other;
      let x_seafood_species = req.body.x_seafood_species;
      let x_seafood_sub_species = req.body.x_seafood_sub_species;
      let x_seafood_region = req.body.x_seafood_region;
      let x_seafood_state = req.body.x_seafood_state;
      let x_seafood_grade = req.body.x_seafood_grade;
      let x_seafood_produced = req.body.x_seafood_produced;
      let x_seafood_preparation = req.body.x_seafood_preparation;
      let x_seafood_environment = req.body.x_seafood_environment;
      let x_seafood_cut_type = req.body.x_seafood_cut_type;
      let x_seafood_appearance = req.body.x_seafood_appearance;
      let x_seafood_packaging = req.body.x_seafood_packaging;
      let x_seafood_other = req.body.x_seafood_other;
      let x_delivery_lead_time = req.body.x_delivery_lead_time;
      let x_vendor_moq = req.body.x_vendor_moq;
      //let x_factory_gate_cost_ex_gst = req.body.x_factory_gate_cost_ex_gst;
      /* let x_external_id = req.body.x_external_id; */

      
      //(new Date()).toISOString().split('T')[0]
      let apn = req.body.apn || "";
      let tun_no = req.body.tun_no || "";
      let product_spec_sheet = req.body.product_spec_sheet || "";
      let safety_data_sheet = req.body.safety_data_sheet || "";

      let query = `INSERT INTO public.myob_stockitems(
        stockcode,
        description,
        has_expiry,
        is_discountable,
        restricted_item,
        variablecost,
        x_wholeunitsonly,
        x_brand,
        x_storage,
        x_dietary,
        x_wet,
        x_hidefromallstockreports,
        x_carton_description,
        x_pack_description,
        x_serve_description,
        x_shelf_life,
        x_min_receival_shelf_life,
        x_production_dating_exp,
        x_production_dating_prod,
        x_dangerous_goods_code,
        x_outer_height,
        x_width,
        x_length,
        x_ctn_per_layer,
        x_ctn_per_pallet,
        x_total_ctn_per_pallet,
        x_alternative_product_name,
        x_country_of_origin,
        x_aust_ingredients_percent,
        x_meat_blood_line,
        x_meat_breed,
        x_meat_region,
        x_meat_state,
        x_meat_grade,
        x_meat_marble_score,
        x_meat_feed_type,
        x_meat_ham_no,
        x_meat_cut_type,
        x_meat_portion_cut,
        x_meat_whole_cut,
        x_meat_other,
        x_seafood_species,
        x_seafood_sub_species,
        x_seafood_region,
        x_seafood_state,
        x_seafood_grade,
        x_seafood_produced,
        x_seafood_preparation,
        x_seafood_environment,
        x_seafood_cut_type,
        x_seafood_appearance,
        x_seafood_packaging,
        x_seafood_other,
        x_delivery_lead_time,
        x_vendor_moq,
        x_factory_gate_cost_ex_gst,
        notes,

        x_certifications_organic,
        x_certifications_kosher,
        x_certifications_halal,
        x_certifications_other,
        x_dietary_gluten_free,
        x_dietary_vegan,
        x_dietary_vegetarian,
        x_dietary_cholesterol_free,
        x_dietary_lactose_free,
        x_dietary_egg_free,
        x_dietary_other,
        x_allergens_wheat,
        x_allergens_peanuts,
        x_allergens_tree_nuts,
        x_allergens_lupins,
        x_allergens_seafood,
        x_allergens_shellfish,
        x_allergens_sesame_seeds,
        x_allergens_soy,
        x_allergens_eggs,
        x_allergens_milk,
        x_allergens_other,
        x_storage_dry,
        x_storage_chilled,
        x_storage_frozen,
        x_storage_temp6_12,

        m__apn,
        m__tun_no,
        m__product_spec_sheet,
        m__safety_data_sheet,

        stockgroup,
        sellprice1,
        sales_gl_code,
        purch_gl_code,
        pqty,
        stock_classification,
        stockgroup2,
        totalstock,
        duty,
        serialno_type,
        label_qty,
        cogsmethod,
        dimensions,
        numdecimals,
        defaultwarrantyno,
        x_units_per_carton,
        x_serves_per_carton,
        x_ctn_weight,
        x_serves_per_unit,
        suppliercost,
        supplierno,
        x_image1,
        x_image2,
        x_image3,
        x_image4,
        x_certification,
        x_seafood,
        m__origin

      ) VALUES (
        '${stockcode}',
        '${description}',
        '${has_expiry}',
        '${is_discountable}',
        '${restricted_item}',
        '${variablecost}',
        '${x_wholeunitsonly}',
        '${x_brand}',
        '${x_storage}',
        '${x_dietary}',
        '${x_wet}',
        '${x_hidefromallstockreports}',
        '${x_carton_description}',
        '${x_pack_description}',
        '${x_serve_description}',
        '${x_shelf_life}',
        '${x_min_receival_shelf_life}',
        '${x_production_dating_exp}',
        '${x_production_dating_prod}',
        '${x_dangerous_goods_code}',
        '${x_outer_height}',
        '${x_width}',
        '${x_length}',
        '${x_ctn_per_layer}',
        '${x_ctn_per_pallet}',
        '${x_total_ctn_per_pallet}',
        '${x_alternative_product_name}',
        '${x_country_of_origin}',
        '${x_aust_ingredients_percent}',
        '${x_meat_blood_line}',
        '${x_meat_breed}',
        '${x_meat_region}',
        '${x_meat_state}',
        '${x_meat_grade}',
        '${x_meat_marble_score}',
        '${x_meat_feed_type}',
        '${x_meat_ham_no}',
        '${x_meat_cut_type}',
        '${x_meat_portion_cut}',
        '${x_meat_whole_cut}',
        '${x_meat_other}',
        '${x_seafood_species}',
        '${x_seafood_sub_species}',
        '${x_seafood_region}',
        '${x_seafood_state}',
        '${x_seafood_grade}',
        '${x_seafood_produced}',
        '${x_seafood_preparation}',
        '${x_seafood_environment}',
        '${x_seafood_cut_type}',
        '${x_seafood_appearance}',
        '${x_seafood_packaging}',
        '${x_seafood_other}',
        '${x_delivery_lead_time}',
        '${x_vendor_moq}',
        '${x_factory_gate_cost_ex_gst}',
        '${product_desc}',

        '${x_certifications_organic}',
        '${x_certifications_kosher}',
        '${x_certifications_halal}',
        '${x_certifications_other}',
        '${x_dietary_gluten_free}',
        '${x_dietary_vegan}',
        '${x_dietary_vegetarian}',
        '${x_dietary_cholesterol_free}',
        '${x_dietary_lactose_free}',
        '${x_dietary_egg_free}',
        '${x_dietary_other}',
        '${x_allergens_wheat}',
        '${x_allergens_peanuts}',
        '${x_allergens_tree_nuts}',
        '${x_allergens_lupins}',
        '${x_allergens_seafood}',
        '${x_allergens_shellfish}',
        '${x_allergens_sesame_seeds}',
        '${x_allergens_soy}',
        '${x_allergens_eggs}',
        '${x_allergens_milk}',
        '${x_allergens_other}',
        '${x_storage_dry}',
        '${x_storage_chilled}',
        '${x_storage_frozen}',
        '${x_storage_temp6_12}',

        '${apn}',
        '${tun_no}',
        '${product_spec_sheet}',
        '${safety_data_sheet}',

        ${stockgroup},
        ${sellprice1},
        ${sales_gl_code},
        ${purch_gl_code},
        ${pqty},
        ${stock_classification},
        ${stockgroup2},
        ${totalstock},
        ${duty},
        ${serialno_type},
        ${label_qty},
        ${cogsmethod},
        ${dimensions},
        ${numdecimals},
        ${defaultwarrantyno},
        ${x_units_per_carton},
        ${x_serves_per_carton},
        ${carton_weight},
        ${serves_per_pack},
        ${landed_gate_cost_gst},
        ${supplierno},
        '${x_image1}',
        '${x_image2}',
        '${x_image3}',
        '${x_image4}',
        '${x_certification}',
        '${x_seafood}',
        'sunshine'
      ) returning id;`;
      let result = await pool.executeQuery(query, [])
      resolve({
        status_code: 200,
        status_message: "success",
        data: {}
      })
    }catch (error) {
      reject(error);
    }
  })
}

async function updateStockItems(req) {
  return new Promise(async function (resolve, reject) {
    try {
      let x_seafood = req.body.x_seafood || "";
      let x_certification = req.body.x_certification || "";

      let x_image1 = req.body.product_image1 || ""
      let x_image2 = req.body.product_image2 || ""
      let x_image3 = req.body.product_image3 || ""
      let x_image4 = req.body.product_image4 || ""
      let x_factory_gate_cost_ex_gst = req.body.x_factory_gate_cost_ex_gst;

      let stock_classification = req.body.stock_classification || 0;
      let totalstock = req.body.totalstock || 10;
      let has_expiry = req.body.has_expiry || "N";
      let duty = req.body.duty || 0;
      let serialno_type = req.body.serialno_type || 0;
      let label_qty = req.body.label_qty || 1;
      let is_discountable = req.body.is_discountable || "Y";
      let restricted_item = req.body.restricted_item || "N";
      let cogsmethod = req.body.cogsmethod || 0;
      let dimensions = req.body.dimensions || 0;
      let variablecost = req.body.variablecost || "N";
      let x_hidefromallstockreports = req.body.x_hidefromallstockreports || "N";
      let x_wet = req.body.x_wet || "N";
      let numdecimals = req.body.numdecimals || -1
      let defaultwarrantyno = req.body.defaultwarrantyno || -2
      let x_wholeunitsonly = req.body.x_wholeunitsonly || "N";
      let sales_gl_code = req.body.sales_gl_code || 41000;
      let purch_gl_code = req.body.purch_gl_code || 51000;
      let sellprice1 = req.body.sellprice1 || parseInt(x_factory_gate_cost_ex_gst) + ((parseInt(x_factory_gate_cost_ex_gst)*25)/100);
      let supplierno = req.body.supplierno;

      let stockgroup = req.body.stockgroup || 0
      let stockgroup2 = req.body.stockgroup2 || 0
      let stockcode = req.body.stockcode;
      let description = req.body.product_name;
      let pqty = req.body.pqty;
      let x_brand = req.body.x_brand;
      let x_storage = req.body.x_storage;
      let x_dietary = req.body.x_dietary;
      let x_units_per_carton = req.body.x_units_per_carton;
      let x_serves_per_carton = req.body.x_serves_per_carton;

      let carton_weight = req.body.x_ctn_weight;//x_ctn_weight
      let serves_per_pack = req.body.serves_per_pack;//x_serves_per_unit 
      let product_desc = req.body.product_desc;//notes 
      let landed_gate_cost_gst= req.body.suppliercost;//suppliercost 

      /* 
      new data set
      */
      let x_storage_dry = req.body.x_storage_dry;
      let x_storage_chilled = req.body.x_storage_chilled;
      let x_storage_frozen = req.body.x_storage_frozen;
      let x_storage_temp6_12 = req.body.x_storage_temp6_12;
      let x_carton_description = req.body.x_carton_description;
      let x_pack_description = req.body.x_pack_description;
      let x_serve_description = req.body.x_serve_description;
      let x_shelf_life = req.body.x_shelf_life;
      let x_min_receival_shelf_life = req.body.x_min_receival_shelf_life;
      let x_production_dating_exp = req.body.x_production_dating_exp;
      let x_production_dating_prod = req.body.x_production_dating_prod;
      let x_dangerous_goods_code = req.body.x_dangerous_goods_code;
      let x_outer_height = req.body.x_outer_height;
      let x_width = req.body.x_width;
      let x_length = req.body.x_length;
      let x_ctn_per_layer = req.body.x_ctn_per_layer;
      let x_ctn_per_pallet = req.body.x_ctn_per_pallet;
      let x_total_ctn_per_pallet = req.body.x_total_ctn_per_pallet;
      let x_alternative_product_name = req.body.x_alternative_product_name;
      let x_country_of_origin = req.body.x_country_of_origin;
      let x_aust_ingredients_percent = req.body.x_aust_ingredients_percent;
      let x_certifications_organic = req.body.x_certifications_organic;
      let x_certifications_kosher = req.body.x_certifications_kosher;
      let x_certifications_halal = req.body.x_certifications_halal;
      let x_certifications_other = req.body.x_certifications_other;
      let x_dietary_gluten_free = req.body.x_dietary_gluten_free;
      let x_dietary_vegan = req.body.x_dietary_vegan;
      let x_dietary_vegetarian = req.body.x_dietary_vegetarian;
      let x_dietary_cholesterol_free = req.body.x_dietary_cholesterol_free;
      let x_dietary_lactose_free = req.body.x_dietary_lactose_free;
      let x_dietary_egg_free = req.body.x_dietary_egg_free;
      let x_dietary_other = req.body.x_dietary_other;
      let x_allergens_wheat = req.body.x_allergens_wheat;
      let x_allergens_peanuts = req.body.x_allergens_peanuts;
      let x_allergens_tree_nuts = req.body.x_allergens_tree_nuts;
      let x_allergens_lupins = req.body.x_allergens_lupins;
      let x_allergens_seafood = req.body.x_allergens_seafood;
      let x_allergens_shellfish = req.body.x_allergens_shellfish;
      let x_allergens_sesame_seeds = req.body.x_allergens_sesame_seeds;
      let x_allergens_soy = req.body.x_allergens_soy;
      let x_allergens_eggs = req.body.x_allergens_eggs;
      let x_allergens_milk = req.body.x_allergens_milk;
      let x_allergens_other = req.body.x_allergens_other;
      let x_meat_blood_line = req.body.x_meat_blood_line;
      let x_meat_breed = req.body.x_meat_breed;
      let x_meat_region = req.body.x_meat_region;
      let x_meat_state = req.body.x_meat_state;
      let x_meat_grade = req.body.x_meat_grade;
      let x_meat_marble_score = req.body.x_meat_marble_score;
      let x_meat_feed_type = req.body.x_meat_feed_type;
      let x_meat_ham_no = req.body.x_meat_ham_no;
      let x_meat_cut_type = req.body.x_meat_cut_type;
      let x_meat_portion_cut = req.body.x_meat_portion_cut;
      let x_meat_whole_cut = req.body.x_meat_whole_cut;
      let x_meat_other = req.body.x_meat_other;
      let x_seafood_species = req.body.x_seafood_species;
      let x_seafood_sub_species = req.body.x_seafood_sub_species;
      let x_seafood_region = req.body.x_seafood_region;
      let x_seafood_state = req.body.x_seafood_state;
      let x_seafood_grade = req.body.x_seafood_grade;
      let x_seafood_produced = req.body.x_seafood_produced;
      let x_seafood_preparation = req.body.x_seafood_preparation;
      let x_seafood_environment = req.body.x_seafood_environment;
      let x_seafood_cut_type = req.body.x_seafood_cut_type;
      let x_seafood_appearance = req.body.x_seafood_appearance;
      let x_seafood_packaging = req.body.x_seafood_packaging;
      let x_seafood_other = req.body.x_seafood_other;
      let x_delivery_lead_time = req.body.x_delivery_lead_time;
      let x_vendor_moq = req.body.x_vendor_moq;
      //let x_factory_gate_cost_ex_gst = req.body.x_factory_gate_cost_ex_gst;
      /* let x_external_id = req.body.x_external_id; */

      
      //(new Date()).toISOString().split('T')[0]
      let apn = req.body.apn || "";
      let tun_no = req.body.tun_no || "";
      let product_spec_sheet = req.body.product_spec_sheet || "";
      let safety_data_sheet = req.body.safety_data_sheet || "";

      let m__suppstatus = false;
      let m__is_sync = false;


      let query = `UPDATE public.myob_stockitems SET
        stockcode = '${stockcode}',
        description = '${description}',
        has_expiry = '${has_expiry}',
        is_discountable = '${is_discountable}',
        restricted_item = '${restricted_item}',
        variablecost = '${variablecost}',
        x_wholeunitsonly = '${x_wholeunitsonly}',
        x_brand = '${x_brand}',
        x_storage = '${x_storage}',
        x_dietary = '${x_dietary}',
        x_wet = '${x_wet}',
        x_hidefromallstockreports = '${x_hidefromallstockreports}',
        x_carton_description = '${x_carton_description}',
        x_pack_description = '${x_pack_description}',
        x_serve_description = '${x_serve_description}',
        x_shelf_life = '${x_shelf_life}',
        x_min_receival_shelf_life = '${x_min_receival_shelf_life}',
        x_production_dating_exp = '${x_production_dating_exp}',
        x_production_dating_prod = '${x_production_dating_prod}',
        x_dangerous_goods_code = '${x_dangerous_goods_code}',
        x_outer_height = '${x_outer_height}',
        x_width = '${x_width}',
        x_length = '${x_length}',
        x_ctn_per_layer = '${x_ctn_per_layer}',
        x_ctn_per_pallet = '${x_ctn_per_pallet}',
        x_total_ctn_per_pallet = '${x_total_ctn_per_pallet}',
        x_alternative_product_name = '${x_alternative_product_name}',
        x_country_of_origin = '${x_country_of_origin}',
        x_aust_ingredients_percent = '${x_aust_ingredients_percent}',
        x_meat_blood_line = '${x_meat_blood_line}',
        x_meat_breed = '${x_meat_breed}',
        x_meat_region = '${x_meat_region}',
        x_meat_state = '${x_meat_state}',
        x_meat_grade = '${x_meat_grade}',
        x_meat_marble_score = '${x_meat_marble_score}',
        x_meat_feed_type = '${x_meat_feed_type}',
        x_meat_ham_no = '${x_meat_ham_no}',
        x_meat_cut_type = '${x_meat_cut_type}',
        x_meat_portion_cut = '${x_meat_portion_cut}',
        x_meat_whole_cut = '${x_meat_whole_cut}',
        x_meat_other = '${x_meat_other}',
        x_seafood_species = '${x_seafood_species}',
        x_seafood_sub_species = '${x_seafood_sub_species}',
        x_seafood_region = '${x_seafood_region}',
        x_seafood_state = '${x_seafood_state}',
        x_seafood_grade = '${x_seafood_grade}',
        x_seafood_produced = '${x_seafood_produced}',
        x_seafood_preparation = '${x_seafood_preparation}',
        x_seafood_environment = '${x_seafood_environment}',
        x_seafood_cut_type = '${x_seafood_cut_type}',
        x_seafood_appearance = '${x_seafood_appearance}',
        x_seafood_packaging = '${x_seafood_packaging}',
        x_seafood_other = '${x_seafood_other}',
        x_delivery_lead_time = '${x_delivery_lead_time}',
        x_vendor_moq = '${x_vendor_moq}',
        x_factory_gate_cost_ex_gst = '${x_factory_gate_cost_ex_gst}',
        notes = '${product_desc}',

        x_certifications_organic = '${x_certifications_organic}',
        x_certifications_kosher = '${x_certifications_kosher}',
        x_certifications_halal = '${x_certifications_halal}',
        x_certifications_other = '${x_certifications_other}',
        x_dietary_gluten_free = '${x_dietary_gluten_free}',
        x_dietary_vegan = '${x_dietary_vegan}',
        x_dietary_vegetarian = '${x_dietary_vegetarian}',
        x_dietary_cholesterol_free = '${x_dietary_cholesterol_free}',
        x_dietary_lactose_free = '${x_dietary_lactose_free}',
        x_dietary_egg_free = '${x_dietary_egg_free}',
        x_dietary_other = '${x_dietary_other}',
        x_allergens_wheat = '${x_allergens_wheat}',
        x_allergens_peanuts = '${x_allergens_peanuts}',
        x_allergens_tree_nuts = '${x_allergens_tree_nuts}',
        x_allergens_lupins = '${x_allergens_lupins}',
        x_allergens_seafood = '${x_allergens_seafood}',
        x_allergens_shellfish = '${x_allergens_shellfish}',
        x_allergens_sesame_seeds = '${x_allergens_sesame_seeds}',
        x_allergens_soy = '${x_allergens_soy}',
        x_allergens_eggs = '${x_allergens_eggs}',
        x_allergens_milk = '${x_allergens_milk}',
        x_allergens_other = '${x_allergens_other}',
        x_storage_dry = '${x_storage_dry}',
        x_storage_chilled = '${x_storage_chilled}',
        x_storage_frozen = '${x_storage_frozen}',
        x_storage_temp6_12 = '${x_storage_temp6_12}',

        m__apn = '${apn}',
        m__tun_no = '${tun_no}',
        m__product_spec_sheet = '${product_spec_sheet}',
        m__safety_data_sheet = '${safety_data_sheet}',
        
        stockgroup = ${stockgroup},
        sellprice1 = ${sellprice1},
        sales_gl_code = ${sales_gl_code},
        purch_gl_code = ${purch_gl_code},
        pqty = ${pqty},
        stock_classification = ${stock_classification},
        stockgroup2 = ${stockgroup2},
        totalstock = ${totalstock},
        duty = ${duty},
        serialno_type = ${serialno_type},
        label_qty = ${label_qty},
        cogsmethod = ${cogsmethod},
        dimensions = ${dimensions},
        numdecimals = ${numdecimals},
        defaultwarrantyno = ${defaultwarrantyno},
        x_units_per_carton = ${x_units_per_carton},
        x_serves_per_carton = ${x_serves_per_carton},
        x_ctn_weight = ${carton_weight},
        x_serves_per_unit = ${serves_per_pack},
        suppliercost = ${landed_gate_cost_gst},
        supplierno = ${supplierno},
        m__suppstatus = ${m__suppstatus},
        m__is_sync = ${m__is_sync},
        x_image1 = '${x_image1}',
        x_image2 = '${x_image2}',
        x_image3 = '${x_image3}',
        x_image4 = '${x_image4}',
        x_certification = '${x_certification}',
        x_seafood = '${x_seafood}'

        WHERE stockcode = '${stockcode}';
  
      `;
      let result = await pool.executeQuery(query, [])
      resolve({
        status_code: 200,
        status_message: "success",
        data: {}
      })
    }catch (error) {
      reject(error);
    }
  })
}

async function insertStockItemsBySupplier(req) {
  return new Promise(async function (resolve, reject) {
    try {
      let x_seafood = req.body.x_seafood || "";
      let x_certification = req.body.x_certification || "";

      let x_image1 = req.body.product_image1 || ""
      let x_image2 = req.body.product_image2 || ""
      let x_image3 = req.body.product_image3 || ""
      let x_image4 = req.body.product_image4 || ""
      let x_factory_gate_cost_ex_gst = req.body.x_factory_gate_cost_ex_gst;

      let stock_classification = req.body.stock_classification || 0;
      let totalstock = req.body.totalstock || 10;
      let has_expiry = req.body.has_expiry || "N";
      let duty = req.body.duty || 0;
      let serialno_type = req.body.serialno_type || 0;
      let label_qty = req.body.label_qty || 1;
      let is_discountable = req.body.is_discountable || "Y";
      let restricted_item = req.body.restricted_item || "N";
      let cogsmethod = req.body.cogsmethod || 0;
      let dimensions = req.body.dimensions || 0;
      let variablecost = req.body.variablecost || "N";
      let x_hidefromallstockreports = req.body.x_hidefromallstockreports || "N";
      let x_wet = req.body.x_wet || "N";
      let numdecimals = req.body.numdecimals || -1
      let defaultwarrantyno = req.body.defaultwarrantyno || -2
      let x_wholeunitsonly = req.body.x_wholeunitsonly || "N";
      let sales_gl_code = req.body.sales_gl_code || 41000;
      let purch_gl_code = req.body.purch_gl_code || 51000;
      let sellprice1 = parseInt(x_factory_gate_cost_ex_gst) + ((parseInt(x_factory_gate_cost_ex_gst)*25)/100);
      let supplierno = req.body.supplierno;

      let stockgroup = req.body.stockgroup || 0
      let stockgroup2 = req.body.stockgroup2 || 0
      let stockcode = req.body.stockcode;
      let description = req.body.product_name;
      let pqty = req.body.pqty;
      let x_brand = req.body.x_brand;
      let x_storage = req.body.x_storage;
      let x_dietary = req.body.x_dietary;
      let x_units_per_carton = req.body.x_units_per_carton;
      let x_serves_per_carton = req.body.x_serves_per_carton;

      let carton_weight = req.body.x_ctn_weight;//x_ctn_weight
      let serves_per_pack = req.body.serves_per_pack;//x_serves_per_unit 
      let product_desc = req.body.product_desc;//notes 
      let landed_gate_cost_gst = req.body.suppliercost;//suppliercost 

      /* 
      new data set
      */
      let x_storage_dry = req.body.x_storage_dry;
      let x_storage_chilled = req.body.x_storage_chilled;
      let x_storage_frozen = req.body.x_storage_frozen;
      let x_storage_temp6_12 = req.body.x_storage_temp6_12;
      let x_carton_description = req.body.x_carton_description;
      let x_pack_description = req.body.x_pack_description;
      let x_serve_description = req.body.x_serve_description;
      let x_shelf_life = req.body.x_shelf_life;
      let x_min_receival_shelf_life = req.body.x_min_receival_shelf_life;
      let x_production_dating_exp = req.body.x_production_dating_exp;
      let x_production_dating_prod = req.body.x_production_dating_prod;
      let x_dangerous_goods_code = req.body.x_dangerous_goods_code;
      let x_outer_height = req.body.x_outer_height;
      let x_width = req.body.x_width;
      let x_length = req.body.x_length;
      let x_ctn_per_layer = req.body.x_ctn_per_layer;
      let x_ctn_per_pallet = req.body.x_ctn_per_pallet;
      let x_total_ctn_per_pallet = req.body.x_total_ctn_per_pallet;
      let x_alternative_product_name = req.body.x_alternative_product_name;
      let x_country_of_origin = req.body.x_country_of_origin;
      let x_aust_ingredients_percent = req.body.x_aust_ingredients_percent;
      let x_certifications_organic = req.body.x_certifications_organic;
      let x_certifications_kosher = req.body.x_certifications_kosher;
      let x_certifications_halal = req.body.x_certifications_halal;
      let x_certifications_other = req.body.x_certifications_other;
      let x_dietary_gluten_free = req.body.x_dietary_gluten_free;
      let x_dietary_vegan = req.body.x_dietary_vegan;
      let x_dietary_vegetarian = req.body.x_dietary_vegetarian;
      let x_dietary_cholesterol_free = req.body.x_dietary_cholesterol_free;
      let x_dietary_lactose_free = req.body.x_dietary_lactose_free;
      let x_dietary_egg_free = req.body.x_dietary_egg_free;
      let x_dietary_other = req.body.x_dietary_other;
      let x_allergens_wheat = req.body.x_allergens_wheat;
      let x_allergens_peanuts = req.body.x_allergens_peanuts;
      let x_allergens_tree_nuts = req.body.x_allergens_tree_nuts;
      let x_allergens_lupins = req.body.x_allergens_lupins;
      let x_allergens_seafood = req.body.x_allergens_seafood;
      let x_allergens_shellfish = req.body.x_allergens_shellfish;
      let x_allergens_sesame_seeds = req.body.x_allergens_sesame_seeds;
      let x_allergens_soy = req.body.x_allergens_soy;
      let x_allergens_eggs = req.body.x_allergens_eggs;
      let x_allergens_milk = req.body.x_allergens_milk;
      let x_allergens_other = req.body.x_allergens_other;
      let x_meat_blood_line = req.body.x_meat_blood_line;
      let x_meat_breed = req.body.x_meat_breed;
      let x_meat_region = req.body.x_meat_region;
      let x_meat_state = req.body.x_meat_state;
      let x_meat_grade = req.body.x_meat_grade;
      let x_meat_marble_score = req.body.x_meat_marble_score;
      let x_meat_feed_type = req.body.x_meat_feed_type;
      let x_meat_ham_no = req.body.x_meat_ham_no;
      let x_meat_cut_type = req.body.x_meat_cut_type;
      let x_meat_portion_cut = req.body.x_meat_portion_cut;
      let x_meat_whole_cut = req.body.x_meat_whole_cut;
      let x_meat_other = req.body.x_meat_other;
      let x_seafood_species = req.body.x_seafood_species;
      let x_seafood_sub_species = req.body.x_seafood_sub_species;
      let x_seafood_region = req.body.x_seafood_region;
      let x_seafood_state = req.body.x_seafood_state;
      let x_seafood_grade = req.body.x_seafood_grade;
      let x_seafood_produced = req.body.x_seafood_produced;
      let x_seafood_preparation = req.body.x_seafood_preparation;
      let x_seafood_environment = req.body.x_seafood_environment;
      let x_seafood_cut_type = req.body.x_seafood_cut_type;
      let x_seafood_appearance = req.body.x_seafood_appearance;
      let x_seafood_packaging = req.body.x_seafood_packaging;
      let x_seafood_other = req.body.x_seafood_other;
      let x_delivery_lead_time = req.body.x_delivery_lead_time;
      let x_vendor_moq = req.body.x_vendor_moq;
      
      /* let x_external_id = req.body.x_external_id; */

      
      //(new Date()).toISOString().split('T')[0]
      let apn = req.body.apn || "";
      let tun_no = req.body.tun_no || "";
      let product_spec_sheet = req.body.product_spec_sheet || "";
      let safety_data_sheet = req.body.safety_data_sheet || "";

      let m__suppstatus = true;

      let query = `INSERT INTO public.myob_stockitems(
        stockcode,
        description,
        has_expiry,
        is_discountable,
        restricted_item,
        variablecost,
        x_wholeunitsonly,
        x_brand,
        x_storage,
        x_dietary,
        x_wet,
        x_hidefromallstockreports,
        x_carton_description,
        x_pack_description,
        x_serve_description,
        x_shelf_life,
        x_min_receival_shelf_life,
        x_production_dating_exp,
        x_production_dating_prod,
        x_dangerous_goods_code,
        x_outer_height,
        x_width,
        x_length,
        x_ctn_per_layer,
        x_ctn_per_pallet,
        x_total_ctn_per_pallet,
        x_alternative_product_name,
        x_country_of_origin,
        x_aust_ingredients_percent,
        x_meat_blood_line,
        x_meat_breed,
        x_meat_region,
        x_meat_state,
        x_meat_grade,
        x_meat_marble_score,
        x_meat_feed_type,
        x_meat_ham_no,
        x_meat_cut_type,
        x_meat_portion_cut,
        x_meat_whole_cut,
        x_meat_other,
        x_seafood_species,
        x_seafood_sub_species,
        x_seafood_region,
        x_seafood_state,
        x_seafood_grade,
        x_seafood_produced,
        x_seafood_preparation,
        x_seafood_environment,
        x_seafood_cut_type,
        x_seafood_appearance,
        x_seafood_packaging,
        x_seafood_other,
        x_delivery_lead_time,
        x_vendor_moq,
        x_factory_gate_cost_ex_gst,
        notes,

        x_certifications_organic,
        x_certifications_kosher,
        x_certifications_halal,
        x_certifications_other,
        x_dietary_gluten_free,
        x_dietary_vegan,
        x_dietary_vegetarian,
        x_dietary_cholesterol_free,
        x_dietary_lactose_free,
        x_dietary_egg_free,
        x_dietary_other,
        x_allergens_wheat,
        x_allergens_peanuts,
        x_allergens_tree_nuts,
        x_allergens_lupins,
        x_allergens_seafood,
        x_allergens_shellfish,
        x_allergens_sesame_seeds,
        x_allergens_soy,
        x_allergens_eggs,
        x_allergens_milk,
        x_allergens_other,
        x_storage_dry,
        x_storage_chilled,
        x_storage_frozen,
        x_storage_temp6_12,

        m__apn,
        m__tun_no,
        m__product_spec_sheet,
        m__safety_data_sheet,

        stockgroup,
        sellprice1,
        sales_gl_code,
        purch_gl_code,
        pqty,
        stock_classification,
        stockgroup2,
        totalstock,
        duty,
        serialno_type,
        label_qty,
        cogsmethod,
        dimensions,
        numdecimals,
        defaultwarrantyno,
        x_units_per_carton,
        x_serves_per_carton,
        x_ctn_weight,
        x_serves_per_unit,
        suppliercost,
        supplierno,
        m__suppstatus,
        x_image1,
        x_image2,
        x_image3,
        x_image4,
        x_certification,
        x_seafood,
        m__origin

      ) VALUES (
        '${stockcode}',
        '${description}',
        '${has_expiry}',
        '${is_discountable}',
        '${restricted_item}',
        '${variablecost}',
        '${x_wholeunitsonly}',
        '${x_brand}',
        '${x_storage}',
        '${x_dietary}',
        '${x_wet}',
        '${x_hidefromallstockreports}',
        '${x_carton_description}',
        '${x_pack_description}',
        '${x_serve_description}',
        '${x_shelf_life}',
        '${x_min_receival_shelf_life}',
        '${x_production_dating_exp}',
        '${x_production_dating_prod}',
        '${x_dangerous_goods_code}',
        '${x_outer_height}',
        '${x_width}',
        '${x_length}',
        '${x_ctn_per_layer}',
        '${x_ctn_per_pallet}',
        '${x_total_ctn_per_pallet}',
        '${x_alternative_product_name}',
        '${x_country_of_origin}',
        '${x_aust_ingredients_percent}',
        '${x_meat_blood_line}',
        '${x_meat_breed}',
        '${x_meat_region}',
        '${x_meat_state}',
        '${x_meat_grade}',
        '${x_meat_marble_score}',
        '${x_meat_feed_type}',
        '${x_meat_ham_no}',
        '${x_meat_cut_type}',
        '${x_meat_portion_cut}',
        '${x_meat_whole_cut}',
        '${x_meat_other}',
        '${x_seafood_species}',
        '${x_seafood_sub_species}',
        '${x_seafood_region}',
        '${x_seafood_state}',
        '${x_seafood_grade}',
        '${x_seafood_produced}',
        '${x_seafood_preparation}',
        '${x_seafood_environment}',
        '${x_seafood_cut_type}',
        '${x_seafood_appearance}',
        '${x_seafood_packaging}',
        '${x_seafood_other}',
        '${x_delivery_lead_time}',
        '${x_vendor_moq}',
        '${x_factory_gate_cost_ex_gst}',
        '${product_desc}',

        '${x_certifications_organic}',
        '${x_certifications_kosher}',
        '${x_certifications_halal}',
        '${x_certifications_other}',
        '${x_dietary_gluten_free}',
        '${x_dietary_vegan}',
        '${x_dietary_vegetarian}',
        '${x_dietary_cholesterol_free}',
        '${x_dietary_lactose_free}',
        '${x_dietary_egg_free}',
        '${x_dietary_other}',
        '${x_allergens_wheat}',
        '${x_allergens_peanuts}',
        '${x_allergens_tree_nuts}',
        '${x_allergens_lupins}',
        '${x_allergens_seafood}',
        '${x_allergens_shellfish}',
        '${x_allergens_sesame_seeds}',
        '${x_allergens_soy}',
        '${x_allergens_eggs}',
        '${x_allergens_milk}',
        '${x_allergens_other}',
        '${x_storage_dry}',
        '${x_storage_chilled}',
        '${x_storage_frozen}',
        '${x_storage_temp6_12}',

        '${apn}',
        '${tun_no}',
        '${product_spec_sheet}',
        '${safety_data_sheet}',

        ${stockgroup},
        ${sellprice1},
        ${sales_gl_code},
        ${purch_gl_code},
        ${pqty},
        ${stock_classification},
        ${stockgroup2},
        ${totalstock},
        ${duty},
        ${serialno_type},
        ${label_qty},
        ${cogsmethod},
        ${dimensions},
        ${numdecimals},
        ${defaultwarrantyno},
        ${x_units_per_carton},
        ${x_serves_per_carton},
        ${carton_weight},
        ${serves_per_pack},
        ${landed_gate_cost_gst},
        ${supplierno},
        ${m__suppstatus},
        '${x_image1}',
        '${x_image2}',
        '${x_image3}',
        '${x_image4}',
        '${x_certification}',
        '${x_seafood}',
        'sunshine'
      ) returning id;`;
      let result = await pool.executeQuery(query, [])
      resolve({
        status_code: 200,
        status_message: "success",
        data: {}
      })
    } catch (error) {
      reject(error);
    }
  })
}

async function updateStockItemsBySupplier(req) {
  return new Promise(async function (resolve, reject) {
    try {
      let x_seafood = req.body.x_seafood || "";
      let x_certification = req.body.x_certification || "";

      let x_image1 = req.body.product_image1 || ""
      let x_image2 = req.body.product_image2 || ""
      let x_image3 = req.body.product_image3 || ""
      let x_image4 = req.body.product_image4 || ""
      let x_factory_gate_cost_ex_gst = req.body.x_factory_gate_cost_ex_gst;

      let stock_classification = req.body.stock_classification || 0;
      let totalstock = req.body.totalstock || 10;
      let has_expiry = req.body.has_expiry || "N";
      let duty = req.body.duty || 0;
      let serialno_type = req.body.serialno_type || 0;
      let label_qty = req.body.label_qty || 1;
      let is_discountable = req.body.is_discountable || "Y";
      let restricted_item = req.body.restricted_item || "N";
      let cogsmethod = req.body.cogsmethod || 0;
      let dimensions = req.body.dimensions || 0;
      let variablecost = req.body.variablecost || "N";
      let x_hidefromallstockreports = req.body.x_hidefromallstockreports || "N";
      let x_wet = req.body.x_wet || "N";
      let numdecimals = req.body.numdecimals || -1
      let defaultwarrantyno = req.body.defaultwarrantyno || -2
      let x_wholeunitsonly = req.body.x_wholeunitsonly || "N";
      let sales_gl_code = req.body.sales_gl_code || 41000;
      let purch_gl_code = req.body.purch_gl_code || 51000;
      let sellprice1 = parseInt(x_factory_gate_cost_ex_gst) + ((parseInt(x_factory_gate_cost_ex_gst)*25)/100);
      let supplierno = req.body.supplierno;

      let stockgroup = req.body.stockgroup || 0
      let stockgroup2 = req.body.stockgroup2 || 0
      let stockcode = req.body.stockcode;
      let description = req.body.product_name;
      let pqty = req.body.pqty;
      let x_brand = req.body.x_brand;
      let x_storage = req.body.x_storage;
      let x_dietary = req.body.x_dietary;
      let x_units_per_carton = req.body.x_units_per_carton;
      let x_serves_per_carton = req.body.x_serves_per_carton;

      let carton_weight = req.body.x_ctn_weight;//x_ctn_weight
      let serves_per_pack = req.body.serves_per_pack;//x_serves_per_unit 
      let product_desc = req.body.product_desc;//notes 
      let landed_gate_cost_gst= req.body.suppliercost;//suppliercost 

      /* 
      new data set
      */
      let x_storage_dry = req.body.x_storage_dry;
      let x_storage_chilled = req.body.x_storage_chilled;
      let x_storage_frozen = req.body.x_storage_frozen;
      let x_storage_temp6_12 = req.body.x_storage_temp6_12;
      let x_carton_description = req.body.x_carton_description;
      let x_pack_description = req.body.x_pack_description;
      let x_serve_description = req.body.x_serve_description;
      let x_shelf_life = req.body.x_shelf_life;
      let x_min_receival_shelf_life = req.body.x_min_receival_shelf_life;
      let x_production_dating_exp = req.body.x_production_dating_exp;
      let x_production_dating_prod = req.body.x_production_dating_prod;
      let x_dangerous_goods_code = req.body.x_dangerous_goods_code;
      let x_outer_height = req.body.x_outer_height;
      let x_width = req.body.x_width;
      let x_length = req.body.x_length;
      let x_ctn_per_layer = req.body.x_ctn_per_layer;
      let x_ctn_per_pallet = req.body.x_ctn_per_pallet;
      let x_total_ctn_per_pallet = req.body.x_total_ctn_per_pallet;
      let x_alternative_product_name = req.body.x_alternative_product_name;
      let x_country_of_origin = req.body.x_country_of_origin;
      let x_aust_ingredients_percent = req.body.x_aust_ingredients_percent;
      let x_certifications_organic = req.body.x_certifications_organic;
      let x_certifications_kosher = req.body.x_certifications_kosher;
      let x_certifications_halal = req.body.x_certifications_halal;
      let x_certifications_other = req.body.x_certifications_other;
      let x_dietary_gluten_free = req.body.x_dietary_gluten_free;
      let x_dietary_vegan = req.body.x_dietary_vegan;
      let x_dietary_vegetarian = req.body.x_dietary_vegetarian;
      let x_dietary_cholesterol_free = req.body.x_dietary_cholesterol_free;
      let x_dietary_lactose_free = req.body.x_dietary_lactose_free;
      let x_dietary_egg_free = req.body.x_dietary_egg_free;
      let x_dietary_other = req.body.x_dietary_other;
      let x_allergens_wheat = req.body.x_allergens_wheat;
      let x_allergens_peanuts = req.body.x_allergens_peanuts;
      let x_allergens_tree_nuts = req.body.x_allergens_tree_nuts;
      let x_allergens_lupins = req.body.x_allergens_lupins;
      let x_allergens_seafood = req.body.x_allergens_seafood;
      let x_allergens_shellfish = req.body.x_allergens_shellfish;
      let x_allergens_sesame_seeds = req.body.x_allergens_sesame_seeds;
      let x_allergens_soy = req.body.x_allergens_soy;
      let x_allergens_eggs = req.body.x_allergens_eggs;
      let x_allergens_milk = req.body.x_allergens_milk;
      let x_allergens_other = req.body.x_allergens_other;
      let x_meat_blood_line = req.body.x_meat_blood_line;
      let x_meat_breed = req.body.x_meat_breed;
      let x_meat_region = req.body.x_meat_region;
      let x_meat_state = req.body.x_meat_state;
      let x_meat_grade = req.body.x_meat_grade;
      let x_meat_marble_score = req.body.x_meat_marble_score;
      let x_meat_feed_type = req.body.x_meat_feed_type;
      let x_meat_ham_no = req.body.x_meat_ham_no;
      let x_meat_cut_type = req.body.x_meat_cut_type;
      let x_meat_portion_cut = req.body.x_meat_portion_cut;
      let x_meat_whole_cut = req.body.x_meat_whole_cut;
      let x_meat_other = req.body.x_meat_other;
      let x_seafood_species = req.body.x_seafood_species;
      let x_seafood_sub_species = req.body.x_seafood_sub_species;
      let x_seafood_region = req.body.x_seafood_region;
      let x_seafood_state = req.body.x_seafood_state;
      let x_seafood_grade = req.body.x_seafood_grade;
      let x_seafood_produced = req.body.x_seafood_produced;
      let x_seafood_preparation = req.body.x_seafood_preparation;
      let x_seafood_environment = req.body.x_seafood_environment;
      let x_seafood_cut_type = req.body.x_seafood_cut_type;
      let x_seafood_appearance = req.body.x_seafood_appearance;
      let x_seafood_packaging = req.body.x_seafood_packaging;
      let x_seafood_other = req.body.x_seafood_other;
      let x_delivery_lead_time = req.body.x_delivery_lead_time;
      let x_vendor_moq = req.body.x_vendor_moq;
      //let x_factory_gate_cost_ex_gst = req.body.x_factory_gate_cost_ex_gst;
      /* let x_external_id = req.body.x_external_id; */
      
      
      //(new Date()).toISOString().split('T')[0]
      let apn = req.body.apn || "";
      let tun_no = req.body.tun_no || "";
      let product_spec_sheet = req.body.product_spec_sheet || "";
      let safety_data_sheet = req.body.safety_data_sheet || "";

      let m__suppstatus = true;
      let m__is_sync = false;


      let query = `UPDATE public.myob_stockitems SET
        stockcode = '${stockcode}',
        description = '${description}',
        has_expiry = '${has_expiry}',
        is_discountable = '${is_discountable}',
        restricted_item = '${restricted_item}',
        variablecost = '${variablecost}',
        x_wholeunitsonly = '${x_wholeunitsonly}',
        x_brand = '${x_brand}',
        x_storage = '${x_storage}',
        x_dietary = '${x_dietary}',
        x_wet = '${x_wet}',
        x_hidefromallstockreports = '${x_hidefromallstockreports}',
        x_carton_description = '${x_carton_description}',
        x_pack_description = '${x_pack_description}',
        x_serve_description = '${x_serve_description}',
        x_shelf_life = '${x_shelf_life}',
        x_min_receival_shelf_life = '${x_min_receival_shelf_life}',
        x_production_dating_exp = '${x_production_dating_exp}',
        x_production_dating_prod = '${x_production_dating_prod}',
        x_dangerous_goods_code = '${x_dangerous_goods_code}',
        x_outer_height = '${x_outer_height}',
        x_width = '${x_width}',
        x_length = '${x_length}',
        x_ctn_per_layer = '${x_ctn_per_layer}',
        x_ctn_per_pallet = '${x_ctn_per_pallet}',
        x_total_ctn_per_pallet = '${x_total_ctn_per_pallet}',
        x_alternative_product_name = '${x_alternative_product_name}',
        x_country_of_origin = '${x_country_of_origin}',
        x_aust_ingredients_percent = '${x_aust_ingredients_percent}',
        x_meat_blood_line = '${x_meat_blood_line}',
        x_meat_breed = '${x_meat_breed}',
        x_meat_region = '${x_meat_region}',
        x_meat_state = '${x_meat_state}',
        x_meat_grade = '${x_meat_grade}',
        x_meat_marble_score = '${x_meat_marble_score}',
        x_meat_feed_type = '${x_meat_feed_type}',
        x_meat_ham_no = '${x_meat_ham_no}',
        x_meat_cut_type = '${x_meat_cut_type}',
        x_meat_portion_cut = '${x_meat_portion_cut}',
        x_meat_whole_cut = '${x_meat_whole_cut}',
        x_meat_other = '${x_meat_other}',
        x_seafood_species = '${x_seafood_species}',
        x_seafood_sub_species = '${x_seafood_sub_species}',
        x_seafood_region = '${x_seafood_region}',
        x_seafood_state = '${x_seafood_state}',
        x_seafood_grade = '${x_seafood_grade}',
        x_seafood_produced = '${x_seafood_produced}',
        x_seafood_preparation = '${x_seafood_preparation}',
        x_seafood_environment = '${x_seafood_environment}',
        x_seafood_cut_type = '${x_seafood_cut_type}',
        x_seafood_appearance = '${x_seafood_appearance}',
        x_seafood_packaging = '${x_seafood_packaging}',
        x_seafood_other = '${x_seafood_other}',
        x_delivery_lead_time = '${x_delivery_lead_time}',
        x_vendor_moq = '${x_vendor_moq}',
        x_factory_gate_cost_ex_gst = '${x_factory_gate_cost_ex_gst}',
        notes = '${product_desc}',

        x_certifications_organic = '${x_certifications_organic}',
        x_certifications_kosher = '${x_certifications_kosher}',
        x_certifications_halal = '${x_certifications_halal}',
        x_certifications_other = '${x_certifications_other}',
        x_dietary_gluten_free = '${x_dietary_gluten_free}',
        x_dietary_vegan = '${x_dietary_vegan}',
        x_dietary_vegetarian = '${x_dietary_vegetarian}',
        x_dietary_cholesterol_free = '${x_dietary_cholesterol_free}',
        x_dietary_lactose_free = '${x_dietary_lactose_free}',
        x_dietary_egg_free = '${x_dietary_egg_free}',
        x_dietary_other = '${x_dietary_other}',
        x_allergens_wheat = '${x_allergens_wheat}',
        x_allergens_peanuts = '${x_allergens_peanuts}',
        x_allergens_tree_nuts = '${x_allergens_tree_nuts}',
        x_allergens_lupins = '${x_allergens_lupins}',
        x_allergens_seafood = '${x_allergens_seafood}',
        x_allergens_shellfish = '${x_allergens_shellfish}',
        x_allergens_sesame_seeds = '${x_allergens_sesame_seeds}',
        x_allergens_soy = '${x_allergens_soy}',
        x_allergens_eggs = '${x_allergens_eggs}',
        x_allergens_milk = '${x_allergens_milk}',
        x_allergens_other = '${x_allergens_other}',
        x_storage_dry = '${x_storage_dry}',
        x_storage_chilled = '${x_storage_chilled}',
        x_storage_frozen = '${x_storage_frozen}',
        x_storage_temp6_12 = '${x_storage_temp6_12}',

        m__apn = '${apn}',
        m__tun_no = '${tun_no}',
        m__product_spec_sheet = '${product_spec_sheet}',
        m__safety_data_sheet = '${safety_data_sheet}',

        stockgroup = ${stockgroup},
        sellprice1 = ${sellprice1},
        sales_gl_code = ${sales_gl_code},
        purch_gl_code = ${purch_gl_code},
        pqty = ${pqty},
        stock_classification = ${stock_classification},
        stockgroup2 = ${stockgroup2},
        totalstock = ${totalstock},
        duty = ${duty},
        serialno_type = ${serialno_type},
        label_qty = ${label_qty},
        cogsmethod = ${cogsmethod},
        dimensions = ${dimensions},
        numdecimals = ${numdecimals},
        defaultwarrantyno = ${defaultwarrantyno},
        x_units_per_carton = ${x_units_per_carton},
        x_serves_per_carton = ${x_serves_per_carton},
        x_ctn_weight = ${carton_weight},
        x_serves_per_unit = ${serves_per_pack},
        suppliercost = ${landed_gate_cost_gst},
        supplierno = ${supplierno},
        m__suppstatus = ${m__suppstatus},
        m__is_sync = ${m__is_sync},
        x_image1 = '${x_image1}',
        x_image2 = '${x_image2}',
        x_image3 = '${x_image3}',
        x_image4 = '${x_image4}',
        x_certification = '${x_certification}',
        x_seafood = '${x_seafood}'


        WHERE stockcode = '${stockcode}';
  
      `;
      let result = await pool.executeQuery(query, [])
      resolve({
        status_code: 200,
        status_message: "success",
        data: {}
      })
    } catch (error) {
      reject(error);
    }
  })
}

async function insertProduct(req) {
  return new Promise(async function (resolve, reject) {
    try {
      
      //(new Date()).toISOString().split('T')[0]
      let storage = req.body.storage || ""
      let brand = req.body.brand || ""
      let product_name = req.body.product_name
      let product_code = req.body.product_code
      let unit_per_carton = req.body.unit_per_carton
      let pack_qty = req.body.pack_qty
      let carton_desc = req.body.carton_desc || ""
      let serves_per_carton = req.body.serves_per_carton || 0
      let pack_desc = req.body.pack_desc
      let serves_per_pack = req.body.serves_per_pack || 0
      let serve_desc = req.body.serve_desc || ""
      let shelf_life = req.body.shelf_life || ""
      let receival_shelf_life = req.body.receival_shelf_life || ""
      let product_expiry = req.body.product_expiry || null
      let product_mfg = req.body.product_mfg || null
      let supplier_code = req.body.supplier_code
      let dang_good_code = req.body.dang_good_code || ""
      let apn = req.body.apn || ""
      let tun_no = req.body.tun_no || ""
      let carton_height = req.body.carton_height || 0
      let width = req.body.width || 0
      let length = req.body.length || 0
      let cnts_per_layer = req.body.cnts_per_layer || ""
      let layers_per_pallet = req.body.layers_per_pallet || ""
      let total_cnts_per_pallet = req.body.total_cnts_per_pallet || ""
      let carton_weight = req.body.carton_weight || 0
      let product_spec_sheet = req.body.product_spec_sheet || ""
      let safety_data_sheet = req.body.safety_data_sheet || ""
      let product_image1 = req.body.product_image1 || ""
      let product_image2 = req.body.product_image2 || ""
      let product_image3 = req.body.product_image3 || ""
      let product_image4 = req.body.product_image4 || ""
      let product_desc = req.body.product_desc || ""
      let product_alter_name = req.body.product_alter_name || ""
      let country_origin = req.body.country_origin || ""
      let aus_ingredients = req.body.aus_ingredients || ""
      let dietary = req.body.dietary || ""
      let allergen = req.body.allergen || ""
      let meat_blood_line = req.body.meat_blood_line || ""
      let meat_bread = req.body.meat_bread || ""
      let meat_region = req.body.meat_region || ""
      let meat_state = req.body.meat_state || ""
      let meat_grade = req.body.meat_grade || ""
      let meat_marble_score = req.body.meat_marble_score || ""
      let meat_feed_type = req.body.meat_feed_type || ""
      let meat_ham_no = req.body.meat_ham_no || ""
      let meat_cut_type = req.body.meat_cut_type || ""
      let meat_portion_cut = req.body.meat_portion_cut || ""
      let meat_whole_cut = req.body.meat_whole_cut || ""
      let meat_other = req.body.meat_other || ""
      let seafood_species = req.body.seafood_species || ""
      let seafood_sub_species = req.body.seafood_sub_species || ""
      let seafoos_region = req.body.seafoos_region || ""
      let seafoos_state = req.body.seafoos_state || ""
      let seafoos_grade = req.body.seafoos_grade || ""
      let seafood_produced = req.body.seafood_produced || ""
      let seafood_preparation = req.body.seafood_preparation || ""
      let seafood_env = req.body.seafood_env || ""
      let seafood_cut_type = req.body.seafood_cut_type || ""
      let seafood_appearance = req.body.seafood_appearance || ""
      let seafood_packagaing = req.body.seafood_packagaing || ""
      let seafood_other = req.body.seafood_other || ""
      let delivery_lead_time = req.body.delivery_lead_time || ""
      let vendor_moq = req.body.vendor_moq || ""
      let x_factory_gate_cost_ex_gst = req.body.x_factory_gate_cost_ex_gst || 0
      let landed_gate_cost_gst = req.body.landed_gate_cost_gst || 0
      let representative_name = req.body.representative_name || ""
      let product_date = req.body.product_date || null

      let query = `INSERT INTO public.products_tbl(
        product_code,storage, brand, product_name, unit_per_carton, pack_qty, carton_desc, serves_per_carton, pack_desc, serves_per_pack, serve_desc, shelf_life, receival_shelf_life, product_expiry, product_mfg, supplier_code, dang_good_code, apn, tun_no, carton_height, carton_width, carton_length, cnts_per_layer, layers_per_pallet, total_cnts_per_pallet, carton_weight, product_spec_sheet, safety_data_sheet, product_image1, product_image2, product_image3, product_image4, product_desc, product_alter_name, country_origin, aus_ingredients, dietary, allergen, meat_blood_line, meat_bread, meat_region, meat_state, meat_grade, meat_marble_score, meat_feed_type, meat_ham_no, meat_cut_type, meat_portion_cut, meat_whole_cut, meat_other, seafood_species, seafood_sub_species, seafoos_region, seafoos_state, seafoos_grade, seafood_produced, seafood_preparation, seafood_env, seafood_cut_type, seafood_appearance, seafood_packagaing, seafood_other, delivery_lead_time, vendor_moq, x_factory_gate_cost_ex_gst, landed_gate_cost_gst, representative_name, product_date, creation_dt,createdby)
        VALUES (
          '${product_code}',
          '${storage}',
          '${brand}',
          '${product_name}',
          ${unit_per_carton},
          ${pack_qty},
          '${carton_desc}',
          ${serves_per_carton},
          '${pack_desc}',
          ${serves_per_pack},
          '${serve_desc}',
          '${shelf_life}',
          '${receival_shelf_life}',
          '${product_expiry}',
          '${product_mfg}',
          '${supplier_code}',
          '${dang_good_code}',
          '${apn}',
          '${tun_no}',
          ${carton_height},
          ${width},
          ${length},
          '${cnts_per_layer}',
          '${layers_per_pallet}',
          '${total_cnts_per_pallet}',
          ${carton_weight},
          '${product_spec_sheet}',
          '${safety_data_sheet}',
          '${product_image1}',
          '${product_image2}',
          '${product_image3}',
          '${product_image4}',
          '${product_desc}',
          '${product_alter_name}',
          '${country_origin}',
          '${aus_ingredients}',
          '${dietary}',
          '${allergen}',
          '${meat_blood_line}',
          '${meat_bread}',
          '${meat_region}',
          '${meat_state}',
          '${meat_grade}',
          '${meat_marble_score}',
          '${meat_feed_type}',
          '${meat_ham_no}',
          '${meat_cut_type}',
          '${meat_portion_cut}',
          '${meat_whole_cut}',
          '${meat_other}',
          '${seafood_species}',
          '${seafood_sub_species}',
          '${seafoos_region}',
          '${seafoos_state}',
          '${seafoos_grade}',
          '${seafood_produced}',
          '${seafood_preparation}',
          '${seafood_env}',
          '${seafood_cut_type}',
          '${seafood_appearance}',
          '${seafood_packagaing}',
          '${seafood_other}',
          '${delivery_lead_time}',
          '${vendor_moq}',
          ${x_factory_gate_cost_ex_gst},
          ${landed_gate_cost_gst},
          '${representative_name}',
          ${product_date},
          now(),
          ${req.user.id}
        ) returning id;`;
      let result = await pool.executeQuery(query, [])
      resolve({
        status: result.rows[0].id != undefined ? true : false,
        id: result.rows[0].id
      })
    } catch (error) {
      reject(error);
    }
  })
}

async function updateProduct(req) {
  return new Promise(async function (resolve, reject) {
    try {
      //(new Date()).toISOString().split('T')[0]
      let storage = req.body.storage || ""
      let brand = req.body.brand || ""
      let product_name = req.body.product_name
      let product_code = req.body.product_code
      let unit_per_carton = req.body.unit_per_carton
      let pack_qty = req.body.pack_qty
      let carton_desc = req.body.carton_desc || ""
      let serves_per_carton = req.body.serves_per_carton || 0
      let pack_desc = req.body.pack_desc
      let serves_per_pack = req.body.serves_per_pack || 0
      let serve_desc = req.body.serve_desc || ""
      let shelf_life = req.body.shelf_life || ""
      let receival_shelf_life = req.body.receival_shelf_life || ""
      let product_expiry = req.body.product_expiry || null
      let product_mfg = req.body.product_mfg || null
      let supplier_code = req.body.supplier_code
      let dang_good_code = req.body.dang_good_code || ""
      let apn = req.body.apn || ""
      let tun_no = req.body.tun_no || ""
      let carton_height = req.body.carton_height || 0
      let width = req.body.width || 0
      let length = req.body.length || 0
      let cnts_per_layer = req.body.cnts_per_layer || ""
      let layers_per_pallet = req.body.layers_per_pallet || ""
      let total_cnts_per_pallet = req.body.total_cnts_per_pallet || ""
      let carton_weight = req.body.carton_weight || 0
      let product_spec_sheet = req.body.product_spec_sheet || ""
      let safety_data_sheet = req.body.safety_data_sheet || ""
      let product_image1 = req.body.product_image1 || ""
      let product_image2 = req.body.product_image2 || ""
      let product_image3 = req.body.product_image3 || ""
      let product_image4 = req.body.product_image4 || ""
      let product_desc = req.body.product_desc || ""
      let product_alter_name = req.body.product_alter_name || ""
      let country_origin = req.body.country_origin || ""
      let aus_ingredients = req.body.aus_ingredients || ""
      let dietary = req.body.dietary || ""
      let allergen = req.body.allergen || ""
      let meat_blood_line = req.body.meat_blood_line || ""
      let meat_bread = req.body.meat_bread || ""
      let meat_region = req.body.meat_region || ""
      let meat_state = req.body.meat_state || ""
      let meat_grade = req.body.meat_grade || ""
      let meat_marble_score = req.body.meat_marble_score || ""
      let meat_feed_type = req.body.meat_feed_type || ""
      let meat_ham_no = req.body.meat_ham_no || ""
      let meat_cut_type = req.body.meat_cut_type || ""
      let meat_portion_cut = req.body.meat_portion_cut || ""
      let meat_whole_cut = req.body.meat_whole_cut || ""
      let meat_other = req.body.meat_other || ""
      let seafood_species = req.body.seafood_species || ""
      let seafood_sub_species = req.body.seafood_sub_species || ""
      let seafoos_region = req.body.seafoos_region || ""
      let seafoos_state = req.body.seafoos_state || ""
      let seafoos_grade = req.body.seafoos_grade || ""
      let seafood_produced = req.body.seafood_produced || ""
      let seafood_preparation = req.body.seafood_preparation || ""
      let seafood_env = req.body.seafood_env || ""
      let seafood_cut_type = req.body.seafood_cut_type || ""
      let seafood_appearance = req.body.seafood_appearance || ""
      let seafood_packagaing = req.body.seafood_packagaing || ""
      let seafood_other = req.body.seafood_other || ""
      let delivery_lead_time = req.body.delivery_lead_time || ""
      let vendor_moq = req.body.vendor_moq || ""
      let x_factory_gate_cost_ex_gst = req.body.x_factory_gate_cost_ex_gst || 0
      let landed_gate_cost_gst = req.body.landed_gate_cost_gst || 0
      let representative_name = req.body.representative_name || ""
      let product_date = req.body.product_date || null

      let query = `UPDATE public.products_tbl set
      storage =	'${storage}',
      brand =	'${brand}',
      product_name =	'${product_name}',
      product_code =	'${product_code}',
      unit_per_carton =	${unit_per_carton},
      pack_qty =	${pack_qty},
      carton_desc =	'${carton_desc}',
      serves_per_carton =	${serves_per_carton},
      pack_desc =	'${pack_desc}',
      serves_per_pack =	${serves_per_pack},
      serve_desc =	'${serve_desc}',
      shelf_life =	'${shelf_life}',
      receival_shelf_life =	'${receival_shelf_life}',
      product_expiry =	'${product_expiry}',
      product_mfg =	'${product_mfg}',
      supplier_code =	'${supplier_code}',
      dang_good_code =	'${dang_good_code}',
      apn =	'${apn}',
      tun_no =	'${tun_no}',
      carton_height =	${carton_height},
      carton_width =	${width},
      carton_length =	${length},
      cnts_per_layer =	'${cnts_per_layer}',
      layers_per_pallet =	'${layers_per_pallet}',
      total_cnts_per_pallet =	'${total_cnts_per_pallet}',
      carton_weight =	${carton_weight},
      product_spec_sheet =	'${product_spec_sheet}',
      safety_data_sheet =	'${safety_data_sheet}',
      product_image1 =	'${product_image1}',
      product_image2 =	'${product_image2}',
      product_image3 =	'${product_image3}',
      product_image4 =	'${product_image4}',
      product_desc =	'${product_desc}',
      product_alter_name =	'${product_alter_name}',
      country_origin =	'${country_origin}',
      aus_ingredients =	'${aus_ingredients}',
      dietary =	'${dietary}',
      allergen =	'${allergen}',
      meat_blood_line =	'${meat_blood_line}',
      meat_bread =	'${meat_bread}',
      meat_region =	'${meat_region}',
      meat_state =	'${meat_state}',
      meat_grade =	'${meat_grade}',
      meat_marble_score =	'${meat_marble_score}',
      meat_feed_type =	'${meat_feed_type}',
      meat_ham_no =	'${meat_ham_no}',
      meat_cut_type =	'${meat_cut_type}',
      meat_portion_cut =	'${meat_portion_cut}',
      meat_whole_cut =	'${meat_whole_cut}',
      meat_other =	'${meat_other}',
      seafood_species =	'${seafood_species}',
      seafood_sub_species =	'${seafood_sub_species}',
      seafoos_region =	'${seafoos_region}',
      seafoos_state =	'${seafoos_state}',
      seafoos_grade =	'${seafoos_grade}',
      seafood_produced =	'${seafood_produced}',
      seafood_preparation =	'${seafood_preparation}',
      seafood_env =	'${seafood_env}',
      seafood_cut_type =	'${seafood_cut_type}',
      seafood_appearance =	'${seafood_appearance}',
      seafood_packagaing =	'${seafood_packagaing}',
      seafood_other =	'${seafood_other}',
      delivery_lead_time =	'${delivery_lead_time}',
      vendor_moq =	'${vendor_moq}',
      x_factory_gate_cost_ex_gst =	${x_factory_gate_cost_ex_gst},
      landed_gate_cost_gst =	${landed_gate_cost_gst},
      representative_name =	'${representative_name}',
      product_date =	${product_date},
      updatedby =	${req.user.id}
      where product_code='${product_code}';`;
      let result = await pool.executeQuery(query, [])
      resolve({
        status: true,
        id: product_code
      })
    } catch (error) {
      reject(error);
    }
  })
}

async function getsubCategoryList(req) {
  return new Promise(async function (resolve, reject) {
    try {

      //let query = `select scat_id,scid,scat_name,null as scat_img from product_sub_category`;
      let query = `select id as scat_id,groupno as scid,groupname as scat_name,null as scat_img from public.myob_stock_group2`;
      let result = await pool.executeQueryWithMsg(query, [], 'No records available.')
      query = `select count(scat_id) as cnt from product_sub_category`;
      let countResult = await pool.executeQuery(query, []);
      resolve({
        status_code: 200,
        status_message: "success",
        data: {
          total_count: parseInt(countResult.rows[0].cnt),
          result: result
        }
      })
    } catch (error) {
      reject(error);
    }
  })
}

async function getcategoryList(req) {
  return new Promise(async function (resolve, reject) {
    try {

      //let query = `select cat_id,cid,cat_name,null as cat_img from product_category`;
      let query = `select id as cat_id,groupno as cid,groupname as cat_name,null as cat_img from public.myob_stockgroups`;
      let result = await pool.executeQueryWithMsg(query, [], 'No records available.')
      query = `select count(cat_id) as cnt from product_category`;
      let countResult = await pool.executeQuery(query, []);
      resolve({
        status_code: 200,
        status_message: "success",
        data: {
          total_count: parseInt(countResult.rows[0].cnt),
          result: result
        }
      })
    } catch (error) {
      reject(error);
    }
  })
}

async function getFiltersList(req) {
  return new Promise(async function (resolve, reject) {
    try {

      let query = `select * from search_filter where parent_filter_id=0`;
      let result = await pool.executeQueryWithMsg(query, [], 'No records available.')
      query = `select filter_id,filter_name,parent_filter_id from search_filter where parent_filter_id!=0`;
      let subResult = await pool.executeQuery(query, [])
      let data = [];

      for (let [count, row] of result.entries()) {
        let d = {}
        d['key'] = row.filter_name;
        d['value'] = [];
        for (let [c, r] of subResult.rows.entries()) {
          if (row.filter_id == r.parent_filter_id) {
            d['value'].push({
              filter_id: r.filter_id,
              filter_name: r.filter_name
            });
          }
        }
        data.push(d)
      }
      resolve({
        status_code: 200,
        status_message: "success",
        data: {
          total_count: data.length,
          result: data
        }
      })
    } catch (error) {
      reject(error);
    }
  })
}



exports.validateAddProduct = validateAddProduct
exports.validateEditProduct = validateEditProduct
exports.validateAddStockItems = validateAddStockItems
exports.validateEditStockItems = validateEditStockItems
exports.insertStockItems = insertStockItems
exports.insertProduct = insertProduct
exports.updateStockItems = updateStockItems
exports.updateProduct = updateProduct
exports.getcategoryList = getcategoryList
exports.getsubCategoryList = getsubCategoryList
exports.getFiltersList = getFiltersList
exports.insertStockItemsBySupplier = insertStockItemsBySupplier
exports.updateStockItemsBySupplier = updateStockItemsBySupplier