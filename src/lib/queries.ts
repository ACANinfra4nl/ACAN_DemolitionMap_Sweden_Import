import { groq } from "next-sanity";

export const manifestQuery = groq`*[_type=="manifest"] | order(_updatedAt desc)[0]`;
