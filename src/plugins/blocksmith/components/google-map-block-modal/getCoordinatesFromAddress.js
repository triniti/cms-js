/* globals GOOGLE_MAPS_API_KEY */
/**
 * Converts address to geographic coordinates using Google Geocoding API
 *
 * @param {String} str
 *
 * @returns {String|null}
 */
export default async (str) => {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(str)}&key=${GOOGLE_MAPS_API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const { error_message: error } = data;

    if (error) {
      console.error(`Geocoding failed with error: ${error}`);

      return null;
    }

    const { lat, lng } = data.results[0].geometry.location;

    return `${lat},${lng}`;
  } catch (error) {
    console.error('Geocoding failed:', error);

    return null;
  }
};
