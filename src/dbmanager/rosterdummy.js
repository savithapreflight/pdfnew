// /* eslint-disable */

// import {openDatabase,enablePromise} from 'react-native-sqlite-storage';
// import {localDB} from './dbconstants';
// import axios from 'axios';


// const getDBConnection = async () => {
//   let db = openDatabase(
    
//     {name: 'Database.db', location: 'default'},
//     success => {
//       console.log('Databases connected');
//     },
//     error => {
//       console.log('Error in Database connection');
//     },
    
//   );
//   return db;
// };
// enablePromise(true);




// export const onCreateRosterTable = async() => {
//   console.log('called onCreateRosterTable');
//   const db =await  getDBConnection();
//   console.log('db',db)
//   const promise = new Promise((resolve, reject) => {
//       db.transaction((txn) => {
//           txn.executeSql(`DROP TABLE IF EXISTS ${localDB.tableName.roster_details}`, []);
//           txn.executeSql(`CREATE TABLE IF NOT EXISTS ${localDB.tableName.roster_details} (
//             id INTEGER PRIMARY KEY AUTOINCREMENT,
//             crewCode TEXT,
//             crewDesig TEXT,
//             flightDate TEXT,
//             patternNo TEXT,
//             flightNo TEXT,
//             deptTime TEXT,
//             arrTime TEXT,
//             startFrom TEXT,
//             endsAt TEXT,
//             flightFrom TEXT,
//             flightTo TEXT,
//             restPeriod TEXT,
//             aircraftType TEXT,
//             patternStTime TEXT,
//             patternEndTime TEXT,
//             isVoilated TEXT,
//             voilationReason TEXT,
//             reptIn INTEGER,
//             reptOut INTEGER,
//             createdDate TEXT,
//             modifiedDate TEXT
//         )`,
//               [],
//               (_, result) => {

//                   console.log("onCreateRosterTable successful");
//                   resolve("onCreateRosterTable successful");

//               },
//               (_, err) => {

//                   console.log('onCreateRosterTable,err', err);
//                   reject(err);
//               }
//           );
//       });
//   });
//   return promise;
// };


  




// export const insertrosterData = async (rosterDetails) => {
//     // Establish a database connection
//     const db = await getDBConnection();
  
//     // Create a promise to handle the transaction
//     const promise = new Promise((resolve, reject) => {
//       db.transaction((txn) => {
//         // SQL query for inserting data into the roster_details table
//         const sqlQuery = `
//         INSERT INTO roster_details
//         (crewCode, crewDesig, flightDate, patternNo, flightNo, deptTime, arrTime, startFrom, endsAt, 
//           flightFrom, flightTo, restPeriod, aircraftType, patternStTime, patternEndTime, isVoilated, 
//           voilationReason, reptIn, reptOut, createdDate, modifiedDate) 
//         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

//         console.log('Executing SQL query:', sqlQuery);
//         console.log('Inserting data:', rosterDetails);

//         // Extract values from the rosterDetails object
//         const values = [
//             rosterDetails.crewCode,
//             rosterDetails.crewDesig,
//             rosterDetails.flightDate,
//             rosterDetails.patternNo,
//             rosterDetails.flightNo,
//             rosterDetails.deptTime,
//             rosterDetails.arrTime,
//             rosterDetails.startFrom,
//             rosterDetails.endsAt,
//             rosterDetails.flightFrom,
//             rosterDetails.flightTo,
//             rosterDetails.restPeriod,
//             rosterDetails.aircraftType,
//             rosterDetails.patternStTime,
//             rosterDetails.patternEndTime,
//             rosterDetails.isVoilated,
//             rosterDetails.voilationReason,
//             rosterDetails.reptIn,
//             rosterDetails.reptOut,
//             rosterDetails.createdDate,
//             rosterDetails.modifiedDate
//         ];
          
//         // Execute the SQL query with the provided values
//         txn.executeSql(
//           sqlQuery,
//           values,
//           (_, result) => {
//             console.log('Insert result:', result);
//             if (result.rowsAffected > 0) {
//               console.log('Insert successful roster_details');
//               resolve('Insert successful');
//             } else {
//               console.log('Insert failed roster_details. No rows affected.');
//               reject('No rows affected.');
//             }
//           },
//           (error) => {
//             console.log('Insert failed roster_details', error);
//             reject(error); // Log the error for further investigation
//           }
//         );
//       });
//     });
  
//     return promise;
// };

  
  
  

  
  
// export const insertDataToTable = async () => {
//     await onCreateRosterTable();
      
//         try {
//             const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiODUwMjQxMCIsImp0aSI6IjUwNjEwZTk4LWJkOWUtNDkwOS1hNzExLWUwY2Q5ZDYwZDdhMyIsImV4cCI6MTcwNTc2Njc5MywiaXNzIjoiQW5pbCIsImF1ZCI6IkNyZXcifQ.NhAEaqJydQalKIZpUabJZ7GQxffYOAXzxsrx5HiwERM';

          
      
//           const response = await axios.get(
//             `http://20.204.102.191/cstar.API/RosterAppDetails/ALIFFKHAIRI?StartDate=01%2F01%2F2024&EndDate=02%2F02%2F2024&ModifiedDate=02%2F02%2F2023`,
//             {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                   },

//             }
           
//           );
//           console.log(response,"responseeee roster")
          
