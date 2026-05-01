document.addEventListener('DOMContentLoaded', () => {
  const adSlots = document.querySelectorAll('.ad-slot');
  if (!adSlots.length) return;

  let loaded = false;
  const loadAds = () => {
    if (loaded) return;
    loaded = true;

    const appendWithScripts = (container, html) => {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = html;

      Array.from(wrapper.childNodes).forEach((node) => {
        if (node.nodeName && node.nodeName.toLowerCase() === 'script') {
          const script = document.createElement('script');
          Array.from(node.attributes).forEach((attr) => script.setAttribute(attr.name, attr.value));
          script.text = node.textContent || '';
          container.appendChild(script);
        } else {
          container.appendChild(node.cloneNode(true));
        }
      });
    };

    adSlots.forEach((slot) => {
      const container = slot.querySelector('[id^="ad-"][id$="-container"]');
      const template = slot.querySelector('.ad-template');
      if (!container || !template) return;
      container.innerHTML = '';
      appendWithScripts(container, template.innerHTML);
    });
  };

  ['click', 'scroll', 'keydown', 'touchstart'].forEach((eventName) => {
    window.addEventListener(eventName, loadAds, { once: true, passive: true });
  });

  // Fallback so ads still appear for passive users.
  window.setTimeout(loadAds, 6000);
});
