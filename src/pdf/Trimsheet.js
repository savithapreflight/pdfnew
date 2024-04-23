import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useState} from 'react';
import {useRoute} from '@react-navigation/native';
import RNFS from 'react-native-fs';
import datas from './data';
import HTMLtoPDFExample from './html';
import {APIURLTRIMSHEET, apiKeys} from '../API-Axios/endpoint';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {useSelector} from 'react-redux';
import HTMLtoPDF from './pdfhtml';

import moment from "moment";
const Trimsheet = ({route, navigation}) => {
  const userData = useSelector(state => state.auth.data);

  const navigation1 = useNavigation();
  const [data, setdata] = useState();
  const [signature, setSignature] = useState(null);
  const [captain, setCaptain] = useState();
  const [cabbgwt,setCabbgwt]=useState()
const [actcrewStr,setactcrewstr]=useState()
const [totaladult, settotaladult] = useState();
const [totalchild, settotalchild] = useState();
const [totalinfant, settotalinfant] = useState();
const [pob, setpob] = useState();

  const flightDetails = route.params;
console.log("flight123", flightDetails)
  var currentDate = new Date();
  var FlightDate = currentDate.toISOString().slice(0, 23).replace('T', ' ');

  const flightApiDetails = {
    Flightdate: FlightDate,
    FlightNumber: flightDetails.data,
    DepartureAirport: flightDetails.arriv,
    ArrivalAirport: flightDetails.depart,
    acType: flightDetails.acType,
  };
  const {FlightNumber, Flightdate, DepartureAirport, ArrivalAirport, acType} =
    flightApiDetails;
    console.log('##### flightapi derails',flightApiDetails)
  const signaturePath = route.params?.signaturePath;
const pdfName='pdf'





  const handleSign = () => {
    navigation1.navigate('Sign', {
      onSign: signedData => setSignature(signedData),
      datas: {FlightNumber, DepartureAirport, ArrivalAirport, acType,pdfName},
    });
  };
  const seTTheCaptain = () => {
    console.log('123456789');
    if (signaturePath !== undefined) {
      console.log('captain name', userData.empName);
      setCaptain(userData.empName);
    }
  };
  const getTrimSheet = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@auth');
      const user = await JSON.parse(jsonValue);

      const {FlightNumber, Flightdate, DepartureAirport, ArrivalAirport} =
        flightApiDetails;
      const response = await axios.get(
        // `${apiKeys.loadsheet}?FlightDate=${Flightdate}&FlightNumber=${FlightNumber}&DepArpt=${DepartureAirport}&ArrArpt=${ArrivalAirport}`,
        "http://20.204.102.191/lnt.API/TrimSheet?FlightDate=2024-04-21&FlightNumber=SGTEST1&DepArpt=BLR&ArrArpt=DEL",

        {
          headers: {
            Authorization:`Bearer ${user.token}`,
          },
        },
      );
      
      console.log('response####################', response.data);
      setdata(response.data);
      console.log('data', data);
     const totalCockpitCrew =response. data.StdCockpitCrewCnt +response.data.AdjustCockpitOccupant;
const  totalCabinCrew =response.data.StdCabinCrewCnt + response.data.AdjustFwdJumpSeat + response.data.AdjustMidJumpSeat + response.data.AdjustAftJumpSeat + response.data.AdjustSupernumeary;
 console.log("totalcabin",totalCabinCrew)
for (let  i = 0; i <response.data.AdjustCrewInCabins.Count; i++)
 {
totalCabinCrew +=parseFloat(response.data.AdjustCrewInCabins[i]);
 }
 console.log("acrcrewstr",`${ totalCockpitCrew }/${totalCabinCrew}`)

   setactcrewstr( `${ totalCockpitCrew }/${totalCabinCrew}`)
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

  setpob(parseInt(totalInfant)+parseInt(totalAdult)+parseInt(totalChild)+parseInt(totalCockpitCrew )+parseInt(totalCabinCrew))
    } catch (error) {
      console.log('error error ', error);
      throw error;
    }
   
  };
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

  
  useEffect(() => {
    getTrimSheet();
    seTTheCaptain();
  },[]);

  return (
    <>

    <View style={{flexDirection:'row', justifyContent: 'flex-end',marginHorizontal:10}}>
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
    

    
  
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        {data?.FlightNo? (
          <View style={styles.container1}>
            <Text
              style={{ 
                textAlign: 'center',
                color: 'black',
                letterSpacing: 1,
                fontWeight: 'bold',
                marginBottom: 10,
              }}>
              SPICEJET LOADSHEET
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginHorizontal: 2,
                marginBottom: 10,
              }}>
              <Text style={{color: 'black',width:'25%',}}>{data.FlightNo}</Text>
              <Text style={{color: 'black',width:'25%',textAlign:'center'}}>{formatDate(data.TrimGeneratedUTCTime)}</Text>
              <Text style={{color: 'black',width:'25%',textAlign:'center'}}>{formatTime(data.TrimGeneratedUTCTime)}</Text>
              <Text style={{color: 'black',width:'25%',textAlign:'center'}}>{data.EditionNum}</Text>
            </View>
            
            <View
              style={{
                flexDirection: 'row',
              
                marginBottom: 10,

              }}>
              <Text style={{color: 'black',width:'25%',}}>{data.DepArpt}- {data.ArrArpt}</Text>
              <Text style={{color: 'black',width:'25%',textAlign:'center'}}>{data.AcftType} /{data.AcftConfig}</Text>
              <Text style={{color: 'black',width:'25%',textAlign:'center'}}>{data.AcftRegn}</Text>
              <Text style={{color: 'black',width:'25%',textAlign:'center'}}>{actcrewStr}</Text>
            </View>

            <View style={styles.display}>
              <Text style={styles.text1}>TTL Load</Text>
              <Text style={styles.text2}>{data.TrafficTotalWeight}</Text>
            </View>
            <View style={styles.display}>
              <Text style={styles.text1}>COMP WT</Text>
              <Text style={styles.text2}>{data.CompTotalWeight}</Text>
            </View>
            <View style={styles.display}>
              <Text style={styles.text1}>CAB BG WT</Text>
              <Text style={styles.text2}>{data.AdjustCabinBaggageWt}</Text>
            </View>
            <View style={styles.display}>
              <Text style={styles.text1}>PAX WT</Text>
              <Text style={styles.text2}>{data.CabinTotalWeight}</Text>
            </View>
            <View style={styles.display}>
              <Text style={styles.text1}>DOW </Text>
              <Text style={styles.text2}>{data.Oew.toFixed()}</Text>
            </View>
           
            <View style={styles.display2}>
              <Text style={styles.text1}>ZFW</Text>
              <Text style={styles.text2}>{data.Zfw.toFixed()}</Text>
              <Text style={styles.text3}>MAX {data.MZfw}</Text>
            </View>
            <View style={styles.display}>
              <Text style={styles.text1}>TOF</Text>
              <Text style={styles.text2}>{data.Fob}</Text>
            </View>
            <View style={styles.display2}>
              <Text style={styles.text1}>TOW</Text>
              <Text style={styles.text2}>{data.Tow.toFixed()}</Text>
              <Text style={styles.text3}>MAX {data.MTow}</Text>
            </View>
            <View style={styles.display}>
              <Text style={styles.text1}>TRIP</Text>
              <Text style={styles.text2}>{data.TripFuel}</Text>
            </View>

            <View style={styles.display2}>
              <Text style={styles.text1}>LAW</Text>
              <Text style={styles.text2}>{data.Tow.toFixed() - data.TripFuel}</Text>
              <Text style={styles.text3}>MAX {data.Olw}</Text>
            </View>
            <View style={styles.display}>
              <Text style={styles.text1}>UNDERLOAD</Text>
              <Text style={styles.text2}>{data.Rtow - data.Tow.toFixed()}</Text>
            </View>
            <View style={styles.display}>
              <Text style={styles.text1}>DOI</Text>
              <Text style={styles.text2}>{(data.AdjustTotalIndex + data.OewIndex).toFixed(2)}</Text>
            </View>
            <View style={styles.display}>
              <Text style={styles.text1}>LIZFW</Text>
              <Text style={styles.text2}>{data.ZfwIndex.toFixed(2)}</Text>
            </View>
            <View style={styles.display}>
              <Text style={styles.text1}>LITOW</Text>
              <Text style={styles.text2}>{data.TowIndex.toFixed(2)}</Text>
            </View>
            <View style={styles.display}>
              <Text style={styles.text1}>LILW</Text>
              <Text style={styles.text2}>{data.LwIndex.toFixed(2)}</Text>
            </View>
            <View style={{margin:10,alignItems:'center',justifyContent:'space-around'}}>
            <View style={{justifyContent:"center",alignItems:'center'}}>
            <View style={styles.display3}>
              <Text style={styles.text12}>FWD LMT</Text>
              <Text style={styles.text22}>ZFWMAC</Text>
              <Text style={styles.text33}>AFT LMT</Text>
            </View>
            <View style={styles.display3}>
              <Text style={[styles.text12, styles.additionalStyle]}>
                {data.ZfwCGFwdLimit.toFixed(2)}
              </Text>
              <Text style={[styles.text12, styles.additionalStyle]}>
                {data.ZfwCG.toFixed(2)}
              </Text>
              <Text style={[styles.text12, styles.additionalStyle]}>
                {data.ZfwCGAftLimit.toFixed(2)}
              </Text>
            </View>
            <View style={styles.display3}>
              <Text style={styles.text12}>FWD LMT</Text>
              <Text style={styles.text22}>TOWMAC</Text>
              <Text style={styles.text33}>AFT LMT</Text>
            </View>
            <View style={styles.display3}>
              <Text style={[styles.text12, styles.additionalStyle]}>
                {data.TowCGFwdLimit.toFixed(2)}
              </Text>
              <Text style={[styles.text22, styles.additionalStyle]}>
                {data.TowCG.toFixed(2)}
              </Text>
              <Text style={[styles.text33, styles.additionalStyle]}>
                {data.TowCGAftLimit.toFixed(2)}
              </Text>
            </View>
            <View style={styles.display3}>
              <Text style={styles.text12}>FWD LMT</Text>
              <Text style={styles.text22}>LWTMAC</Text>
              <Text style={styles.text33}>AFT LMT</Text>
            </View>
            <View style={styles.display3}>
              <Text style={[styles.text12, styles.additionalStyle]}>
                {data.LwCGFwdLimit.toFixed(2)}
              </Text>
              <Text style={[styles.text12, styles.additionalStyle]}>
                {data.LwCG.toFixed(2)}
              </Text>
              <Text style={[styles.text12, styles.additionalStyle]}>
                {data.LwCGAftLimit.toFixed(2)}
              </Text>

            </View>
       </View>
       </View>
          {/** 
        <View style={styles.display3}>
              <Text style={styles.textt12}>THRUST {data.thrust} </Text>
              <Text style={styles.textt22}>FLAP {data.flap}</Text>
              <Text style={styles.textt33}>STAB {data.stab}</Text>
            </View>
        */} 
            
      <View style={styles.display6}>
            <Text style={styles.textt12}>LOAD IN CPTS</Text>
            
        
                {data.CompartmentWeights.map((item, index) => (
                  <Text key={index} style={{flex:1, color: 'black',}}>
                  {`${index+1}/${item}`}
                  </Text>
                ))}
                {/** 
                <Text style={styles.text221}>{`1/${data.CompartmentWeights[0]}`}</Text>
            <Text style={styles.text331}>{`2/${data.CompartmentWeights[1]}`}</Text>
            <Text style={styles.text441}>{`3/${data.CompartmentWeights[2]}`}</Text>
            <Text style={styles.text551}>{`4/${data.CompartmentWeights[3]}`}</Text>
            <Text style={styles.text441}>{`5/${data.CompartmentWeights[4]}`}</Text>
            <Text style={styles.text551}>{`6/${data.CompartmentWeights[5]}`}</Text>
              */}
          
          </View>
          {data.AcftPurpose!== "FREIGHTER"  && 
           <View style={styles.display6}>
         
          {data.CabinStdLimits.map((item, index) => (
            <>
            <Text style={{  fontWeight: 'bold',
          color: 'black', }}>ZONES</Text>
         <Text style={{flex:1, width:'20%', marginLeft:10
   
       
         }}>
          {`${index+1}/${parseFloat(data.AdultInCabins[i]) + parseFloat(data.ChildInCabins[i]) + parseFloat(data.AdjustCrewInCabins[i])}`}
                </Text>
         </>      
        ))}
          
     </View>}
           
            {data.AcftPurpose !== "FREIGHTER" && <View style={styles.display3}>
            <Text style={styles.textt12}>
              PAX <Text style={{fontWeight: 'normal',}}>{`${totaladult}/${totalchild}/${totalinfant}`}</Text>
            </Text>
            <Text style={styles.textt22}>
              TTL <Text style={{fontWeight: 'normal'}}>{parseInt(totaladult)+parseInt(totalchild)+parseInt(totalinfant)}</Text>
            </Text>
            <Text style={styles.textt33}>
              POB <Text style={{fontWeight: 'normal'}}>{parseInt(pob) }</Text>
            </Text>
          </View>}
            
            <Text style={{color: 'black'}}>
              SI:<Text> {data.SpecialInstr}</Text>{' '}
            </Text>
            <Text
              style={{
                flexDirection: 'row',
                fontWeight: 'bold',
                textAlign:'center',
                color: 'black',
                marginBottom:10
              }}>
              LAST MINUTE CHANGES
            </Text>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={{fontWeight: 'bold', color: 'black'}}>DEST</Text>
              <Text style={{fontWeight: 'bold', color: 'black'}}>SPEC</Text>
              <Text style={{fontWeight: 'bold', color: 'black'}}>CL/CPT</Text>
              <Text style={{fontWeight: 'bold', color: 'black'}}>
                +/- WEIGHT
              </Text>
            </View>
            <Text
              style={{
                width: '100%',
                fontWeight: 'bold',
                marginBottom: 10,
                color: 'black',
              }}>
              ALL WEIGHTS IN KILOGRAM
            </Text>
            <Text
              style={{
                width: '100%',
                fontWeight: 'bold',
                marginBottom: 10,
                color: 'black',
              }}>
              PREPARED BY
              <Text style={{fontWeight: 'normal', color: 'black'}}>
                {' '}
                {data.TrimOfficer}
              </Text>
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                margin: 10,
              }}>
              <Text style={{color: 'black'}}>{data.UserId}</Text>
              <Text style={{color: 'black'}}>{formatDate(data.TrimGeneratedUTCTime)}</Text>
              <Text style={{color: 'black'}}>{formatTime(data.TrimGeneratedUTCTime)}  UTC</Text>
            </View>

            <Text style={{color:'black',letterSpacing:1}}>
              I CERTIFY THAT THIS AIRCRAFT HAS BEEN LOADED IN ACCORDANCE WITH
              THE AFM.
            </Text>
            <View style={{flexDirection: 'column'}}>
              <Text style={{fontWeight: 'bold', color: 'black'}}>
                {' '}
                LOAD OFFICER
              </Text>
              <Text style={{color: 'black'}}> {data.LoadOfficer}</Text>
              <Text style={{fontWeight: 'bold', color: 'black'}}>
                CAPTAIN / ATPL No
              </Text>
              <Text style={{marginBottom: 5, color: 'black'}}>{data.Captain}</Text>
            </View>
            <Text style={{color: 'black',letterSpacing:1}}>
              APPROVED LMC LIMITS :{data.ToleranceLimits}
            </Text>
            <Text style={{marginVertical: 5, color: 'black',letterSpacing:1}}>
              AUTOMATED LOAD & TRIMSHEET APPROVED BY DELHI DAW VIDE LETTER
              NO.DEL-11011(13)/9/2019- DAW-NR/1348 DATED 30-12-2020
            </Text>
            <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
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
            </View>

            <View style={styles.display5}>
             
              <TouchableOpacity
                style={{width: '500px'}}
                onPress={() => HTMLtoPDFExample(data, signaturePath)}>
                <Text
                  style={{
                    backgroundColor: 'blue',
                    padding: 10,
                    color: 'white',
                    borderRadius: 10,
                  }}>
                  pdf
                </Text>
              </TouchableOpacity>
           
              <TouchableOpacity
                style={{width: '300px'}}
                onPress={() => navigation.navigate('PDFTWO',{data:data,flightApiDetails})}>
                <Text
                  style={{
                    backgroundColor: 'blue',
                    padding: 10,
                    color: 'white',
                    borderRadius: 10,
                  }}>
                 pdf-2
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          ''
        )}
      </ScrollView>
    
      
    </>
  );
};

