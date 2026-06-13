"use client";

import { useMemo, useState } from "react";
import ThemeToggle from "../theme-toggle";
import { Disclaimer } from "../disclaimer";

interface MangsaData {
  id: number;
  name: string;
  dates: string;
  days: number;
  candra: string;
  sunPosition: string;
  naturalSigns: string;
  atmosphere: string;
  farming: string;
  lifeGuidance: string;
  spirit: string;
  reading: string;
  color: string;
}

const MANGSA: MangsaData[] = [
  {
    id: 1,
    name: "Kasa (Kartika)",
    dates: "June 22 - August 1",
    days: 41,
    candra: "Sira mangsa Kasa, tanah kering bagai terbakar, matahari membelah bumi. Para petani diam menanti musim.",
    sunPosition: "Entering Capricorn",
    naturalSigns: "The first season of the Javanese year begins with the June solstice. The east wind ceases and the south wind takes its place. Songs of crickets fill the night air with a persistent chorus that seems to come from the earth itself. The <em>gadung</em> vine withers and turns brown, its leaves curling inward. The <em>ploso</em> tree sheds its leaves. Dry grasses bend toward the north. The <em>walang sangit</em> (rice stink bug) retreats into the soil. On still mornings, heat shimmers rise from the cracked earth like visible breath. The <em>kuntul</em> (egret) stands motionless at the edges of shrinking ponds, watching the water recede day by day. Bats emerge earlier from their roosts, silhouetted against sunsets the color of dried blood. The entire landscape holds its breath, waiting.",
    atmosphere: "Dry season peaks. Hot days reaching 33-35°C by midday. Cool nights where temperatures can drop to 18°C. The sky is a hard, cloudless blue. The sun burns white at noon. Rivers begin to shrink, revealing mudbanks that crack into geometric patterns.",
    farming: "Time to rest the land completely. Burn rice straw in the fields — the smoke carries prayers to the ancestors for the coming season. The ash enriches the soil with potassium. Repair and clean irrigation channels (<em>selokan</em>) that have silted up during the past year. Sharpen blades and tools. Mend bamboo fences. Prepare seed storage. This is the season of <em>mancal</em> — turning the soil by hand, letting the sun sterilize it before the rains return. No planting should be attempted; nothing planted now will survive.",
    lifeGuidance: "A season for patience and planning. Let the old burn away so the new may grow. Rest before the great work ahead. Your energy may feel low — this is natural. The earth itself is conserving its strength. Use this time for reflection, for reviewing the year that has passed, and for making quiet plans for the year to come. The visible world is slowing down, but beneath the surface, unseen preparations are underway.",
    spirit: "The earth sleeps. Do not disturb her dreams. Prepare in stillness for what is to come. The silence is not empty — it is full of potential, waiting for the right moment to be born.",
    reading: "You are in the season of Kasa, the opening of the Javanese year. This is a time of stillness and waiting. The land has been stripped bare by the sun, and your life may feel similarly exposed. But this is not a punishment — it is preparation. Just as the farmer lets the field rest before planting, you are being asked to rest before your next season of growth. The heat you feel is the burning away of what no longer serves you. Let it go. In the silence of this season, listen for the quiet voice of what wants to be born next. The year is beginning, and so are you.",
    color: "#D4A373",
  },
  {
    id: 2,
    name: "Karo (Pusa)",
    dates: "August 2 - August 24",
    days: 23,
    candra: "Sira mangsa Karo, rumput kering berubah putih, debu beterbangan ditiup angin. Bumi menahan nafasnya.",
    sunPosition: "In Capricorn",
    naturalSigns: "The dry season deepens. The <em>keteki</em> bird (Javanese coucal) calls at dawn with its distinctive low, resonant booming — a sound traditionally believed to foretell rain within three days. Dry leaves scatter across the paths like discarded prayers. The <em>plumbungan</em> tree (Indian almond) flowers with small reddish blossoms that carpet the ground beneath it. The <em>blimbing wuluh</em> (star fruit tree) fruits abundantly. Dust devils dance across the fields in the afternoon heat. The <em>walang kayu</em> (stick insect) becomes visible, clinging motionless to dead branches. Dew forms heavily before dawn, the only moisture the land receives. The <em>sikatan</em> bird (flycatcher) becomes more territorial, its sharp calls punctuating the quiet afternoons.",
    atmosphere: "Peak of the dry season. The land cracks into deep fissures. Dust rises with every footstep. The air is dry enough to crack wooden doors. The wind carries the smell of dry grass and distant smoke.",
    farming: "Clear fields of dry grass and weeds. This is <em>mbabat</em> — the clearing of land. Burn the cleared vegetation in controlled piles. The ash will return nutrients to the soil. Repair fences and tools that have broken during the previous year. Inspect and repair the <em>lumbung</em> (rice barn) for leaks. Prepare seedbeds (<em>pipilan</em>) for the upcoming planting season. Soak and sort seeds, discarding those that float. This is meticulous work — the quality of your preparation now will determine the quality of your harvest months from now.",
    lifeGuidance: "Make space for new growth by clearing what no longer serves. Tend your tools and your spirit. Preparation is half of the work. This is a season of clearing — in your home, your heart, and your mind. Take inventory of what needs repair. The <em>lumbung</em> of your spirit must be sound before it can hold the harvest to come. Be thorough. Be patient. What you build now must last.",
    spirit: "Sweep the floor of your heart clean. The seeds you plant later will thank you for the space you created. Every act of clearing is also an act of making room.",
    reading: "You are in Karo, the season of clearing. The land has been scorched, and now the farmer clears away what remains. This is the work of removal — pulling out dead roots, gathering dry grass, burning the debris so that its ash will feed the soil. In your own life, this is a time for clearing out what no longer belongs. Old habits, stale thoughts, worn-out commitments, relationships that have become obligations rather than gifts — all of these are the dry grass that needs to be gathered and released. The process may feel like loss, but it is actually preparation. You are making space. Every time you let something go, you create a vacancy that something new can fill. Do not rush this work. The seeds are not yet ready to be planted. First, the field must be clean.",
    color: "#D4A373",
  },
  {
    id: 3,
    name: "Katelu (Mangsa Ketelu)",
    dates: "August 25 - September 18",
    days: 25,
    candra: "Sira mangsa Katelu, angin bertiup kencang dari selatan, pohon-pohon bergoyang. Tanah menangis dalam debu.",
    sunPosition: "Entering Aquarius",
    naturalSigns: "Strong southern winds (<em>angin kidul</em>) sweep across the land, rattling bamboo groves with a sound like distant water. The <em>kapuk</em> (kapok) tree sheds its seed pods, releasing white fibers that drift through the air like snow. Birds — especially the <em>perkutut</em> (turtledove) and <em>kutilang</em> (sooty-headed bulbul) — begin building nests with unusual urgency. The <em>randu</em> tree (kapok) bursts into flower. The <em>prethok</em> bird sings at dusk from the tallest branches. Ants move in long columns, carrying eggs and larvae to higher ground — a sign that change is coming. The <em>tawon</em> (wasps) build their paper nests in sheltered corners. The earth, still dry, releases fine dust that rises on the wind and settles like a veil over everything.",
    atmosphere: "Strong winds sweep the land, carrying dust and the smell of distant rain that never arrives. The air is restless and charged. Dust storms possible in open areas. The wind never seems to stop — it rattles windows, stirs the leaves, keeps the world in constant motion.",
    farming: "Plant in the fertile river valleys where moisture still lingers. The winds carry seeds and pollen — nature's own planting. Start the first rice nurseries (<em>pembibitan</em>) in protected areas. This is <em>tandur</em> — the beginning of planting. Soak the selected seeds and spread them in prepared beds. Cover lightly with ash to protect from birds. Water by hand twice daily. The first pale green shoots will emerge within a week, a miracle of life in the brown landscape.",
    lifeGuidance: "The winds of change are blowing. Adapt and bend like bamboo, or break like stiff wood. Now is the time for action, not indecision. The energy in the air is restless — do not fight it. Let it move you. What have you been waiting to begin? The winds will carry your first efforts further than you expect. Start something, even if it is small. The bamboo that bends survives the storm.",
    spirit: "The breath of the ancestors stirs the world. Listen to the wind's whispers — they carry messages from those who walked this path before you.",
    reading: "You are in Katelu, the season of wind. The southern wind blows relentlessly, shaking everything that is not firmly rooted. This is a season of movement and urgency. The farmer who waits too long will miss the planting window. The farmer who acts too hastily will waste the precious seeds. You must find the balance between patience and action — and this season asks you to err on the side of action. The bamboo grove does not resist the wind; it sways, it dances, it bends until the wind passes. Be like the bamboo. Let the winds of circumstance move you without breaking you. Start the seeds of your intention now, while the conditions are right. Even in the dust and heat, life is stirring.",
    color: "#D4A373",
  },
  {
    id: 4,
    name: "Kapat (Mangsa Kapat)",
    dates: "September 19 - October 13",
    days: 25,
    candra: "Sira mangsa Kapat, air mulai turun dari langit, rintik hujan membasahi debu. Bumi membersihkan dirinya.",
    sunPosition: "In Aquarius",
    naturalSigns: "The first rain falls — gentle at first, a tentative tapping on the parched earth. The smell of wet soil (<em>mbau rekta</em>) rises and fills the air, a scent that Javanese farmers say can be recognized from a kilometer away. The <em>mangga kemloko</em> (hog plum) tree fruits prolifically, its yellow-orange globes attracting birds and children alike. Toads (<em>kodok</em>) emerge from the cracked earth where they have been dormant for months, their songs rising from every puddle and ditch. The <em>katak hijau</em> (green tree frog) appears on banana leaves. The <em>walang</em> (grasshopper) eggs hatch in massive numbers. The <em>cemara</em> (casuarina) tree releases its tiny cones. Ants emerge from their flooded nests, carrying white eggs to safety. The earth, so long hard and unyielding, softens.",
    atmosphere: "First rains arrive. The parched earth drinks greedily. The smell of wet soil fills the air — the distinctive <em>petrichor</em> that signals the end of the dry season. Clouds build in the afternoon, gray-bellied and promising. The world exhales.",
    farming: "Begin planting in earnest. The rains have come and the land is ready. Rice paddies (<em>sawah</em>) are prepared and flooded. Plow the wet earth with water buffalo or hand tools. Transplant seedlings from the nurseries to the sawah. This is <em>tandur</em> — the main planting. The work is intensive and communal — whole families work together under the wide-brimmed <em>caping</em> hats, bent over the water, pressing each tender shoot into the mud.",
    lifeGuidance: "The first drops of rain are a promise. Trust the small beginnings. What starts gently can grow into abundance beyond your imagining. After months of dryness, the rain finally comes. Do not despise small beginnings. The first rain is not a flood — it is a gentle tapping, a promise made quietly. Receive it with gratitude. Your season of planting has arrived.",
    spirit: "Heaven opens her hand and water falls. Receive the blessing with gratitude. The drought is over. The covenant between sky and earth is renewed with every drop.",
    reading: "You are in Kapat, the season of first rains. After months of dryness and waiting, the water comes — at first a whisper, then a conversation, then a song. This is the season of beginnings. The seeds that have been waiting in the darkness of the soil now feel the touch of water and respond. Something new is sprouting in your life — perhaps a project, a relationship, a creative work, or simply a new understanding of yourself. It is still small, still fragile, still mostly underground. But the rain has come, and growth is no longer a possibility — it is inevitable. Water what you have planted. Protect the tender shoots. The harvest is still far away, but the journey has begun.",
    color: "#6B8E6B",
  },
  {
    id: 5,
    name: "Kalima (Mangsa Kalima)",
    dates: "October 14 - November 9",
    days: 27,
    candra: "Sira mangsa Kalima, hujan deras mengguyur bumi, sungai-sungai bersukacita. Padi muda menghijau.",
    sunPosition: "Entering Pisces",
    naturalSigns: "The rains intensify. Heavy downpours swell the rivers, turning them from trickles to brown, rushing currents. The <em>jati</em> (teak) tree buds burst open with new leaves of a green so brilliant it seems to emit light. Fireflies dance at dusk in the thousands, their synchronized flashes turning the edges of fields into living constellations. The <em>prethok</em> bird calls insistently at dawn. The <em>kijing</em> (water snail) emerges in the paddies. The moon is often veiled by thick cloud cover; when it does appear, it is surrounded by a wide halo that signals continuing rain. The <em>wereng</em> (planthopper) populations begin to build. The <em>tawon</em> (wasp) nests grow visibly larger day by day. The paddies transform from brown mud to a vibrant, almost fluorescent green as the young rice shoots establish themselves.",
    atmosphere: "Wet season begins in earnest. Daily downpours, often in the late afternoon and evening. Thunder is common, rolling across the sky in long, rumbling waves. The world is saturated. Everything grows with visible urgency. The air is heavy and warm.",
    farming: "Rice grows tall — the young shoots reaching knee height by the end of this season. Weed the paddies constantly; weeds grow even faster than rice. Watch for pests — <em>wereng</em> (planthopper) and <em>tikus</em> (rats) can devastate a field. This is <em>matun</em> — the season of weeding and care. The work is daily and unglamorous, but essential. Apply natural fertilizers. Manage water levels carefully — too much or too little can harm the young plants.",
    lifeGuidance: "Let yourself be saturated with life. Growth requires both rain and sun. Embrace the storms that water your soul. This is not a time for half-measures. Commit fully to what you are growing. The weeds will come — distractions, doubts, competing priorities — and you must pull them out every day. Protection is not passive. It is the daily work of attention.",
    spirit: "The sky opens wide and pours down grace. Let your roots drink deep. This is the season of soaking — let every good thing penetrate to the deepest part of you.",
    reading: "You are in Kalima, the season of steady rain. The first gentle showers have given way to daily downpours, and the world is being saturated. The ground that was hard and cracked is now soft and yielding. The seeds that were planted have broken through the surface and are growing with a determination that is almost aggressive. This is the season of commitment. Whatever you began in Kapat is now demanding your full attention. The growth is visible — others can see it — but so are the weeds. Every day brings new challenges, new things that must be attended to. Do not be discouraged by the daily-ness of the work. The farmer does not plant once and walk away. The farmer returns to the field every day, bending over each plant, checking, adjusting, protecting. This is how great things are grown — not in a single heroic effort, but in the accumulation of daily, faithful attention.",
    color: "#6B8E6B",
  },
  {
    id: 6,
    name: "Kanem (Mangsa Kanem)",
    dates: "November 10 - December 21",
    days: 42,
    candra: "Sira mangsa Kanem, buah-buahan masak bergelantungan, bumi melimpah dengan hasilnya. Angin barat membawa kabar baik.",
    sunPosition: "In Pisces",
    naturalSigns: "The west wind (<em>angin kulon</em>) arrives, warm and moisture-laden, bringing news from across the sea. The <em>randu</em> tree bears its fruit. Fruit trees of all kinds are heavy with their bounty — <em>mangga</em> (mango), <em>rambutan</em>, <em>duku</em>, <em>sawo</em> (sapodilla), and <em>cempedak</em> hang in colorful abundance. The <em>gadung</em> crop — a type of yam — is ready for harvest. Flocks of migrating birds — swallows, wagtails, and the striking <em>kirik-kirik</em> (bee-eater) — pass through the skies in formation. The paddies are a deep, healthy green, the rice plants now waist-high and beginning to develop their panicles. The <em>kuntul</em> (egret) returns to the now-abundant paddies. The <em>ular sawah</em> (paddy snake) is more visible, hunting frogs in the irrigation channels. Thunderstorms continue but are less violent.",
    atmosphere: "Warm and wet. The peak of the rainy season in terms of rainfall volume. Thunderstorms rumble regularly, but they are less violent than in Kalima. The landscape is lush beyond description — every shade of green, every texture of leaf and vine. Ponds and rivers are full. The air is thick with moisture and the scent of ripening fruit.",
    farming: "Harvest time for early-planted rice varieties. The <em>gadung</em> yam is ready. Fruit trees yield their abundance — gather and share. Store grain in the <em>lumbung</em> — the traditional rice barn raised on four posts with a rat-guard on each leg. Dry the grain thoroughly before storage to prevent mold. This is <em>panen</em> — the first harvest, a time of celebration and community feasting. The <em>bancakan</em> (thanksgiving meal) is prepared and shared with neighbors and the spirits of the land.",
    lifeGuidance: "Reap what you have sown. Abundance is not an accident but a harvest of faithful labor. Share your blessings generously. What you planted months ago is now ready. This is the moment you have been working toward. But do not make the mistake of grasping too tightly — the fruit that is not shared will rot on the branch. Generosity is not depletion; it is the cycle of life continuing through you.",
    spirit: "The earth opens her hands and offers everything. Receive the harvest with humility and share with those who have none. What flows through you must flow out of you. Abundance is a river, not a reservoir.",
    reading: "You are in Kanem, the season of first harvest. The west wind carries the scent of ripe fruit, and the trees are bending under their own generosity. What you planted in faith months ago is now ready for reaping. This is a time of reward — not because you deserve it more than anyone else, but because you showed up, day after day, and did the work. But here is the wisdom of this season: the harvest is not yours to keep. The farmer gathers the grain, but the farmer also shares with the landless, leaves the edges of the field for the poor to glean, and sets aside seed for next year's planting. Receiving and giving are the same motion. If you try to hold everything, you will lose everything. Open your hands. The abundance will flow through you to others, and in that flowing, it will never run dry.",
    color: "#6B8E6B",
  },
  {
    id: 7,
    name: "Kapitu (Mangsa Kapitu)",
    dates: "December 22 - February 3",
    days: 44,
    candra: "Sira mangsa Kapitu, padi menguning di sawah, burung-burung berdatangan. Angin barat menderu kencang.",
    sunPosition: "Entering Aries",
    naturalSigns: "The rice turns golden — a slow yellowing that begins at the tips of the panicles and spreads downward until the whole field is a sea of rippling gold. The west wind howls with extraordinary force, sometimes uprooting trees and damaging houses. The wind carries the sound of distant thunder and the salt smell of the Indian Ocean. Swallows (<em>walet</em>) arrive in great flocks, wheeling and diving over the fields. The <em>kuntul perak</em> (great egret) stalks through the paddies in white dignity. The <em>gelatik</em> (Java sparrow) descends on the ripening grain in flocks of hundreds, forcing farmers to set up scarecrows (<em>wong-wongan</em>) and noise-making bamboo clappers. The <em>kucing</em> (civet cat) raids the fruit trees at night. The <em>kalong</em> (fruit bat) silhouettes pass across the moon. The air temperature drops noticeably, especially at night. Rain is still frequent but less heavy.",
    atmosphere: "The wettest and windiest time of the year. Storms are common, sometimes violent. The world is a study in gray and green — gray skies, gray rain, and the brilliant green and gold of the ripening rice. The wind is a constant presence, sometimes a whisper, sometimes a roar. The temperature is cooler than the preceding months.",
    farming: "Main rice harvest — the biggest and most important harvest of the Javanese agricultural year. This is <em>panen gedhe</em> (the great harvest). Every available hand is in the fields from dawn to dusk. The rice is cut with a small hand knife called an <em>ani-ani</em>, stalk by stalk, traditionally to avoid offending the rice spirit (<em>Dewi Sri</em>). Protect the ripening grain from wind damage by tying sheaves together. Birds are a constant threat — children are stationed in the fields all day to scare them away. Dry the harvested grain in covered barns, spreading it on mats and turning it several times a day. The <em>lumbung</em> is filled to bursting. This is the culmination of the entire agricultural cycle.",
    lifeGuidance: "The great harvest arrives after months of faith and labor. Do not let the storms steal what you have grown. Guard your blessings fiercely, but do not guard them so tightly that you cannot enjoy them. This is the season of completion, of standing back and looking at what you have created with your patience and persistence. The wind will blow — it always does — but the grain is in the barn. You made it. Rest now.",
    spirit: "The ancestors ride the west wind to visit the living. Speak their names with love and they will protect your harvest. The veil between the worlds is thin when the wind howls. Listen for the voices of those who came before.",
    reading: "You are in Kapitu, the season of the great harvest — the longest and most consequential season of the Javanese year. For 44 days, the rice turns from green to gold, and the farmer watches with a mixture of hope and anxiety. One storm can flatten a field. One week of the wrong weather can rot the grain on the stalk. This is the season of culmination, when everything you have done — every seed planted, every weed pulled, every pest driven away — comes to fruition. But it is also the season of vigilance. The closer you are to completion, the more things can go wrong. Do not relax your attention now. Guard what you have grown. But also, when the grain is finally in the barn, when the <em>lumbung</em> is full and the work is done — then celebrate. You have done something that required patience, faith, and daily effort. You have brought something from seed to harvest. That is no small thing. That is the cycle of life itself.",
    color: "#C4A44A",
  },
  {
    id: 8,
    name: "Kawolu (Mangsa Kawolu)",
    dates: "February 4 - March 1",
    days: 26,
    candra: "Sira mangsa Kawolu, hujan mulai reda, tanah mulai mengering. Angin bertiup dari timur membawa perubahan.",
    sunPosition: "In Aries",
    naturalSigns: "The rains begin to diminish — not stopping, but becoming less frequent, less intense. The east wind returns for the first time in months, bringing drier air and a sense of change. The <em>waluh</em> (pumpkin) flowers with large yellow blossoms. The <em>krokot</em> (purslane) spreads across the drying ground. Snakes (<em>ular sanca</em> and <em>ular weling</em>) emerge to seek mates — farmers walk carefully through tall grass. The <em>burung muchas</em> (black drongo) perches prominently on dried branches. The <em>jati</em> (teak) leaves begin to yellow. The <em>kembang sepatu</em> (hibiscus) flowers intensely. The <em>capung</em> (dragonfly) appears in large numbers, hovering over the remaining pools of water. The sky begins to show patches of blue for longer periods. The afternoon thunderstorms become less reliable, sometimes promising rain but delivering only distant thunder.",
    atmosphere: "Transition time. The wet season is winding down. Rain is less frequent. The sky shows extended patches of blue. The air is fresh and clean, washed by months of rain. The world feels like it is waking up to a new phase.",
    farming: "Second planting season begins. Prepare fields for dry crops (<em>palawija</em>) — corn, beans, peanuts, soybeans, cassava, and various tubers. These crops rely on the residual moisture in the soil rather than continuing rain. Plow the sawah that is no longer flooded. Plant corn in rows, beans between the corn, and cassava on the borders. This is a more relaxed season than the rice cycle — the urgency is over, and the work is steady rather than frantic.",
    lifeGuidance: "Balance is found in transitions. As one season ends and another begins, steady your heart. Change is the only constant. The intensity of the past months is easing. Breathe. You have made it through. Now is the time for gentler work, for planting the secondary crops of your life — the creative projects, the relationships, the skills that do not demand everything from you but still deserve your care.",
    spirit: "The wheel turns again. Each ending is a doorway to a new beginning. The same sun that shone on the harvest now shines on the freshly plowed field.",
    reading: "You are in Kawolu, the season of transition. The great work of the rice harvest is complete, and a quieter season begins. The rains are becoming less frequent, and the east wind brings a change in the air. This is the season of easing. After the intensity of Kapitu, the body and spirit need a gentler rhythm. In your own life, after a period of intense effort and culmination, you are entering a phase of consolidation and variety. Not everything has to be monumental. Plant the smaller crops — the things that bring variety, nutrition, and color to your life. The corn and beans and pumpkins do not require the same devotion as the rice, but they are still worthy of your care. This is the season for tending the small things, for enjoying the satisfaction of work that is meaningful without being all-consuming.",
    color: "#8B7355",
  },
  {
    id: 9,
    name: "Kasanga (Mangsa Kasanga)",
    dates: "March 2 - March 25",
    days: 24,
    candra: "Sira mangsa Kasanga, embun pagi turun lebat, kabut menyelimuti lembah. Ubi jalar dan jagung tumbuh subur.",
    sunPosition: "Entering Taurus",
    naturalSigns: "Heavy dew falls every morning, soaking the grass and dripping from the leaves in the early hours. Mist fills the valleys (<em>kabut</em>), creating a landscape of soft edges and muted colors. The <em>kapuk</em> (kapok) tree flowers for a second time. Young corn appears, the silks emerging from the developing ears. The <em>prethok</em> bird sings a different song than in the wet season — slower, more contemplative. The <em>daun jati</em> (teak leaves) fall in greater numbers, carpeting the ground. The <em>bambu</em> (bamboo) produces new shoots (<em>rebung</em>) that are harvested for food. The <em>kupu-kupu</em> (butterflies) appear in greater variety — the striking black-and-white <em>kupu gajah</em> and the delicate blue <em>kupu biru</em> flitting through the morning mist. The <em>tawon</em> (honey bee) activity increases as flowers bloom. The weather is arguably the most pleasant of the entire year.",
    atmosphere: "Cool mornings with heavy mist that burns off by mid-morning, revealing warm, pleasant days. This is often considered the most beautiful time of year on Java — the landscape is still green from the rains, the air is clear, and the sun is gentle.",
    farming: "Tend the dry crops. Harvest early corn (<em>jagung</em>) when the silks turn brown and the kernels are firm. The <em>rebung</em> (bamboo shoots) are gathered. Plant peanuts and soybeans in prepared beds. Water the <em>palawija</em> crops if rainfall is insufficient. This is a season of steady, low-intensity work — maintenance rather than creation.",
    lifeGuidance: "The morning mist hides the path, but the sun always burns through. Have faith in clarity even when you cannot see. Not every season demands that you know exactly where you are going. Sometimes the path reveals itself step by step. Trust that the fog will lift, and in the meantime, walk carefully and appreciate the soft beauty of the indistinct.",
    spirit: "The veils between worlds are thin. The wisdom of dreams lingers at dawn. Pay attention to what the mist reveals — not through clarity, but through suggestion.",
    reading: "You are in Kasanga, the season of mist and gentle mornings. The rains have stopped, and the world is drying slowly, releasing its moisture as mist that fills the valleys and softens every edge. This is a season of subtlety. The direct urgency of the wet season is gone, and the hard clarity of the dry season has not yet arrived. In between, there is this soft, dreamlike time. In your life, you may be in a period where things are not entirely clear. The path ahead is not illuminated — it is suggested, hinted at, revealed in glimpses through the mist. This is not a flaw in your vision. It is the nature of this particular season. Do not demand clarity that the moment cannot provide. Walk carefully, trust what you can see, and let the rest emerge in its own time. The mist will lift. It always does. But while it is here, appreciate its beauty. Some truths are too gentle for direct sunlight.",
    color: "#8B7355",
  },
  {
    id: 10,
    name: "Kadasa (Mangka Kadasa)",
    dates: "March 26 - April 18",
    days: 24,
    candra: "Sira mangka Kadasa, ikan-ikan berenang ke hulu sungai, angin timur bertiup kering dan panas.",
    sunPosition: "In Taurus",
    naturalSigns: "The east wind (<em>angin timur</em>) becomes dominant again, blowing drier and warmer. Fish (<em>iwak</em>) swim upstream (<em>muwani</em>) to spawn, a phenomenon observed and celebrated by riverside communities. The <em>mimba</em> (neem) tree flowers with small white blossoms, attracting bees. The <em>asem</em> (tamarind) tree fruits. The <em>belalang</em> (grasshopper) populations increase. The <em>kadal</em> (skink) basks on rocks and paths. The <em>elang</em> (eagle or kite) circles higher in the sky, riding the thermal updrafts. The ground develops a patina of dryness — not yet cracking, but firm and dusty on the surface. The <em>daun randu</em> (kapok leaves) begin to fall. The afternoons are noticeably hotter, and the coolness of the morning mist gives way to the gathering heat more quickly each day.",
    atmosphere: "Hot and dry. The sun is strong by mid-morning and relentless by midday. Afternoon heat shimmers over the fields, creating mirages in the distance. The landscape is losing its green, taking on the browns and golds of the approaching dry season.",
    farming: "Harvest the remaining dry crops — peanuts, soybeans, cassava. Dry the harvest thoroughly and store in rodent-proof containers. The land begins to rest again. Plow the spent fields one last time to expose pest larvae to the sun. This is <em>nyenuk</em> — the beginning of the land's rest. Repair any damage to the irrigation system caused by the wet season's floods.",
    lifeGuidance: "The heat of challenge brings out what is hidden within you. Endurance is not about speed but about continuing when every step is hard. The sun is revealing — it bakes the moisture out of everything, exposing what lies beneath. What is being revealed in you? What is being burned away? Both are necessary processes. The heat is not your enemy; it is the agent of transformation.",
    spirit: "The sun reveals all secrets. Nothing stays hidden in the light of truth. What you have kept in the shadows must now face the light. Let it.",
    reading: "You are in Kadasa, the season of heat and revelation. The east wind blows dry and hot, and the green abundance of the wet season is fading into memory. The land is drying, and so, perhaps, is your spirit. The heat can feel like a trial — it tires the body, irritates the temper, makes everything feel harder than it should. But the heat also reveals. It burns away the excess moisture of sentimentality, the fog of illusion. What remains after the heat has done its work is the essential. Your true nature, your real priorities, your core strength — these become visible when everything soft has been dried out of you. Do not resist the heat. Let it reveal what needs to be seen. What remains after the burning is what you can actually build on. The foundation of your life can only be laid on ground that is firm and dry.",
    color: "#D4A373",
  },
  {
    id: 11,
    name: "Dhesta (Mangsa Dhesta)",
    dates: "April 19 - May 11",
    days: 23,
    candra: "Sira mangsa Dhesta, daun-daun berguguran, bumi bersiap tidur panjang. Hanya pohon jati yang tetap tegak hijau.",
    sunPosition: "Entering Gemini",
    naturalSigns: "Leaves fall in earnest — the <em>randu</em> (kapok), the <em>asem</em> (tamarind), the <em>mimba</em> (neem) all shed their foliage as if preparing for a long sleep. Only the <em>jati</em> (teak) stands defiantly green, its broad leaves catching the last of the sun. The <em>pring</em> (bamboo) sends up new shoots — not as many as in Kasanga, but the <em>rebung</em> that appears now is said to be sweeter. The land is noticeably dry underfoot, and walking through the fields sends up small puffs of dust. The <em>tirisan</em> bird is heard less frequently — it is growing quiet as the dry season deepens. The <em>kadal</em> (lizard) retreats into crevices during the heat of the day. The <em>kalong</em> (fruit bat) emerges earlier, as the earlier dusk of autumn approaches. The <em>kembang kertas</em> (bougainvillea) flowers vividly in what seems like a last burst of color before the brown season.",
    atmosphere: "The dry season is settling in. The land is browned by the sun. Life is visibly slowing down. The days are hot, the nights cooler. There is a sense of the world preparing for something — a long rest, a deep quiet.",
    farming: "Rest the fields. Burn remaining straw and dry vegetation. This is <em>mbakar</em> — the burning season. The smoke haze settles over the landscape. Clean and oil metal tools to prevent rust during storage. Prepare water storage — clean the <em>sumur</em> (wells) and <em>tandon</em> (water tanks). Inspect the <em>lumbung</em> for rodent damage. Make or repair bamboo baskets and mats that will be needed in the coming year. The work is leisurely, done in the cool of the morning.",
    lifeGuidance: "Some seasons ask only for witness. Not every moment requires action. Let the silence teach you what words cannot. As the leaves fall, let your own unnecessary burdens fall with them. What are you carrying that you do not need? The tree does not mourn its leaves — it releases them without resistance, knowing that they will return when the season turns.",
    spirit: "Even in the driest season, the bamboo sends shoots from its hidden roots. Life persists below the surface. Your deepest vitality is never extinguished, only hidden.",
    reading: "You are in Dhesta, the season of letting go. The leaves are falling, the land is drying, and the world is preparing for the deep sleep of the dry season. The Javanese say that this is the season of <em>kendho</em> — of loosening, of releasing. The tree does not fight the falling of its leaves. It does not cling to what is ready to depart. It lets go, and in that letting go, it conserves the energy it will need for the next cycle of growth. What in your life is ready to fall away? What are you still holding that should be released? The empty branch is not a sad thing — it is a resting thing. It is gathering strength. Let yourself be empty for a while. The leaves will return. They always do.",
    color: "#D4A373",
  },
  {
    id: 12,
    name: "Sada (Mangsa Sada)",
    dates: "May 12 - June 21",
    days: 41,
    candra: "Sira mangsa Sada, air kembali ke sumbernya, sungai-sungai kecil mengering. Uler lidi bersembunyi di tanah. Bumi menanti hujan.",
    sunPosition: "In Gemini",
    naturalSigns: "The deep dry season. Creeks and small rivers dry up completely, their beds becoming cracked pathways through the landscape. The south wind (<em>angin kidul</em>) blows steadily — warm, dry, and relentless. The <em>tirisan</em> bird falls completely silent — its song will not be heard again until the rains return. The <em>mangga</em> (wild mango) fruit falls from the trees, fermenting on the ground and attracting birds and insects. The <em>uler lidi</em> (a type of caterpillar) burrows deep into the soil, entering a state of dormancy. The <em>belalang sembah</em> (praying mantis) deposits its egg cases on dry stems. The <em>semut rangrang</em> (weaver ant) activity decreases. The <em>kodok</em> (toad) is rarely seen — it has burrowed into the mud, waiting. The <em>lintah</em> (leech) retreats to the deepest remaining pools. The sunrises are spectacular — clear, sharp, the sun emerging from the haze like a disc of polished copper. The <em>kembang sepatu</em> (hibiscus) blooms with an almost desperate intensity, as if knowing the hardest days are yet to come.",
    atmosphere: "Deep dry season. The land bakes under the relentless sun. Water becomes precious — every drop counted, every source guarded. The world is still, brown, and waiting. The heat is not active like in Kadasa — it is passive, oppressive, a weight that settles over everything. Life is in retreat, conserving itself underground, in the shade, in the deepest shadows.",
    farming: "No planting whatsoever. Nothing will grow. This is the season of absolute rest for the land. Repair tools and barns thoroughly — this is the time for the work that was postponed during the busy seasons. Conserve water with extreme care. Clean and deepen wells if they are running low. The cycle is about to turn — the rains of Kasa, the new year, will come. But first, you must endure this last, hardest season. Mend everything that is broken. Bide your time.",
    lifeGuidance: "In the emptiness, you find what is essential. When the noise fades, the heart speaks. The land is barren, the rivers are dry, and the waiting seems endless. But this is not a void — it is a womb. The Javanese see Sada not as death, but as the deepest part of the cycle of life. The seed must rest in the dark soil before it can sprout. The caterpillar must dissolve before it can become a butterfly. Your emptiness is not a failure. It is the necessary darkness before the dawn. Prepare for the new cycle that is always, always coming.",
    spirit: "The cosmic serpent sheds its skin. Let go of everything that is no longer alive in you. The old must be completely shed before the new can emerge. Do not cling to the dead skin of your former self.",
    reading: "You are in Sada, the deepest season of the Javanese year — the season you are living through right now. This is the longest stretch of the dry season, 41 days of heat, dust, and waiting. The rivers have shrunk to trickles or disappeared entirely. The fields are bare and cracked. The birds have fallen silent. Everything that could be harvested has been harvested. Everything that could be stored has been stored. Now there is only the waiting. This is the season that asks the most of the human spirit because it asks for nothing but endurance and faith. The land looks dead, but it is not dead. It is resting. It is preparing. The rains will come. The cycle will turn. The year will begin again on June 22, and the first green shoots will push through the soil that now seems so barren. Your own life may feel like Sada right now. The visible results are not there. The productivity has slowed. The energy is low. The world around you seems to be thriving while you feel like you are barely holding on. But this is not failure. This is the necessary dormancy. The seed in the dark soil does not know it is becoming a plant. It only knows it is waiting. But underground, beneath the surface of your awareness, transformation is happening. The roots are growing. The new shape is forming. When the rains come — and they will come — you will emerge changed. You will be ready for the new year, the new cycle, the new life. Trust the waiting. Trust the darkness. Sada is not the end. It is the deepest part of the beginning.",
    color: "#D4A373",
  },
];

