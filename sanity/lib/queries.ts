import { groq } from "next-sanity";

export const manifestQuery = groq`*[_type == "manifest" && _id == "manifest"] | order(_updatedAt desc)[0] {
  ...,
  // "latestBuildings": *[_type == "building" && reviewed && state == "riven"] | order(_updatedAt desc)[0...10] {
  //   ...,
  //   location { lat, lng },
  //   images[] {
  //     ...,
  //     asset-> {
  //       _id,
  //       url,
  //       metadata {
  //         dimensions { width, height }
  //       }
  //     }
  //   }
  // }
}`;

const buildingProjection = groq`{
  _id,
  _createdAt,
  reviewed,
  location { lat, lng },
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
  sources,
  images[] {
    _key,
    asset-> {
      _id,
      url,
      metadata {
        dimensions { width, height }
      }
    }
  }
}`;

/** Curated list: reviewed buildings only */
export const buildingsListQuery = groq`*[_type == "building" && reviewed == true] ${buildingProjection}`;

/** Map: reviewed buildings plus unreviewed when map_visibility is not explicitly false */
export const buildingsMapQuery = groq`*[_type == "building" && (reviewed == true || (reviewed != true && coalesce(map_visibility, true)))] ${buildingProjection}`;

/** @deprecated Use buildingsListQuery or buildingsMapQuery */
export const buildingsQuery = buildingsListQuery;

export const buildingMetaQuery = groq`*[_type == "building" && _id == $id] {
  _id,
  images[] {
    ...,
    asset-> {
      _id,
      url,
      metadata {
        dimensions { width, height }
      }
    }
  }
}`;

export const settingsQuery = groq`*[_id == "settings"][0] {
  ...,
  confirmationMessage {
    heading,
    body,
  },
  errorMessage {
    heading,
    body,
  },
  seo {
    description,
    image {
      ...,
      asset-> {
        _id,
        url,
        metadata {
          dimensions { width, height }
        }
      }
    }
  }
}`;
