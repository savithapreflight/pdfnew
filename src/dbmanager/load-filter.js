import SQLite from 'react-native-sqlite-storage';
import { Axios } from '../API-Axios/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const db = SQLite.openDatabase({ name: 'Database.db', createFromLocation: '~Database.db' });

export const createfilterloadSheet = () => {
  // Step 1: Create table
  db.transaction((tx) => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS filter_load (' +
        'id INTEGER PRIMARY KEY,' +
        'regnNo TEXT,' +
        'acftType TEXT,' +
        'flightNo TEXT,' +
        'source TEXT,' +
        'destination TEXT,' +
        'flightDate TEXT,' +
        'etd TEXT,' +
        'eta TEXT' +
      ');',
      [],
      (tx, result) => {
        console.log('Table created successfully loadfilter');
      },
      (error) => {
        console.error('Error creating table filterload: ', error);
      }
    );
  });
};

export const InsertDatafilterloadsheet = async () => {
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
        tx.executeSql('DELETE FROM filter_load', [], (tx, deleteResult) => {
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
                      `INSERT INTO filter_load (${columns.filter((col) => col !== 'id').join(', ')}) VALUES (${Array(values.length).fill('?').join(', ')});`,
                      values,
                      (tx, insertResult) => {
                        console.log('Data inserted successfully filter load');
                      },
                      (error) => {
                        console.error('Error inserting data loadhseet: ', error);
                      }
                    );
                  });
                });
              } else {
                console.warn('API response is not an array or is empty filter load');
              }
            })
            .catch((error) => {
              console.error('API error filter load: ', error);
            });
        });
      });
  } catch (error) {
    console.error('Error fetching data filter load:', error);
  }
};

  



    export const tablefilterloadsheet = () => {
        db.transaction((tx) => {
          tx.executeSql(
            'SELECT * FROM filter_load',
            [],
            (tx, result) => {
              const { rows } = result;
              const rowCount = rows.length; // Corrected line
              if (rowCount > 0) {
                console.log('Table length filter load:', rowCount);
              } else {
                console.warn('Table is emptyfilter load.');
              }
            },
            (error) => {
              console.error('Error querying table filter load: ', error);
            }
          );
        });
      };
      

      export const onFetchFilterLoad = async(sqlQuery) => {
        
    
        let mainLoad = [];
        const promise = new Promise((resolve, reject) => {
            db.transaction(txn => {
                txn.executeSql(`SELECT * FROM filter_load`, [],
                    (_, results) => {
                        var len = results.rows.length;
                        console.log(`There are ${len} records in the filter load`);
                        for (i = 0; i < len; i++) {
                            mainLoad.push(results.rows.item(i));
                        }
                        if (len == 0) {
                            console.log('nothing to show in filter load');
                        }
                        resolve(mainLoad);
                    },
                    (_, err) => {
                        console.log('nothing to show in filter load');
                        reject(err);
                    });
            });
        });
        return promise;
    }


