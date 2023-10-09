import { GeoJSONFeature } from "maplibre-gl";

export const reverse = async (lat: string | number, lng: string | number) => {
  const results = await fetch(
    `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&lang=sv&apiKey=${process.env.GEOAPIFY_TOKEN}`,
  ).then((response) => response.json());
  const result = results.features[0] as {
    properties: {
      name: string; //	Location name
      country: string; //	Country component of the address
      country_code: string; //	ISO 3166-1 alpha-2 country code
      state: string; //	State component of the address
      state_code: string; //	State shortcode, the shortcode might be missing for some countries and languages
      county: string; //	County component of the address
      county_code: string; //	County shortcode, the shortcode might be missing for some countries and languages
      postcode: string; //	Postcode or ZIP code of the address
      city: string; //	City component of the address
      street: string; //	Street component of the address
      housenumber: string; //	House number component of an address
      lat: number; //
      lon: number; //	Coordinates of the location
      formatted: string; //	Display address
      address_line1: string; //	Main part of the display address, contains building street and house number or amenity name
      address_line2: string; //	The second part of the display address, contains address parts not included to address_line1
      result_type:
        | "unknown"
        | "amenity"
        | "building"
        | "street"
        | "suburb"
        | "district"
        | "postcode"
        | "city"
        | "county"
        | "state"
        | "country"; //	Found location type. Can take values from [unknown, amenity, building, street, suburb, district, postcode, city, county, state, country]
      distance: number; //	Distance in meters to the given coordinates
      // rank	Calculated rank for the result
      // rank.confidence	Confidence value, takes values from 0 to 1
      // rank.confidence_city_level	City-level confidence, takes values from 0 to 1. Evaluates if the city is correct.
      // rank.confidence_street_level	Street-level confidence, takes values from 0 to 1. Evaluates if the street is correct.
      // rank.match_type	Match type between requested address and result address. Can take values from [ full_match, inner_part, match_by_building match_by_street, match_by_postcode, match_by_city_or_disrict, match_by_country_or_state]
      // datasource	Contains name of data source and data specific for the data source
      // category	A place category from the list of Places API Categories
      // timezone	Information about timezone the place belongs to.
      // timezone.name	Timezone name.
      // timezone.name_alt	The alternative name of the timezone, if exist.
      // timezone.offset_STD	Time offset.
      // timezone.offset_STD_seconds	Time offset in seconds.
      // timezone.offset_DST	Time offset for daylight saving time.
      // timezone.offset_DST_seconds	Time offset in seconds for daylight saving time.
      // timezone.abbreviation_STD	Timezone abbreviation. Provided when exists.
      // timezone.abbreviation_DST	Timezone abbreviation for daylight saving time. Provided when exists.
    };
  };
  if (!result) return undefined;
  const response: ReverseGeocodeResult = {
    address: [result.properties.street, result.properties.housenumber].join(
      " ",
    ),
    postcode: result.properties.postcode,
    city: result.properties.city,
  };
  return response;
};
