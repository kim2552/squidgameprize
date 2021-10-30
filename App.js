import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';

const startTotalPlayers = 456
const startTotalCash = 100000
const source = require('./assets/sound_effect_chiptune.mp3')

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

export default class App extends React.Component {
  state = {
    status: 0,  // 0=not playing, 1=finished playing, 2=playing
    numPlayers: startTotalPlayers,
    totalCash: startTotalCash,
    playingStatus: "nosound",
  }

  async _playRecording() {
    if (this.sound != null) {
      await this.sound.playAsync()
      this.setState({
        playingStatus: 'playing'
      });   
    }else{
      const { sound } =  await Audio.Sound.createAsync(source)
      this.sound = sound
      await this.sound.playAsync()
      this.setState({
        playingStatus: 'playing'
      })
    }
  }

  async _pauseRecording(){
    if (this.sound != null) {
      console.log('pausing...')
      await this.sound.pauseAsync()
      console.log('paused!')
      this.setState({
        playingStatus: 'donepause',
      })
      this.sound.unloadAsync()
      this.sound = null
    }
  }

  decreaseNumPlayers = () => {
    this.setState({
      numPlayers: this.state.numPlayers - 1,
      totalCash: this.state.totalCash + startTotalCash
    })
    console.log("Value: "+(this.state.numPlayers - 1))
  }

  async playTheGame(){
    if(this.state.status == 0){
      this.state.status = 2
      this._playRecording()
      for(let i = 1; i < startTotalPlayers; i++){
        this.decreaseNumPlayers()
        await new Promise(r => setTimeout(r, 15))
      }
      this._pauseRecording()
      this.state.status = 1
    }else if(this.state.status == 1){
      this.setState({
        status: 0,
        numPlayers: 456,
        totalCash: 100000,
        playingStatus: "nosound",
      })
    }else{}
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => {this.playTheGame()}}
          style={{ backgroundColor: '#172525',position: 'absolute', top: 30, left: 20 }}>
          <Text style={{ fontSize: 20, color: '#dfebe4' }}>{this.state.status == 0 ? "Start":"Restart"}</Text>
        </TouchableOpacity>

        <Text style={styles.text1}>*참가인원* </Text>
        <Text style={styles.text2}>NUMBER OF PLAYERS</Text>
        
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.text3}>{this.state.numPlayers}</Text><Text style={styles.text1}>명</Text>
        </View>
        <Text style={styles.text1}>*총 상금*</Text>
        <Text style={styles.text2}>CASH PRIZE</Text>
        <Text style={styles.text4}>₩ {numberWithCommas(this.state.totalCash)}</Text>

        <StatusBar style="auto" />
      </View>
    );    
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#172525',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text1: {
    fontFamily: 'monospace',
    fontStyle: 'normal',
    fontSize: 20,
    color: '#dfebe4',
  },
  text2: {
    fontFamily: 'monospace',
    fontStyle: 'normal',
    fontSize: 20,
    color: '#dfebe4',
  },
  text3: {
    fontFamily: 'monospace',
    fontStyle: 'normal',
    fontSize: 50,
    color: '#dfebe4',
  },
  text4: {
    fontFamily: 'monospace',
    fontStyle: 'normal',
    fontSize: 50,
    color: '#dfebe4',
  },
});
