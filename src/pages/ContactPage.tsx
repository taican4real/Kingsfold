import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, Phone, Mail, Loader, School, Settings, AlertTriangle, 
  Car, Clock, Compass, Navigation, Search, Sparkles, RefreshCw 
} from 'lucide-react';
import SEO from '../components/SEO';
import { APIProvider, Map, AdvancedMarker, InfoWindow, useAdvancedMarkerRef, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { useCMS } from '../hooks/useCMS';
import { motion, AnimatePresence } from 'framer-motion';

const DEFAULT_CONTACTPAGE = {
  heroTitle: "Contact Us",
  heroSubtitle: "We would love to hear from you. Get in touch with our admissions team.",
  touchTitle: "Get In Touch",
  address: "Plot 1, His Glory Avenue, Legina (Bus Stop) Off Itokin Road, Adamo Ikorodu, Lagos.",
  phone: "(+234) 909 598 7223",
  email: "info@kingsfoldinternationalacademy.com.ng",
  formTitle: "Send us a Message",
};

function RouteRenderer({ 
  origin, 
  destination, 
  travelMode, 
  onRouteComputed,
  onError
}: { 
  origin: string | google.maps.LatLngLiteral;
  destination: google.maps.LatLngLiteral;
  travelMode: 'DRIVING' | 'WALKING';
  onRouteComputed: (info: { distance: string; duration: string; steps: string[] }) => void;
  onError: (msg: string) => void;
}) {
  const map = useMap();
  const routesLib = useMapsLibrary('routes');
  const polylinesRef = useRef<google.maps.Polyline[]>([]);

  useEffect(() => {
    if (!routesLib || !map || !origin) return;

    // Clear any existing polylines
    polylinesRef.current.forEach(p => p.setMap(null));
    polylinesRef.current = [];
    onError('');

    routesLib.Route.computeRoutes({
      origin: typeof origin === 'string' ? origin : { lat: origin.lat, lng: origin.lng },
      destination: { lat: destination.lat, lng: destination.lng },
      travelMode: travelMode as any,
      fields: ['path', 'distanceMeters', 'durationMillis', 'viewport', 'legs'],
    }).then(({ routes }) => {
      if (routes?.[0]) {
        const newPolylines = routes[0].createPolylines();
        newPolylines.forEach(p => {
          p.setOptions({
            strokeColor: '#6B0F1A',
            strokeOpacity: 0.85,
            strokeWeight: 6,
          });
          p.setMap(map);
        });
        polylinesRef.current = newPolylines;

        if (routes[0].viewport) {
          map.fitBounds(routes[0].viewport);
        }

        const distanceKm = routes[0].distanceMeters ? (routes[0].distanceMeters / 1000).toFixed(1) + ' km' : '';
        let durationText = '';
        if (routes[0].durationMillis) {
          const totalMinutes = Math.round(Number(routes[0].durationMillis) / 60000);
          if (totalMinutes >= 60) {
            const hrs = Math.floor(totalMinutes / 60);
            const mns = totalMinutes % 60;
            durationText = `${hrs} hr ${mns > 0 ? mns + ' min' : ''}`;
          } else {
            durationText = `${totalMinutes} mins`;
          }
        }

        const steps: string[] = [];
        if (routes[0].legs?.[0]?.steps) {
          routes[0].legs[0].steps.forEach((step: any) => {
            if (step.navigationInstruction?.instructions) {
              steps.push(step.navigationInstruction.instructions);
            }
          });
        }
        
        onRouteComputed({
          distance: distanceKm,
          duration: durationText,
          steps: steps.slice(0, 5)
        });
      } else {
        onError('No routes found for the selected location.');
      }
    }).catch(err => {
      console.error("Error computing routes: ", err);
      onError('Unable to calculate directions. Try searching another starting landmark.');
    });

    return () => {
      polylinesRef.current.forEach(p => p.setMap(null));
    };
  }, [routesLib, map, origin, destination, travelMode]);

  return null;
}

const mapStyles = [
  {
    "elementType": "geometry",
    "stylers": [{ "color": "#FAF8F5" }]
  },
  {
    "elementType": "labels.icon",
    "stylers": [{ "visibility": "simplified" }]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#5e524d" }]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [{ "color": "#FAF8F5" }]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#bdbdbd" }]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [{ "color": "#efebe9" }]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#6B0F1A" }, { "weight": 0.5 }]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [{ "color": "#ffffff" }]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [{ "color": "#f1e4e4" }]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [{ "color": "#6B0F1A" }, { "weight": 0.5 }, { "opacity": 0.25 }]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [{ "color": "#d7ccc8" }]
  }
];

const MANUAL_DIRECTIONS: Record<string, { estimate: string; text: string }> = {
  "Ikorodu Roundabout": {
    estimate: "15-20 mins (11.2 km)",
    text: "Head East on Itokin Road (Ikorodu-Epe Expressway) from the Roundabout. Stay on the main road past Sabo market, then past Elepe Bus Stop. Continue straight. Our campus is situated right on the main road at Legina Bus Stop (marked with a prominent Kingsfold International Academy sign) on your left, just 1.5km before Adamo bus stop."
  },
  "Ikeja / Maryland": {
    estimate: "50 mins - 1 hr 15 mins (34.8 km)",
    text: "Take Ikorodu Road (A1) northbound. Drive straight through Ketu, Mile 12, and cross the Majidun River bridge into Central Ikorodu. At the major roundabout, take the eastern turnoff onto Itokin Road (heading towards Epe). Follow the road past Sabo and Elepe. Legina Bus Stop is on your left, directly bordering the main road."
  },
  "Victoria Island": {
    estimate: "1 hr 10 mins - 1 hr 35 mins (48.3 km)",
    text: "Cross the Third Mainland Bridge northbound. Take the exit towards Ikorodu Road at Ketu. Follow Ikorodu Road past Ketu, Mile 12, and cross the Majidun bridge into Central Ikorodu. At the prominent Roundabout, take the exit for Itokin-Epe Road. Proceed past Sabo and Elepe to Legina Bus Stop on your left."
  },
  "Lekki Phase 1": {
    estimate: "1 hr 15 mins - 1 hr 40 mins (42.5 km)",
    text: "Drive eastbound on Lekki-Epe Expressway. Turn left onto the Itokin-Ikorodu Road crossing (past Epe). Head westward along Itokin road past Adamo town center. The Academy layout will appear on your right immediately at Legina Bus Stop."
  }
};

function SchoolMap({ apiKey, location }: { apiKey: string; location: { lat: number; lng: number } }) {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [infoWindowOpen, setInfoWindowOpen] = useState(true);
  const [origin, setOrigin] = useState<string | google.maps.LatLngLiteral>('');
  const [originName, setOriginName] = useState<string>('');
  const [travelMode, setTravelMode] = useState<'DRIVING' | 'WALKING'>('DRIVING');
  const [routeInfo, setRouteInfo] = useState<{ distance: string; duration: string; steps: string[] } | null>(null);
  const [customInput, setCustomInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [calculating, setCalculating] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Resilient fallback logic
  const [hasAuthError, setHasAuthError] = useState(false);
  const [useBackupMap, setUseBackupMap] = useState(false);

  useEffect(() => {
    // Standard Google Maps authorization failure hook
    const originalAuthFailure = (window as any).gm_authFailure;
    (window as any).gm_authFailure = () => {
      console.warn("Google Maps Auth failed. Switching to lightweight fallback map.");
      setHasAuthError(true);
      setUseBackupMap(true);
      if (originalAuthFailure) originalAuthFailure();
    };

    return () => {
      (window as any).gm_authFailure = originalAuthFailure;
    };
  }, []);

  const PRESETS = [
    { name: "Ikorodu Roundabout", coords: { lat: 6.6186, lng: 3.5115 }, desc: "Leaving Central Ikorodu" },
    { name: "Ikeja / Maryland", coords: { lat: 6.5965, lng: 3.3524 }, desc: "Mainland Center transition" },
    { name: "Victoria Island", coords: { lat: 6.4281, lng: 3.4219 }, desc: "Lagos Island area" },
    { name: "Lekki Phase 1", coords: { lat: 6.4326, lng: 3.4568 }, desc: "Lekki Tollgate starting point" }
  ];

  const handleSelectPreset = (preset: typeof PRESETS[0]) => {
    setCalculating(true);
    setOrigin(preset.coords);
    setOriginName(preset.name);
    setRouteInfo(null);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    setCalculating(true);
    setOrigin(customInput.trim());
    setOriginName(customInput.trim());
    setRouteInfo(null);
  };

  const handleClearRoute = () => {
    setOrigin('');
    setOriginName('');
    setRouteInfo(null);
    setCustomInput('');
    setErrorMessage('');
    setInfoWindowOpen(true);
  };

  const handleCopyCoords = () => {
    navigator.clipboard.writeText("6.6872, 3.5648");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <APIProvider apiKey={apiKey} version="weekly">
      <div className="flex flex-col w-full h-full bg-white border border-[#6B0F1A]/10 rounded-sm overflow-hidden shadow-sm font-sans">
        
        {/* Directions Control Dashboard HUD */}
        <div className="bg-[#FAF8F5] border-b border-[#6B0F1A]/10 p-4 space-y-3 shrink-0">
          <div className="flex items-center justify-between gap-4">
            <h4 className="font-serif text-sm font-bold text-wine-dark tracking-wide uppercase flex items-center gap-1.5">
              <Compass className="text-red w-4 h-4 animate-spin-slow" />
              <span>Visitor Directions & Router</span>
            </h4>
            
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setUseBackupMap(prev => !prev)}
                className="text-[10px] bg-wine/5 hover:bg-wine/10 text-wine border border-wine/10 px-2.5 py-1 rounded-sm font-bold transition-all uppercase tracking-wider"
              >
                {useBackupMap || hasAuthError ? "Show Google Map" : "Fallback Interactive"}
              </button>
              {origin && (
                <button 
                  onClick={handleClearRoute}
                  className="text-[10px] text-red font-bold uppercase tracking-wider hover:underline flex items-center gap-1"
                >
                  <RefreshCw size={10} />
                  <span>Reset Map</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Presets Grid */}
            <div className="md:col-span-8 flex flex-wrap gap-1.5 items-center">
              <span className="text-[10px] uppercase font-bold text-gray-400 mr-1 shrink-0">From:</span>
              {PRESETS.map((p) => {
                const isActive = originName === p.name;
                return (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => handleSelectPreset(p)}
                    className={`px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider rounded-sm border transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-wine text-white border-wine' 
                        : 'bg-white text-gray-600 border-gray-200 hover:border-wine/30'
                    }`}
                  >
                    {p.name}
                  </button>
                );
              })}
            </div>

            {/* Custom search Form */}
            <form onSubmit={handleCustomSubmit} className="md:col-span-4 flex items-center">
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Type start landmark..."
                className="text-[10px] text-gray-75 bg-white border border-gray-200 px-2 py-1.5 w-full outline-none focus:border-wine rounded-l-sm"
              />
              <button
                type="submit"
                className="bg-wine hover:bg-red text-white py-1.5 px-3 rounded-r-sm transition-all animate-none"
              >
                <Search size={12} />
              </button>
            </form>
          </div>

          {/* Real-time travel estimation results */}
          <AnimatePresence mode="wait">
            {origin && (
              <motion.div
                key="route-info-banner"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white border border-[#6B0F1A]/10 px-3 py-2 rounded-sm flex flex-col md:flex-row md:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-cream flex items-center justify-center text-red">
                    <Navigation size={14} className="animate-pulse" />
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-wider font-bold text-gray-400">Routes to Campus from</span>
                    <h5 className="text-xs font-bold text-wine-dark truncate max-w-[200px]">{originName}</h5>
                  </div>
                </div>

                <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l pt-2 md:pt-0 md:pl-4 border-gray-100 shrink-0">
                  <div className="flex items-center gap-1.5">
                    <Car size={13} className="text-gray-400" />
                    <select
                      value={travelMode}
                      onChange={(e) => setTravelMode(e.target.value as any)}
                      className="text-[10px] text-gray-700 font-bold bg-transparent outline-none cursor-pointer border-none p-0 focus:ring-0"
                    >
                      <option value="DRIVING">Driving</option>
                      <option value="WALKING">Walking</option>
                    </select>
                  </div>

                  {calculating && !routeInfo && !errorMessage ? (
                    <div className="flex items-center gap-1 text-[10px] text-gray-400">
                      <Loader size={10} className="animate-spin" />
                      <span>Computing...</span>
                    </div>
                  ) : routeInfo ? (
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-[9px] text-gray-400 block uppercase font-bold">Distance</span>
                        <span className="text-xs font-bold text-wine-dark">{routeInfo.distance}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] text-gray-400 block uppercase font-bold">Duration</span>
                        <span className="text-xs font-bold text-red">{routeInfo.duration}</span>
                      </div>
                    </div>
                  ) : errorMessage ? (
                    <span className="text-[10px] text-red font-medium">{errorMessage}</span>
                  ) : null}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Map Viewport Area & Companion Panel */}
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 relative w-full h-full min-h-[460px]">
          
          {/* Map Section */}
          <div className="lg:col-span-8 relative min-h-[350px] lg:min-h-0 w-full h-full">
            {useBackupMap || hasAuthError ? (
              <div className="w-full h-full relative">
                <iframe
                  title="Kingsfold Academy Campus Map Fallback"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  src="https://www.openstreetmap.org/export/embed.html?bbox=3.5448%2C6.6772%2C3.5748%2C6.6972&amp;layer=mapnik&amp;marker=6.6872%2C3.5648"
                  className="w-full h-full grayscale opacity-90 contrast-105"
                />
                <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm border border-neutral-200 px-2.5 py-1.5 rounded text-[10px] text-gray-600 font-sans shadow-sm flex items-center gap-1.5">
                  <Sparkles size={11} className="text-red animate-pulse" />
                  <span>OSM Resilient Engine Loaded</span>
                </div>
              </div>
            ) : (
              <Map
                defaultCenter={location}
                defaultZoom={15}
                mapId="DEMO_MAP_ID"
                internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                style={{ width: '100%', height: '100%' }}
                gestureHandling={'greedy'}
                disableDefaultUI={false}
                styles={mapStyles}
              >
                <AdvancedMarker 
                  ref={markerRef} 
                  position={location} 
                  title="Kingsfold International Academy"
                  onClick={() => setInfoWindowOpen(prev => !prev)}
                >
                  <div 
                    style={{ width: '40px', height: '40px' }} 
                    className="relative flex items-center justify-center cursor-pointer transform hover:scale-105 transition-transform"
                  >
                    <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-[#6B0F1A]/30 opacity-75"></span>
                    <div className="relative w-10 h-10 rounded-full bg-[#6B0F1A] flex items-center justify-center shadow-md border-2 border-white font-sans">
                      <School className="text-white w-5 h-5 font-sans" />
                    </div>
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-[#6B0F1A]" />
                  </div>
                </AdvancedMarker>

                {infoWindowOpen && (
                  <InfoWindow 
                    anchor={marker} 
                    onCloseClick={() => setInfoWindowOpen(false)}
                    pixelOffset={[0, -5]}
                  >
                    <div className="p-1 px-2 max-w-[210px] font-sans">
                      <h5 className="font-serif text-xs font-bold text-[#6B0F1A] mb-1">Kingsfold International Academy</h5>
                      <p className="text-[10px] text-gray-600 leading-normal mb-1 bg-neutral-50 p-1 rounded border border-neutral-100 font-sans">
                        Plot 1, His Glory Avenue, Legina Bus Stop, Off Itokin Road, Adamo Ikorodu.
                      </p>
                      <p className="text-[9px] text-[#22c55e] font-semibold flex items-center gap-1 mt-1 font-sans">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-ping" />
                        <span>Open for Guest Visitations</span>
                      </p>
                    </div>
                  </InfoWindow>
                )}

                {origin && (
                  <RouteRenderer
                    origin={origin}
                    destination={location}
                    travelMode={travelMode}
                    onRouteComputed={(info) => {
                      setRouteInfo(info);
                      setCalculating(false);
                      setInfoWindowOpen(false);
                    }}
                    onError={(msg) => {
                      setErrorMessage(msg);
                      setCalculating(false);
                    }}
                  />
                )}
              </Map>
            )}
          </div>

          {/* Elegant Interactive Side Panel for Directions/Steps */}
          <div className="lg:col-span-4 bg-[#FAF9F6] border-t lg:border-t-0 lg:border-l border-wine/10 p-5 flex flex-col justify-between overflow-y-auto max-h-[500px] w-full h-full">
            
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-wine/5 pb-2">
                <h5 className="text-[10px] uppercase font-bold tracking-widest text-[#6B0F1A] flex items-center gap-1.5">
                  <Compass size={12} className="text-red" />
                  <span>Route Companion</span>
                </h5>
                <span className="text-[9px] text-gray-400 font-mono">
                  {useBackupMap || hasAuthError ? "manual assist" : "gps live"}
                </span>
              </div>

              {/* Calculating Status Indicator */}
              {calculating && !routeInfo && !errorMessage && (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-2">
                  <Loader size={20} className="text-wine animate-spin" />
                  <p className="text-[10px] text-gray-500 font-medium">Computing live directions...</p>
                </div>
              )}

              {/* Live Google Maps Steps */}
              {!useBackupMap && !hasAuthError && routeInfo && routeInfo.steps && routeInfo.steps.length > 0 && !calculating && (
                <div className="space-y-3">
                  <div className="bg-[#6B0F1A]/5 p-2 rounded border border-[#6B0F1A]/10 text-center">
                    <p className="text-[10px] text-[#6B0F1A] font-bold uppercase tracking-wider">Estimated Trip Time</p>
                    <div className="flex justify-center items-baseline gap-2 mt-1">
                      <span className="text-lg font-serif font-extrabold text-wine-dark">{routeInfo.duration}</span>
                      <span className="text-xs text-gray-400">({routeInfo.distance})</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[9px] uppercase font-bold text-gray-400 block tracking-wider">Step-by-Step Directions</span>
                    <ol className="text-[11px] text-gray-700 space-y-2.5 list-none pl-0 font-sans">
                      {routeInfo.steps.map((step, idx) => (
                        <li key={idx} className="flex gap-2.5 items-start">
                          <span className="w-5 h-5 rounded-full bg-cream flex items-center justify-center text-[9px] font-bold text-wine shrink-0 shadow-xs transition-all select-none">
                            {idx + 1}
                          </span>
                          <span className="leading-relaxed" dangerouslySetInnerHTML={{ __html: step }} />
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              )}

              {/* Fallback Manual Guide */}
              {(useBackupMap || hasAuthError) && originName && !calculating && (
                <div className="space-y-3 font-sans">
                  <div className="bg-[#6B0F1A]/5 p-2.5 rounded border border-[#6B0F1A]/10 text-center">
                    <p className="text-[10px] text-[#6B0F1A] font-bold uppercase tracking-wider">Manual Estimate</p>
                    <div className="flex justify-center items-baseline gap-1.5 mt-1">
                      <span className="text-xs font-bold text-wine-dark">
                        {MANUAL_DIRECTIONS[originName]?.estimate || "Local area profile"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-1">
                      <Sparkles size={11} className="text-red" />
                      <span className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">Campus Routing Instructions</span>
                    </div>
                    <p className="text-[11px] text-gray-700 leading-relaxed bg-white p-3 rounded-sm border border-neutral-150 shadow-xs whitespace-pre-line">
                      {MANUAL_DIRECTIONS[originName]?.text || 
                       `To drive to Kingsfold Academy from ${originName}, align your journey with Itokin Road (Epe Expressway). Our pristine campus is situated precisely at Legina Bus Stop (marked with a prominent Kingsfold signboard) on your left if heading East, or on your right if driving West from Adamo.`}
                    </p>
                  </div>
                </div>
              )}

              {/* Welcome Screen / Coords copy block */}
              {!origin && !calculating && (
                <div className="space-y-4 py-4">
                  <div className="bg-cream-light/60 border border-[#6B0F1A]/5 p-3.5 rounded-sm">
                    <h6 className="font-serif text-xs font-bold text-wine-dark mb-1 flex items-center gap-1.5">
                      <School size={13} className="text-red" />
                      <span>Welcome Visitor</span>
                    </h6>
                    <p className="text-[11px] text-gray-500 leading-relaxed font-sans">
                      Select a landmark or starting point above to dynamically compile routes, distances, and precise geographic step-by-step directions to the school gate.
                    </p>
                  </div>

                  <div className="text-left space-y-2 bg-white p-3 border border-neutral-100 rounded shadow-xs">
                    <div className="flex items-center justify-between border-b pb-1.5">
                      <span className="text-[9px] text-gray-400 uppercase font-mono">Campus GPS Location</span>
                      <button
                        type="button"
                        onClick={handleCopyCoords}
                        className="text-[9px] font-bold text-wine hover:underline uppercase tracking-wide cursor-pointer focus:outline-none"
                      >
                        {copied ? "Copied ✓" : "Copy Coords"}
                      </button>
                    </div>
                    <p className="text-[11px] font-mono text-gray-650 flex items-center justify-between">
                      <span>Latitude:</span>
                      <span className="font-semibold text-stone-850">6.6872° N</span>
                    </p>
                    <p className="text-[11px] font-mono text-gray-650 flex items-center justify-between">
                      <span>Longitude:</span>
                      <span className="font-semibold text-stone-850">3.5648° E</span>
                    </p>
                  </div>
                </div>
              )}

              {/* Routing Error Fallback options */}
              {errorMessage && !calculating && (
                <div className="p-3 bg-red/5 border border-red/10 rounded-sm text-center font-sans">
                  <p className="text-[11px] text-red font-medium leading-relaxed">{errorMessage}</p>
                  <button
                    onClick={() => {
                      setUseBackupMap(true);
                      setErrorMessage('');
                    }}
                    type="button"
                    className="mt-2 text-[10px] text-wine font-bold uppercase tracking-wider hover:underline"
                  >
                    Use Fallback Interactive Map
                  </button>
                </div>
              )}

            </div>

            {/* Quick Launch Mobile Navigation */}
            <div className="pt-4 border-t border-neutral-150 mt-4 flex items-center justify-between gap-2 shrink-0">
              <span className="text-[9px] text-gray-400 leading-tight block font-medium max-w-[140px]">
                Launch directly in your mobile navigator:
              </span>
              <div className="flex gap-1.5 shrink-0">
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=6.6872,3.5648" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-wider text-white bg-wine hover:bg-red rounded-xs transition-all flex items-center gap-1 shadow-sm font-sans"
                >
                  <Navigation size={10} />
                  Google Maps
                </a>
                <a 
                  href="https://waze.com/ul?ll=6.6872,3.5648&navigate=yes" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-wider text-wine bg-cream hover:bg-wine hover:text-white rounded-xs transition-all flex items-center gap-0.5 border border-wine/15 font-sans"
                >
                  <Car size={10} />
                  Waze
                </a>
              </div>
            </div>

          </div>

        </div>
      </div>
    </APIProvider>
  );
}

export default function ContactPage() {
  const { data: contact, loading } = useCMS('contact', DEFAULT_CONTACTPAGE);
  const API_KEY = process.env.GOOGLE_MAPS_PLATFORM_KEY || 'AIzaSyA0-sdtOHnesDeqUeZp9cDUnICFzuEkpAI';
  const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';
  const schoolLocation = { lat: 6.6872, lng: 3.5648 };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-cream"><Loader className="animate-spin text-wine" size={40} /></div>;
  }

  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "Kingsfold International Academy",
    "telephone": "+2349095987223",
    "email": "info@kingsfoldinternationalacademy.com.ng",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Plot 1, His Glory Avenue, Legina Bus Stop, Off Itokin Road, Adamo",
      "addressLocality": "Ikorodu",
      "addressRegion": "Lagos",
      "addressCountry": "NG"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+2349095987223",
      "contactType": "Admissions and General Enquiries",
      "email": "info@kingsfoldinternationalacademy.com.ng",
      "availableLanguage": "English"
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen relative">
      <div className="relative z-10 w-full flex flex-col flex-1">
        <SEO 
          title={contact.heroTitle || "Contact Us"}
          description={contact.heroSubtitle || "Get in touch with the admissions or administrative office at Kingsfold International Academy, Ikorodu."}
          keywords="Kingsfold contact, school phone number, Ikorodu school contact, admissions email Lagos"
          schema={contactSchema}
        />
        <div className="py-24 bg-wine text-center px-4">
          <h1 className="text-5xl md:text-6xl font-serif text-white mb-4 uppercase">{contact.heroTitle}</h1>
          <p className="text-cream/80 max-w-2xl mx-auto">{contact.heroSubtitle}</p>
        </div>

        <div className="max-w-[1200px] mx-auto px-4 py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div>
            <h2 className="text-3xl font-serif text-wine-dark mb-8">{contact.touchTitle}</h2>
            <div className="flex flex-col gap-6 mb-12">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white flex items-center justify-center shadow-sm shrink-0">
                  <MapPin className="text-wine" />
                </div>
                <div>
                  <h4 className="font-serif text-xl text-wine-dark mb-1">Our Campus</h4>
                  <p className="text-gray-dark/80 text-sm whitespace-pre-line">{contact.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white flex items-center justify-center shadow-sm shrink-0">
                  <Phone className="text-wine" />
                </div>
                <div>
                  <h4 className="font-serif text-xl text-wine-dark mb-1">Phone</h4>
                  <p className="text-gray-dark/80 text-sm">{contact.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white flex items-center justify-center shadow-sm shrink-0">
                  <Mail className="text-wine" />
                </div>
                <div>
                  <h4 className="font-serif text-xl text-wine-dark mb-1">Email</h4>
                  <p className="text-gray-dark/80 text-sm">{contact.email}</p>
                </div>
              </div>
            </div>

            {/* Interactive Google Map */}
            <div className={`w-full overflow-hidden shadow-sm flex flex-col justify-center items-center border border-wine/10 ${hasValidKey ? 'min-h-[580px]' : 'min-h-[420px] bg-gray-55 relative'}`}>
              {!hasValidKey ? (
                <div className="w-full h-full p-8 text-center bg-stone-50/80 flex flex-col justify-center items-center">
                  <div className="max-w-md mx-auto space-y-4">
                    <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-600 animate-pulse">
                      <AlertTriangle size={24} />
                    </div>
                    <div>
                      <h3 className="text-base font-serif font-bold text-wine-dark tracking-tight">Interactive Map Setup Required</h3>
                      <p className="text-xs text-gray-550 mt-1 max-w-sm mx-auto leading-relaxed">
                        To activate the dynamic campus location map and directions, an administrator must configure the Google Maps Platform API credential in the project secrets.
                      </p>
                    </div>

                    <div className="space-y-4 max-w-sm mx-auto font-sans">
                      <a 
                        href="https://aistudio.google.com/" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="w-full bg-[#6B0F1A] text-white py-3 px-6 rounded text-[11px] font-bold uppercase tracking-widest text-center flex items-center justify-center gap-2 hover:bg-wine-dark transition-all shadow-md active:scale-[0.98]"
                      >
                        <Settings size={14} className="animate-spin-slow" />
                        Configure Secrets in AI Studio
                      </a>

                      <div className="bg-white border border-stone-100 rounded p-4 text-left shadow-sm">
                        <div className="flex items-center gap-2 mb-2 text-stone-700 font-mono text-[10px] uppercase tracking-wider border-b pb-1.5 border-stone-150">
                          <Settings size={14} className="text-[#6B0F1A]" />
                          <span>Configuration Steps</span>
                        </div>
                        <ol className="text-[11px] text-gray-600 space-y-2 list-decimal list-inside leading-relaxed">
                          <li>
                            Get an API key from the{' '}
                            <a 
                              href="https://console.cloud.google.com/google/maps-apis/start?utm_campaign=gmp-code-assist-ais" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-[#6B0F1A] font-bold underline hover:text-red transition-colors"
                            >
                              Google Cloud Console
                            </a>
                          </li>
                          <li>
                            Click the{' '}
                            <a 
                              href="https://aistudio.google.com/" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-[#6B0F1A] font-bold underline hover:text-red transition-colors"
                            >
                              Configure Secrets in AI Studio
                            </a>{' '}
                            button above.
                          </li>
                          <li>
                            Open <span className="font-semibold text-stone-800">Settings</span> (the ⚙️ gear icon) or head directly to the <span className="font-semibold text-stone-800">Secrets</span> section.
                          </li>
                          <li>
                            Add key name <code>GOOGLE_MAPS_PLATFORM_KEY</code> and paste the API credential as its value.
                          </li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full h-[580px]">
                  <SchoolMap apiKey={API_KEY} location={schoolLocation} />
                </div>
              )}
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 md:p-12 shadow-sm border border-wine/10">
            <h2 className="text-2xl font-serif text-wine-dark mb-6">{contact.formTitle}</h2>
            <form className="flex flex-col gap-5">
              <input type="text" placeholder="Full Name" className="w-full border-b border-gray-300 p-2 outline-none focus:border-wine bg-transparent transition-colors" />
              <input type="email" placeholder="Email Address" className="w-full border-b border-gray-300 p-2 outline-none focus:border-wine bg-transparent transition-colors" />
              <input type="text" placeholder="Subject" className="w-full border-b border-gray-300 p-2 outline-none focus:border-wine bg-transparent transition-colors" />
              <textarea placeholder="Your Message" rows={5} className="w-full border-b border-gray-300 p-2 outline-none focus:border-wine bg-transparent transition-colors resize-none mt-2"></textarea>
              <button type="submit" className="bg-red text-white uppercase tracking-widest font-medium py-3 px-8 self-start mt-4 shadow-md hover:bg-wine transition-colors transition-all duration-300 active:scale-95">Submit</button>
            </form>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
