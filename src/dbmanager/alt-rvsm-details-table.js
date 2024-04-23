/* eslint-disable */
// import SQLite from 'react-native-sqlite-storage';

import { localDB } from './dbconstants';
import {openDatabase, enablePromise} from 'react-native-sqlite-storage';
enablePromise(true)

const getDBConnection = async () => {
    let db = openDatabase(
      
      {name: 'Database.db', location: 'default'},
      success => {
        console.log('Databases connected');
      },
      error => {
        console.log('Error in Database connection');
      },
      
    );
    return db;
  };
  enablePromise(true);
/**
 * 
 */
export const onCreateAltFlightRVSMTable =async () => {
    console.log('called onCreateAltFlightRVSMTable');
    const db =await  getDBConnection();
    console.log('db',db)
    const promise = new Promise((resolve, reject) => {
        db.transaction((txn) => {
            txn.executeSql(`DROP TABLE IF EXISTS ${localDB.tableName.altFlightRVSMTable}`, []);
            txn.executeSql(`CREATE TABLE IF NOT EXISTS ${localDB.tableName.altFlightRVSMTable} (EmployeeCode TEXT, FlightNumber TEXT,Sector TEXT, Time Text,ALT1 TEXT, STBYALT TEXT, ALT2 TEXT, isPushed TEXT)`,
                [],
                (_, result) => {
// console.log('result needed',result)
                    console.log("onCreateAltFlightRVSMTable successful");
                    resolve("onCreateAltFlightRVSMTable successful");

                },
                (_, err) => {
                    // console.log('result needed',err)
                    console.log('onCreateAltFlightRVSMTable,err', err);
                    reject(err);
                }
            );
        });
    });
    return promise;
};

/**
 * 
 * @param {*} altFlightRVSMData 
 */
export const onInsertAltFlightRVSMData =async (altFlightRVSMData) => {

    console.log('onInsertAltFlightRVSMData altFlightRVSMData', altFlightRVSMData)
    const db =await  getDBConnection();
    if (altFlightRVSMData.length == 0) {
        return;
    }

    const promise = new Promise((resolve, reject) => {
        let len = altFlightRVSMData.length;
        for (let i = 0; i < len; i++) {
            const { FlightNumber,Sector,Time, ALT1, STBYALT, ALT2,isPushed } = altFlightRVSMData[i];
            db.transaction((txn) => {
                txn.executeSql(`INSERT INTO ${localDB.tableName.altFlightRVSMTable} (EmployeeCode,FlightNumber,Sector,Time, ALT1, STBYALT, ALT2, isPushed) VALUES (?,?,?,?,?,?,?,?)`,
                    [ global.userName, FlightNumber,Sector,Time, ALT1, STBYALT, ALT2,isPushed],
                    (_, results) => {
                        console.log('onInsertAltFlightRVSMData, results', results);
                        resolve('onInsertAltFlightRVSMData insert success');
                    },
                    (_, err) => {
                        console.log('onInsertAltFlightRVSMData, err', err);
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
export const onFetchAltFlightRVSMData = async(sqlQuery) => {
    const db =await getDBConnection();
    if (sqlQuery == undefined) {
        sqlQuery = `SELECT * FROM ${localDB.tableName.altFlightRVSMTable}`;
    }

    let altFlightRVSMData = [];
    const promise = new Promise((resolve, reject) => {
        db.transaction(txn => {
            txn.executeSql(sqlQuery, [],
                (_, results) => {
                    var len = results.rows.length;
                    console.log(`There are ${len} records in the altFlightRVSMTable`);
                    for (i = 0; i < len; i++) {
                        altFlightRVSMData.push(results.rows.item(i));
                    }
                    if (len == 0) {
                        console.log('nothing to show in altFlightRVSMTable');
                    }
                    resolve(altFlightRVSMData);
                },
                (_, err) => {
                    console.log('nothing to show in altFlightRVSMTable');
                    reject(err);
                });
        });
    });
    return promise;
}

/**
 * 
 * @param {*} altFlightRVSMData 
 */
export const onUpdateAltFlightRVSMDetails = async(altFlightRVSMData) => {

    console.log('onUpdateAltFlightRVSMDetails obj ==', altFlightRVSMData);
    const db =await getDBConnection();
    const promise = new Promise((resolve, reject) => {
        let len = altFlightRVSMData.length;
        const { FlightNumber, ALT1, STBYALT, ALT2,isPushed} = altFlightRVSMData;
        console.log(FlightNumber, ALT1, STBYALT, ALT2);

        db.transaction((txn) => {
            txn.executeSql(`UPDATE ${localDB.tableName.altFlightRVSMTable} SET ALT1=?, STBYALT=?, ALT2=?,isPushed=?  WHERE FlightNumber='${FlightNumber}'`,
                [ALT1, STBYALT, ALT2,isPushed],
                (_, results) => {
                    console.log('altFlightRVSMTable, update success', results);
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