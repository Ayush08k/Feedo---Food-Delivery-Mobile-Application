import React, { useRef, useCallback } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
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

const UniversalMap: React.FC<UniversalMapProps> = ({
    lat,
    lng,
    markers = [],
    zoom = 14,
    style,
    isPicker = false,
    routeGeoJSON,
    onLocationChange,
}) => {
    const webViewRef = useRef<WebView>(null);

    // Stable center — only used on first render; map movement is handled inside JS
    const centerLat = lat ?? (markers.length > 0 ? markers[0].lat : 17.3850);
    const centerLng = lng ?? (markers.length > 0 ? markers[0].lng : 78.4867);

    const markersJson = JSON.stringify(markers);
    const routeJson = JSON.stringify(routeGeoJSON ?? null);

    // Full HTML injected once — map never re-renders from React side
    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link href="https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.css" rel="stylesheet" />
  <script src="https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.js"></script>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body, #map { width: 100%; height: 100%; background: #121212; }
    .maplibregl-ctrl-attrib, .maplibregl-ctrl-logo { display: none !important; }

    #loading {
      position: absolute; inset: 0;
      background: #121212;
      display: flex; align-items: center; justify-content: center;
      z-index: 200; flex-direction: column; gap: 12px;
    }
    #loading .spinner {
      width: 36px; height: 36px;
      border: 3px solid #333;
      border-top-color: #1DB954;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    #loading p { color: #A0A0A0; font-family: sans-serif; font-size: 13px; }
    @keyframes spin { to { transform: rotate(360deg); } }

    #center-pin {
      position: absolute;
      top: 50%; left: 50%;
      transform: translate(-50%, -100%);
      z-index: 100; pointer-events: none;
      display: ${isPicker ? 'flex' : 'none'};
      flex-direction: column; align-items: center;
    }
    #center-pin .pin-dot {
      width: 18px; height: 18px;
      background: #1DB954;
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(0,0,0,0.5);
    }
    #center-pin .pin-stem {
      width: 2px; height: 14px;
      background: #1DB954;
    }
    #center-pin .pin-shadow {
      width: 10px; height: 4px;
      background: rgba(0,0,0,0.3);
      border-radius: 50%;
    }
    #gps-btn {
      position: absolute; bottom: 16px; right: 16px;
      background: #1DB954; color: black;
      border: none; border-radius: 50%;
      width: 44px; height: 44px;
      font-size: 20px; cursor: pointer;
      z-index: 150; display: flex; align-items: center; justify-content: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.4);
    }
  </style>
</head>
<body>
  <div id="loading">
    <div class="spinner"></div>
    <p>Loading map…</p>
  </div>
  <div id="center-pin">
    <div class="pin-dot"></div>
    <div class="pin-stem"></div>
    <div class="pin-shadow"></div>
  </div>
  <div id="map"></div>
  ${isPicker ? '<button id="gps-btn" title="My location">📍</button>' : ''}

  <script>
    var isPicker = ${isPicker ? 'true' : 'false'};
    var map = new maplibregl.Map({
      container: 'map',
      style: 'https://tiles.openfreemap.org/styles/dark',
      center: [${centerLng}, ${centerLat}],
      zoom: ${zoom},
      attributionControl: false
    });

    // Hide loading overlay once tiles start rendering
    map.on('render', function() {
      var el = document.getElementById('loading');
      if (el) el.style.display = 'none';
    });

    // Picker: send location only on drag/zoom END (not every frame)
    var lastSent = 0;
    function sendCenter() {
      var now = Date.now();
      if (now - lastSent < 300) return; // throttle 300ms
      lastSent = now;
      var c = map.getCenter();
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'location', lat: c.lat, lng: c.lng
        }));
      }
    }

    if (isPicker) {
      map.on('moveend', sendCenter);
      map.on('dragend', sendCenter);
      map.on('zoomend', sendCenter);

      // GPS button
      var gpsBtn = document.getElementById('gps-btn');
      if (gpsBtn) {
        gpsBtn.addEventListener('click', function() {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(pos) {
              map.flyTo({ center: [pos.coords.longitude, pos.coords.latitude], zoom: 16 });
              sendCenter();
            }, function() {
              alert('Could not get your location.');
            }, { enableHighAccuracy: true, timeout: 10000 });
          }
        });
      }
    }

    map.on('load', function() {
      var markerData = ${markersJson};
      var routeData = ${routeJson};

      // Add markers (non-picker mode)
      if (!isPicker) {
        if (markerData.length > 0) {
          markerData.forEach(function(m) {
            var el = document.createElement('div');
            el.style.cssText = 'width:24px;height:24px;background:#1DB954;border:3px solid white;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.5);cursor:pointer;';
            new maplibregl.Marker(el).setLngLat([m.lng, m.lat]).addTo(map);
          });
        } else {
          // Single pin at center
          var el2 = document.createElement('div');
          el2.style.cssText = 'width:24px;height:24px;background:#1DB954;border:3px solid white;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.5);';
          new maplibregl.Marker(el2).setLngLat([${centerLng}, ${centerLat}]).addTo(map);
        }
      }

      // Draw route polyline
      if (routeData) {
        map.addSource('route', { type: 'geojson', data: routeData });
        map.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: { 'line-color': '#1DB954', 'line-width': 5, 'line-opacity': 0.9 }
        });
      }
    });

    // Allow React to fly the map to a new center via injected JS
    window.flyToLocation = function(lat, lng, z) {
      map.flyTo({ center: [lng, lat], zoom: z || map.getZoom(), speed: 1.5 });
    };
  </script>
</body>
</html>`;

    const handleMessage = useCallback((event: any) => {
        if (!onLocationChange) return;
        try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.type === 'location') {
                onLocationChange(data.lat, data.lng);
            }
        } catch (e) {}
    }, [onLocationChange]);

    return (
        <View style={[styles.container, style]}>
            <WebView
                ref={webViewRef}
                originWhitelist={['*']}
                source={{ html: htmlContent }}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                mixedContentMode="always"
                allowsInlineMediaPlayback={true}
                allowsFullscreenVideo={false}
                geolocationEnabled={true}
                scrollEnabled={false}
                bounces={false}
                overScrollMode="never"
                onMessage={handleMessage}
                style={styles.webview}
                onError={(e) => console.log('WebView error:', e.nativeEvent)}
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
