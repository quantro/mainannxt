"use client";

import { useState, useCallback, useMemo } from "react";
import ThemeToggle from "../theme-toggle";
import { Disclaimer } from "../disclaimer";

interface Rune {
  name: string;
  letter: string;
  aett: string;
  element: string;
  norseGod: string;
  symbol: string;
  upright: string;
  merkstave: string;
  reading: string;
  keywords: string[];
  advice: string;
}

const RUNES: Rune[] = [
  // ── First Aett: Freyr's / Freyja's (Fehu–Wunjo) ──
  {
    name: "Fehu", letter: "F", aett: "First (Freyr)", element: "Fire", norseGod: "Freyr/Freyja",
    symbol: "ᚠ", upright: "Wealth, abundance, prosperity, new beginnings, earned success",
    merkstave: "Loss, scarcity, emptiness, missed opportunity, financial struggle",
    reading: "Fehu is the rune of cattle, of mobile wealth in the old Norse world. In a society where wealth was measured in herds, Fehu represented not just prosperity but the freedom and status that came with it. This rune appears when material abundance is flowing toward you — a reward for past efforts, a new opportunity, or the culmination of hard work. But Fehu carries a deeper lesson: wealth is energy, not a destination. Like cattle that must be moved to fresh pastures, abundance must be kept in motion. Hoarding leads to stagnation. Fehu asks you to receive what is coming to you with gratitude and to keep the energy flowing by sharing, investing, or putting your resources to meaningful use. The horns of the cattle curve upward, reminding you that prosperity should elevate not just your station but your spirit. Where in your life are you being asked to receive? Where are you being called to let abundance flow through you rather than clinging to it?",
    keywords: ["wealth", "abundance", "prosperity"],
    advice: "What flows in must flow out. Receive with grace, share with purpose.",
  },
  {
    name: "Uruz", letter: "U", aett: "First (Freyr)", element: "Earth", norseGod: "Thor",
    symbol: "ᚢ", upright: "Strength, vitality, courage, endurance, untamed potential",
    merkstave: "Weakness, illness, lack of motivation, misplaced force, domination",
    reading: "Uruz is the aurochs, the great wild ox that once roamed the forests of Europe. Unlike Fehu's domesticated cattle, Uruz represents raw, untamed strength — the primal life force that cannot be broken or tamed. This rune appears when you need to summon your deepest reserves of courage and vitality. The aurochs does not ask permission. It does not wait for the right moment. It simply acts with the full force of its being. Uruz calls you to step into your power without apology. There is a situation before you that requires not subtlety but raw determination. The strength you need is already within you. The question is whether you will access it. Uruz also speaks to transformation — the shedding of old skin, the death of the old self so the new can emerge. The aurochs was hunted to extinction, but its spirit endures as a reminder that true power comes from aligning with your deepest, most authentic nature. What would you do if you were not afraid of your own strength?",
    keywords: ["strength", "vitality", "courage"],
    advice: "You are stronger than you know. Stop asking permission and act.",
  },
  {
    name: "Thurisaz", letter: "TH", aett: "First (Freyr)", element: "Fire", norseGod: "Thor",
    symbol: "ᚦ", upright: "Protection, defense, conflict, catalyst, boundary",
    merkstave: "Danger, betrayal, vulnerability, recklessness, defensive aggression",
    reading: "Thurisaz is the thorn and the giant. It is the sharp point that both wounds and protects. In the old rune poems, the thorn is described as a thing that is 'exceedingly sharp, an evil thing for any knight to touch.' This is the rune of necessary confrontation. Thurisaz appears when you must draw a boundary, defend what is yours, or face a conflict you have been avoiding. The giant in Norse mythology is not always an enemy — sometimes the giant is a force of raw, primal nature that must be acknowledged. Thurisaz is the rune of the gatekeeper, the guardian of thresholds. It marks the boundary between the known and the unknown, the safe and the dangerous. When this rune appears, you are being asked to stand your ground. The conflict before you is not random. It is a catalyst for growth. The thorn that pricks you today draws blood, but it also opens a wound that needed to be lanced. Face the challenge directly. Your boundaries are not barriers — they are the walls that define the sacred space of your life.",
    keywords: ["protection", "conflict", "boundary"],
    advice: "The thorn defends the rose. Set your boundaries with clarity and conviction.",
  },
  {
    name: "Ansuz", letter: "A", aett: "First (Freyr)", element: "Air", norseGod: "Odin",
    symbol: "ᚨ", upright: "Wisdom, communication, inspiration, divine message, truth",
    merkstave: "Miscommunication, lies, deceit, manipulation, confusion",
    reading: "Ansuz is the rune of Odin, the All-Father who sacrificed his eye at Mimir's well for wisdom and hung himself on Yggdrasil for nine nights to attain the knowledge of the runes. This is the rune of divine communication, of words that carry power, of inspiration that comes from beyond the veil of ordinary consciousness. Ansuz appears when a message is coming to you — from the universe, from a teacher, from your own deepest wisdom. It is the rune of the breath, of speech, of the spoken word that shapes reality. Pay attention to what you are hearing and reading in the coming days. Pay even closer attention to what you are saying. Your words have more power than you realize. This is also a time for seeking wisdom from those who have walked the path before you. Ansuz asks you to open your mind to teachings that may challenge your current understanding. The ravens of Odin — Huginn (Thought) and Muninn (Memory) — fly across the world each day, bringing back knowledge. Are you willing to see what they see?",
    keywords: ["wisdom", "communication", "inspiration"],
    advice: "Words shape worlds. Speak with intention, listen with reverence.",
  },
  {
    name: "Raidho", letter: "R", aett: "First (Freyr)", element: "Air", norseGod: "Forseti",
    symbol: "ᚱ", upright: "Journey, travel, rhythm, order, right action",
    merkstave: "Stagnation, disruption, detour, lack of direction, wrong path",
    reading: "Raidho is the rune of the wheel, the journey, the right path. In the old Norse world, the thing that made civilization possible was the road — the connection between settlements, the ability to travel, trade, and communicate. Raidho represents the ordered movement of the cosmos, the rhythm of the sun crossing the sky, the wheel of the year turning. This rune appears when you are on a journey — literally or metaphorically. It confirms that you are on the right path, that the road you have chosen is aligned with your true purpose. But Raidho also asks you to examine the rhythm of your life. Is there order or chaos in your daily movements? Are you moving with purpose or just staying busy? The wheel must be balanced to turn smoothly. Raidho sometimes appears at a crossroads, asking you to choose your direction consciously. The journey ahead is significant. It may not be comfortable, but it is necessary. Trust the path that reveals itself step by step. The destination is not the point — the journey itself is the teacher.",
    keywords: ["journey", "travel", "rhythm"],
    advice: "The path reveals itself to those who take the first step with purpose.",
  },
  {
    name: "Kenaz", letter: "K", aett: "First (Freyr)", element: "Fire", norseGod: "Heimdall",
    symbol: "ᚲ", upright: "Creativity, illumination, knowledge, fire, transformation",
    merkstave: "Darkness, confusion, loss of vision, creative block, destruction",
    reading: "Kenaz is the torch, the fire that illuminates the darkness and transforms raw material into something useful. In the old rune poems, the torch is described as 'known to every living man by its pale, bright flame.' Kenaz is the fire of creativity, the spark of inspiration that turns vision into reality. This rune appears when you have a breakthrough coming — a moment of clarity when something that has been hidden becomes visible. Kenaz is the light that reveals truth, but it is also the fire that burns away what is false. The torch cannot be lit without consuming fuel. Something must be sacrificed to feed the flame. What are you willing to burn away to see clearly? Kenaz also represents the controlled use of fire — the forge fire that shapes metal, the hearth fire that warms the home. Your creative power must be channeled with skill and intention. Raw inspiration without discipline produces only smoke. This is a time to bring your gifts into form.",
    keywords: ["creativity", "illumination", "transformation"],
    advice: "The torch reveals what was hidden. Let your inner fire illuminate the truth.",
  },
  {
    name: "Gebo", letter: "G", aett: "First (Freyr)", element: "Air", norseGod: "Odin",
    symbol: "ᚷ", upright: "Gift, generosity, partnership, balance, exchange",
    merkstave: "Obligation, imbalance, greed, one-sided giving, sacrifice",
    reading: "Gebo is the rune of the gift, one of the most sacred concepts in Norse culture. In the old world, gifts created bonds that were as strong as blood. To receive a gift was to enter into a relationship of mutual honor and obligation. Gebo represents the sacred exchange — not the transaction of commerce, but the deeper giving and receiving that binds people together in trust and respect. This rune appears when a significant relationship is forming or being tested. It asks you to examine the balance of giving and receiving in your life. Are you giving too much and receiving too little? Are you holding back, afraid to give freely? True generosity is not about keeping score. It is about giving from the fullness of your heart and receiving with gratitude. Gebo is also the rune of the sacred marriage, the union of opposites that creates wholeness. The X shape of the rune represents two forces meeting in balance. A gift is coming, but it may not look like what you expect. Open your hands to receive.",
    keywords: ["gift", "generosity", "partnership"],
    advice: "The gift that binds is the gift freely given. Give without expectation.",
  },
  {
    name: "Wunjo", letter: "W", aett: "First (Freyr)", element: "Water", norseGod: "Frigg",
    symbol: "ᚹ", upright: "Joy, harmony, community, belonging, fulfillment",
    merkstave: "Sorrow, discord, alienation, dissatisfaction, false joy",
    reading: "Wunjo is the rune of joy, of belonging, of the deep satisfaction that comes from being in right relationship with yourself and your community. In the old rune poems, Wunjo is described as 'that which dwells with those who know no sorrow.' It is the bliss of the well-lived life, the harmony that arises when all is in balance. This rune appears when a period of difficulty is ending and joy is returning. Wunjo does not promise perfect happiness — it promises something deeper: the contentment that comes from knowing your place in the weave of things. The banner shape of Wunjo suggests a flag flying in celebration, a signal that the community is gathered in feast and fellowship. Wunjo asks you to notice the small joys, the connections that sustain you, the moments of grace that remind you that life is good even in its struggles. If Wunjo appears in reverse, it warns that you may be alienated from your community or from your own capacity for joy. What would it take to return to harmony?",
    keywords: ["joy", "harmony", "belonging"],
    advice: "Joy is not the absence of struggle — it is the presence of meaning and connection.",
  },
  // ── Second Aett: Hagal's (Hagalaz–Sowulo) ──
  {
    name: "Hagalaz", letter: "H", aett: "Second (Hagal)", element: "Water", norseGod: "Heimdall",
    symbol: "ᚺ", upright: "Disruption, destruction, transformation, natural forces",
    merkstave: "Delay, resistance to change, chaos, catastrophe, clearing",
    reading: "Hagalaz is the hailstone, the frozen water that falls from the sky without warning, destroying crops and shattering what is exposed. In the old rune poems, hail is described as 'the whitest of grains, whirled from the vault of heaven.' This is the rune of forces beyond your control — the storm that you did not summon but must endure. Hagalaz appears when your life is being shaken by events that feel destructive. A job loss, a breakup, a sudden illness, an unexpected crisis. The temptation is to resist, to cling to what is being torn away. But Hagalaz teaches that destruction is also creation in disguise. The hailstorm passes, and the fields that survive are stronger. The tree that bends in the wind does not break. This rune asks you to surrender to the forces that are greater than you. You cannot control the storm, but you can control how you meet it. The hail that beats down also clears the air. When the storm passes, you will see the landscape differently. What is being cleared from your life to make way for something new?",
    keywords: ["disruption", "transformation", "natural forces"],
    advice: "The storm is not personal. It is the clearing that makes way for new growth.",
  },
  {
    name: "Nauthiz", letter: "N", aett: "Second (Hagal)", element: "Fire", norseGod: "Skadi",
    symbol: "ᚾ", upright: "Necessity, constraint, endurance, resilience, need-fire",
    merkstave: "Extreme hardship, desperation, survival mode, burnout",
    reading: "Nauthiz is the rune of need, of the fire that is struck from flint when ice threatens survival. In the old rune poems, need is described as 'the bondmaid's labor, a cold companion in the winter night.' This is the rune of difficult times that demand everything you have. Nauthiz appears when you are in a period of constraint — financial hardship, emotional isolation, physical limitation. The need-fire is not comfortable, but it is necessary. It is the spark that keeps you alive when everything else is cold. Nauthiz teaches that necessity is the mother of resilience. There is strength in you that you did not know existed, and it is being forged in the fire of this challenge. The bind rune of Nauthiz looks like two sticks crossed for making fire. The friction creates the flame. Your resistance to this situation is not helping. Accept the constraint. Work within it. Let the need-fire teach you what you are truly capable of. This too will pass, and you will emerge from it harder, sharper, and more alive.",
    keywords: ["necessity", "endurance", "resilience"],
    advice: "The need-fire burns brightest in the darkest winter. Endure and you will be forged anew.",
  },
  {
    name: "Isa", letter: "I", aett: "Second (Hagal)", element: "Water", norseGod: "Vili/Ve",
    symbol: "ᛁ", upright: "Stillness, ice, patience, conservation, clarity in freeze",
    merkstave: "Stagnation, coldness, isolation, frozen emotions, paralysis",
    reading: "Isa is the rune of ice, of the frozen stillness that descends in the deepest winter. In the old rune poems, ice is described as 'the cold, the slippery, the glittering glass, the frost that covers the ground.' This is the rune of pure suspension — a time when nothing moves, nothing changes, nothing grows. Isa appears when your life has entered a period of enforced stillness. You want to act, to move, to change things, but the ice holds you fast. The river is frozen. The seed sleeps beneath the frost. Isa asks you to stop struggling and accept the pause. There is a purpose in this stillness. The ice preserves what is beneath it. The seed is not dead — it is waiting for the right season. Your situation is not stagnant by accident. The freeze is protecting something, holding space for a transformation that cannot happen in motion. Use this time for inner reflection. The clarity that comes in stillness is different from the clarity of action. When the ice breaks in spring, you will be ready to move. Until then, be still and know.",
    keywords: ["stillness", "patience", "conservation"],
    advice: "The river flows beneath the ice. Trust the stillness and prepare for the thaw.",
  },
  {
    name: "Jera", letter: "J", aett: "Second (Hagal)", element: "Earth", norseGod: "Frigg",
    symbol: "ᛃ", upright: "Harvest, cycles, reward, culmination, natural timing",
    merkstave: "Delay, bad timing, poor planning, disappointment, drought",
    reading: "Jera is the rune of the harvest, of the cycle of planting and reaping that governs all life. In the old rune poems, the year is described as 'the joy of men, when the gods make the fields to flourish.' Jera represents the natural rhythm of effort and reward, of work and rest, of the seasons that turn regardless of our wishes. This rune appears when a cycle is completing. The seeds you planted — in your work, your relationships, your spiritual practice — are ready to be harvested. Jera does not promise a bountiful harvest regardless of what you sowed. The law of this rune is simple: you reap what you have sown. If you have planted with care and patience, the harvest will be good. If you have been careless, the results will reflect that. But Jera also reminds us that not every harvest happens on our timeline. The grain must grow in its own season. You cannot rush the ripening. Trust the timing of your life. The wheel is turning, and your season is coming. The J shape of the rune suggests the cycle turning back on itself, the eternal return of the seasons. What you sow today, you will reap tomorrow.",
    keywords: ["harvest", "cycles", "reward"],
    advice: "The harvest comes to those who plant with patience and tend with care.",
  },
  {
    name: "Eihwaz", letter: "EI", aett: "Second (Hagal)", element: "Earth", norseGod: "Yggdrasil",
    symbol: "ᛇ", upright: "Endurance, resilience, the world-tree, death and rebirth",
    merkstave: "Weakness, giving up, decay, avoidance of necessary end",
    reading: "Eihwaz is the rune of the yew tree, the oldest and most enduring tree in the Norse landscape. The yew can live for thousands of years, its wood so hard and flexible that it was used for the bows that defended the northern peoples. Eihwaz is also the rune of Yggdrasil, the world-tree that connects the nine realms of Norse cosmology. This rune appears when you are being tested at the deepest level. The yew does not break in the storm — it bends, survives, outlasts. Eihwaz asks you to access the same quality of enduring strength. You are in a period that requires not flashy action but quiet resilience. The roots of the tree reach deep into the earth, drawing strength from the dark places. What you are going through is connecting you to something ancient and profound. Eihwaz is also the rune of death and rebirth — the understanding that nothing truly dies, it only transforms. The yew's branches that touch the ground take root and become new trees. Let go of what must die so that new life can emerge.",
    keywords: ["endurance", "resilience", "world-tree"],
    advice: "Root yourself deep. The storm cannot break what is anchored in the earth.",
  },
  {
    name: "Perth", letter: "P", aett: "Second (Hagal)", element: "Water", norseGod: "Frigg",
    symbol: "ᛈ", upright: "Mystery, fate, secrets, hidden potential, the unknown",
    merkstave: "Secrets revealed, bad luck, unwanted exposure, disappointment",
    reading: "Perth is the rune of the lot cup, the vessel from which the runes were cast. In the old world, the casting of lots was a sacred act of consulting fate. Perth represents the mystery of what is hidden, the unknown potential that has not yet been revealed. This is the rune of divination itself, of looking into the darkness to find what is waiting to be born. Perth appears when something is hidden from you — but not to punish you. The mystery is unfolding in its own time. You are not meant to know everything yet. The lot cup is shaken, the runes are cast, but the outcome is not determined until the casting is complete. Perth asks you to embrace the uncertainty. Not all questions have answers in the moment. Some truths must be lived into rather than discovered. The cup holds both fortune and misfortune — the runes do not lie, but they do not always speak in clear language. Trust that what is hidden will be revealed when you are ready to receive it. The waiting is part of the preparation.",
    keywords: ["mystery", "fate", "secrets"],
    advice: "Not every question needs an answer now. Let the mystery unfold in its own time.",
  },
  {
    name: "Algiz", letter: "Z", aett: "Second (Hagal)", element: "Air", norseGod: "Heimdall",
    symbol: "ᛉ", upright: "Protection, guardian, divine connection, higher self",
    merkstave: "Vulnerability, hidden danger, false protection, betrayal",
    reading: "Algiz is the rune of the elk, the great beast of the northern forests that defends its herd with fierce determination. It is also the rune of the raised arms of the divine — the posture of prayer, of reaching toward the higher realms for guidance and protection. Algiz appears when you are being watched over. Not by a literal guardian, but by the protective forces of the universe — your ancestors, your higher self, the gods and spirits that walk with you. The danger you feared is being held at bay. The path before you is clear because forces beyond your perception are clearing it. Algiz asks you to trust in this protection but also to stand tall in your own power. The elk does not wait passively for danger to pass. It stands guard, alert, ready to defend. You are being called to be your own protector. Raise your arms to the sky and claim your connection to the divine. You are not alone, but you are also not helpless. The protection is real, but so is your responsibility to stand firm in your own strength.",
    keywords: ["protection", "guardian", "divine connection"],
    advice: "You are protected, but not passive. Stand tall, stay alert, trust your connection.",
  },
  {
    name: "Sowulo", letter: "S", aett: "Second (Hagal)", element: "Fire", norseGod: "Baldr",
    symbol: "ᛋ", upright: "Sun, vitality, success, wholeness, life-force",
    merkstave: "Burnout, loss of direction, false success, arrogance, overreach",
    reading: "Sowulo is the rune of the sun, the source of all light and life in the Norse cosmos. The sun wheel turns across the sky, bringing warmth, growth, and the certainty that darkness will always yield to light. Sowulo is the rune of ultimate success, of the wholeness that comes from aligning your will with the divine purpose of the universe. This rune appears when victory is near. The darkness is ending, and the light is returning. Sowulo represents not just success but the vitality that makes success possible — the life-force that flows through you when you are living in alignment with your true purpose. The sun does not struggle to shine. It simply radiates. Sowulo asks you to stop striving and start being. Your success is not something you need to chase. It is the natural expression of who you are when you are fully alive. Let your light shine without apology. The world needs what only you can give. The lightning bolt shape of Sowulo also represents the sudden flash of illumination — the moment of absolute clarity when you see your path with perfect certainty.",
    keywords: ["sun", "vitality", "success"],
    advice: "You are the sun in your own sky. Stop trying to earn light that is already yours.",
  },
  // ── Third Aett: Tyr's (Teiwaz–Othala) ──
  {
    name: "Teiwaz", letter: "T", aett: "Third (Tyr)", element: "Fire", norseGod: "Tyr",
    symbol: "ᛏ", upright: "Courage, justice, warrior spirit, self-sacrifice, honor",
    merkstave: "Cowardice, injustice, lack of principle, betrayal, weakness",
    reading: "Teiwaz is the rune of Tyr, the one-handed god of justice and the warrior's code. Tyr sacrificed his hand to bind the wolf Fenrir, knowing that the loss was necessary for the greater good. This is the rune of principled action, of doing what is right even when it costs you something precious. Teiwaz appears when you are being called to stand up for what is right. Not what is easy. Not what is safe. What is right. The arrow shape of Teiwaz points upward, toward the higher principles that guide noble action. This is not the aggression of Thurisaz — this is the focused, disciplined courage of the true warrior. The warrior who fights not for glory but for justice. Teiwaz asks you to examine your principles. What are you willing to sacrifice for what you believe in? What battles are worthy of your courage? The answer to these questions defines your character more than any outcome. Even in defeat, the warrior who acts with honor is never truly defeated. Stand your ground. Do the right thing. Let the consequences be what they will.",
    keywords: ["courage", "justice", "honor"],
    advice: "Do what is right, not what is easy. Honor is the reward of principled action.",
  },
  {
    name: "Berkana", letter: "B", aett: "Third (Tyr)", element: "Earth", norseGod: "Frigg",
    symbol: "ᛒ", upright: "Growth, fertility, nurturing, new life, renewal",
    merkstave: "Stagnation, infertility, neglect, family issues, blocked growth",
    reading: "Berkana is the rune of the birch tree, one of the first trees to colonize barren land after the ice retreats. The birch is a pioneer, a nurturer, a bringer of new life to depleted soil. Berkana represents the feminine principle of growth and renewal — not the fiery creativity of Kenaz, but the patient, nurturing power that supports life as it unfolds in its own time. This rune appears when something new is growing. A project, a relationship, a phase of life. Berkana is not about dramatic breakthroughs. It is about the quiet, steady process of growth that happens beneath the surface, invisible but unstoppable. The birch tree does not force its branches upward. It simply receives the sun and rain and grows toward the light. Berkana asks you to trust the process of growth. You cannot rush a seed into becoming a tree. You can only provide the conditions for growth and wait. Nurture what is growing in your life with patience and gentle attention. The birch also teaches resilience — it bends in the wind, survives the harshest winters, and always returns in spring. So will you.",
    keywords: ["growth", "fertility", "nurturing"],
    advice: "Nurture what is growing. Patience is the midwife of all great transformations.",
  },
  {
    name: "Ehwaz", letter: "E", aett: "Third (Tyr)", element: "Earth", norseGod: "Freyr",
    symbol: "ᛖ", upright: "Trust, partnership, progress, loyalty, teamwork",
    merkstave: "Betrayal, mistrust, disharmony, stalled progress, misalignment",
    reading: "Ehwaz is the rune of the horse, the faithful companion that carried the Norse people across vast distances. In the old world, the horse was not a tool but a partner — a living being whose trust and cooperation were earned through patient relationship. Ehwaz represents the power of partnership, of two beings moving in harmony toward a shared purpose. This rune appears when progress depends on relationship. You cannot do this alone. Whether it is a romantic partnership, a business collaboration, or a creative alliance, Ehwaz says that the key to forward movement is trust. The two horses of Ehwaz run side by side, matching each other's pace, supporting each other's strength. Ehwaz asks you to examine the quality of your partnerships. Are you and your companion moving in the same direction? Is there mutual trust and respect? Ehwaz also represents the journey itself — the steady progress that comes from consistent, harmonious effort. The horse does not gallop forever. It finds a rhythm, a pace that can be sustained. Find your rhythm and trust the one who travels beside you.",
    keywords: ["trust", "partnership", "progress"],
    advice: "No one journeys alone. Trust the one who travels beside you.",
  },
  {
    name: "Mannaz", letter: "M", aett: "Third (Tyr)", element: "Air", norseGod: "Heimdall",
    symbol: "ᛗ", upright: "Humanity, community, self, cooperation, collective",
    merkstave: "Isolation, selfishness, disconnection, identity crisis, manipulation",
    reading: "Mannaz is the rune of humanity, of the shared experience that binds all people together. In the old rune poems, man is described as 'the delight of man, the augmentation of the earth.' Mannaz represents the individual self in relation to the collective — the understanding that no one is an island, that we are all part of a greater whole. This rune appears when your relationship with yourself or with your community is under examination. Mannaz asks you to look in the mirror with honesty. Who are you outside of your roles and responsibilities? What is your true self, the one that exists beneath the masks you wear? But Mannaz also asks you to look outward. How do you contribute to your community? Are you taking more than you give? The shape of Mannaz suggests two figures standing together, supporting each other. The rune reminds you that your personal growth is inseparable from the health of the collective. Heal yourself, but also contribute to the healing of the world around you. The individual and the community are not in opposition — they are two halves of a single truth.",
    keywords: ["humanity", "community", "self"],
    advice: "Know yourself, serve your community. The two are one.",
  },
  {
    name: "Laguz", letter: "L", aett: "Third (Tyr)", element: "Water", norseGod: "Njord",
    symbol: "ᛚ", upright: "Flow, intuition, emotion, water, unconscious mind",
    merkstave: "Stagnation, emotional turmoil, denial, overwhelm, avoidance",
    reading: "Laguz is the rune of water — the lake, the sea, the flowing river that shapes the land. In the old rune poems, water is described as 'the endless, the cooling, the thing that seems to the unwise to be unending.' Laguz represents the deep, flowing power of the unconscious mind, the emotions that move beneath the surface of awareness, the intuition that guides you when logic fails. This rune appears when you are being asked to trust the flow of life. You cannot control the river by fighting it. You can only surrender to its current and trust that it carries you where you need to go. Laguz is the rune of the intuitive leap, the sudden knowing that comes not from reasoning but from feeling. The water does not ask where it is going — it simply flows, finding the path of least resistance, always moving toward the sea. Laguz asks you to trust your feelings. Not your thoughts, not your plans, not what others have told you. Your deepest knowing is guiding you. The unconscious speaks in dreams, in sudden insights, in the quiet voice that whispers when you are still enough to hear it. Listen to the water.",
    keywords: ["flow", "intuition", "emotion"],
    advice: "Trust the current. The river knows the way to the sea.",
  },
  {
    name: "Ingwaz", letter: "NG", aett: "Third (Tyr)", element: "Earth", norseGod: "Freyr",
    symbol: "ᛝ", upright: "Fertility, completion, inner growth, seed potential",
    merkstave: "Stalled growth, incompletion, infertility, dispersal of energy",
    reading: "Ingwaz is the rune of the god Freyr, the lord of peace, fertility, and prosperity. Ingwaz represents the seed that lies dormant in the dark earth, holding within it the potential for a mighty oak. This is the rune of completion and new beginning at the same time — the cycle ending so the next can begin. Ingwaz appears when something is completing. A phase of life, a project, a relationship. But unlike the endings of Hagalaz or the harvest of Jera, Ingwaz's completion is internal. The seed is fully formed, ready to break through the soil, but not yet emerging. This is a time of gestation, of inner preparation. What is growing within you is nearly ready to be born, but it is not time yet. Ingwaz asks you to honor this period of quiet completion. Do not try to force the emergence. The seed knows when to sprout. The box shape of Ingwaz represents containment, the sacred space where transformation happens in secret. Trust what is growing within you. When the time is right, it will break through the surface and reach for the sun.",
    keywords: ["fertility", "completion", "inner growth"],
    advice: "What grows in secret will one day break through the soil. Trust the hidden process.",
  },
  {
    name: "Dagaz", letter: "D", aett: "Third (Tyr)", element: "Fire", norseGod: "Baldr",
    symbol: "ᛞ", upright: "Breakthrough, transformation, awakening, daylight, clarity",
    merkstave: "Blindness, stuck transition, fear of change, delayed dawn",
    reading: "Dagaz is the rune of the dawn, the moment when night turns to day and the world is revealed in a new light. In the old rune poems, day is described as 'the light of the gods, the joy of men, the hope of the living.' Dagaz represents the breakthrough you have been waiting for — the moment of awakening when everything changes. This rune appears at a turning point. The long night is ending. The dawn is breaking. Dagaz does not creep in gradually — it arrives, sudden and complete, like the first ray of sun over the horizon. The shift you have been waiting for is here. The answer you have been seeking is now visible. The obstacle that blocked your path has dissolved. Dagaz asks you to step into the new day with confidence. The butterfly shape of the rune represents transformation — the complete metamorphosis from one state of being to another. You are not the same person who entered this night. The dawn reveals a new world and a new you. Do not cling to the darkness that has passed. The light is here. Step into it fully.",
    keywords: ["breakthrough", "transformation", "awakening"],
    advice: "The dawn is here. Step into the light and leave the darkness behind.",
  },
  {
    name: "Othala", letter: "O", aett: "Third (Tyr)", element: "Earth", norseGod: "Frigg",
    symbol: "ᛟ", upright: "Heritage, home, ancestry, inheritance, belonging",
    merkstave: "Displacement, exile, loss of heritage, uprooted, estrangement",
    reading: "Othala is the rune of the homeland, the ancestral property that was passed down through generations. In the old Norse world, land was not just property — it was identity. Your odal was your connection to your ancestors, your place in the world, your inheritance both material and spiritual. Othala represents the ground you stand on, the traditions that shaped you, the blood that flows in your veins. This rune appears when your relationship with your roots is being examined. Othala asks you to honor where you come from. Not to be trapped by the past, but to draw strength from it. The diamond shape of Othala represents the ancestral hall, the home that shelters generations. What have your ancestors passed down to you? Not just property, but wisdom, resilience, values, ways of being in the world. Othala also speaks to the legacy you are creating. What are you building that will outlast you? The true inheritance is not material — it is the way you live, the values you embody, the love you leave behind. Honor the past, but build for the future. Your descendants will stand on the ground you prepare for them.",
    keywords: ["heritage", "home", "ancestry"],
    advice: "Honor your roots, but do not be bound by them. Build a legacy worthy of your ancestors.",
  },
];

