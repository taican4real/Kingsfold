import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  type?: string;
  image?: string;
  schema?: Record<string, any> | Record<string, any>[];
  noIndex?: boolean;
}

export default function SEO({ 
  title, 
  description, 
  keywords, 
  canonical,
  type = "website",
  image,
  schema,
  noIndex = false
}: SEOProps) {
  const location = useLocation();
  const siteTitle = "Kingsfold International Academy";
  const fullTitle = `${title} | ${siteTitle}`;
  const baseUrl = "https://www.kingsfoldinternationalacademy.com.ng";
  
  // Calculate dynamic canonical URL based on the current pathname if not explicitly provided
  const finalCanonical = canonical || `${baseUrl}${location.pathname === '/' ? '' : location.pathname}`;

  // Default keywords for all pages
  const baseKeywords = "British International School Lagos, Best Boarding School Nigeria, IGCSE School Lagos, Cambridge Curriculum Nigeria, Top Private School Lagos, Kingsfold Academy, Ikorodu school";
  const finalKeywords = keywords ? `${keywords}, ${baseKeywords}` : baseKeywords;

  // Use either the custom image or a general high-quality fallback image for previewing
  const previewImage = image || "https://lh3.googleusercontent.com/d/1iUPYl60tbSKCWv3GSBhjpTyD24GYerhE";

  // Primary EducationalOrganization Schema
  const defaultOrgSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "@id": `${baseUrl}/#organization`,
    "name": "Kingsfold International Academy",
    "url": baseUrl,
    "logo": "https://lh3.googleusercontent.com/d/1iUPYl60tbSKCWv3GSBhjpTyD24GYerhE",
    "image": "https://lh3.googleusercontent.com/d/1iUPYl60tbSKCWv3GSBhjpTyD24GYerhE",
    "description": "Kingsfold International Academy is a premium British-Nigerian private boarding school in Ikorodu, Lagos, offering exceptional academic standards with world-class boarding facilities.",
    "telephone": "+2349095987223",
    "email": "info@kingsfoldinternationalacademy.com.ng",
    "foundingDate": "2018",
    "knowsAbout": [
      "British National Curriculum",
      "Nigerian National Curriculum",
      "IGCSE",
      "WAEC",
      "NECO",
      "A-Levels",
      "Cambridge Assessment International Education"
    ],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Plot 1, His Glory Avenue, Legina Bus Stop, Off Itokin Road, Adamo",
      "addressLocality": "Ikorodu",
      "addressRegion": "Lagos",
      "postalCode": "104101",
      "addressCountry": "NG"
    },
    "sameAs": [
      "https://www.facebook.com/kingsfoldinternationalacademy",
      "https://www.instagram.com/kingsfoldinternationalacademy",
      "https://twitter.com/kingsfoldacademy"
    ]
  };

  // Compile schema list
  const schemaList: Record<string, any>[] = [];
  
  // Always include Org schema on the homepage
  if (location.pathname === '/') {
    schemaList.push(defaultOrgSchema);
  }

  // Add custom schemas if provided
  if (schema) {
    if (Array.isArray(schema)) {
      schemaList.push(...schema);
    } else {
      schemaList.push(schema);
    }
  } else if (location.pathname !== '/') {
    // Fallback simple WebPage schema for other pages if no custom schema is provided
    schemaList.push({
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${finalCanonical}/#webpage`,
      "url": finalCanonical,
      "name": title,
      "description": description,
      "isPartOf": {
        "@type": "WebSite",
        "@id": `${baseUrl}/#website`,
        "name": siteTitle,
        "url": baseUrl
      }
    });
  }

  return (
    <Helmet>
      {/* Standard Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={finalKeywords} />
      <link rel="canonical" href={finalCanonical} />
      
      {/* Search Engine Robots Instructions */}
      <meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"} />
      
      {/* Mobile & App Meta */}
      <meta name="theme-color" content="#6B0F1A" />
      <meta name="apple-mobile-web-app-title" content="Kingsfold" />
      <meta name="format-detection" content="telephone=no" />

      {/* Open Graph / Facebook */}
      <meta property="og:locale" content="en_NG" />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={finalCanonical} />
      <meta property="og:site_name" content={siteTitle} />
      <meta property="og:image" content={previewImage} />
      <meta property="og:image:secure_url" content={previewImage} />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={`${siteTitle} Campus`} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={previewImage} />
      <meta name="twitter:image:alt" content={`${siteTitle} Landmark`} />
      <meta name="twitter:site" content="@kingsfoldacademy" />

      {/* Structured Data (Schema.org) */}
      {schemaList.map((sc, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(sc)}
        </script>
      ))}
    </Helmet>
  );
}
