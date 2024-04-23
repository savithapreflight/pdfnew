import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import {useState, useEffect} from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {APIURLTRIMSHEET, apiKeys} from '../API-Axios/endpoint';
import HTMLtoPDF from './pdfhtml';
import moment from 'moment';
const PdfDesignTwo = ({route, navigation}) => {
  const [signature, setSignature] = useState(null);
  const [data, setdata] = useState({});
  const [actcrewStr, setactcrewstr] = useState();
  const [totaladult, settotaladult] = useState();
  const [totalchild, settotalchild] = useState();
  const [totalinfant, settotalinfant] = useState();
  const flightDetails = route.params?.flightApiDetails;
  console.log('123', flightDetails);
  const signaturePath = route.params?.signaturePath;

  const {
    AcftPurpose,
    AcftRegn,
    AcftType,
    AcftConfig,
    AdjustAftGalleyWt,
    AdjustAftJumpSeat,
    AdjustCabinBaggageWt,
    AdjustCockpitOccupant,
    AdjustCrewInCabins,
    AdjustFwdGalleyWt,
    AdjustFwdJumpSeat,
    AdjustMidJumpSeat,
    AdjustSupernumeary,
    AdjustTotalIndex,
    Captain,
    CabinTotalWeight,
    CompTotalWeight,
    CompartmentWeights,
    ArrArpt,
    DepArpt,
    EditionNum,
    FlightNo,
    FlightDate,
    Fob,
    LoadOfficer,
    Otow,
    MZfw,
    MaxZfwComp,
    MTow,
    TrimOfficer,
    TrimSheetEdNo,
    TripFuel,
    Zfw,
    ZfwCG,
    ZfwCGAftLimit,
    ZfwCGFwdLimit,
    ZfwIndex,
    TrimGeneratedUTCTime,
    TrafficTotalWeight,
    TowIndex,
    TowCGAftLimit,
    TowCGFwdLimit,
    TowCG,
    Tow,
    TotalBaggage,
    TotalCargo,
    LwCG,
    LwCGAftLimit,
    LwCGFwdLimit,
    LwIndex,
    Oew,
    OewIndex,
    Olw,
    StdCabinCrewCnt,
    StdCockpitCrewCnt,
    Rtow,
    CabinStdLimits,
    AdultInCabins,
    ChildInCabins,
    InfantInCabins,
    CompStdLimits,
    DTblLDMMainDeck,
    ToleranceLimits
  } = data;
  const day = new Date(FlightDate).getDate(); // Get the day part
  console.log(day);
  const maxmtow = data.mtow ? data.mtow.split('L') : '';
  const paxDetail = data.pax ? data.pax.split('/') : [];
  const paxTotal =
    paxDetail.length === 3
      ? parseInt(paxDetail[0]) + parseInt(paxDetail[1]) + parseInt(paxDetail[2])
      : 0;

  const crewTotal = data.actcrewStr ? data.actcrewStr.split('/') : [];
  const paxOnBoard =
    crewTotal.length === 2
      ? parseInt(crewTotal[0]) + parseInt(crewTotal[1])
      : 0;

  const paxOnBoardTotal = paxOnBoard + paxTotal;
  const arrDep = data.src ? data.src.split('-') : [];
  const arrival = arrDep[0];
  const departure = arrDep[1];

  const FlightNumber = FlightNo;
  const DepartureAirport = departure;
  const ArrivalAirport = arrival;
  const acType = AcftRegn;
  const pdfName = 'pdf2';
  const handleSign = () => {
    navigation.navigate('Sign', {
      onSign: signedData => setSignature(signedData),
      datas: {FlightNumber, DepartureAirport, ArrivalAirport, acType, pdfName},
    });
  };
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
  const getTrimSheet = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@auth');
      const user = await JSON.parse(jsonValue);

      const response = await axios.get(
        // `${apiKeys.loadsheet}?FlightDate=${flightDetails.Flightdate}&FlightNumber=${flightDetails.FlightNumber}&DepArpt=${flightDetails.DepartureAirport}&ArrArpt=${flightDetails.ArrivalAirport}`,
        'http://20.204.102.191/lnt.API/TrimSheet?FlightDate=2024-04-21&FlightNumber=SGTEST1&DepArpt=BLR&ArrArpt=DEL',
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      );
      console.log('response####################', response);
      if (response.data) {
        setdata(response.data);
        console.log('data', data);

        const totalCockpitCrew = response.data.StdCockpitCrewCnt + response.data.AdjustCockpitOccupant;
        const totalCabinCrew =
        response.data.StdCabinCrewCnt +
          response.data.AdjustFwdJumpSeat +
          response.data.AdjustMidJumpSeat +
          response.data.AdjustAftJumpSeat +
          response.data.AdjustSupernumeary;
        console.log(totalCabinCrew);
        for (let i = 0; i < response.data.AdjustCrewInCabins.Count; i++) {
          totalCabinCrew += parseFloat(response.data.AdjustCrewInCabins[i]);
        }

        setactcrewstr(`${totalCockpitCrew}/${totalCabinCrew}`);
      
      }
      console.log('121212122',);
      const totalAdult = response.data.AdultInCabins.reduce(
        (acc, curr) => parseInt(acc) + parseInt(curr),
        0,
      );
     
      settotaladult(totalAdult);
      const totalChild = response.data.ChildInCabins.reduce(
        (acc, curr) => parseInt(acc) + parseInt(curr),
        0,
      );
      console.log('121212122', totalChild);
      settotalchild(totalChild);
      const totalInfant = response.data.InfantInCabins.reduce(
        (acc, curr) => parseInt(acc) + parseInt(curr),
        0,
      );
      settotalinfant(totalInfant);
      function ReplaceEmptyByZero(value) {
   
        return value === "" ? "0" : value;
    }
    let values=
    {DTblLDMMainDeck: {
      Rows: [
        ["","", "", "D1"],
        ["A2", "", "C2", "D2"],
        ["A3", "", "C3", "D3"]
      ],
      Columns: ["Column1", "Column2", "Column3", "Column4"]
    },}
    const html=response.data.DTblLDMMainDeck?.Rows?.forEach((row, rowIndex) => {
      let cells = [];
      let tableRows = [];
      row.forEach((cell, cellIndex) => {
          if (cellIndex !== 0) {
              cells.push(ReplaceEmptyByZero(cell))
          } else {
              cells.push(cell);
          }
      });
      tableRows.push(cells);
      console.log("cells",cells,tableRows)
    });
    console.log("html html",html)
    } catch (error) {
      console.log('error error ', error);
      throw error;
    }
  };


  useEffect(() => {
    getTrimSheet();
  }, []);

  return (
    <>
    <View style={{flexDirection:'row', justifyContent: 'flex-end'}}>
    <TouchableOpacity
      onPress={() => handleSign()}>
      <Text
        style={{
          backgroundColor: 'blue',
          padding: 10,
          color: 'white',
         borderRadius:10,
          width:180,
         height:40,
          textAlign: 'center' ,
          fontWeight: 'bold',
          margin:10
        }}>
        Accept and Sign
      </Text>
    </TouchableOpacity>
  </View>
    <View style={{padding: 2, backgroundColor: '#fff', margin: 10}}>
  
      {data?.FlightNo ? (
        <ScrollView
          style={{padding: 2, backgroundColor: '#fff'}}
          showsVerticalScrollIndicator={false}>
          <Text
            style={{
              textAlign: 'center',
              color: 'black',
              letterSpacing: 1,
              fontWeight: 'bold',
              marginBottom: 10,
              textDecorationLine: 'underline',
            }}>
            SPICEJET LOADSHEET
          </Text>
          <View style={styles.container6}>
            <Text style={styles.column11}>FROM/TO</Text>
            <Text style={styles.column1}>FLT/DATE</Text>
            <Text style={[styles.column1, {textAlign: 'center'}]}>REG</Text>
            <Text style={styles.column1}>VER/CFG</Text>
            <Text style={styles.column1}>CREW</Text>
            <Text style={styles.column1}>DATE</Text>
            <Text style={styles.column1}>TIME</Text>
            <Text style={styles.column1}>EDNO</Text>
          </View>
          <View style={styles.container}>
            <Text style={[styles.column1, {fontWeight: 'normal'}]}>
              {' '}
              {DepArpt}- {ArrArpt}{' '}
            </Text>
            <Text style={[styles.column1, {fontWeight: 'normal'}]}>
              {FlightNo} /{day}
            </Text>
            <Text style={[styles.column1, {fontWeight: 'normal'}]}>
              {AcftRegn}
            </Text>
            <Text style={[styles.column1, {fontWeight: 'normal'}]}>
              {AcftType}/{AcftConfig}
            </Text>
            <Text style={[styles.column1, {fontWeight: 'normal'}]}>
              {actcrewStr}
            </Text>
            <Text style={[styles.column1, {fontWeight: 'normal'}]}>
              {formatDate(TrimGeneratedUTCTime)}
            </Text>
            <Text style={[styles.column1, {fontWeight: 'normal'}]}>
              {formatTime(TrimGeneratedUTCTime)}
            </Text>
            <Text style={[styles.column1, {fontWeight: 'normal'}]}>
              {EditionNum}
            </Text>
          </View>
          <View style={[styles.container, {}]}>
            <Text style={[styles.column11, {fontWeight: 'normal', }]}>
              ALL WEIGHTS IN KILOGRAMS
            </Text>
            <Text
              style={[
                styles.column,
                {fontWeight: 'normal', textAlign: 'right'},
              ]}>
              0
            </Text>
            <View style={{flex:4,flexDirection:"row",}}>
            <Text
            style={[styles.column, {flex: 2, fontWeight: 'normal'}]}></Text>
          {CompartmentWeights.map((item, index) => (
            <Text key={index} style={[styles.column, {fontWeight: 'normal'}]}>
              CPT{`${index + 1}`}
            </Text>
          ))}
          </View>
           
          </View>
          <View style={styles.container}>
            <Text style={[styles.column11, {fontWeight: 'normal', }]}>
              LOAD IN COMPARTMENTS
            </Text>
            <Text
              style={[
                styles.column,
                {fontWeight: 'normal', textAlign: 'right'},
              ]}>
              {CompTotalWeight}
            </Text>
            <View style={{flex:4,flexDirection:"row"}}>
            <Text
              style={[styles.column, {flex: 2, fontWeight: 'normal'}]}></Text>
            {CompartmentWeights.map((item, index) => (
              <Text key={index} style={[styles.column, {fontWeight: 'normal'}]}>
                {item}{' '}
              </Text>
            ))}
            </View>
            </View>
          <View style={styles.container}>
            <Text style={[styles.column11, {fontWeight: 'normal'}]}>
              CABIN BAGGAGE
            </Text>
            <Text
              style={[
                styles.column,
                {fontWeight: 'normal', textAlign: 'right'},
              ]}>
             
              {AdjustCabinBaggageWt}
            </Text>
            
            <View style={{flex:4,flexDirection:"row"}}>
            <Text
              style={[styles.column, {flex: 2, fontWeight: 'normal'}]}></Text>
            {AcftPurpose !== 'FREIGHTER' && (
              <>
                <Text style={[styles.column, {fontWeight: 'normal'}]}>
                  ADULT
                </Text>
                <Text style={[styles.column, {fontWeight: 'normal'}]}>
                  CHILD
                </Text>
                <Text style={[styles.column, {fontWeight: 'normal'}]}>
                  INFANT
                </Text>
                <Text style={[styles.column, {fontWeight: 'normal'}]}>
                  TOTAL
                </Text>
              </>
            )}</View>
            
            
          </View>
          <View style={styles.container}>
         
            <Text style={[styles.column11, {fontWeight: 'normal',}]}>
              PASSENGER WEIGHT
            </Text>

            <Text
              style={[
                styles.column,
                {fontWeight: 'normal',textAlign:"right"},
              ]}>
              
              {CabinTotalWeight}
            </Text>
           
              <View style={{flex:4,flexDirection:"row"}}>
              <Text
              style={[styles.column, {flex: 2, fontWeight: 'normal'}]}></Text>
            {AcftPurpose !== 'FREIGHTER' && (
              <>
                <Text style={[styles.column, {fontWeight: 'normal'}]}>
                  {parseInt(totaladult)}
                </Text>
                <Text style={[styles.column, {fontWeight: 'normal'}]}>
                  {parseInt(totalchild)}
                </Text>
                <Text style={[styles.column, {fontWeight: 'normal'}]}>
                  {parseInt(totalinfant)}
                </Text>
                <Text style={[styles.column, {fontWeight: 'normal'}]}>
                  {parseInt(totaladult) +
                    parseInt(totalchild) +
                    parseInt(totalinfant)}
                </Text>
              </>
            )}
            </View>
          </View>
          <View style={styles.container}>
            <Text style={[styles.column11, {fontWeight: 'normal',}]}>
              TOTAL TRAFFIC WEIGHT
            </Text>
            <Text
              style={[
                styles.column,
                {fontWeight: 'normal', textAlign: 'right'},
              ]}>
              {TrafficTotalWeight}
            </Text>
<View style={{flex:4,flexDirection:"row"}}>
<Text
              style={[styles.column, {flex: 2, fontWeight: 'normal'}]}></Text>
<Text style={[styles.column, {fontWeight: 'normal'}]}></Text>
            <Text style={[styles.column, {fontWeight: 'normal'}]}></Text>
            <Text style={[styles.column, {fontWeight: 'normal'}]}></Text>
            {AcftPurpose !== 'FREIGHTER' && (
              <Text style={[styles.column, {fontWeight: 'normal'}]}>POB</Text>
            )}
</View>
</View>
          <View style={styles.container}>
            <Text style={[styles.column11, {fontWeight: 'normal'}]}>
              DRY OPERATING WEIGHT
            </Text>
            <Text
              style={[
                styles.column,
                {fontWeight: 'normal', textAlign: 'right'},
              ]}>
              {Oew.toFixed()}
            </Text>
           <View style={{flex:4,flexDirection:'row'}}>
           <Text
              style={[styles.column, {flex: 2, fontWeight: 'normal'}]}></Text> 
           <Text style={[styles.column, {fontWeight: 'normal'}]}></Text>
           <Text style={[styles.column, {fontWeight: 'normal'}]}></Text>
           <Text style={[styles.column, {fontWeight: 'normal'}]}></Text>
           {AcftPurpose !== 'FREIGHTER' && (
             <Text style={[styles.column, {fontWeight: 'bold'}]}>
          
                 { parseInt(totaladult) +
                  parseInt(totalchild) +
                  parseInt(totalinfant) + parseInt(StdCockpitCrewCnt) + parseInt(AdjustCockpitOccupant) + parseInt(StdCabinCrewCnt) + parseInt(AdjustFwdJumpSeat) + parseInt(AdjustMidJumpSeat) + parseInt(AdjustAftJumpSeat) + parseInt(AdjustSupernumeary) + parseInt(AdjustCrewInCabins)}
             </Text>
           )}

           </View>

</View>
          <View style={styles.container}>
            <Text style={[styles.column11,]}>
              ZERO FUEL WEIGHT ACTUAL
            </Text>
            <Text style={[styles.column, {textAlign: 'right'}]}>
              {Zfw.toFixed()}
            </Text>
            <Text
              style={[
                styles.column,
                {flex: 2, fontWeight: 'normal', },
              ]}>
              MAX {data.MZfw}
            </Text>
<View style={{flex:2,flexDirection:"row"}}>
<Text style={[styles.column, {fontWeight: 'normal'}]}></Text>
<Text style={[styles.column, {fontWeight: 'normal'}]}></Text>
<Text style={[styles.column, {fontWeight: 'normal'}]}></Text>
<Text style={[styles.column, {fontWeight: 'normal'}]}></Text></View>
           
          </View>
          <View style={styles.container}>
            <Text style={[styles.column11, {fontWeight: 'normal',}]}>
              TAKE OFF FUEL
            </Text>
            <Text
              style={[
                styles.column,
                {fontWeight: 'normal', textAlign: 'right'},
              ]}>
              {Fob}
            </Text>
            
<View style={{flex:4,flexDirection:"row"}}>
<Text style={[styles.column, {fontWeight: 'normal'}]}></Text>
<Text style={[styles.column, {fontWeight: 'normal'}]}></Text>
<Text style={[styles.column, {fontWeight: 'normal'}]}></Text>
<Text style={[styles.column, {fontWeight: 'normal'}]}></Text>
</View>
           
          </View>
          <View style={styles.container}>
            <Text style={[styles.column11]}>
              TAKE OFF WEIGHT ACTUAL
            </Text>
            <Text style={[styles.column, {textAlign: 'right'}]}>
              {Tow.toFixed()}
            </Text>
            <Text
              style={[
                styles.column,
                {flex: 2, fontWeight: 'normal', },
              ]}>
              MAX {MTow} L
            </Text>
<View style={{flex:2,flexDirection:"row"}}>
<Text style={[styles.column, {fontWeight: 'normal'}]}></Text>
            <Text style={[styles.column, {fontWeight: 'normal'}]}></Text>
            <Text style={[styles.column, {fontWeight: 'normal'}]}></Text>
            <Text style={[styles.column, {fontWeight: 'normal'}]}></Text>
</View>
            
          </View>
          <View style={styles.container1}>
            <Text style={[styles.column11, {fontWeight: 'normal',}]}>
              TRIP FUEL
            </Text>
            <Text
              style={[
                styles.column,
                {fontWeight: 'normal', textAlign: 'right'},
              ]}>
              {TripFuel}
            </Text>
            
<View style={{flex:4,flexDirection:"row"}}>
<Text style={[styles.column, {fontWeight: 'normal'}]}></Text>
<Text style={[styles.column, {fontWeight: 'normal'}]}></Text>
<Text style={[styles.column, {fontWeight: 'normal'}]}></Text>
<Text style={[styles.column, {fontWeight: 'normal'}]}></Text>
</View>
           
          </View>
          <View style={styles.container}>
            <Text style={[styles.column11, {fontWeight: 'bold',}]}>
              LANDING WEIGHT ACTUAL
            </Text>
            <Text
              style={[
                styles.column,
                {fontWeight: 'bold', textAlign: 'right'},
              ]}>
              {Tow.toFixed() - TripFuel}
            </Text>
            <Text
              style={[
                styles.column,
                {flex: 2, fontWeight: 'normal',},
              ]}>
              MAX {Olw}
            </Text>
<View style={{flex:2,flexDirection:"row"}}>
<Text style={[styles.column, {fontWeight: 'normal'}]}></Text>
            <Text style={[styles.column, {fontWeight: 'normal'}]}></Text>
            <Text style={[styles.column, {fontWeight: 'normal'}]}></Text>
            <Text style={[styles.column, {fontWeight: 'normal'}]}></Text>
</View>
            
          </View>
          <View style={styles.container}>
            <Text style={[styles.column11, {fontWeight: 'bold'}]}>
              BALANCE AND WEIGHT CONDITIONS
            </Text>
            <Text style={[styles.column, {fontWeight: 'bold'}]}>
              LAST MINUTE CHANGES
            </Text>
          </View>
          <View style={{margin: 7, paddingLeft: 2}}>
            <View style={styles.container}>
              <View style={{flex: 1, flexDirection: 'row'}}>
                <Text style={{fontWeight: 'normal', width: 60, color: 'black'}}>
                  DOI
                </Text>
                <Text
                  style={{
                    fontWeight: 'normal',
                    marginHorizontal: 70,
                    color: 'black',
                  }}>
                  {(AdjustTotalIndex + OewIndex).toFixed(2)}
                </Text>
              </View>
              <View style={{flex: 1, flexDirection: 'row'}}>
                <Text style={[styles.column, {flex: 2, fontWeight: 'bold'}]}>
                  DEST
                </Text>

                <Text style={[styles.column, {fontWeight: 'bold'}]}>SPEC</Text>
                <Text style={[styles.column, {fontWeight: 'bold'}]}>
                  CAB/CPT
                </Text>
                <Text style={[styles.column, {fontWeight: 'bold'}]}>
                  +/-WEIGHT
                </Text>
              </View>
            </View>
            <View style={styles.container1}>
              <Text style={{color: 'black', width: 60}}>LIZFW</Text>
              <Text style={{marginHorizontal: 70, color: 'black'}}>
                {ZfwIndex.toFixed(2)}
              </Text>
            </View>
            <View style={styles.container1}>
              <Text style={{color: 'black', width: 60}}>LITOW</Text>
              <Text style={{marginHorizontal: 70, color: 'black'}}>
                {TowIndex.toFixed(2)}
              </Text>
            </View>
            <View style={styles.container1}>
              <Text style={{color: 'black', width: 60}}>LILW</Text>
              <Text style={{marginHorizontal: 70, color: 'black'}}>
                {LwIndex.toFixed(2)}
              </Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 1, flexDirection: 'row'}}>
                <Text style={styles.textcontainer}>FWD LMT</Text>
                <Text style={styles.textcontainer}>ZFWMAC</Text>
                <Text style={styles.textcontainer}>AFT LMT</Text>
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}></View>
            </View>
            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 1, flexDirection: 'row'}}>
                <Text style={styles.textcontainer1}>
                  {ZfwCGFwdLimit.toFixed(2)}
                </Text>
                <Text style={[styles.textcontainer1,{fontWeight:"bold"}]}>{ZfwCG.toFixed(2)}</Text>
                <Text style={styles.textcontainer1}>
                  {ZfwCGAftLimit.toFixed(2)}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}></View>
            </View>
            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 1, flexDirection: 'row'}}>
                <Text style={styles.textcontainer}>FWD LMT</Text>
                <Text style={styles.textcontainer}>TOWMAC</Text>
                <Text style={styles.textcontainer}>AFT LMT</Text>
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={{fontWeight: 'bold', color: 'black'}}>
                  ADJUSTMENTS TO DOW
                </Text>
              </View>
            </View>
            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 1, flexDirection: 'row'}}>
                <Text style={styles.textcontainer1}>
                  {TowCGFwdLimit.toFixed(2)}
                </Text>
                <Text style={[styles.textcontainer1, {fontWeight:"bold"}]}>{TowCG.toFixed(2)}</Text>
                <Text style={styles.textcontainer1}>
                  {TowCGAftLimit.toFixed(2)}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}></View>
            </View>
            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 1, flexDirection: 'row'}}>
                <Text style={styles.textcontainer}>FWD LMT</Text>
                <Text style={styles.textcontainer}>LWTMAC</Text>
                <Text style={styles.textcontainer}>AFT LMT</Text>
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}></View>
            </View>
            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 1, flexDirection: 'row'}}>
                <Text style={styles.textcontainer1}>
                  {LwCGFwdLimit.toFixed(2)}
                </Text>
                <Text style={[styles.textcontainer1,{fontWeight:"bold"}]}>{LwCG.toFixed(2)}</Text>
                <Text style={styles.textcontainer1}>
                  {LwCGAftLimit.toFixed(2)}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}></View>
            </View>

            <View style={styles.container}>
              <Text style={{fontWeight: 'bold', color: 'black'}}>
                UNDER LOAD BEFORE LMC {Rtow - Tow.toFixed()}
              </Text>
            </View>
            {AcftPurpose !== 'FREIGHTER' && (
              <View style={styles.container4}>
                <Text style={{marginRight: 70, color: 'black'}}>ZONE</Text>
                <View
                  style={{
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    flex: 1,
                  }}>
                  {CabinStdLimits.map((item, index) => (
                    <Text
                      key={index}
                      style={[styles.column, {fontWeight: 'normal'}]}>
                      Z{`${index + 1}`}=
                      <Text style={{fontWeight: 'bold'}}> {parseFloat(AdultInCabins[i]) +
                        parseFloat(ChildInCabins[i]) +
                        parseFloat(AdjustCrewInCabins[i])}{' '}</Text>
                     
                    </Text>
                  ))}
                </View>
              </View>
            )}
            <View style={{margin:5}}>
            <View  style={{flex:1, flexDirection: "row" }}>

            <View  style={{flex:1}}>
            <Text  style={{color:'black',}}>LDM</Text>
           
             </View>
            <View style={{flex:3, flexDirection: "row" }}>
            {CompStdLimits.map((item, index) => (
              <Text style={{flex:1,textAlign:"center",marginHorizontal:2,color:'black'}}>
                CPT {`${index + 1}`}
              </Text>
            ))}
            <Text
            style={{flex:.3,color:'black'}}>
            TTL
          </Text>
            </View> 
           
            </View>
        
            <View style={{ flex:1,flexDirection: "row" }}>
            <View style={{ flex:1,flexDirection: "row" }}>
            <Text style={{flex:1.3,color:'black'}}>DEST</Text>
            <Text style={{flex:1,color:'black',textAlign:"center"}}>A+C</Text>
            <Text style={{flex:1,color:'black',textAlign:"center"}} >INF</Text>
            <Text style={{flex:1,color:'black',textAlign:"center"}}>TTL</Text>
            </View>
            <View style={{ flex:3,flexDirection: "row" }}>
           
            {CompStdLimits.map((item, index) => (
          <>
              <Text style={{flex:1,color:'black',textAlign:"center"}}>
                BAG 
              </Text>
              <Text style={{flex:1,color:'black',textAlign:"center"}}>
              CGO
            </Text>
            </>
            ))}
            <Text style={{flex:.5}}>
              
              </Text>
            </View>
            </View>
            <View style={{ flex:1,flexDirection: "row" }}>
            <View style={{ flex:1,flexDirection: "row" }}>
            <Text style={{flex:1.3,color:'black',}}>{ArrArpt}</Text>
            <Text style={{flex:1,color:'black',textAlign:"center"}}>{parseInt(totaladult)+parseInt(totalchild)}</Text>
            <Text style={{flex:1,color:'black',textAlign:"center"}}>{parseInt(totalinfant)}</Text>
            <Text style={{flex:1,color:'black',textAlign:"center"}}>{parseInt(totaladult)+ parseInt(totalchild)+ parseInt(totalinfant)}</Text>
            </View>
            <View style={{ flex:3,flexDirection: "row" }}>
           
            {CompStdLimits.map((item, index) => (
          <>
              <Text style={{flex:1,color:'black',textAlign:"center"}}>
               0
              </Text>
              <Text style={{flex:1,color:'black',textAlign:"center"}}>
              0
            </Text>
            </>
            ))}
            <Text style={{flex:.5,color:'black'}}>
              0
              </Text>
            </View>
            </View>
        </View>
        
           
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: 5,
              }}>
              <Text style={{fontWeight: 'normal', color: 'black'}}>
                TOT PAX - {parseInt(totaladult)+ parseInt(totalchild)+ parseInt(totalinfant)}{' '}
              </Text>
              <Text style={{fontWeight: 'normal', color: 'black'}}>
                TOT BAG -{TotalBaggage}
              </Text>
              <Text style={{fontWeight: 'normal', color: 'black'}}>
                TOT CGO -{TotalCargo}
              </Text>
            </View>
            <View style={styles.container}>
              <Text style={{color: 'black'}}>
                APPROVED BY DELHI DAW VIDE LETTER .
                <Text style={{fontWeight: 'bold', color: 'black'}}>
                  {' '}
                  DEL-11011(13)/9/2019-DAW-NR/1348 DATED 30-12-2020 .
                </Text>
              </Text>
            </View>
            <View style={styles.container}>
              <Text style={{color: 'black'}}>
                APPROVED LMC LIMITS:
                {ToleranceLimits}
              </Text>
            </View>
            <View style={styles.container}>
              <Text
                style={[
                  styles.column11,
                  {fontWeight: 'bold', flex: 4, paddingLeft: 2},
                ]}>
                SI:
              </Text>
            </View>
            <View style={styles.container}>
              <Text style={[styles.column11, {fontWeight: 'normal', flex: 4}]}>
                I CERTIFY THAT HIS AIRCRAFT HAS BEEN LOADED IN ACCORDANCE WITH
                THE AFM
              </Text>
            </View>
            <View style={styles.container5}>
              <Text style={[styles.column, {fontWeight: 'normal'}]}></Text>
              <Text style={[styles.column, {fontWeight: 'normal'}]}></Text>
              <Text style={[styles.column, {fontWeight: 'normal'}]}>
                {' '}
                {signaturePath ? (
                  <Image
                    source={{uri: `file://${signaturePath}`}}
                    style={{
                      width: 100,
                      height: 60,

                      padding: 20,
                      margin: 10,
                    }}
                  />
                ) : (
                  ''
                )}
              </Text>
            </View>
            <View style={styles.container5}>
              <Text
                style={[
                  styles.column,
                  {
                    fontWeight: 'normal',
                
                    borderStyle: 'dotted',
                    borderTopColor: 'black',
                    margin: 5,
                  },
                ]}>
                SIGNATURE
              </Text>
              <Text
                style={[
                  styles.column,
                  {
                    fontWeight: 'normal',
                  
                    borderStyle: 'dotted',
                    borderTopColor: 'black',
                    margin: 5,
                  },
                ]}>
                SIGNATURE
              </Text>
              <Text
                style={[
                  styles.column,
                  {
                    fontWeight: 'normal',
                
                    borderStyle: 'dotted',
                    borderTopColor: 'black',
                    margin: 5,
                  },
                ]}>
                SIGNATURE
              </Text>
            </View>
            <View style={styles.container5}>
              <Text style={[styles.column, {fontWeight: 'bold'}]}>
                TRIM OFFICER
              </Text>
              <Text style={[styles.column, {fontWeight: 'bold'}]}>
                LOAD OFFICER
              </Text>
              <Text style={[styles.column, {fontWeight: 'bold'}]}>CAPTAIN</Text>
            </View>
            <View style={styles.container5}>
              <Text style={[styles.column, {fontWeight: 'normal'}]}>
                {TrimOfficer}{' '}
              </Text>
              <Text style={[styles.column, {fontWeight: 'normal'}]}>
                {TrimOfficer}
              </Text>
              <Text style={[styles.column, {fontWeight: 'normal'}]}>
                {Captain}
              </Text>
            </View>
            <View style={styles.container7}>
              <Text style={styles.column8}>SLTNO</Text>
              <Text
                style={[
                  styles.column8,
                  {
                    borderBottomWidth: 1,
                    borderBottomColor: 'black',
                    borderBottomStyle: 'dotted',
                  },
                ]}></Text>
              <Text style={styles.column8}>TIME</Text>
              <Text
                style={[
                  styles.column8,
                  {
                    borderBottomWidth: 1,
                    borderBottomColor: 'black',
                    borderBottomStyle: 'dotted',
                  },
                ]}></Text>
              <Text style={styles.column9}>SLT/LCC No</Text>
              <Text
                style={[
                  styles.column8,
                  {
                    borderBottomWidth: 1,
                    borderBottomColor: 'black',
                    borderBottomStyle: 'dotted',
                  },
                ]}></Text>
              <Text style={styles.column8}>TIME</Text>
              <Text
                style={[
                  styles.column8,
                  {
                    borderBottomWidth: 1,
                    borderBottomColor: 'black',
                    borderBottomStyle: 'dotted',
                  },
                ]}></Text>
              <Text style={styles.column9}>ATPL/FATA</Text>
              <Text
                style={[
                  styles.column8,
                  {
                    borderBottomWidth: 1,
                    borderBottomColor: 'black',
                    borderBottomStyle: 'dotted',
                  },
                ]}>
                {' '}
                {signaturePath ? {captain} : ''}
              </Text>
              <Text style={styles.column8}>TIME</Text>
              <Text
                style={[
                  styles.column8,
                  {
                    borderBottomWidth: 1,
                    borderBottomColor: 'black',
                    borderBottomStyle: 'dotted',
                  },
                ]}></Text>
            </View>
            <View style={styles.display5}>
             
              <TouchableOpacity onPress={() => HTMLtoPDF(data, signaturePath)}>
                <Text
                  style={{
                    backgroundColor: 'blue',
                    padding: 10,
                    color: 'white',
                    borderRadius: 10,
                  }}>
                  pdfchange
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      ) : (
        ''
      )}
    </View>
    </>
  );
};

