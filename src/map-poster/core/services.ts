/**
 * Pre-instantiated infrastructure services.
 *
 * This module creates singleton instances of the hexagonal adapters,
 * wiring them to the concrete cache and HTTP implementations.
 * Application hooks import from here instead of calling factories directly.
 */

import { localStorageCache } from "@/map-poster/core/cache/localStorageCache";
import { fetchAdapter } from "@/map-poster/core/http/fetchAdapter";
import { googleFontsAdapter } from "@/map-poster/core/fonts/googleFontsAdapter";
import { createNominatimAdapter } from "@/map-poster/features/location/infrastructure/nominatimAdapter";

/* ── Location / Geocoding ── */

const nominatim = createNominatimAdapter(fetchAdapter, localStorageCache);

export const searchLocations = nominatim.searchLocations;
export const geocodeLocation = nominatim.geocodeLocation;
export const reverseGeocodeCoordinates = nominatim.reverseGeocode;

/* ── Fonts ── */

export const ensureGoogleFont =
  googleFontsAdapter.ensureFont.bind(googleFontsAdapter);

/* ── Poster compositing ── */

export { compositeExport } from "@/map-poster/features/poster/infrastructure/renderer";

/* ── Export helpers ── */

export { captureMapAsCanvas } from "@/map-poster/features/export/infrastructure/mapExporter";

export { createPngBlob } from "@/map-poster/features/export/infrastructure/pngExporter";
export { createLayeredSvgBlobFromMap } from "@/map-poster/features/export/infrastructure/layeredSvgExporter";

export { createPdfBlobFromCanvas } from "@/map-poster/features/export/infrastructure/pdfExporter";

export { createPosterFilename } from "@/map-poster/features/export/infrastructure/filenameGenerator";

export { triggerDownloadBlob } from "@/map-poster/features/export/infrastructure/fileDownloader";

/* ── Routes ── */

export { gpxParser } from "@/map-poster/features/routes/infrastructure/gpxParser";
export { drawRoutesOnCanvas } from "@/map-poster/features/routes/infrastructure/rendering";
