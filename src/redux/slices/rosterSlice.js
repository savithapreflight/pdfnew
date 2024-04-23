import {createSlice} from '@reduxjs/toolkit';
import {getRosterDetailsApi} from '../../api/roster/rosterDetailsApi';
import {AddDataToTable} from '../../db/addDataToTable';
import {getAllTableData} from '../../db/getTableData';
import {TABLE_NAMES} from '../../db/tableNames';

export const RosterSlice = createSlice({
  name: 'roster',
  initialState: {
    loading: false,
    data: [],
    error: false,
    message: '',
  },
  reducers: {
    rosterData: (state, {payload}) => {
      state.data = payload;
      return state;
    },
  },
});

export const {rosterData} = RosterSlice.actions;

export const addRosterDataReducer = () => {
  return async () => {
    try {
      const response = await getRosterDetailsApi();
      await AddDataToTable(TABLE_NAMES.roster_details, response?.data);
      // console.log(response.data, '----------response in addRosterDataReducer');
    } catch (error) {
      console.log(error, 'error in addRosterDataReducer');
    }
  };
};

export const getRosterDataReducer = () => {
  return async Dispatch => {
    try {
      const response = await getAllTableData(TABLE_NAMES.roster_details);
      Dispatch(rosterData(response));
      console.log(response)
    } catch (error) {
      console.log(error, 'error in addRosterDataReducer');
    }
  };
};

export default RosterSlice.reducer;
