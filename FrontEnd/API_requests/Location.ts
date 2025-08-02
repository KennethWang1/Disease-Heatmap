import * as Location from 'expo-location';

async function getCurrentLocation() {
    try {
        // Request permission to access location
        const { status } = await Location.requestForegroundPermissionsAsync();
        
        if (status !== 'granted') {
            throw new Error('Location permission not granted');
        }

        const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
        });

        return {
            longitude: location.coords.longitude,
            latitude: location.coords.latitude
        };
    } catch (error) {
        console.error('Error getting location:', error);
        throw error;
    }
}

export { getCurrentLocation };