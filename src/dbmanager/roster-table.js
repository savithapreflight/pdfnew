import SQLite from 'react-native-sqlite-storage';
import { Axios } from '../API-Axios/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const db = SQLite.openDatabase({ name: 'Database.db', createFromLocation: '~Database.db' });

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


export const InsertData = async () => {
  try {
    const empCode = await AsyncStorage.getItem('@userIds');
    console.log(empCode, "empcode");

    const calculateFormattedDate = (date) =>
      `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}/${date.getFullYear()}`;

    const calculateDates = () => {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();

      const firstDateOfLastMonth = new Date(currentYear, currentMonth - 1, 1);
      const lastDateOfNextMonth = new Date(currentYear, currentMonth, 0);
      const lastDateOfPreviousYear = new Date(currentYear - 1, currentMonth, 0);

      const startDate = calculateFormattedDate(firstDateOfLastMonth);
      const endDate = calculateFormattedDate(lastDateOfNextMonth);
      const modifiedDate = calculateFormattedDate(lastDateOfPreviousYear);

      return { startDate, endDate, modifiedDate };
    };

    const { startDate, endDate, modifiedDate } = calculateDates();

    console.log("Start Date:", startDate);
    console.log("End Date:", endDate);
    console.log("Modified Date:", modifiedDate);

    const authData = await AsyncStorage.getItem('@auth');
    const authObject = JSON.parse(authData);
    const tokens = authObject?.token;

    const apiUrl = `http://20.204.102.191/cstar.API/RosterAppDetails/${empCode}?StartDate=${startDate}&EndDate=${endDate}&ModifiedDate=${modifiedDate}`;
    console.log(apiUrl, "roster adat api url");

    // Step 1: Delete old data
    db.transaction((tx) => {
      tx.executeSql('DELETE FROM roster_details;', [], (tx, deleteResult) => {
        console.log('Old data deleted successfully');
        const token = tokens
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
            // console.log('API response Roster:', response.data);
            return response.data;
          })
          .then((data) => {
            if (data && Array.isArray(data)) {
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
                    (tx, insertResult) => {
                      // console.log('Data inserted successfully');
                    },
                    (error) => {
                      console.error('Error inserting data: ', error);
                    }
                  );
                });
              });
            } else {
              console.log('API response is not an array or is empty.');
            }
          })
          .catch((error) => {
            console.error('API error: ', error);
          });
      });
    });
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};



    export const logTableLength = () => {
        db.transaction((tx) => {
          tx.executeSql(
            'SELECT * FROM roster_details',
            [],
            (tx, result) => {
              const { rows } = result;
              const rowCount = rows.length; // Corrected line
              if (rowCount > 0) {
                console.log('Table length roster:', rowCount);
              } else {
                console.log('Table is empty.');
              }
            },
            (error) => {
              console.error('Error querying table: ', error);
            }
          );
        });
      };
      

      export const onFetchMainRoster = async(sqlQuery) => {
        
    
        let mainRosterData = [];
        const promise = new Promise((resolve, reject) => {
            db.transaction(txn => {
                txn.executeSql(`SELECT * FROM roster_details`, [],
                    (_, results) => {
                        var len = results.rows.length;
                        console.log(`There are ${len} records in the mainRosterData`);
                        for (i = 0; i < len; i++) {
                            mainRosterData.push(results.rows.item(i));
                        }
                        if (len == 0) {
                            console.log('nothing to show in mainRosterData');
                        }
                        resolve(mainRosterData);
                    },
                    (_, err) => {
                        console.log('nothing to show in mainRosterData');
                        reject(err);
                    });
            });
        });
        return promise;
    }



    export const clearRosterTable = () => {
        // Function to delete all data from the roster_details table
        db.transaction((tx) => {
          tx.executeSql('DELETE FROM roster_details', [], (tx, deleteResult) => {
            console.log('Table data cleared successfully');
          }, (error) => {
            console.error('Error clearing table data: ', error);
          });
        });
      };