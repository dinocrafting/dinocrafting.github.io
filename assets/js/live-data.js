document.addEventListener('DOMContentLoaded', async () => {
  const channelId = 'UCboeGauwIyfDKiYDhhTHgyA';
  const socialBladeUrl = `https://img.shields.io/youtube/channel/subscribers/${channelId}.json`;
  const videoCountUrl = `https://img.shields.io/youtube/channel/views/${channelId}.json`;

  const setStat = (key, value) => {
    document.querySelectorAll(`[data-stat="${key}"]`).forEach((el) => {
      el.textContent = value;
    });
  };
  const setSourceBadge = (source, state) => {
    const labels = {
      live: 'مباشر',
      cached: 'مخزن',
      unavailable: 'غير متاح'
    };
    const styles = {
      live: 'bg-emerald-500/20 text-emerald-300',
      cached: 'bg-yellow-500/20 text-yellow-300',
      unavailable: 'bg-red-500/20 text-red-300'
    };
    document.querySelectorAll(`[data-source-badge="${source}"]`).forEach((el) => {
      el.textContent = labels[state] || labels.cached;
      el.className = `px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${styles[state] || styles.cached}`;
    });
  };
  const setHealthDot = (state) => {
    const dot = document.getElementById('data-health-dot');
    if (!dot) return;
    dot.classList.remove('bg-emerald-400', 'bg-yellow-400', 'bg-red-500');
    if (state === 'live') dot.classList.add('bg-emerald-400');
    else if (state === 'unavailable') dot.classList.add('bg-red-500');
    else dot.classList.add('bg-yellow-400');
  };

  const parseBadgeValue = (raw) => {
    if (!raw) return null;
    return raw.replace(/\s*(subscribers|views)\s*$/i, '').trim();
  };

  try {
    const cachedRes = await fetch('/api/stats.json', { cache: 'no-store' });
    if (cachedRes.ok) {
      const cached = await cachedRes.json();
      if (cached?.youtube?.subscribers) setStat('youtube-subscribers', cached.youtube.subscribers);
      if (cached?.youtube?.views) setStat('youtube-videos', cached.youtube.views);
      if (typeof cached?.news?.total_posts === 'number') setStat('blog-posts', `${cached.news.total_posts}`);
      if (cached?.discord?.members_online) setStat('discord-members', `${cached.discord.members_online}`);
      if (cached?.modrinth?.flowinventory_downloads) setStat('flowinventory-downloads', `${cached.modrinth.flowinventory_downloads}`);

      if (cached?.youtube?.latest_video) {
        document.querySelectorAll('[data-latest-video-title]').forEach((el) => {
          el.textContent = cached.youtube.latest_video.title || 'آخر فيديو';
        });
        document.querySelectorAll('[data-latest-video-link]').forEach((el) => {
          el.href = cached.youtube.latest_video.url || 'https://www.youtube.com/@Dinocrafting';
        });
        document.querySelectorAll('[data-latest-video-thumb]').forEach((el) => {
          el.src = cached.youtube.latest_video.thumbnail || '';
        });
      }

      if (cached?.sources) {
        let liveCount = 0;
        let unavailableCount = 0;
        Object.entries(cached.sources).forEach(([source, state]) => {
          setSourceBadge(source, state === 'live' ? 'live' : (state === 'unavailable' ? 'unavailable' : 'cached'));
          if (state === 'live') liveCount += 1;
          if (state === 'unavailable') unavailableCount += 1;
        });
        if (cached?.health?.is_stale) setHealthDot('unavailable');
        else if (liveCount >= 2 && unavailableCount <= 2) setHealthDot('live');
        else setHealthDot('cached');
      }

      const fanLatestPosts = document.getElementById('fan-latest-posts');
      if (fanLatestPosts && Array.isArray(cached?.news?.posts)) {
        const top3 = cached.news.posts.slice(0, 3);
        fanLatestPosts.innerHTML = top3.map((post) => `
          <a href="${post.url || '#'}" target="_blank" class="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-moroccangreen/40 transition-all">
            <div class="text-white font-bold text-sm line-clamp-2 mb-2">${post.title || 'بدون عنوان'}</div>
            <div class="text-gray-400 text-xs line-clamp-2">${post.excerpt || ''}</div>
          </a>
        `).join('');
      }
      return;
    }
  } catch (error) {
    console.warn('Cached stats fetch failed:', error);
  }

  try {
    const subscribersRes = await fetch(socialBladeUrl);
    if (subscribersRes.ok) {
      const subscribersData = await subscribersRes.json();
      const subsValue = parseBadgeValue(subscribersData.value);
      if (subsValue) setStat('youtube-subscribers', subsValue);
    }
  } catch {}

  try {
    const viewsRes = await fetch(videoCountUrl);
    if (viewsRes.ok) {
      const viewsData = await viewsRes.json();
      const viewsValue = parseBadgeValue(viewsData.value);
      if (viewsValue) setStat('youtube-videos', viewsValue);
    }
  } catch {}

  if ([...document.querySelectorAll('[data-stat="discord-members"]')].every((el) => el.textContent === '--' || el.textContent === '0')) {
    setStat('discord-members', '0');
  }
  setSourceBadge('youtube_feed', 'cached');
  setSourceBadge('modrinth_api', 'cached');
  setSourceBadge('blogger_feed', 'cached');
  setHealthDot('cached');
});
