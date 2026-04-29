---
layout: default
title: FlowInventory
description: Intelligent auto-sorting and hotbar management for Minecraft. No more manual sorting!
image: https://media.forgecdn.net/avatars/591/10/637841050000000000.png
download_url: "https://www.curseforge.com/minecraft/mc-mods/flowinventory"
author: Dinocrafting
category: Utility
version: 1.21+
tags: [inventory, automation, utility, quality of life]
---

<section class="py-12" dir="ltr">
  <div class="max-w-4xl mx-auto px-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row gap-12 items-center mb-16">
      <div class="w-48 h-48 rounded-[2rem] overflow-hidden shadow-2xl border-4 border-moroccangreen/20">
        <img src="{{ page.image }}" alt="FlowInventory Logo" class="w-full h-full object-cover">
      </div>
      <div class="flex-1 text-center md:text-left">
        <h1 class="text-5xl font-extrabold mb-4 text-white">FlowInventory</h1>
        <div class="flex flex-wrap justify-center md:justify-start gap-3 mb-6">
          <span class="px-4 py-1 bg-moroccangreen/20 text-moroccangreen rounded-full text-xs font-bold uppercase tracking-widest">{{ page.category }}</span>
          <span class="px-4 py-1 bg-white/5 text-gray-400 rounded-full text-xs font-bold uppercase tracking-widest">Version {{ page.version }}</span>
        </div>
        <a href="{{ page.download_url }}" target="_blank" class="inline-flex items-center gap-3 px-8 py-4 bg-moroccangreen hover:bg-moroccangreen/80 text-white rounded-2xl font-bold transition-all shadow-lg shadow-moroccangreen/40 scale-100 hover:scale-105 active:scale-95">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          Download on CurseForge
        </a>
      </div>
    </div>

    <!-- Ad Break -->
    {% include ad-slot.html zone="in_content" %}

    <!-- Content -->
    <div class="prose prose-invert max-w-none prose-emerald">
      <h2 class="text-3xl font-bold mb-6 text-moroccangreen">What is FlowInventory?</h2>
      <p class="text-gray-300 text-lg leading-relaxed mb-8">
        FlowInventory is the ultimate inventory management mod. It intelligently organizes your items, swaps tools automatically, and ensures your hotbar is always ready for action.
      </p>

      <div class="grid md:grid-cols-2 gap-8 mb-12">
        <div class="p-8 rounded-3xl bg-white/5 border border-white/10">
          <h3 class="text-xl font-bold mb-4 flex items-center gap-3">
            <span class="w-2 h-2 rounded-full bg-moroccangreen"></span>
            Auto-Sorting
          </h3>
          <p class="text-gray-400 text-sm">One click or automatic sorting of chests and player inventory using advanced algorithms.</p>
        </div>
        <div class="p-8 rounded-3xl bg-white/5 border border-white/10">
          <h3 class="text-xl font-bold mb-4 flex items-center gap-3">
            <span class="w-2 h-2 rounded-full bg-moroccangreen"></span>
            Smart Hotbar
          </h3>
          <p class="text-gray-400 text-sm">The mod learns your playstyle and places the right tools exactly where you need them.</p>
        </div>
      </div>

      <h2 class="text-3xl font-bold mb-6 text-moroccangreen">How to Install</h2>
      <ol class="list-decimal list-inside space-y-4 text-gray-400">
        <li>Download and install <strong class="text-white">Minecraft Forge</strong> or <strong class="text-white">Fabric</strong>.</li>
        <li>Download the <strong class="text-white">FlowInventory.jar</strong> file from CurseForge.</li>
        <li>Drag and drop the file into your <code class="bg-black/50 px-2 py-1 rounded">/mods</code> folder.</li>
        <li>Restart Minecraft and enjoy a clean inventory!</li>
      </ol>
    </div>

    <!-- More Ads -->
    <div class="mt-20">
      {% include ad-slot.html zone="footer" %}
    </div>
  </div>
</section>
