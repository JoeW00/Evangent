import { chapters, getChapter, getAdjacentChapters } from "./chapters";

describe("chapters", () => {
  it("has 15 entries", () => {
    expect(chapters).toHaveLength(15);
  });

  it("all IDs are unique", () => {
    const ids = chapters.map((ch) => ch.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every chapter has non-empty zh.file, zh.title, en.file, en.title", () => {
    for (const ch of chapters) {
      expect(ch.zh.file).toEqual(expect.any(String));
      expect(ch.zh.file.length).toBeGreaterThan(0);
      expect(ch.zh.title).toEqual(expect.any(String));
      expect(ch.zh.title.length).toBeGreaterThan(0);
      expect(ch.en.file).toEqual(expect.any(String));
      expect(ch.en.file.length).toBeGreaterThan(0);
      expect(ch.en.title).toEqual(expect.any(String));
      expect(ch.en.title.length).toBeGreaterThan(0);
    }
  });
});

describe("getChapter", () => {
  it('returns correct entry for "ch01"', () => {
    const ch = getChapter("ch01");
    expect(ch).toBeDefined();
    expect(ch.zh.title).toBe("神所建造的殿");
  });

  it("returns undefined for nonexistent id", () => {
    expect(getChapter("nonexistent")).toBeUndefined();
  });
});

describe("getAdjacentChapters", () => {
  it("foreword has no prev, next is introduction", () => {
    const { prev, next } = getAdjacentChapters("foreword");
    expect(prev).toBeNull();
    expect(next.id).toBe("introduction");
  });

  it("ch13 has no next, prev is ch12", () => {
    const { prev, next } = getAdjacentChapters("ch13");
    expect(next).toBeNull();
    expect(prev.id).toBe("ch12");
  });

  it("ch05 has prev ch04 and next ch06", () => {
    const { prev, next } = getAdjacentChapters("ch05");
    expect(prev.id).toBe("ch04");
    expect(next.id).toBe("ch06");
  });

  it("invalid id returns prev null, next is first chapter (findIndex returns -1)", () => {
    const { prev, next } = getAdjacentChapters("invalid");
    expect(prev).toBeNull();
    // When findIndex returns -1, index < chapters.length-1 is true, so next = chapters[0]
    expect(next).not.toBeNull();
    expect(next.id).toBe("foreword");
  });
});
