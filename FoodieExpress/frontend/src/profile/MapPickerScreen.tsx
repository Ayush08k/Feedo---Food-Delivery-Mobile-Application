import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { WebView } from 'react-native-webview';
import { useAlert } from '../utils/AlertContext';

// ── Nominatim OSM reverse geocoding (free, no API key) ──────────────────────
interface NominatimResult {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    displayAddress: string;
}

async function reverseGeocodeOSM(lat: number, lng: number): Promise<NominatimResult> {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`;
    const res = await fetch(url, {
        headers: { 'Accept-Language': 'en', 'User-Agent': 'FeedoApp/1.0' }
    });
    const json = await res.json();
    const a = json.address || {};

    const street = [a.road, a.suburb, a.neighbourhood].filter(Boolean).join(', ');
    const city = a.city || a.town || a.village || a.county || '';
    const state = a.state || a.state_district || '';
    const postalCode = a.postcode || '';
    const displayAddress = json.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;

    return { street, city, state, postalCode, displayAddress };
}

export default function MapPickerScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { showAlert } = useAlert();
    const webViewRef = useRef<WebView>(null);

    const [coords, setCoords] = useState({ lat: 17.3850, lng: 78.4867 });
    const [isResolving, setIsResolving] = useState(false);
    const [isLocating, setIsLocating] = useState(true);
    const [geoResult, setGeoResult] = useState<NominatimResult | null>(null);
    const timerRef = useRef<any>(null);
    const coordsRef = useRef({ lat: 17.3850, lng: 78.4867 }); // always latest coords
    const geoResultRef = useRef<NominatimResult | null>(null); // latest resolved result

    const HTML = `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
  <link href="https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.css" rel="stylesheet"/>
  <script src="https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.js"></script>
  <style>
    *{box-sizing:border-box;margin:0;padding:0;}
    html,body,#map{width:100%;height:100%;background:#121212;}
    .maplibregl-ctrl-attrib,.maplibregl-ctrl-logo{display:none!important;}
    #loading{position:absolute;inset:0;background:#121212;display:flex;
      align-items:center;justify-content:center;z-index:300;flex-direction:column;gap:12px;}
    .spinner{width:36px;height:36px;border:3px solid #333;border-top-color:#1DB954;
      border-radius:50%;animation:spin 0.8s linear infinite;}
    @keyframes spin{to{transform:rotate(360deg);}}
    #loading p{color:#A0A0A0;font-family:sans-serif;font-size:13px;}
    #pin{position:absolute;top:50%;left:50%;transform:translate(-50%,-100%);
      z-index:200;pointer-events:none;display:flex;flex-direction:column;align-items:center;}
    #pin .dot{width:22px;height:22px;background:#1DB954;border:3px solid #fff;
      border-radius:50%;box-shadow:0 3px 10px rgba(0,0,0,0.6);}
    #pin .stem{width:3px;height:16px;background:#1DB954;}
    #pin .shadow{width:12px;height:5px;background:rgba(0,0,0,0.25);border-radius:50%;}
    #gps{position:absolute;bottom:20px;right:16px;z-index:200;background:#1DB954;
      border:none;border-radius:50%;width:48px;height:48px;font-size:22px;cursor:pointer;
      box-shadow:0 3px 10px rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;}
  </style>
