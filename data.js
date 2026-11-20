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

  "SKINS": {
    "player": {
      "skin": "#f2c9a0", "hair": "#5a3418", "top": "#3b5a8a", "bot": "#4a4a58",
      "sc": "#c0392b", "pk": true
    },
    "npc_maya_sad": {
      "portrait": "portrait_maya_sad",
      "skin": "#f6d3b0", "hair": "#6b3a22", "top": "#b84a3a", "bot": "#b84a3a",
      "sk": true, "lg": true, "rb": true
    },
    "npc_maya_mech": {
      "portrait": "portrait_maya_happy", "isMayaJournal": true,
      "skin": "#f6d3b0", "hair": "#6b3a22", "top": "#efe3c8", "bot": "#3a4f7a",
      "lg": true, "rb": true, "wrench": true
    },
    "npc_father": {
      "portrait": "portrait_parents",
      "skin": "#f0c49a", "hair": "#6b4a2a", "top": "#8a5a2a", "bot": "#4a3a2a",
      "mu": true
    },
    "npc_mother": {
      "portrait": "portrait_mother",
      "skin": "#f3cba4", "hair": "#8a4a2a", "top": "#d46a6a", "bot": "#e8d6b8",
      "sk": true, "bn": true
    },
    "npc_brother": {
      "portrait": "portrait_brother",
      "skin": "#f2c9a0", "hair": "#6b3a1e", "top": "#5a8a5a", "bot": "#4a4a58"
    },
    "npc_merchant": {
      "portrait": "portrait_merchant",
      "skin": "#e8b890", "hair": "#4a3020", "top": "#3a6a4a", "bot": "#5a4a3a",
      "ap": true
    },
    "npc_guild": {
      "portrait": "portrait_guild",
      "skin": "#f5d0aa", "hair": "#3b2a4a", "top": "#4a5a8a", "bot": "#3a4a6a",
      "lg": true, "bn": true
    },
    "npc_councilor": {
      "portrait": "portrait_councilor",
      "skin": "#ecc299", "hair": "#cfd2dc", "top": "#583b6e", "bot": "#2e223d",
      "sc": "#e8b84a", "mu": true
    },
    "npc_villager1": {
      "portrait": "portrait_villager",
      "skin": "#efc9a8", "hair": "#cfcfd8", "top": "#7a4a6a", "bot": "#7a4a6a",
      "sk": true, "bn": true
    },
    "npc_villager2": {
      "portrait": "portrait_villager2",
      "skin": "#e8b890", "hair": "#6a4a2a", "top": "#5a6a7a", "bot": "#4a5a3a",
      "ht": "#d9b45a"
    },

    "notice_icon": {
      "portrait": "portrait_notice",
      "palette": { "d": "#1a0e1f" },
      "grid": ["d"],
      "portraitBg": "#1a0e1f",
      "portraitScale": 3,
      "portraitPalette": {
        "d": "#1a0e1f",
        "m": "#2e1b38",
        "o": "#c77b18",
        "g": "#ffd046",
        "y": "#fff3a8"
      },
      "portraitGrid": [
        "dddddddddddddddddd",
        "dggggggggggggggggd",
        "dgoooooooooooooogd",
        "dgmmmmmmmmmmmmmmgd",
        "dgmmmmddddddmmmmgd",
        "dgmmmmdyggodmmmmgd",
        "dgmmmmdyggodmmmmgd",
        "dgmmmmdyggodmmmmgd",
        "dgmmmmdyggodmmmmgd",
        "dgmmmmdyggodmmmmgd",
        "dgmmmmmddddmmmmmgd",
        "dgmmmmmmmmmmmmmmgd",
        "dgmmmmmddddmmmmmgd",
        "dgmmmmdyggodmmmmgd",
        "dgmmmmdyggodmmmmgd",
        "dgmmmmmddddmmmmmgd",
        "dggggggggggggggggd",
        "dddddddddddddddddd"
      ]
    },

    "npc_sans": {
      "portrait": "portrait_sans",
      "palette": {
        "k": "#0a0a0d",
        "w": "#ffffff",
        "g": "#a8b0be",
        "b": "#3b82f6"
      },
      "grid": [
        ".......kkkkkkkkk.......",
        ".....kkwwwwwwwwwkk.....",
        "....kwwwwwwwwwwwwwk....",
        "...kwwwwwwwwwwwwwwwk...",
        "...kwwwwwwwwwwwwwwwk...",
        "...kwwkkkwwwwwkkkwwk...",
        "...kwwkkkwwwwwkkkwwk...",
        "...kwwkkkwwkwwkkkwwk...",
        "....kwwwwwkkkwwwwwk....",
        "...kwwkwwwwwwwwwkwwk...",
        "...kwwwkkkkkkkkkwwwk...",
        "...kwwwkwkwkwkwkwwwk...",
        "....kwwwkkkkkkkwwwk....",
        ".....kkwwwwwwwwwkk.....",
        "...kkkkkkkkkkkkkkkkk...",
        "..kbbkkkggkwkggkkkbbk..",
        ".kbbbkgggkwwwkgggkbbbk.",
        ".kbbbbkkkwwwwwkkkbbbbk.",
        "kbbbkbkbbkwwwkbbkbkbbbk",
        "kbbbbkbbbkwwwkbbbkbbbbk",
        ".kbbbkbbbkwwwkbbbkbbbk.",
        "..kkbkbbbkkkkkbbbkbkk..",
        "...kkkkkkkkkkkkkkkkk...",
        "...kkkkkkkkkkkkkkkkk...",
        "....kkkkkkk.kkkkkkk....",
        "....kkkkkk...kkkkkk....",
        "....kwwwwk...kwwwwk....",
        "...kwwwwwk...kwwwwwk...",
        "...kkkkkkk...kkkkkkk..."
      ],
      "portraitBg": "#3f3f3f",
      "portraitScale": 2,
      "portraitPalette": {
        "k": "#0a0a0d",
        "w": "#ffffff"
      },
      "portraitGrid": [
        "................kkkkkkkkkkkk................",
        ".............kkkwwwwwwwwwwwwkkk.............",
        "...........kkwwwwwwwwwwwwwwwwwwkk...........",
        "..........kwwwwwwwwwwwwwwwwwwwwwwk..........",
        ".........kwwwwwwwwwwwwwwwwwwwwwwwwk.........",
        "........kwwwwwwwwwwwwwwwwwwwwwwwwwwk........",
        ".......kwwwwwwwwwwwwwwwwwwwwwwwwwwwwk.......",
        ".......kwwwwwwwwwwwwwwwwwwwwwwwwwwwwk.......",
        ".......kwwwwkkkkkwwwwwwwwwwkkkkkwwwwk.......",
        ".......kwwwkkkkkkkwwwwwwwwkkkkkkkwwwk.......",
        ".......kwwkkkkkkkkwwwwwwwwkkkkkkkkwwk.......",
        ".......kwwkkkkwwkkwwwwwwwwkkwwkkkkwwk.......",
        "........kwkkkkwwkkwwwkkwwwkkwwkkkkwk.......",
        ".........kwkkkkkkkwwwkkwwwkkkkkkkwk.........",
        ".........kwwkkkkkwwwkkkkwwwkkkkkwwk.........",
        ".........kwwwwkkwwwwkkkkwwwwkkwwwwk.........",
        "........kwwwwwwwwwwwkkkkwwwwwwwwwwwk........",
        "........kwwkwwwwwwwwwwwwwwwwwwwwkwwk........",
        "........kwkkkwwwwwwwwwwwwwwwwwwkkkwk........",
        ".........kwwkkkkkkkkkkkkkkkkkkkkwwk.........",
        ".........kwwkwkwkkwwwkkwwwkkwkwkwwk.........",
        "..........kwwkkwkkwwwkkwwwkkwkkwwk..........",
        "...........kwwwkkkwwwkkwwwkkkwwwk...........",
        "............kwwwwkkkkkkkkkkwwwwk............",
        ".............kkwwwwwwwwwwwwwwkk.............",
        "......kkkkkk.kkwwwwwwwwwwwwwwkk.kkkkkk......",
        ".....kwwwwwwkkwkkkkkkkkkkkkkkwkkwwwwwwk.....",
        "....kwwwwwwwwkkwwwwkkkkkkwwwwkkwwwwwwwwk....",
        "...kwwwwwwwwwwkkwwwwwwwwwwwwkkwwwwwwwwwwk...",
        "..kkkkkkwwwwwwwkkwwwwwwwwwwkkwwwwwwwkkkkkk..",
        "..kkkkkkkkkwwwwwkkwwwwwwwwkkwwwwwkkkkkkkkk..",
        ".kkkkkkkkkkkkkwwkwwwwwwwwwwkwwkkkkkkkkkkkkk.",
        ".kkkkkkkkkkkkwkwkkwwwwwwwwkkwkwkkkkkkkkkkkk.",
        "kkkkkkkkkkkkkwkkwkwwwwwwwwkwkkwkkkkkkkkkkkkk",
        "kkkkkkkkkkwkkwkwkkwwwwwwwwkkwkwkkwkkkkkkkkkk",
        "kkkkkkkkkwkkkwkkwkwwwwwwwwkwkkwkkkwkkkkkkkkk",
        "kkkkkkkkwkkkkwkwkkwwwwwwwwkkwkwkkkkwkkkkkkkk",
        ".kkkkkkkwkkkkwkkwkwwwwwwwwkwkkwkkkkwkkkkkkk.",
        ".kkkkkkkwkkkkwkwkkwwwwwwwwkkwkwkkkkwkkkkkkk.",
        "..kkkkkkwkkkkwkkwkwwwwwwwwkwkkwkkkkwkkkkkk..",
        "...kkkkkwwkkkwkwkkkkkkkkkkkkwkwkkkwwkkkkk...",
        "....kkkkkkkkkkwwwwwwwwwwwwwwwwkkkkkkkkkk....",
        ".....kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk.....",
        ".....kkwkkkkkkkkkkkkkkkkkkkkkkkkkkkkwkk....."
      ]
    }
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
      "mapPos": { "x": 50, "y": 22 },
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
    "notice": {
      "name": "Notice",
      "role": "Vale Village",
      "portrait": "portrait_notice",
      "voice": { "freq": 520, "type": "sine", "jitter": 15, "step": 4 }
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
      "voice": { "src": "./sans.mp3", "step": 2 }
    }
  },

  "NPC_LINES": {
    "noticeboard_before": "• TAILOR SHOP: Arthur & Clara’s Tailor Shop—keeping Vale stitched for 40 years.\n• GUILD ROAD: Eastern path to the Innovation Guild remains overgrown.\n• VILLAGE WHISPER: Maya has been sitting outside her workshop looking worn out.",
    "noticeboard_after": "• COMMUNITY NEWS: Maya’s application to the Innovation Guild has been submitted—and Leo is apprenticing at the Tailor Shop!\n• MARKETPLACE: Barnaby’s 15% Community Appreciation Discount is ACTIVE.\n• HIGHLAND COUNCIL: Open to civic advocates with 50 Social Credibility.",
    "hana_before": "Careful how you judge Arthur and Clara, traveler. When a winter storm took their roof ten years back, that tailor shop was the only thing keeping bread on the table. Fear makes good people stubborn—and poor Maya's caught right in the pinch.",
    "hana_after": "Hah! Forty years I've watched this square, and I never thought I'd see Arthur swallow his pride and cheer on a daughter holding a wrench. You lit a proper spark in Vale, traveler.",
    "pip_before": "Funny thing about Vale—everyone thinks they know who belongs where. Maya fixed my cider press in ten minutes flat last autumn, then begged me not to tell her dad. Shame to let talent gather dust.",
    "pip_after": "The east road to the Innovation Guild is finally clear! Even my boy's asking if he can sit in on their open workshops. Oh—and Barnaby down south slashed prices 15% in your honor."
  },

  "DIALOGUES": {
    "sans_intro": {
      "charKey": "sans",
      "mood": "ironic",
      "text": "heya human, beautiful day isn't it?",
      "choices": [
        {"icon": "💀", "tag": "TALK", "label": "What could possibly bring you here..", "next": "sans_q1" },
        {"icon": "🤨", "tag": "PARANOID", "label": "Am I tripping or is it really you.", "next": "sans_q2" },
      ]
    },

    "sans_q1": {
      "charKey": "sans",
      "mood": "ironic",
      "text": "tried taking a shortcut, welp i still don't know why i am here, might as well take a break in this somehow cozy town, Could have said it is a \"Un-Snowdin Town\" ",
      "choices": [
        {"icon": "😒", "tag": "UPSET", "label": "shut up sans.", "next": "sans_end" },
      ]
    },

    "sans_q2": {
      "charKey": "sans",
      "mood": "ironic",
      "text": "what? i have never seen any humans beside that one kid",
      "choices":[
        {"icon": "💀", "tag": "TALK", "label": "ballright... how are you here tho?", "next": "sans_q1" },
      ]
    },

    "sans_end": {
      "charKey": "sans",
      "mood": "wink",
      "text": "okay"
    },

    "maya_intro": {
      "charKey": "maya",
      "mood": "Guarded",
      "text": "*Maya wipes a smudge of machine oil onto her apron and sighs.* \"It's not that simple... I want to study engineering, not spend forty years hem-stitching coats. My parents—Arthur and Clara—expect me to inherit the tailor shop instead of my brother Leo. Every time I bring up the Academy, Dad looks like I've asked him to burn the place down.\"",
      "choices": [
        { "icon": "❤️", "tag": "EMPATHY", "label": "You love them, and you still want your own life. Tell me what you build when no one is looking.", "next": "maya_empathy" },
        { "icon": "⚖️", "tag": "SKEPTICISM", "label": "A forty-year family shop is real security. Maybe engineering is a luxury Vale can’t afford right now.", "next": "maya_skepticism" },
        { "icon": "🤝", "tag": "DIPLOMACY", "label": "Sometimes parents hear an outsider better than their own daughter. Let me sit down with Arthur and Clara.", "next": "maya_diplomacy" },
        { "icon": "📐", "tag": "ACTION / EVIDENCE", "label": "Dreams sound fragile—proof doesn’t. Let’s look at your mechanical blueprints and put them right on their counter.", "next": "maya_evidence" }
      ]
    },
    "maya_empathy": {
      "charKey": "maya",
      "mood": "Opening Up",
      "onEnter": ["approach:mayas_shadow:empathy"],
      "text": "*Her shoulders drop an inch, and a real spark flashes in her eyes.* \"Nobody here ever asks what I build—only whether my seams are straight. After closing, I stay up repairing the shop’s old cast-iron sewing machine. I even drafted a spring-loaded tensioner so Mom’s wrists stop aching after long winters... And Leo actually *loves* tailoring! He just thinks Dad won’t trust him with the shears.\"",
      "choices": [
        { "icon": "🤝", "tag": "DIPLOMACY", "label": "Then this isn’t rebellion—it’s a better plan for everyone. Let’s step inside and inspect your workbench.", "next": "maya_diplomacy" },
        { "icon": "📐", "tag": "CHECK BLUEPRINTS", "label": "Show me that workbench inside—once I’ve seen your blueprint, we’ll bring it straight to Arthur and Clara.", "next": "maya_evidence" }
      ]
    },
    "maya_skepticism": {
      "charKey": "maya",
      "mood": "Stung & Defiant",
      "onEnter": ["approach:mayas_shadow:skepticism", "restorative:true"],
      "text": "*Maya’s jaw tightens as she folds her arms.* \"Funny—you sound just like the village elders. Tell me: why is it *my* duty to sacrifice my future when Leo is standing ten feet inside wishing someone would hand him tailor’s chalk? I don’t want to wreck my family’s livelihood. I just refuse to be invisible inside it.\"",
      "choices": [
        { "icon": "🙏", "tag": "OWN YOUR MISTAKE", "label": "You’re right—I jumped to assumptions without hearing the whole story. Start over with me?", "actions": ["restorative:false"], "next": "maya_empathy" },
        { "icon": "🤝", "tag": "BUILD A REAL CASE", "label": "Fair hit. If Arthur needs hard proof instead of speeches, let’s check your workbench and make a case he can’t ignore.", "actions": ["restorative:false"], "next": "maya_evidence" }
      ]
    },
    "maya_diplomacy": {
      "charKey": "maya",
      "mood": "Cautiously Hopeful",
      "onEnter": ["approach:mayas_shadow:diplomacy", "stage:mayas_shadow:family_meeting"],
      "text": "*Maya glances toward the workshop door.* \"I warn you—my father Arthur isn’t cruel, he’s terrified. If you walk up to him empty-handed, he’ll shut the ledger and wave you off. Step inside, inspect my blueprint on the right-hand workbench first, and then talk to Arthur and Clara!\"",
      "nextAction": { "label": "Enter Maya's Workshop", "actions": ["enter:tailor_shop:240:248"] }
    },
    "maya_evidence": {
      "charKey": "maya",
      "mood": "Determined",
      "onEnter": ["approach:mayas_shadow:evidence", "stage:mayas_shadow:family_meeting"],
      "text": "*Maya smiles for the first time all evening.* \"Now you’re thinking like an engineer! My loom-tensioner blueprints are spread out on the right-hand workbench inside. Go look them over first—and chat with Leo if you get a moment—then bring them to Arthur and Clara!\"",
      "nextAction": { "label": "Enter Workshop & Inspect Workbench", "actions": ["enter:tailor_shop:240:248"] }
    },

    "blueprint_view": {
      "charKey": "maya",
      "mood": "Blueprint Examined",
      "showBlueprint": true,
      "text": "*You unroll crisp indigo vellum covered in precision gear ratios and neat margin notes:* \"Prototype IV — self-tensioning loom governor. Reduces hand-crank torque by 60% so Mother’s wrists stop swelling in winter.\" This isn’t a daydream—it’s real engineering built out of love for her family.",
      "nextAction": { "label": "Close Blueprint", "actions": ["close"] }
    },

    "leo_before": {
      "charKey": "leo",
      "mood": "Confiding",
      "onEnter": ["heardLeo"],
      "text": "*Leo glances at Arthur, then lowers his voice.* \"Everyone thinks I’m clumsy with a needle because I panic when Dad watches over my shoulder. Look at that terracotta dress on the mannequin—I stitched that hem myself after closing! I *want* to run this shop someday. Nobody ever asked me because they already decided the eldest daughter had to do it.\"",
      "nextAction": { "label": "Promise to Speak Up for Him", "actions": ["toast:🧵 Insight Gained: Leo wants to inherit the tailor shop!", "close"] }
    },
    "leo_after": {
      "charKey": "leo",
      "mood": "Beaming",
      "text": "*Leo holds up a freshly chalked wool sleeve, grinning ear to ear.* \"Dad actually let me cut the collar pattern today—first try, zero wasted cloth! Once you and Maya finish building that Prototype IV loom tensioner, our shop will double its winter orders.\""
    },

    "parents_need_blueprint": {
      "charKey": "arthur",
      "mood": "Skeptical",
      "onEnter": ["toast:📐 Inspect Maya's Workbench on the right first!"],
      "text": "*Arthur doesn’t even look up from his ledger.* \"Before you waste my evening lecturing me about Maya’s 'engineering talent', traveler, walk over to her cluttered workbench on the right and actually look at what she’s been hiding there. Don’t come preaching to me without proof.\""
    },
    "parents_start": {
      "charKey": "arthur",
      "mood": "Defensive",
      "text": "*Arthur sets his tailor’s chalk down hard on the counter while Clara watches nervously beside him.* \"All right, traveler—you’ve seen her workbench, so say your piece. Ten winters ago this shop barely survived frostbite and debt. Maya has steady hands; engineering is a gamble for guild-kids—not a tailor’s daughter.\"",
      "choices": [
        { "icon": "📐", "tag": "PRESENT BLUEPRINT", "label": "Unroll Prototype IV right here on the counter—she engineered it to save Clara’s aching wrists.", "next": "parents_stage2_evidence" },
        { "icon": "🧵", "tag": "LEO'S CONFESSION", "label": "Ask Leo who stitched that terracotta dress on the mannequin—he wants this shop more than anyone.", "when": "heardLeo", "next": "parents_stage2_leo" },
        { "icon": "🧵", "tag": "ASK ABOUT LEO", "label": "Why force Maya when you have a son right here who could take over?", "whenNot": "heardLeo", "next": "parents_pushback_leo" },
        { "icon": "🔥", "tag": "CONFRONT BIAS", "label": "Admit it, Arthur—if Maya were your son, you’d have walked her to the Academy gates yourself.", "next": "parents_pushback_harsh" }
      ]
    },
    "parents_pushback_leo": {
      "charKey": "clara",
      "mood": "Hesitant",
      "text": "*Clara glances worriedly at Leo, who shrinks back toward the wall.* \"Leo always drops his thimble when Arthur watches him... We never thought he even cared for cloth. Have you actually spoken to him, or are you guessing?\"",
      "choices": [
        { "icon": "💬", "tag": "TALK TO LEO FIRST", "label": "Let me speak with Leo privately first—you’re about to be surprised.", "actions": ["close"] },
        { "icon": "📐", "tag": "SHOW BLUEPRINT INSTEAD", "label": "Before Leo speaks, look at what Maya drew on her workbench.", "next": "parents_stage2_evidence" }
      ]
    },
    "parents_pushback_harsh": {
      "charKey": "clara",
      "mood": "Hurt & Firm",
      "text": "*Clara steps beside Arthur, her voice quiet but sharp.* \"Watch your tone, traveler. Arthur worked his knuckles raw so both our children could eat—not out of spite, out of fear! Scolding us won’t help Maya. Show us what you found on her bench and help us see a real way forward.\"",
      "choices": [
        { "icon": "📐", "tag": "APOLOGIZE & SHOW PROOF", "label": "I crossed a line. You’ve carried a heavy load—please, just look at Maya’s blueprint.", "next": "parents_stage2_evidence" }
      ]
    },
    "parents_stage2_evidence": {
      "charKey": "clara",
      "mood": "Torn but Listening",
      "showBlueprint": true,
      "text": "*You spread Maya’s indigo blueprint flat across the oak counter. Arthur leans in, his fingers tracing the gear ratios—then freezes at her margin note about Clara’s wrists. Silence fills the workshop.*\n\n\"Still...\" *Clara’s voice trembles.* \"If Maya goes off to the Innovation Guild, who keeps the shop steady while Leo is still learning? Tradition isn’t our enemy—we just need a plan that doesn’t leave anyone stranded.\"",
      "choices": [
        { "icon": "⚖️", "tag": "HALF-MEASURE", "label": "Tell Maya to work the shop six days a week and only tinker with gears on Sundays.", "next": "parents_reject_compromise" },
        { "icon": "🤝", "tag": "SHARED FUTURE", "label": "Maya installs her loom-tensioner to lighten your workload, teaches Leo her best patterns, and applies to the Academy with your blessing.", "next": "parents_breakthrough" }
      ]
    },
    "parents_stage2_leo": {
      "charKey": "clara",
      "mood": "Torn but Listening",
      "text": "*Leo steps forward, cheeks flushed, lifting the hem of the terracotta dress.* \"I stitched that after closing, Dad. I love fabrics—I was just scared of disappointing you.\" *Clara’s hand flies to her mouth.*\n\n\"Still...\" *Clara’s voice trembles.* \"If Maya goes off to the Innovation Guild, who keeps the shop steady while Leo is still learning? Tradition isn’t our enemy—we just need a plan that doesn’t leave anyone stranded.\"",
      "choices": [
        { "icon": "⚖️", "tag": "HALF-MEASURE", "label": "Tell Maya to work the shop six days a week and only tinker with gears on Sundays.", "next": "parents_reject_compromise" },
        { "icon": "🤝", "tag": "SHARED FUTURE", "label": "Maya installs her loom-tensioner to lighten your workload, teaches Leo her best patterns, and applies to the Academy with your blessing.", "next": "parents_breakthrough" }
      ]
    },
    "parents_reject_compromise": {
      "charKey": "maya",
      "mood": "Firm",
      "text": "*Maya shakes her head softly, eyes glistening—and surprisingly, Clara nods with her.* \"A Sunday hobby isn’t an education, traveler. The Academy exams take real study.\" *Clara adds gently:* \"If we’re going to change, let’s not do it halfway.\"",
      "nextAction": { "label": "Propose a Real Solution", "next": "parents_stage2_evidence" }
    },
    "parents_breakthrough": {
      "charKey": "arthur",
      "mood": "Moved & Proud",
      "showBlueprint": true,
      "text": "*For a long moment, Arthur says nothing. Then he rolls Maya’s blueprint carefully and ties it with a ribbon of his finest scarlet silk.* \"A self-tensioning loom... designed for your mother’s hands. Forgive an old tailor for being blind, Maya. Send your application to the Innovation Guild—we’ll back every brass gear of it. And Leo... grab a piece of chalk. Tomorrow, you stand at the main counter beside me.\"",
      "nextAction": { "label": "Celebrate with the Family ✨", "actions": ["enterCelebration:tailor_shop:240:238"] }
    },
    "parents_after_act1": {
      "charKey": "arthur",
      "mood": "Warm & Proud",
      "text": "*Arthur adjusts his spectacles and chuckles.* \"Forty years behind this counter, and it took a stranger to make me listen to my own roof. If you’re helping Maya actually build that Prototype IV tensioner at her bench, Barnaby at the Marketplace carries brass Mechanical Components!\""
    },
    "parents_after_act2": {
      "charKey": "arthur",
      "mood": "Warm & Proud",
      "text": "*Arthur beams as Clara smoothly turns the upgraded loom crank.* \"Look at that—barely a flick of the wrist! The Highland Council will be fools if they don’t listen to you and Maya.\""
    },

    "maya_act2": {
      "charKey": "maya_happy",
      "mood": "Excited & Focused",
      "showBlueprint": true,
      "text": "*Maya grins, unrolling her blueprint under the lantern.* \"Guildmaster Elena loved my paper application, but the Highland Council still blocks women from funded engineering fellowships unless we bring a working machine! If we gather 3 Mechanical Components (you have {comp}/3—try unpacking the Parts Chest in your Bag [I] and buying the rest at Barnaby's 15%-off Marketplace), we can build Prototype IV right at my Workbench inside!\"",
      "choices": [
        { "icon": "🛠️", "tag": "HEAD TO WORKBENCH", "label": "We have 3/3 Components—let's step inside and assemble Prototype IV!", "when": "has3Comp", "actions": ["enter:tailor_shop:320:224"] },
        { "icon": "🎒", "tag": "GATHER PARTS", "label": "Got it—I'll unpack the Parts Chest and check Barnaby's Marketplace.", "whenNot": "has3Comp", "actions": ["close"] }
      ]
    },
    "maya_after_loom": {
      "charKey": "maya_happy",
      "mood": "Determined",
      "text": "*Maya holds the gleaming Prototype IV Loom Governor.* \"Prototype IV works like silk! Now that your Social Credibility has reached 50, the northern gate to the Highland Council is open. Let’s meet up there—or fast-travel on the Map [M]—and challenge those outdated guild bylaws!\""
    },
    "maya_after_highland": {
      "charKey": "maya_happy",
      "mood": "Triumphant",
      "text": "*Maya taps her brass wrench emblem against the signed Equal-Access Charter.* \"We went from hiding sketches under bolts of cloth to rewriting valley law. Thank you for walking every step of this road with me, traveler!\""
    },

    "elena_before_loom": {
      "charKey": "elena",
      "mood": "Encouraging",
      "text": "\"Welcome to the Innovation Guild! Maya’s blueprints are brilliant, but our scholarship board answers to the Highland Council. Help Maya assemble Prototype IV at her workshop bench—unpack your Parts Chest [I] and pick up extra Mechanical Components from Barnaby at the Marketplace!\""
    },
    "elena_after_loom": {
      "charKey": "elena",
      "mood": "Impressed",
      "showBlueprint": true,
      "text": "*Elena inspects your assembled Prototype IV Loom Governor with a jeweler’s loupe.* \"Flawless 3:1 reduction and a brass finger guard! Take this straight up the northern road to the Highland Council—Councilor Minh won’t be able to call STEM inequality a 'tradition' once he sees this spin.\""
    },
    "elena_after_highland": {
      "charKey": "elena",
      "mood": "Inspired",
      "text": "\"With the Vale Equal-Access Charter passed, twelve young girls and boys signed up for open robotics and tailoring-automation classes this very evening. Real change starts when talent meets policy.\""
    },

    "build_need_parts": {
      "charKey": "maya_happy",
      "mood": "Ready to Build",
      "showBlueprint": true,
      "text": "*Maya sets out her brass pliers.* \"We need 3 Mechanical Components to build Prototype IV (you currently have {comp}/3).\n\nTip: Open your Inventory [I] and click USE on the Mechanical Parts Chest for 2 free components, then grab 1 more at Barnaby's Marketplace with your 15% discount!\""
    },
    "build_step1": {
      "charKey": "maya_happy",
      "mood": "Build Step 1/3",
      "showBlueprint": true,
      "text": "*Clink! You lay out 3 sets of brass gears on the oak workbench.* \"Step 1: Drive Gear Ratio! We need to cut the force on Mom’s wrists by 60% without making the loom crawl like a snail. Which gear ratio should we mount?\"",
      "choices": [
        { "icon": "⚙️", "tag": "1:1 DIRECT DRIVE", "label": "Keep a 1:1 ratio for maximum speed.", "next": "build_retry_1a" },
        { "icon": "✅", "tag": "3:1 GEAR REDUCTION", "label": "Mount a 3:1 brass reduction train for smooth 60% torque relief.", "actions": ["sfx:buildClink"], "next": "build_step2" },
        { "icon": "🐢", "tag": "12:1 HEAVY WINCH", "label": "Install a massive 12:1 crane gear.", "next": "build_retry_1b" }
      ]
    },
    "build_retry_1a": {
      "charKey": "maya_happy",
      "mood": "Recalibrating",
      "showBlueprint": true,
      "text": "*Maya inspects the assembly and grins encouragingly.* \"1:1 spins fast, but it gives zero mechanical advantage—Clara’s wrists would still ache in winter! Try another ratio.\"",
      "nextAction": { "label": "Adjust Assembly", "next": "build_step1" }
    },
    "build_retry_1b": {
      "charKey": "maya_happy",
      "mood": "Recalibrating",
      "showBlueprint": true,
      "text": "*Maya inspects the assembly and laughs softly.* \"12:1 could lift a horse cart, haha—way too slow for stitching winter coats! Let’s balance speed and ease.\"",
      "nextAction": { "label": "Adjust Assembly", "next": "build_step1" }
    },
    "build_step2": {
      "charKey": "maya_happy",
      "mood": "Build Step 2/3",
      "showBlueprint": true,
      "text": "*The 3:1 gear train meshes cleanly!* \"Step 2: Thread Tension Arm! If the spring snaps mid-seam, it ruins a whole bolt of wool. What tension coil should we fit?\"",
      "choices": [
        { "icon": "🪢", "tag": "HEMP TWINE", "label": "Tie it tight with heavy twine to save brass.", "next": "build_retry_2a" },
        { "icon": "✅", "tag": "TEMPERED WATCH-SPRING", "label": "Install a tempered spiral watch-spring with adjustable stop.", "actions": ["sfx:buildClink"], "next": "build_step3" },
        { "icon": "🔩", "tag": "RIGID IRON BAR", "label": "Weld it completely rigid so it never moves.", "next": "build_retry_2b" }
      ]
    },
    "build_retry_2a": {
      "charKey": "maya_happy",
      "mood": "Recalibrating",
      "showBlueprint": true,
      "text": "*Maya tests the cord.* \"Twine stretches out after twenty turns—it won’t hold steady tension! Let’s use proper spring metal.\"",
      "nextAction": { "label": "Adjust Assembly", "next": "build_step2" }
    },
    "build_retry_2b": {
      "charKey": "maya_happy",
      "mood": "Recalibrating",
      "showBlueprint": true,
      "text": "*Maya taps the iron arm.* \"If the arm can’t flex at all, thick winter wool will snap the needle! It needs calibrated elasticity.\"",
      "nextAction": { "label": "Adjust Assembly", "next": "build_step2" }
    },
    "build_step3": {
      "charKey": "maya_happy",
      "mood": "Build Step 3/3",
      "showBlueprint": true,
      "text": "*The spring arm clicks smoothly into place!* \"Final Step: Workshop Safety! Leo is still learning the machine, and loose sleeves near open gears are dangerous. How do we finish Prototype IV?\"",
      "choices": [
        { "icon": "⚡", "tag": "LEAVE GEARS EXPOSED", "label": "Skip the casing so everyone can admire the spinning brass.", "next": "build_retry_3a" },
        { "icon": "🛠️", "tag": "BRASS GUARD & RELEASE LEVER", "label": "Bolt on a hinged brass finger-guard and quick-stop lever.", "actions": ["sfx:fanfare", "consume:mechanical_components:3", "questSuccess:mayas_loom"] }
      ]
    },
    "build_retry_3a": {
      "charKey": "maya_happy",
      "mood": "Recalibrating",
      "showBlueprint": true,
      "text": "*Maya shakes her head with a smile.* \"Exposed teeth look flashy, but good engineering puts the human operator’s safety first! Let’s shield it.\"",
      "nextAction": { "label": "Adjust Assembly", "next": "build_step3" }
    },

    "highland_done": {
      "charKey": "councilor_linh",
      "mood": "Respectful",
      "text": "*Councilor Minh bows warmly beneath the Council streetlights.* \"The Vale Equal-Access Charter is already bearing fruit. Changing one mind starts a spark; changing a bylaw lights the whole valley.\""
    },
    "highland_start": {
      "charKey": "councilor_linh",
      "mood": "Formal & Skeptical",
      "text": "*Councilor Minh taps his gavel on the marble podium.* \"You have earned {sc} Social Credibility in Vale, traveler—rare for an outsider. Yet you ask this Council to overturn thirty years of guild bylaws reserving engineering stipends for 'traditional male household heirs.' Why rewrite institutional law over one talented tailor’s daughter?\"",
      "choices": [
        { "icon": "🛠️", "tag": "DEMONSTRATE PROTOTYPE IV", "label": "Place Prototype IV on the podium—Maya isn’t an exception; she’s proof of what bias hides.", "when": "hasLoom", "next": "highland_stage2_loom" },
        { "icon": "📐", "tag": "CITE MAYA’S BLUEPRINT", "label": "Show Maya’s blueprints—talent shouldn’t be filtered by gender.", "whenNot": "hasLoom", "next": "highland_stage2_bp" },
        { "icon": "📉", "tag": "ECONOMIC ARGUMENT", "label": "Excluding half of Vale’s youth from STEM starves our entire valley’s productivity and innovation.", "next": "highland_stage2_loom" },
        { "icon": "🤷", "tag": "OVERSIMPLIFY", "label": "Just tell families to be nicer—we don’t really need written policy changes.", "next": "highland_oversimplify" }
      ]
    },
    "highland_oversimplify": {
      "charKey": "elena",
      "mood": "Sharp",
      "text": "*Guildmaster Elena leans in quietly.* \"Careful, traveler! Individual kindness helped Maya’s household, yes—but without changing the Council’s scholarship bylaws, the next girl without an advocate will hit the exact same wall.\"",
      "nextAction": { "label": "Reframe Your Argument", "next": "highland_start" }
    },
    "highland_stage2_loom": {
      "charKey": "councilor_linh",
      "mood": "Thoughtful",
      "showBlueprint": true,
      "text": "*You set Prototype IV onto the Council desk. Maya turns the brass crank effortlessly with two fingers—the gears whisper smoothly as Councilor Minh’s eyebrows shoot up.*\n\n\"Impressive... Yet families worry that opening STEM stipends to daughters will leave traditional trades understaffed. What charter do you propose this Council ratify?\"",
      "choices": [
        { "icon": "📜", "tag": "EQUAL-ACCESS CHARTER", "label": "Merit-based open admissions for ALL genders in both Engineering AND traditional trades—plus family mentorship grants.", "next": "highland_resolution" },
        { "icon": "🔒", "tag": "SPECIAL EXCEPTION ONLY", "label": "Grant a single one-time exception for Maya, and leave the old rules intact.", "next": "highland_exception_reject" }
      ]
    },
    "highland_stage2_bp": {
      "charKey": "councilor_linh",
      "mood": "Thoughtful",
      "showBlueprint": true,
      "text": "*Councilor Minh studies the blueprints and Guildmaster Elena’s assessment, slowly nodding.*\n\n\"Impressive... Yet families worry that opening STEM stipends to daughters will leave traditional trades understaffed. What charter do you propose this Council ratify?\"",
      "choices": [
        { "icon": "📜", "tag": "EQUAL-ACCESS CHARTER", "label": "Merit-based open admissions for ALL genders in both Engineering AND traditional trades—plus family mentorship grants.", "next": "highland_resolution" },
        { "icon": "🔒", "tag": "SPECIAL EXCEPTION ONLY", "label": "Grant a single one-time exception for Maya, and leave the old rules intact.", "next": "highland_exception_reject" }
      ]
    },
    "highland_exception_reject": {
      "charKey": "maya_happy",
      "mood": "Passionate",
      "text": "*Maya steps forward firmly.* \"No! If I walk through that Academy door and let it slam shut behind me, nothing truly changed for any other kid in Vale. Make the door open for everyone!\"",
      "nextAction": { "label": "Propose Systemic Reform", "next": "highland_stage2_loom" }
    },
    "highland_resolution": {
      "charKey": "councilor_linh",
      "mood": "Convinced",
      "text": "*Councilor Minh stamps the red wax seal onto crisp parchment.* \"Well argued, traveler. Open merit apprenticeships for every trade and STEM field—and support so sons like Leo and daughters like Maya alike can choose their own craft without fear. By decree of the Highland Council, the Vale Equal-Access Charter is law!\"",
      "nextAction": { "label": "Accept the Charter & Celebrate ✨", "actions": ["questSuccess:highland_hearing"] }
    },

    "replay_start": {
      "charKey": "maya",
      "mood": "Private Replay",
      "text": "[SAFE SANDBOX REPLAY — Your real save & reputation are protected.]\n\nExplore what happens when someone repeats subtle, everyday gender stereotypes to Maya:",
      "choices": [
        { "icon": "🗣️", "tag": "TEST SUBTLE BIAS", "label": "\"Engineering is mostly for boys, Maya—you’re already great at sewing, why make life harder?\"", "next": "replay_bias" },
        { "icon": "🤝", "tag": "TEST RESTORATIVE REPAIR", "label": "\"Wait—I realized how dismissive that sounded. Let me help mend things and listen properly.\"", "next": "replay_repair" }
      ]
    },
    "replay_bias": {
      "charKey": "maya",
      "mood": "Withdrawn (Impact)",
      "onEnter": ["unlockJournal:mayas_shadow_restorative"],
      "text": "*Maya slowly folds her blueprint and slides it back under the cloth.* \"Yeah... maybe you’re right. Maybe I was just being foolish.\"\n\n[SANDBOX INSIGHT: Even polite, well-meaning advice can quietly reinforce self-doubt and shut down STEM ambition. Notice how accountability & restorative listening reopen the door.]",
      "nextAction": { "label": "Return to Reflection Journal", "actions": ["openJournal"] }
    },
    "replay_repair": {
      "charKey": "maya_happy",
      "mood": "Reassured",
      "onEnter": ["unlockJournal:mayas_shadow_restorative"],
      "text": "*Maya exhales and pulls her blueprint back out.* \"Thank you for catching yourself. Nobody gets every conversation right on the first try—what matters is being willing to listen and repair trust.\"",
      "nextAction": { "label": "Return to Reflection Journal", "actions": ["openJournal"] }
    }
  }
};