export default function PranataMangsaPage() {
  const [selected, setSelected] = useState<number | null>(null);

  const mangsa = useMemo(() => {
    if (selected === null) return null;
    return MANGSA.find((m) => m.id === selected) ?? null;
  }, [selected]);

  const today = useMemo(() => {
    const now = new Date();
    const mm = now.getMonth() + 1;
    const dd = now.getDate();
    const dateNum = mm * 100 + dd;

    const ranges = [
      { id: 1, start: 622, end: 801 },
      { id: 2, start: 802, end: 824 },
      { id: 3, start: 825, end: 918 },
      { id: 4, start: 919, end: 1013 },
      { id: 5, start: 1014, end: 1109 },
      { id: 6, start: 1110, end: 1221 },
      { id: 7, start: 1222, end: 203 },
      { id: 8, start: 204, end: 301 },
      { id: 9, start: 302, end: 325 },
      { id: 10, start: 326, end: 418 },
      { id: 11, start: 419, end: 511 },
      { id: 12, start: 512, end: 621 },
    ];

    for (const r of ranges) {
      if (r.id === 7) {
        if (dateNum >= 1222 || dateNum <= 203) return MANGSA[6];
      } else if (dateNum >= r.start && dateNum <= r.end) {
        return MANGSA[r.id - 1];
      }
    }
    return null;
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-12">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <h1 className="apple-headline text-[34px] leading-[1.47] tracking-[-0.374px] mb-2">
        Pranata Mangsa
      </h1>
      <p className="text-[13px] text-[var(--color-ink-muted-48)] mb-8 text-center max-w-lg">
        The Javanese seasonal calendar — twelve sacred seasons that mark the rhythm of nature, agriculture, and spiritual life on Java.
      </p>

      {today && (
        <div className="w-full max-w-2xl apple-card px-6 py-5 mb-5 text-center">
          <div className="text-[12px] font-semibold uppercase text-[var(--color-ink-muted-48)] mb-1">
            Current Season
          </div>
          <div className="text-[24px] font-bold" style={{ color: today.color }}>{today.name}</div>
          <div className="text-[14px] text-[var(--color-ink-muted-48)] mb-2">{today.dates} &middot; {today.days} days</div>
          <div className="apple-card px-4 py-3 text-left bg-[var(--color-surface-pearl)]">
            <p className="text-[13px] leading-[1.7] text-[var(--color-ink)]">{today.reading}</p>
          </div>
        </div>
      )}

      <div className="w-full max-w-2xl apple-card px-6 py-5 mb-5">
        <h2 className="text-[14px] font-semibold leading-[1.29] tracking-[-0.224px] text-[var(--color-ink-muted-48)] mb-3 uppercase">
          The Twelve Seasons
        </h2>
        <div className="grid grid-cols-1 gap-2">
          {MANGSA.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelected(selected === m.id ? null : m.id)}
              className="w-full text-left px-4 py-3 rounded-[11px] bg-[var(--color-surface-pearl)] hover:brightness-95 active:brightness-90 transition-all"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: m.color }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-semibold text-[var(--color-ink)]">
                    {m.name}
                    {selected === m.id && " ▲"}
                    {today && m.id === today.id && (
                      <span className="ml-2 text-[10px] font-normal text-[var(--color-primary)]">NOW</span>
                    )}
                  </div>
                  <div className="text-[11px] text-[var(--color-ink-muted-48)]">
                    {m.dates} &middot; {m.days} days
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {mangsa && (
        <div className="w-full max-w-2xl space-y-4">
          <div className="apple-card px-6 py-5 text-center">
            <div className="text-[28px] font-bold mb-1" style={{ color: mangsa.color }}>{mangsa.name}</div>
            <div className="text-[15px] text-[var(--color-ink-muted-48)]">{mangsa.dates} &middot; {mangsa.days} days</div>
          </div>

          <div className="apple-card px-6 py-5">
            <h3 className="text-[12px] font-semibold uppercase text-[var(--color-ink-muted-48)] mb-3">Candra (Poetic Vision)</h3>
            <p className="text-[14px] leading-[1.8] italic text-[var(--color-ink)]">&ldquo;{mangsa.candra}&rdquo;</p>
          </div>

          <div className="apple-card px-6 py-5">
            <h3 className="text-[12px] font-semibold uppercase text-[var(--color-ink-muted-48)] mb-3">Your Reading</h3>
            <p className="text-[14px] leading-[1.8] text-[var(--color-ink)]">{mangsa.reading}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="apple-card px-6 py-5">
              <h3 className="text-[12px] font-semibold uppercase text-[var(--color-ink-muted-48)] mb-2">Natural Signs</h3>
              <p className="text-[14px] leading-[1.6] text-[var(--color-ink)]" dangerouslySetInnerHTML={{ __html: mangsa.naturalSigns }} />
            </div>
            <div className="apple-card px-6 py-5">
              <h3 className="text-[12px] font-semibold uppercase text-[var(--color-ink-muted-48)] mb-2">Spirit of the Season</h3>
              <p className="text-[14px] leading-[1.6] text-[var(--color-ink)]">{mangsa.spirit}</p>
            </div>
          </div>

          <div className="apple-card px-6 py-5">
            <h3 className="text-[12px] font-semibold uppercase text-[var(--color-ink-muted-48)] mb-2">Farming Guidance</h3>
            <p className="text-[14px] leading-[1.6] text-[var(--color-ink)]">{mangsa.farming}</p>
          </div>

          <div className="apple-card px-6 py-5">
            <h3 className="text-[12px] font-semibold uppercase text-[var(--color-ink-muted-48)] mb-2">Life Guidance</h3>
            <p className="text-[14px] leading-[1.6] text-[var(--color-ink)]">{mangsa.lifeGuidance}</p>
          </div>
        </div>
      )}

      {!mangsa && selected === null && (
        <div className="w-full max-w-2xl space-y-4">
          <div className="apple-card px-6 py-5">
            <h2 className="text-[14px] font-semibold leading-[1.29] tracking-[-0.224px] text-[var(--color-ink-muted-48)] mb-3 uppercase">
              About Pranata Mangsa
            </h2>
            <p className="text-[14px] leading-[1.6] text-[var(--color-ink)] mb-3">
              <strong>Pranata Mangsa</strong> is the traditional Javanese seasonal calendar, a system of twelve unequal seasons that has guided the agricultural and spiritual life of Java for centuries. The term <em>pranata</em> means rule, order, or arrangement, and <em>mangsa</em> means season — together, "the ordering of seasons." This is not merely an agricultural tool — it is a complete cosmology that understands human life as inextricably embedded in the rhythms of the natural world.
            </p>
            <p className="text-[14px] leading-[1.6] text-[var(--color-ink)] mb-3">
              Unlike the Western four-season system, Pranata Mangsa divides the year into twelve seasons, each lasting 23 to 44 days, based on the sun's position in the sky as it moves through the zodiac. The calendar is fixed to the tropical year and begins each year on June 22 (the June solstice, when the sun enters Capricorn in the Javanese system). Each season is marked by specific natural signs — the calls of certain birds, the direction of the wind, the flowering of particular trees, the behavior of animals — that tell the farmer when to plant, when to weed, when to harvest, and when to let the land rest.
            </p>
            <p className="text-[14px] leading-[1.6] text-[var(--color-ink)] mb-3">
              The system originated in the agrarian courts of the Mataram Sultanate (16th–18th centuries) and was refined over generations by Javanese kings (<em>Sultan Agung</em> is credited with formalizing it), court astronomers (<em>abdi dalem pangulu</em>), and village elders who transmitted the knowledge orally. Each season has a <em>candra</em> — a poetic, often mystical description in Old Javanese (<em>Kawi</em>) that captures its spirit in language that is as much about the inner life as it is about the outer world. The calendar reflects the core Javanese philosophy of <em>hamemayu hayuning bawana</em> — "beautifying the beauty of the world" — the belief that human beings are not separate from nature but are participants in its ongoing creation, responsible for maintaining the harmony between the cosmos, the earth, and the community.
            </p>
            <p className="text-[14px] leading-[1.6] text-[var(--color-ink)] mb-3">
              The twelve mangsa are: <strong>Kasa</strong> (June 22 – Aug 1, 41 days — the sun burns the earth), <strong>Karo</strong> (Aug 2–24, 23 days — the land cracks with drought), <strong>Katelu</strong> (Aug 25 – Sep 18, 25 days — the south wind blows), <strong>Kapat</strong> (Sep 19 – Oct 13, 25 days — the first rains fall), <strong>Kalima</strong> (Oct 14 – Nov 9, 27 days — rain drenches the land), <strong>Kanem</strong> (Nov 10 – Dec 21, 42 days — fruit trees are heavy), <strong>Kapitu</strong> (Dec 22 – Feb 3, 44 days — the great rice harvest), <strong>Kawolu</strong> (Feb 4 – Mar 1, 26 days — the east wind returns), <strong>Kasanga</strong> (Mar 2–25, 24 days — mist fills the valleys), <strong>Kadasa</strong> (Mar 26 – Apr 18, 24 days — the sun bakes the land), <strong>Dhesta</strong> (Apr 19 – May 11, 23 days — leaves fall like prayers), and <strong>Sada</strong> (May 12 – June 21, 41 days — the deepest drought before the cycle turns).
            </p>
            <p className="text-[14px] leading-[1.6] text-[var(--color-ink)]">
              Click on any season above to explore its meaning, guidance, and wisdom. The current season is automatically detected and marked with "NOW." Each season includes a detailed reading that applies its agricultural wisdom to the human journey — because in the Javanese worldview, what is true of the rice field is also true of the soul.
            </p>
          </div>

          <div className="apple-card px-6 py-5">
            <h3 className="text-[12px] font-semibold uppercase text-[var(--color-ink-muted-48)] mb-3">The Twelve Seasons at a Glance</h3>
            <div className="grid grid-cols-3 gap-2">
              {MANGSA.map((m) => (
                <div key={m.id} className={`px-2 py-2 rounded-[11px] bg-[var(--color-surface-pearl)] text-center ${today && m.id === today.id ? 'ring-1 ring-[var(--color-primary)]' : ''}`}>
                  <div className="text-[10px] font-semibold text-[var(--color-ink)]">{m.name.split(" (")[0]}</div>
                  <div className="text-[9px] text-[var(--color-ink-muted-48)]">{m.days}d</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
          <Disclaimer type="divination" />
    </div>
  );
}
