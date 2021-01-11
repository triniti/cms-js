/* globals GOOGLE_MAPS_API_KEY */
/**
 * Converts address to geographic coordinates using Google Geocoding API
 *
 * @param {String} str
 * @returns {String|null}
 */
const getCoordinatesFromAddress = async (str) => {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(str)}&key=${GOOGLE_MAPS_API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const status = data.status;

    if (status !== 'OK') {
      console.error('Geocoding failed:', status);
      return null;
    }

    const results = data.results[0];
    return `${results.geometry.location.lat},${results.geometry.location.lng}`;
  } catch (error) {
    console.error('Geocoding failed:', error);
    return null;
  }
};

export default getCoordinatesFromAddress;
