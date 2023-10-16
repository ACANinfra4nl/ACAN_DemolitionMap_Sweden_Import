import { formatAddress } from "@/lib/formatAddress";

export const buildingToQueryParams = (building: FeatureBuilding) =>
  `address=${encodeURIComponent(
    formatAddress(building.address, building.postcode, building.city),
  )}&view=${encodeURIComponent(building._id)}`;
