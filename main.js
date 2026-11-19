(async function () {
  'use strict';

  if (typeof window.Phaser === 'undefined') {
    document.getElementById('game-container').innerHTML =
      '<div style="padding:32px;font-size:24px;text-align:center;color:#ffd700;">Phaser 3 failed to load from CDN. Please check your internet connection or download phaser.min.js locally.</div>';
    return;
  }

  /* =========================================================
     0. LOAD EXTERNAL JSON DATA (data.json)
  ========================================================= */
  async function loadGameData() {
    if (window.GAME_DATA) return window.GAME_DATA;
    const res = await fetch('./data.json', { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status} while loading data.json`);
    return await res.json();
  }

  let GAME_DATA;
  try {
    GAME_DATA = await loadGameData();
  } catch (err) {
    console.error('Could not load data.json:', err);
    document.getElementById('game-container').innerHTML = `
      <div style="padding:28px;font-size:20px;line-height:1.4;text-align:center;color:#ffd700;background:#1f1d36;height:100%;display:flex;flex-direction:column;justify-content:center;gap:12px;">
        <strong>Could not load <code>data.json</code></strong>
        <span style="color:#f4e8c8;">Browsers block <code>fetch('./data.json')</code> when opening <code>index.html</code> via <code>file://</code>.<br>
        Run with VS Code <b>Live Server</b> (or <code>python -m http.server</code>), or load <code>data.js</code>.</span>
      </div>`;
    return;
  }

  const {
    LOCATIONS,
    MARKET_ITEMS,
    REWARD_ITEMS,
    JOURNAL_ENTRIES,
    QUESTS,
    CHARACTERS,
    NPC_LINES
  } = GAME_DATA;

  window.GAME_DATA = GAME_DATA;

  /* =========================================================
     0.5 INJECT CRISP OVERLAY STYLES (LABELS, BLUEPRINT, FEEDBACK)
  ========================================================= */
  (function injectExtraStyles() {
    if (document.getElementById('eov-extra-styles')) return;
    const style = document.createElement('style');
    style.id = 'eov-extra-styles';
    style.textContent = `
      #world-labels-layer {
        position: absolute;
        inset: 0;
        pointer-events: none;
        overflow: hidden;
        z-index: 10;
      }
      .world-label {
        position: absolute;
        transform: translate(-50%, -100%);
        font-family: 'VT323', monospace;
        font-size: clamp(13px, 1.3vw, 17px);
        line-height: 1.05;
        color: #ffefc2;
        background: rgba(20, 14, 30, 0.86);
        border: 1px solid rgba(245, 166, 35, 0.6);
        border-radius: 3px;
        padding: 1px 6px;
        white-space: nowrap;
        text-shadow: 1px 1px 0 #0c0814;
        -webkit-font-smoothing: antialiased;
      }
      .world-label.parent-label {
        border-color: rgba(255, 215, 0, 0.85);
        color: #ffe699;
      }
      .world-label.sans-label {
        border-color: rgba(110, 200, 255, 0.85);
        color: #bfe8ff;
        font-family: 'VT323', monospace;
        letter-spacing: 1px;
      }
      .world-prompt {
        position: absolute;
        transform: translate(-50%, -100%);
        font-family: 'VT323', monospace;
        font-size: clamp(15px, 1.5vw, 20px);
        line-height: 1.1;
        color: #fff5d6;
        background: rgba(34, 20, 12, 0.96);
        border: 2px solid #ffd700;
        border-radius: 4px;
        padding: 3px 10px;
        white-space: nowrap;
        box-shadow: 0 4px 14px rgba(0, 0, 0, 0.72);
        z-index: 12;
      }
      #dialogue-overlay {
        flex-direction: column;
        align-items: center;
        justify-content: flex-end;
        gap: 10px;
      }
      #blueprint-showcase {
        width: min(500px, 74%);
        background: linear-gradient(180deg, #5d3b22 0%, #3d2312 100%);
        border: 4px solid #241207;
        box-shadow: inset 0 0 0 2px #ffd700, 0 12px 30px rgba(0, 0, 0, 0.8);
        border-radius: 6px;
        padding: 8px 10px 10px;
        display: flex;
        flex-direction: column;
        gap: 6px;
        animation: bpReveal 0.22s ease-out;
      }
      @keyframes bpReveal {
        from { opacity: 0; transform: translateY(10px) scale(0.96); }
        to { opacity: 1; transform: translateY(0) scale(1); }
      }
      .bp-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-family: 'Press Start 2P', monospace;
        font-size: clamp(7.5px, 0.82vw, 10px);
        color: #ffd700;
        text-shadow: 1px 1px 0 #1f1006;
      }
      .bp-tag {
        font-family: 'VT323', monospace;
        font-size: clamp(14px, 1.3vw, 17px);
        color: #bfe4ff;
        background: #1a3b6e;
        border: 1px solid #6cb4f5;
        padding: 0 6px;
        border-radius: 3px;
      }
      #blueprint-showcase img {
        width: 100%;
        height: auto;
        display: block;
        image-rendering: pixelated;
        image-rendering: crisp-edges;
        border: 2px solid #9bd0ff;
        border-radius: 3px;
        background: #1b3f75;
      }
      .bp-caption {
        font-family: 'VT323', monospace;
        font-size: clamp(14px, 1.35vw, 18px);
        color: #f4e8c8;
        text-align: center;
      }
      .item-use-row {
        display: flex;
        justify-content: flex-end;
        margin-top: auto;
        padding-top: 6px;
        border-top: 1px dashed #b9a170;
      }
      .journal-actions-row {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        justify-content: flex-end;
        margin-top: 10px;
      }
      #feedback-overlay .feedback-panel {
        width: min(520px, 92%);
        padding: 18px 22px;
        display: flex;
        flex-direction: column;
        gap: 11px;
      }
      #feedback-overlay h2 {
        font-family: 'Press Start 2P', monospace;
        font-size: 13px;
        color: #ffd700;
        text-align: center;
      }
      .fb-stars {
        display: flex;
        gap: 8px;
        justify-content: center;
      }
      .fb-star {
        font-size: 26px;
        background: #2b170a;
        border: 2px solid #8a5a2a;
        color: #7a6855;
        border-radius: 4px;
        padding: 2px 10px;
        cursor: pointer;
      }
      .fb-star.active {
        color: #ffd700;
        border-color: #ffd700;
      }
      .fb-field {
        width: 100%;
        font-family: 'VT323', monospace;
        font-size: 19px;
        padding: 6px 10px;
        background: #f4e8c8;
        color: #2c1b0e;
        border: 2px solid #2b170a;
        border-radius: 4px;
      }
      .fb-list {
        max-height: 90px;
        overflow-y: auto;
        font-size: 16px;
        background: rgba(26, 15, 8, 0.72);
        border: 1px solid #8a5a2a;
        border-radius: 4px;
        padding: 6px 10px;
        color: #f4e8c8;
      }
    `;
    document.head.appendChild(style);
  })();

  /* =========================================================
     1. GAME STATE & LOCAL STORAGE SAVE MANAGER
  ========================================================= */
  const SAVE_KEY = 'echoes_of_vale_save_v1';

  function createInitialState() {
    const init = GAME_DATA.initialState;
    return {
      started: false,
      currentLocation: init.currentLocation,
      playerPos: { ...init.playerPos },
      gold: init.gold,
      hearts: init.hearts,
      socialCredibility: init.socialCredibility,
      maxSocialCredibility: init.maxSocialCredibility,
      marketplaceDiscountActive: false,
      hasBlueprints: false,
      heardLeo: false,
      loomBuilt: false,
      restorativeNeeded: false,
      inventory: init.inventory.map((item) => ({ ...item })),
      unlockedLocations: Object.fromEntries(
        Object.values(LOCATIONS).map((loc) => [loc.id, Boolean(loc.unlockedByDefault)])
      ),
      newlyUnlockedLocation: null,
      quests: {
        mayas_shadow: {
          stage: 'not_started',
          approachesTried: [],
          completed: false,
          rewardsClaimed: false,
          resolutionType: 'EMPATHETIC RESOLUTION'
        },
        mayas_loom: {
          stage: 'locked', // locked -> active -> completed
          completed: false,
          rewardsClaimed: false
        },
        highland_hearing: {
          stage: 'locked', // locked -> active -> completed
          completed: false,
          rewardsClaimed: false
        }
      },
      journalEntries: [],
      feedbackSubmissions: [],
      settings: {
        musicVolume: 0.45,
        sfxVolume: 0.7,
        textSpeed: 'normal'
      }
    };
  }

  class GameStateManager {
    constructor() {
      this.state = createInitialState();
      this.listeners = new Set();
      this.uiOpenCount = 0;
    }
    subscribe(fn) {
      this.listeners.add(fn);
      return () => this.listeners.delete(fn);
    }
    emit(event = 'update', payload = null) {
      this.listeners.forEach((fn) => fn(event, this.state, payload));
    }
    hasSave() {
      try { return Boolean(localStorage.getItem(SAVE_KEY)); } catch { return false; }
    }
    save() {
      try { localStorage.setItem(SAVE_KEY, JSON.stringify(this.state)); return true; } catch { return false; }
    }
    load() {
      try {
        const raw = localStorage.getItem(SAVE_KEY);
        if (!raw) return false;
        const parsed = JSON.parse(raw);
        const base = createInitialState();
        this.state = {
          ...base,
          ...parsed,
          unlockedLocations: { ...base.unlockedLocations, ...(parsed.unlockedLocations || {}) },
          quests: {
            mayas_shadow: { ...base.quests.mayas_shadow, ...(parsed.quests?.mayas_shadow || {}) },
            mayas_loom: { ...base.quests.mayas_loom, ...(parsed.quests?.mayas_loom || {}) },
            highland_hearing: { ...base.quests.highland_hearing, ...(parsed.quests?.highland_hearing || {}) }
          },
          settings: { ...base.settings, ...(parsed.settings || {}) },
          feedbackSubmissions: parsed.feedbackSubmissions || []
        };
        if (this.state.quests.mayas_shadow.completed && this.state.quests.mayas_loom.stage === 'locked') {
          this.state.quests.mayas_loom.stage = 'active';
        }
        if (this.state.socialCredibility >= LOCATIONS.highland_council.requiredSC) {
          this.state.unlockedLocations.highland_council = true;
          if (this.state.quests.highland_hearing.stage === 'locked') {
            this.state.quests.highland_hearing.stage = 'active';
          }
        }
        this.emit('loaded');
        return true;
      } catch { return false; }
    }
    resetNewGame() {
      const prevSettings = { ...this.state.settings };
      const prevFeedback = [...(this.state.feedbackSubmissions || [])];
      this.state = createInitialState();
      this.state.started = true;
      this.state.settings = prevSettings;
      this.state.feedbackSubmissions = prevFeedback;
      this.save();
      this.emit('reset');
    }
    setUIOpen(isOpen) {
      this.uiOpenCount = isOpen ? 1 : 0;
      this.emit('ui_toggle', isOpen);
    }
    isUIOpen() { return this.uiOpenCount > 0; }
    canEnterTailorShop() {
      const st = this.state.quests.mayas_shadow.stage;
      return st === 'family_meeting' || st === 'completed';
    }
    getItemQty(itemId) {
      const found = this.state.inventory.find((i) => i.id === itemId);
      return found ? found.qty : 0;
    }
    addItem(item, qty = 1) {
      const existing = this.state.inventory.find((i) => i.id === item.id);
      if (existing) existing.qty += qty;
      else this.state.inventory.push({ ...item, qty });
      this.save();
      this.emit('inventory_updated');
    }
    consumeItem(itemId, qty = 1) {
      const idx = this.state.inventory.findIndex((i) => i.id === itemId);
      if (idx === -1 || this.state.inventory[idx].qty < qty) return false;
      this.state.inventory[idx].qty -= qty;
      if (this.state.inventory[idx].qty <= 0) this.state.inventory.splice(idx, 1);
      this.save();
      this.emit('inventory_updated');
      return true;
    }
    spendGold(amount) {
      if (this.state.gold < amount) return false;
      this.state.gold -= amount;
      this.save();
      this.emit('gold_updated');
      return true;
    }
    addSocialCredibility(amount) {
      const prevUnlocked = this.state.unlockedLocations.highland_council;
      this.state.socialCredibility = Math.max(
        0,
        Math.min(this.state.maxSocialCredibility, this.state.socialCredibility + amount)
      );
      if (this.state.socialCredibility >= LOCATIONS.highland_council.requiredSC) {
        this.state.unlockedLocations.highland_council = true;
        if (!prevUnlocked) this.state.newlyUnlockedLocation = 'highland_council';
        if (this.state.quests.highland_hearing.stage === 'locked') {
          this.state.quests.highland_hearing.stage = 'active';
        }
      }
      this.save();
      this.emit('sc_updated');
    }
    collectBlueprints(item) {
      if (this.state.hasBlueprints) return false;
      this.state.hasBlueprints = true;
      this.addItem(item, 1);
      this.save();
      this.emit('quest_updated');
      return true;
    }
    markHeardLeo() {
      if (!this.state.heardLeo) {
        this.state.heardLeo = true;
        this.save();
        this.emit('quest_updated');
      }
    }
    unlockJournalEntry(id) {
      if (JOURNAL_ENTRIES[id] && !this.state.journalEntries.includes(id)) {
        this.state.journalEntries.push(id);
        this.save();
        this.emit('journal_updated');
        return true;
      }
      return false;
    }
    setQuestStage(questId, stage) {
      if (!this.state.quests[questId]) return;
      this.state.quests[questId].stage = stage;
      this.save();
      this.emit('quest_updated');
    }
    recordApproach(questId, approach) {
      const q = this.state.quests[questId];
      if (q && !q.approachesTried.includes(approach)) {
        q.approachesTried.push(approach);
        this.save();
      }
    }
    completeMayasShadow(rewardItems) {
      const q = this.state.quests.mayas_shadow;
      if (q.rewardsClaimed) return false;
      q.stage = 'completed';
      q.completed = true;
      q.rewardsClaimed = true;
      this.addSocialCredibility(10);
      this.addItem(rewardItems.wrench_emblem, 1);
      this.addItem(rewardItems.mechanical_chest, 1);
      this.state.marketplaceDiscountActive = true;
      this.state.unlockedLocations.innovation_guild = true;
      this.state.newlyUnlockedLocation = 'innovation_guild';
      this.state.quests.mayas_loom.stage = 'active';
      this.unlockJournalEntry('mayas_shadow');
      this.save();
      this.emit('quest_completed', 'mayas_shadow');
      return true;
    }
    completeMayasLoom(rewardItems) {
      const q = this.state.quests.mayas_loom;
      if (q.rewardsClaimed) return false;
      q.stage = 'completed';
      q.completed = true;
      q.rewardsClaimed = true;
      this.state.loomBuilt = true;
      this.addItem(rewardItems.prototype_loom, 1);
      this.addSocialCredibility(20);
      this.unlockJournalEntry('mayas_loom');
      this.save();
      this.emit('quest_completed', 'mayas_loom');
      return true;
    }
    completeHighlandHearing(rewardItems) {
      const q = this.state.quests.highland_hearing;
      if (q.rewardsClaimed) return false;
      q.stage = 'completed';
      q.completed = true;
      q.rewardsClaimed = true;
      this.addItem(rewardItems.council_charter, 1);
      this.addSocialCredibility(25);
      this.unlockJournalEntry('highland_hearing');
      this.save();
      this.emit('quest_completed', 'highland_hearing');
      return true;
    }
    addFeedback(entry) {
      this.state.feedbackSubmissions.unshift({ ...entry, date: new Date().toLocaleDateString() });
      this.save();
    }
    getActiveObjectiveText() {
      const q1 = this.state.quests.mayas_shadow;
      const q2 = this.state.quests.mayas_loom;
      const q3 = this.state.quests.highland_hearing;

      if (!q1.completed) {
        if (!this.canEnterTailorShop()) return "Act 1: Talk to Maya outside Maya's Tailor & Workshop [E]";
        if (!this.state.hasBlueprints) return "Act 1: Enter Workshop & inspect Maya's Workbench [E]";
        if (this.state.restorativeNeeded) return 'Restorative Task: Use Village Supplies (Bag [I]) to mend trust, or apologize to Arthur & Clara';
        return "Act 1: Speak with Arthur & Clara (Maya's Parents) with proof in hand!";
      }
      if (!q2.completed) {
        const comp = this.getItemQty('mechanical_components');
        if (comp < 3) {
          return `Act 2 (Build Tool): Gather Mechanical Components (${comp}/3) — unpack your Chest [I] & visit Marketplace!`;
        }
        return "Act 2 (Build Tool): Return to Maya's Workbench inside the Workshop to assemble Prototype IV!";
      }
      if (!q3.completed) {
        if (this.state.socialCredibility < LOCATIONS.highland_council.requiredSC) {
          return `Reach ${LOCATIONS.highland_council.requiredSC} Social Credibility (${this.state.socialCredibility}/${LOCATIONS.highland_council.requiredSC}) using Supplies/Flowers to unlock Highland Council`;
        }
        return 'Act 3: Travel North to the Highland Council [M] & present the Equal-Access Motion!';
      }
      return 'Vale Transformed! Try Private Replay in Journal [J] or chat with the skeleton by the north-west lamp...';
    }
  }

  const gameState = new GameStateManager();

  /* =========================================================
     2. AUDIO MANAGER (LOOPING MP3 + EXPRESSIVE CHARACTER VOICES)
  ========================================================= */
  class AudioManager {
    constructor() {
      this.ctx = null;
      this.musicVolume = 0.45;
      this.sfxVolume = 0.7;
      this.bgmAudio = null;
      this.bgmSrc = './bgm.mp3';
    }
    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
    }
    setVolumes(musicVol, sfxVol) {
      this.musicVolume = Math.max(0, Math.min(1, musicVol));
      this.sfxVolume = Math.max(0, Math.min(1, sfxVol));
      if (this.bgmAudio) this.bgmAudio.volume = this.musicVolume;
    }
    startBgm(src = this.bgmSrc) {
      this.init();
      if (this.bgmAudio && this.bgmSrc !== src) {
        this.bgmAudio.pause();
        this.bgmAudio = null;
      }
      this.bgmSrc = src;
      if (!this.bgmAudio) {
        this.bgmAudio = new Audio(this.bgmSrc);
        this.bgmAudio.loop = true;
        this.bgmAudio.preload = 'auto';
      }
      this.bgmAudio.volume = this.musicVolume;
      if (this.bgmAudio.paused) {
        this.bgmAudio.play().catch((err) => console.warn('BGM playback blocked or file missing:', err));
      }
    }
    stopBgm() {
      if (this.bgmAudio) {
        this.bgmAudio.pause();
        this.bgmAudio.currentTime = 0;
      }
    }
    playTone(freq, duration = 0.12, type = 'sine', gainLevel = 0.12) {
      if (!this.ctx || gainLevel <= 0.001) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(gainLevel, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch {}
    }
    // Character-specific talking noise (with ironic Undertale-style staccato for Sans!)
    playVoice(voiceCfg) {
      if (!this.ctx || this.sfxVolume <= 0.01) return;
      const v = voiceCfg || { freq: 410, type: 'triangle', jitter: 45 };
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        if (v.sansMode) {
          // Iconic ironic low staccato "er-er-er" skeleton voice
          osc.type = 'square';
          const base = 128 + (Math.random() * 12 - 6);
          osc.frequency.setValueAtTime(base, now);
          osc.frequency.exponentialRampToValueAtTime(base * 0.78, now + 0.048);

          // Gentle low-pass filter so it sounds chunky & retro, not harsh
          const filter = this.ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(680, now);

          gain.gain.setValueAtTime(this.sfxVolume * 0.11, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.052);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + 0.055);
          return;
        }

        osc.type = v.type || 'triangle';
        const pitch = (v.freq || 410) + (Math.random() - 0.5) * (v.jitter || 40);
        osc.frequency.setValueAtTime(pitch, now);
        osc.frequency.exponentialRampToValueAtTime(pitch * 0.94, now + 0.042);

        gain.gain.setValueAtTime(this.sfxVolume * 0.065, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.048);
      } catch {}
    }
    playClick() { this.init(); this.playTone(540, 0.06, 'square', this.sfxVolume * 0.07); }
    playBuildClink() {
      this.init();
      this.playTone(680, 0.07, 'square', this.sfxVolume * 0.09);
      setTimeout(() => this.playTone(920, 0.1, 'triangle', this.sfxVolume * 0.1), 75);
    }
    playCoin() {
      this.init();
      this.playTone(880, 0.08, 'sine', this.sfxVolume * 0.11);
      setTimeout(() => this.playTone(1318, 0.16, 'sine', this.sfxVolume * 0.11), 70);
    }
    playFanfare() {
      this.init();
      [523.25, 659.25, 783.99, 1046.5].forEach((n, idx) => {
        setTimeout(() => this.playTone(n, 0.28, 'triangle', this.sfxVolume * 0.14), idx * 120);
      });
    }
  }

  const audioManager = new AudioManager();

  /* =========================================================
     3. PROCEDURAL PIXEL-ART FACTORY (NIGHT LIGHTING + SANS + HIGHLAND)
  ========================================================= */
  const PORTRAITS = {};
  let BLUEPRINT_IMG_URL = '';

  function makeCanvas(w, h) {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    const ctx = c.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    return { c, ctx };
  }

  function px(ctx, x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
  }

  function el(ctx, cx, cy, rx, ry, color) {
    ctx.fillStyle = color;
    for (let y = -ry; y <= ry; y++) {
      const w = Math.floor(rx * Math.sqrt(Math.max(0, 1 - (y * y) / (ry * ry))));
      ctx.fillRect(Math.round(cx - w), Math.round(cy + y), 2 * w, 1);
    }
  }

  function blob(ctx, x, y, r, color) {
    el(ctx, x, y, r, r, color);
  }

  function makeSeededRandom(seed) {
    let s = seed % 2147483647;
    if (s <= 0) s += 2147483646;
    return () => (s = (s * 16807) % 2147483647) / 2147483647;
  }

  function generateBlueprintDataURL() {
    const W = 240, H = 112;
    const { c, ctx } = makeCanvas(W, H);

    px(ctx, 0, 0, W, H, '#1b427a');
    for (let x = 0; x < W; x += 12) px(ctx, x, 0, 1, H, 'rgba(130, 195, 255, 0.16)');
    for (let y = 0; y < H; y += 12) px(ctx, 0, y, W, 1, 'rgba(130, 195, 255, 0.16)');

    px(ctx, 4, 4, W - 8, 1, '#bfe6ff');
    px(ctx, 4, H - 5, W - 8, 1, '#bfe6ff');
    px(ctx, 4, 4, 1, H - 8, '#bfe6ff');
    px(ctx, W - 5, 4, 1, H - 8, '#bfe6ff');
    px(ctx, 7, 7, W - 14, 1, 'rgba(191,230,255,0.45)');
    px(ctx, 7, H - 8, W - 14, 1, 'rgba(191,230,255,0.45)');

    const drawGear = (gx, gy, r, teeth, col) => {
      for (let i = 0; i < teeth; i++) {
        const a = (i / teeth) * Math.PI * 2;
        px(ctx, gx + Math.cos(a) * (r + 2) - 2, gy + Math.sin(a) * (r + 2) - 2, 4, 4, col);
      }
      blob(ctx, gx, gy, r, col);
      blob(ctx, gx, gy, r - 3, '#1b427a');
      blob(ctx, gx, gy, Math.max(3, Math.floor(r * 0.35)), col);
      blob(ctx, gx, gy, Math.max(1, Math.floor(r * 0.18)), '#1b427a');
      px(ctx, gx - r + 2, gy, (r - 2) * 2, 1, col);
      px(ctx, gx, gy - r + 2, 1, (r - 2) * 2, col);
    };

    drawGear(62, 58, 22, 12, '#dff2ff');
    drawGear(101, 46, 13, 8, '#8ed0ff');
    drawGear(101, 76, 10, 6, '#ffd978');

    px(ctx, 101, 45, 58, 3, '#dff2ff');
    px(ctx, 154, 34, 10, 24, '#8ed0ff');
    px(ctx, 156, 36, 6, 20, '#1b427a');
    for (let sx = 122; sx < 152; sx += 6) {
      px(ctx, sx, 38, 2, 10, '#ffd978');
      px(ctx, sx + 2, 38, 2, 2, '#ffd978');
      px(ctx, sx + 4, 46, 2, 2, '#ffd978');
    }

    px(ctx, 184, 24, 28, 4, '#dff2ff');
    px(ctx, 184, 62, 28, 4, '#dff2ff');
    px(ctx, 188, 28, 20, 34, '#8ed0ff');
    for (let ty = 31; ty < 60; ty += 4) px(ctx, 190, ty, 16, 1, '#1b427a');
    px(ctx, 164, 44, 24, 1, '#ffd978');
    px(ctx, 198, 66, 1, 18, '#ffd978');

    px(ctx, 40, 92, 64, 1, '#8ed0ff');
    px(ctx, 40, 89, 1, 6, '#8ed0ff');
    px(ctx, 104, 89, 1, 6, '#8ed0ff');
    px(ctx, 68, 90, 8, 2, '#ffd978');

    px(ctx, 22, 24, 24, 1, '#bfe6ff');
    px(ctx, 46, 24, 1, 12, '#bfe6ff');
    px(ctx, 16, 18, 20, 2, '#dff2ff');
    px(ctx, 16, 21, 14, 1, '#8ed0ff');

    px(ctx, 146, 78, 84, 24, '#13315e');
    px(ctx, 146, 78, 84, 1, '#bfe6ff');
    px(ctx, 146, 78, 1, 24, '#bfe6ff');
    px(ctx, 152, 83, 44, 2, '#ffd978');
    px(ctx, 152, 88, 68, 2, '#dff2ff');
    px(ctx, 152, 93, 52, 1, '#8ed0ff');
    px(ctx, 152, 97, 36, 1, '#8ed0ff');

    return c.toDataURL();
  }

  function buildGroundTexture(scene, key, w, h, paths, seed = 11, stonePlaza = false) {
    if (scene.textures.exists(key)) return;
    const { c, ctx } = makeCanvas(w, h);
    const rnd = makeSeededRandom(seed);

    if (stonePlaza) {
      // Highland Council hilltop stone & night alpine grass
      px(ctx, 0, 0, w, h, '#2c4f34');
      for (let i = 0; i < (w * h) / 600; i++) {
        blob(ctx, rnd() * w, rnd() * h, 8 + rnd() * 14, rnd() < 0.5 ? '#26442d' : '#355c3c');
      }
      // Starry night valley drop-off along north cliff edge
      px(ctx, 0, 0, w, 62, '#10142b');
      for (let i = 0; i < 45; i++) px(ctx, rnd() * w, rnd() * 48, 1, 1, i % 3 ? '#dfe8ff' : '#ffd978');
      // Distant purple mountain ridge
      ctx.fillStyle = '#25264a';
      for (let x = 0; x < w; x += 2) {
        const mh = 54 - Math.abs(Math.sin(x / 46)) * 24 - Math.sin(x / 17) * 4;
        px(ctx, x, mh, 2, 62 - mh, '#25264a');
      }
      // Stone terrace railing
      px(ctx, 0, 60, w, 6, '#7a758a');
      px(ctx, 0, 66, w, 3, '#4c4859');
    } else {
      px(ctx, 0, 0, w, h, '#3f7a34');
      for (let i = 0; i < (w * h) / 700; i++) {
        blob(ctx, rnd() * w, rnd() * h, 7 + rnd() * 14, rnd() < 0.5 ? '#3a7430' : '#448438');
      }
      for (let i = 0; i < (w * h) / 48; i++) {
        const gx = rnd() * w, gy = rnd() * h;
        px(ctx, gx, gy, 1, 3, '#2f6228');
        px(ctx, gx + 1, gy - 1, 1, 3, '#5a9a44');
      }
      const flowerCols = ['#f4c24a', '#e8627a', '#f4f0e0', '#c27af0'];
      for (let i = 0; i < (w * h) / 950; i++) {
        const fx = rnd() * w, fy = rnd() * h, fc = flowerCols[i % flowerCols.length];
        px(ctx, fx + 1, fy + 1, 1, 3, '#2f6228');
        px(ctx, fx, fy, 3, 1, fc);
        px(ctx, fx + 1, fy - 1, 1, 3, fc);
        px(ctx, fx + 1, fy, 1, 1, '#fff0a0');
      }
    }

    const stoneTones = stonePlaza
      ? ['#9d98ad', '#8c879c', '#aba6ba', '#7f7a8f']
      : ['#c9a070', '#b98a5a', '#a87a4c', '#c29866'];
    const borderCol = stonePlaza ? '#5e5a6e' : '#8a6038';
    const hiCol = stonePlaza ? '#c4c0d4' : '#e0bc8a';

    for (const [a, b, cw, ch] of paths) {
      px(ctx, a - 2, b - 2, cw + 4, ch + 4, borderCol);
      px(ctx, a, b, cw, ch, stoneTones[1]);
      for (let j = 0; j < ch; j += 6) {
        const off = ((j / 6) % 2) * 5;
        for (let i = 0; i < cw; i += 10) {
          const sx = a + i + off;
          const sw = Math.min(9, a + cw - sx);
          if (sw <= 1) continue;
          const sh = Math.min(5, ch - j);
          px(ctx, sx, b + j, sw, sh, stoneTones[Math.floor(rnd() * stoneTones.length)]);
          px(ctx, sx, b + j, sw, 1, hiCol);
          if (sh >= 5) px(ctx, sx, b + j + 4, sw, 1, borderCol);
        }
      }
    }

    scene.textures.addCanvas(key, c);
  }

  function buildTailorInteriorBG(scene, key) {
    if (scene.textures.exists(key)) return;
    const W = 480, H = 270;
    const { c, ctx } = makeCanvas(W, H);

    px(ctx, 0, 0, W, H, '#3a2012');
    px(ctx, 0, 0, W, 84, '#8a5a30');
    for (let x = 0; x < W; x += 24) px(ctx, x, 0, 2, 84, '#6a3e1c');
    px(ctx, 0, 80, W, 4, '#4a2610');

    px(ctx, 0, 84, W, H - 84, '#a8743e');
    for (let y = 84, k = 0; y < H; y += 14, k++) {
      px(ctx, 0, y, W, 1, '#8a5a2c');
      for (let x = (k % 2) * 20; x < W; x += 40) px(ctx, x, y, 1, 14, '#8a5a2c');
    }

    // Starlit night window on left wall!
    px(ctx, 50, 14, 60, 48, '#4a2610');
    px(ctx, 54, 18, 52, 40, '#182147');
    px(ctx, 54, 18, 52, 16, '#111636');
    px(ctx, 64, 24, 2, 2, '#fff0b3');
    px(ctx, 92, 22, 4, 4, '#ffe899'); // crescent moon
    px(ctx, 94, 22, 2, 3, '#111636');
    px(ctx, 78, 18, 3, 40, '#4a2610');
    px(ctx, 54, 36, 52, 3, '#4a2610');

    px(ctx, 150, 20, 150, 4, '#4a2610');
    px(ctx, 150, 50, 150, 4, '#4a2610');
    const boltCols = ['#b04a4a', '#4a6ab0', '#4aa070', '#c0902a', '#8a4aa0'];
    for (let i = 0; i < 10; i++) {
      px(ctx, 154 + i * 14, 6 + (i % 2) * 2, 10, 14, boltCols[i % 5]);
      px(ctx, 154 + i * 14, 36, 10, 14, boltCols[(i + 2) % 5]);
    }

    [[330, 14], [366, 22], [402, 12]].forEach(([sx, sy]) => {
      px(ctx, sx, sy, 28, 34, '#efe0b8');
      px(ctx, sx + 8, sy + 8, 12, 18, '#b89a68');
      px(ctx, sx + 10, sy + 12, 8, 2, '#6a4a2a');
    });

    px(ctx, 120, 6, 6, 10, '#4a3020');
    px(ctx, 121, 10, 4, 5, '#ffe08a');

    px(ctx, 214, 256, 52, 12, '#6a3a1a');
    px(ctx, 217, 258, 46, 8, '#c98a5a');

    scene.textures.addCanvas(key, c);
  }

  function drawCharacterSprite(ctx, ox, oy, opts) {
    const {
      skin = '#f2c9a0', hair, top, bot,
      sc = null, ap = false, sk = false, lg = false,
      rb = false, mu = false, bn = false, ht = null, pk = false,
      wrench = false, step = 0, facing = 'down'
    } = opts;

    const d = facing === 'down' ? 0 : facing === 'up' ? 1 : facing === 'left' ? 2 : 3;
    const x = ox + 10;
    const y = oy + 22;
    const l = step === 1 ? 2 : 0;
    const r = step === 3 ? 2 : 0;

    ctx.globalAlpha = 0.3;
    el(ctx, x, y, 6, 2, '#000');
    ctx.globalAlpha = 1;

    if (sk) px(ctx, x - 4, y - 8, 8, 6, bot);
    else {
      px(ctx, x - 3, y - 7, 2, 5 - l, bot);
      px(ctx, x + 1, y - 7, 2, 5 - r, bot);
    }
    px(ctx, x - 3, y - 2 - l, 2, 2, '#3a2418');
    px(ctx, x + 1, y - 2 - r, 2, 2, '#3a2418');

    px(ctx, x - 4, y - 14, 8, 7, top);
    px(ctx, x + 2, y - 14, 2, 7, 'rgba(0,0,0,0.13)');
    px(ctx, x - 4, y - 14, 8, 1, 'rgba(255,255,255,0.2)');
    if (ap && d !== 1) px(ctx, x - 3, y - 11, 6, 8, '#efe6d0');
    if (sc) px(ctx, x - 4, y - 14, 8, 2, sc);

    px(ctx, x - 5, y - 13, 1, 6, top);
    px(ctx, x + 4, y - 13, 1, 6, top);
    px(ctx, x - 5, y - 7, 1, 1, skin);
    px(ctx, x + 4, y - 7, 1, 1, skin);

    if (wrench) {
      px(ctx, x + 5, y - 13, 2, 6, '#9aa0aa');
      px(ctx, x + 4, y - 14, 4, 2, '#b9c3cf');
    }

    px(ctx, x - 4, y - 20, 8, 6, skin);
    px(ctx, x - 4, y - 15, 8, 1, 'rgba(0,0,0,0.13)');
    if (d === 0) {
      px(ctx, x - 3, y - 16, 2, 1, '#e8907a');
      px(ctx, x + 1, y - 16, 2, 1, '#e8907a');
    }

    if (d === 1) px(ctx, x - 4, y - 21, 8, 7, hair);
    else {
      px(ctx, x - 4, y - 21, 8, 3, hair);
      px(ctx, x - 5, y - 20, 1, 3, hair);
      px(ctx, x + 4, y - 20, 1, 3, hair);
      px(ctx, x - 2, y - 21, 3, 1, 'rgba(255,255,255,0.25)');
    }
    if (lg) {
      if (d === 0) {
        px(ctx, x - 5, y - 19, 1, 8, hair);
        px(ctx, x + 4, y - 19, 1, 8, hair);
      } else px(ctx, x - 4, y - 19, 8, 8, hair);
    }

    if (d === 0) {
      px(ctx, x - 2, y - 18, 1, 2, '#222');
      px(ctx, x + 1, y - 18, 1, 2, '#222');
    } else if (d === 2) px(ctx, x - 3, y - 18, 1, 2, '#222');
    else if (d === 3) px(ctx, x + 2, y - 18, 1, 2, '#222');

    if (pk) {
      if (d === 1) px(ctx, x - 4, y - 13, 8, 7, '#7a4a22');
      else if (d === 0) {
        px(ctx, x - 4, y - 13, 1, 5, '#7a4a22');
        px(ctx, x + 3, y - 13, 1, 5, '#7a4a22');
      } else px(ctx, d === 2 ? x + 2 : x - 5, y - 12, 3, 6, '#7a4a22');
    }

    if (ht) {
      px(ctx, x - 6, y - 21, 12, 1, ht);
      px(ctx, x - 4, y - 22, 8, 2, ht);
    }
    if (rb) px(ctx, x - 5, y - 21, 3, 3, '#d03030');
    if (mu && d === 0) px(ctx, x - 2, y - 15, 4, 1, '#4a2e1a');
    if (bn) px(ctx, x - 2, y - 22, 4, 2, hair);
  }

  // Easter Egg: Sans the Skeleton pixel sprite (20x24)
  function drawSansSprite(ctx) {
    ctx.globalAlpha = 0.3;
    el(ctx, 10, 22, 6, 2, '#000');
    ctx.globalAlpha = 1;
    // Pink slippers & white ankle bones
    px(ctx, 6, 20, 3, 2, '#f29cb8');
    px(ctx, 11, 20, 3, 2, '#f29cb8');
    px(ctx, 7, 19, 1, 1, '#f4f6fa');
    px(ctx, 12, 19, 1, 1, '#f4f6fa');
    // Black shorts with white side stripes
    px(ctx, 6, 15, 8, 4, '#1a1c24');
    px(ctx, 6, 15, 1, 4, '#ffffff');
    px(ctx, 13, 15, 1, 4, '#ffffff');
    // Blue hoodie + white undershirt + grey hood trim
    px(ctx, 4, 9, 12, 7, '#3474d4');
    px(ctx, 5, 9, 10, 2, '#cfd6e0'); // fluffy hood collar
    px(ctx, 8, 10, 4, 6, '#f4f6fa'); // white tee
    px(ctx, 4, 11, 2, 4, '#2458a8'); // hands in pockets
    px(ctx, 14, 11, 2, 4, '#2458a8');
    // Wide white skull
    px(ctx, 6, 2, 8, 7, '#f8f9fc');
    px(ctx, 5, 4, 10, 4, '#f8f9fc');
    // Dark eye sockets + tiny white pupils
    px(ctx, 7, 4, 2, 2, '#111218');
    px(ctx, 11, 4, 2, 2, '#111218');
    px(ctx, 8, 5, 1, 1, '#ffffff');
    px(ctx, 12, 5, 1, 1, '#ffffff');
    // Nose & iconic wide grin
    px(ctx, 9, 6, 2, 1, '#111218');
    px(ctx, 6, 7, 8, 1, '#111218');
    px(ctx, 7, 7, 1, 1, '#f8f9fc');
    px(ctx, 9, 7, 1, 1, '#f8f9fc');
    px(ctx, 11, 7, 1, 1, '#f8f9fc');
  }

  function drawSansPortraitDataURL() {
    const { c, ctx } = makeCanvas(48, 48);
    px(ctx, 0, 0, 48, 48, '#0c1024');
    // Blue hoodie shoulders
    px(ctx, 6, 33, 36, 15, '#3474d4');
    px(ctx, 12, 31, 24, 6, '#cfd6e0');
    px(ctx, 19, 34, 10, 14, '#f8f9fc');
    // Skull
    px(ctx, 12, 8, 24, 23, '#f8f9fc');
    px(ctx, 9, 13, 30, 14, '#f8f9fc');
    // Eye sockets + ironic gleam
    px(ctx, 14, 15, 7, 6, '#0d0f17');
    px(ctx, 27, 15, 7, 6, '#0d0f17');
    px(ctx, 17, 17, 2, 2, '#ffffff');
    px(ctx, 30, 17, 2, 2, '#64d8ff');
    // Nose cavity
    px(ctx, 22, 22, 4, 3, '#0d0f17');
    // Wide grin with tooth lines
    px(ctx, 13, 26, 22, 4, '#0d0f17');
    px(ctx, 15, 27, 3, 2, '#f8f9fc');
    px(ctx, 20, 27, 3, 2, '#f8f9fc');
    px(ctx, 25, 27, 3, 2, '#f8f9fc');
    px(ctx, 30, 27, 3, 2, '#f8f9fc');
    return c.toDataURL();
  }

  function drawPortraitDataURL(charOpts, isMayaJournal = false) {
    if (isMayaJournal) {
      const { c: small, ctx: sx } = makeCanvas(44, 44);
      px(sx, 0, 0, 44, 44, '#e8cf9a');
      px(sx, 4, 10, 10, 22, '#c9a86a');
      px(sx, 30, 6, 10, 26, '#c9a86a');
      drawCharacterSprite(sx, 12, 16, { ...charOpts, facing: 'down', step: 0 });
      px(sx, 28, 24, 9, 11, '#3a5fb0');
      px(sx, 29, 26, 7, 1, '#cfe0ff');
      px(sx, 10, 22, 3, 10, '#9aa0aa');
      px(sx, 9, 20, 5, 3, '#9aa0aa');
      return small.toDataURL();
    }
    const { c: tiny, ctx: tx } = makeCanvas(16, 16);
    px(tx, 0, 0, 16, 16, '#261730');
    drawCharacterSprite(tx, -2, 0, { ...charOpts, facing: 'down', step: 0 });
    const { c, ctx } = makeCanvas(48, 48);
    ctx.drawImage(tiny, 0, 0, 48, 48);
    return c.toDataURL();
  }

  function drawPixelBuilding(ctx, x, y, w, h, o) {
    const rh = Math.floor(h * 0.45);
    px(ctx, x, y + rh - 4, w, h - rh + 4, o.wall);
    for (let i = 0; i <= w; i += 16) px(ctx, x + i - 1, y + rh, 2, h - rh, '#4a2610');
    px(ctx, x, y + rh + 10, w, 2, '#4a2610');

    px(ctx, x - 4, y, w + 8, rh, o.roof);
    for (let j = 4; j < rh; j += 5) px(ctx, x - 4, y + j, w + 8, 1, 'rgba(0,0,0,0.2)');
    px(ctx, x - 4, y, w + 8, 2, 'rgba(255,255,255,0.2)');
    px(ctx, x - 4, y + rh - 3, w + 8, 3, 'rgba(0,0,0,0.32)');
    for (let j = 0; j < rh; j += 5) {
      for (let i = ((j / 5) % 2) * 6; i < w + 8; i += 12) {
        px(ctx, x - 4 + i, y + j + 1, 5, 1, 'rgba(255,255,255,0.14)');
      }
    }
    px(ctx, x + w - 18, Math.max(0, y - 6), 8, 14, '#7a4a3a');

    for (let i = 10; i < w - 14; i += 30) {
      if (Math.abs(i - o.dx) < 18) continue;
      px(ctx, x + i - 1, y + rh + 12, 14, 12, '#3a1c0a');
      px(ctx, x + i, y + rh + 13, 12, 10, '#ffdf78'); // Warm glowing night window!
      px(ctx, x + i - 1, y + h - 14, 14, 5, '#6a3a1a');
      for (let k = 0; k < 4; k++) {
        px(ctx, x + i + k * 3, y + h - 17, 2, 3, ['#e8627a', '#f4c24a', '#f4f0e0', '#e8627a'][k]);
      }
    }

    px(ctx, x + o.dx - 1, y + h - 24, 16, 24, '#2a1408');
    px(ctx, x + o.dx + 1, y + h - 22, 12, 22, '#6a3a1a');
    px(ctx, x + o.dx + 9, y + h - 12, 2, 2, '#e8b84a');
  }

  function generateAllAssets(scene) {
    const addCanvasTex = (key, canvas) => {
      if (scene.textures.exists(key)) scene.textures.remove(key);
      scene.textures.addCanvas(key, canvas);
    };

    BLUEPRINT_IMG_URL = generateBlueprintDataURL();

    // Soft radial brush texture used to carve crisp warm light pools out of night darkness
    {
      const S = 180;
      const { c, ctx } = makeCanvas(S, S);
      const grad = ctx.createRadialGradient(S / 2, S / 2, 8, S / 2, S / 2, S / 2);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.45, 'rgba(255, 255, 255, 0.72)');
      grad.addColorStop(0.8, 'rgba(255, 255, 255, 0.22)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, S, S);
      addCanvasTex('light_brush', c);
    }
    // Warm amber additive halo sprite for streetlights & lanterns
    {
      const S = 128;
      const { c, ctx } = makeCanvas(S, S);
      const grad = ctx.createRadialGradient(S / 2, S / 2, 4, S / 2, S / 2, S / 2);
      grad.addColorStop(0, 'rgba(255, 225, 130, 0.72)');
      grad.addColorStop(0.35, 'rgba(255, 175, 65, 0.34)');
      grad.addColorStop(0.75, 'rgba(235, 120, 35, 0.08)');
      grad.addColorStop(1, 'rgba(235, 120, 35, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, S, S);
      addCanvasTex('amber_glow', c);
    }

    const PAL_PLAYER = { skin: '#f2c9a0', hair: '#5a3418', top: '#3b5a8a', bot: '#4a4a58', sc: '#c0392b', pk: true };
    const PAL_MAYA = { skin: '#f6d3b0', hair: '#6b3a22', top: '#b84a3a', bot: '#b84a3a', sk: true, lg: true, rb: true };
    const PAL_MAYA_MECH = { skin: '#f6d3b0', hair: '#6b3a22', top: '#efe3c8', bot: '#3a4f7a', lg: true, rb: true, wrench: true };
    const PAL_FATHER = { skin: '#f0c49a', hair: '#6b4a2a', top: '#8a5a2a', bot: '#4a3a2a', mu: true };
    const PAL_MOTHER = { skin: '#f3cba4', hair: '#8a4a2a', top: '#d46a6a', bot: '#e8d6b8', sk: true, bn: true };
    const PAL_BROTHER = { skin: '#f2c9a0', hair: '#6b3a1e', top: '#5a8a5a', bot: '#4a4a58' };
    const PAL_MERCHANT = { skin: '#e8b890', hair: '#4a3020', top: '#3a6a4a', bot: '#5a4a3a', ap: true };
    const PAL_GUILD = { skin: '#f5d0aa', hair: '#3b2a4a', top: '#4a5a8a', bot: '#3a4a6a', lg: true, bn: true };
    const PAL_COUNCILOR = { skin: '#ecc299', hair: '#cfd2dc', top: '#583b6e', bot: '#2e223d', sc: '#e8b84a', mu: true };
    const PAL_VILLAGER1 = { skin: '#efc9a8', hair: '#cfcfd8', top: '#7a4a6a', bot: '#7a4a6a', sk: true, bn: true };
    const PAL_VILLAGER2 = { skin: '#e8b890', hair: '#6a4a2a', top: '#5a6a7a', bot: '#4a5a3a', ht: '#d9b45a' };

    PORTRAITS.portrait_maya_sad = drawPortraitDataURL(PAL_MAYA);
    PORTRAITS.portrait_maya_happy = drawPortraitDataURL(PAL_MAYA_MECH, true);
    PORTRAITS.portrait_parents = drawPortraitDataURL(PAL_FATHER);
    PORTRAITS.portrait_mother = drawPortraitDataURL(PAL_MOTHER);
    PORTRAITS.portrait_brother = drawPortraitDataURL(PAL_BROTHER);
    PORTRAITS.portrait_merchant = drawPortraitDataURL(PAL_MERCHANT);
    PORTRAITS.portrait_guild = drawPortraitDataURL(PAL_GUILD);
    PORTRAITS.portrait_councilor = drawPortraitDataURL(PAL_COUNCILOR);
    PORTRAITS.portrait_villager = drawPortraitDataURL(PAL_VILLAGER1);
    PORTRAITS.portrait_villager2 = drawPortraitDataURL(PAL_VILLAGER2);
    PORTRAITS.portrait_sans = drawSansPortraitDataURL();

    ['down', 'up', 'left', 'right'].forEach((dir) => {
      for (let step = 0; step < 4; step++) {
        const { c, ctx } = makeCanvas(20, 24);
        drawCharacterSprite(ctx, 0, 0, { ...PAL_PLAYER, facing: dir, step });
        addCanvasTex(`player_${dir}_${step}`, c);
      }
    });

    const npcs = {
      npc_maya_sad: PAL_MAYA,
      npc_maya_mech: PAL_MAYA_MECH,
      npc_father: PAL_FATHER,
      npc_mother: PAL_MOTHER,
      npc_brother: PAL_BROTHER,
      npc_merchant: PAL_MERCHANT,
      npc_guild: PAL_GUILD,
      npc_councilor: PAL_COUNCILOR,
      npc_villager1: PAL_VILLAGER1,
      npc_villager2: PAL_VILLAGER2
    };
    Object.entries(npcs).forEach(([key, cfg]) => {
      const { c, ctx } = makeCanvas(20, 24);
      drawCharacterSprite(ctx, 0, 0, { ...cfg, facing: 'down', step: 0 });
      addCanvasTex(key, c);
    });

    // Sans sprite
    {
      const { c, ctx } = makeCanvas(20, 24);
      drawSansSprite(ctx);
      addCanvasTex('npc_sans', c);
    }

    // Green Mark, Quest Bubble, Heart, Firefly/Leaf particle
    {
      const { c, ctx } = makeCanvas(14, 14);
      blob(ctx, 7, 7, 6, 'rgba(120,255,120,0.22)');
      blob(ctx, 7, 7, 4, 'rgba(120,255,120,0.32)');
      px(ctx, 6, 3, 3, 8, '#5fd35f');
      px(ctx, 4, 5, 7, 4, '#5fd35f');
      px(ctx, 6, 4, 1, 6, '#b8ffb8');
      px(ctx, 7, 11, 1, 2, '#2f8a3f');
      addCanvasTex('green_mark', c);
    }
    {
      const { c, ctx } = makeCanvas(16, 16);
      px(ctx, 0, 0, 16, 15, '#ffffff');
      px(ctx, 1, 1, 14, 13, '#f3f3f3');
      px(ctx, 7, 3, 3, 6, '#e8a010');
      px(ctx, 7, 11, 3, 2, '#e8a010');
      addCanvasTex('quest_bubble', c);
    }
    {
      const { c, ctx } = makeCanvas(10, 10);
      [[2,2,2,2],[6,2,2,2],[1,3,8,2],[2,5,6,1],[3,6,4,1],[4,7,2,1]].forEach(([x,y,w,h]) => px(ctx,x,y,w,h,'#e63946'));
      addCanvasTex('heart_icon', c);
    }
    {
      const { c, ctx } = makeCanvas(6, 6);
      px(ctx, 2, 2, 2, 2, '#ffe885');
      px(ctx, 1, 2, 1, 1, 'rgba(255, 220, 100, 0.5)');
      addCanvasTex('firefly_particle', c);
    }

    // Buildings
    { const { c, ctx } = makeCanvas(128, 92); drawPixelBuilding(ctx, 8, 8, 112, 82, { roof: '#7a3a3a', wall: '#c98a5a', dx: 49 }); addCanvasTex('bldg_tailor', c); }
    { const { c, ctx } = makeCanvas(112, 84); drawPixelBuilding(ctx, 8, 6, 96, 76, { roof: '#6a4a6a', wall: '#c9a070', dx: 41 }); addCanvasTex('bldg_cottage', c); }
    {
      const { c, ctx } = makeCanvas(140, 98);
      drawPixelBuilding(ctx, 8, 10, 124, 86, { roof: '#4a5a8a', wall: '#c9a070', dx: 55 });
      blob(ctx, 70, 26, 18, 'rgba(255,230,120,0.22)');
      px(ctx, 64, 20, 12, 12, '#e8b84a');
      px(ctx, 68, 24, 4, 4, '#4a2610');
      addCanvasTex('bldg_guild', c);
    }
    // Highland Council Grand Hall (176x104)
    {
      const { c, ctx } = makeCanvas(176, 104);
      // Marble pediment roof
      px(ctx, 6, 20, 164, 16, '#4c3e68');
      px(ctx, 18, 10, 140, 12, '#625085');
      px(ctx, 42, 4, 92, 8, '#e8b84a');
      // Main marble facade
      px(ctx, 14, 36, 148, 66, '#d8d2e3');
      // 4 Greek-inspired stone pillars
      [22, 54, 112, 144].forEach((cx) => {
        px(ctx, cx, 36, 10, 66, '#efeaf7');
        px(ctx, cx + 8, 36, 2, 66, '#a49bb5');
        px(ctx, cx - 2, 36, 14, 4, '#e8b84a');
      });
      // Grand arched doors + lit windows
      px(ctx, 72, 58, 32, 44, '#3b2416');
      px(ctx, 76, 62, 11, 38, '#613c24');
      px(ctx, 89, 62, 11, 38, '#613c24');
      px(ctx, 36, 52, 14, 22, '#ffe082');
      px(ctx, 126, 52, 14, 22, '#ffe082');
      // Golden scales emblem above door
      px(ctx, 83, 43, 10, 10, '#e8b84a');
      px(ctx, 86, 46, 4, 4, '#4c3e68');
      addCanvasTex('bldg_council', c);
    }

    // Oak Tree (64x72)
    {
      const { c, ctx } = makeCanvas(64, 72);
      const cx = 32, cy = 68, s = 1.75;
      el(ctx, cx + 3 * s, cy, 12 * s, 3 * s, 'rgba(10,8,20,0.4)');
      px(ctx, cx - 3 * s, cy - 10 * s, 6 * s, 10 * s, '#5a3418');
      px(ctx, cx + s, cy - 10 * s, 2 * s, 10 * s, '#3f2410');
      blob(ctx, cx, cy - 24 * s, 13 * s, '#214521');
      blob(ctx, cx - 3 * s, cy - 26 * s, 11 * s, '#2b5e29');
      blob(ctx, cx + 4 * s, cy - 22 * s, 8 * s, '#367531');
      blob(ctx, cx - 2 * s, cy - 29 * s, 6 * s, '#438a3b');
      blob(ctx, cx + 5 * s, cy - 30 * s, 4 * s, '#c99c3c');
      addCanvasTex('prop_oak', c);
    }

    // Fountain (2 frames, 48x48)
    for (let f = 0; f < 2; f++) {
      const { c, ctx } = makeCanvas(48, 48);
      el(ctx, 24, 34, 22, 11, '#6a6a7a');
      el(ctx, 24, 32, 19, 9, '#8f8f9f');
      el(ctx, 24, 33, 16, 7, '#4a8fd0');
      px(ctx, 13 + f * 4, 31, 4, 1, '#bfe4ff');
      px(ctx, 26 - f * 3, 35, 5, 1, '#bfe4ff');
      px(ctx, 20, 10, 8, 24, '#9a9aa8');
      el(ctx, 24, 15, 10, 4, '#8f8f9f');
      el(ctx, 24, 15, 8, 3, '#5aa0e0');
      px(ctx, 22, 6, 4, 6, '#b0b0c0');
      const dropY = f === 0 ? 0 : 3;
      px(ctx, 15, 16 + dropY, 2, 4, '#bfe4ff');
      px(ctx, 31, 18 - dropY, 2, 4, '#bfe4ff');
      addCanvasTex(`prop_fountain_${f}`, c);
    }

    // Market Stall
    {
      const { c, ctx } = makeCanvas(64, 48);
      px(ctx, 6, 16, 3, 30, '#5a3418');
      px(ctx, 55, 16, 3, 30, '#5a3418');
      for (let i = 0; i < 56; i += 8) px(ctx, 4 + i, 10, 8, 10, (i / 8) % 2 ? '#f3e8d0' : '#c0392b');
      px(ctx, 6, 32, 52, 14, '#8a5a2a');
      px(ctx, 6, 32, 52, 2, '#a8743e');
      const cols = ['#e04a3a', '#f0a030', '#4fae4f', '#7a4aa8'];
      for (let i = 0; i < 9; i++) blob(ctx, 11 + i * 5.2, 29, 2, cols[i % cols.length]);
      addCanvasTex('prop_stall', c);
    }

    // Tall Wrought-Iron Streetlight (22x52) + Cozy Lantern Post (16x34) + Highland Brazier
    {
      const { c, ctx } = makeCanvas(22, 52);
      px(ctx, 8, 48, 6, 4, '#24222c');
      px(ctx, 10, 10, 2, 40, '#2c2a38');
      px(ctx, 10, 8, 9, 2, '#2c2a38');
      px(ctx, 15, 10, 6, 9, '#3e3545');
      px(ctx, 16, 12, 4, 6, '#fff0a6');
      addCanvasTex('prop_streetlight', c);
    }
    {
      const { c, ctx } = makeCanvas(16, 34);
      px(ctx, 7, 8, 2, 26, '#2a1a10');
      px(ctx, 4, 0, 8, 9, '#4a3020');
      px(ctx, 6, 2, 4, 5, '#ffeb99');
      addCanvasTex('prop_lantern', c);
    }
    {
      const { c, ctx } = makeCanvas(32, 30);
      px(ctx, 2, 22, 4, 8, '#5a3418'); px(ctx, 26, 22, 4, 8, '#5a3418');
      px(ctx, 0, 4, 32, 20, '#8a5a2a'); px(ctx, 2, 6, 28, 16, '#6a3e1c');
      [[4, '#f3dfb0'], [13, '#efd8a0'], [22, '#f3dfb0']].forEach(([a, b]) => px(ctx, a, 8, 6, 10, b));
      addCanvasTex('prop_noticeboard', c);
    }
    {
      const { c, ctx } = makeCanvas(28, 18);
      [[5, 9, '#f4c24a'], [12, 7, '#e8627a'], [19, 10, '#f4f0e0'], [23, 6, '#c27af0']].forEach(([fx, fy, fc]) => {
        px(ctx, fx + 1, fy + 1, 1, 4, '#2f6228'); px(ctx, fx, fy, 3, 1, fc); px(ctx, fx + 1, fy - 1, 1, 3, fc); px(ctx, fx + 1, fy, 1, 1, '#fff0a0');
      });
      addCanvasTex('prop_flowers', c);
    }
    {
      const { c, ctx } = makeCanvas(24, 48);
      for (let i = 0; i < 6; i++) {
        blob(ctx, 12, 6 + i * 7, 7, i % 2 ? '#2f5a26' : '#244f22');
        px(ctx, 10, 2 + i * 7, 3, 6, '#6a4a2a');
      }
      addCanvasTex('prop_barrier', c);
    }
    {
      // Highland Gate Barrier (horizontal)
      const { c, ctx } = makeCanvas(56, 24);
      px(ctx, 0, 8, 56, 4, '#5a5469');
      px(ctx, 0, 16, 56, 4, '#5a5469');
      for (let x = 4; x < 54; x += 10) px(ctx, x, 2, 4, 22, '#7b738f');
      px(ctx, 22, 6, 12, 12, '#e8b84a');
      px(ctx, 26, 10, 4, 4, '#3a2212');
      addCanvasTex('prop_gate_locked', c);
    }

    // Reconstructed Tailor Interior Furniture
    {
      const { c, ctx } = makeCanvas(110, 34);
      px(ctx, 0, 8, 110, 26, '#7a4a22'); px(ctx, 0, 8, 110, 5, '#a8743e');
      const spools = ['#b04a4a', '#4a6ab0', '#c0902a', '#4aa070', '#8a4aa0'];
      for (let i = 0; i < 5; i++) px(ctx, 10 + i * 20, 2, 5, 8, spools[i]);
      px(ctx, 66, 16, 24, 8, '#efe0b8');
      addCanvasTex('shop_counter', c);
    }
    {
      const { c, ctx } = makeCanvas(60, 48);
      px(ctx, 0, 20, 60, 28, '#5a3418'); px(ctx, 0, 20, 60, 4, '#7a4a22');
      px(ctx, 8, 0, 28, 22, '#1a1a22'); px(ctx, 12, 4, 20, 6, '#3a3a44'); px(ctx, 42, 16, 8, 8, '#c0392b');
      addCanvasTex('shop_sewing', c);
    }
    {
      const { c, ctx } = makeCanvas(80, 32);
      px(ctx, 0, 2, 80, 30, '#7a4a22'); px(ctx, 0, 2, 80, 5, '#a8743e');
      px(ctx, 16, 6, 34, 20, '#3a5fb0'); px(ctx, 20, 10, 26, 1, '#cfe0ff'); px(ctx, 20, 16, 18, 1, '#cfe0ff');
      px(ctx, 56, 8, 10, 8, '#9aa0aa');
      addCanvasTex('shop_workbench', c);
    }
    {
      const { c, ctx } = makeCanvas(36, 50);
      px(ctx, 16, 4, 4, 34, '#6a3a1a'); px(ctx, 10, 2, 16, 10, '#e8d6b8');
      px(ctx, 6, 12, 24, 26, '#b84a3a'); px(ctx, 2, 32, 32, 6, '#c85a4a'); px(ctx, 10, 38, 16, 12, '#6a3a1a');
      addCanvasTex('shop_mannequin', c);
    }
    {
      const { c, ctx } = makeCanvas(26, 32);
      blob(ctx, 13, 12, 9, '#4a8a3a'); px(ctx, 3, 14, 20, 16, '#8a5a2a'); px(ctx, 3, 18, 20, 2, '#5a3418');
      addCanvasTex('shop_plant_crate', c);
    }
    {
      const { c, ctx } = makeCanvas(22, 26);
      blob(ctx, 11, 10, 9, '#3f8a36'); px(ctx, 4, 14, 14, 10, '#8a4a22');
      addCanvasTex('shop_plant_pot', c);
    }
  }

  /* =========================================================
     4. PHASER SCENES (NIGHT LIGHTING + HIGHLAND + SANS)
  ========================================================= */
  class BootScene extends Phaser.Scene {
    constructor() { super('BootScene'); }
    create() {
      generateAllAssets(this);
      ['down', 'up', 'left', 'right'].forEach((dir) => {
        this.anims.create({
          key: `walk_${dir}`,
          frames: [
            { key: `player_${dir}_0` },
            { key: `player_${dir}_1` },
            { key: `player_${dir}_2` },
            { key: `player_${dir}_3` }
          ],
          frameRate: 8,
          repeat: -1
        });
      });
      this.scene.start('MainMenuScene');
    }
  }

  class MainMenuScene extends Phaser.Scene {
    constructor() { super('MainMenuScene'); }
    create() {
      const layer = document.getElementById('world-labels-layer');
      if (layer) layer.innerHTML = '';

      const W = 640, H = 360;
      const g = this.add.graphics();

      // Atmospheric Starlit Night Sky over Vale
      g.fillStyle(0x0b0f26, 1); g.fillRect(0, 0, W, 65);
      g.fillStyle(0x161b3d, 1); g.fillRect(0, 65, W, 50);
      g.fillStyle(0x282754, 1); g.fillRect(0, 115, W, 45);
      g.fillStyle(0x47335c, 1); g.fillRect(0, 160, W, 40);

      // Stars & Glowing Moon
      for (let i = 0; i < 42; i++) {
        g.fillStyle(i % 3 === 0 ? 0xffe9a3 : 0xdbe6ff, 0.85);
        g.fillRect((i * 73) % W, (i * 29) % 125, i % 4 === 0 ? 2 : 1, i % 4 === 0 ? 2 : 1);
      }
      g.fillStyle(0xfff0b8, 0.16); g.fillCircle(495, 76, 44);
      g.fillStyle(0xfff6d1, 0.95); g.fillCircle(495, 76, 18);

      // Moonlit silhouettes of mountains & hills
      g.fillStyle(0x1e1d3b, 1);
      for (let x = 0; x < W; x += 2) {
        const mh = 148 - Math.abs(Math.sin(x / 52)) * 54 - Math.sin(x / 17) * 6;
        g.fillRect(x, Math.round(mh), 2, 130);
      }
      g.fillStyle(0x1d3826, 1);
      for (let x = 0; x < W; x += 2) {
        const hh = 185 - Math.sin(x / 72 + 1) * 18;
        g.fillRect(x, Math.round(hh), 2, 185);
      }
      g.fillStyle(0x254a2e, 1);
      for (let x = 0; x < W; x += 2) {
        const fh = 228 - Math.sin(x / 92) * 10;
        g.fillRect(x, Math.round(fh), 2, 135);
      }

      // Cobblestone plaza
      g.fillStyle(0x6e5339, 1); g.fillRect(0, 250, W, 110);
      for (let j = 250; j < H; j += 8) {
        const off = ((j / 8) % 2) * 6;
        for (let i = 0; i < W; i += 12) {
          g.fillStyle((i * 7 + j) % 3 ? 0x7c5f42 : 0x624932, 1);
          g.fillRect(i + off, j, 10, 6);
        }
      }

      this.add.image(145, 220, 'bldg_cottage').setScale(0.95);
      this.add.image(400, 222, 'bldg_guild').setScale(0.7);
      this.add.image(545, 214, 'bldg_tailor').setScale(0.9);
      this.add.image(68, 252, 'prop_oak').setScale(1.25);

      // Streetlights with warm additive glows
      [225, 465, 585].forEach((lx) => {
        this.add.image(lx, 272, 'prop_streetlight');
        const halo = this.add.image(lx + 7, 260, 'amber_glow').setBlendMode(Phaser.BlendModes.ADD).setScale(1.25);
        this.tweens.add({ targets: halo, alpha: { from: 0.7, to: 1 }, duration: Phaser.Math.Between(900, 1400), yoyo: true, repeat: -1 });
      });

      this.fountain = this.add.image(345, 286, 'prop_fountain_0');
      this.time.addEvent({
        delay: 420, loop: true,
        callback: () => {
          if (this.fountain) this.fountain.setTexture(this.fountain.texture.key === 'prop_fountain_0' ? 'prop_fountain_1' : 'prop_fountain_0');
        }
      });

      this.villagerA = this.add.image(210, 305, 'player_right_0');
      this.add.image(395, 298, 'npc_villager1');
      this.add.image(425, 304, 'npc_villager2');
      this.tweens.add({ targets: this.villagerA, x: 235, duration: 3800, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

      // Drifting golden fireflies
      this.fireflies = [];
      for (let i = 0; i < 24; i++) {
        const ff = this.add.image(Phaser.Math.Between(0, W), Phaser.Math.Between(40, H), 'firefly_particle')
          .setBlendMode(Phaser.BlendModes.ADD).setAlpha(0.85);
        ff.vx = Phaser.Math.FloatBetween(-0.25, 0.35);
        ff.vy = Phaser.Math.FloatBetween(-0.2, 0.2);
        ff.phase = Math.random() * 6;
        this.fireflies.push(ff);
      }
    }
    update(time) {
      this.fireflies.forEach((ff) => {
        ff.x += ff.vx;
        ff.y += ff.vy + Math.sin(time / 500 + ff.phase) * 0.15;
        ff.alpha = 0.4 + 0.5 * Math.sin(time / 400 + ff.phase);
        if (ff.x > 650) ff.x = -5;
        if (ff.x < -10) ff.x = 645;
        if (ff.y > 365) ff.y = 40;
        if (ff.y < 30) ff.y = 360;
      });
    }
  }

  class WorldScene extends Phaser.Scene {
    constructor() {
      super('WorldScene');
      this.currentZone = 'village';
      this.interactables = [];
      this.wanderingNpcs = [];
      this.fireflies = [];
      this.domLabels = [];
      this.lightSources = [];
      this.facing = 'down';
    }
    init(data) {
      this.currentZone = data?.zone || gameState.state.currentLocation || 'village';
      this.spawnPos = data?.spawn || null;
      this.celebrationMode = Boolean(data?.celebration);
    }
    create() {
      this.interactables = [];
      this.wanderingNpcs = [];
      this.fireflies = [];
      this.domLabels = [];
      this.lightSources = [];
      this.colliders = this.physics.add.staticGroup();

      this.labelsLayer = document.getElementById('world-labels-layer');
      if (!this.labelsLayer) {
        this.labelsLayer = document.createElement('div');
        this.labelsLayer.id = 'world-labels-layer';
        const shell = document.getElementById('game-shell');
        shell.insertBefore(this.labelsLayer, document.getElementById('hud-overlay'));
      }
      this.labelsLayer.innerHTML = '';

      this.promptEl = document.createElement('div');
      this.promptEl.className = 'world-prompt';
      this.promptEl.style.display = 'none';
      this.labelsLayer.appendChild(this.promptEl);

      gameState.state.currentLocation = this.currentZone;
      gameState.save();

      const worldSize = this.buildZone(this.currentZone);
      this.worldSize = worldSize;
      this.physics.world.setBounds(0, 0, worldSize.w, worldSize.h);

      const sx = this.spawnPos ? this.spawnPos.x : worldSize.defaultSpawn.x;
      const sy = this.spawnPos ? this.spawnPos.y : worldSize.defaultSpawn.y;
      this.player = this.physics.add.sprite(sx, sy, 'player_down_0').setOrigin(0.5, 1);
      this.player.setCollideWorldBounds(true);
      this.player.body.setSize(12, 8).setOffset(4, 16);
      this.player.setDepth(Math.round(sy));

      this.greenMark = this.add.image(sx, sy - 32, 'green_mark').setDepth(1950);
      this.greenMarkGlow = this.add.circle(sx, sy - 32, 10, 0x2ecc71, 0.28).setDepth(1949);
      this.tweens.add({
        targets: [this.greenMarkGlow],
        scale: { from: 0.9, to: 1.32 },
        alpha: { from: 0.2, to: 0.45 },
        duration: 1100, yoyo: true, repeat: -1
      });

      this.physics.add.collider(this.player, this.colliders);

      const camZoom = this.currentZone === 'tailor_shop' ? 640 / 480 : 1.35;
      this.cameras.main.setZoom(camZoom);
      this.cameras.main.setBounds(0, 0, worldSize.w, worldSize.h);
      this.cameras.main.startFollow(this.player, true, 0.14, 0.14);

      // ---- NIGHT ATMOSPHERIC LIGHTING SYSTEM ----
      // Carves soft warm pools out of a deep indigo night blanket around streetlights, lanterns, windows & player!
      this.isIndoor = this.currentZone === 'tailor_shop';
      this.nightAlpha = this.isIndoor ? (this.celebrationMode ? 0.16 : 0.28) : 0.6;
      this.nightRT = this.add.renderTexture(0, 0, worldSize.w, worldSize.h).setOrigin(0, 0).setDepth(1700);
      this.lightStamp = this.make.image({ key: 'light_brush', add: false }).setOrigin(0.5, 0.5);
      this.renderNightLighting(0);

      // Glowing night fireflies outdoors
      if (!this.isIndoor) {
        for (let i = 0; i < 22; i++) {
          const ff = this.add.image(
            Phaser.Math.Between(0, worldSize.w),
            Phaser.Math.Between(0, worldSize.h),
            'firefly_particle'
          ).setDepth(1820).setBlendMode(Phaser.BlendModes.ADD).setAlpha(0.8);
          ff.vx = Phaser.Math.FloatBetween(-0.22, 0.35);
          ff.vy = Phaser.Math.FloatBetween(-0.18, 0.18);
          ff.phase = Math.random() * 6;
          ff.maxW = worldSize.w;
          ff.maxH = worldSize.h;
          this.fireflies.push(ff);
        }
      }

      this.cursors = this.input.keyboard.createCursorKeys();
      this.keys = this.input.keyboard.addKeys({
        W: Phaser.Input.Keyboard.KeyCodes.W,
        A: Phaser.Input.Keyboard.KeyCodes.A,
        S: Phaser.Input.Keyboard.KeyCodes.S,
        D: Phaser.Input.Keyboard.KeyCodes.D,
        E: Phaser.Input.Keyboard.KeyCodes.E
      });

      this.input.keyboard.on('keydown-E', () => {
        if (gameState.isUIOpen()) return;
        if (this.nearestInteractable) {
          audioManager.playClick();
          this.nearestInteractable.onInteract();
        }
      });

      this._onPostRender = () => this.syncDomLabels();
      this.game.events.on('postrender', this._onPostRender);
      this.events.once('shutdown', () => {
        this.game.events.off('postrender', this._onPostRender);
        if (this.labelsLayer) this.labelsLayer.innerHTML = '';
      });

      window.valeUI?.onZoneEntered(this.currentZone);

      if (this.celebrationMode && !gameState.state.quests.mayas_shadow.rewardsClaimed) {
        this.spawnCelebrationEffects();
        this.time.delayedCall(650, () => window.valeUI?.openQuestSuccess('mayas_shadow'));
      }
    }

    registerLight(x, y, scale = 1.0, addHalo = true) {
      this.lightSources.push({ x, y, scale, phase: Math.random() * 6 });
      if (addHalo) {
        const halo = this.add.image(x, y, 'amber_glow')
          .setDepth(1750)
          .setBlendMode(Phaser.BlendModes.ADD)
          .setScale(scale * 0.85)
          .setAlpha(0.65);
        this.tweens.add({
          targets: halo,
          alpha: { from: 0.5, to: 0.82 },
          scale: { from: scale * 0.8, to: scale * 0.94 },
          duration: Phaser.Math.Between(900, 1450),
          yoyo: true,
          repeat: -1
        });
      }
    }

    renderNightLighting(time) {
      if (!this.nightRT) return;
      this.nightRT.clear();
      this.nightRT.fill(this.isIndoor ? 0x160d1c : 0x0b102c, this.nightAlpha);

      for (const ls of this.lightSources) {
        const pulse = 1 + Math.sin(time / 480 + ls.phase) * 0.04;
        this.lightStamp.setScale(ls.scale * pulse);
        this.nightRT.erase(this.lightStamp, ls.x, ls.y);
      }

      // Soft personal lantern aura around the player so they're always clear at night
      if (this.player) {
        this.lightStamp.setScale(this.isIndoor ? 0.85 : 0.72);
        this.nightRT.erase(this.lightStamp, this.player.x, this.player.y - 12);
      }
    }

    syncDomLabels() {
      const cam = this.cameras?.main;
      if (!cam || !cam.worldView || cam.worldView.width <= 0) return;
      const v = cam.worldView;
      const uiOpen = gameState.isUIOpen();

      for (const lbl of this.domLabels) {
        const nx = (lbl.x - v.x) / v.width;
        const ny = (lbl.y - v.y) / v.height;
        if (nx < -0.15 || nx > 1.15 || ny < -0.15 || ny > 1.15) {
          lbl.el.style.display = 'none';
        } else {
          lbl.el.style.display = 'block';
          lbl.el.style.left = `${(nx * 100).toFixed(2)}%`;
          lbl.el.style.top = `${(ny * 100).toFixed(2)}%`;
        }
      }

      if (this.nearestInteractable && !uiOpen) {
        const rawX = (this.nearestInteractable.x - v.x) / v.width;
        const rawY = (this.nearestInteractable.y - 30 - v.y) / v.height;
        const cx = Math.max(0.12, Math.min(0.88, rawX));
        const cy = Math.max(0.14, Math.min(0.92, rawY));
        this.promptEl.textContent = this.nearestInteractable.label;
        this.promptEl.style.left = `${(cx * 100).toFixed(2)}%`;
        this.promptEl.style.top = `${(cy * 100).toFixed(2)}%`;
        this.promptEl.style.display = 'block';
      } else {
        this.promptEl.style.display = 'none';
      }
    }

    addSortedSprite(x, footY, key) {
      return this.add.image(x, footY, key).setOrigin(0.5, 1).setDepth(Math.round(footY));
    }
    addSolid(x, y, w, h) {
      const rect = this.add.rectangle(x, y, w, h, 0x000000, 0);
      this.physics.add.existing(rect, true);
      this.colliders.add(rect);
      return rect;
    }
    addInteractable(x, y, radius, label, onInteract) {
      this.interactables.push({ x, y, radius, label, onInteract });
    }
    addLabel(x, y, text, extraClass = '') {
      const elNode = document.createElement('div');
      elNode.className = `world-label ${extraClass}`.trim();
      elNode.textContent = text;
      this.labelsLayer.appendChild(elNode);
      const entry = { x, y, el: elNode };
      this.domLabels.push(entry);
      return entry;
    }
    addLantern(x, footY) {
      this.addSortedSprite(x, footY, 'prop_lantern');
      this.addSolid(x, footY - 3, 6, 6);
      this.registerLight(x, footY - 28, 0.95, true);
    }
    addStreetlight(x, footY) {
      this.addSortedSprite(x, footY, 'prop_streetlight');
      this.addSolid(x, footY - 3, 8, 6);
      this.registerLight(x + 7, footY - 36, 1.35, true);
    }

    buildZone(zone) {
      if (zone === 'tailor_shop') return this.buildTailorShop();
      if (zone === 'marketplace') return this.buildMarketplace();
      if (zone === 'innovation_guild') return this.buildInnovationGuild();
      if (zone === 'highland_council') return this.buildHighlandCouncil();
      return this.buildVillageSquare();
    }

    buildVillageSquare() {
      const W = 896, H = 576;
      const questDone = gameState.state.quests.mayas_shadow.completed;
      const highlandUnlocked = Boolean(gameState.state.unlockedLocations.highland_council);

      buildGroundTexture(this, 'ground_village', W, H, [
        [352, 224, 192, 160],
        [96, 288, 768, 36],
        [430, 24, 38, 520],
        [192, 192, 38, 106]
      ], 17);
      this.add.image(0, 0, 'ground_village').setOrigin(0, 0).setDepth(0);

      // Fountain with moonlit reflection
      const fountain = this.addSortedSprite(448, 312, 'prop_fountain_0');
      this.addSolid(448, 300, 40, 20);
      this.registerLight(448, 294, 0.8, false);
      this.time.addEvent({
        delay: 420, loop: true,
        callback: () => { if (fountain.scene) fountain.setTexture(fountain.texture.key === 'prop_fountain_0' ? 'prop_fountain_1' : 'prop_fountain_0'); }
      });

      // Maya's Tailor & Workshop + warm window glows
      this.addSortedSprite(210, 192, 'bldg_tailor');
      this.addSolid(210, 168, 110, 44);
      this.registerLight(180, 160, 0.72, true);
      this.registerLight(240, 160, 0.72, true);
      this.addLabel(210, 96, "Maya's Tailor & Workshop");
      this.addInteractable(210, 198, 34, "[E] Enter Maya's Workshop", () => {
        if (!gameState.canEnterTailorShop()) {
          window.valeUI.openSimpleNotice(
            "Maya's Tailor & Workshop",
            "Maya is sitting right outside under the lantern looking troubled. Speak with Maya first before stepping into her family's workshop!"
          );
          window.valeUI.toast('❗ Talk to Maya outside the door first!');
          return;
        }
        this.transitionTo('tailor_shop', { x: 240, y: 248 });
      });

      // Old Hana's Cottage + glowing windows
      this.addSortedSprite(660, 188, 'bldg_cottage');
      this.addSolid(660, 166, 94, 42);
      this.registerLight(635, 160, 0.7, true);
      this.registerLight(685, 160, 0.7, true);
      this.addLabel(660, 102, "Old Hana's Cottage");

      // North Gate -> Highland Council (50 Social Credibility)
      if (!highlandUnlocked) {
        this.addSortedSprite(449, 64, 'prop_gate_locked');
        this.addSolid(449, 54, 56, 18);
        this.addLabel(449, 36, '🔒 Highland Council (50 SC)');
        this.addInteractable(449, 76, 40, '[E] Inspect Highland Gate', () => {
          window.valeUI.openSimpleNotice(
            'Highland Council Gate',
            `The northern stone road climbs to the Highland Council.\nREQUIRES 50 SOCIAL CREDIBILITY (Current: ${gameState.state.socialCredibility} / 50).\nTip: Complete Maya's quests or use Supplies/Flowers from the Marketplace to earn community trust!`
          );
        });
      } else {
        this.addStreetlight(414, 78);
        this.addStreetlight(484, 78);
        this.addLabel(449, 34, '▲ Highland Council (OPEN!)');
        this.addInteractable(449, 54, 42, '[E] Ascend to Highland Council', () => {
          this.transitionTo('highland_council', { x: 320, y: 318 });
        });
      }

      // Noticeboard
      this.addSortedSprite(358, 250, 'prop_noticeboard');
      this.addSolid(358, 245, 24, 10);
      this.addInteractable(358, 256, 32, '[E] Read Noticeboard', () => {
        window.valeUI.openSimpleNotice(
          'Vale Village Noticeboard',
          questDone ? NPC_LINES.noticeboard_after : NPC_LINES.noticeboard_before
        );
      });

      // Flowers, Cozy Lanterns & Tall Wrought-Iron Streetlights
      [[300, 214], [520, 214], [320, 384], [560, 384], [150, 365]].forEach(([x, y]) => {
        this.addSortedSprite(x, y, 'prop_flowers').setDepth(2);
      });
      [[384, 248], [512, 248], [384, 372], [512, 372]].forEach(([x, y]) => this.addLantern(x, y));
      [[270, 286], [615, 286], [118, 286], [760, 286], [412, 468], [486, 468]].forEach(([x, y]) => this.addStreetlight(x, y));

      // Trees
      [[68, 126], [68, 510], [830, 126], [830, 510], [220, 520], [670, 520], [315, 470], [360, 130], [540, 130]].forEach(([x, y]) => {
        this.addSortedSprite(x, y, 'prop_oak');
        this.addSolid(x, y - 6, 20, 12);
      });

      // EASTER EGG: SANS THE SKELETON lounging under the west streetlight!
      this.addSortedSprite(106, 336, 'npc_sans');
      this.addSolid(106, 332, 12, 8);
      this.addLabel(106, 354, 'sans', 'sans-label');
      this.addInteractable(106, 336, 36, '[E] Talk to sans', () => window.valeUI.startSansEasterEgg());

      // MAYA outside workshop
      if (!questDone) {
        this.addSortedSprite(154, 214, 'npc_maya_sad');
        this.addSolid(154, 210, 12, 8);
        this.addLabel(154, 232, 'Maya');
        const bubble = this.add.image(154, 182, 'quest_bubble').setDepth(1850);
        this.tweens.add({ targets: bubble, y: 177, duration: 600, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
        this.addInteractable(154, 214, 38, '[E] Talk to Maya', () => window.valeUI.startMayaDialogue());
      } else {
        this.addSortedSprite(154, 214, 'npc_maya_mech');
        this.addSolid(154, 210, 12, 8);
        this.addLabel(154, 232, 'Maya');
        if (!gameState.state.quests.mayas_loom.completed) {
          const b2 = this.add.image(154, 182, 'quest_bubble').setDepth(1850);
          this.tweens.add({ targets: b2, y: 177, duration: 600, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
        }
        this.addInteractable(154, 214, 38, '[E] Talk to Maya', () => window.valeUI.startMayaPostQuestDialogue());
      }

      // Wandering Villagers
      this.spawnWanderingVillager(565, 336, 'npc_villager1', 'Old Hana', () => {
        window.valeUI.openNpcChat('villager_anna', questDone ? NPC_LINES.hana_after : NPC_LINES.hana_before);
      });
      this.spawnWanderingVillager(305, 425, 'npc_villager2', 'Farmer Pip', () => {
        window.valeUI.openNpcChat('villager_thomas', questDone ? NPC_LINES.pip_after : NPC_LINES.pip_before);
      });

      // South exit -> Marketplace
      this.addLabel(448, 556, '▼ Local Marketplace');
      this.addInteractable(448, 536, 42, '[E] Go to Local Marketplace', () => this.transitionTo('marketplace', { x: 320, y: 92 }));

      // East path -> Innovation Guild
      if (!questDone) {
        this.addSortedSprite(832, 326, 'prop_barrier');
        this.addSolid(832, 306, 22, 44);
        this.addLabel(794, 272, '🔒 Innovation Guild');
        this.addInteractable(804, 308, 38, '[E] Inspect Road', () => {
          window.valeUI.openSimpleNotice(
            'Overgrown Guild Road',
            "Thick brambles and old stakes block the eastern lane toward the Innovation Guild & Engineering Academy. Resolve Maya's Shadow to rally the village and open this path."
          );
        });
      } else {
        this.addLabel(820, 272, '▶ Innovation Guild (OPEN!)');
        this.addInteractable(826, 308, 42, '[E] Enter Innovation Guild', () => this.transitionTo('innovation_guild', { x: 96, y: 248 }));
      }

      return { w: W, h: H, defaultSpawn: { x: 448, y: 365 } };
    }

    buildTailorShop() {
      const W = 480, H = 270;
      const questDone = gameState.state.quests.mayas_shadow.completed;
      const loomActive = questDone && !gameState.state.quests.mayas_loom.completed;

      buildTailorInteriorBG(this, 'bg_tailor_interior');
      this.add.image(0, 0, 'bg_tailor_interior').setOrigin(0, 0).setDepth(0);

      // Warm cozy interior lights
      this.registerLight(123, 24, 1.35, true);
      this.registerLight(240, 155, 1.65, false);
      this.registerLight(375, 180, 1.1, true);

      this.addSolid(W / 2, 44, W, 88);
      this.addSolid(10, H / 2, 20, H);
      this.addSolid(W - 10, H / 2, 20, H);

      this.addSortedSprite(72, 146, 'shop_mannequin');
      this.addSolid(72, 140, 18, 10);

      this.addSortedSprite(28, 114, 'shop_plant_pot');
      this.addSolid(28, 110, 14, 8);

      this.addSortedSprite(225, 166, 'shop_counter');
      this.addSolid(225, 156, 108, 18);
      this.addLabel(225, 128, 'Tailoring Counter');

      this.addSortedSprite(380, 128, 'shop_sewing');
      this.addSolid(380, 118, 58, 18);

      // Maya's Workbench (Act 1: Blueprints | Act 2: Build Prototype IV Tool!)
      this.addSortedSprite(370, 200, 'shop_workbench');
      this.addSolid(370, 188, 78, 20);
      this.addLabel(370, 164, "Maya's Workbench");

      this.addSortedSprite(438, 168, 'shop_plant_crate');
      this.addSolid(438, 160, 22, 14);

      if (!gameState.state.hasBlueprints && !questDone) {
        const glint = this.add.circle(362, 180, 6, 0x6cd4ff, 0.75).setDepth(1840);
        this.tweens.add({ targets: glint, alpha: 0.15, scale: 1.45, duration: 700, yoyo: true, repeat: -1 });
        const wbBubble = this.add.image(370, 146, 'quest_bubble').setDepth(1850);
        this.tweens.add({ targets: wbBubble, y: 141, duration: 550, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
        this.addInteractable(370, 206, 44, "[E] Inspect Maya's Blueprints", () => {
          window.valeUI.pickupBlueprints();
          glint.destroy();
          wbBubble.destroy();
        });
      } else if (loomActive) {
        const wbBubble = this.add.image(370, 146, 'quest_bubble').setDepth(1850);
        this.tweens.add({ targets: wbBubble, y: 141, duration: 550, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
        this.addInteractable(370, 206, 44, '[E] Build Prototype IV Loom', () => {
          window.valeUI.startBuildToolQuest();
        });
      } else {
        this.addInteractable(370, 206, 42, "[E] View Maya's Blueprints", () => {
          window.valeUI.inspectWorkbenchBlueprints();
        });
      }

      this.addSortedSprite(110, 198, 'npc_father');
      this.addSolid(110, 194, 12, 8);
      this.addLabel(110, 172, "Arthur (Maya's Father)", 'parent-label');

      this.addSortedSprite(186, 212, 'npc_mother');
      this.addSolid(186, 208, 12, 8);
      this.addLabel(186, 186, "Clara (Maya's Mother)", 'parent-label');

      this.addSortedSprite(62, 224, 'npc_brother');
      this.addSolid(62, 220, 12, 8);
      this.addLabel(62, 238, "Leo (Maya's Brother)");

      const showMayaInside =
        this.celebrationMode || questDone || gameState.state.quests.mayas_shadow.stage === 'family_meeting';

      if (showMayaInside) {
        const mayaTex = this.celebrationMode || questDone ? 'npc_maya_mech' : 'npc_maya_sad';
        this.addSortedSprite(262, 220, mayaTex);
        this.addSolid(262, 216, 12, 8);
        this.addLabel(262, 234, 'Maya');
        this.addInteractable(262, 220, 34, '[E] Talk to Maya', () => {
          if (questDone) window.valeUI.startMayaPostQuestDialogue();
          else {
            window.valeUI.openNpcChat(
              'maya',
              gameState.state.hasBlueprints
                ? '*Maya whispers, eyes bright:* "You have my loom blueprint! Go speak with Arthur and Clara now—Dad respects hard proof. And talk to Leo on the left if you haven’t already!"'
                : '*Maya nods toward the right side of the room:* "Check my workbench over there first! Once you’ve seen my loom blueprint, Dad won’t be able to wave you off."'
            );
          }
        });
      }

      if (this.celebrationMode || questDone) {
        [[306, 236, 'npc_villager1'], [336, 240, 'npc_villager2'], [366, 236, 'npc_merchant'], [396, 238, 'npc_guild']].forEach(
          ([vx, vy, tex]) => this.addSortedSprite(vx, vy, tex)
        );
      }

      this.addInteractable(148, 206, 54, "[E] Talk to Maya's Parents (Arthur & Clara)", () => window.valeUI.startParentsDialogue());
      this.addInteractable(62, 224, 34, "[E] Talk to Leo (Maya's Brother)", () => window.valeUI.startLeoDialogue());

      this.addLabel(240, 266, '▼ Exit to Vale Square');
      this.addInteractable(240, 258, 30, '[E] Exit to Vale Square', () => this.transitionTo('village', { x: 210, y: 216 }));

      return { w: W, h: H, defaultSpawn: { x: 240, y: 246 } };
    }

    buildMarketplace() {
      const W = 640, H = 360;
      buildGroundTexture(this, 'ground_market', W, H, [
        [96, 64, 448, 224],
        [296, 0, 48, 72]
      ], 41);
      this.add.image(0, 0, 'ground_market').setOrigin(0, 0).setDepth(0);

      [[175, 148], [320, 148], [465, 148]].forEach(([x, y]) => {
        this.addSortedSprite(x, y, 'prop_stall');
        this.addSolid(x, y - 10, 56, 20);
        this.registerLight(x, y - 24, 0.9, true);
      });
      this.addStreetlight(110, 175);
      this.addStreetlight(530, 175);
      this.addLantern(250, 260);
      this.addLantern(390, 260);
      this.addSortedSprite(90, 268, 'prop_flowers').setDepth(2);
      this.addSortedSprite(550, 268, 'prop_flowers').setDepth(2);

      this.addSortedSprite(320, 182, 'npc_merchant');
      this.addSolid(320, 178, 12, 8);
      this.addLabel(320, 198, gameState.state.marketplaceDiscountActive ? 'Barnaby (15% OFF!)' : 'Merchant Barnaby');
      this.addInteractable(320, 186, 44, '[E] Browse Marketplace', () => window.valeUI.openMarketplace());

      this.spawnWanderingVillager(180, 250, 'npc_villager1', 'Shopper', () => {
        window.valeUI.openNpcChat(
          'villager_anna',
          gameState.state.marketplaceDiscountActive
            ? 'Barnaby knocked 15% off everything! Grab Mechanical Components if you’re helping Maya build her Prototype IV loom!'
            : 'Barnaby drives a fair bargain—his Village Supplies and Flowers are great for helping neighbors around Vale.'
        );
      });

      this.addLabel(320, 46, '▲ Back to Vale Square');
      this.addInteractable(320, 52, 42, '[E] Return to Vale Square', () => this.transitionTo('village', { x: 448, y: 506 }));
      return { w: W, h: H, defaultSpawn: { x: 320, y: 92 } };
    }

    buildInnovationGuild() {
      const W = 640, H = 360;
      buildGroundTexture(this, 'ground_guild', W, H, [
        [0, 220, 640, 48],
        [312, 164, 56, 72]
      ], 73);
      this.add.image(0, 0, 'ground_guild').setOrigin(0, 0).setDepth(0);

      this.addSortedSprite(340, 180, 'bldg_guild');
      this.addSolid(340, 152, 124, 52);
      this.registerLight(305, 148, 0.9, true);
      this.registerLight(375, 148, 0.9, true);
      this.addLabel(340, 82, 'Innovation Guild & Engineering Academy');

      this.addStreetlight(245, 214);
      this.addStreetlight(435, 214);
      this.addLantern(120, 220);
      this.addSortedSprite(145, 168, 'prop_oak');
      this.addSolid(145, 160, 20, 12);
      this.addSortedSprite(540, 168, 'prop_oak');
      this.addSolid(540, 160, 20, 12);

      this.addSortedSprite(340, 218, 'npc_guild');
      this.addSolid(340, 214, 12, 8);
      this.addLabel(340, 236, 'Guildmaster Elena');
      this.addInteractable(340, 220, 44, '[E] Speak with Guildmaster Elena', () => window.valeUI.startElenaDialogue());

      this.addLabel(68, 260, '◀ Vale Square');
      this.addInteractable(72, 246, 44, '[E] Return to Vale Square', () => this.transitionTo('village', { x: 800, y: 308 }));
      return { w: W, h: H, defaultSpawn: { x: 96, y: 248 } };
    }

    // NEW PLAYABLE EXPANSION: HIGHLAND COUNCIL HILLTOP TERRACE
    buildHighlandCouncil() {
      const W = 640, H = 360;
      const hearingDone = gameState.state.quests.highland_hearing.completed;

      buildGroundTexture(this, 'ground_highland', W, H, [
        [140, 175, 360, 120],
        [290, 285, 60, 75]
      ], 97, true);
      this.add.image(0, 0, 'ground_highland').setOrigin(0, 0).setDepth(0);

      // Highland Council Grand Hall
      this.addSortedSprite(320, 178, 'bldg_council');
      this.addSolid(320, 146, 164, 58);
      this.registerLight(270, 140, 0.95, true);
      this.registerLight(370, 140, 0.95, true);
      this.addLabel(320, 68, 'Highland Council Assembly Hall');

      // Ceremonial Streetlights lining the terrace
      [[162, 198], [478, 198], [218, 284], [422, 284]].forEach(([x, y]) => this.addStreetlight(x, y));

      // Councilor Minh at the podium
      this.addSortedSprite(320, 216, 'npc_councilor');
      this.addSolid(320, 212, 12, 8);
      this.addLabel(320, 190, 'Councilor Minh (Council Chair)', 'parent-label');
      if (!hearingDone) {
        const cb = this.add.image(320, 178, 'quest_bubble').setDepth(1850);
        this.tweens.add({ targets: cb, y: 173, duration: 550, yoyo: true, repeat: -1 });
      }
      this.addInteractable(320, 220, 48, '[E] Address Highland Council', () => window.valeUI.startHighlandHearing());

      // Maya & Guildmaster Elena attending in support!
      this.addSortedSprite(255, 232, 'npc_maya_mech');
      this.addSolid(255, 228, 12, 8);
      this.addLabel(255, 248, 'Maya');
      this.addInteractable(255, 232, 34, '[E] Talk to Maya', () => {
        window.valeUI.openNpcChat(
          'maya_happy',
          hearingDone
            ? '*Maya holds up the signed Equal-Access Charter, beaming under the streetlights:* "No girl in Vale will ever have to hide her blueprints under a cloth roll again!"'
            : '*Maya grips her Prototype IV Loom Governor nervously:* "Councilor Minh thinks our story is just a one-off exception. Help me show the Council why the old bylaws hold back the entire valley!"'
        );
      });

      this.addSortedSprite(385, 232, 'npc_guild');
      this.addSolid(385, 228, 12, 8);
      this.addLabel(385, 248, 'Guildmaster Elena');
      this.addInteractable(385, 232, 34, '[E] Talk to Elena', () => {
        window.valeUI.openNpcChat(
          'elena',
          hearingDone
            ? 'With the Vale Equal-Access Charter ratified, our Academy can finally fund open STEM fellowships for every young person in the valley.'
            : 'Councilor Minh respects data and economic outcomes. Connect Maya’s working prototype to structural opportunity—not just individual talent.'
        );
      });

      // South exit -> Vale Village Square
      this.addLabel(320, 352, '▼ Descend to Vale Square');
      this.addInteractable(320, 336, 40, '[E] Return to Vale Square', () => this.transitionTo('village', { x: 449, y: 92 }));

      return { w: W, h: H, defaultSpawn: { x: 320, y: 316 } };
    }

    spawnWanderingVillager(x, footY, tex, name, onInteract) {
      const npc = this.addSortedSprite(x, footY, tex);
      const label = this.addLabel(x, footY + 16, name);
      const interactObj = { x, y: footY, radius: 36, label: `[E] Talk to ${name}`, onInteract };
      this.interactables.push(interactObj);
      this.wanderingNpcs.push({ sprite: npc, label, originX: x, dir: 1, speed: 14, interactRef: interactObj });
    }

    spawnCelebrationEffects() {
      for (let i = 0; i < 6; i++) {
        const heart = this.add.image(155 + i * 28, 194, 'heart_icon').setDepth(1860);
        this.tweens.add({ targets: heart, y: 152, alpha: { from: 1, to: 0.15 }, duration: 1400 + i * 180, repeat: -1 });
      }
    }

    transitionTo(zone, spawn = null, celebration = false) {
      this.cameras.main.fadeOut(180, 12, 12, 26);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.restart({ zone, spawn, celebration });
      });
    }

    update(time, delta) {
      const dt = delta / 1000;

      // Animate night fireflies
      this.fireflies.forEach((ff) => {
        ff.x += ff.vx;
        ff.y += ff.vy + Math.sin(time / 500 + ff.phase) * 0.12;
        ff.alpha = 0.35 + 0.55 * Math.sin(time / 420 + ff.phase);
        if (ff.x > ff.maxW) ff.x = 0;
        if (ff.x < 0) ff.x = ff.maxW;
        if (ff.y > ff.maxH) ff.y = 0;
        if (ff.y < 0) ff.y = ff.maxH;
      });

      if (!gameState.isUIOpen()) {
        this.wanderingNpcs.forEach((n) => {
          n.sprite.x += n.dir * n.speed * dt;
          if (Math.abs(n.sprite.x - n.originX) > 36) n.dir *= -1;
          n.sprite.setDepth(Math.round(n.sprite.y));
          n.label.x = n.sprite.x;
          n.interactRef.x = n.sprite.x;
        });
      }

      if (gameState.isUIOpen()) {
        this.player.setVelocity(0, 0);
        this.player.anims.stop();
        this.renderNightLighting(time);
        return;
      }

      const speed = 108;
      let vx = 0, vy = 0;
      if (this.cursors.left.isDown || this.keys.A.isDown) vx -= 1;
      if (this.cursors.right.isDown || this.keys.D.isDown) vx += 1;
      if (this.cursors.up.isDown || this.keys.W.isDown) vy -= 1;
      if (this.cursors.down.isDown || this.keys.S.isDown) vy += 1;

      if (vx !== 0 || vy !== 0) {
        const len = Math.hypot(vx, vy);
        this.player.setVelocity((vx / len) * speed, (vy / len) * speed);
        this.facing = Math.abs(vx) > Math.abs(vy) ? (vx < 0 ? 'left' : 'right') : (vy < 0 ? 'up' : 'down');
        this.player.anims.play(`walk_${this.facing}`, true);
      } else {
        this.player.setVelocity(0, 0);
        this.player.anims.stop();
        this.player.setTexture(`player_${this.facing}_0`);
      }

      this.player.setDepth(Math.round(this.player.y));

      const floatOffset = Math.sin(time / 320) * 2.5;
      this.greenMark.setPosition(this.player.x, this.player.y - 31 + floatOffset);
      this.greenMarkGlow.setPosition(this.player.x, this.player.y - 31 + floatOffset);
      gameState.state.playerPos = { x: Math.round(this.player.x), y: Math.round(this.player.y) };

      // Dynamic night lighting update (keeps player aura & lantern flicker smooth)
      this.renderNightLighting(time);

      let nearest = null, bestDist = Infinity;
      for (const obj of this.interactables) {
        const d = Phaser.Math.Distance.Between(this.player.x, this.player.y, obj.x, obj.y);
        if (d <= obj.radius && d < bestDist) { bestDist = d; nearest = obj; }
      }
      this.nearestInteractable = nearest;
    }
  }

  /* =========================================================
     5. UI MANAGER (VOICES, USABLE ITEMS, BUILD TOOL, HIGHLAND, REPLAY & FEEDBACK)
  ========================================================= */
  class UIManager {
    constructor(game) {
      this.game = game;
      this.typewriterTimer = null;
      this.isTyping = false;
      this.currentFinishTyping = null;
      this.currentNextAction = null;
      this.currentChoices = [];
      this.dialogueOpenedAt = 0;
      this.selectedMapLoc = null;
      this.pendingQuestReward = 'mayas_shadow';
      this.inMainMenu = true;
      this.bindElements();
      this.createExtraOverlays();
      this.bindEvents();
      this.refreshMainMenuButtons();
      gameState.subscribe(() => this.refreshHUD());
    }

    bindElements() {
      const $ = (id) => document.getElementById(id);
      this.el = {
        mainMenu: $('main-menu-overlay'), hud: $('hud-overlay'), toastBox: $('toast-container'),
        hudGold: $('hud-gold'), hudLoc: $('hud-location-banner'), hudQuest: $('hud-quest-tracker'),
        hudScVal: $('hud-sc-value'), hudScFill: $('hud-sc-fill'),
        btnPlay: $('btn-menu-play'), btnContinue: $('btn-menu-continue'),
        btnMenuJournal: $('btn-menu-journal'), btnMenuSettings: $('btn-menu-settings'),
        btnHudInv: $('btn-hud-inventory'), btnHudMap: $('btn-hud-map'),
        btnHudJournal: $('btn-hud-journal'), btnHudSettings: $('btn-hud-settings'),
        dlgOverlay: $('dialogue-overlay'), dlgPortrait: $('dialogue-portrait'), dlgMood: $('dialogue-mood'),
        dlgSpeaker: $('dialogue-speaker'), dlgRole: $('dialogue-role'), dlgText: $('dialogue-text'),
        dlgChoices: $('dialogue-choices'), dlgNext: $('btn-dialogue-next'), dlgClose: $('btn-dialogue-close'),
        qsOverlay: $('quest-success-overlay'), qsTitle: $('qs-title'), qsDesc: $('qs-desc'),
        qsScAnim: $('qs-sc-anim'), qsRewards: $('qs-rewards'), btnQsClaim: $('btn-qs-claim'),
        journalOverlay: $('journal-overlay'), journalTabs: $('journal-entry-tabs'),
        journalLeft: $('journal-left-content'), journalRight: $('journal-right-content'), btnJournalClose: $('btn-journal-close'),
        mapOverlay: $('map-overlay'), mapTitle: $('map-title'), mapCanvas: $('world-map-canvas'),
        mapPins: $('map-pins-layer'), mapLocName: $('map-loc-name'), mapLocStatus: $('map-loc-status'),
        mapLocDesc: $('map-loc-desc'), btnMapTravel: $('btn-map-travel'), btnMapClose: $('btn-map-close'),
        invOverlay: $('inventory-overlay'), invTitle: $('inv-title'), invGold: $('inv-gold'),
        invDiscount: $('market-discount-banner'), invContent: $('inv-content'), btnInvClose: $('btn-inv-close'),
        setOverlay: $('settings-overlay'), setMusic: $('set-music'), setSfx: $('set-sfx'), setSpeed: $('set-speed'),
        btnSetFull: $('btn-set-fullscreen'), btnSetSave: $('btn-set-save'), btnSetResume: $('btn-set-resume'),
        btnSetMenu: $('btn-set-mainmenu'), btnSetNew: $('btn-set-newgame')
      };
    }

    createExtraOverlays() {
      // 1. Blueprint Showcase above Dialogue
      let bpBox = document.getElementById('blueprint-showcase');
      if (!bpBox) {
        bpBox = document.createElement('div');
        bpBox.id = 'blueprint-showcase';
        bpBox.className = 'hidden';
        bpBox.innerHTML = `
          <div class="bp-header">
            <span>📐 MAYA'S BLUEPRINT — PROTOTYPE IV</span>
            <span class="bp-tag">LOOM TENSIONER</span>
          </div>
          <img id="blueprint-img" alt="Maya's Mechanical Loom Tensioner Blueprint" />
          <div class="bp-caption">Gear-Reduction Crank + Spring Tension Arm • Reduces wrist strain by 60%</div>
        `;
        this.el.dlgOverlay.insertBefore(bpBox, this.el.dlgOverlay.firstChild);
      }
      this.el.bpShowcase = bpBox;
      this.el.bpImg = document.getElementById('blueprint-img');

      // 2. Integrated Community Feedback Tool Overlay (SDG 4.7 co-creation feature)
      let fbOverlay = document.getElementById('feedback-overlay');
      if (!fbOverlay) {
        fbOverlay = document.createElement('div');
        fbOverlay.id = 'feedback-overlay';
        fbOverlay.className = 'modal-backdrop hidden';
        fbOverlay.innerHTML = `
          <div class="feedback-panel wood-panel">
            <h2>💬 STORY FEEDBACK &amp; CO-CREATION</h2>
            <p style="font-size:18px;text-align:center;color:#f4e8c8;">Rate story realism, flag awkward dialogue, or share real-life equality scenarios for future Vale chapters.</p>
            <div class="fb-stars" id="fb-stars">
              ${[1, 2, 3, 4, 5].map((n) => `<button class="fb-star ${n <= 5 ? 'active' : ''}" data-star="${n}">★</button>`).join('')}
            </div>
            <select id="fb-category" class="fb-field">
              <option value="Story Realism">Story Realism Rating</option>
              <option value="Everyday Case Suggestion">Suggest a Real-Life Scenario</option>
              <option value="Dialogue Improvement">Report Awkward Dialogue</option>
            </select>
            <textarea id="fb-note" class="fb-field" rows="3" placeholder="Share a thought or real-life scenario you'd like Vale to explore..."></textarea>
            <div id="fb-history" class="fb-list"></div>
            <div style="display:flex;gap:8px;justify-content:flex-end;">
              <button id="btn-fb-submit" class="wood-btn primary-btn sm-btn">SUBMIT FEEDBACK</button>
              <button id="btn-fb-close" class="wood-btn sm-btn">CLOSE</button>
            </div>
          </div>
        `;
        document.getElementById('game-shell').appendChild(fbOverlay);
      }
      this.el.fbOverlay = fbOverlay;
      this.fbRating = 5;

      // Add Feedback button inside Settings panel
      const setActions = this.el.setOverlay.querySelector('.setting-actions');
      if (setActions && !document.getElementById('btn-set-feedback')) {
        const fbBtn = document.createElement('button');
        fbBtn.id = 'btn-set-feedback';
        fbBtn.className = 'wood-btn';
        fbBtn.textContent = '💬 Story Feedback & Ideas';
        fbBtn.onclick = () => { audioManager.playClick(); this.openFeedbackTool(); };
        setActions.insertBefore(fbBtn, this.el.btnSetResume);
      }
    }

    bindEvents() {
      this.el.btnPlay.onclick = () => {
        audioManager.playClick(); audioManager.startBgm();
        gameState.resetNewGame();
        this.enterGameWorld('village', { x: 448, y: 365 });
      };
      this.el.btnContinue.onclick = () => {
        audioManager.playClick(); audioManager.startBgm();
        if (gameState.load()) {
          this.enterGameWorld(gameState.state.currentLocation, gameState.state.playerPos);
          this.toast('Saved game loaded!');
        }
      };
      this.el.btnMenuJournal.onclick = () => {
        audioManager.playClick();
        if (gameState.hasSave() && !gameState.state.started) gameState.load();
        this.openJournal();
      };
      this.el.btnMenuSettings.onclick = () => { audioManager.playClick(); this.openSettings(); };

      this.el.btnHudInv.onclick = () => { audioManager.playClick(); this.openInventory(); };
      this.el.btnHudMap.onclick = () => { audioManager.playClick(); this.openWorldMap(); };
      this.el.btnHudJournal.onclick = () => { audioManager.playClick(); this.openJournal(); };
      this.el.btnHudSettings.onclick = () => { audioManager.playClick(); this.openSettings(); };

      this.el.dlgClose.onclick = () => { audioManager.playClick(); this.closeAllModals(); };
      this.el.btnJournalClose.onclick = () => { audioManager.playClick(); this.closeAllModals(); };
      this.el.btnMapClose.onclick = () => { audioManager.playClick(); this.closeAllModals(); };
      this.el.btnInvClose.onclick = () => { audioManager.playClick(); this.closeAllModals(); };

      // Feedback Tool events
      document.getElementById('btn-fb-close').onclick = () => { audioManager.playClick(); this.closeAllModals(); };
      document.querySelectorAll('#fb-stars .fb-star').forEach((btn) => {
        btn.onclick = () => {
          audioManager.playClick();
          this.fbRating = Number(btn.dataset.star);
          document.querySelectorAll('#fb-stars .fb-star').forEach((b) => {
            b.classList.toggle('active', Number(b.dataset.star) <= this.fbRating);
          });
        };
      });
      document.getElementById('btn-fb-submit').onclick = () => {
        const cat = document.getElementById('fb-category').value;
        const note = document.getElementById('fb-note').value.trim();
        audioManager.playCoin();
        gameState.addFeedback({ rating: this.fbRating, category: cat, note: note || '(No additional comment)' });
        document.getElementById('fb-note').value = '';
        this.toast('💬 Thank you! Feedback saved for future Vale updates.');
        this.openFeedbackTool();
      };

      this.el.dlgText.onclick = () => {
        if (this.isTyping && this.currentFinishTyping) {
          audioManager.playClick();
          this.currentFinishTyping();
        }
      };

      // Claim rewards for Act 1, Act 2, or Act 3!
      this.el.btnQsClaim.onclick = () => {
        audioManager.playFanfare();
        const qid = this.pendingQuestReward;
        this.closeAllModals();
        if (qid === 'mayas_shadow') {
          if (gameState.completeMayasShadow(REWARD_ITEMS)) {
            this.toast('✨ +10 SC! Innovation Guild Unlocked, 15% Discount Active, & Act 2 (Prototype Loom) Started!');
          }
        } else if (qid === 'mayas_loom') {
          if (gameState.completeMayasLoom(REWARD_ITEMS)) {
            this.toast('🛠️ Prototype IV Crafted! +20 SC — Highland Council UNLOCKED!');
          }
        } else if (qid === 'highland_hearing') {
          if (gameState.completeHighlandHearing(REWARD_ITEMS)) {
            this.toast('📜 Vale Equal-Access Charter Signed! +25 SC — Journal Updated!');
          }
        }
        this.refreshHUD();
      };

      this.el.btnMapTravel.onclick = () => {
        if (!this.selectedMapLoc) return;
        if (this.selectedMapLoc === 'tailor_shop' && !gameState.canEnterTailorShop()) {
          audioManager.playClick();
          this.toast('❗ Talk to Maya outside her workshop first!');
          return;
        }
        audioManager.playClick();
        const target = this.selectedMapLoc;
        this.closeAllModals();
        if (this.inMainMenu) this.enterGameWorld(target);
        else this.game.scene.getScene('WorldScene').transitionTo(target);
      };

      this.el.setMusic.oninput = () => {
        gameState.state.settings.musicVolume = Number(this.el.setMusic.value) / 100;
        audioManager.setVolumes(gameState.state.settings.musicVolume, gameState.state.settings.sfxVolume);
        gameState.save();
      };
      this.el.setSfx.oninput = () => {
        gameState.state.settings.sfxVolume = Number(this.el.setSfx.value) / 100;
        audioManager.setVolumes(gameState.state.settings.musicVolume, gameState.state.settings.sfxVolume);
        gameState.save();
      };
      this.el.setSpeed.onchange = () => { gameState.state.settings.textSpeed = this.el.setSpeed.value; gameState.save(); };
      this.el.btnSetFull.onclick = () => {
        audioManager.playClick();
        if (!document.fullscreenElement) document.getElementById('game-shell').requestFullscreen?.().catch(() => {});
        else document.exitFullscreen?.().catch(() => {});
      };
      this.el.btnSetSave.onclick = () => { audioManager.playClick(); gameState.save(); this.toast('Progress saved locally!'); };
      this.el.btnSetResume.onclick = () => { audioManager.playClick(); this.closeAllModals(); };
      this.el.btnSetMenu.onclick = () => { audioManager.playClick(); this.returnToMainMenu(); };
      this.el.btnSetNew.onclick = () => {
        audioManager.playClick();
        if (window.confirm('Start a brand new game? Your current saved progress will be reset.')) {
          gameState.resetNewGame();
          this.closeAllModals();
          this.enterGameWorld('village', { x: 448, y: 365 });
          this.toast('New journey started in Vale!');
        }
      };

      window.addEventListener('keydown', (e) => {
        if (this.inMainMenu) return;
        // Let user type normally inside Feedback textarea
        if (document.activeElement && ['TEXTAREA', 'INPUT', 'SELECT'].includes(document.activeElement.tagName)) return;

        const k = e.key.toLowerCase();
        if (!this.el.dlgOverlay.classList.contains('hidden')) {
          if (k === 'escape') { this.closeAllModals(); return; }
          if (k === 'e' || k === ' ' || k === 'enter') {
            if (performance.now() - this.dialogueOpenedAt < 140) return;
            e.preventDefault();
            if (this.isTyping && this.currentFinishTyping) {
              audioManager.playClick();
              this.currentFinishTyping();
            } else if (this.currentNextAction) {
              audioManager.playClick();
              this.currentNextAction.onClick();
            } else if (this.currentChoices.length === 0) {
              audioManager.playClick();
              this.closeAllModals();
            }
            return;
          }
          if (!this.isTyping && '1234'.includes(k)) {
            const idx = Number(k) - 1;
            if (this.currentChoices[idx]) {
              audioManager.playClick();
              this.currentChoices[idx].onSelect();
            }
            return;
          }
          return;
        }

        if (k === 'escape') {
          if (!this.el.setOverlay.classList.contains('hidden') || gameState.isUIOpen()) this.closeAllModals();
          else this.openSettings();
        } else if (k === 'j') {
          if (!this.el.journalOverlay.classList.contains('hidden')) this.closeAllModals();
          else if (!gameState.isUIOpen()) this.openJournal();
        } else if (k === 'm') {
          if (!this.el.mapOverlay.classList.contains('hidden')) this.closeAllModals();
          else if (!gameState.isUIOpen()) this.openWorldMap();
        } else if (k === 'i') {
          if (!this.el.invOverlay.classList.contains('hidden')) this.closeAllModals();
          else if (!gameState.isUIOpen()) this.openInventory();
        }
      });
    }

    refreshMainMenuButtons() { this.el.btnContinue.disabled = !gameState.hasSave(); }

    enterGameWorld(zone = 'village', spawn = null) {
      this.inMainMenu = false;
      this.closeAllModals();
      this.el.mainMenu.classList.add('hidden');
      this.el.hud.classList.remove('hidden');
      this.game.scene.stop('MainMenuScene');
      this.game.scene.start('WorldScene', { zone, spawn });
      this.refreshHUD();
    }

    returnToMainMenu() {
      this.closeAllModals();
      this.inMainMenu = true;
      this.el.hud.classList.add('hidden');
      this.el.mainMenu.classList.remove('hidden');
      this.game.scene.stop('WorldScene');
      this.game.scene.start('MainMenuScene');
      this.refreshMainMenuButtons();
    }

    onZoneEntered(zone) {
      this.refreshHUD();
      if (LOCATIONS[zone]) this.el.hudLoc.textContent = LOCATIONS[zone].name;
    }

    refreshHUD() {
      const s = gameState.state;
      this.el.hudGold.textContent = s.gold.toLocaleString();
      this.el.hudScVal.textContent = `${s.socialCredibility} / ${s.maxSocialCredibility}`;
      this.el.hudScFill.style.width = `${Math.min(100, (s.socialCredibility / s.maxSocialCredibility) * 100)}%`;
      this.el.hudQuest.textContent = gameState.getActiveObjectiveText();
      if (LOCATIONS[s.currentLocation]) this.el.hudLoc.textContent = LOCATIONS[s.currentLocation].name;
    }

    closeAllModals() {
      clearInterval(this.typewriterTimer);
      this.isTyping = false;
      this.currentFinishTyping = null;
      this.currentNextAction = null;
      this.currentChoices = [];
      if (this.el.bpShowcase) this.el.bpShowcase.classList.add('hidden');
      [
        this.el.dlgOverlay, this.el.qsOverlay, this.el.journalOverlay,
        this.el.mapOverlay, this.el.invOverlay, this.el.setOverlay, this.el.fbOverlay
      ].forEach((m) => m && m.classList.add('hidden'));
      gameState.setUIOpen(false);
    }

    toast(msg) {
      const div = document.createElement('div');
      div.className = 'toast-msg';
      div.textContent = msg;
      this.el.toastBox.appendChild(div);
      setTimeout(() => div.remove(), 3600);
    }

    // ---- DIALOGUE ENGINE WITH CHARACTER VOICES & E-SKIP ----
    showDialogue({ charKey, mood = 'Thoughtful', text, choices = [], nextAction = null, showBlueprint = false }) {
      this.closeAllModals();
      gameState.setUIOpen(true);
      this.dialogueOpenedAt = performance.now();
      this.el.dlgOverlay.classList.remove('hidden');

      if (showBlueprint && this.el.bpShowcase) {
        this.el.bpImg.src = BLUEPRINT_IMG_URL;
        this.el.bpShowcase.classList.remove('hidden');
      }

      const char = CHARACTERS[charKey] || { name: charKey, role: '', portrait: 'portrait_villager' };
      this.el.dlgSpeaker.textContent = char.name;
      this.el.dlgRole.textContent = char.role;
      this.el.dlgMood.textContent = mood;
      this.el.dlgPortrait.src = PORTRAITS[char.portrait] || PORTRAITS.portrait_villager;

      this.el.dlgChoices.innerHTML = '';
      this.el.dlgNext.classList.add('hidden');
      this.el.dlgNext.onclick = null;
      this.currentChoices = choices;
      this.currentNextAction = nextAction;

      clearInterval(this.typewriterTimer);
      const speedMap = { slow: 36, normal: 20, fast: 8, instant: 0 };
      const delay = speedMap[gameState.state.settings.textSpeed] ?? 20;
      const voiceCfg = char.voice || { freq: 410, type: 'triangle', jitter: 45, step: 3 };
      const voiceStep = voiceCfg.step || 3;

      const finishTyping = () => {
        clearInterval(this.typewriterTimer);
        this.isTyping = false;
        this.currentFinishTyping = null;
        this.el.dlgText.textContent = text;
        this.el.dlgChoices.innerHTML = '';

        if (choices.length > 0) {
          choices.forEach((ch, idx) => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.innerHTML = `
              <span class="choice-icon">${ch.icon}</span>
              <span class="choice-meta">
                <span class="choice-tag">[${idx + 1}] ${ch.tag}</span>
                <span class="choice-label">${ch.label}</span>
              </span>`;
            btn.onclick = () => { audioManager.playClick(); ch.onSelect(); };
            this.el.dlgChoices.appendChild(btn);
          });
        } else if (nextAction) {
          this.el.dlgNext.classList.remove('hidden');
          this.el.dlgNext.textContent = `${nextAction.label || 'Continue'} [E] ▶`;
          this.el.dlgNext.onclick = () => { audioManager.playClick(); nextAction.onClick(); };
        }
      };

      this.currentFinishTyping = finishTyping;

      if (delay === 0) {
        finishTyping();
      } else {
        this.isTyping = true;
        let i = 0;
        this.el.dlgText.textContent = '';
        this.typewriterTimer = setInterval(() => {
          i++;
          const ch = text[i - 1];
          this.el.dlgText.textContent = text.slice(0, i);
          if (ch && ch !== ' ' && ch !== '*' && i % voiceStep === 0) {
            audioManager.playVoice(voiceCfg);
          }
          if (i >= text.length) finishTyping();
        }, delay);
      }
    }

    openNpcChat(charKey, text) { this.showDialogue({ charKey, mood: 'Expressive', text }); }
    openSimpleNotice(title, text) {
      this.showDialogue({ charKey: 'villager_thomas', mood: 'Notice', text });
      this.el.dlgSpeaker.textContent = title;
      this.el.dlgRole.textContent = 'Vale Village';
    }

    // ---- EASTER EGG: SANS THE SKELETON ----
    startSansEasterEgg() {
      this.showDialogue({
        charKey: 'sans',
        mood: 'ironic',
        text: "heya kid, beautiful day isn't it?",
        choices: [
          {
            icon: '🌙',
            tag: 'POINT OUT THE OBVIOUS',
            label: "Uh... it's literally nighttime.",
            onSelect: () => {
              this.showDialogue({
                charKey: 'sans',
                mood: 'grinning',
                text: "heh. guess i lost track of time under this streetlight. lanterns are glowing, fireflies are floating... on nights like these, kids like you should be breaking a few unfair stereotypes instead of taking shortcuts."
              });
            }
          },
          {
            icon: '💀',
            tag: 'ASK ABOUT VALE',
            label: 'Wait—how did a skeleton get into a cozy village RPG?',
            onSelect: () => {
              this.showDialogue({
                charKey: 'sans',
                mood: 'lazy wink',
                text: "took a wrong turn at grillby's. figured i'd stay a while—this place has got a ton of heart. ...and a skeleton of potential. heh. alright kid, go help maya build that loom before i start telling bad puns."
              });
            }
          }
        ]
      });
    }

    // ---- ACT 1: MAYA'S SHADOW ----
    startMayaDialogue() {
      if (gameState.state.quests.mayas_shadow.stage === 'not_started') {
        gameState.setQuestStage('mayas_shadow', 'talked');
      }
      this.showDialogue({
        charKey: 'maya',
        mood: 'Guarded',
        text: '*Maya wipes a smudge of machine oil onto her apron and sighs.* "It\'s not that simple... I want to study engineering, not spend forty years hem-stitching coats. My parents—Arthur and Clara—expect me to inherit the tailor shop instead of my brother Leo. Every time I bring up the Academy, Dad looks like I\'ve asked him to burn the place down."',
        choices: [
          { icon: '❤️', tag: 'EMPATHY', label: 'You love them, and you still want your own life. Tell me what you build when no one is looking.', onSelect: () => this.mayaEmpathyBranch() },
          { icon: '⚖️', tag: 'SKEPTICISM', label: 'A forty-year family shop is real security. Maybe engineering is a luxury Vale can’t afford right now.', onSelect: () => this.mayaSkepticismBranch() },
          { icon: '🤝', tag: 'DIPLOMACY', label: 'Sometimes parents hear an outsider better than their own daughter. Let me sit down with Arthur and Clara.', onSelect: () => this.mayaDiplomacyBranch() },
          { icon: '📐', tag: 'ACTION / EVIDENCE', label: 'Dreams sound fragile—proof doesn’t. Let’s look at your mechanical blueprints and put them right on their counter.', onSelect: () => this.mayaEvidenceBranch() }
        ]
      });
    }

    mayaEmpathyBranch() {
      gameState.recordApproach('mayas_shadow', 'empathy');
      this.showDialogue({
        charKey: 'maya',
        mood: 'Opening Up',
        text: '*Her shoulders drop an inch, and a real spark flashes in her eyes.* "Nobody here ever asks what I build—only whether my seams are straight. After closing, I stay up repairing the shop’s old cast-iron sewing machine. I even drafted a spring-loaded tensioner so Mom’s wrists stop aching after long winters... And Leo actually *loves* tailoring! He just thinks Dad won’t trust him with the shears."',
        choices: [
          { icon: '🤝', tag: 'DIPLOMACY', label: 'Then this isn’t rebellion—it’s a better plan for everyone. Let’s step inside and inspect your workbench.', onSelect: () => this.mayaDiplomacyBranch() },
          { icon: '📐', tag: 'CHECK BLUEPRINTS', label: 'Show me that workbench inside—once I’ve seen your blueprint, we’ll bring it straight to Arthur and Clara.', onSelect: () => this.mayaEvidenceBranch() }
        ]
      });
    }

    mayaSkepticismBranch() {
      gameState.recordApproach('mayas_shadow', 'skepticism');
      gameState.state.restorativeNeeded = true;
      gameState.save();
      this.showDialogue({
        charKey: 'maya',
        mood: 'Stung & Defiant',
        text: '*Maya’s jaw tightens as she folds her arms.* "Funny—you sound just like the village elders. Tell me: why is it *my* duty to sacrifice my future when Leo is standing ten feet inside wishing someone would hand him tailor’s chalk? I don’t want to wreck my family’s livelihood. I just refuse to be invisible inside it."',
        choices: [
          {
            icon: '🙏', tag: 'OWN YOUR MISTAKE', label: 'You’re right—I jumped to assumptions without hearing the whole story. Start over with me?',
            onSelect: () => { gameState.state.restorativeNeeded = false; gameState.save(); this.mayaEmpathyBranch(); }
          },
          {
            icon: '🤝', tag: 'BUILD A REAL CASE', label: 'Fair hit. If Arthur needs hard proof instead of speeches, let’s check your workbench and make a case he can’t ignore.',
            onSelect: () => { gameState.state.restorativeNeeded = false; gameState.save(); this.mayaEvidenceBranch(); }
          }
        ]
      });
    }

    mayaDiplomacyBranch() {
      gameState.recordApproach('mayas_shadow', 'diplomacy');
      gameState.setQuestStage('mayas_shadow', 'family_meeting');
      this.showDialogue({
        charKey: 'maya',
        mood: 'Cautiously Hopeful',
        text: '*Maya glances toward the workshop door.* "I warn you—my father Arthur isn’t cruel, he’s terrified. If you walk up to him empty-handed, he’ll shut the ledger and wave you off. Step inside, inspect my blueprint on the right-hand workbench first, and then talk to Arthur and Clara!"',
        nextAction: {
          label: "Enter Maya's Workshop",
          onClick: () => {
            this.closeAllModals();
            this.game.scene.getScene('WorldScene').transitionTo('tailor_shop', { x: 240, y: 248 });
          }
        }
      });
    }

    mayaEvidenceBranch() {
      gameState.recordApproach('mayas_shadow', 'evidence');
      gameState.setQuestStage('mayas_shadow', 'family_meeting');
      this.showDialogue({
        charKey: 'maya',
        mood: 'Determined',
        text: '*Maya smiles for the first time all evening.* "Now you’re thinking like an engineer! My loom-tensioner blueprints are spread out on the right-hand workbench inside. Go look them over first—and chat with Leo if you get a moment—then bring them to Arthur and Clara!"',
        nextAction: {
          label: 'Enter Workshop & Inspect Workbench',
          onClick: () => {
            this.closeAllModals();
            this.game.scene.getScene('WorldScene').transitionTo('tailor_shop', { x: 240, y: 248 });
          }
        }
      });
    }

    pickupBlueprints() {
      if (gameState.collectBlueprints(REWARD_ITEMS.maya_blueprints)) {
        audioManager.playCoin();
        this.toast("📐 Blueprint Collected! Now speak with Maya's Parents (Arthur & Clara).");
      }
      this.inspectWorkbenchBlueprints();
    }

    inspectWorkbenchBlueprints() {
      this.showDialogue({
        charKey: 'maya',
        mood: 'Blueprint Examined',
        showBlueprint: true,
        text: '*You unroll crisp indigo vellum covered in precision gear ratios and neat margin notes:* "Prototype IV — self-tensioning loom governor. Reduces hand-crank torque by 60% so Mother’s wrists stop swelling in winter." This isn’t a daydream—it’s real engineering built out of love for her family.',
        nextAction: {
          label: gameState.state.quests.mayas_shadow.completed ? 'Close Blueprint' : "Got it — Talk to Maya's Parents",
          onClick: () => this.closeAllModals()
        }
      });
    }

    startLeoDialogue() {
      if (gameState.state.quests.mayas_shadow.completed) {
        this.showDialogue({
          charKey: 'leo',
          mood: 'Beaming',
          text: '*Leo holds up a freshly chalked wool sleeve, grinning ear to ear.* "Dad actually let me cut the collar pattern today—first try, zero wasted cloth! Once you and Maya finish building that Prototype IV loom tensioner, our shop will double its winter orders."'
        });
        return;
      }

      gameState.markHeardLeo();
      this.showDialogue({
        charKey: 'leo',
        mood: 'Confiding',
        text: '*Leo glances at Arthur, then lowers his voice.* "Everyone thinks I’m clumsy with a needle because I panic when Dad watches over my shoulder. Look at that terracotta dress on the mannequin—I stitched that hem myself after closing! I *want* to run this shop someday. Nobody ever asked me because they already decided the eldest daughter had to do it."',
        nextAction: {
          label: 'Promise to Speak Up for Him',
          onClick: () => {
            this.toast('🧵 Insight Gained: Leo wants to inherit the tailor shop!');
            this.closeAllModals();
          }
        }
      });
    }

    startParentsDialogue() {
      if (gameState.state.quests.mayas_shadow.completed) {
        this.showDialogue({
          charKey: 'arthur',
          mood: 'Warm & Proud',
          text: gameState.state.quests.mayas_loom.completed
            ? '*Arthur beams as Clara smoothly turns the upgraded loom crank.* "Look at that—barely a flick of the wrist! The Highland Council will be fools if they don’t listen to you and Maya."'
            : '*Arthur adjusts his spectacles and chuckles.* "Forty years behind this counter, and it took a stranger to make me listen to my own roof. If you’re helping Maya actually build that Prototype IV tensioner at her bench, Barnaby at the Marketplace carries brass Mechanical Components!"'
        });
        return;
      }

      if (!gameState.state.hasBlueprints) {
        this.toast("📐 Inspect Maya's Workbench on the right first!");
        this.showDialogue({
          charKey: 'arthur',
          mood: 'Skeptical',
          text: '*Arthur doesn’t even look up from his ledger.* "Before you waste my evening lecturing me about Maya’s \'engineering talent\', traveler, walk over to her cluttered workbench on the right and actually look at what she’s been hiding there. Don’t come preaching to me without proof."'
        });
        return;
      }

      const heardLeo = gameState.state.heardLeo;
      this.showDialogue({
        charKey: 'arthur',
        mood: 'Defensive',
        text: '*Arthur sets his tailor’s chalk down hard on the counter while Clara watches nervously beside him.* "All right, traveler—you’ve seen her workbench, so say your piece. Ten winters ago this shop barely survived frostbite and debt. Maya has steady hands; engineering is a gamble for guild-kids—not a tailor’s daughter."',
        choices: [
          { icon: '📐', tag: 'PRESENT BLUEPRINT', label: 'Unroll Prototype IV right here on the counter—she engineered it to save Clara’s aching wrists.', onSelect: () => this.parentsStageTwo('evidence') },
          {
            icon: '🧵', tag: heardLeo ? "LEO'S CONFESSION" : 'ASK ABOUT LEO',
            label: heardLeo ? 'Ask Leo who stitched that terracotta dress on the mannequin—he wants this shop more than anyone.' : 'Why force Maya when you have a son right here who could take over?',
            onSelect: () => (heardLeo ? this.parentsStageTwo('leo') : this.parentsPushback('unprepared_leo'))
          },
          { icon: '🔥', tag: 'CONFRONT BIAS', label: 'Admit it, Arthur—if Maya were your son, you’d have walked her to the Academy gates yourself.', onSelect: () => this.parentsPushback('too_harsh') }
        ]
      });
    }

    parentsPushback(reason) {
      if (reason === 'unprepared_leo') {
        this.showDialogue({
          charKey: 'clara',
          mood: 'Hesitant',
          text: '*Clara glances worriedly at Leo, who shrinks back toward the wall.* "Leo always drops his thimble when Arthur watches him... We never thought he even cared for cloth. Have you actually spoken to him, or are you guessing?"',
          choices: [
            { icon: '💬', tag: 'TALK TO LEO FIRST', label: 'Let me speak with Leo privately first—you’re about to be surprised.', onSelect: () => this.closeAllModals() },
            { icon: '📐', tag: 'SHOW BLUEPRINT INSTEAD', label: 'Before Leo speaks, look at what Maya drew on her workbench.', onSelect: () => this.parentsStageTwo('evidence') }
          ]
        });
      } else {
        this.showDialogue({
          charKey: 'clara',
          mood: 'Hurt & Firm',
          text: '*Clara steps beside Arthur, her voice quiet but sharp.* "Watch your tone, traveler. Arthur worked his knuckles raw so both our children could eat—not out of spite, out of fear! Scolding us won’t help Maya. Show us what you found on her bench and help us see a real way forward."',
          choices: [
            { icon: '📐', tag: 'APOLOGIZE & SHOW PROOF', label: 'I crossed a line. You’ve carried a heavy load—please, just look at Maya’s blueprint.', onSelect: () => this.parentsStageTwo('evidence') }
          ]
        });
      }
    }

    parentsStageTwo(angle) {
      const showBp = angle === 'evidence';
      const opening =
        angle === 'evidence'
          ? '*You spread Maya’s indigo blueprint flat across the oak counter. Arthur leans in, his fingers tracing the gear ratios—then freezes at her margin note about Clara’s wrists. Silence fills the workshop.*'
          : angle === 'leo'
          ? '*Leo steps forward, cheeks flushed, lifting the hem of the terracotta dress.* "I stitched that after closing, Dad. I love fabrics—I was just scared of disappointing you." *Clara’s hand flies to her mouth.*'
          : '*Clara exhales softly and lays a hand over Arthur’s wrist.* "Maybe we’ve been so afraid of losing the past that we stopped listening to our own children..."';

      this.showDialogue({
        charKey: 'clara',
        mood: 'Torn but Listening',
        showBlueprint: showBp,
        text: `${opening}\n\n"Still..." *Clara’s voice trembles.* "If Maya goes off to the Innovation Guild, who keeps the shop steady while Leo is still learning? Tradition isn’t our enemy—we just need a plan that doesn’t leave anyone stranded."`,
        choices: [
          { icon: '⚖️', tag: 'HALF-MEASURE', label: 'Tell Maya to work the shop six days a week and only tinker with gears on Sundays.', onSelect: () => this.parentsRejectCompromise() },
          { icon: '🤝', tag: 'SHARED FUTURE', label: 'Maya installs her loom-tensioner to lighten your workload, teaches Leo her best patterns, and applies to the Academy with your blessing.', onSelect: () => this.parentsBreakthrough() }
        ]
      });
    }

    parentsRejectCompromise() {
      this.showDialogue({
        charKey: 'maya',
        mood: 'Firm',
        text: '*Maya shakes her head softly, eyes glistening—and surprisingly, Clara nods with her.* "A Sunday hobby isn’t an education, traveler. The Academy exams take real study." *Clara adds gently:* "If we’re going to change, let’s not do it halfway."',
        nextAction: { label: 'Propose a Real Solution', onClick: () => this.parentsStageTwo('evidence') }
      });
    }

    parentsBreakthrough() {
      this.showDialogue({
        charKey: 'arthur',
        mood: 'Moved & Proud',
        showBlueprint: true,
        text: '*For a long moment, Arthur says nothing. Then he rolls Maya’s blueprint carefully and ties it with a ribbon of his finest scarlet silk.* "A self-tensioning loom... designed for your mother’s hands. Forgive an old tailor for being blind, Maya. Send your application to the Innovation Guild—we’ll back every brass gear of it. And Leo... grab a piece of chalk. Tomorrow, you stand at the main counter beside me."',
        nextAction: {
          label: 'Celebrate with the Family ✨',
          onClick: () => {
            this.closeAllModals();
            this.game.scene.getScene('WorldScene').transitionTo('tailor_shop', { x: 240, y: 238 }, true);
          }
        }
      });
    }

    // ---- ACT 2: MAYA'S DEEPER STORY + BUILD TOOL QUEST (PROTOTYPE IV LOOM) ----
    startMayaPostQuestDialogue() {
      if (gameState.state.quests.highland_hearing.completed) {
        this.showDialogue({
          charKey: 'maya_happy',
          mood: 'Triumphant',
          text: '*Maya taps her brass wrench emblem against the signed Equal-Access Charter.* "We went from hiding sketches under bolts of cloth to rewriting valley law. Thank you for walking every step of this road with me, traveler!"'
        });
        return;
      }

      if (gameState.state.quests.mayas_loom.completed) {
        this.showDialogue({
          charKey: 'maya_happy',
          mood: 'Determined',
          text: '*Maya holds the gleaming Prototype IV Loom Governor.* "Prototype IV works like silk! Now that your Social Credibility has reached 50, the northern gate to the Highland Council is open. Let’s meet up there—or fast-travel on the Map [M]—and challenge those outdated guild bylaws!"'
        });
        return;
      }

      const comp = gameState.getItemQty('mechanical_components');
      this.showDialogue({
        charKey: 'maya_happy',
        mood: 'Excited & Focused',
        showBlueprint: true,
        text: `*Maya grins, unrolling her blueprint under the lantern.* "Guildmaster Elena loved my paper application, but the Highland Council still blocks women from funded engineering fellowships unless we bring a working machine! If we gather 3 Mechanical Components (you have ${comp}/3—try unpacking the Parts Chest in your Bag [I] and buying the rest at Barnaby's 15%-off Marketplace), we can build Prototype IV right at my Workbench inside!"`,
        nextAction: {
          label: comp >= 3 ? "Head to Maya's Workbench" : 'Open Bag [I] / Check Marketplace',
          onClick: () => {
            this.closeAllModals();
            if (comp >= 3 && gameState.state.currentLocation !== 'tailor_shop') {
              this.game.scene.getScene('WorldScene').transitionTo('tailor_shop', { x: 320, y: 224 });
            }
          }
        }
      });
    }

    startElenaDialogue() {
      const loomDone = gameState.state.quests.mayas_loom.completed;
      const hearingDone = gameState.state.quests.highland_hearing.completed;
      if (hearingDone) {
        this.showDialogue({
          charKey: 'elena',
          mood: 'Inspired',
          text: '"With the Vale Equal-Access Charter passed, twelve young girls and boys signed up for open robotics and tailoring-automation classes this very evening. Real change starts when talent meets policy."'
        });
      } else if (loomDone) {
        this.showDialogue({
          charKey: 'elena',
          mood: 'Impressed',
          showBlueprint: true,
          text: '*Elena inspects your assembled Prototype IV Loom Governor with a jeweler’s loupe.* "Flawless 3:1 reduction and a brass finger guard! Take this straight up the northern road to the Highland Council—Councilor Minh won’t be able to call STEM inequality a \'tradition\' once he sees this spin."'
        });
      } else {
        this.showDialogue({
          charKey: 'elena',
          mood: 'Encouraging',
          text: '"Welcome to the Innovation Guild! Maya’s blueprints are brilliant, but our scholarship board answers to the Highland Council. Help Maya assemble Prototype IV at her workshop bench—unpack your Parts Chest [I] and pick up extra Mechanical Components from Barnaby at the Marketplace!"'
        });
      }
    }

    startBuildToolQuest() {
      const comp = gameState.getItemQty('mechanical_components');
      if (comp < 3) {
        this.showDialogue({
          charKey: 'maya_happy',
          mood: 'Ready to Build',
          showBlueprint: true,
          text: `*Maya sets out her brass pliers.* "We need 3 Mechanical Components to build Prototype IV (you currently have ${comp}/3).\n\nTip: Open your Inventory [I] and click USE on the Mechanical Parts Chest for 2 free components, then grab 1 more at Barnaby's Marketplace with your 15% discount!"`
        });
        return;
      }

      this.buildStageOne();
    }

    buildStageOne() {
      this.showDialogue({
        charKey: 'maya_happy',
        mood: 'Build Step 1/3',
        showBlueprint: true,
        text: '*Clink! You lay out 3 sets of brass gears on the oak workbench.* "Step 1: Drive Gear Ratio! We need to cut the force on Mom’s wrists by 60% without making the loom crawl like a snail. Which gear ratio should we mount?"',
        choices: [
          { icon: '⚙️', tag: '1:1 DIRECT DRIVE', label: 'Keep a 1:1 ratio for maximum speed.', onSelect: () => this.buildRetry('1:1 spins fast, but it gives zero mechanical advantage—Clara’s wrists would still ache in winter! Try another ratio.', () => this.buildStageOne()) },
          { icon: '✅', tag: '3:1 GEAR REDUCTION', label: 'Mount a 3:1 brass reduction train for smooth 60% torque relief.', onSelect: () => { audioManager.playBuildClink(); this.buildStageTwo(); } },
          { icon: '🐢', tag: '12:1 HEAVY WINCH', label: 'Install a massive 12:1 crane gear.', onSelect: () => this.buildRetry('12:1 could lift a horse cart, haha—way too slow for stitching winter coats! Let’s balance speed and ease.', () => this.buildStageOne()) }
        ]
      });
    }

    buildStageTwo() {
      this.showDialogue({
        charKey: 'maya_happy',
        mood: 'Build Step 2/3',
        showBlueprint: true,
        text: '*The 3:1 gear train meshes cleanly!* "Step 2: Thread Tension Arm! If the spring snaps mid-seam, it ruins a whole bolt of wool. What tension coil should we fit?"',
        choices: [
          { icon: '🪢', tag: 'HEMP TWINE', label: 'Tie it tight with heavy twine to save brass.', onSelect: () => this.buildRetry('Twine stretches out after twenty turns—it won’t hold steady tension! Let’s use proper spring metal.', () => this.buildStageTwo()) },
          { icon: '✅', tag: 'TEMPERED WATCH-SPRING', label: 'Install a tempered spiral watch-spring with adjustable stop.', onSelect: () => { audioManager.playBuildClink(); this.buildStageThree(); } },
          { icon: '🔩', tag: 'RIGID IRON BAR', label: 'Weld it completely rigid so it never moves.', onSelect: () => this.buildRetry('If the arm can’t flex at all, thick winter wool will snap the needle! It needs calibrated elasticity.', () => this.buildStageTwo()) }
        ]
      });
    }

    buildStageThree() {
      this.showDialogue({
        charKey: 'maya_happy',
        mood: 'Build Step 3/3',
        showBlueprint: true,
        text: '*The spring arm clicks smoothly into place!* "Final Step: Workshop Safety! Leo is still learning the machine, and loose sleeves near open gears are dangerous. How do we finish Prototype IV?"',
        choices: [
          { icon: '⚡', tag: 'LEAVE GEARS EXPOSED', label: 'Skip the casing so everyone can admire the spinning brass.', onSelect: () => this.buildRetry('Exposed teeth look flashy, but good engineering puts the human operator’s safety first! Let’s shield it.', () => this.buildStageThree()) },
          {
            icon: '🛠️', tag: 'BRASS GUARD & RELEASE LEVER', label: 'Bolt on a hinged brass finger-guard and quick-stop lever.',
            onSelect: () => {
              audioManager.playFanfare();
              gameState.consumeItem('mechanical_components', 3);
              this.openQuestSuccess('mayas_loom');
            }
          }
        ]
      });
    }

    buildRetry(msg, retryFn) {
      this.showDialogue({
        charKey: 'maya_happy',
        mood: 'Recalibrating',
        showBlueprint: true,
        text: `*Maya inspects the assembly and grins encouragingly.* "${msg}"`,
        nextAction: { label: 'Adjust Assembly', onClick: retryFn }
      });
    }

    // ---- ACT 3: HIGHLAND COUNCIL POLICY HEARING ----
    startHighlandHearing() {
      if (gameState.state.quests.highland_hearing.completed) {
        this.showDialogue({
          charKey: 'councilor_linh',
          mood: 'Respectful',
          text: '*Councilor Minh bows warmly beneath the Council streetlights.* "The Vale Equal-Access Charter is already bearing fruit. Changing one mind starts a spark; changing a bylaw lights the whole valley."'
        });
        return;
      }

      const hasLoom = gameState.getItemQty('prototype_loom') > 0 || gameState.state.loomBuilt;
      this.showDialogue({
        charKey: 'councilor_linh',
        mood: 'Formal & Skeptical',
        text: '*Councilor Minh taps his gavel on the marble podium.* "You have earned 50 Social Credibility in Vale, traveler—rare for an outsider. Yet you ask this Council to overturn thirty years of guild bylaws reserving engineering stipends for \'traditional male household heirs.\' Why rewrite institutional law over one talented tailor’s daughter?"',
        choices: [
          {
            icon: '🛠️', tag: hasLoom ? 'DEMONSTRATE PROTOTYPE IV' : 'CITE MAYA’S BLUEPRINT',
            label: hasLoom
              ? 'Place Prototype IV on the podium—Maya isn’t an exception; she’s proof of what bias hides.'
              : 'Show Maya’s blueprints—talent shouldn’t be filtered by gender.',
            onSelect: () => this.highlandStageTwo(hasLoom)
          },
          {
            icon: '📉', tag: 'ECONOMIC ARGUMENT',
            label: 'Excluding half of Vale’s youth from STEM starves our entire valley’s productivity and innovation.',
            onSelect: () => this.highlandStageTwo(hasLoom)
          },
          {
            icon: '🤷', tag: 'OVERSIMPLIFY',
            label: 'Just tell families to be nicer—we don’t really need written policy changes.',
            onSelect: () => {
              this.showDialogue({
                charKey: 'elena',
                mood: 'Sharp',
                text: '*Guildmaster Elena leans in quietly.* "Careful, traveler! Individual kindness helped Maya’s household, yes—but without changing the Council’s scholarship bylaws, the next girl without an advocate will hit the exact same wall."',
                nextAction: { label: 'Reframe Your Argument', onClick: () => this.startHighlandHearing() }
              });
            }
          }
        ]
      });
    }

    highlandStageTwo(hasLoom) {
      const demoLine = hasLoom
        ? '*You set Prototype IV onto the Council desk. Maya turns the brass crank effortlessly with two fingers—the gears whisper smoothly as Councilor Minh’s eyebrows shoot up.*'
        : '*Councilor Minh studies the blueprints and Guildmaster Elena’s assessment, slowly nodding.*';

      this.showDialogue({
        charKey: 'councilor_linh',
        mood: 'Thoughtful',
        showBlueprint: true,
        text: `${demoLine}\n\n"Impressive... Yet families worry that opening STEM stipends to daughters will leave traditional trades understaffed. What charter do you propose this Council ratify?"`,
        choices: [
          {
            icon: '📜', tag: 'EQUAL-ACCESS CHARTER',
            label: 'Merit-based open admissions for ALL genders in both Engineering AND traditional trades—plus family mentorship grants.',
            onSelect: () => this.highlandResolution()
          },
          {
            icon: '🔒', tag: 'SPECIAL EXCEPTION ONLY',
            label: 'Grant a single one-time exception for Maya, and leave the old rules intact.',
            onSelect: () => {
              this.showDialogue({
                charKey: 'maya_happy',
                mood: 'Passionate',
                text: '*Maya steps forward firmly.* "No! If I walk through that Academy door and let it slam shut behind me, nothing truly changed for Lily or any other kid in Vale. Make the door open for everyone!"',
                nextAction: { label: 'Propose Systemic Reform', onClick: () => this.highlandStageTwo(hasLoom) }
              });
            }
          }
        ]
      });
    }

    highlandResolution() {
      this.showDialogue({
        charKey: 'councilor_linh',
        mood: 'Convinced',
        text: '*Councilor Minh stamps the red wax seal onto crisp parchment.* "Well argued, traveler. Open merit apprenticeships for every trade and STEM field—and support so sons like Leo and daughters like Maya alike can choose their own craft without fear. By decree of the Highland Council, the Vale Equal-Access Charter is law!"',
        nextAction: {
          label: 'Accept the Charter & Celebrate ✨',
          onClick: () => this.openQuestSuccess('highland_hearing')
        }
      });
    }

    // ---- QUEST SUCCESS MODAL (SUPPORTS ALL 3 ACTS) ----
    openQuestSuccess(questId = 'mayas_shadow') {
      this.closeAllModals();
      gameState.setUIOpen(true);
      audioManager.playFanfare();
      this.pendingQuestReward = questId;
      this.el.qsOverlay.classList.remove('hidden');

      const q = QUESTS[questId] || QUESTS.mayas_shadow;
      this.el.qsTitle.textContent = q.successTitle;
      this.el.qsDesc.textContent = q.successDescription;

      let current = 0;
      this.el.qsScAnim.textContent = '+0 SOCIAL CREDIBILITY';
      const counter = setInterval(() => {
        current++;
        this.el.qsScAnim.textContent = `+${current} SOCIAL CREDIBILITY`;
        if (current >= q.rewardSC) clearInterval(counter);
      }, 45);

      const unlockNote = this.el.qsOverlay.querySelector('.qs-unlock-note');
      if (questId === 'mayas_shadow') {
        this.el.qsRewards.innerHTML = `
          <div class="reward-card"><span class="r-icon">🌿</span><strong>10x Social Credibility</strong></div>
          <div class="reward-card"><span class="r-icon">🔧</span><strong>1x Detailed Wrench Emblem</strong></div>
          <div class="reward-card"><span class="r-icon">🧰</span><strong>1x Mechanical Parts Chest</strong></div>`;
        if (unlockNote) unlockNote.innerHTML = '🔓 Unlocked: <strong>Innovation Guild</strong> • 🏷️ <strong>15% Discount</strong> • 🛠️ <strong>Act 2: Build Prototype IV!</strong>';
      } else if (questId === 'mayas_loom') {
        this.el.qsRewards.innerHTML = `
          <div class="reward-card"><span class="r-icon">🌿</span><strong>20x Social Credibility</strong></div>
          <div class="reward-card"><span class="r-icon">🛠️</span><strong>1x Prototype IV Loom</strong></div>
          <div class="reward-card"><span class="r-icon">🏛️</span><strong>Highland Council Unlocked!</strong></div>`;
        if (unlockNote) unlockNote.innerHTML = '🔓 <strong>Highland Council (50 SC) NOW OPEN!</strong> Head North from Vale Square or open World Map [M].';
      } else {
        this.el.qsRewards.innerHTML = `
          <div class="reward-card"><span class="r-icon">🌿</span><strong>25x Social Credibility</strong></div>
          <div class="reward-card"><span class="r-icon">📜</span><strong>Vale Equal-Access Charter</strong></div>
          <div class="reward-card"><span class="r-icon">📖</span><strong>Full Reflection Complete</strong></div>`;
        if (unlockNote) unlockNote.innerHTML = '🌟 <strong>Systemic Equity Achieved!</strong> Try <strong>Private Replay</strong> in your Journal [J] or share ideas in Settings!';
      }
    }

    // ---- REFLECTION JOURNAL + PRIVATE REPLAY SANDBOX ----
    openJournal() {
      this.closeAllModals();
      gameState.setUIOpen(true);
      this.el.journalOverlay.classList.remove('hidden');

      const entries = gameState.state.journalEntries;
      this.el.journalTabs.innerHTML = '';

      if (entries.length === 0) {
        this.el.journalLeft.innerHTML = `
          <div class="journal-heading">NO COMPLETED REFLECTIONS YET</div>
          <p style="font-size:20px;line-height:1.3;">Explore Vale under the lanterns, listen to both sides of every story, and help residents bridge their divides. Each completed chapter leaves an echo in these pages.</p>`;
        this.el.journalRight.innerHTML = `
          <div class="journal-heading">ACTIVE LEAD</div>
          <p style="font-size:20px;line-height:1.3;">Maya outside Maya's Tailor &amp; Workshop looks weighed down. Speak with her to begin <strong>Maya's Shadow</strong>.</p>`;
        return;
      }

      const renderEntry = (id) => {
        const data = JOURNAL_ENTRIES[id];
        const artSrc = id === 'highland_hearing' ? PORTRAITS.portrait_councilor : PORTRAITS.portrait_maya_happy;
        this.el.journalLeft.innerHTML = `
          <div class="journal-art-box"><img src="${artSrc}" alt="Reflection illustration" /></div>
          <div class="journal-heading">${data.questTitle}</div>
          <div class="outcome-box">${data.outcome}</div>`;
        this.el.journalRight.innerHTML = `
          <div class="journal-heading">${data.reflectionTitle}</div>
          <p class="reflection-quote">"${data.reflectionText}"</p>
          <div class="lesson-badge">${data.lesson}</div>
          <div class="journal-actions-row">
            <button id="btn-private-replay" class="wood-btn sm-btn">🔄 Private Replay Sandbox</button>
            <button id="btn-journal-feedback" class="wood-btn sm-btn">💬 Story Feedback</button>
          </div>`;

        document.getElementById('btn-private-replay').onclick = () => {
          audioManager.playClick();
          this.startPrivateReplaySandbox();
        };
        document.getElementById('btn-journal-feedback').onclick = () => {
          audioManager.playClick();
          this.openFeedbackTool();
        };
      };

      entries.forEach((id, idx) => {
        if (!JOURNAL_ENTRIES[id]) return;
        const btn = document.createElement('button');
        btn.className = `journal-tab ${idx === 0 ? 'active' : ''}`;
        btn.textContent = JOURNAL_ENTRIES[id].tabTitle;
        btn.onclick = () => {
          audioManager.playClick();
          this.el.journalTabs.querySelectorAll('.journal-tab').forEach((b) => b.classList.remove('active'));
          btn.classList.add('active');
          renderEntry(id);
        };
        this.el.journalTabs.appendChild(btn);
      });
      renderEntry(entries[0]);
    }

    // Safe-to-Fail Private Replay Sandbox (from Innovation doc: test alternative/biased choices safely!)
    startPrivateReplaySandbox() {
      this.showDialogue({
        charKey: 'maya',
        mood: 'Private Replay',
        text: '[SAFE SANDBOX REPLAY — Your real save & reputation are protected.]\n\nExplore what happens when someone repeats subtle, everyday gender stereotypes to Maya:',
        choices: [
          {
            icon: '🗣️', tag: 'TEST SUBTLE BIAS', label: '"Engineering is mostly for boys, Maya—you’re already great at sewing, why make life harder?"',
            onSelect: () => {
              const unlocked = gameState.unlockJournalEntry('mayas_shadow_restorative');
              this.showDialogue({
                charKey: 'maya',
                mood: 'Withdrawn (Impact)',
                text: '*Maya slowly folds her blueprint and slides it back under the cloth.* "Yeah... maybe you’re right. Maybe I was just being foolish."\n\n[SANDBOX INSIGHT: Even polite, well-meaning advice can quietly reinforce self-doubt and shut down STEM ambition. Notice how accountability & restorative listening reopen the door.]',
                nextAction: {
                  label: unlocked ? 'Unlock "Mending Trust" Entry & Return' : 'Return to Reflection Journal',
                  onClick: () => {
                    if (unlocked) this.toast('📖 New Sandbox Entry Unlocked: Mending Trust!');
                    this.openJournal();
                  }
                }
              });
            }
          },
          {
            icon: '🤝', tag: 'TEST RESTORATIVE REPAIR', label: '"Wait—I realized how dismissive that sounded. Let me help mend things and listen properly."',
            onSelect: () => {
              gameState.unlockJournalEntry('mayas_shadow_restorative');
              this.showDialogue({
                charKey: 'maya_happy',
                mood: 'Reassured',
                text: '*Maya exhales and pulls her blueprint back out.* "Thank you for catching yourself. Nobody gets every conversation right on the first try—what matters is being willing to listen and repair trust."',
                nextAction: { label: 'Return to Reflection Journal', onClick: () => this.openJournal() }
              });
            }
          }
        ]
      });
    }

    // ---- COMMUNITY FEEDBACK TOOL ----
    openFeedbackTool() {
      this.closeAllModals();
      gameState.setUIOpen(true);
      this.el.fbOverlay.classList.remove('hidden');
      const hist = document.getElementById('fb-history');
      const list = gameState.state.feedbackSubmissions || [];
      hist.innerHTML = list.length
        ? list.map((f) => `<div>★${f.rating} <strong>[${f.category}]</strong> (${f.date}): ${f.note}</div>`).join('')
        : '<em>No submissions yet. Your notes help refine Vale’s stories!</em>';
    }

    // ---- WORLD MAP (INCLUDING PLAYABLE HIGHLAND COUNCIL!) ----
    openWorldMap() {
      this.closeAllModals();
      gameState.setUIOpen(true);
      this.el.mapOverlay.classList.remove('hidden');

      const s = gameState.state;
      const unlockedGuild = s.unlockedLocations.innovation_guild;
      const unlockedCouncil = s.unlockedLocations.highland_council;
      this.el.mapTitle.textContent = unlockedCouncil
        ? 'WORLD MAP: HIGHLAND COUNCIL UNLOCKED!'
        : unlockedGuild
        ? 'WORLD MAP: NEW REGION UNLOCKED!'
        : 'WORLD MAP: VALE REGION';

      this.drawWorldMapCanvas(unlockedGuild, unlockedCouncil);
      this.el.mapPins.innerHTML = '';

      Object.values(LOCATIONS).forEach((loc) => {
        const isUnlocked = Boolean(s.unlockedLocations[loc.id]);
        const isPlayerHere = s.currentLocation === loc.id;
        const isNew = s.newlyUnlockedLocation === loc.id && isUnlocked;
        const hasQuest =
          (loc.id === 'village' && !s.quests.mayas_shadow.completed) ||
          (loc.id === 'tailor_shop' && s.quests.mayas_shadow.completed && !s.quests.mayas_loom.completed) ||
          (loc.id === 'highland_council' && isUnlocked && !s.quests.highland_hearing.completed);

        let statusText = 'UNLOCKED';
        if (!isUnlocked) statusText = loc.requiredSC > 0 ? `LOCKED (${loc.requiredSC} SC)` : 'LOCKED';
        else if (loc.id === 'marketplace' && s.marketplaceDiscountActive) statusText = '15% DISCOUNT ACTIVE';
        else if (isNew) statusText = 'NEWLY UNLOCKED!';

        const pin = document.createElement('button');
        pin.className = `map-pin ${!isUnlocked ? 'locked' : ''} ${isNew ? 'newly-unlocked' : ''}`;
        pin.style.left = `${loc.mapPos.x}%`;
        pin.style.top = `${loc.mapPos.y}%`;
        const prefix = isPlayerHere ? '🌿 ' : !isUnlocked ? '🔒 ' : hasQuest ? '❗ ' : '🏛️ ';
        pin.innerHTML = `<div class="map-pin-name">${prefix}${loc.shortName}</div><div class="map-pin-badge">${statusText}</div>`;

        const inspect = () => {
          this.el.mapPins.querySelectorAll('.map-pin').forEach((p) => p.classList.remove('selected'));
          pin.classList.add('selected');
          this.el.mapLocName.textContent = loc.name;
          this.el.mapLocStatus.textContent = !isUnlocked && loc.requiredSC > 0 ? `REQUIRES ${loc.requiredSC} SOCIAL CREDIBILITY` : statusText;
          this.el.mapLocStatus.className = `status-pill ${!isUnlocked ? 'locked' : ''}`;
          this.el.mapLocDesc.textContent = !isUnlocked && loc.requiredSC > 0
            ? `${loc.description} (Current Social Credibility: ${s.socialCredibility} / ${loc.requiredSC})`
            : loc.description;

          if (isUnlocked) {
            this.selectedMapLoc = loc.id;
            this.el.btnMapTravel.classList.remove('hidden');
            this.el.btnMapTravel.textContent = isPlayerHere ? 'YOU ARE HERE' : `TRAVEL TO ${loc.shortName.toUpperCase()}`;
            this.el.btnMapTravel.disabled = isPlayerHere;
          } else {
            this.selectedMapLoc = null;
            this.el.btnMapTravel.classList.add('hidden');
          }
        };

        pin.onmouseenter = inspect;
        pin.onclick = () => { audioManager.playClick(); inspect(); };
        this.el.mapPins.appendChild(pin);
        if (isPlayerHere) inspect();
      });
    }

    drawWorldMapCanvas(guildUnlocked, councilUnlocked) {
      const ctx = this.el.mapCanvas.getContext('2d');
      ctx.imageSmoothingEnabled = false;
      const W = 600, H = 320;
      ctx.fillStyle = '#c4b183'; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#89a86b'; ctx.fillRect(22, 22, W - 44, H - 44);

      ctx.fillStyle = '#6c6878';
      for (let x = 80; x < 520; x += 64) {
        ctx.beginPath(); ctx.moveTo(x, 96); ctx.lineTo(x + 36, 36); ctx.lineTo(x + 72, 96); ctx.fill();
      }

      ctx.strokeStyle = '#5da9c9'; ctx.lineWidth = 10;
      ctx.beginPath(); ctx.moveTo(20, 250); ctx.quadraticCurveTo(220, 210, 340, 275); ctx.quadraticCurveTo(460, 310, 585, 220); ctx.stroke();

      ctx.strokeStyle = '#b59461'; ctx.lineWidth = 6;
      ctx.beginPath(); ctx.moveTo(144, 122); ctx.lineTo(252, 179); ctx.lineTo(384, 211); ctx.stroke();

      if (guildUnlocked) {
        ctx.strokeStyle = '#ffd700'; ctx.lineWidth = 6;
        ctx.beginPath(); ctx.moveTo(252, 179); ctx.lineTo(456, 109); ctx.stroke();
        ctx.fillStyle = 'rgba(255, 215, 0, 0.28)';
        ctx.beginPath(); ctx.arc(456, 109, 44, 0, Math.PI * 2); ctx.fill();
      }

      if (councilUnlocked) {
        ctx.strokeStyle = '#7cffb2'; ctx.lineWidth = 6;
        ctx.beginPath(); ctx.moveTo(252, 179); ctx.lineTo(300, 54); ctx.stroke();
        ctx.fillStyle = 'rgba(124, 255, 178, 0.25)';
        ctx.beginPath(); ctx.arc(300, 54, 42, 0, Math.PI * 2); ctx.fill();
      } else {
        ctx.fillStyle = 'rgba(230, 232, 240, 0.68)';
        ctx.beginPath();
        ctx.arc(270, 56, 30, 0, Math.PI * 2);
        ctx.arc(305, 52, 34, 0, Math.PI * 2);
        ctx.arc(340, 58, 28, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // ---- USABLE INVENTORY ITEMS! ----
    useInventoryItem(item) {
      audioManager.playClick();
      const useType = item.useType;

      if (useType === 'open_parts_chest' || item.id === 'mechanical_chest') {
        if (gameState.consumeItem('mechanical_chest', 1)) {
          const compData = MARKET_ITEMS.find((m) => m.id === 'mechanical_components');
          gameState.addItem(compData, 2);
          audioManager.playCoin();
          this.toast('🧰 Unpacked Mechanical Parts Chest → +2 Mechanical Components!');
          this.openInventory();
        }
        return;
      }

      if (useType === 'view_blueprint' || item.id === 'maya_blueprints') {
        this.inspectWorkbenchBlueprints();
        return;
      }

      if (useType === 'build_loom' || item.id === 'mechanical_components') {
        const qty = gameState.getItemQty('mechanical_components');
        if (gameState.state.quests.mayas_loom.completed) {
          this.toast('🛠️ Prototype IV is already built! Keep extra gears for future inventions.');
          return;
        }
        if (qty < 3) {
          this.toast(`⚙️ Need 3 Mechanical Components (${qty}/3). Buy more at Barnaby's Marketplace!`);
        } else if (gameState.state.currentLocation === 'tailor_shop') {
          this.startBuildToolQuest();
        } else {
          this.toast("⚙️ You have 3/3 Components! Head to Maya's Workbench inside her Workshop to build Prototype IV.");
        }
        return;
      }

      if (useType === 'community_aid' || item.id === 'village_supplies') {
        if (gameState.consumeItem('village_supplies', 1)) {
          gameState.state.restorativeNeeded = false;
          gameState.addSocialCredibility(5);
          audioManager.playFanfare();
          this.toast('🧺 Shared Village Supplies with neighbors! +5 Social Credibility (Trust Strengthened)');
          this.openInventory();
        }
        return;
      }

      if (useType === 'gift_morale' || item.id === 'flower_bundle') {
        if (gameState.consumeItem('flower_bundle', 1)) {
          gameState.addSocialCredibility(3);
          audioManager.playCoin();
          this.toast('💐 Gifted Decorative Flowers around Vale Square! +3 Social Credibility');
          this.openInventory();
        }
        return;
      }

      if (useType === 'install_loom' || item.id === 'prototype_loom') {
        this.showDialogue({
          charKey: 'maya_happy',
          mood: 'Prototype Ready',
          showBlueprint: true,
          text: 'Prototype IV Loom Governor is fully assembled and calibrated! Bring it to the Highland Council (North gate or World Map [M]) to demonstrate why equal STEM access uplifts all of Vale.'
        });
      }
    }

    openInventory() {
      this.closeAllModals();
      gameState.setUIOpen(true);
      this.el.invOverlay.classList.remove('hidden');
      this.el.invTitle.textContent = "TRAVELER'S INVENTORY";
      this.el.invGold.textContent = gameState.state.gold.toLocaleString();
      this.el.invDiscount.classList.add('hidden');
      this.el.invContent.innerHTML = '';

      gameState.state.inventory.forEach((item) => {
        const isUsable =
          item.usable ||
          ['mechanical_chest', 'maya_blueprints', 'mechanical_components', 'village_supplies', 'flower_bundle', 'prototype_loom'].includes(item.id);

        const card = document.createElement('div');
        card.className = 'item-card';
        card.innerHTML = `
          <div class="item-card-top">
            <div class="item-icon">${item.icon}</div>
            <div>
              <div class="item-name">${item.name}</div>
              <div class="item-qty">Qty: ${item.qty}</div>
            </div>
          </div>
          <div class="item-desc">${item.description}</div>
          ${isUsable ? '<div class="item-use-row"><button class="wood-btn sm-btn primary-btn">USE ITEM</button></div>' : ''}
        `;
        const useBtn = card.querySelector('button');
        if (useBtn) useBtn.onclick = () => this.useInventoryItem(item);
        this.el.invContent.appendChild(card);
      });
    }

    openMarketplace() {
      this.closeAllModals();
      gameState.setUIOpen(true);
      this.el.invOverlay.classList.remove('hidden');
      this.el.invTitle.textContent = 'VALE LOCAL MARKETPLACE';
      this.el.invGold.textContent = gameState.state.gold.toLocaleString();

      const discount = gameState.state.marketplaceDiscountActive;
      this.el.invDiscount.classList.toggle('hidden', !discount);
      this.el.invContent.innerHTML = '';

      MARKET_ITEMS.forEach((item) => {
        const finalPrice = discount ? Math.round(item.price * 0.85) : item.price;
        const canAfford = gameState.state.gold >= finalPrice;
        const card = document.createElement('div');
        card.className = 'item-card';
        card.innerHTML = `
          <div class="item-card-top">
            <div class="item-icon">${item.icon}</div>
            <div class="item-name">${item.name}</div>
          </div>
          <div class="item-desc">${item.description}</div>
          <div class="price-row">
            <div>
              ${discount ? `<span class="old-price">${item.price}G</span>` : ''}
              <span class="new-price">${finalPrice} G</span>
            </div>
            <button class="wood-btn sm-btn primary-btn" ${canAfford ? '' : 'disabled'}>BUY</button>
          </div>`;
        card.querySelector('button').onclick = () => {
          if (gameState.spendGold(finalPrice)) {
            audioManager.playCoin();
            gameState.addItem(item, 1);
            this.toast(`Purchased ${item.name} for ${finalPrice}G! Press [I] to use it.`);
            this.openMarketplace();
          } else {
            this.toast('Not enough Gold!');
          }
        };
        this.el.invContent.appendChild(card);
      });
    }

    openSettings() {
      this.closeAllModals();
      gameState.setUIOpen(true);
      this.el.setOverlay.classList.remove('hidden');
      this.el.setMusic.value = Math.round(gameState.state.settings.musicVolume * 100);
      this.el.setSfx.value = Math.round(gameState.state.settings.sfxVolume * 100);
      this.el.setSpeed.value = gameState.state.settings.textSpeed;
      this.el.btnSetSave.disabled = this.inMainMenu;
      this.el.btnSetMenu.disabled = this.inMainMenu;
    }
  }

  /* =========================================================
     6. BOOTSTRAP GAME
  ========================================================= */
  const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'game-container',
    width: 640,
    height: 360,
    pixelArt: true,
    roundPixels: true,
    antialias: false,
    backgroundColor: '#0b0f26',
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    physics: { default: 'arcade', arcade: { gravity: { y: 0 }, debug: false } },
    scene: [BootScene, MainMenuScene, WorldScene]
  });

  window.valeUI = new UIManager(game);
  window.gameState = gameState;

  if (gameState.hasSave()) {
    try {
      const saved = JSON.parse(localStorage.getItem(SAVE_KEY) || '{}');
      if (saved.settings) {
        audioManager.setVolumes(saved.settings.musicVolume ?? 0.45, saved.settings.sfxVolume ?? 0.7);
      }
    } catch {}
  }
})();