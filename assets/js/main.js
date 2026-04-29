// Dinocrafting Hub - Main JS
document.addEventListener('DOMContentLoaded', () => {
  console.log('Dinocrafting Hub Initialized 🎮');
  
  // Logic for lazy-loading ads or tracking shortlink clicks can be added here
  const adSlots = document.querySelectorAll('.ad-slot');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const zone = entry.target.dataset.zone;
        loadAd(zone);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  adSlots.forEach(slot => observer.observe(slot));
});

function loadAd(zone) {
  console.log(`Loading ad for zone: ${zone}`);
  const container = document.getElementById(`ad-${zone}-container`);
  if (!container) return;

  // Actual ad network scripts would be injected here
  // Example for PropellerAds or similar:
  /*
  const script = document.createElement('script');
  script.src = `//example.com/ad-script-${zone}.js`;
  container.appendChild(script);
  */
}