function getRuneImage(name: string): string {
  return `/runes/${name.toLowerCase()}.svg`;
}

type Spread = "single" | "three" | "five";

const SPREADS: Record<Spread, { label: string; positions: string[] }> = {
  single: { label: "Single Rune", positions: ["Your Guidance"] },
  three: { label: "Three Rune", positions: ["Past — Foundation", "Present — Challenge", "Future — Path Forward"] },
  five: { label: "Five Rune", positions: ["Present Situation", "Challenge", "What Is Hidden", "Advice", "Outcome"] },
};

const AETTS = ["First (Freyr)", "Second (Hagal)", "Third (Tyr)"] as const;
const AETT_DESCS: Record<string, string> = {
  "First (Freyr)": "Creation, abundance, earthly life — Freyr/Freyja",
  "Second (Hagal)": "Challenge, necessity, illumination — Heimdall/Hagal",
  "Third (Tyr)": "Courage, partnership, legacy — Tyr",
};

function getConclusion(
  runes: { rune: Rune; merkstave: boolean }[],
  spread: Spread,
): string {
  if (spread === "single") {
    const r = runes[0];
    if (!r) return "";
    return `This single rune reading centers on ${r.rune.name}. ${r.merkstave ? r.rune.merkstave : r.rune.upright}. ${r.rune.advice} The energy of this rune is your focus. Sit with its symbol and notice how its meaning resonates in your daily life over the coming days.`;
  }

  if (spread === "three") {
    const parts: string[] = [];
    if (runes[0]) parts.push(`Your foundation is ${runes[0].rune.name}${runes[0].merkstave ? " merkstave (reversed)" : ""}.`);
    if (runes[1]) parts.push(`Your present challenge is ${runes[1].rune.name}${runes[1].merkstave ? " merkstave" : ""}.`);
    if (runes[2]) parts.push(`The path forward brings ${runes[2].rune.name}${runes[2].merkstave ? " merkstave" : ""}.`);
    return `Three runes tell a story of movement. ${parts.join(" ")} Together they reveal how the past has shaped you, what you are being asked to face now, and where your path leads. The wisdom of the runes is practical: nothing changes until something is released. Let the middle rune guide your next action.`;
  }

  if (spread === "five") {
    const outcome = runes[4];
    const major = runes.filter((r) => ["Fehu", "Hagalaz", "Dagaz", "Sowulo", "Ansuz", "Teiwaz"].includes(r.rune.name));
    const keyMsg = major.length > 0
      ? `Powerful runes like ${major.map((r) => r.rune.name).join(", ")} indicate significant forces at work.`
      : "The focus is on steady, practical energies for the path ahead.";
    return `This five-rune cross reveals your situation in depth. ${keyMsg} ${outcome ? `The outcome rune, ${outcome.rune.name}${outcome.merkstave ? " merkstave" : ""}, suggests where this path leads.` : ""} The pattern invites you to see beyond the surface — what is hidden in position 3 holds the key to your growth. Reflect on the advice rune (position 4) as your guide.`;
  }

  return "";
}

