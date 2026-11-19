window.GAME_DATA = {
  "initialState": {
    "currentLocation": "village",
    "playerPos": { "x": 448, "y": 365 },
    "gold": 1280,
    "hearts": 3,
    "socialCredibility": 20,
    "maxSocialCredibility": 100,
    "inventory": [
      {
        "id": "traveler_compass",
        "name": "Brass Compass",
        "icon": "🧭",
        "qty": 1,
        "usable": false,
        "description": "A keepsake from your journey to Vale."
      }
    ]
  },
  "LOCATIONS": {
    "village": {
      "id": "village",
      "name": "VALE VILLAGE SQUARE",
      "shortName": "Vale Square",
      "mapPos": { "x": 42, "y": 56 },
      "unlockedByDefault": true,
      "requiredSC": 0,
      "description": "The peaceful heart of Vale with its stone fountain, ancient oak tree, rustic cottages, and village noticeboard."
    },
    "tailor_shop": {
      "id": "tailor_shop",
      "name": "MAYA'S TAILOR & WORKSHOP",
      "shortName": "Maya's Workshop",
      "mapPos": { "x": 24, "y": 38 },
      "unlockedByDefault": true,
      "requiredSC": 0,
      "description": "A warm timber-framed tailor shop where bolts of cloth, a cast-iron sewing machine, and Maya’s secret gear blueprints share the same roof."
    },
    "marketplace": {
      "id": "marketplace",
      "name": "LOCAL MARKETPLACE",
      "shortName": "Marketplace",
      "mapPos": { "x": 64, "y": 66 },
      "unlockedByDefault": true,
      "requiredSC": 0,
      "description": "Bustling fruit stalls, village crafts, and friendly merchants trading goods with travelers."
    },
    "innovation_guild": {
      "id": "innovation_guild",
      "name": "INNOVATION GUILD & ENGINEERING ACADEMY",
      "shortName": "Innovation Guild",
      "mapPos": { "x": 76, "y": 34 },
      "unlockedByDefault": false,
      "requiredSC": 0,
      "unlockQuest": "mayas_shadow",
      "description": "A lantern-lit hub of mechanical invention, equal-opportunity scholarships, and practical engineering education."
    },
    "highland_council": {
      "id": "highland_council",
      "name": "HIGHLAND COUNCIL",
      "shortName": "Highland Council",
      "mapPos": { "x": 50, "y": 17 },
      "unlockedByDefault": false,
      "requiredSC": 50,
      "description": "The regional civic assembly overlooking Vale Valley. Only trusted community advocates with 50 Social Credibility may present reform motions here."
    }
  },
  "MARKET_ITEMS": [
    {
      "id": "mechanical_components",
      "name": "Mechanical Components",
      "icon": "⚙️",
      "price": 120,
      "usable": true,
      "useType": "build_loom",
      "description": "Precision brass gears, springs, and fasteners. Use at Maya's Workbench or the Innovation Guild to help build Prototype IV."
    },
    {
      "id": "village_supplies",
      "name": "Village Supplies",
      "icon": "🧺",
      "price": 80,
      "usable": true,
      "useType": "community_aid",
      "description": "Fresh bread, lantern oil, and sturdy rope. Use to assist villagers or complete restorative community tasks (+5 Social Credibility)."
    },
    {
      "id": "flower_bundle",
      "name": "Decorative Flower Bundle",
      "icon": "💐",
      "price": 60,
      "usable": true,
      "useType": "gift_morale",
      "description": "Golden marigolds and wild lavender from Vale’s meadows. Gift to brighten a resident's mood and build goodwill (+3 Social Credibility)."
    }
  ],
  "REWARD_ITEMS": {
    "wrench_emblem": {
      "id": "wrench_emblem",
      "name": "Detailed Wrench Emblem",
      "icon": "🔧",
      "usable": false,
      "description": "An engraved brass badge gifted by Maya for championing equal opportunity."
    },
    "mechanical_chest": {
      "id": "mechanical_chest",
      "name": "Mechanical Parts Chest",
      "icon": "🧰",
      "usable": true,
      "useType": "open_parts_chest",
      "description": "A wooden chest packed with precision tools and spare springs. Use to unpack extra Mechanical Components."
    },
    "maya_blueprints": {
      "id": "maya_blueprints",
      "name": "Maya's Mechanical Blueprints",
      "icon": "📐",
      "usable": true,
      "useType": "view_blueprint",
      "description": "Hand-drawn plans for Prototype IV: a wrist-saving loom tensioner and gear-driven spool winder."
    },
    "prototype_loom": {
      "id": "prototype_loom",
      "name": "Prototype IV Loom Governor",
      "icon": "🛠️",
      "usable": true,
      "useType": "install_loom",
      "description": "A completed brass-and-spring loom tensioner built with Maya. Ready to demonstrate before the Highland Council."
    },
    "council_charter": {
      "id": "council_charter",
      "name": "Vale Equal-Access Charter",
      "icon": "📜",
      "usable": false,
      "description": "Signed by the Highland Council, guaranteeing open STEM & trade apprenticeships regardless of gender."
    }
  },
  "QUESTS": {
    "mayas_shadow": {
      "id": "mayas_shadow",
      "title": "MAYA'S SHADOW",
      "rewardSC": 10,
      "successTitle": "QUEST SUCCESS: MAYA'S SHADOW",
      "successDescription": "Arthur and Clara proudly back Maya's application to the Engineering Academy, while Leo finally steps up to the tailoring counter he secretly loved all along. A brighter future awaits the whole workshop."
    },
    "mayas_loom": {
      "id": "mayas_loom",
      "title": "THE PROTOTYPE LOOM",
      "rewardSC": 20,
      "successTitle": "QUEST SUCCESS: THE PROTOTYPE LOOM",
      "successDescription": "Using Marketplace components and Maya's blueprints, you helped assemble Prototype IV. Clara's wrists are relieved, Guildmaster Elena endorses Maya's scholarship, and word reaches the Highland Council!"
    },
    "highland_hearing": {
      "id": "highland_hearing",
      "title": "VOICES OF THE HIGHLAND",
      "rewardSC": 25,
      "successTitle": "QUEST SUCCESS: VOICES OF THE HIGHLAND",
      "successDescription": "Presenting Maya's working loom alongside testimonies from Vale's families, you convinced the Highland Council to replace gender-restricted guild quotas with open merit apprenticeships."
    }
  },
  "JOURNAL_ENTRIES": {
    "mayas_shadow": {
      "id": "mayas_shadow",
      "questTitle": "QUEST COMPLETED: MAYA'S SHADOW",
      "tabTitle": "Maya's Shadow",
      "outcome": "OUTCOME: EMPATHETIC RESOLUTION (+10 SOCIAL CREDIBILITY)",
      "reflectionTitle": "SOCIO-ECONOMIC REFLECTION",
      "reflectionText": "By listening to Maya, giving Leo a voice, and presenting concrete proof of her engineering skill, you bridged a generational divide. Equal access to education doesn't erase tradition—it lets every family member thrive where their true strengths lie.",
      "lesson": "LESSON UNLOCKED: GENDER EQUALITY & OPPORTUNITY (SDG 5)"
    },
    "mayas_shadow_restorative": {
      "id": "mayas_shadow_restorative",
      "questTitle": "REPLAY LESSON: MENDING TRUST",
      "tabTitle": "Mending Trust",
      "outcome": "OUTCOME: RESTORATIVE LEARNING (SAFE SANDBOX)",
      "reflectionTitle": "RESTORATIVE REFLECTION",
      "reflectionText": "Testing harsh or traditionalist dialogue showed how quickly dismissive remarks silence young people's ambitions. Repairing trust through concrete community action proved accountability matters more than perfection.",
      "lesson": "LESSON UNLOCKED: ACCOUNTABILITY & PERSPECTIVE-TAKING"
    },
    "mayas_loom": {
      "id": "mayas_loom",
      "questTitle": "QUEST COMPLETED: THE PROTOTYPE LOOM",
      "tabTitle": "Prototype Loom",
      "outcome": "OUTCOME: PRACTICAL INNOVATION (+20 SOCIAL CREDIBILITY)",
      "reflectionTitle": "SOCIO-ECONOMIC REFLECTION",
      "reflectionText": "When Maya had the tools and components to turn her blueprint into a working loom governor, the entire family shop grew more productive. Closing STEM stereotypes isn't charity—it unlocks innovation that lifts the whole local economy.",
      "lesson": "LESSON UNLOCKED: BREAKING STEM STEREOTYPES (SDG 4)"
    },
    "highland_hearing": {
      "id": "highland_hearing",
      "questTitle": "QUEST COMPLETED: VOICES OF THE HIGHLAND",
      "tabTitle": "Highland Council",
      "outcome": "OUTCOME: SYSTEMIC POLICY REFORM (+25 SOCIAL CREDIBILITY)",
      "reflectionTitle": "SOCIO-ECONOMIC REFLECTION",
      "reflectionText": "Individual kindness changed one household, but lasting equity required changing the Council's apprenticeship bylaws. Addressing structural bias means pairing personal empathy with institutional reform.",
      "lesson": "LESSON UNLOCKED: SYSTEMIC EQUITY & INCLUSION (SDG 10)"
    }
  },
  "CHARACTERS": {
    "maya": {
      "name": "Maya",
      "role": "Tailor's Daughter & Closet Inventor",
      "portrait": "portrait_maya_sad",
      "voice": { "freq": 520, "type": "triangle", "jitter": 55, "step": 2 }
    },
    "maya_happy": {
      "name": "Maya",
      "role": "Engineering Academy Applicant",
      "portrait": "portrait_maya_happy",
      "voice": { "freq": 560, "type": "triangle", "jitter": 65, "step": 2 }
    },
    "arthur": {
      "name": "Arthur (Maya's Father)",
      "role": "Master Tailor & Shop Owner",
      "portrait": "portrait_parents",
      "voice": { "freq": 195, "type": "sawtooth", "jitter": 25, "step": 3 }
    },
    "clara": {
      "name": "Clara (Maya's Mother)",
      "role": "Tailor Shop Co-Owner",
      "portrait": "portrait_mother",
      "voice": { "freq": 420, "type": "sine", "jitter": 40, "step": 2 }
    },
    "leo": {
      "name": "Leo (Maya's Brother)",
      "role": "Younger Brother & Secret Tailor",
      "portrait": "portrait_brother",
      "voice": { "freq": 360, "type": "triangle", "jitter": 45, "step": 2 }
    },
    "barnaby": {
      "name": "Merchant Barnaby",
      "role": "Vale Marketplace Vendor",
      "portrait": "portrait_merchant",
      "voice": { "freq": 250, "type": "square", "jitter": 35, "step": 3 }
    },
    "elena": {
      "name": "Guildmaster Elena",
      "role": "Innovation Guild Director",
      "portrait": "portrait_guild",
      "voice": { "freq": 470, "type": "triangle", "jitter": 30, "step": 2 }
    },
    "councilor_linh": {
      "name": "Councilor Minh",
      "role": "Highland Council Chair",
      "portrait": "portrait_councilor",
      "voice": { "freq": 220, "type": "triangle", "jitter": 20, "step": 3 }
    },
    "villager_anna": {
      "name": "Old Hana",
      "role": "Vale Storyteller & Baker",
      "portrait": "portrait_villager",
      "voice": { "freq": 340, "type": "sine", "jitter": 50, "step": 3 }
    },
    "villager_thomas": {
      "name": "Farmer Pip",
      "role": "Vale Orchard Keeper",
      "portrait": "portrait_villager2",
      "voice": { "freq": 240, "type": "triangle", "jitter": 35, "step": 3 }
    },
    "sans": {
      "name": "sans",
      "role": "just a guy taking a shortcut",
      "portrait": "portrait_sans",
      "voice": { "freq": 135, "type": "square", "jitter": 10, "step": 2, "sansMode": true }
    }
  },
  "NPC_LINES": {
    "noticeboard_before": "• TAILOR SHOP: Arthur & Clara’s Tailor Shop—keeping Vale stitched for 40 years.\n• GUILD ROAD: Eastern path to the Innovation Guild remains overgrown.\n• VILLAGE WHISPER: Maya has been sitting outside her workshop looking worn out.",
    "noticeboard_after": "• COMMUNITY NEWS: Maya’s application to the Innovation Guild has been submitted—and Leo is apprenticing at the Tailor Shop!\n• MARKETPLACE: Barnaby’s 15% Community Appreciation Discount is ACTIVE.\n• HIGHLAND COUNCIL: Open to civic advocates with 50 Social Credibility.",
    "hana_before": "Careful how you judge Arthur and Clara, traveler. When a winter storm took their roof ten years back, that tailor shop was the only thing keeping bread on the table. Fear makes good people stubborn—and poor Maya's caught right in the pinch.",
    "hana_after": "Hah! Forty years I've watched this square, and I never thought I'd see Arthur swallow his pride and cheer on a daughter holding a wrench. You lit a proper spark in Vale, traveler.",
    "pip_before": "Funny thing about Vale—everyone thinks they know who belongs where. Maya fixed my cider press in ten minutes flat last autumn, then begged me not to tell her dad. Shame to let talent gather dust.",
    "pip_after": "The east road to the Innovation Guild is finally clear! Even my boy's asking if he can sit in on their open workshops. Oh—and Barnaby down south slashed prices 15% in your honor.",
    "sans_easter_egg": "heya kid, beautiful day isn't it? ...well, night. lanterns are glowing, birds are sleeping... on nights like these, kids like you should be breaking a few unfair stereotypes. heh."
  }
}