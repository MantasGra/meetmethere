class Geocoder {
  private static geocoder?: google.maps.Geocoder;

  static getGeocoder(): google.maps.Geocoder {
    if (!this.geocoder) {
      this.geocoder = new google.maps.Geocoder();
    }
    return this.geocoder;
  }

  static getPlaceById = (placeId: string): Promise<string | null> => {
    return new Promise((resolve, reject) => {
      Geocoder.getGeocoder().geocode({ placeId }, (result, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
          if (result === null || result.length === 0) {
            resolve(null);
            return;
          }
          resolve(result[0].formatted_address);
        }
        reject(new Error(`Geocoder failed due to ${status}`));
      });
    });
  };
}

export default Geocoder;
