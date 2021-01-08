/* globals GOOGLE_MAPS_API_KEY */
const getGoogleMapCoordinates = async (str) => {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(str)}&key=${GOOGLE_MAPS_API_KEY}`;
  let data = {};

  try {
    const response = await fetch(url);
    data = await response.json();
  } catch (error) {
    data.status = error;
  }

  return new Promise((resolve) => {
    const status = data.status;
    if (status !== 'OK') {
      console.debug('Geocoding failed:', status);
      resolve(null);
      return;
    }

    const results = data.results[0];
    resolve(`${results.geometry.location.lat},${results.geometry.location.lng}`);
  });
};

export default getGoogleMapCoordinates;
