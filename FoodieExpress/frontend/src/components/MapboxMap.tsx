// src/components/MapboxMap.tsx
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import { MAPBOX_ACCESS_TOKEN } from '../config/mapboxConfig';
import { RESTAURANTS } from '../home/HomeScreen';

MapboxGL.setAccessToken(MAPBOX_ACCESS_TOKEN);

const { width, height } = Dimensions.get('window');

export default function MapboxMap() {
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  // Request location permission is handled elsewhere; this just updates the state when location changes.
  const onUserLocationUpdate = (location: any) => {
    setUserLocation(location.coords);
  };

  // Render restaurant markers
  const renderMarkers = () => {
    return RESTAURANTS.map((rest) => (
      <MapboxGL.PointAnnotation
        key={`rest-${rest.id}`}
        id={`rest-${rest.id}`}
        coordinate={[rest.lng || 0, rest.lat || 0]} // Placeholder coordinates; replace with real lat/lng
      >
        <View style={styles.marker} />
      </MapboxGL.PointAnnotation>
    ));
  };

  return (
    <View style={styles.container}>
      <MapboxGL.MapView style={styles.map} logoEnabled={false} compassEnabled={true}>
        <MapboxGL.Camera
          zoomLevel={12}
          centerCoordinate={userLocation ? [userLocation.longitude, userLocation.latitude] : [0, 0]}
        />
        <MapboxGL.UserLocation onUpdate={onUserLocationUpdate} />
        {renderMarkers()}
      </MapboxGL.MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: height * 0.3,
    width: '100%',
    marginBottom: 16,
  },
  map: {
    flex: 1,
  },
  marker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#1DB954',
    borderWidth: 2,
    borderColor: '#fff',
  },
});