export default Trimsheet;

const styles = StyleSheet.create({
  container: {
   
    backgroundColor: 'grey',
   
  },
  display: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  text1: {
    width:'30%',
    alignSelf: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    color: 'black',
  },
  text2: {
    width: '10%',
    alignSelf:'center',
   textAlign:'right',
    color: 'black',
  },
  text3: {
    width: '40%',
    alignSelf: 'center',
    textAlign:'center',
    color: 'black',
  },
  text12: {
    width: '33.3%',
    alignSelf: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    color: 'black',
    textAlign:'center'
  },
  text22: {
    width: '33.3%',
    alignSelf: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    color: 'black',
    textAlign:'center'
  },
  text33: {
    width: '33.3%',
    alignSelf:'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    color: 'black',
    textAlign:'center'
  },
  textt12: {
    width:'33.3%',
    alignSelf:'center',
    justifyContent:'center',
    fontWeight: 'bold',
    color: 'black',
    
  },
  textt22: {
    width: '33.3%',
    alignSelf:'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    color: 'black',
    textAlign:'center'
  },
  textt33: {
    width: '33.3%',
    alignSelf: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    color: 'black',
    textAlign:'center'
  },
  container1: {
    padding: 5,
    margin: 10,
    backgroundColor: '#fff',
    color: 'black',
    borderRadius: 5,
  },
  display2: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  display3: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  additionalStyle: {
    fontWeight: 'normal',
    textAlign:'center'
  },
  display4: {
    alignSelf: 'center',
    width: '400px',
    margin: 10,
    borderRadius: 10,
  },
  display5: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin: 10,
    borderRadius: 10,
  },
  display6: {
    alignSelf: 'center',
    width: '400px',
   
    borderRadius: 10,
    flexDirection: 'row',
    marginBottom:10,
    
  },
  text121: {
    width:'20%',
   
   textAlign:"right",
    fontWeight: 'bold',
    color: 'black',
    
  },
  text221: {
    width: '15%',
    alignSelf: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    color: 'black',
  },
  text331: {
    width: '15%',
    alignSelf: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    color: 'black',
  },
  text441: {
    width: '15%',
    alignSelf: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    color: 'black',
  },
  text551: {
    width: '15%',
    alignSelf: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    color: 'black',
  },
  signatureText: {
    backgroundColor: 'red',
  },
});
