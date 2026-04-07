import { getSavedProgress, getReadChapters } from "./useReadingProgress";

beforeEach(() => {
  localStorage.clear();
});

describe("getSavedProgress", () => {
  it("returns null when no data", () => {
    expect(getSavedProgress()).toBeNull();
  });

  it("returns parsed object for valid JSON", () => {
    const data = { lastChapter: "ch03", scrollRatio: 0.5 };
    localStorage.setItem("evangent-reading-progress", JSON.stringify(data));
    expect(getSavedProgress()).toEqual(data);
  });

  it("returns null for corrupt JSON", () => {
    localStorage.setItem("evangent-reading-progress", "{bad json!!}");
    expect(getSavedProgress()).toBeNull();
  });
});

describe("getReadChapters", () => {
  it("returns empty array when no data", () => {
    expect(getReadChapters()).toEqual([]);
  });

  it("returns parsed array for valid data", () => {
    const data = ["ch01", "ch02"];
    localStorage.setItem("evangent-chapters-read", JSON.stringify(data));
    expect(getReadChapters()).toEqual(data);
  });

  it("returns empty array for corrupt data", () => {
    localStorage.setItem("evangent-chapters-read", "not json");
    expect(getReadChapters()).toEqual([]);
  });
});
