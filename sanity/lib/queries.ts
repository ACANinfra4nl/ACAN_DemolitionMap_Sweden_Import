import { groq } from "next-sanity";

export const manifestQuery = groq`*[_type == "manifest" && _id == "manifest"] | order(_updatedAt desc)[0] {
    ...,
    "latestBuildings": *[_type == "building" && reviewed && state == "riven"] | order(_updatedAt desc)[0...10]
}`;

export const buildingsQuery = groq`*[_type == "building" && reviewed == true] {
    _id,
    category,
    state,
    name,
    address,
    postcode,
    city,
    blockName,
    propertyDesignation,
    size,
    boundCO2,
    architect,
    propertyOwner,
    buildYear,
    demolitionYear,
    description,
    demolitionCause,
    location { lat, lng },
    images
}`;

export const settingsQuery = groq`*[_id == "settings"][0] {
    confirmationMessage {
        heading,
        body,
    },
    errorMessage {
        heading,
        body,
    },
}`;
