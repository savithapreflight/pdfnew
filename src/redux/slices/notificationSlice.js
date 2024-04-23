import {createSlice} from '@reduxjs/toolkit';

const NotificationSlice = createSlice({
  name: 'notification',
  initialState: {
    loading: false,
    data: [],
    viewCount: 0,
    error: false,
  },
  reducers: {
    addNotification: (state, {payload}) => {
      state.data.push(payload);
      const unreadCount = state.data.filter(itm => itm.view === false);
      state.viewCount = unreadCount.length;
      return state;
    },
    viewNotification: (state, {payload}) => {
      const notifiction = state.data.find(itm => itm.id === payload.id);
      if (notifiction) {
        notifiction.view = true;
      }
      return state;
    },
    resetViewCount: state => {
      state.viewCount = 0;
      return state;
    },
  },
});

export const {addNotification, viewNotification} = NotificationSlice.actions;

export default NotificationSlice.reducer;

export const AddNotificationAction = data => {
  return dispatch => {
    dispatch(addNotification({...data, view: false, id: Date.now()}));
  };
};