</head>
<body>
  <div id="loading"><div class="spinner"></div><p>Loading map…</p></div>
  <div id="pin"><div class="dot"></div><div class="stem"></div><div class="shadow"></div></div>
  <div id="map"></div>
  <button id="gps">📍</button>
  <script>
    var map = new maplibregl.Map({
      container:'map',style:'https://tiles.openfreemap.org/styles/dark',
      center:[78.4867,17.3850],zoom:14,attributionControl:false
    });
    map.on('render',function(){
      var l=document.getElementById('loading'); if(l) l.style.display='none';
    });
    var lastSent=0;
    function sendCenter(){
      var now=Date.now(); if(now-lastSent<400) return; lastSent=now;
      var c=map.getCenter();
      if(window.ReactNativeWebView){
        window.ReactNativeWebView.postMessage(JSON.stringify({type:'location',lat:c.lat,lng:c.lng}));
      }
    }
    map.on('moveend',sendCenter);
    map.on('dragend',sendCenter);
    window.flyTo=function(lat,lng){ map.flyTo({center:[lng,lat],zoom:16,speed:1.8}); };
    // GPS button: ask React Native to get location (works in Expo Go, unlike navigator.geolocation)
    document.getElementById('gps').addEventListener('click',function(){
      if(window.ReactNativeWebView){
        window.ReactNativeWebView.postMessage(JSON.stringify({type:'gps_request'}));
      }
    });
  </script>