//           const res = response?.data;
         
          
//             const roster_details = res?.map(item => ({
//                 crewCode: item?.crewCode || '',
//                 crewDesig: item?.crewDesig || '',
//                 flightDate: item?.flightDate || '',
//                 patternNo: item?.patternNo || '',
//                 flightNo: item?.flightNo || '',
//                 deptTime: item?.deptTime || '',
//                 arrTime: item?.arrTime || '',
//                 startFrom: item?.startFrom || '',
//                 endsAt: item?.endsAt || '',
//                 flightFrom: item?.flightFrom || '',
//                 flightTo: item?.flightTo || '',
//                 restPeriod: item?.restPeriod || '',
//                 aircraftType: item?.aircraftType || '',
//                 patternStTime: item?.patternStTime || '',
//                 patternEndTime: item?.patternEndTime || '',
//                 id: item?.id || 0, // Update with the actual property name if needed
//                 isVoilated: item?.isVoilated || '',
//                 voilationReason: item?.voilationReason || '',
//                 reptIn: item?.reptIn || 0,
//                 reptOut: item?.reptOut || 0,
//                 createdDate: item?.createdDate || '',
//                 modifiedDate: item?.modifiedDate || '',
//             }));
            
         
//           console.log('Fetched data from local database (before insertion):', await onFetchRosterData());

//         const insertionResult = await insertrosterData(roster_details);
//         console.log('Insertion Result123:', insertionResult);

//         console.log('Fetched data from local database (after insertion):', await onFetchRosterData());

//         console.log('Insert successful roster new123!'); // Log success message

//         const fetchedData = await onFetchRosterData();
//         console.log('Fetched data from local database:', fetchedData);

//         return { data: roster_details, message: 'Insert successful' };
      
//         } catch (error) {
//           let err;
//           if (error.response) {
//             err = error.response?.data || 'Login Failed, Try Again';
//             console.log('Error from getRosterDetailsApi response', err);
//           } else if (error.request) {
//             err = error.request;
//           } else {
//             err = error;
//           }
//           console.log(err, 'Error from LoginRequest');
//           throw { error: false, data: '', message: err };
//         }
//       };
    
 



//       export const onFetchRosterData = async (sqlQuery) => {
//         if (sqlQuery === undefined) {
//           sqlQuery = `SELECT * FROM roster_details`;
//         }
      
//         const db = await getDBConnection();
//         console.log('db roster', db);
      
//         return new Promise(async (resolve, reject) => {
//           try {
//             let rosterData = [];
//             await db.transaction(async (txn) => {
//               txn.executeSql(
//                 sqlQuery,
//                 [],
//                 (_, results) => {
//                   var len = results.rows.length;
//                   console.log(`There are ${len} records in the rosterData`);
//                   for (let i = 0; i < len; i++) {
//                     rosterData.push(results.rows.item(i));
//                   }
//                   if (len === 0) {
//                     console.log('No records in rosterData');
//                   }
//                   resolve(rosterData);
//                 },
//                 (_, err) => {
//                   console.log('Error fetching rosterData', err);
//                   reject(err);
//                 }
//               );
//             });
//           } catch (error) {
//             console.log('Error in transaction', error);
//             reject(error);
//           }
//         });
//       };
      



import SQLite from 'react-native-sqlite-storage';
import openDatabase from 'react-native-sqlite-storage';


const db = SQLite.openDatabase({ name: 'Database.db', createFromLocation: '~Database.db' });

  // Function to create table and insert data
 export const createTableAndInsertData = () => {
    // Step 1: Create table
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS roster_details (' +
          'id INTEGER PRIMARY KEY AUTOINCREMENT,' +
          'crewCode TEXT,' +
          'crewDesig TEXT,' +
          'flightDate TEXT,' +
          'patternNo TEXT,' +
          'flightNo TEXT,' +
          'deptTime TEXT,' + // Add other columns as per your API data format
          'arrTime TEXT,' +
          'startFrom TEXT,' +
          'endsAt TEXT,' +
          'flightFrom TEXT,' +
          'flightTo TEXT,' +
          'restPeriod TEXT,' +
          'aircraftType TEXT,' +
          'patternStTime TEXT,' +
          'patternEndTime TEXT,' +
          'isVoilated TEXT,' +
          'voilationReason TEXT,' +
          'reptIn INTEGER,' +
          'reptOut INTEGER,' +
          'createdDate TEXT,' +
          'modifiedDate TEXT' +
          ');',
        [],
        (tx, result) => {
          console.log('Table created successfully');
        },
        (error) => {
          console.error('Error creating table: ', error);
        }
      );
    });

}

    export const InsertData = () => {

        const apiUrl =
          'http://20.204.102.191/cstar.API/RosterAppDetails/AMIRFALIQ?StartDate=01/01/2024&EndDate=02/01/2024&ModifiedDate=02/01/2023';
    
        fetch(apiUrl)
          .then((response) => response.json())
          .then((data) => {
            db.transaction((tx) => {
              data.forEach((item) => {
                tx.executeSql(
                  'INSERT INTO roster_details (crewCode, crewDesig, flightDate, patternNo, flightNo, deptTime, arrTime, startFrom, endsAt, flightFrom, flightTo, restPeriod, aircraftType, patternStTime, patternEndTime, isVoilated, voilationReason, reptIn, reptOut, createdDate, modifiedDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                  [
                    item.crewCode,
                    item.crewDesig,
                    item.flightDate,
                    item.patternNo,
                    item.flightNo,
                    item.deptTime,
                    item.arrTime,
                    item.startFrom,
                    item.endsAt,
                    item.flightFrom,
                    item.flightTo,
                    item.restPeriod,
                    item.aircraftType,
                    item.patternStTime,
                    item.patternEndTime,
                    item.isVoilated,
                    item.voilationReason,
                    item.reptIn,
                    item.reptOut,
                    item.createdDate,
                    item.modifiedDate,
                  ],
                  (tx, result) => {
                    console.log('Data inserted successfully');
                  },
                  (error) => {
                    console.error('Error inserting data: ', error);
                  }
                );
              });
            });
          })
          .catch((error) => {
            console.error('API error: ', error);
          });
    }


