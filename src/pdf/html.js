import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import axios from 'axios';
import RNFetchBlob from 'rn-fetch-blob';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiKeys } from '../API-Axios/endpoint';
import moment from "moment";
const HTMLtoPDFExample = (
  // { route, navigation }
  data,signature
  ) => {

const datas  = data
const signaturePath=signature
console.log('datasdatas',datas)

const totalCockpitCrew = datas.StdCockpitCrewCnt +datas.AdjustCockpitOccupant;
const  totalCabinCrew =datas.StdCabinCrewCnt + datas.AdjustFwdJumpSeat + datas.AdjustMidJumpSeat + datas.AdjustAftJumpSeat + datas.AdjustSupernumeary;
 console.log(totalCabinCrew)
for (let  i = 0; i < datas.AdjustCrewInCabins.Count; i++)
 {

     totalCabinCrew +=parseFloat( datas.AdjustCrewInCabins[i]);
 }
const actcrewstr=  totalCockpitCrew + "/ "+totalCabinCrew
   

const formatTime=(str)=> {
  if (str == null) {
    return "-";
  }
  return moment(str).format("HH:mm");
}
const formatDate=(str) => {
  if (str == null) {
    return "-";
  }
  return moment(str).format("DDMMMYY").toUpperCase();
}
const file=`file:///${ signaturePath}`
  const convertHTMLtoPDF = async () => {
    try {
  
      const htmlContent =`
      <style> 
      .container {
        flex: 1;
        background-color: grey;
      }
      .header-text {
        text-align: center;
        color: black;
        letter-spacing: 1px;
        font-weight: bold;
        margin-bottom: 10px;
      }
  
      .row-container {
        display: flex;
        justify-content: space-between;
        margin-horizontal: 2px;
       
      }
  
      .text-item {
       color:black
      }
      .display {
        display: flex;
        flex-direction: row;
        margin-bottom: 10px;
      }
      
      .text1, .text3 {
        width: 30%;
        align-self: center;
        justify-content: center;
        textAlign:'center'

        
      }
      .text2 {
        width: 30%;
        align-self: center;
        justify-content: center;
        text-align: right;
        
      }
      
      .text1 {
        font-weight: bold;
      }
      
      .text12, .text22, .text33 {
        width: 33.3%;
        align-self: center;
        justify-content: center;
        font-weight: bold;
      }
      
      .container1 {
        padding:3px;
        margin: 10px;
        background-color: #fff;
        color: black;
        border-radius: 5px;
      }
      
      .display2 {
        display: flex;
        flex-direction: row;
        margin-bottom: 5px;
      }
      .row-container4 {
        display: flex;
        justify-content: space-between;
        margin: 10px;
      }
      .display3 {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        margin-bottom: 10px;
      }
      
      .additionalStyle {
        font-weight: normal;
      }
      
      .display4, .display5, .display6 {
        align-self: center;
        width: 400px;
        margin: 10px;
        border-radius: 10px;
      }
      
      .display5, .display6 {
        display:flex,
        flex-direction: row;
      }
      
      .text121 {
        width: 25%;
        align-self: center;
        justify-content: center;
        font-weight: bold;
      }
      
      .text221, .text331, .text441, .text551 {
        width: 20%;
        align-self: center;
        justify-content: center;
        font-weight: bold;
      }
      
      .signatureText {
        background-color: red;
      }
      .image-container {
        width: 100px;
        height: 60px;
        display: flex;
        justify-content:flex-end;
        
        border-radius: 5px;
       
        margin-left: auto; 
margin-right: 0;
       

      }
      .text-container {
        display: flex;
        font-weight: bold;
        justify-content: center;
        align-items: center;
      }
      
      </style>
      <div class="container1">
      <p class="header-text">SPICEJET LOADSHEET</p>

      <div class="row-container">
        <p class="text-item">${datas.FlightNo}</p>
        <p class="text-item">${formatDate(datas.TrimGeneratedUTCTime)}</p>
        <p class="text-item">${formatTime(data.TrimGeneratedUTCTime)}</p>
        <p class="text-item">${datas.EditionNum}</p>
      </div>
    
      <div class="row-container">
        <p class="text-item">${datas.DepArpt} - ${datas.ArrArpt}</p>
        <p class="text-item">${datas.AcftType} /${datas.AcftConfig}</p>
        <p class="text-item">${datas.AcftRegn}</p>
        <p class="text-item">${actcrewstr}</p>
      </div>
      <div class="display">
        <span class="text1">TTLLoad</span>
        <span class="text2">${datas.TrafficTotalWeight}</span>
      </div>
      <div class="display">
      <span class="text1">COMP WT</span>
      <span class="text2">${datas.CompTotalWeight}</span>
    </div>
    <div class="display">
      <span class="text1">CAB BG WT</span>
      <span class="text2">${datas.AdjustCabinBaggageWt}</span>
    </div>
    <div class="display">
      <span class="text1">PAX WT</span>
      <span class="text2">${datas.CabinTotalWeight}</span>
    </div>
    <div class="display">
      <span class="text1">DOW</span>
      <span class="text2">${datas.Oew}</span>
    </div>
    
    
    <div class="display">
      <span class="text1">ZFW</span>
      <span class="text2">${datas.Zfw.toFixed()}</span>
      <span class="text2">MAX ${datas.MZfw}</span>
    </div>
   
    <div class="display">
      <span class="text1">TOF</span>
      <span class="text2">${datas.Fob}</span>
      
    </div>
    <div class="display">
      <span class="text1">TOW</span>
      <span class="text2">${datas.Tow.toFixed()}</span>
      <span class="text2"> MAX ${datas.MTow}</span>
      </div>
    <div class="display">
      <span class="text1">TRIP</span>
      <span class="text2">${datas.TripFuel}</span>
      
    </div>
    <div class="display">
      <span class="text1">LAW</span>
      <span class="text2">${datas.Tow.toFixed() - datas.TripFuel}</span>
      <span class="text2">MAX ${datas.Olw}</span>
    </div>
    <div class="display">
      <span class="text1">UNDERLOAD</span>
      <span class="text2">${datas.Rtow - datas.Tow.toFixed()}</span>
    </div>
    <div class="display">
    <span class="text1">DOI</span>
    <span class="text2">${datas.AdjustTotalIndex + datas.OewIndex}</span>
  </div>
  <div class="display">
      <span class="text1">LIZFW</span>
      <span class="text2">${datas.ZfwIndex.toFixed(2)}</span>
    </div>
    <div class="display">
      <span class="text1">LITOW</span>
      <span class="text2">${datas.TowIndex.toFixed(2)}</span>
    </div>
    <div class="display">
      <span class="text1">LILW</span>
      <span class="text2">${datas.LwIndex.toFixed(2)}</span>
    </div>
<div class="display3">
        <span class="text12">FWD LMT</span>
        <span class="text22">ZFWMAC</span>
        <span class="text33"> AFT LMT</span>
      </div>
      <div class="display3">
        <span class="text12 additionalStyle">${datas.ZfwCGFwdLimit.toFixed(2)}</span>
        <span class="text12 additionalStyle">${datas.ZfwCG.toFixed(2)}</span>
        <span class="text12 additionalStyle">${datas.ZfwCGAftLimit.toFixed(2)}</span>
      </div>
      <div class="display3">
      <span class="text12">FWD LMT</span>
      <span class="text22">TOWMAC</span>
      <span class="text33">AFT LMT</span>
    </div>
    <div class="display3">
        <span class="text12 additionalStyle">${datas.TowCGFwdLimit.toFixed(2)
        }</span>
        <span class="text12 additionalStyle">${datas.TowCG.toFixed(2)}</span>
        <span class="text12 additionalStyle">${datas.TowCGAftLimit.toFixed(2)
        }</span>
      </div>
      <div class="display3">
      <span class="text12">FWD LMT</span>
      <span class="text22"> LWTMAC</span>
      <span class="text33">AFT LMT</span>
    </div>
    <div class="display3">
    
    <span class="text12 additionalStyle">${datas.LwCGFwdLimit.toFixed(2)}</span>
    <span class="text12 additionalStyle">${datas.LwCG.toFixed(2)}</span>
    <span class="text12 additionalStyle">${datas.LwCGAftLimit.toFixed(2)

      }</span>
  </div>
 
  <div class="display3">
    <p class="text121">LOAD IN CPTS</p>
  
        ${data.CompartmentWeights.map((item, index) => `
            <p style="flex: 1; color: black;">${index + 1}/${item}</p>
        `).join('')}
  </div>
 

  <div class="display3">
    <p class="text12">PAX <span style="font-weight: normal;"> ${datas.TotCheckedInPax}</span></p>
    <p class="text22">TTL <span style="font-weight: normal;"> </span></p>
    <p class="text33">POB <span style="font-weight: normal;"> </span></p>
  </div>


  <p>SI:<span> ${datas.SpecialInstr}</span></p>
  <div class="text-container">
  <p>Last Minute Changes</p>
</div>

  <div class="row-container">
    <p style="font-weight: bold;">DEST</p>
    <p style="font-weight: bold;">SPEC</p>
    <p style="font-weight: bold;">CL/CPT</p>
    <p style="font-weight: bold;">+/- WEIGHT</p>
  </div>

  <p style="font-weight: bold;">ALL WEIGHTS IN KILOGRAM</p>

  <p style="font-weight: bold;">PREPARED BY<span class="normal-text"> ${datas.TrimOfficer}</span></p>

  <div class="row-container4">
    <p></p>
    <p>${formatDate(datas.TrimGeneratedUTCTime)}</p>
    <p>${formatTime(datas.TrimGeneratedUTCTime)} UTC</p>
  </div>

  <p class="margin-vertical-10">I CERTIFY THAT THIS AIRCRAFT HAS BEEN LOADED IN ACCORDANCE WITH THE AFM</p>
  <div style="flex-direction: column;">
    <p style="font-weight: bold;">LOAD OFFICER</p>
    <p>${datas.LoadOfficer}</p>
    <p style="font-weight: bold;">CAPTAIN / ATPL No</p>
    <p style="margin-bottom: 5px;">${datas.Captain}</p>
  </div>

  <p>APPROVED LMC LIMITS :</p>

  <p style="margin-vertical: 5px;">AUTOMATED LOAD &amp; TRIMSHEET APPROVED BY DELHI DAW VIDE LETTER NO.DEL-11011(13)/9/2019-DAW-NR/1348 DATED 30-12-2020</p>

  
  <div class="image-container">
  <img src='file:///${ signaturePath}' alt="Signature Image" style="width: 100%; height: 100%;">
   
  </div>
 
    
    </div>`
      
   
      const options = {
        html: htmlContent,
        fileName:'TrimSheet1',
        directory: 'Documents',
      };

      const pdfFile = await RNHTMLtoPDF.convert(options);

      const authData = await AsyncStorage.getItem('@auth');
      const authObject = JSON.parse(authData);
      const tokens = authObject?.token;
      const userName=authObject?.userName
      const currentDate = new Date();
       const formattedDate = currentDate.toISOString().replace('T', ' ').slice(0, -1);
      const requestData = {
        
        DoneBy:authObject?.userName,
        Action: 'finished the signing',
        CurrentDateTime:'2023-02-10 00:00:00.000',
        Details: 'Trimsheet signed',
        SignaturedPDF: {
          uri: pdfFile.filePath,
          name: 'example.pdf',
          type: 'application/pdf',
        },
      };

   console.log('request data data',requestData)
      sendPDFThroughAPI(requestData);
      
    } catch (error) {
      console.error('Error converting HTML to PDF:', error);
      Alert.alert('Error', 'Failed to convert HTML to PDF.');
    }
  };

  convertHTMLtoPDF()
  const sendPDFThroughAPI = async (requestData) => {
    const authData = await AsyncStorage.getItem('@auth');
    const authObject = JSON.parse(authData);
    const tokens = authObject?.token;
    const userName=authObject?.userName
    function convertDate(dateString) {
      
      const monthAbbreviations = {
        Jan: '01',
        Feb: '02',
        Mar: '03',
        Apr: '04',
        May: '05',
        Jun: '06',
        Jul: '07',
        Aug: '08',
        Sep: '09',
        Oct: '10',
        Nov: '11',
        Dec: '12',
      };
      console.log("datestring",dateString)
      const day = dateString.slice(0, 2);
      console.log("day day",day)
      const monthAbbrev = dateString.slice(2, 5);
      console.log("monthAbbrev",monthAbbrev)
      const year = parseInt(dateString.slice(5)) < 50 ?`20${dateString.slice(5)}`:`19${dateString.slice(5)}`;
      console.log("year",year)
      
      const month = monthAbbreviations[monthAbbrev];
      const formattedDate = `${year}-${month}-${day} `;
    console.log(formattedDate)
      return formattedDate;
    }
  
    try {
     
  const currentDateTime=convertDate(datas.FlightDate)
  console.log('bfcgn',currentDateTime.toString())
      if (requestData.SignaturedPDF && requestData.SignaturedPDF.name) {
        // console.log(`${apiKeys.pdfupload}?flightDate=${currentDateTime}&flightNumber=${datas.FlightDate}&FromAirport=${DepArpt}&ToAirport=${ArrArpt}`)
        const response = await RNFetchBlob.fetch(
          'PUT',
         `${apiKeys.pdfupload}?flightDate=${datas.FlightDate}&flightNumber=${datas.FlightNo}&FromAirport=${datas.DepArpt}&ToAirport=${datas.ArrArpt}`,
        
        {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${tokens}`,
          },
          [
            {
              name: 'SignaturedPDF',
              filename: requestData.SignaturedPDF.name,
              type: requestData.SignaturedPDF.type,
              data: RNFetchBlob.wrap(requestData.SignaturedPDF.uri),
            },
            
          
            { name: 'DoneBy', data: requestData.DoneBy },
            { name: 'Action', data: requestData.Action },
            { name: 'CurrentDateTime', data: requestData.CurrentDateTime },
            { name: 'Details', data: requestData.Details },
          ]
        );
 
        // Handle the API response as needed
        console.log('API Response:', response);
        console.log('API Response:', response.text());
      } else {
        console.error('Error: PDF information is missing in requestData');
      }
    } catch (error) {
      console.error('Error sending PDF through API:', error);
    }
  };
}
 


export default HTMLtoPDFExample;
