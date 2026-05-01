import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const outDir = path.join(root, "api");
const outFile = path.join(outDir, "stats.json");
const dataFile = path.join(root, "_data", "stats.json");

const channelId = "UCboeGauwIyfDKiYDhhTHgyA";
const discordServerId = "1103382525679775794";
const bloggerFeed = "https://dinocrafting9988.blogspot.com/feeds/posts/default?alt=json&max-results=40";
const youtubeFeed = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
const modrinthProject = "flowinventory";

function parseXmlTag(xml, tag) {
  const regex = new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`, "i");
  const m = xml.match(regex);
  return m ? m[1].trim() : null;
}

function parseBloggerCategory(post) {
  const labels = (post.category || []).map((c) => c.term.toLowerCase());
  if (labels.some((l) => l.includes("mod") || l.includes("مود"))) return "mods";
  if (labels.some((l) => l.includes("theor") || l.includes("نظر"))) return "theories";
  if (labels.some((l) => l.includes("news") || l.includes("أخبار") || l.includes("خبر"))) return "news";
  return "blogs";
}

function stripHtml(input = "") {
  return input.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

async function fetchJson(url) {
  const res = await fetch(url, { headers: { "User-Agent": "dinocrafting-stats-bot" } });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

async function fetchText(url) {
  const res = await fetch(url, { headers: { "User-Agent": "dinocrafting-stats-bot" } });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.text();
}

async function main() {
  const now = new Date().toISOString();
  const nowMs = Date.now();
  const staleAfterMinutes = 90;
  const health = {
    generated_at: now,
    next_refresh_minutes: 30,
    stale_after_minutes: staleAfterMinutes,
    age_minutes: 0,
    is_stale: false
  };

  const stats = {
    stats_version: "2.1.0",
    health,
    generated_at: now,
    sources: {
      youtube_badges: "unavailable",
      youtube_feed: "unavailable",
      discord_widget: "unavailable",
      modrinth_api: "unavailable",
      blogger_feed: "unavailable"
    },
    youtube: { subscribers: null, views: null, latest_video: null },
    discord: { members_online: null, members_total: null },
    modrinth: { flowinventory_downloads: null, flowinventory_followers: null, status: "under_review" },
    news: { total_posts: 0, featured: null, trending_labels: [], posts: [] }
  };

  // YouTube (public badges + RSS)
  try {
    const subs = await fetchJson(`https://img.shields.io/youtube/channel/subscribers/${channelId}.json`);
    stats.youtube.subscribers = (subs.value || "").replace(/\s*subscribers$/i, "").trim();
    stats.sources.youtube_badges = "live";
  } catch {}
  try {
    const views = await fetchJson(`https://img.shields.io/youtube/channel/views/${channelId}.json`);
    stats.youtube.views = (views.value || "").replace(/\s*views$/i, "").trim();
    stats.sources.youtube_badges = "live";
  } catch {}
  try {
    const ytxml = await fetchText(youtubeFeed);
    const firstEntry = ytxml.split("<entry>")[1];
    if (firstEntry) {
      const entryXml = `<entry>${firstEntry}`;
      const title = parseXmlTag(entryXml, "title");
      const videoId = parseXmlTag(entryXml, "yt:videoId");
      const published = parseXmlTag(entryXml, "published");
      if (videoId) {
        stats.youtube.latest_video = {
          title: title || "Latest upload",
          video_id: videoId,
          url: `https://www.youtube.com/watch?v=${videoId}`,
          thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
          published_at: published
        };
        stats.sources.youtube_feed = "live";
      }
    }
  } catch {}

  // Discord widget
  try {
    const discord = await fetchJson(`https://discord.com/api/guilds/${discordServerId}/widget.json`);
    stats.discord.members_online = discord.presence_count ?? null;
    stats.discord.members_total = Array.isArray(discord.members) ? discord.members.length : null;
    stats.sources.discord_widget = "live";
  } catch {}

  // Modrinth project
  try {
    const project = await fetchJson(`https://api.modrinth.com/v2/project/${modrinthProject}`);
    stats.modrinth.flowinventory_downloads = project.downloads ?? null;
    stats.modrinth.flowinventory_followers = project.followers ?? null;
    stats.sources.modrinth_api = "live";
  } catch {}

  // Blogger feed for native news cache
  try {
    const blog = await fetchJson(bloggerFeed);
    const entries = blog?.feed?.entry || [];
    const labelFreq = {};
    const posts = entries.map((entry) => {
      const title = entry.title.$t;
      const rawContent = entry.content ? entry.content.$t : (entry.summary?.$t || "");
      const date = entry.published.$t;
      const alt = (entry.link || []).find((l) => l.rel === "alternate");
      const labels = (entry.category || []).map((c) => c.term);
      labels.forEach((label) => {
        labelFreq[label] = (labelFreq[label] || 0) + 1;
      });
      const imageMatch = rawContent.match(/<img[^>]+src="([^">]+)"/i);
      return {
        id: entry.id.$t,
        title,
        url: alt?.href || "",
        excerpt: stripHtml(rawContent).slice(0, 220),
        published_at: date,
        labels,
        category: parseBloggerCategory(entry),
        image: imageMatch ? imageMatch[1] : null
      };
    });

    posts.sort((a, b) => new Date(b.published_at) - new Date(a.published_at));
    const trending = Object.entries(labelFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([label]) => label);

    stats.news.total_posts = Number(blog?.feed?.openSearch$totalResults?.$t || posts.length);
    stats.news.featured = posts[0] || null;
    stats.news.trending_labels = trending;
    stats.news.posts = posts.slice(0, 20);
    stats.sources.blogger_feed = "live";
  } catch {}

  health.age_minutes = Math.floor((Date.now() - nowMs) / 60000);
  health.is_stale = health.age_minutes > staleAfterMinutes;

  await fs.mkdir(outDir, { recursive: true });
  const payload = JSON.stringify(stats, null, 2);
  await fs.writeFile(outFile, payload, "utf8");
  await fs.writeFile(dataFile, payload, "utf8");
  console.log(`Updated stats cache at ${outFile}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
