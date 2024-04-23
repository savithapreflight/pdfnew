import { createSlice } from '@reduxjs/toolkit';
import { personalDetailsApi } from '../../api/user/userDetailsApi';
import ToastMsg from '../../components/toastMsg';

const ProfileSlice = createSlice({
  name: 'profile',
  initialState: {
    loading: false,
    data: { personal: '', professional: '' },
    error: false,
    message: '',
  },
  reducers: {
    addPersonalDetails: (state, { payload }) => {
      state.data.personal = payload.data;
      state.loading = false;
      return state;
    },
    addProfessionalDetails: state => {
      return state;
    },
    updatePersonalDetails: state => {
      return state;
    },
    updateProfessionalDetails: state => {
      return state;
    },
    clearPersonalDetails: state => {
      state.data.personal = '';
      return state;
    },
    loading: (state, { payload }) => {
      state.loading = payload;
      return state;
    },
  },
});

export const {
  addPersonalDetails,
  addProfessionalDetails,
  updatePersonalDetails,
  updateProfessionalDetails,
  clearPersonalDetails, 
  loading,
} = ProfileSlice.actions;

export const addPersonalDetailsReducer = userName => {
  return async dispatch => {
    dispatch(loading(true));
    try {
      const response = await personalDetailsApi(userName);
      dispatch(addPersonalDetails(response));
      console.log(response, 'response from addPersonalDetailsReducer--------------');
    } catch (error) {
      console.log(error, ' error in addPersonalDetailsReducer');
      dispatch(loading(false));

      //  ToastMsg(`${error.message}`);
    }
  };
};

export default ProfileSlice.reducer;