</body>
</html>`;

    const resolveAddress = useCallback(async (lat: number, lng: number) => {
        setIsResolving(true);
        try {
            const result = await reverseGeocodeOSM(lat, lng);
            geoResultRef.current = result;
            setGeoResult(result);
        } catch {
            const fallback: NominatimResult = {
                street: '', city: '', state: '', postalCode: '',
                displayAddress: `${lat.toFixed(5)}, ${lng.toFixed(5)}`
            };
            geoResultRef.current = fallback;
            setGeoResult(fallback);
        } finally {
            setIsResolving(false);
        }
    }, []);

    useEffect(() => {
        (async () => {
            try {
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status === 'granted') {
                    const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
                    const { latitude, longitude } = loc.coords;
                    coordsRef.current = { lat: latitude, lng: longitude };
                    setCoords({ lat: latitude, lng: longitude });
                    webViewRef.current?.injectJavaScript(`window.flyTo(${latitude}, ${longitude}); true;`);
                    resolveAddress(latitude, longitude);
                } else {
                    resolveAddress(17.3850, 78.4867);
                }
            } catch {
                resolveAddress(17.3850, 78.4867);
            } finally {
                setIsLocating(false);
            }
        })();
    }, []);

    const handleMessage = useCallback(async (event: any) => {
        try {
            const data = JSON.parse(event.nativeEvent.data);

            if (data.type === 'location') {
                const { lat, lng } = data;
                coordsRef.current = { lat, lng };
                setCoords({ lat, lng });
                if (timerRef.current) clearTimeout(timerRef.current);
                timerRef.current = setTimeout(() => resolveAddress(lat, lng), 800);
            }

            // GPS button tapped inside WebView — handle natively for Expo Go compatibility
            if (data.type === 'gps_request') {
                try {
                    const { status } = await Location.requestForegroundPermissionsAsync();
                    if (status === 'granted') {
                        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
                        const { latitude, longitude } = loc.coords;
                        coordsRef.current = { lat: latitude, lng: longitude };
                        setCoords({ lat: latitude, lng: longitude });
                        // Fly the map to real GPS position
                        webViewRef.current?.injectJavaScript(`window.flyTo(${latitude}, ${longitude}); true;`);
                        resolveAddress(latitude, longitude);
                    }
                } catch {
                    // silently ignore if GPS unavailable
                }
            }
        } catch {}
    }, [resolveAddress]);

    // Confirm — fetches geocode on-demand if not yet resolved, then navigates
    const handleConfirm = async () => {
        const { lat, lng } = coordsRef.current;
        let result = geoResultRef.current;

        // If geocode not done yet, fetch synchronously now
        if (!result) {
            setIsResolving(true);
            try {
                result = await reverseGeocodeOSM(lat, lng);
                geoResultRef.current = result;
                setGeoResult(result);
            } catch {
                result = { street: '', city: '', state: '', postalCode: '', displayAddress: `${lat.toFixed(5)}, ${lng.toFixed(5)}` };
            } finally {
                setIsResolving(false);
            }
        }

        if (route.params?.onLocationSelected) {
            route.params.onLocationSelected({
                coords: { lat, lng },
                nominatim: result,
            });
        }
        navigation.goBack();
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#121212' }}>
            <View style={{
                paddingHorizontal: 16, paddingVertical: 14,
                flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                borderBottomWidth: 1, borderBottomColor: '#333'
            }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={28} color="#1DB954" />
                </TouchableOpacity>
                <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>📍 Pick Location</Text>
                {isLocating
                    ? <ActivityIndicator size="small" color="#1DB954" />
                    : <View style={{ width: 28 }} />}
            </View>

            <View style={{ flex: 1, position: 'relative' }}>
                <WebView
                    ref={webViewRef}
                    originWhitelist={['*']}
                    source={{ html: HTML }}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    geolocationEnabled={true}
                    mixedContentMode="always"
                    allowsInlineMediaPlayback={true}
                    scrollEnabled={false}
                    bounces={false}
                    overScrollMode="never"
                    onMessage={handleMessage}
                    style={{ flex: 1, backgroundColor: '#121212' }}
                />
                {isLocating && (
                    <View style={{
                        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(18,18,18,0.75)',
                        alignItems: 'center', justifyContent: 'center'
                    }}>
                        <ActivityIndicator size="large" color="#1DB954" />
                        <Text style={{ color: '#A0A0A0', marginTop: 10, fontSize: 13 }}>
                            Getting your location…
                        </Text>
                    </View>
                )}
            </View>

            {/* Bottom panel */}
            <View style={{
                backgroundColor: '#1E1E1E', padding: 16,
                borderTopLeftRadius: 24, borderTopRightRadius: 24,
                shadowColor: '#000', shadowOpacity: 0.4, shadowRadius: 12, elevation: 8
            }}>
                {/* Live address preview */}
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 }}>
                    <Ionicons name="location" size={20} color="#1DB954" style={{ marginTop: 2 }} />
                    <View style={{ marginLeft: 10, flex: 1 }}>
                        <Text style={{ color: '#A0A0A0', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 2 }}>
                            {isResolving ? '🔍 Fetching address…' : 'Selected Location'}
                        </Text>
                        <Text style={{ color: 'white', fontSize: 13, fontWeight: '600' }} numberOfLines={2}>
                            {geoResult?.displayAddress || `${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`}
                        </Text>
                    </View>
                    {isResolving && <ActivityIndicator size="small" color="#1DB954" />}
                </View>

                {/* City / State / Pincode chips */}
                {geoResult && (
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 10, marginLeft: 30 }}>
                        {geoResult.city ? (
                            <View style={{ backgroundColor: '#0d2118', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: '#1DB954' }}>
                                <Text style={{ color: '#1DB954', fontSize: 11, fontWeight: 'bold' }}>🏙 {geoResult.city}</Text>
                            </View>
                        ) : null}
                        {geoResult.state ? (
                            <View style={{ backgroundColor: '#0d2118', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: '#1DB954' }}>
                                <Text style={{ color: '#1DB954', fontSize: 11, fontWeight: 'bold' }}>🗺 {geoResult.state}</Text>
                            </View>
                        ) : null}
                        {geoResult.postalCode ? (
                            <View style={{ backgroundColor: '#0d2118', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: '#1DB954' }}>
                                <Text style={{ color: '#1DB954', fontSize: 11, fontWeight: 'bold' }}>📮 {geoResult.postalCode}</Text>
                            </View>
                        ) : null}
                    </View>
                )}

                {/* Coords */}
                <Text style={{ color: '#555', fontSize: 10, marginLeft: 30, marginBottom: 12 }}>
                    🌐 {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}
                </Text>

                <TouchableOpacity
                    style={{ backgroundColor: '#1DB954', padding: 15, borderRadius: 14, alignItems: 'center' }}
                    onPress={handleConfirm}
                >
                    <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 16 }}>
                        ✅ Confirm This Location
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
