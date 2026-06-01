import React, { useState } from 'react';
import { MapPin, Phone, Mail, Loader, School, Settings, AlertTriangle } from 'lucide-react';
import SEO from '../components/SEO';
import { APIProvider, Map, AdvancedMarker, InfoWindow, useAdvancedMarkerRef } from '@vis.gl/react-google-maps';
import { useCMS } from '../hooks/useCMS';

const DEFAULT_CONTACTPAGE = {
  heroTitle: "Contact Us",
  heroSubtitle: "We would love to hear from you. Get in touch with our admissions team.",
  touchTitle: "Get In Touch",
  address: "Plot 1, His Glory Avenue, Legina (Bus Stop) Off Itokin Road, Adamo Ikorodu, Lagos.",
  phone: "(+234) 909 598 7223",
  email: "info@kingsfoldinternationalacademy.com.ng",
  formTitle: "Send us a Message",
};

function SchoolMap({ apiKey, location }: { apiKey: string; location: { lat: number; lng: number } }) {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [infoWindowOpen, setInfoWindowOpen] = useState(true);

  return (
    <APIProvider apiKey={apiKey} version="weekly">
      <Map
        defaultCenter={location}
        defaultZoom={15}
        mapId="KINGSFOLD_MAP_ID"
        internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
        style={{ width: '100%', height: '100%' }}
        gestureHandling={'greedy'}
        disableDefaultUI={false}
      >
        <AdvancedMarker 
          ref={markerRef} 
          position={location} 
          title="Kingsfold International Academy"
          onClick={() => setInfoWindowOpen(prev => !prev)}
        >
          {/* Custom Pin with explicit styling */}
          <div 
            style={{ width: '40px', height: '40px' }} 
            className="relative flex items-center justify-center cursor-pointer transform hover:scale-105 transition-transform"
          >
            <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-[#6B0F1A]/30 opacity-75"></span>
            <div className="relative w-10 h-10 rounded-full bg-[#6B0F1A] flex items-center justify-center shadow-xl border-2 border-white">
              <School className="text-white w-5 h-5" />
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
            <div className="p-1 max-w-[200px]">
              <h5 className="font-serif text-sm font-bold text-[#6B0F1A] mb-1">Kingsfold Academy</h5>
              <p className="text-[10px] text-gray-600 leading-normal">
                Plot 1, His Glory Avenue, Legina Bus Stop, Ikorodu, Lagos.
              </p>
            </div>
          </InfoWindow>
        )}
      </Map>
    </APIProvider>
  );
}

export default function ContactPage() {
  const { data: contact, loading } = useCMS('contact', DEFAULT_CONTACTPAGE);
  const API_KEY = process.env.GOOGLE_MAPS_PLATFORM_KEY || '';
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
            <div className="w-full min-h-[420px] bg-gray-55 border border-wine/10 relative overflow-hidden shadow-sm flex flex-col justify-center items-center">
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

                    <div className="space-y-4 max-w-sm mx-auto">
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
                <div className="w-full h-[420px]">
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
