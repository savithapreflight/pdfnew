/* eslint-disable */

import {openDatabase,enablePromise} from 'react-native-sqlite-storage';
import {localDB} from './dbconstants';


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

export const onCreateMainFlightDetailsTable = async() => {
  console.log('called onCreateMainFlightDetailsTable');
  const db =await  getDBConnection();
  console.log('db',db)
  const promise = new Promise((resolve, reject) => {
      db.transaction((txn) => {
          txn.executeSql(`DROP TABLE IF EXISTS ${localDB.tableName.mainFlightPlanTable1}`, []);
          txn.executeSql(`CREATE TABLE IF NOT EXISTS ${localDB.tableName.mainFlightPlanTable1} (EmployeeCode TEXT, FlightNumber TEXT,Sector TEXT, Status TEXT, ApproachTime TEXT, ApproachFuel TEXT, TaxiFuel TEXT, WPT TEXT,MORA TEXT,TRK TEXT,FL TEXT,WV TEXT,IAS TEXT,EET TEXT,EFB TEXT,GWT TEXT,LAT TEXT,LON TEXT,TAS TEXT,OAT TEXT,DST TEXT,FRE TEXT,AWY TEXT,MK TEXT,MH TEXT,GS TEXT,TDV TEXT,DRM TEXT,TRMG TEXT,TTLB TEXT,RQF TEXT,AFL TEXT,AWND TEXT,WC TEXT,AD TEXT,ATA TEXT,ETA TEXT,DISC TEXT,isPushed TEXT,Remarks TEXT,isUpdated TEXT)`,
              [],
              (_, result) => {

                  console.log("onCreateMainFlightDetailsTable successful");
                  resolve("onCreateMainFlightDetailsTable successful");

              },
              (_, err) => {

                  console.log('onCreateMainFlightDetailsTable,err', err);
                  reject(err);
              }
          );
      });
  });
  return promise;
};
/**
 *
 * @param {*} mainFlightData
 */

 export const onInsertMainFlightDetailsData = async (mainFlightData) => {
  const db =await  getDBConnection();
  console.log('db',db)
  const len = mainFlightData.length;

      for (let i = 0; i < len; i++) {
  const {
             FlightNumber,
             Sector,
             Status,
             ApproachTime,
             ApproachFuel,
             TaxiFuel,
             WPT,
             MORA,
             TRK,
             FL,
             WV,
             IAS,
             EET,
             EFB,
             GWT,
             LAT,
            LON,
             TAS,
             OAT,
            DST,
             FRE,
             AWY,
           MK,
             MH,
           GS,
             TDV,
             DRM,
             TRMG,
             TTLB,
             RQF,
             AFL,
             AWND,
             WC,
             AD,
             ATA,
             ETA,
             DISC
          } = mainFlightData[i];
         
  const  promise= await new Promise((resolve, reject) => {
      db.transaction(txn => {
        txn.executeSql(`INSERT INTO ${localDB.tableName.mainFlightPlanTable1} (EmployeeCode,FlightNumber,Sector,Status,ApproachTime,ApproachFuel,TaxiFuel,WPT,MORA,TRK,FL,WV,IAS,EET,EFB,GWT,LAT,LON,TAS,OAT,DST,FRE,AWY,MK,MH,GS,TDV,DRM,TRMG,TTLB,RQF, AFL,
          AWND,
          WC,
          AD,
          ATA,
          ETA,
          DISC,isPushed,Remarks,isUpdated) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        
        [
          global.userName,
          FlightNumber,
          Sector,
          Status,
          ApproachTime,
          ApproachFuel,
          TaxiFuel,
          Array.isArray(WPT) ? '' : WPT,
          Array.isArray(MORA) ? '' : MORA,
          Array.isArray(TRK) ? '' : TRK,
          Array.isArray(FL) ? '' : FL,
          Array.isArray(WV) ? '' : WV,
          Array.isArray(IAS) ? '' : IAS,
          Array.isArray(EET) ? '' : EET,
          Array.isArray(EFB) ? '' : EFB,
          Array.isArray(GWT) ? '' : GWT,
          Array.isArray(LAT) ? '' : LAT,
          Array.isArray(LON) ? '' : LON,
          Array.isArray(TAS) ? '' : TAS,
          Array.isArray(OAT) ? '' : OAT,
          Array.isArray(DST) ? '' : DST,
          Array.isArray(FRE) ? '' : FRE,
          Array.isArray(AWY) ? '' : AWY,
          Array.isArray(MK) ? '' : MK,
          Array.isArray(MH) ? '' : MH,
          Array.isArray(GS) ? '' : GS,
          Array.isArray(TDV) ? '' : TDV,
          Array.isArray(DRM) ? '' : DRM,
          Array.isArray(TRMG) ? '' : TRMG,
          Array.isArray(TTLB) ? '' : TTLB,
          Array.isArray(RQF) ? '' : RQF,
          AFL,
          AWND,
          WC,
          AD,
          ATA,
          ETA,
          DISC,
          0,'',0
        ],
          (_, results) => {
            console.log('mainFlightPlanTable, results', results);
            resolve('onInsertMainFlightDetailsData insert success');
          },
          (_, err) => {
            console.log('mainFlightPlanTable, err', err);
            reject(err);
          }
        );
      });
    });
  }
 
}


export const onFetchMainFlightDetailsData =async (sqlQuery) => {

  if (sqlQuery == undefined) {
      sqlQuery = `SELECT * FROM ${localDB.tableName.mainFlightPlanTable1}`;
  }
  const db =await  getDBConnection();
  console.log('db db dbd dbd b',db)
  let mainFlightData = [];
  await new Promise((resolve, reject) => {
      db.transaction(txn => {
          txn.executeSql(sqlQuery, [],
              (_, results) => {
                  var len = results.rows.length;
                  console.log(`There are ${len} records in the mainFlightPlanTable`);
                  for (i = 0; i < len; i++) {
                      mainFlightData.push(results.rows.item(i));
                  }
                  if (len == 0) {
                      console.log('nothing to show in mainFlightPlanTable');
                  }
                  resolve(mainFlightData);
              },
              (_, err) => {
                  console.log('nothing to show in mainFlightPlanTable');
                  reject(err);
          2    });
      });
  });
 return mainFlightData
}

/**
 *
 * @param {*} mainFlightData
 */
export const onUpdateMainFlightDetails =async( mainFlightData) => {
  //TODO - do not use for loop to update the vlaues, bcz only latest will be updated in the loop
 
  const db = await getDBConnection();
  const promise = new Promise((resolve, reject) => {
    let len = mainFlightData.length;
    const {FlightNumber,Status,AFL,AWND, WC, AD, ATA, ETA, DISC,WPT,ApproachTime,isPushed,Remarks,isUpdated} =
      mainFlightData;
    console.log('nedededed dada 1',FlightNumber, Status,AWND, WC, AD, ATA, ETA, DISC,isPushed,Remarks,isUpdated);
   

    db.transaction(txn => {
      txn.executeSql(
        `UPDATE ${localDB.tableName.mainFlightPlanTable1} SET Status=?, AFL=?, AWND=?, WC=?, AD=?, ATA=?, ETA=?, DISC=?,isPushed=?,Remarks=?,isUpdated=? WHERE FlightNumber='${FlightNumber}' AND WPT='${WPT}' AND ApproachTime='${ApproachTime}'`,
        [Status,AFL,AWND,WC,AD, ATA, ETA, DISC,isPushed,Remarks,isUpdated],
        (_, results) => {
          
          resolve('update success');
        },
        (_, err) => {
          console.log('mainFlightPlanTable, update error', err);
          reject(err);
        },
      );
    });
  });

  return promise;
};

/**
 *
 */
export const onDeleteFlightDetails = async(FlightNumber) => {
  const db = await getDBConnection();
  const promise = new Promise((resolve, reject) => {
    db.transaction(txn => {
      txn.executeSql(
        `DELETE FROM ${localDB.tableName.mainFlightPlanTable1} WHERE FlightNumber='${FlightNumber}'`,
        [],
        (_, results) => {
          console.log('mainFlightPlanTable, delete success', results);
          resolve('mainFlightPlanTable delete success');
        },
        (_, err) => {
          console.log('mainFlightPlanTable,delete update error', err);
          reject(err);
        },
      );
    });
  });

  return promise;
};
export const onUpdateMainFlightDetailsNetwork =async( mainFlightData) => {
  //TODO - do not use for loop to update the vlaues, bcz only latest will be updated in the loop
 
  const db = await getDBConnection();
  const promise = new Promise((resolve, reject) => {
    let len = mainFlightData.length;
    const {FlightNumber,WPT,ApproachTime,isPushed,} =
      mainFlightData;
   
   

    db.transaction(txn => {
      txn.executeSql(
        `UPDATE ${localDB.tableName.mainFlightPlanTable1} SET isPushed=? WHERE FlightNumber='${FlightNumber}' AND WPT='${WPT}' AND ApproachTime='${ApproachTime}'`,
        [isPushed],
        (_, results) => {
          
          resolve('update success');
        },
        (_, err) => {
          console.log('mainFlightPlanTable, update error', err);
          reject(err);
        },
      );
    });
  });

  return promise;
};
