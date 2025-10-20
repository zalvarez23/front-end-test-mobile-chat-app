import React from 'react';
import { View } from 'react-native';
import * as SQLite from 'expo-sqlite';


const NoopStudio = () => null;


let useDrizzleStudio: any = NoopStudio;


if (__DEV__) {
  try {

    const expoDrizzleStudioPlugin = require('expo-drizzle-studio-plugin');
    if (expoDrizzleStudioPlugin && expoDrizzleStudioPlugin.useDrizzleStudio) {
      useDrizzleStudio = expoDrizzleStudioPlugin.useDrizzleStudio;
    }
  } catch (error) {
    console.warn('Drizzle Studio plugin not available, skipping integration', error);
  }
}

export function DrizzleStudioDevTool() {


  try {
    if (__DEV__ && useDrizzleStudio !== NoopStudio) {
      const db = SQLite.openDatabaseSync('chat-app.db');
      useDrizzleStudio(db);
    } else {

      useDrizzleStudio(null);
    }
  } catch (error) {
    console.warn('Failed to initialize Drizzle Studio:', error);

    useDrizzleStudio(null);
  }
  

  return <View />;
} 