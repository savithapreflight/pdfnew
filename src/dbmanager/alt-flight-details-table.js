/* eslint-disable */
// import SQLite from 'react-native-sqlite-storage';
import {openDatabase} from 'react-native-sqlite-storage';
import {localDB} from './dbconstants';

// const db = openDatabase({ name: localDB.dbName });

/**
 *
 */
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
export const onCreateALTFlightDetailsTable = async () => {
  console.log('called onCreateALTFlightDetailsTable');
  const db = await getDBConnection();
  const promise = new Promise((resolve, reject) => {
    db.transaction(txn => {
      txn.executeSql(
        `DROP TABLE IF EXISTS ${localDB.tableName.altFlightPlanTable}`,
        [],
      );
      txn.executeSql(
        `CREATE TABLE IF NOT EXISTS ${localDB.tableName.altFlightPlanTable} (EmployeeCode TEXT,FlightNumber TEXT,Sector TEXT, Status TEXT, ApproachTime TEXT, ApproachFuel TEXT, TaxiFuel TEXT, WPT TEXT,MSA TEXT,LAT TEXT,LON TEXT,TRK TEXT,TAS TEXT,OAT TEXT,EET TEXT,EFB TEXT,DST TEXT,ST TEXT,SB TEXT,GWT TEXT,FL TEXT,WV TEXT,IAS TEXT,MH TEXT,GS TEXT,TDV TEXT,DRM TEXT,TRMG TEXT,TTLB TEXT,RQF TEXT,FRE TEXT,AWY TEXT,AFL TEXT,AWND TEXT,WC TEXT,AD TEXT,ATA TEXT,ETA TEXT,DISC TEXT,isPushed TEXT)`,
        [],
        (_, result) => {
          console.log('onCreateALTFlightDetailsTable successful');
          resolve('onCreateALTFlightDetailsTable successful');
        },
        (_, err) => {
          console.log('onCreateALTFlightDetailsTable,err', err);
          reject(err);
        },
      );
    });
  });
  return promise;
};

/**
 *
 * @param {*} altFlightData
 */
export const onInsertALTFlightDetailsData = async altFlightData => {
  console.log('onInsertALTFlightDetailsData altFlightData', altFlightData);

  if (altFlightData.length == 0) {
    return;
  }
  const db = await getDBConnection();
  const promise = new Promise((resolve, reject) => {
    let len = altFlightData.length;
    for (let i = 0; i < len; i++) {
      const {
        EmployeeCode,
        FlightNumber,
        Sector,
        Status,
        ApproachTime,
        ApproachFuel,
        TaxiFuel,
        WPT,
        MSA,
        LAT,
        LON,
        TRK,
        TAS,
        OAT,
        EET,
        EFB,
        DST,
        ST,
        SB,
        GWT,
        FL,
        WV,
        IAS,
        MH,
        GS,
        TDV,
        DRM,
        TRMG,
        TTLB,
        RQF,
        FRE,
        AWY,
        AFL,
             AWND,
             WC,
             AD,
             ATA,
             ETA,
             DISC
      } = altFlightData[i];
      db.transaction(txn => {
        txn.executeSql(
          `INSERT INTO ${localDB.tableName.altFlightPlanTable} (EmployeeCode,FlightNumber,Sector, Status, ApproachTime, ApproachFuel, TaxiFuel,WPT,MSA,LAT,LON,TRK,TAS,OAT,EET,EFB,DST,ST,SB,GWT,FL,WV,IAS,MH,GS,TDV,DRM,TRMG,TTLB,RQF,FRE,AWY,AFL,
            AWND,
            WC,
            AD,
            ATA,
            ETA,
             DISC,isPushed) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
          [
            global.userName,
            FlightNumber,
            Sector,
            Status,
            ApproachTime,
            ApproachFuel,
            TaxiFuel,
            Array.isArray(WPT) ? '' : WPT,
            Array.isArray(MSA) ? '' : MSA,
            Array.isArray(LAT) ? '' : LAT,
            Array.isArray(LON) ? '' : LON,
            Array.isArray(TRK) ? '' : TRK,
            Array.isArray(TAS) ? '' : TAS,
            Array.isArray(OAT) ? '' : OAT,
            Array.isArray(EET) ? '' : EET,
            Array.isArray(EFB) ? '' : EFB,
            Array.isArray(DST) ? '' : DST,
            Array.isArray(ST) ? '' : ST,
            Array.isArray(SB) ? '' : SB,
            Array.isArray(GWT) ? '' : GWT,
            Array.isArray(FL) ? '' : FL,
            Array.isArray(WV) ? '' : WV,
            Array.isArray(IAS) ? '' : IAS,
            Array.isArray(MH) ? '' : MH,
            Array.isArray(GS) ? '' : GS,
            Array.isArray(TDV) ? '' : TDV,
            
            
            Array.isArray(DRM) ? '' : DRM,
            Array.isArray(TRMG) ? '' : TRMG,
            Array.isArray(TTLB) ? '' : TTLB,
            Array.isArray(RQF) ? '' : RQF,
            Array.isArray(FRE) ? '' : FRE,
            Array.isArray(AWY) ? '' : AWY,
            AFL,
            AWND,
            WC,
            AD,
            ATA,
            ETA,
            DISC,0
          ],
          (_, results) => {
            console.log('altFlightPlanTable, results', results);
            resolve('onInsertALTFlightDetailsData insert success');
          },
          (_, err) => {
            console.log('altFlightPlanTable, err', err);
            reject(err);
          },
        );
      });
    }
  });
  return promise;
};

/**
 *
 */
export const onFetchALTFlightDetailsData = async sqlQuery => {
  if (sqlQuery == undefined) {
    sqlQuery = `SELECT * FROM ${localDB.tableName.altFlightPlanTable}`;
  }

  const db = await getDBConnection();
  let altFlightData = [];
  const promise = new Promise((resolve, reject) => {
    db.transaction(txn => {
      txn.executeSql(
        sqlQuery,
        [],
        (_, results) => {
          var len = results.rows.length;
          console.log(`There are ${len} records in the altFlightPlanTable`);
          for (i = 0; i < len; i++) {
            altFlightData.push(results.rows.item(i));
          }
          if (len == 0) {
            console.log('nothing to show in altFlightPlanTable');
          }
          resolve(altFlightData);
        },
        (_, err) => {
          console.log('nothing to show in altFlightPlanTable');
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
export const onDeleteAltFlightDetails =async (FlightNumber) => {
 
  const db = await getDBConnection();
   const promise = new Promise((resolve, reject) => {
    db.transaction(txn => {
      txn.executeSql(
        `DELETE FROM ${localDB.tableName.altFlightPlanTable} WHERE FlightNumber='${FlightNumber}'`,
        [],
        (_, results) => {
          console.log('altFlightPlanTable, delete success', results);
          resolve('altFlightPlanTable delete success');
        },
        (_, err) => {
          console.log('altFlightPlanTable,delete update error', err);
          reject(err);
        },
      );
    });
  });

  return promise;
};
