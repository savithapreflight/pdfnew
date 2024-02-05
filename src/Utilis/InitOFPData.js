/* eslint-disable */
import React, { useContext } from 'react';
import { onCreateMainFlightDetailsTable, onInsertMainFlightDetailsData, onFetchMainFlightDetailsData } from '../dbmanager/main-flight-details-table';
import { onCreateALTFlightDetailsTable, onInsertALTFlightDetailsData, onFetchALTFlightDetailsData } from '../dbmanager/alt-flight-details-table';
import { ThemeContext } from '../Utilis/ThemeManager';
import api from '../API-Axios/axios';
import { API } from '../constants';
import COLORS from '../constants/colors';

InitOFPData = () => {

    const OFPData = useContext(ThemeContext);
    loadInitialData();

    /**
    * 
 */
    loadInitialData = async () => {

        const { data, status, statusText } = await api.get(API, '');
        console.log('data===', data.FLIGHTFOLDER.OPR_ID[0]);

        try {
           

            const createMainFlightTable = await onCreateMainFlightDetailsTable();
            const createALTFlightTable = await onCreateALTFlightDetailsTable();

            const { data, status, statusText } = await api.get(API, '');
            console.log('data===', data.FLIGHTFOLDER.OPR_ID[0]);
            const { MAINFLTPLAN, ALT1FP } = data.FLIGHTFOLDER.OPR_ID[0];
            // console.log('MAINFLTPLAN==', MAINFLTPLAN.ROW);
            const insertTable = await onInsertMainFlightDetailsData(MAINFLTPLAN.ROW);

            const insertAltFlightTable = await onInsertALTFlightDetailsData(ALT1FP.ROW);

            const mainFlightDetails = await onFetchMainFlightDetailsData();
            console.log('mainFlightDetails==', mainFlightDetails);

            const altFlightDetails = await onFetchALTFlightDetailsData();
            console.log('altFlightDetails==', altFlightDetails);

            this.setState({ listContentData: mainFlightDetails, altFlightData: altFlightDetails });

            
        } catch (err) {

            this.setState({ loading: false });
            console.log('error==', err);
        }
    }

}

InitOFPData();