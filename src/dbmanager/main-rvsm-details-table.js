/* eslint-disable */

import {openDatabase,enablePromise} from 'react-native-sqlite-storage';
import {localDB } from './dbconstants';

enablePromise(true);
const getDBConnection = async () => {
    let db = openDatabase({name: 'Database.db', location:'default'},
      success => {
        console.log('Databases connected');
      },
      error => {
        console.log('Error in Database connection');
      },
      
    );
    return db;
  }  
/**
 * 
 */
export const onCreateMainRVSMTable = async() => {
    console.log('called onCreateMainRVSMTable', global.userName);
    const db =await getDBConnection();
    const promise = new Promise((resolve, reject) => {
        db.transaction((txn) => {
            txn.executeSql(`DROP TABLE IF EXISTS ${localDB.tableName.mainFlightRVSMTable}`, []);
            txn.executeSql(`CREATE TABLE IF NOT EXISTS ${localDB.tableName.mainFlightRVSMTable} (EmployeeCode TEXT, FlightNumber TEXT,Sector TEXT, Time Text,ALT1 TEXT, STBYALT TEXT, ALT2 TEXT,isPushed)`,
                [],
                (_, result) => {

                    console.log("onCreateMainRVSMTable successful");
                    resolve("onCreateMainRVSMTable successful");

                },
                (_, err) => {

                    console.log('onCreateMainRVSMTable,err', err);
                    reject(err);
                }
            );
        });
    });
    return promise;
};

/**
 * 
 * @param {*} mainFlightRVSMData 
 */
export const onInsertMainRVSMData =async (mainFlightRVSMData) => {

    console.log('onInsertMainRVSMData mainFlightRVSMData', mainFlightRVSMData)
    const db =await  getDBConnection();
    if (mainFlightRVSMData.length == 0) {
        return;
    }

    const promise = new Promise((resolve, reject) => {
        let len = mainFlightRVSMData.length;
        for (let i = 0; i < len; i++) {
            const { FlightNumber, ALT1, STBYALT, ALT2 ,Sector,Time} = mainFlightRVSMData[i];
            db.transaction((txn) => {
                txn.executeSql(`INSERT INTO ${localDB.tableName.mainFlightRVSMTable} (EmployeeCode,FlightNumber,Sector,Time, ALT1, STBYALT, ALT2,isPushed) VALUES (?,?,?,?,?,?,?,?)`,
                    [ global.userName, FlightNumber,Sector,Time, ALT1, STBYALT, ALT2,0],
                    (_, results) => {
                        console.log('onInsertMainRVSMData, results', results);
                        resolve('onInsertMainRVSMData insert success');
                    },
                    (_, err) => {
                        console.log('onInsertMainRVSMData, err', err);
                        reject(err);
                    });
            });
        }
    });
    return promise;
};

/**
 * 
 */
export const onFetchMainRVSMData = async(sqlQuery) => {
    const db =await getDBConnection();
    if (sqlQuery == undefined) {
        sqlQuery = `SELECT * FROM ${localDB.tableName.mainFlightRVSMTable}`;
    }

    let mainFlightRVSMData = [];
    const promise = new Promise((resolve, reject) => {
        db.transaction(txn => {
            txn.executeSql(sqlQuery, [],
                (_, results) => {
                    var len = results.rows.length;
                    console.log(`There are ${len} records in the mainFlightRVSMTable`);
                    for (i = 0; i < len; i++) {
                        mainFlightRVSMData.push(results.rows.item(i));
                    }
                    if (len == 0) {
                        console.log('nothing to show in mainFlightRVSMTable');
                    }
                    resolve(mainFlightRVSMData);
                },
                (_, err) => {
                    console.log('nothing to show in mainFlightRVSMTable');
                    reject(err);
                });
        });
    });
    return promise;
}

/**
 * 
 * @param {*} mainFlightRVSMData 
 */
export const onUpdateMainFlightRVSMDetails = async(mainFlightRVSMData) => {

    console.log('onUpdateMainFlightRVSMDetails obj ==', mainFlightRVSMData);
    const db =await getDBConnection();
    const promise = new Promise((resolve, reject) => {
        const { FlightNumber, ALT1, STBYALT, ALT2,isPushed } = mainFlightRVSMData;
       

        db.transaction((txn) => {
            txn.executeSql(`UPDATE ${localDB.tableName.mainFlightRVSMTable} SET ALT1=?, STBYALT=?, ALT2=?,isPushed=? WHERE FlightNumber='${FlightNumber}'`,
                [ALT1,STBYALT, ALT2,isPushed],
                (_, results) => {
                    console.log('mainFlightRVSMTable, update success', results);
                    resolve('update success');
                },
                (_, err) => {
                    console.log('mainFlightRVSMTable, update error', err);
                    reject(err);
                });
        });
    });

    return promise;
}

/**
 * 
 */
export const onDeleteFlightDetails = (FlightNumber) => {

    const promise = new Promise((resolve, reject) => {
        db.transaction((txn) => {
            txn.executeSql(`DELETE FROM ${localDB.tableName.mainFlightPlanTable} WHERE FlightNumber='${FlightNumber}'`,
                [],
                (_, results) => {
                    console.log('mainFlightPlanTable, delete success', results);
                    resolve('mainFlightPlanTable delete success');
                },
                (_, err) => {
                    console.log('mainFlightPlanTable,delete update error', err);
                    reject(err);
                });
        });
    });

    return promise;

}