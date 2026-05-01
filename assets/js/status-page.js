document.addEventListener('DOMContentLoaded', async () => {
  const sourcesContainer = document.getElementById('status-sources');
  if (!sourcesContainer) return;

  const badgeClass = (state) => {
    if (state === 'live') return 'bg-emerald-500/20 text-emerald-300';
    if (state === 'unavailable') return 'bg-red-500/20 text-red-300';
    return 'bg-yellow-500/20 text-yellow-300';
  };

  try {
    const res = await fetch('/api/stats.json', { cache: 'no-store' });
    const stats = await res.json();

    const set = (id, value) => {
      const el = document.getElementById(id);
      if (el) el.textContent = value;
    };

    set('status-version', stats.stats_version || '--');
    set('status-generated', stats.generated_at || '--');
    set('status-age', String(stats.health?.age_minutes ?? '--'));
    set('status-stale-after', `${stats.health?.stale_after_minutes ?? '--'} دقيقة`);
    set('status-state', stats.health?.is_stale ? 'منتهي' : 'سليم');

    const sources = stats.sources || {};
    sourcesContainer.innerHTML = Object.entries(sources).map(([key, state]) => `
      <div class="p-4 rounded-xl bg-black/30 border border-white/10 flex items-center justify-between gap-3">
        <span class="text-gray-300 text-sm">${key}</span>
        <span class="px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${badgeClass(state)}">${state === 'live' ? 'مباشر' : (state === 'unavailable' ? 'غير متاح' : 'مخزن')}</span>
      </div>
    `).join('');
  } catch (error) {
    sourcesContainer.innerHTML = '<div class="text-red-400 text-sm">تعذر تحميل بيانات الحالة.</div>';
    console.warn('Status page load failed:', error);
  }
});
