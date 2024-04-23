import {
    Image,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput,
    Alert,
  } from 'react-native';
  import React, { useEffect, useState } from 'react';
  import { ScrollView } from 'react-native';
  import DropDownPicker from 'react-native-dropdown-picker';
  import { Picker } from '@react-native-picker/picker';
  import axios from 'axios';
import { personalDetailsApi } from '../../api/user/userDetailsApi';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';


 
  
  
  const FuelSheet = ({ route }) => {
    const navigation=useNavigation()
    const { flightNo, depart,arriv,acType } = route.params;
    console.log("nasdfg",flightNo, depart,arriv,acType)
    const [extraFuel, setExtraFuel] = useState('');
    const [selectedReason, setSelectedReason] = useState(null);
    const [reasonDropdownOpen, setReasonDropdownOpen] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [ezfw,setEzfw] = useState('');
    const [fuelId,setFuelId] = useState('');
    const [iataCode,setIataCode] = useState('')
    const [metarText, setMetarText] = useState('');
    const [iataCodearriv,setIataCodearriv] = useState('')
    const [metarArriv,setMetarArriv] = useState('');
    const [rTow,setRTow] = useState('')
    const [eRtow, setERtow] = useState('');

   
    
    useEffect(()=>{
      handleFuelApi(flightNo, depart);
      handleMetar();
      handleiaco(depart,arriv);
      
    },[flightNo, depart,arriv])

   
    const handleiaco = async (depart,arriv) => {

      const authData = await AsyncStorage.getItem('@auth');
      const authObject = JSON.parse(authData);
      const tokens = authObject?.token
      
      try {
        const departs = depart;
        const arrivs = arriv;
        const apiUrl = `http://20.204.102.191/navdata.API/ICAO?IATACodes=${departs}%2C${arrivs}`;
        console.log(apiUrl, "iaco code api");
        

        const token = tokens
        
        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          const data = response.data;
      console.log("ICAO Data:", data);
      const icaoValues = response.data.icao;
      
      if (icaoValues && icaoValues.length >= 2) {
       
        handleMetar(icaoValues[0]);
        handleMetarArriv(icaoValues[1]);
      } else {
        console.warn("No ICAO values available.");
      }

        } else {
          console.error('Error fetching data. Unexpected response:', response.status);
          return null; 
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        return null; 
      }
    };
   
    

    const handleFuelApi = async (flightNo, depart) => {
      
     

      const authData = await AsyncStorage.getItem('@auth');
      const authObject = JSON.parse(authData);
      const tokens = authObject?.token
      
      try {
        // personalDetailsApi();
        const currentDate = new Date().toISOString().split('T')[0] + 'T00:00:00';
        // console.log(currentDate, "current date");
    
        // const source = 'SZB';
        const source = depart;
        const apiUrl = `http://20.204.102.191/lOADSHEET.API/LoadSheet?Flight_Date=${currentDate}&Source=${source}`;
        // console.log(apiUrl, "apiurl fuel");
    
        
        const token = tokens
        
        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
    
        // console.log("Response status:", response.status);
        // console.log("Response headers:", response.headers);
    
        if (response.status === 200) {
          const data = response.data;
          // console.log("Response data:", data);
    
          const filteredData = data.filter(item => item.flight_no === flightNo);
          // console.log("Filtered data:", filteredData);

          if (filteredData && filteredData.length > 0) {
            const ezfwValuesText = filteredData.map(item => `${item.ezfw} KG`).join('\n');
            setEzfw(ezfwValuesText); // Set the formatted text to state
            // console.log("EZFW Values:\n", ezfwValuesText);
            const id = filteredData.map(item => `${item.id}`);
            setFuelId(id)
            const iatas = filteredData.map(item => `${item.iata}`);
            setIataCode(iatas)
            console.log(iatas,"iatassss")
            // console.log(id,"idddd")
          } else {
            console.warn("No filtered data available.");
          }
    
          return filteredData;
        } else {
          console.error('Error fetching data. Unexpected response:', response.status);
          // Alert.alert('Error fetching data', 'Unexpected response from the server');
          return null; 
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        // Alert.alert('Error fetching data', error.message);
        return null; 
      }
    };

    const handleMetar = async (icaoCode) => {
      console.log("iacodoe ",icaoCode)
      try {
        const authData = await AsyncStorage.getItem('@auth');
        const authObject = JSON.parse(authData);
        const tokens = authObject?.token;
    
        const airport = icaoCode;
        // const airport = 'WMKP';
        console.log(airport,"airporttt")
        const apiUrlss = `http://20.204.102.191/Weather.API/METAR?Aiports=${airport}`;
        console.log(apiUrlss, 'apiurls');
    
        const token = tokens;
    
        const response = await axios.get(
          apiUrlss,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
    
        console.log(response, 'response api metar');
    
        // Access the first element of the data array
        const metarData = response.data[0]?.metar;
        setMetarText(metarData)
        // Log the METAR data
        console.log(metarData, "dataaaaaaaaaaa");
      } catch (error) {
        console.error('Error submitting data:', error);
      }
    };

    const handleMetarArriv = async (icaoCode) => {
      // console.log("iacodoearriv ",icaoCode)
      try {
        const authData = await AsyncStorage.getItem('@auth');
        const authObject = JSON.parse(authData);
        const tokens = authObject?.token;
    
        const airport = icaoCode;
        const apiUrlss = `http://20.204.102.191/Weather.API/METAR?Aiports=${airport}`;
    
        const token = tokens;
    
        const response = await axios.get(
          apiUrlss,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        const metarDataarriv = response.data[0]?.metar;
        setMetarArriv(metarDataarriv)
        // console.log(metarDataarriv,"arriv metar")
      } catch (error) {
        console.error('Error submitting data:', error);
      }
    };
  
    const reasonItems = [
      // { label: 'Select', value: null }, 
      'Terminal Weather',
      'Enroute Weather',
      'ATC',
      'Runway Closure',
      'NOTAM Mandate',
    ];
    
  
    const handleExtraFuelChange = (text) => {
      if (/^\d*$/.test(text)) {
        setExtraFuel(text);
      }
    };

    const handleRtowChange = (text) => {
      if (/^\d*$/.test(text)) {
        setERtow(text);
      }
    };
  
    const handleReasonSelect = (item) => {
      setSelectedReason(item.label); 
      setReasonDropdownOpen(false);
      // console.log('Selected Reason Label:', item.label);
    };


    const handleLoadSheet=()=>
    {
      navigation.navigate('Pdf',{data: flightNo, depart,arriv,acType })
    };
   

    
    
  
   
  const handleSubmit = async () => {
   
    const authData = await AsyncStorage.getItem('@auth');
      const authObject = JSON.parse(authData);
      const tokens = authObject?.token
    try {
      if (!eRtow) {
        setError('Please fill in the RTOW.');
        setSuccessMessage('');
        setTimeout(() => setError(''), 5000);
        return;
      }
      if (!extraFuel) {
        setError('Please fill in the extra fuel field.');
        setSuccessMessage('');
        setTimeout(() => setError(''), 5000);
        return;
      }
  
      if (!selectedReason) {
        setError('Please select a reason.');
        setSuccessMessage('');
        setTimeout(() => setError(''), 5000); 
        return;
      }
console.log('rtow',eRtow)
      console.log('Extra Fuel:', extraFuel);
      console.log('Selected Reason:', selectedReason);

      setError('');

      
      const loadSheetId = fuelId;
      const apiUrls = `http://20.204.102.191/lOADSHEET.API/LoadSheet/id?id=${loadSheetId}`;
      
// console.log(apiUrls,"apiurls")
      const token = tokens; 

      const response = await axios.put(
        apiUrls,
        {
          rtow : parseFloat(eRtow),
          extFuel: parseFloat(extraFuel), 
          reason: selectedReason,
          
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // console.log(response,"response api")
    

      if (response.status === 204) {
        setSuccessMessage('Fuel Order send successfully!');
        setTimeout(() => setSuccessMessage(''), 5000);
      } else {
        console.error('Error submitting data. Unexpected response:', response.status);
      
      }
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };
  
    return (
       
  
      <View style={styles.container}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.fuelButton}
          onPress={handleFuelApi}>
            <Text style={styles.buttonText}>FUEL BRIEFING</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.loadButton}onPress={handleLoadSheet}   >
            <Text style={styles.buttonText}>LOAD SHEET</Text>
          </TouchableOpacity>
          <View>
            <Text />
          </View>
          <TouchableOpacity style={styles.refreshButton}>
            <Text style={styles.buttonText}>REFRESH</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View>
          <Text style={styles.flightDetailsText}>Flight Details</Text>
          <Text style={styles.flightDetailsText1}>
            {/* XX1234 DELBLR VT-XXX B737-800 */}
            {flightNo} {depart}{arriv}  {acType}
          </Text>
        </View>
        <View style={styles.gap}>
          <Text style={styles.flightDetailsText2}>METAR</Text>
          <Text style={styles.metertext}>
            {metarText} 
          </Text>
          <Text style={styles.metertext1}>
           {metarArriv}
         </Text>
        </View>
        <View style={styles.containers}>
          <View style={styles.cell}>
            <Text style={styles.text}>FLT PLAN DIST</Text>
            <Text style={styles.text}>FLT LVL</Text>
            <Text style={styles.text}>EZFW</Text>
            <Text style={styles.text}>EST TRIP FUEL</Text>
            <Text style={styles.text}>TAXI FUEL/TIME</Text>
            <Text style={styles.text}>COMP EXTRA</Text>
          </View>
          <View style={styles.cell1}>
            <Text style={styles.text}>994 NM</Text>
            <Text style={styles.text}>340/350</Text>
            <Text style={styles.text}>{ezfw}</Text>
            <Text style={styles.text}>6800 KG</Text>
            <Text style={styles.text}>200 KG / 15 MINS</Text>
            <Text style={styles.text}>350 KG</Text>
          </View>
        </View>
        <View style={styles.containers}>
          <View style={styles.cell}>
            <Text style={styles.text1}>MAX EXTRA FUEL</Text>
          </View>
          <View style={styles.cell1}>
            <Text style={styles.text1}>1750 KG</Text>
          </View>
        </View>
        <View style={styles.horizontalLine}></View>
        <View style={styles.container}>
          <View style={styles.fuel}>
            <Text style={styles.flightDetailsText}>Fuel Order</Text>
            <Text style={styles.flightDetailsText1}>
            {flightNo} {depart}{arriv}  {acType}
              {/* XX1234 DELBLR VT-XXX B737-800 */}
            </Text>
          </View>
          <View style={styles.input}>
          <View style={styles.formRow}>
              <Text style={styles.formTitle}>RTOW (KG)</Text>
              <TextInput
              style={styles.textInput}
              placeholder="Enter RTOW KG"
              keyboardType="numeric"
              value={eRtow}
              onChangeText={handleRtowChange}
            />
            </View>
            <View style={styles.formRow}>
              <Text style={styles.formTitle}>EXTRA FUEL REG (KG)</Text>
              <TextInput
              style={styles.textInput}
              placeholder="Enter FUEL IN KG"
              keyboardType="numeric"
              value={extraFuel}
              onChangeText={handleExtraFuelChange}
            />
            </View>
            <View style={styles.formRow}>
          <Text style={styles.formTitle}>REASON</Text>
          <DropDownPicker
  open={reasonDropdownOpen}
  value={selectedReason}
  items={reasonItems.map(label => ({ label, value: label }))}
  setOpen={setReasonDropdownOpen}
  setValue={setSelectedReason}
  setItems={() => {}}
  placeholder="Select Reason"
  textStyle={styles.dropdownText}
  containerStyle={styles.dropDownPicker}
  style={styles.textInput1}
  dropDownContainerStyle={styles.dropDownContainer}
  onChangeItem={handleReasonSelect}
  scrollViewProps={{
    persistentScrollbar: true,
  }}
/>

          
        </View>
        <View style={styles.output}>
          <Text style={styles.etext}>{error}</Text>
          <Text style={styles.stext}>{successMessage}</Text>
          </View>
          </View>
        </View>
         </ScrollView>
        
        <View style={styles.bottomButtonsContainer}>
          <TouchableOpacity style={styles.changeButton}>
            <Text style={styles.buttonText}>CHANGE</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.buttonText}>SUBMIT</Text>
          </TouchableOpacity>
        </View>
      </View>
            
    );
  };
  
  const styles = StyleSheet.create({
    scrollContainer: {
      flexGrow: 0,
      justifyContent: 'flex-start',
      padding: 20,
    },
    
    container: {
      flex: 1,
      justifyContent: 'flex-start',
      padding: 20,
      ...Platform.select({
        ios: {
          paddingTop: 40, 
        },
      }),
    },
    buttonContainer: {
      flexDirection: 'row',
      width:'100%',

      
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    fuelButton: {
      backgroundColor: '#9AC83E',
      padding: 10,
      borderRadius: 5,
      marginLeft: 10,
    },
    loadButton: {
      backgroundColor: '#28B0DA',
      padding: 10,
      borderRadius: 5,
      marginRight: 20,
    },
    refreshButton: {
      backgroundColor: '#28B0DA',
      padding: 10,
      borderRadius: 5,
    },
    buttonText: {
      color: 'black',
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 19,
    },
    flightDetailsText: {
      fontSize: 24,
      textAlign: 'center',
      fontWeight: 'bold',
      marginBottom: 10,
    },
    flightDetailsText1: {
      fontSize: 20,
      textAlign: 'center',
    },
    flightDetailsText2: {
      fontSize: 24,
      textAlign: 'center',
    },
    gap: {
      marginTop: 30,
      padding: 10,
      justifyContent:'center',
      alignSelf:'center'
    },
    metertext: {
      padding: 16,
      fontSize: 15,
    },
    metertext1: {
      padding: 16,
      fontSize: 15,
     bottom:29,
    },
    containers: {
      flexDirection: 'row',
      paddingHorizontal: 20,
    },
    cell: {
      flex: 1,
      padding: 10,
      marginVertical: 5,
    },
    cell1: {
      flex: 1,
      padding: 10,
      marginVertical: 5,
    },
    text: {
      textAlign: 'left',
      fontSize: 15,
      marginBottom: 7,
    },
    text1: {
      textAlign: 'left',
      fontSize: 19,
      marginBottom: 7,
      fontWeight: 'bold',
    },
    horizontalLine: {
      borderBottomColor: 'black',
      borderBottomWidth: 3,
      marginVertical: 10,
    },
    formRow: {
      flex:1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginVertical: 10,
      width: '100%', 
      marginBottom:1,
      marginTop:4
    },
    
    formTitle: {
      fontWeight: 'bold',
      fontSize: 16,
      width: '30%', // Set a fixed width for the labels
    },
    textInput: {
      borderWidth: 1,
      borderColor: 'black',
      padding: 8,
      borderRadius: 5,
      flex: 1, 
      ...Platform.select({
        ios: {
          marginBottom: 10,
        },
        android: {
          marginBottom: 10,
        },
      }),
    },
    textInput1: {
      borderWidth: 1,
      borderColor: 'black',
      padding: 8,
      borderRadius: 5,
      width: '100%', // Set a fixed width for the text input
      marginBottom: 10,
    },
    
    
    bottomButtonsContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      paddingHorizontal: 20,
      marginBottom: 'auto',
    },
    submitButton: {
      backgroundColor: '#9AC83E',
      padding: 10,
      borderRadius: 5,
      marginLeft: 10,
    },
    changeButton: {
      backgroundColor: '#28B0DA',
      padding: 10,
      borderRadius: 5,
    },
    fuel: {
      flex: 0.3,
    },
    input: {
      paddingHorizontal: 10,
      flex:1
    },
    dropDownPicker: {
      width: '70%', // Set a percentage width
      borderColor: 'black',
      ...Platform.select({
        landscape: {
          width: '40%', // Adjust the width for landscape mode
        },
      }),
    },
    dropdownText: {
      fontSize: 16,
    },
    // dropDownPicker: {
    //   width: '50%',
    //   marginTop: 8,
    // },
    dropDownContainer: {
      borderColor: 'black',
      
    },
    output:
    {
      justifyContent:'center',
      alignItems:'center',
      
    },
    etext:{
      fontSize:18,
      color:'red',
      top:15
    },
    stext:{
      fontSize:18,
      color:'green'
    }
   
    
  });
  
  export default FuelSheet;
  