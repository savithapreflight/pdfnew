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
  const totalAdult = datas.AdultInCabins.reduce(
    (acc, curr) => parseInt(acc) + parseInt(curr),
    0,
  );
  console.log('121212122', totalAdult);
  
  const totalChild = datas.ChildInCabins.reduce(
    (acc, curr) => parseInt(acc) + parseInt(curr),
    0,
  );
  
  const totalInfant = datas.InfantInCabins.reduce(
    (acc, curr) => parseInt(acc) + parseInt(curr),
    0,
  );

  
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
      const totalCockpitCrew = datas.StdCockpitCrewCnt + datas.AdjustCockpitOccupant;
        const totalCabinCrew =
          datas.StdCabinCrewCnt +
          datas.AdjustFwdJumpSeat +
          datas.AdjustMidJumpSeat +
          datas.AdjustAftJumpSeat +
          datas.AdjustSupernumeary;
        console.log(totalCabinCrew);
        for (let i = 0; i < datas.AdjustCrewInCabins.Count; i++) {
          totalCabinCrew += parseFloat(datas.AdjustCrewInCabins[i]);
        }

        const actcrewstr=`${totalCockpitCrew}/${totalCabinCrew}`
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
    flex:3 ;
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
<div style="padding:2px; background-color: #fff; ">
    <div style="background-color: #fff;">
        <div style="text-align: center; color: black; letter-spacing: 1px; font-weight: bold; margin-bottom: 10px; text-decoration: underline;">
          SPICEJET LOADSHEET
        </div>
        <div style="display: flex; flex-direction: row; 

">
          <div style="flex:1;text-align: center;font-weight: bold">FROM/TO</div>
          <div style="flex:1;text-align: center;font-weight: bold">FLT/DATE</div>
          <div style="flex:1;text-align: center;font-weight: bold">REG</div>
          <div style="flex:1;text-align: center;font-weight: bold">VER/CFG</div>
          <div style="flex:1;text-align: center;font-weight: bold">CREW</div>
          <div style="flex:1;text-align: center;font-weight: bold">DATE</div>
          <div style="flex:1;text-align: center;font-weight: bold">TIME</div>
          <div style="flex:1;text-align: center;font-weight: bold">EDNO</div>
        </div>
       
      </div>
      <div style="display: flex; flex-direction: row;">
      <div style="flex:1;text-align: center">${datas.DepArpt}-${datas.ArrArpt}</div>
      <div style="flex:1;text-align: center">${datas.FlightNo}</div>
      <div style="flex:1;text-align: center">${datas.AcftRegn}</div>
      <div style="flex:1;text-align: center">${datas.AcftType}/ ${datas.AcftConfig}</div>
      <div style="flex:1;text-align: center">${actcrewstr}</div>
      <div style="flex:1;text-align: center">${formatDate(datas.TrimGeneratedUTCTime)}</div>
      <div style="flex:1;text-align: center">${formatTime(datas.TrimGeneratedUTCTime)}</div>
      <div style="flex:1;text-align: center">${datas.EditionNum}</div>
    </div>
    <div class="container">
    <span class="column1"  style="font-weight: normal;">
        ALL WEIGHTS IN KILOGRAMS
    </span>
    <span class="column" style="text-align:right">
        0
    </span>
    <div style="flex: 4;flex-direction:row; display: flex;
    justify-content: space-between;">
        ${datas.CompartmentWeights.map((item, index) => `
            <span key="${index}" class="column" style="font-weight: normal;flex:1">
                CPT${index + 1}
            </span>
        `).join('')}
    </div>
</div>

<div class="container">
<span class="column1">LOAD IN COMPARTMENTS</span>
<span class="column" style="text-align: right;">${datas.CompTotalWeight}</span>
<div style="flex:4;flex-direction:row; display: flex;
justify-content: space-between;">${datas.CompartmentWeights.map((item, index) => `
    <span key="${index}"    class="column" style="font-weight: normal;flex:1">${item}</span>
