export const getDirectionsURL = (
  locationString: string,
  locationId?: string,
): string =>
  `https://www.google.com/maps/dir/?api=1&${new URLSearchParams({
    destination: locationString,
    ...(locationId && { destination_place_id: locationId }),
  }).toString()}`;

export default getDirectionsURL;
