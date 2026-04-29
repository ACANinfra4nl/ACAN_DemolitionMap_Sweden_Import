import { buildingsQuery } from "./queries";

describe("buildingsQuery", () => {
  test("does not expose contributor email or wildcard projections", () => {
    expect(buildingsQuery).not.toContain("contributor");
    expect(buildingsQuery).not.toContain("...");
  });
});