`).join('')}</div>

</div>
<div class="container">
<span class="column1" style="font-weight: normal; ">CABIN BAGGAGE</span>
<span class="column" style="font-weight: normal;text-align: right;">${datas.AdjustCabinBaggageWt}</span>
<div style="flex:4;flex-direction:row;display: flex; justify-content: space-between;" >
    ${datas.AcftPurpose !== 'FREIGHTER' ? `
    <span class="column" style="font-weight: normal;flex:1">ADULT</span>
    <span class="column" style="font-weight: normal;flex:1">CHILD</span>
    <span class="column" style="font-weight: normal;flex:1">INFANT</span>
    <span class="column" style="font-weight: normal;flex:1">TOTAL</span>
  ` : ''}
</div>

</div>
<div class="container">
<span  class="column1" style="font-weight: normal; ">PASSENGER WEIGHT</span >
<span  class="column" style="text-align: right;">${datas.CabinTotalWeight}</span >
    <div style="flex:4;flex-direction:row;display: flex;justify-content: space-between;">
        ${datas.AcftPurpose !== 'FREIGHTER' ? `
        <span class="column" style="font-weight: normal;flex:1" >${parseInt(totalAdult)}</span >
        <span class="column" style="font-weight: normal;flex:1">${parseInt(totalChild)}</span >
        <span  class="column" style="font-weight: normal;flex:1">${parseInt(totalInfant)}</span >
        <span class="column" style="font-weight: normal;flex:1">${parseInt(totalAdult) + parseInt(totalChild) + parseInt(totalInfant)}</span >
      ` : ''}
    </div>

</div>


<div class="container">
  <div class="column1" style="font-weight: normal;">
    TOTAL TRAFFIC WEIGHT
  </div>
  <div class="column" style="font-weight: normal; text-align: right;">
    ${datas.TrafficTotalWeight}
  </div>
  <div style="flex: 4; display: flex; flex-direction: row;">
    <div class="column" style="flex: 2; font-weight: normal;"></div>
    <div class="column" style="font-weight: normal;"></div>
    <div class="column" style="font-weight: normal;"></div>
    <div class="column" style="font-weight: normal;"></div>
    ${datas.AcftPurpose !== 'FREIGHTER' && (
      `<div class="column" style="font-weight: normal;">POB</div>`
    )}
  </div>
</div>

<div class="container">
      <div class="column1" style="font-weight: normal;">DRY OPERATING WEIGHT</div>
      <div class="column" style="font-weight: normal;text-align: right;">${datas.Oew.toFixed()}</div>
     <div style="flex: 4;flex-direction: row;display:flex">
     <div class="column" style="flex: 2; font-weight: normal;"></div>
     <div class="column" style="font-weight: normal; "></div>
     <div class="column" style="font-weight: normal;"></div>
     <div class="column" style="font-weight: normal;"></div>
  
     ${datas.AcftPurpose !== 'FREIGHTER' ? `<div class="column"  style="font-weight: normal; " >
     ${ parseInt(totalAdult) +
      parseInt(totalChild) +
      parseInt(totalInfant) + parseInt(datas.StdCockpitCrewCnt) + parseInt(datas.AdjustCockpitOccupant) + parseInt(datas.StdCabinCrewCnt) + parseInt(datas.AdjustFwdJumpSeat) + parseInt(datas.AdjustMidJumpSeat) + parseInt(datas.AdjustAftJumpSeat) + parseInt(datas.AdjustSupernumeary) + parseInt(datas.AdjustCrewInCabins)}</div>` : ''}
    </div>
      
  </div>

  <div class="container">
  <span   class="column1"  >ZERO FUEL WEIGHT ACTUAL</span>
  <span   class="column" style="text-align: right;">${datas.Zfw.toFixed()}</span>
  <span   class="column" style="flex: 2; font-weight: normal; font-weight: normal;">MAX ${datas.MZfw}</span>
  
  <div style="flex:2;flex-direction: row;">
    <span   class="column" style="font-weight: normal;"></span>
    <span   class="column" style="font-weight: normal;"></span>
    <span class="column" style="font-weight: normal;"></span>
    <span class="column" style="font-weight: normal;"></span>

  </div>
 
</div>


<div class="container">
<span class="column1" style="font-weight: normal; ">TAKE OFF FUEL</span>
<span class="column" style="font-weight: normal;text-align: right;">${datas.Fob}</span>
<div style="flex: 4;flex-direction: row;">
    <span class="column" style="font-weight: normal;"></span>
    <span class="column" style="font-weight: normal;"></span>
    <span class="column" style="font-weight: normal;"></span>
    <span class="column" style="font-weight: normal;"></span>

</div>


</div>

<div class="container">
<span class="column1" style="font-weight: bold;">TAKE OFF WEIGHT ACTUAL</span>
<span class="column" style="font-weight: bold;text-align:right">${datas.Tow.toFixed()}</span>
<span class="column" style="flex: 2; font-weight: normal;">MAX ${
  datas.MTow
}</span>
<div style="flex: 2;flex-direction: row;">
    <span class="column" style="font-weight: normal;"></span>
    <span class="column" style="font-weight: normal;"></span>
    <span class="column" style="font-weight: normal;"></span>
    <span class="column" style="font-weight: normal;"></span>

</div>

</div>

<div class="container1">
<span class="column1" style="font-weight: normal;">TRIP FUEL</span>
<span class="column" style="font-weight: normal;text-align: right;">${datas.TripFuel}</span>
<div style="flex:4;flex-direction: row;";>
    <span class="column" style="font-weight: normal;"></span>
    <span class="column" style="font-weight: normal;"></span>
    <span class="column" style="font-weight: normal;"></span>
    <span class="column" style="font-weight: normal;"></span>

</div>


</div>
<div class="container">
<span class="column1" style="font-weight: bold;">LANDING WEIGHT ACTUAL</span>
<span class="column" style="font-weight: normal;text-align:right">${datas.Tow.toFixed() - datas.TripFuel}</span>
<span class="column" style="flex: 2; font-weight: normal;">MAX ${
  datas.Olw
}   L</span> 
<div style="flex: 2;flex-direction: row;">
    <span class="column" style="font-weight: normal;"></span>
<span class="column" style="font-weight: normal;"></span>
<span class="column" style="font-weight: normal;"></span>
<span class="column" style="font-weight: normal;"></span>
</div>

</div>

<div class="container">
<span class="column1" style="font-weight: bold;">BALANCE AND WEIGHT CONDITIONS</span>
<span class="column" style="font-weight: bold;flex:4">LAST MINUTE CHANGES</span>
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
<div style="flex: 1; flex-direction: row;margin:5px">
  <span style="flex: 1; justify-content: center; align-items: center; padding:6px; color: black;">FWD LMT</span>
  <span style="flex: 1; justify-content: center; align-items: center; padding:6px; color: black;">ZFW MAC</span>
  <span style="flex: 1; justify-content: center; align-items: center; padding:6px; color: black;">AFT LMT</span>
</div>
<div style="flex: 1; justify-content: center; align-items: center;"></div>
</div>

<div style="display:flex;flex-direction: row;">
<div style="flex: 1; flex-direction: row;">
  <span style="flex: 1;text-align:center; padding: 6px; color: black;margin-left:10px
 ">${datas.ZfwCGFwdLimit.toFixed(2)}</span>
  <span style="flex: 1;text-align:center ; padding: 6px; color: black; font-weight: bold;
  margin-left:20px">${ datas.ZfwCG.toFixed(2)}</span>
  <span style="flex: 1;text-align:center; padding: 6px; color: black;
  margin-left:30px">${datas.ZfwCGAftLimit.toFixed(2)}</span>
</div>
<div style="flex: 1; justify-content: center; align-items: center;"></div>
</div>
<div style="display:flex;flex-direction: row;margin-top:5px">
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
  <span style="flex: 1;  padding:6px; color: black;text-align:center;margin-left:10px">${
    datas.TowCGFwdLimit.toFixed(2)
  }</span>
  <span style="flex: 1; padding:6px; color: black; font-weight: bold;text-align:center;margin-left:20px">${
    datas.TowCG.toFixed(2)
  }</span>
  <span style="flex: 1; padding:6px; color: black;text-align:center;margin-left:30px">${
    datas.TowCGAftLimit.toFixed(2)
  }</span>
</div>
<div style="flex: 1; justify-content: center; align-items: center;"></div>
</div>

<div style="display:flex;flex-direction: row;margin-top:5px">
<div style="flex: 1; flex-direction: row;">
  <span style="flex: 1; justify-content: center; align-items: center; padding:6px; color: black;">FWD LMT</span>
  <span style="flex: 1; justify-content: center; align-items: center; padding:6px; color: black;">LWTMAC</span>
  <span style="flex: 1; justify-content: center; align-items: center; padding:6px; color: black;">AFT LMT</span>
</div>
<div style="flex: 1; justify-content: center; align-items: center;"></div>
</div>

<div style="display:flex;flex-direction: row;">
<div style="flex: 1; flex-direction: row;">
  <span style="flex: 1; padding:6px; color: black;text-align:center;margin-left:10px ">${datas.LwCGFwdLimit.toFixed(2)}</span>
  <span style="flex: 1;  padding:6px; color: black; font-weight: bold;text-align:center ;margin-left:20px">${
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
${
datas.AcftPurpose !== 'FREIGHTER'
  ? `
  <div class="container4">
      <span style="margin-right: 70px; color: black;">ZONE</span>
      <div style="justify-content: space-between; flex-direction: row; flex: 1;display:flex ">
          ${datas.CabinStdLimits.map((item, index) => `
              <span class="column" style="font-weight: normal;flex: 1;">
                  Z${index + 1}=
                  ${parseFloat(datas.AdultInCabins[i]) +
                    parseFloat(datas.ChildInCabins[i]) +
                    parseFloat(datas.AdjustCrewInCabins[i])}
              </span>
          `).join('')}
      </div>
  </div>
  `
  : ''
}


<div style="display: flex; flex-direction: row;">
<div style="flex: 1;">
  <span>LDM</span>
  <span></span>
</div>
<div style="flex: 3; display: flex; flex-direction: row;">

  ${datas.CompStdLimits.map((item,index) => `
