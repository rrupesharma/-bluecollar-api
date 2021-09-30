const customerJob = require('../triggerjob/customer.job');
const supplierJob = require('../triggerjob/supplierr.job');
const stockJob = require('../triggerjob/stock.job');
const salesJob = require('../triggerjob/sales.job');
const { startDynamicCronJob } = require('../triggerjob/dynamicCron.job');
const priceJob = require('../triggerjob/price.job');
const { pool } = require('./pgconnection');
const { sysErrorLog } = require('../helpers/utils');

async function executeTrigger() {
    let events = ['myob_dr_accs_upsert', 'myob_stockitems_upsert', 'myob_cron_notify', 'myob_stockclassification_upsert', 'myob_pricepolicy_upsert', 'myob_pricepolicyacc_upsert', 'myob_stockgroups_upsert', 'myob_stock_group2_upsert', 'myob_salesorder_upsert', 'myob_salesorderline_upsert', 'sf_salesorder_upsert', 'sf_salesorderline_upsert', 'sf_stockitems_upsert', 'sf_account_upsert', 'myob_cr_accs_upsert'];
    let client = null;
    try {
        client = await pool.connect();
        await client.query(`LISTEN ${events[0]};LISTEN ${events[1]};LISTEN ${events[2]};LISTEN ${events[3]};LISTEN ${events[4]};LISTEN ${events[5]};LISTEN ${events[6]};LISTEN ${events[7]};LISTEN ${events[8]};LISTEN ${events[9]};LISTEN ${events[10]};LISTEN ${events[11]};LISTEN ${events[12]};LISTEN ${events[13]};LISTEN ${events[14]}`);
        client.on('notification', function(data) {
            const payload = JSON.parse(data["payload"]);
            console.log("listen channel name: ", data['channel']);
            if(data['channel'] === events[0]) {
                customerJob.syncAccountToSF(payload);
            } else if(data['channel'] === events[1]) {
                stockJob.syncStockItemsToSF(payload);
            } else if(data['channel'] === events[2]) {
                startDynamicCronJob(payload);
            } else if(data['channel'] === events[3]) {
                stockJob.syncStockClassificationToSF(payload);
            } else if(data['channel'] === events[4]) {
                priceJob.syncPricePolicyToSF(payload);
            } else if(data['channel'] === events[5]) {
                priceJob.syncPricePolicyAccToSF(payload);
            } else if(data['channel'] === events[6]) {
                stockJob.syncStockPrimaryGroupToSF(payload);
            } else if(data['channel'] === events[7]) {
                stockJob.syncStockSecondaryGroupToSF(payload);
            } else if(data['channel'] === events[8]) {
                salesJob.syncSalesOrderToSF(payload);
            } else if(data['channel'] === events[9]) {
                salesJob.syncSalesOrderItemToSF(payload);
            } else if(data['channel'] === events[10]) {
                salesJob.syncSalesOrderToPublic(payload);
            } else if(data['channel'] === events[11]) {
                salesJob.syncSalesOrderItemToPublic(payload);
            } else if(data['channel'] === events[12]) {
                stockJob.syncStockItemsToMyPublic(payload);
            } else if(data['channel'] === events[13]) {
                customerJob.syncAccountToPublic(payload);
            } else if(data['channel'] === events[14]) {
                supplierJob.syncSupplierToSF(payload);
            }
            
            // console.log('row added!', payload);
        });
    } catch (err) {
        console.log("catch.error: ", err);
        sysErrorLog(err, __filename.slice(__dirname.length + 1), true);
    }
}

// async function executeTrigger() {
//     salesJob.update();
// }

exports.executeTrigger = executeTrigger
