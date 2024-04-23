import {Alert} from 'react-native';
import {openDatabase, enablePromise} from 'react-native-sqlite-storage';
import {getDBConnection} from './roster-table'



export const AddDataToTable = async (tableName, tableData) => {
  try {
    const db = await getDBConnection();
    if (tableData?.length > 0) {
      const fields = Object.keys(tableData[0]).toString();
      const fieldsLength = Object.keys(tableData[0]);
      const initialValues = fieldsLength?.map(i => `?`);
      let initValues = initialValues.toString();
      const insertQuery = `INSERT INTO ${tableName}(${fields}) VALUES(${initValues})`;

      for (let i = 0; i < tableData.length; i++) {
        const element = tableData[i];
        const values = Object.values(element);
        db.executeSql(insertQuery, values);
      }
console.log('insert query',insertQuery)
      console.log('Data added successfully:', tableData);
      return;
    }

    const fields = Object.keys(tableData).toString();
    const fieldsLength = Object.keys(tableData);
    const initialValues = fieldsLength?.map(i => `?`);
    let initValues = initialValues.toString();
    const insertQuery = `INSERT INTO ${tableName}(${fields}) VALUES(${initValues})`;

    const values = Object.values(tableData);
    console.log('Data added successfully:', tableData);
    return db.executeSql(insertQuery, values);
  } catch (error) {
    console.log(error, 'error in AddDataToTable');
  }
};

