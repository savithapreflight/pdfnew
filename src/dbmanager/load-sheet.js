import SQLite from 'react-native-sqlite-storage';
import { Axios } from '../API-Axios/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const db = SQLite.openDatabase({ name: 'Database.db', createFromLocation: '~Database.db' });

export const createloadSheet = () => {
  // Step 1: Create table
  db.transaction((tx) => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS load_sheet (' +
        'id INTEGER PRIMARY KEY,' +
        'regnNo TEXT,' +
        'acftType TEXT,' +
        'flightNo TEXT,' +
        'source TEXT,' +
        'destination TEXT,' +
        'flightDate TEXT,' +
        'std TEXT,' +
        'sta TEXT,' +
        'etd TEXT,' +
        'eta TEXT,' +
        'atd TEXT,' +
        'abn TEXT,' +
        'tdn TEXT,' +
        'ata TEXT,' +
        'diSt TEXT,' +
        'diEnd TEXT,' +
        'diDue TEXT,' +
        'wiSt TEXT,' +
        'wiEnd TEXT,' +
        'wiDue TEXT,' +
        'captain TEXT,' +
        'crewCode TEXT,' +
        'remarks TEXT,' +
        'payLoad REAL,' +
        'etdAck TEXT,' +
        'atdAck TEXT,' +
        'remarksAck TEXT,' +
        'bcheck TEXT,' +
        'status TEXT,' +
        'reStd TEXT,' +
        'gantt TEXT,' +
        'pax INTEGER,' +
        'smsStatus TEXT,' +
        'sourceMob TEXT,' +
        'destiMob TEXT,' +
        'copilot TEXT,' +
        'copCode TEXT,' +
        'adult INTEGER,' +
        'child INTEGER,' +
        'infant INTEGER,' +
        'cargo INTEGER,' +
        'arrRemarks TEXT,' +
        'prevEtd TEXT,' +
        'sessionName TEXT,' +
        'isDeleted TEXT,' +
        'chkEdit TEXT,' +
        'arrivalRemarks TEXT,' +
        'isEdited TEXT,' +
        'curSes TEXT,' +
        'aog TEXT,' +
        'aogreason TEXT,' +
        'srcLocMins INTEGER,' +
        'destLocMins INTEGER,' +
        'modified TEXT,' +
        'gateCls TEXT,' +
        'adcno TEXT,' +
        'ficno TEXT,' +
        'preUpliftFob TEXT,' +
        'departureFob TEXT,' +
        'bowserUplift TEXT,' +
        'spGravityTemp TEXT,' +
        'cumCycles TEXT,' +
        'cumFh TEXT,' +
        'bayno TEXT,' +
        'tob TEXT,' +
        'deptDelay TEXT,' +
        'arrDelay TEXT,' +
        'azfw TEXT,' +
        'lvlFlwn TEXT,' +
        'toctime TEXT,' +
        'tocfuel TEXT,' +
        'todtime TEXT,' +
        'todfuel TEXT,' +
        'totalFuelUsed TEXT,' +
        'recallNo TEXT,' +
        'speedFlown TEXT,' +
        'voyageReason TEXT,' +
        'tatd TEXT,' +
        'tabn TEXT,' +
        'ttdn TEXT,' +
        'tata TEXT,' +
        'mrno TEXT,' +
        'ezfw TEXT,' +
        'fob TEXT,' +
        'extFuel TEXT,' +
        'reasons TEXT,' +
        'trimSheetPath TEXT,' +
        'specialInstructions TEXT,' +
        'trimSent TEXT,' +
        'ticketStatus TEXT,' +
        'rtow TEXT' +
      ');',
      [],
      (tx, result) => {
        console.log('Table created successfully loadsheet');
      },
      (error) => {
        console.error('Error creating table: ', error);
      }
    );
  });
};

export const InsertDataloadsheet = async () => {
  try {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0] + 'T00:00:00';
    console.log(formattedDate);

    const authData = await AsyncStorage.getItem('@auth');
    const authObject = JSON.parse(authData);
    const tokens = authObject?.token;

    const token = tokens

    const apiUrl = `http://20.204.102.191/lOADSHEET.API/LoadSheet/FimsSchedule?Flightdate=${formattedDate}`;
    console.log(apiUrl, "fuel api url");

    // Step 1: Delete old data
    db.transaction((tx) => {
        tx.executeSql('DELETE FROM load_sheet', [], (tx, deleteResult) => {
          console.log('Old data deleted successfully');
      
          // Step 2: Insert new data
          axios.get(apiUrl,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            })
            .then((response) => {
              if (response.status !== 200) {
                throw new Error(`HTTP error! Status: ${response.status}`);
              }
              return response.data;
            })
            .then((data) => {
              if (data && Array.isArray(data)) {
                db.transaction((tx) => {
                  const columns = Object.keys(data[0]);
                  const placeholders = columns.map(() => '?').join(', ');
      
                  data.forEach((item) => {
                    const values = columns
                      .filter((col) => col !== 'id') // Exclude 'id' column
                      .map((col) => item[col]);
      
                    tx.executeSql(
                      `INSERT INTO load_sheet (${columns.filter((col) => col !== 'id').join(', ')}) VALUES (${Array(values.length).fill('?').join(', ')});`,
                      values,
                      (tx, insertResult) => {
                        // console.log('Data inserted successfully loadsheet');
                      },
                      (error) => {
                        console.error('Error inserting data loadhseet: ', error);
                      }
                    );
                  });
                });
              } else {
                console.log('API response is not an array or is empty loadsheet.');
              }
            })
            .catch((error) => {
              console.error('API error loadsheet: ', error);
            });
        });
      });
  } catch (error) {
    console.error('Error fetching data loadsheet:', error);
  }
};

  



    export const tableloadsheet = () => {
        db.transaction((tx) => {
          tx.executeSql(
            'SELECT * FROM load_sheet',
            [],
            (tx, result) => {
              const { rows } = result;
              const rowCount = rows.length; // Corrected line
              if (rowCount > 0) {
                console.log('Table length loadsheet:', rowCount);
              } else {
                console.log('Table is emptyloadsheet.');
              }
            },
            (error) => {
              console.error('Error querying table loadshet: ', error);
            }
          );
        });
      };
      

      export const onFetchLoad = async(sqlQuery) => {
        
    
        let mainLoad = [];
        const promise = new Promise((resolve, reject) => {
            db.transaction(txn => {
                txn.executeSql(`SELECT * FROM load_sheet`, [],
                    (_, results) => {
                        var len = results.rows.length;
                        console.log(`There are ${len} records in the FetchLoad`);
                        for (i = 0; i < len; i++) {
                            mainLoad.push(results.rows.item(i));
                        }
                        if (len == 0) {
                            console.log('nothing to show in FetchLoad');
                        }
                        resolve(mainLoad);
                    },
                    (_, err) => {
                        console.log('nothing to show in FetchLoad');
                        reject(err);
                    });
            });
        });
        return promise;
    }


