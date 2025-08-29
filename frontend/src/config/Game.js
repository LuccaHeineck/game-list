export default class Game {
  constructor({
    id,
    name,
    summary,
    releaseDate,
    coverUrl,
    rating,
    gameType,
    genreNames,
    artworkUrls,
    videoUrls,
    screenshotUrls,
    platforms,
    publishers,
    developers,
    hltb, // novo campo
    storyline,
  }) {
    this.id = id ?? null;
    this.name = name ?? "";
    this.summary = summary ?? "";
    this.releaseDate = releaseDate ?? null;
    this.coverUrl = coverUrl ?? "";
    this.rating = rating ?? 0;
    this.gameType = gameType ?? "";
    this.genreNames = genreNames ?? [];
    this.artworkUrls = artworkUrls ?? [];
    this.videoUrls = videoUrls ?? [];
    this.screenshotUrls = screenshotUrls ?? [];
    this.platforms = platforms ?? [];
    this.publishers = publishers ?? [];
    this.developers = developers ?? [];
    this.hltb = hltb ?? null;
    this.storyline = storyline ?? "";
  }

  getFormattedRating() {
    return Math.round(this.rating * 10) / 100;
  }

  getCoverBig() {
    return this.coverUrl
      ? `https:${this.coverUrl.replace("t_thumb", "t_cover_big")}`
      : null;
  }

  getRandomScreenshot(size = "t_1080p") {
    if (!this.screenshotUrls.length) return null;
    const index = Math.floor(Math.random() * this.screenshotUrls.length);
    return `https://images.igdb.com/igdb/image/upload/${size}/${this.screenshotUrls[index]}.jpg`;
  }

  getYear() {
    if (!this.releaseDate) return null;
    return new Date(this.releaseDate).getFullYear();
  }

  formatHLTB(seconds) {
    if (!seconds) return "N/A";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  }
}
