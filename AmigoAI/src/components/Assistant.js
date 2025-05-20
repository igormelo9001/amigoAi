import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { Audio, MediaRecorder } from 'expo-audio';
import AudioVisualizer from './AudioVisualizer';

const Assistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [spokenText, setSpokenText] = useState('');
  const [recorder, setRecorder] = useState(null);
  const [audioUri, setAudioUri] = useState(null);
  const [amplitude, setAmplitude] = useState(0);

  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== 'granted') {
        console.error('Permission denied');
        return;
      }

      const mediaRecorder = new MediaRecorder();
      
      mediaRecorder.addEventListener('dataavailable', (event) => {
        if (event.data.size > 0) {
          setAudioUri(URL.createObjectURL(event.data));
        }
      });

      mediaRecorder.addEventListener('start', () => {
        setIsListening(true);
      });

      mediaRecorder.addEventListener('stop', () => {
        setIsListening(false);
      });

      // Set up audio analyzer for visualization
      const audioContext = new Audio.AudioContext();
      const analyser = audioContext.createAnalyser();
      const microphone = await audioContext.createMediaStreamSource(stream);
      microphone.connect(analyser);
      
      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateAmplitude = () => {
        if (isListening) {
          analyser.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / bufferLength;
          setAmplitude(average / 128.0); // Normalize to 0-1 range
          requestAnimationFrame(updateAmplitude);
        }
      };

      updateAmplitude();
      
      await mediaRecorder.start();
      setRecorder(mediaRecorder);
      
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  const stopRecording = async () => {
    try {
      if (recorder) {
        await recorder.stop();
        setRecorder(null);
      }
    } catch (error) {
      console.error('Failed to stop recording:', error);
    }
  };

  const playRecording = async () => {
    try {
      if (audioUri) {
        const audio = new Audio.Audio();
        await audio.loadAsync({ uri: audioUri });
        await audio.playAsync();
      }
    } catch (error) {
      console.error('Failed to play recording:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.statusText}>
        {isListening ? 'Ouvindo...' : 'Toque para falar'}
      </Text>

      <AudioVisualizer amplitude={amplitude} />

      <TouchableOpacity 
        style={[styles.button, isListening && styles.buttonListening]}
        onPress={isListening ? stopRecording : startRecording}
      >
        <MaterialCommunityIcons 
          name={isListening ? "microphone" : "microphone-outline"} 
          size={30} 
          color="#fff" 
        />
      </TouchableOpacity>

      {audioUri && (
        <TouchableOpacity 
          style={styles.playButton}
          onPress={playRecording}
        >
          <MaterialCommunityIcons 
            name="play-circle" 
            size={30} 
            color="#00ff00" 
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  statusText: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 20,
  },
  button: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    borderWidth: 2,
    borderColor: '#00ff00',
  },
  buttonListening: {
    backgroundColor: '#002200',
  },
  playButton: {
    marginTop: 20,
  },
});

export default Assistant;