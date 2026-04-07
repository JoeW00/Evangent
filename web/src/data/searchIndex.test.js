import { search, getSearchIndex } from "./searchIndex";

describe("search", () => {
  it('search("God") returns non-empty array', async () => {
    const results = await search("God");
    expect(results.length).toBeGreaterThan(0);
  });

  it('search("孩子") returns non-empty array', async () => {
    const results = await search("孩子");
    expect(results.length).toBeGreaterThan(0);
  });

  it("results have correct shape", async () => {
    const results = await search("God");
    expect(results.length).toBeGreaterThan(0);
    for (const r of results) {
      expect(r).toHaveProperty("chapterId");
      expect(r).toHaveProperty("lang");
      expect(r).toHaveProperty("chapterTitle");
      expect(r).toHaveProperty("excerpt");
      expect(r).toHaveProperty("score");
    }
  });

  it("returns empty array for nonsense query", async () => {
    const results = await search("xyznonexistent123");
    expect(results).toEqual([]);
  });

  it("respects limit parameter", async () => {
    const results = await search("God", 3);
    expect(results.length).toBeLessThanOrEqual(3);
  });
});

describe("getSearchIndex", () => {
  it("returns same instance on multiple calls (caching)", async () => {
    const a = await getSearchIndex();
    const b = await getSearchIndex();
    expect(a).toBe(b);
  });
});
