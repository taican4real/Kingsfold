import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDirectDriveLink(url: string) {
  if (!url) return "";
  const driveRegex = /(?:drive\.google\.com\/(?:file\/d\/|open\?id=)|lh3\.googleusercontent\.com\/d\/)([a-zA-Z0-9_-]+)/;
  const match = url.match(driveRegex);
  if (match && match[1]) {
    // drive.usercontent.google.com/download is the active public content endpoint that avoids initial 302 redirects
    return `https://drive.usercontent.google.com/download?id=${match[1]}&export=view`;
  }
  return url;
}
