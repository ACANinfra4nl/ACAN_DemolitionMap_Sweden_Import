const example1 = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        datasource: {
          sourcename: "openstreetmap",
          attribution: "© OpenStreetMap contributors",
          license: "Open Database License",
          url: "https://www.openstreetmap.org/copyright",
        },
        name: "Gamla Fagerstavägen",
        country: "Sweden",
        country_code: "se",
        county: "Västmanland County",
        city: "Östergruvan",
        municipality: "Skinnskattebergs kommun",
        street: "Gamla Fagerstavägen",
        lon: 15.5902035,
        lat: 59.8440418,
        distance: 121.20247048629362,
        result_type: "street",
        formatted: "Gamla Fagerstavägen, Östergruvan, Sweden",
        address_line1: "Gamla Fagerstavägen",
        address_line2: "Östergruvan, Sweden",
        timezone: {
          name: "Europe/Stockholm",
          name_alt: "Europe/Berlin",
          offset_STD: "+01:00",
          offset_STD_seconds: 3600,
          offset_DST: "+02:00",
          offset_DST_seconds: 7200,
          abbreviation_STD: "CET",
          abbreviation_DST: "CEST",
        },
        plus_code: "9FFQRHVR+J3",
        rank: {
          importance: 0.10000999999999993,
          popularity: 1.7508903961735622,
        },
        place_id:
          "512ff834272f2e2f40597ebacb8f09ec4d40f00102f901ab3f3f0b00000000c0020492031447616d6c6120466167657273746176c3a467656e",
      },
      geometry: {
        type: "Point",
        coordinates: [15.5902035, 59.8440418],
      },
      bbox: [15.5732181, 59.8329764, 15.6032635, 59.8612653],
    },
  ],
  query: {
    lat: 59.85753868570677,
    lon: 15.59667617187327,
    plus_code: "9FFQVH5W+2M",
  },
};
