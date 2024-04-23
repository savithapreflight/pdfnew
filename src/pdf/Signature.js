
import React, { useRef, useState} from "react";
import { View, Text, StyleSheet, TextInput,TouchableOpacity , KeyboardAvoidingView} from "react-native";
import RNSketchCanvas from "@kichiyaki/react-native-sketch-canvas";
import RNFS from "react-native-fs"; 
import { useNavigation } from '@react-navigation/native';
import { personalDetailsApi } from "../api/user/userDetailsApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from 'react-redux';
import { loginAction } from "../redux/slices/authSlice";
import { PermissionsAndroid } from 'react-native';
const Sign = ({route, navigation}) => {
  console.log('route',navigation)
  const [password, setPassword] = useState("");
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(true);
  const sketchRef = useRef(null);
  const dispatch=useDispatch()
  const userData=useSelector((state)=> state.auth.data)
  console.log('route params',route)
  const {ArrivalAirport,DepartureAirport,FlightNumber,acType,pdfName} = route.params.datas;
  console.log('needed user data',userData)

  async function requestStoragePermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
         " title": 'Storage Permission Required',
         " message": 'This app requires permission to write to external storage.',
        
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Storage permission granted');
        // Proceed with file saving logic here
      } else {
        console.log('Storage permission denied');
        // Handle permission denied case
      }
    } catch (err) {
      console.warn(err);
    }
  }

  const handleSketchSave = (success, path) => {
    if (success) {
      if(pdfName=='pdf'){
        navigation.navigate("Pdf", { signaturePath: path,data:{ ArrivalAirport,DepartureAirport,FlightNumber,acType,pdfName}});
      }else{
        navigation.navigate("PDFTWO", {signaturePath: path,data:{ArrivalAirport,DepartureAirport,FlightNumber,acType,pdfName }});
      }
       
    } else {
      console.log('not saved')
    }
  };
 
  const handleSave =async () => {
  requestStoragePermission()
  
     const loginActionData= await dispatch(loginAction(userData.userName,password))
     console.log('loginaxction',loginActionData)
     console.log(sketchRef.current.save())
     sketchRef.current.save('png', false, 'Signature_');
    //  if(loginActionData.error == false) {
     
    //   sketchRef.current.save('png', false, 'Signature_');
    //   setIsPasswordCorrect(true)
    // }else {
      
    //   setIsPasswordCorrect(false);
      
    // }
  };
  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 ,backgroundColor:'#fff'}}>
    <View style={styles.container}>
      <View style={styles.sketchContainer}>
        <RNSketchCanvas
          ref={sketchRef}
          containerStyle={{ backgroundColor: "transparent", flex: 1, }}
          canvasStyle={{ backgroundColor: "transparent", flex: 1 }}
          defaultStrokeIndex={0}
          defaultStrokeWidth={4}
          
         
          clearComponent={
            <View style={styles.functionButton}>
              <Text style={{ color: "white" }}>Clear</Text>
            </View>
          }
         
         
       
          saveComponent={
          <TouchableOpacity onPress={handleSave} style={styles.functionButton}>
              <Text style={{ color: "white" }}>Save</Text>
            </TouchableOpacity>
          }
          onSketchSaved={handleSketchSave}
          savePreference={() => {
           
            return {
              folder: 'RNSketchCanvas',
              filename: 'image',
              transparent: true,
              imageType: 'jpg',
              includeImage: true,
              includeText: false,
              cropToImageSize: true
              
            };

          }}
          permissionDialogTitle="Permission Required"
        permissionDialogMessage="This app requires permission to save images to your device."
        />
      </View>
      {/* <View style={{width:'100%',borderColor:'black',marginVertical:10,height:'10px'}}>
              <TextInput style={{ color: "white",borderWidth:1,marginHorizontal:10,borderRadius:5}} placeholder="Enter the Password" onChangeText={(e)=>setPassword(e.target.value)}></TextInput>
            </View> */}
           
            <View style={styles.passwordContainer}>
        <TextInput
          style={{ color: "black", borderWidth: 1,  borderRadius: 5,height:50 }}
          placeholder="Enter the Password"
          
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        {!isPasswordCorrect && <Text style={{ color: "red" ,marginHorizontal:10}}>Incorrect password. Please try again.</Text>}
      </View>
    </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
     justifyContent: "center",
     alignItems: "center",
    backgroundColor: "#fff",
  },
  sketchContainer: {
    width:"80%", 
    height:400, 
    borderWidth: 1,
   
    borderColor: "black",
    overflow: "hidden",
    borderRadius:5,
    backgroundColor:'#fff' ,
   
  },
  passwordContainer: {
    width: "80%",
    borderColor: "black",
    marginVertical: 10,
    height: 50,
    color:'black'
  },
  strokeColorButton: {
    marginHorizontal: 2.5,
    marginVertical: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  strokeWidthButton: {
    marginHorizontal: 2.5,
    marginVertical: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#39579A",
  },
  functionButton: {
    marginHorizontal: 2.5,
    marginVertical: 8,
    height: 30,
    width: 60,
    backgroundColor: "#39579A",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
});

export default Sign;

