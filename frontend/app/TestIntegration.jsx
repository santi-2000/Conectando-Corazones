import React from 'react';
import { View, StyleSheet } from 'react-native';
import BackendIntegration from '../components/BackendIntegration';

const TestIntegration = () => {
  return (
    <View style={styles.container}>
      <BackendIntegration />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default TestIntegration;