export default PdfDesignTwo;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 3,
  },
  container6: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 5,
  },
  container7: {
    flexDirection: 'row',
    padding: 5,
  },
  container1: {
    flexDirection: 'row',
    padding: 3,
  },
  container5: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    padding: 5,
  },
  column: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
    textAlignVertical: 'center',
    // marginHorizontal: 4,
    textTransform: 'uppercase',
    color: 'black',
  },
  column1: {
    flex: 2,

    fontWeight: 'bold',
    textAlign: 'center',
    textAlignVertical: 'center',
    marginHorizontal: 10,
    textTransform: 'uppercase',
    color: 'black',
  },
  column11: {
    flex: 2,

    fontWeight: 'bold',
    textAlign: 'left',
    textAlignVertical: 'center',
    marginHorizontal: 10,
    textTransform: 'uppercase',
    color: 'black',

    bordercolor: 'black',
    
   
  },
  column8: {
    flex: 1,

    color: 'black',
  },
  column9: {
    flex: 2,

    color: 'black',
  },
  container2: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  column2: {
    flex: 2,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
    textAlignVertical: 'center',
    // marginHorizontal: 10,
    textTransform: 'uppercase',
  },
  container4: {
    flexDirection: 'row',
    padding: 5,
  },
  display5: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin: 10,
    borderRadius: 10,
  },
  textcontainer: {
    flex: 1,
    justifycontent: 'center',
    alignitems: 'center',

    padding: 3,
    color: 'black',
  },
  textcontainer1: {
    flex: 1,

    padding: 3,
    color: 'black',
    marginLeft: 10,
    // textAlign: 'center'
  },
});