export default function RunesPage() {
  const [spread, setSpread] = useState<Spread>("single");
  const [runes, setRunes] = useState<{ rune: Rune; merkstave: boolean }[]>([]);
  const [dealt, setDealt] = useState(false);
  const [showAett, setShowAett] = useState<string | null>(null);

  const deal = () => {
    const count = SPREADS[spread].positions.length;
    const shuffled = [...RUNES].sort(() => Math.random() - 0.5).slice(0, count);
    setRunes(shuffled.map((r) => ({ rune: r, merkstave: Math.random() < 0.3 })));
    setDealt(true);
  };

  const conclusion = useMemo(() => getConclusion(runes, spread), [runes, spread]);

  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-12">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <h1 className="apple-headline text-[34px] leading-[1.47] tracking-[-0.374px] mb-2">
        Rune Divination
      </h1>
      <p className="text-[13px] text-[var(--color-ink-muted-48)] mb-8 text-center max-w-lg">
        Cast the Elder Futhark — 24 ancient Norse runes of wisdom, fate, and guidance.
      </p>

      {/* Spread selector */}
      <div className="w-full max-w-2xl apple-card px-6 py-5 mb-5">
        <div className="flex gap-2">
          {(Object.entries(SPREADS) as [Spread, typeof SPREADS[Spread]][]).map(([key, s]) => (
            <button
              key={key}
              onClick={() => { setSpread(key); setRunes([]); setDealt(false); }}
              className={`flex-1 px-3 py-2.5 rounded-[11px] text-[13px] font-semibold transition-all ${
                spread === key
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-[var(--color-surface-pearl)] text-[var(--color-ink-muted-48)] hover:brightness-95"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={deal}
        className="apple-btn-primary h-12 px-10 text-[15px] font-semibold mb-6"
      >
        Cast the Runes
      </button>

      {/* Dealt runes */}
      {dealt && runes.length > 0 && (
        <div className="w-full max-w-4xl space-y-5">
          <div className={`grid gap-4 ${
            spread === "five" ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3" : spread === "three" ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-1 sm:grid-cols-1 max-w-sm mx-auto"
          }`}>
            {runes.map(({ rune, merkstave }, i) => (
              <div key={i} className="flex flex-col items-center">
                <div
                  className="w-full rounded-[14px] p-4 flex flex-col items-center"
                  style={{
                    background: "linear-gradient(145deg, #f5efe6, #ece3d5)",
                    border: `2px solid ${merkstave ? "#c0392b" : "#5a4a3a"}40`,
                    boxShadow: `0 4px 20px ${merkstave ? "#c0392b" : "#5a4a3a"}15`,
                  }}
                >
                  <img
                    src={getRuneImage(rune.name)}
                    alt={rune.name}
                    className="w-[100px] h-auto my-1 rounded-[6px]"
                    loading="lazy"
                  />
                  <div className="text-[14px] font-bold text-center text-[#1a1a1a] leading-tight mt-1">
                    {rune.name}
                  </div>
                  <div className="text-[9px] text-center mt-1 px-2 py-0.5 rounded-full" style={{ background: "#5a4a3a15", color: "#5a4a3a" }}>
                    {rune.letter} &middot; {rune.element} &middot; {rune.aett}
                  </div>
                  {merkstave && (
                    <div className="text-[9px] text-red-500 font-semibold mt-1 uppercase tracking-wider">
                      Merkstave (Reversed)
                    </div>
                  )}
                </div>
                <div className="text-[10px] text-[var(--color-ink-muted-48)] mt-2 font-semibold text-center">
                  {SPREADS[spread].positions[i]}
                </div>
              </div>
            ))}
          </div>

          {/* Detailed readings */}
          {runes.map(({ rune, merkstave }, i) => (
            <div key={`reading-${i}`} className="apple-card px-6 py-5">
              <div className="flex items-start justify-between mb-1">
                <div>
                  <h3 className="text-[17px] font-bold text-[var(--color-ink)]">
                    {rune.symbol} {rune.name} ({rune.letter})
                  </h3>
                  <div className="text-[11px] text-[var(--color-ink-muted-48)]">
                    {SPREADS[spread].positions[i]}
                    {merkstave && <span className="text-red-500 ml-2 font-semibold">Merkstave (Reversed)</span>}
                  </div>
                </div>
                <div className="text-[11px] text-right shrink-0 text-[var(--color-ink-muted-48)]">
                  <div>{rune.element}</div>
                  <div>{rune.aett}</div>
                  <div>{rune.norseGod}</div>
                </div>
              </div>

              <p className="text-[13px] leading-[1.7] text-[var(--color-ink)] mt-2">
                {rune.reading}
              </p>

              <div className="flex flex-wrap gap-1.5 mt-3">
                {rune.keywords.map((kw) => (
                  <span key={kw} className="px-2 py-0.5 rounded-[6px] text-[10px] bg-[var(--color-surface-pearl)] text-[var(--color-ink-muted-48)]">{kw}</span>
                ))}
              </div>

              <div className="mt-3 px-4 py-3 rounded-[11px]" style={{ background: `${merkstave ? "#c0392b" : "#5a4a3a"}0D` }}>
                <div className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: merkstave ? "#c0392b" : "#5a4a3a" }}>
                  {merkstave ? "Merkstave (Reversed) Meaning" : "Upright Meaning"}
                </div>
                <p className="text-[13px] leading-[1.6] text-[var(--color-ink)]">{merkstave ? rune.merkstave : rune.upright}</p>
              </div>

              <div className="mt-3 px-4 py-3 rounded-[11px] bg-[var(--color-surface-pearl)]">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-ink-muted-48)] mb-1">Wisdom</div>
                <p className="text-[13px] leading-[1.6] italic text-[var(--color-ink)]">&ldquo;{rune.advice}&rdquo;</p>
              </div>
            </div>
          ))}

          {/* Conclusion */}
          <div className="apple-card px-6 py-5 border-l-4" style={{ borderLeftColor: "var(--color-primary)" }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[18px]">ᚠ</span>
              <h3 className="text-[14px] font-bold uppercase tracking-wider text-[var(--color-ink)]">Reading Conclusion</h3>
            </div>
            <p className="text-[13px] leading-[1.8] text-[var(--color-ink)]">{conclusion}</p>
          </div>
        </div>
      )}

      {/* About section */}
      {!dealt && (
        <div className="w-full max-w-2xl space-y-4">
          <div className="apple-card px-6 py-5">
            <h2 className="text-[12px] font-semibold uppercase text-[var(--color-ink-muted-48)] mb-2">About the Elder Futhark</h2>
            <p className="text-[13px] leading-[1.6] text-[var(--color-ink)] mb-2">
              The Elder Futhark is the oldest known runic alphabet, used by Germanic and Norse peoples from the 2nd to 8th centuries CE. Its 24 characters are divided into three families of eight called <em>aettir</em> (singular: <em>aett</em>). Runes were carved into wood, stone, bone, and metal — serving both as a writing system and as tools for divination and ritual.
            </p>
            <p className="text-[13px] leading-[1.6] text-[var(--color-ink)]">
              The word &ldquo;rune&rdquo; derives from Proto-Germanic <em>rūnō</em>, meaning &ldquo;secret&rdquo; or &ldquo;whisper.&rdquo; When casting runes, a <em>merkstave</em> (reversed) position indicates the energy is blocked, internalized, or delayed — not simply negated. Choose a spread above and press Cast the Runes.
            </p>
          </div>

          {/* Aett reference */}
          <div className="apple-card px-6 py-5">
            <h2 className="text-[12px] font-semibold uppercase text-[var(--color-ink-muted-48)] mb-3">The Three Aettir</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {Object.entries(AETT_DESCS).map(([aett, desc]) => (
                <button
                  key={aett}
                  onClick={() => setShowAett(showAett === aett ? null : aett)}
                  className={`px-4 py-3 rounded-[11px] text-left transition-all ${
                    showAett === aett
                      ? "bg-[var(--color-primary)] text-white"
                      : "bg-[var(--color-surface-pearl)] text-[var(--color-ink-muted-48)] hover:brightness-95"
                  }`}
                >
                  <div className="text-[12px] font-bold">{aett}</div>
                  <div className="text-[10px] mt-0.5">{desc}</div>
                </button>
              ))}
            </div>
            {showAett && (
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
                {RUNES.filter((r) => r.aett === showAett).map((r) => (
                  <div key={r.name} className="px-3 py-2 rounded-[9px] bg-[var(--color-surface-pearl)] text-center">
                    <div className="text-[18px]">{r.symbol}</div>
                    <div className="text-[10px] font-semibold text-[var(--color-ink)]">{r.name}</div>
                    <div className="text-[8px] text-[var(--color-ink-muted-48)]">{r.letter}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <p className="text-[10px] text-[var(--color-ink-muted-48)] mt-8 text-center max-w-lg leading-[1.6]">
        Elder Futhark rune meanings based on historical sources: the Old English, Old Icelandic, and Old Norwegian Rune Poems, the <em>Poetic Edda</em>, and archaeological scholarship. Rune symbols rendered as Unicode characters from the Runic block (U+16A0&ndash;U+16FF), public domain.
      </p>
          <Disclaimer type="divination" />
    </div>
  );
}
