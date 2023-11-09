export const isPointInsideRectangle = (args: {
  north: number;
  south: number;
  east: number;
  west: number;
  lat: number;
  lng: number;
}) => {
  const { north, south, east, west, lat, lng } = args;

  const minLat = Math.min(north, south);
  const maxLat = Math.max(north, south);

  // Sort the longitudes in ascending order
  const minLng = Math.min(east, west);
  const maxLng = Math.max(east, west);

  if (lat >= minLat && lat <= maxLat && lng >= minLng && lng <= maxLng) {
    return true;
  }
  return false;
};
