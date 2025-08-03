import DeviceInfo from 'react-native-device-info';
//run npm install react-native-device-info

/**
 * Generates and stores a unique device ID in AsyncStorage
 * @returns Promise<string> The unique device ID
 */
export async function getDeviceId(): Promise<string> {
  try {
    const deviceId = await DeviceInfo.getUniqueId();
    return deviceId;
  } catch (error) {
    throw new Error('Error generating device ID:' + error);
  }
}