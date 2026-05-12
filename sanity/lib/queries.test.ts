import {
  buildingsListQuery,
  buildingsMapQuery,
  buildingsQuery,
} from "./queries";

describe("building queries", () => {
  test("buildingsListQuery does not expose contributor email or wildcard projections", () => {
    expect(buildingsListQuery).not.toContain("contributor");
    expect(buildingsListQuery).not.toContain("...");
  });

  test("buildingsMapQuery does not expose contributor email or wildcard projections", () => {
    expect(buildingsMapQuery).not.toContain("contributor");
    expect(buildingsMapQuery).not.toContain("...");
  });

  test("deprecated buildingsQuery aliases list query", () => {
    expect(buildingsQuery).toBe(buildingsListQuery);
  });
});