<span style="flex: 1; text-align:center;">CPT ${index + 1}</span>
    `)}
  <span style="flex: 0.5;">TTL</span>
</div>
</div>

<div style="display: flex; flex-direction: row;margin-top: 10px">
<div style="flex: 1; display: flex; flex-direction: row;">
  <span style="flex: 1.3;">DEST</span>
  <span style="flex: 1;">A+C</span>
  <span style="flex: 1;">INF</span>
  <span style="flex: 1;">TTL</span>
</div>
<div style="flex: 3; display: flex; flex-direction: row;">
  
${datas.CompStdLimits.map((item, index) => `

<span style="flex: 1;">BAG</span>
<span style="flex: 1;">CGO</span>

`).join('')}
  <span style="flex: 0.5;"></span>
</div>
</div>

<div style="display: flex; flex-direction: row;">
<div style="flex: 1; display: flex; flex-direction: row;">
 
  <span style="flex: 1.3;">${datas.ArrArpt}</span>
  
  <span style="flex: 1;">${parseInt(totalAdult) + parseInt(totalChild)}</span>
  <span style="flex: 1;">${parseInt(totalInfant)}</span>
  <span style="flex: 1;">${parseInt(totalAdult) + parseInt(totalChild) + parseInt(totalInfant)}</span>
</div>
<div style="flex: 3; display: flex; flex-direction: row;">
 
  ${datas.CompStdLimits.map(() => `
      <span style="flex: 1;"></span>
      <span style="flex: 1;"></span>
  `)}
  <span style="flex: 0.5;"></span>
</div>
</div>
</div>








<div style="flex: 1; display: flex; flex-direction: row; justify-content: space-between; padding: 5px;">
<span style="font-weight: normal; color: black;">TOT PAX -${parseInt(totalAdult)+ parseInt(totalChild)+ parseInt(totalInfant)}</span>
<span style="font-weight: normal; color: black;">TOT BAG -${datas.TotalBaggage}</span>
<span style="font-weight: normal; color: black;">TOT CGO -${datas.  TotalCargo}</span>
</div>

<div style="display: flex; padding: 5px;">
<span style="font-weight: normal; color: black;">
  APPROVED BY DELHI DAW VIDE LETTER
  <span style="font-weight: bold; color: black;"> DEL-11011(13)/9/2019-DAW-NR/1348 DATED 30-12-2020.</span>
</span>
</div>

<div style="display: flex; padding: 5px;">
<span style="font-weight: normal; color: black;">APPROVED LMC LIMITS: ${
  datas.ToleranceLimits
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
        DoneBy: `${datas.Captain}`,
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
      const currentDateTime = convertDate(datas.FlightDate);

      if (requestData.SignaturedPDF && requestData.SignaturedPDF.name) {
        console.log(
          `${apiKeys.pdfupload}?flightDate=${currentDateTime}&flightNumber=${datas.FlightNo}&FromAirport=${datas.DepArpt}&ToAirport=${datas.ArrArpt}`,
        );
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
