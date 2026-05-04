import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

interface Marker {
    id: string | number;
    lat: number;
    lng: number;
    title?: string;
}

interface UniversalMapProps {
    lat?: number;
    lng?: number;
    markers?: Marker[];
    zoom?: number;
    style?: any;
    isPicker?: boolean;
    routeGeoJSON?: any;
    onLocationChange?: (lat: number, lng: number) => void;
}

const UniversalMap: React.FC<UniversalMapProps> = ({ lat, lng, markers = [], zoom = 12, style, isPicker, routeGeoJSON, onLocationChange }) => {
    // Default coordinates (Hyderabad as seen in previous steps)
    const centerLat = lat || (markers.length > 0 ? markers[0].lat : 17.3850);
    const centerLng = lng || (markers.length > 0 ? markers[0].lng : 78.4867);

    // OpenFreeMap Styles: 'liberty', 'bright', 'dark', 'positron'
    const MAP_STYLE = 'https://tiles.openfreemap.org/styles/dark';

    const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link href="https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.css" rel="stylesheet" />
        <script src="https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.js"></script>
        <style>
          html, body, #map { height: 100%; margin: 0; padding: 0; background: #121212; }
          .maplibregl-ctrl-attrib { display: none !important; }
          #center-pin {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -100%);
            z-index: 100;
            pointer-events: none;
            display: ${isPicker ? 'block' : 'none'};
          }
          #center-pin img { width: 40px; height: 40px; }
        </style>
      </head>
      <body>
        <div id="center-pin">
          <img src="https://cdn-icons-png.flaticon.com/512/684/684908.png" />
        </div>
        <div id="map"></div>
        <script>
          const map = new maplibregl.Map({
            container: 'map',
            style: '${MAP_STYLE}',
            center: [${centerLng}, ${centerLat}],
            zoom: ${zoom},
            attributionControl: false
          });

          map.on('move', () => {
            if (${isPicker}) {
              const center = map.getCenter();
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'location',
                lat: center.lat,
                lng: center.lng
              }));
            }
          });

          map.on('load', () => {
            const markerData = ${JSON.stringify(markers)};
            const iconUrl = 'https://cdn-icons-png.flaticon.com/512/684/684908.png';
            
            if (!${isPicker} && markerData.length > 0) {
              markerData.forEach(m => {
                const el = document.createElement('div');
                el.style.width = '30px';
                el.style.height = '30px';
                el.style.backgroundImage = 'url(' + iconUrl + ')';
                el.style.backgroundSize = 'cover';
                
                new maplibregl.Marker(el)
                  .setLngLat([m.lng, m.lat])
                  .addTo(map);
              });
            } else if (!${isPicker}) {
              // Single marker mode
              new maplibregl.Marker({ color: '#1DB954' })
                .setLngLat([${centerLng}, ${centerLat}])
                .addTo(map);
            }

            // Route rendering
            const routeData = ${JSON.stringify(routeGeoJSON)};
            if (routeData) {
              map.addSource('route', {
                'type': 'geojson',
                'data': routeData
              });
              map.addLayer({
                'id': 'route',
                'type': 'line',
                'source': 'route',
                'layout': { 'line-join': 'round', 'line-cap': 'round' },
                'paint': { 'line-color': '#1DB954', 'line-width': 5 }
              });
            }
          });
        </script>
      </body>
    </html>
  `;

    const handleMessage = (event: any) => {
        if (onLocationChange) {
            try {
                const data = JSON.parse(event.nativeEvent.data);
                onLocationChange(data.lat, data.lng);
            } catch (e) {
                console.error('Error parsing map message:', e);
            }
        }
    };

    return (
        <View style={[styles.container, style]}>
            <WebView
                originWhitelist={['*']}
                source={{ html: htmlContent }}
                scrollEnabled={false}
                onMessage={handleMessage}
                style={styles.webview}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        overflow: 'hidden',
    },
    webview: {
        flex: 1,
        backgroundColor: '#121212',
    },
});

export default UniversalMap;
