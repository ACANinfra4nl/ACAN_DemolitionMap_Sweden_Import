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

export const buildingsQuery = groq`*[_type == "building" && reviewed == true] {
  ...,
  location { lat, lng },
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
