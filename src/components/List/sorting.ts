type BuildingSorter = (
  descending: boolean,
) => (a: BuildingFeature, b: BuildingFeature) => number;

export const buildYearSorter: BuildingSorter = (desc) => (a, b) =>
  (a.properties.buildYear - b.properties.buildYear) * (desc ? -1 : 1);

export const demolitionYearSorter: BuildingSorter = (desc) => (a, b) =>
  a.properties.demolitionYear && b.properties.demolitionYear
    ? (a.properties.demolitionYear - b.properties.demolitionYear) *
      (desc ? -1 : 1)
    : a.properties.demolitionYear
    ? -1
    : 1;

// const addressSorter: BuildingSorter = (desc) => (a, b) =>
//   (a.properties.address &&
//   b.properties.address &&
//   a.properties.address < b.properties.address
//     ? -1
//     : 1) * (desc ? -1 : 1);

export const createdAtSorter: BuildingSorter = (desc) => (a, b) =>
  (a.properties._createdAt < b.properties._createdAt ? -1 : 1) *
  (desc ? -1 : 1);

export const SORTERS = {
  buildYear: buildYearSorter,
  demolitionYear: demolitionYearSorter,
  // address: addressSorter,
  _createdAt: createdAtSorter,
};
