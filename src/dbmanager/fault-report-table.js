/* eslint-disable */
import SQLite from 'react-native-sqlite-storage';
// import { openDatabase } from 'react-native-sqlite-storage';
import { localDB } from './dbconstants';

const db = SQLite.openDatabase({ name: localDB.dbName });

/**
 * Create fault report table
 */
export const onCreateFaultReportTable = () => {
    console.log('called onCreateFaultReportTable');

    const promise = new Promise((resolve, reject) => {
        db.transaction((txn) => {
            txn.executeSql(`DROP TABLE IF EXISTS ${localDB.tableName.faultReportTable}`, []);
            txn.executeSql(`CREATE TABLE IF NOT EXISTS ${localDB.tableName.faultReportTable} (EmployeeCode TEXT, FlightNumber TEXT, SystemValue TEXT, ObservationValue TEXT, RemarksValue TEXT)`,
                [],
                (_, result) => {

                    console.log("onCreateFaultReportTable successful");
                    resolve("onCreateFaultReportTable successful");

                },
                (_, err) => {

                    console.log('onCreateFaultReportTable,err', err);
                    reject(err);
                }
            );
        });
    });
    return promise;
};

/**
 * 
 *Insert into fault report table
 */
export const onInsertFaultReportData = (faultReportData) => {

    console.log('onInsertFaultReportData faultReportData', faultReportData)

    if (faultReportData.length == 0) {
        return;
    }

    const promise = new Promise((resolve, reject) => {
        let len = faultReportData.length;
        for (let i = 0; i < len; i++) {
            const { FlightNumber, SystemValue, ObservationValue, RemarksValue } = faultReportData[i];


            db.transaction((txn) => {
                txn.executeSql(`INSERT INTO ${localDB.tableName.faultReportTable} (EmployeeCode,FlightNumber, SystemValue, ObservationValue, RemarksValue) VALUES (?,?,?,?,?)`,
                    [global.userID._W, FlightNumber, SystemValue, ObservationValue, RemarksValue],
                    (_, results) => {
                        console.log('faultReportTable, results', results);
                        resolve('onInsertFaultReportData insert success');
                    },
                    (_, err) => {
                        console.log('faultReportTable, err', err);
                        reject(err);
                    });
            });
        }
    });
    return promise;
};

/**
 *Fetch from fault report table 
 */
export const onFetchFaultReportData = (sqlQuery) => {

    if (sqlQuery == undefined) {
        sqlQuery = `SELECT * FROM ${localDB.tableName.faultReportTable}`;
    }

    let faultReportData = [];
    const promise = new Promise((resolve, reject) => {
        db.transaction(txn => {
            txn.executeSql(sqlQuery, [],
                (_, results) => {
                    var len = results.rows.length;
                    console.log(`There are ${len} records in the faultReportTable`);
                    for (i = 0; i < len; i++) {
                        faultReportData.push(results.rows.item(i));
                    }
                    if (len == 0) {
                        console.log('nothing to show in faultReportTable');
                    }
                    resolve(faultReportData);
                },
                (_, err) => {
                    console.log('nothing to show in faultReportTable');
                    reject(err);
                });
        });
    });
    return promise;
}

/**
 * 
 * Update into fault report table 
 */
export const onUpdateFaultReportDetails = (faultReportData) => {

    //TODO - do not use for loop to update the vlaues, bcz only latest will be updated in the loop
    console.log('onUpdateFaultReportDetails obj ==', faultReportData);

    const promise = new Promise((resolve, reject) => {
        let len = faultReportData.length;
        const { FlightNumber, SystemValue, ObservationValue, RemarksValue } = faultReportData;
        console.log(FlightNumber, SystemValue, ObservationValue, RemarksValue);

        db.transaction((txn) => {
            txn.executeSql(`UPDATE ${localDB.tableName.faultReportTable} SET SystemValue=?, ObservationValue=?, RemarksValue=? WHERE FlightNumber='${FlightNumber}'`,
                [SystemValue, ObservationValue, RemarksValue],
                (_, results) => {
                    console.log('faultReportTable, update success', results);
                    resolve('faultReportTable update success');
                },
                (_, err) => {
                    console.log('faultReportTable, update error', err);
                    reject(err);
                });
        });
    });

    return promise;
}

/**
 * Delete from fault report table 
 */
export const onDeleteFaultReportDetails = (FlightNumber) => {

    const promise = new Promise((resolve, reject) => {
        db.transaction((txn) => {
            txn.executeSql(`DELETE FROM ${localDB.tableName.faultReportTable} WHERE FlightNumber='${FlightNumber}'`,
                [],
                (_, results) => {
                    console.log('faultReportTable, delete success', results);
                    resolve('faultReportTable delete success');
                },
                (_, err) => {
                    console.log('faultReportTable,delete update error', err);
                    reject(err);
                });
        });
    });

    return promise;

}