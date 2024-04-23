
import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Alert} from 'react-native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import axios from 'axios';
import RNFetchBlob from 'rn-fetch-blob';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {apiKeys} from '../API-Axios/endpoint';
import moment from "moment";
const HTMLtoPDF = (data, signature) => {
  const datas = data;
  const signaturePath = signature;

  console.log('signature', signaturePath);
  const file = `file:///${signaturePath}`;

  const paxDetail = datas.pax ? data.pax.split('/') : [];
  const paxTotal =
    paxDetail.length === 3
      ? parseInt(paxDetail[0]) + parseInt(paxDetail[1]) + parseInt(paxDetail[2])
      : 0;

  const crewTotal = datas.actcrewStr ? datas.actcrewStr.split('/') : [];
  const paxOnBoard =
    crewTotal.length === 2
      ? parseInt(crewTotal[0]) + parseInt(crewTotal[1])
      : 0;
      const formatTime = str => {
        if (str == null) {
          return '-';
        }
        return moment(str).format('HH:mm');
      };
      const formatDate = str => {
        if (str == null) {
          return '-';
        }
        return moment(str).format('DDMMMYY').toUpperCase();
      };
  const convertHTMLtoPDF = async () => {
    try {
      const htmlContent = `
      <style>
  .container{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 5px;
  }
  .container8{
    display: flex;
    flex-direction: row;
    padding: 5px;
  }

  .container6 {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    padding: 5px;
  }

  .container1 {
    display: flex;
    flex-direction: row;
    padding: 5px;
  }

  .container5 {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    padding: 5px;
  }

  
  .column6 {
    flex: 1;
   
    text-align: center;
    align-items: center;
    text-transform: uppercase;
    color: black;
  font-weight: normal;
  border-top: 1px dotted black;
  border-bottom: none; 
  border-left: none; 
  border-right: none;
      border-top-color: black;
      margin: 5px;
  }
  .column7 {
    flex: 1;
    font-weight:normal;
    text-align: center;
    align-items: center;
    text-transform: uppercase;
    color: black;
  }
  .column {
    flex: 1;
    font-weight: bold;
    text-align: center;
    align-items: center;
    text-transform: uppercase;
    color: black;
  }
  .column1 {
    flex: 2;
    font-weight: bold;
    text-align: left;
    align-items: center;
   
    text-transform: uppercase;
    color: black;
  }

  .container2 {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
  }

  .column2 {
    flex: 2;
    color: black;
    font-weight: bold;
    text-align: center;
    align-items: center;
    text-transform: uppercase;
  }

  .container4 {
    display: flex;
    flex-direction: row;
    padding: 5px;
  }
</style>
<div style="padding:2px; background-color: #fff; margin:5px;">
      <div style="padding: 5px; background-color: #fff;">
          <div style="text-align: center; color: black; letter-spacing: 1px; font-weight: bold; margin-bottom: 10px; text-decoration: underline;">
            SPICEJET LOADSHEET
          </div>
          <div style="display: flex; flex-direction: row;">
            <div style="flex:2;">FROM/TO</div>
            <div style="flex:2;">FLT/DATE</div>
            <div  style="flex:1;">REG</div>
            <div style="flex: 3;">VERSION/CONFIG</div>
            <div style="flex: 1;">CREW</div>
            <div style="flex: 1;">DATE</div>
            <div style="flex: 1;">TIME</div>
            <div style="flex: 1;">EDNO</div>
          </div>
         
        </div>
        <div style="display: flex; flex-direction: row;padding:3px">
        <div style="flex:2;">${datas.DepArpt}-${datas.ArrArpt}</div>
        <div style="flex:2;text-align:justify ">${datas.FlightNo}</div>
        <div style="flex:1;">${datas.AcftRegn}</div>
        <div style="flex:3;text-align: center;">${datas.AcftType}/ ${datas.AcftConfig}</div>
        <div style="flex:1;text-align: center"></div>
        <div style="flex:1;">${formatDate(datas.TrimGeneratedUTCTime)}</div>
        <div style="flex:1;text-align:justify ">${formatTime(datas.TrimGeneratedUTCTime)}</div>
        <div style="flex:1;">${datas.EditionNum}</div>
      </div>
     
      <div class="container">
        <span class="column1" style="font-weight: normal; flex: 4;">ALL WEIGHTS IN KILOGRAMS</span>
        <span class="column" style="font-weight: normal;text-align:right">0</span>
        <span class="column" style="flex: 2; font-weight: normal;"></span>
        <span class="column" style="font-weight: normal;">CPT1</span>
        <span class="column" style="font-weight: normal;">CPT2</span>
        <span class="column" style="font-weight: normal;">CPT3</span>
        <span class="column" style="font-weight: normal;">CPT4</span>
      </div>
      <div class="container">
  <span class="column1" style="font-weight: normal; flex: 4;">LOAD IN COMPARTMENTS</span>
  <span class="column" style="font-weight: normal;text-align:right">
    ${
      datas.cmpts.cmpt1 +
      datas.cmpts.cmpt2 +
      datas.cmpts.cmpt3 +
      datas.cmpts.cmpt4
    }
  </span>
  <span class="column" style="flex: 2; font-weight: normal;"></span>
  <span class="column" style="font-weight: normal;">${datas.cmpts.cmpt1}</span>
  <span class="column" style="font-weight: normal;">${datas.cmpts.cmpt2}</span>
  <span class="column" style="font-weight: normal;">${datas.cmpts.cmpt3}</span>
  <span class="column" style="font-weight: normal;">${datas.cmpts.cmpt4}</span>
</div>

<div class="container">
  <span class="column1" style="font-weight: normal; flex: 4;">CABIN BAGGAGE</span>
  <span class="column" style="font-weight: normal;text-align:right">${datas.cabbgwt}</span>
  <span class="column" style="flex: 2; font-weight: normal;"></span>
  <span class="column" style="font-weight: normal;">ADULT</span>
  <span class="column" style="font-weight: normal;">CHILD</span>
  <span class="column" style="font-weight: normal;">INFANT</span>
  <span class="column" style="font-weight: normal;">TOTAL</span>
</div>

<div class="container">
  <span class="column1" style="font-weight: normal; flex: 4;">PASSENGER WEIGHT</span>
  <span class="column" style="font-weight: normal;text-align:right">${datas.paxwt}</span>
  <span class="column" style="flex: 2; font-weight: normal;"></span>
  <span class="column" style="font-weight: normal;">${paxDetail[0]}</span>
  <span class="column" style="font-weight: normal;">${paxDetail[1]}</span>
  <span class="column" style="font-weight: normal;">${paxDetail[2]}</span>
  <span class="column" style="font-weight: normal;">${paxTotal}</span>
</div>
<div class="container">
  <span class="column1" style="font-weight: normal; flex: 4;">TOTAL TRAFFIC WEIGHT</span>
  <span class="column" style="font-weight: normal;text-align:right">${datas.TrafficTotalWeight}</span>
  <span class="column" style="flex: 2; font-weight: normal;"></span>
  <span class="column" style="font-weight: normal;"></span>
  <span class="column" style="font-weight: normal;"></span>
  <span class="column" style="font-weight: normal;"></span>
  <span class="column" style="font-weight: normal;">POB</span>
</div>

<div class="container">
  <span class="column1" style="font-weight: normal; flex: 4;">DRY OPERATING WEIGHT</span>
  <span class="column" style="font-weight: normal;text-align:right">${datas.Oew.toFixed()}</span>
  <span class="column" style="flex: 2; font-weight: normal;"></span>
  <span class="column" style="font-weight: normal;"></span>
  <span class="column" style="font-weight: normal;"></span>
  <span class="column" style="font-weight: normal;"></span>
  <span class="column" style="font-weight: normal;">${datas.pob}</span>
</div>

<div class="container">
  <span class="column1" style="font-weight: bold; flex: 4;">ZERO FUEL WEIGHT ACTUAL</span>
  <span class="column" style="font-weight: bold;text-align:right">${datas.Zfw.toFixed()}</span>
  <span class="column" style="flex: 2; font-weight: normal;">MAX ${
    datas.MZfw
  }</span>
  <span class="column" style="font-weight: normal;"></span>
  <span class="column" style="font-weight: normal;"></span>
  <span class="column" style="font-weight: normal;"></span>
  <span class="column" style="font-weight: normal;"></span>
</div>
<div class="container">
  <span class="column1" style="font-weight: normal; flex: 4;">TAKE OFF FUEL</span>
  <span class="column" style="font-weight: normal;text-align:right">${datas.Fob}</span>
  <span class="column" style="flex: 2; font-weight: normal;"></span>
  <span class="column" style="font-weight: normal;"></span>
  <span class="column" style="font-weight: normal;"></span>
  <span class="column" style="font-weight: normal;"></span>
  <span class="column" style="font-weight: normal;"></span>
  
</div>

<div class="container">
  <span class="column1" style="font-weight: bold; flex: 4;">TAKE OFF WEIGHT ACTUAL</span>
  <span class="column" style="font-weight: bold;text-align:right">${datas.Tow.toFixed()}</span>
  <span class="column" style="flex: 2; font-weight: normal;">MAX ${
    datas.MTow
  }</span>
  <span class="column" style="font-weight: normal;"></span>
  <span class="column" style="font-weight: normal;"></span>
  <span class="column" style="font-weight: normal;"></span>
  <span class="column" style="font-weight: normal;"></span>
</div>

<div class="container1">
  <span class="column1" style="font-weight: normal; flex: 4;">TRIP FUEL</span>
  <span class="column" style="font-weight: normal;text-align:right">${datas.TripFuel}</span>
  <span class="column" style="flex: 2; font-weight: normal;"></span>
  <span class="column" style="font-weight: normal;"></span>
  <span class="column" style="font-weight: normal;"></span>
  <span class="column" style="font-weight: normal;"></span>
  <span class="column" style="font-weight: normal;"></span>

</div>
<div class="container">
  <span class="column1" style="font-weight: bold; flex: 4;">LANDING WEIGHT ACTUAL</span>
  <span class="column" style="font-weight: normal;text-align:right">${datas.Tow.toFixed() - TripFuel}</span>
  <span class="column" style="flex: 2; font-weight: normal;">MAX ${
    datas.mlaw
  }</span>
  <span class="column" style="font-weight: normal;"></span>
  <span class="column" style="font-weight: normal;"></span>
  <span class="column" style="font-weight: normal;"></span>
  <span class="column" style="font-weight: normal;"></span>
</div>

<div class="container">
  <span class="column1" style="font-weight: bold;">BALANCE AND WEIGHT CONDITIONS</span>
  <span class="column" style="font-weight: bold;">LAST MINUTE CHANGES</span>
</div>

<div class="container8">
  <div style="display:flex;flex:1;flex-direction:row;">
    <span style="font-weight: normal; width: 60; color: black;">DOI</span>
    <span style="font-weight: normal; color: black;">${(datas.AdjustTotalIndex +datas.OewIndex).toFixed(2)}</span>
  </div>

<div style="display:flex;flex-direction:row;justify-content:space-evenly;">
  <span  style=" font-weight: bold;margin-right:10">DEST</span>
  <span style="font-weight: bold;margin-right:10">SPEC</span>
  <span style="font-weight: bold;margin-right:10">CAB/CPT</span>
  <span  style="font-weight: bold;">+/-WEIGHT</span>
</div>
</div>
<div class="container1">
  <span style="color: black; width: 60;">LIZFW</span>
  <span style=" color: black;">${datas.ZfwIndex.toFixed(2)}</span>
</div>

<div class="container1">
  <span style="color: black; width: 60;">LITOW</span>
  <span style="margin-right: 70; color: black;">${datas.TowIndex.toFixed(2)}</span>
</div>

<div class="container1">
  <span style="color: black; width: 60;">LILW</span>
  <span style="margin-right: 70; color: black;">${datas.LwIndex.toFixed(2)}</span>
</div>

<div style="display:flex;flex-direction: row;">
  <div style="flex: 1; flex-direction: row;margin:'5px">
    <span style="flex: 1; justify-content: center; align-items: center; padding:6px; color: black;">FWD LMT</span>
    <span style="flex: 1; justify-content: center; align-items: center; padding:6px; color: black;">ZFW MAC</span>
    <span style="flex: 1; justify-content: center; align-items: center; padding:6px; color: black;">AFT LMT</span>
  </div>
  <div style="flex: 1; justify-content: center; align-items: center;"></div>
</div>

<div style="display:flex;flex-direction: row;">
  <div style="flex: 1; flex-direction: row;">
    <span style="flex: 1;text-align:center; padding: 6px; color: black;margin-left:20px
   ">${datas.ZfwCGFwdLimit.toFixed(2)}</span>
    <span style="flex: 1;text-align:center ; padding: 6px; color: black; font-weight: bold;
    margin-left:40px">${ datas.ZfwCG.toFixed(2)}</span>
    <span style="flex: 1;text-align:center; padding: 6px; color: black;
    margin-left:20px">${datas.ZfwCGAftLimit.toFixed(2)}</span>
  </div>
  <div style="flex: 1; justify-content: center; align-items: center;"></div>
</div>
<div style="display:flex;flex-direction: row;">
  <div style="flex: 1; flex-direction: row;">
    <span style="flex: 1; justify-content: center; align-items: center; padding: 6px; color: black;">FWD LMT</span>
    <span style="flex: 1; justify-content: center; align-items: center; padding: 6px; color: black;">TOWMAC</span>
    <span style="flex: 1; justify-content: center; align-items: center; padding:6px; color: black;">AFT LMT</span>
  </div>
  <div style="flex: 1; justify-content: center; align-items: center;">
    <span style="font-weight: bold; color: black;text-align:center">ADJUSTMENTS TO DOW</span>
  </div>
</div>

<div style="display:flex;flex-direction: row;">
  <div style="flex: 1; flex-direction: row;">
    <span style="flex: 1;  padding:6px; color: black;text-align:center;margin-left:20px">${
      datas.TowCGFwdLimit.toFixed(2)
    }</span>
    <span style="flex: 1; padding:6px; color: black; font-weight: bold;text-align:center;margin-left:30px">${
      datas.TowCG.toFixed(2)
    }</span>
    <span style="flex: 1; padding:6px; color: black;text-align:center;margin-left:20px">${
      datas.TowCGAftLimit.toFixed(2)
    }</span>
  </div>
  <div style="flex: 1; justify-content: center; align-items: center;"></div>
</div>

<div style="display:flex;flex-direction: row;">
  <div style="flex: 1; flex-direction: row;">
    <span style="flex: 1; justify-content: center; align-items: center; padding:6px; color: black;">FWD LMT</span>
    <span style="flex: 1; justify-content: center; align-items: center; padding:6px; color: black;">LWTMAC</span>
    <span style="flex: 1; justify-content: center; align-items: center; padding:6px; color: black;">AFT LMT</span>
  </div>
  <div style="flex: 1; justify-content: center; align-items: center;"></div>
</div>

<div style="display:flex;flex-direction: row;">
  <div style="flex: 1; flex-direction: row;">
    <span style="flex: 1; padding:6px; color: black;text-align:center;margin-left:20px ">${datas.LwCGFwdLimit.toFixed(2)}</span>
    <span style="flex: 1;  padding:6px; color: black; font-weight: bold;text-align:center ;margin-left:30px">${
      datas.LwCG.toFixed(2)
    }</span>
    <span style="flex: 1; padding:6px; color: black;text-align:center;margin-left:30px">${
      datas.LwCGAftLimit.toFixed(2)
    }</span>
  </div>
  <div style="flex: 1; justify-content: center; align-items: center;"></div>
</div>
<div style="margin:10px;">
  <div style="font-weight: bold; color: black;">
    UNDER LOAD BEFORE LMC ${datas.Rtow - datas.Tow.toFixed()}
  </div>
</div>

<div style="margin: 5px ; flex-direction: row; ">
  <span style="margin-right: 100; color: black;">ZONE</span>
  <span style="margin-right: 20; color: black;">Z1= ${datas.zones.zonE1}</span>
  <span style="margin-right: 20; color: black;">Z2= ${datas.zones.zonE2}</span>
  <span style="margin-right: 20; color: black;">Z3= ${datas.zones.zonE3}</span>
  <span style="margin-right: 20; color: black;">Z4= ${datas.zones.zonE4}</span>
  <span style="margin-right: 20; color: black;">Z5= ${datas.zones.zonE5}</span>
  <span style="margin-right: 20; color: black;">Z6= ${datas.zones.zonE6}</span>
  <span style="margin-right: 20; color: black;">Z7= ${datas.zones.zonE7}</span>
  <span style="margin-right: 20; color: black;">Z8= ${datas.zones.zonE8}</span>
  
</div>

<div style="margin: 10px ; display:flex;flex-direction: row;justify-content:'space-between">
  <div  style="margin-right: 60;font-weight: bold;display:flex;flex:8;">LDM</div>
  <div  class="column1"  style="margin-right: 20;font-weight: bold;">CPT 1</div>
  <div  class="column1" style="margin-right: 20;font-weight: bold;">CPT 2</div>
  <div class="column1"  style="margin-right: 20;font-weight: bold;">CPT 3</div>
  <div  class="column1"  style="margin-right: 20;font-weight: bold;">CPT 4</div>
  <div  class="column1"  style="margin-right: 20;font-weight: bold;">TTL</div>
</div>

<div style="margin: 10px ;display:flex ;flex-direction: row;justify-content: space-between">
  <div   style="font-weight: bold; ;">DEST</div>
  <div   style="font-weight: bold;">A+C</div>
  <div   style="font-weight: bold;">INF</div>
  <div    style="font-weight: bold;">TTL</div>
  <div     style="font-weight: bold;">BAG</div>
  <div     style="font-weight: bold;">BAG</div>
  <div     style="font-weight: bold;">CGO</div>
  <div     style="font-weight: bold;">BAG</div>
  <div    style="font-weight: bold;">CGO</div>
  <div    style="font-weight: bold;">BAG</div>
  <div    style="font-weight: bold;">CGO</div>
  <div   style="font-weight: bold;">BAG</div>
  <div    style="font-weight: bold;">CGO</div>
</div>

<div style="margin: 10px ; flex-direction: row;">
  <div style="font-weight: normal; flex: 2; margin-horizontal: 0;">DEL</div>
  <div style="flex: 1; font-weight: normal;"></div>
  <div style="font-weight: normal;"></div>
  <div style="font-weight: normal;"></div>
  <div style="font-weight: normal;"></div>
  <div style="font-weight: normal;"></div>
  <div style="font-weight: normal;"></div>
  <div style="font-weight: normal;"></div>
  <div style="font-weight: normal;"></div>
  <div style="font-weight: normal;"></div>
  <div style="font-weight: normal;"></div>
  <div style="font-weight: normal;"></div>
</div>
<div style="flex: 1; display: flex; flex-direction: row; justify-content: space-between; padding: 5px;">
  <span style="font-weight: normal; color: black;">TOT PAX - ${paxTotal}</span>
  <span style="font-weight: normal; color: black;">TOT BAG -</span>
  <span style="font-weight: normal; color: black;">TOT CGO -</span>
</div>

<div style="display: flex; padding: 5px;">
  <span style="font-weight: normal; color: black;">
    APPROVED BY DELHI DAW VIDE LETTER
    <span style="font-weight: bold; color: black;"> DEL-11011(13)/9/2019-DAW-NR/1348 DATED 30-12-2020.</span>
  </span>
</div>

<div style="display: flex; padding: 5px;">
  <span style="font-weight: normal; color: black;">APPROVED LMC LIMITS: ${
    datas.toleranceLimits
  }</span>
</div>

<div style="margin: 10px ;">
  <div style="font-weight: normal; flex: 4;">SI:</div>
</div>

<div style="margin: 10px ;">
  <div style="font-weight: normal; flex: 4;">
    I CERTIFY THAT HIS AIRCRAFT HAS BEEN LOADED IN ACCORDANCE WITH THE AFM
  </div>
</div>


</div>
<div class="container5">
 <div style="flex:1"></div>
 <div style="flex:1"></div>
 <div style="flex:1">
   <img src='file:///${signaturePath}' alt="Signature Image" style="display: block;
   margin-left: auto;
   margin-right: auto;
   width: 70%;">
 </div>
</div>
    </div>
    <div class="container5">
    <div class="column6">SIGNATURE</div>
    <div class="column6">SIGNATURE</div>
    <div class="column6">SIGNATURE</div>
  </div>
  <div class="container5">
    <div class="column ">TRIM OFFICER</div>
    <div class="column ">LOAD OFFICER</div>
    <div class="column ">CAPTAIN</div>
  </div>
  <div class="container5">
    <div class="column7">${datas.TrimOfficer}</div>
    <div class="column7">${datas.TrimOfficer}</div>
    <div class="column7">${datas.Captain}</div>
  </div>
  <div style="display: flex; flex-direction: row;">
  <div style="flex:1;margin-right:10px">SLT NO</div>
  <div style="flex:1; border-bottom: 1px dotted black;
  border-top: none; 
  border-left: none; 
  border-right: none;
      border-top-color: black;"></div>
  <div  style="flex:1;">TIME</div>
  <div style="flex: 1;border-bottom: 1px dotted black;
  border-top: none; 
  border-left: none; 
  border-right: none;
      border-top-color: black;"></div>
  <div style="flex: 1;">SLT/LCC</div>
  <div style="flex: 1;border-bottom: 1px dotted black;
  border-top: none; 
  border-left: none; 
  border-right: none;
      border-top-color: black;"></div>
  <div style="flex: 1;">TIME</div>
  <div style="flex: 1;border-bottom: 1px dotted black;
  border-top: none; 
  border-left: none; 
  border-right: none;
      border-top-color: black;"></div>
  <div style="flex: 1;">ATPL/FATA</div>
  <div style="flex: 1;border-bottom: 1px dotted black;
  border-top: none; 
  border-left: none; 
  border-right: none;
      border-top-color: black;"></div>
  <div style="flex: 1;">TIME</div>
  <div style="flex: 1;border-bottom: 1px dotted black;
  border-top: none; 
  border-left: none; 
  border-right: none;
      border-top-color: black;">
      </div>
 
</div>
    `;

      // <img src={{ uri:file://${ signaturePath}}} alt="Signature Image" style="width: 100%; height: 100%; border-radius: 5px;">
      const options = {
        html: htmlContent,
        fileName: 'Trimsheet2',
        directory: 'Documents',
      };

      const pdfFile = await RNHTMLtoPDF.convert(options);

      const currentDate = new Date(); // Assuming you have a Date object

      const formattedDateTime = currentDate.toISOString();
      const requestData = {
        id: 134932,
        DoneBy: `${datas.captain}`,
        Action: 'finished the signing',
        CurrentDateTime: formattedDateTime,
        Details: 'testing the sign',
        SignaturedPDF: {
          uri: pdfFile.filePath,
          name: 'Trimsheet2.pdf',
          type: 'application/pdf',
        },
      };
      // console.log(requestData)

      sendPDFThroughAPI(requestData);
    } catch (error) {
      console.error('Error converting HTML to PDF:', error);
      Alert.alert('Error', 'Failed to convert HTML to PDF.');
    }
  };

  convertHTMLtoPDF();
  // const sendPDFThroughAPI = async (requestData) => {
  //   const authData = await AsyncStorage.getItem('@auth');
  //   console.log('authdata',authData)
  //   const authObject = JSON.parse(authData);
  //   const tokens = authObject?.token;

  //   try {
  //     const apiUrl = 'http://20.204.102.191/lOADSHEET.API/TrimSheet/134932';

  //     if (requestData.SignaturedPDF && requestData.SignaturedPDF.name) {
  //       const response = await RNFetchBlob.fetch(
  //         'PUT',
  //         apiUrl,
  //         {
  //           'Content-Type': 'multipart/form-data',
  //           Authorization: `Bearer ${tokens}`,
  //         },
  //         [
  //           {
  //             name: 'SignaturedPDF',
  //             filename: requestData.SignaturedPDF.name,
  //             type: requestData.SignaturedPDF.type,
  //             data: RNFetchBlob.wrap(requestData.SignaturedPDF.uri),
  //           },
  //           // Add other form data if needed
  //           { name: 'id', data: requestData.id.toString() },
  //           { name: 'DoneBy', data: requestData.DoneBy },
  //           { name: 'Action', data: requestData.Action },
  //           { name: 'CurrentDateTime', data: requestData.CurrentDateTime },
  //           { name: 'Details', data: requestData.Details },
  //         ]
  //       );

  //       // Handle the API response as needed
  //       console.log('API Response:', response.text());
  //     } else {
  //       console.error('Error: PDF information is missing in requestData');
  //     }
  //   } catch (error) {
  //     console.error('Error sending PDF through API:', error);
  //   }
  // };
  const sendPDFThroughAPI = async requestData => {
    const authData = await AsyncStorage.getItem('@auth');
    const authObject = JSON.parse(authData);
    const tokens = authObject?.token;
    const userName = authObject?.userName;
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
      const day = dateString.slice(0, 2);
      const monthAbbrev = dateString.slice(2, 5);
      const year =
        parseInt(dateString.slice(5)) < 50
          ? `20${dateString.slice(5)}`
          : `19${dateString.slice(5)}`;
      const month = monthAbbreviations[monthAbbrev];
      const formattedDate = `${year}-${month}-${day} `;

      return formattedDate;
    }

    try {
      const currentDateTime = convertDate(datas.date);

      if (requestData.SignaturedPDF && requestData.SignaturedPDF.name) {
        console.log(
          `${apiKeys.pdfupload}?flightDate=${currentDateTime}&flightNumber=${datas.fl_no}&FromAirport=${arrival}&ToAirport=${departure}`,
        );
        const response = await RNFetchBlob.fetch(
          'PUT',
          `${apiKeys.pdfupload}?flightDate=${currentDateTime}&flightNumber=${datas.fl_no}&FromAirport=${departure}&ToAirport=${arrival}`,

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
            {name: 'DoneBy', data: requestData.DoneBy},
            {name: 'Action', data: requestData.Action},
            {name: 'CurrentDateTime', data: requestData.CurrentDateTime},
            {name: 'Details', data: requestData.Details},
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
};

export default HTMLtoPDF;
