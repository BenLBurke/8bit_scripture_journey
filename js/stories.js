/* ----------------------------------------------------------------------------
   Story data. Each chapter is an ordered list of "beats".

   Beat fields (all optional except text-or-choice):
     bg       : background name (see backgrounds.js)
     sprites  : [{ name, x, y, flip, bob }]  characters on screen
     speaker  : name shown above the dialogue box ("Narrator" by default)
     text     : narration / dialogue line
     fact     : { ref, text }  -> "Did You Know?" scripture card after the line
     choice   : { prompt, options:[{ label, response, correct, points }] }
     minigame : "flock" | "sling"
   The two chapters below follow Joseph (Genesis 37-50) and David
   (1 Samuel 16-17, 2 Samuel 5-12, Psalms).
---------------------------------------------------------------------------- */

const STORIES = {
  joseph: {
    title: "JOSEPH",
    subtitle: "The Dreamer of Egypt",
    color: "#e0b020",
    verse: "Genesis 37 - 50",
    beats: [
      { bg: "desert",
        sprites: [{ name: "jacob", x: 92, y: 178 }, { name: "joseph", x: 168, y: 178 }],
        speaker: "Narrator",
        text: "In the land of Canaan lived Jacob and his twelve sons. But Joseph, the eleventh son, was loved most of all." },

      { bg: "desert",
        sprites: [{ name: "jacob", x: 92, y: 178 }, { name: "joseph", x: 168, y: 178, bob: true }],
        speaker: "Jacob",
        text: "Joseph, my son, wear this coat of many colors. It is a sign of how dear you are to me.",
        fact: { ref: "Genesis 37:3", text: "Jacob made Joseph a 'coat of many colors.' The special robe showed favor - and it made his brothers jealous." } },

      { bg: "desert",
        sprites: [{ name: "brother", x: 70, y: 178 }, { name: "brother2", x: 128, y: 178 }, { name: "joseph", x: 190, y: 178 }],
        speaker: "Brothers",
        text: "Look at him in that coat. Father loves Joseph more than all of us. It isn't fair!" },

      { bg: "night",
        sprites: [{ name: "joseph", x: 128, y: 182, bob: true }],
        speaker: "Joseph",
        text: "Brothers, hear my dream! Your sheaves of grain bowed down to mine. And the sun, moon, and eleven stars bowed to me too.",
        fact: { ref: "Genesis 37:9", text: "Joseph's dreams pointed to a future where his family would bow to him. Dreams are a recurring sign of God's plan in his story." } },

      { bg: "desert",
        sprites: [{ name: "brother", x: 80, y: 178 }, { name: "brother2", x: 176, y: 178 }],
        speaker: "Brothers",
        text: "So you think you'll rule over us? We'll see about that, dreamer." },

      { bg: "desert",
        sprites: [{ name: "joseph", x: 128, y: 178, bob: true }],
        speaker: "Narrator",
        text: "Jacob sent Joseph to check on his brothers in the fields of Dothan. They saw him coming from far off..." },

      { bg: "desert",
        sprites: [{ name: "brother", x: 78, y: 178 }, { name: "brother2", x: 178, y: 178 }],
        speaker: "Narrator",
        text: "'Here comes the dreamer,' they said. 'Let us be rid of him!' But Reuben spoke up to spare his life.",
        choice: {
          prompt: "The brothers are angry. What does Reuben suggest?",
          options: [
            { label: "Throw him in the pit (don't harm him)", correct: true, points: 1,
              response: "Reuben hoped to rescue Joseph later. They threw Joseph into a dry pit." },
            { label: "Send him home unharmed",
              response: "The brothers were too jealous for that. Instead they seized him..." },
          ] } },

      { bg: "pit",
        sprites: [{ name: "joseph", x: 128, y: 200 }],
        speaker: "Joseph",
        text: "Brothers, please! Why are you doing this? Let me out!",
        fact: { ref: "Genesis 37:24", text: "The pit was a dry cistern used to store water. Joseph was trapped at the bottom while his brothers decided his fate." } },

      { bg: "desert",
        sprites: [{ name: "brother", x: 78, y: 178 }, { name: "brother2", x: 178, y: 178 }],
        speaker: "Judah",
        text: "A caravan of traders is coming! Why kill our brother? Let us sell him instead. He is our own flesh.",
        fact: { ref: "Genesis 37:28", text: "Joseph was sold to Ishmaelite traders for twenty pieces of silver and taken to Egypt - sold by his own brothers." } },

      { bg: "desert",
        sprites: [{ name: "brother", x: 92, y: 178 }, { name: "brother2", x: 166, y: 178 }],
        speaker: "Narrator",
        text: "The brothers dipped Joseph's coat in goat's blood and showed it to Jacob, who wept, believing his son was dead." },

      { bg: "egypt",
        sprites: [{ name: "potiphar", x: 92, y: 176 }, { name: "josephSlave", x: 168, y: 176 }],
        speaker: "Narrator",
        text: "In Egypt, Joseph was sold to Potiphar, captain of Pharaoh's guard. The Lord was with Joseph, and all he did prospered.",
        fact: { ref: "Genesis 39:2-4", text: "Even as a slave, Joseph was faithful. Potiphar trusted him so much he put Joseph in charge of his whole household." } },

      { bg: "egypt",
        sprites: [{ name: "potipharWife", x: 92, y: 176 }, { name: "josephSlave", x: 176, y: 176, flip: true }],
        speaker: "Narrator",
        text: "Potiphar's wife tried to tempt Joseph to do wrong. Joseph faced a hard choice.",
        choice: {
          prompt: "How should Joseph respond?",
          options: [
            { label: "Refuse and flee - it would be a sin", correct: true, points: 2,
              response: "'How could I do this great wickedness and sin against God?' Joseph ran, leaving his cloak behind." },
            { label: "Go along to stay out of trouble",
              response: "But Joseph chose integrity over comfort. 'How could I sin against God?' he said, and fled." },
          ] } },

      { bg: "prison",
        sprites: [{ name: "josephSlave", x: 128, y: 176 }],
        speaker: "Narrator",
        text: "Falsely accused, Joseph was thrown into prison. Yet even there, the Lord was with him, and the keeper trusted him with everything.",
        fact: { ref: "Genesis 39:21", text: "Joseph did the right thing and STILL suffered - but God did not abandon him. His character shone brightest in the dark." } },

      { bg: "prison",
        sprites: [{ name: "josephSlave", x: 90, y: 176 }, { name: "guard", x: 176, y: 176, flip: true }],
        speaker: "Joseph",
        text: "Pharaoh's cupbearer and baker had troubling dreams. With God's help, Joseph explained their meaning - and both came true." },

      { bg: "throne",
        sprites: [{ name: "pharaoh", x: 128, y: 150 }],
        speaker: "Pharaoh",
        text: "I dreamed of seven fat cows swallowed by seven thin ones, and seven good ears of grain devoured by withered ones. No one can explain it!" },

      { bg: "throne",
        sprites: [{ name: "pharaoh", x: 82, y: 150 }, { name: "josephSlave", x: 170, y: 176 }],
        speaker: "Joseph",
        text: "God is showing you what He will do. What does the dream mean?",
        choice: {
          prompt: "Interpret Pharaoh's dream:",
          options: [
            { label: "7 years of plenty, then 7 years of famine", correct: true, points: 2,
              response: "Correct! 'Store grain in the good years,' said Joseph, 'so Egypt survives the famine.'" },
            { label: "Seven happy years forever",
              response: "Not quite. The good years would be followed by seven years of terrible famine - so Egypt must store grain now." },
          ] } },

      { bg: "throne",
        sprites: [{ name: "pharaoh", x: 82, y: 150 }, { name: "josephRuler", x: 170, y: 176 }],
        speaker: "Pharaoh",
        text: "No one is as wise as you, Joseph. I set you over all Egypt. Only my throne will be greater than you.",
        fact: { ref: "Genesis 41:41", text: "From the pit and the prison to the palace - Joseph went from slave to governor of Egypt, second only to Pharaoh." } },

      { bg: "egypt",
        sprites: [{ name: "josephRuler", x: 92, y: 176 }, { name: "brother", x: 156, y: 176, flip: true }, { name: "brother2", x: 196, y: 176, flip: true }],
        speaker: "Narrator",
        text: "When famine struck, Joseph's brothers came to Egypt for food - and bowed to the governor, not knowing he was Joseph." },

      { bg: "egypt",
        sprites: [{ name: "josephRuler", x: 92, y: 176 }, { name: "brother", x: 168, y: 176, flip: true }],
        speaker: "Joseph",
        text: "I am Joseph, your brother! Do not be afraid. You meant evil against me, but God meant it for good, to save many lives.",
        fact: { ref: "Genesis 50:20", text: "Joseph forgave his brothers. His story shows how God can turn even betrayal into rescue and blessing." } },
    ],
  },

  david: {
    title: "DAVID",
    subtitle: "The Shepherd King",
    color: "#5aa0e0",
    verse: "1 Samuel 16 - Psalms",
    beats: [
      { bg: "field",
        sprites: [{ name: "david", x: 150, y: 182, bob: true }, { name: "sheep", x: 80, y: 184 }, { name: "sheep", x: 200, y: 188 }],
        speaker: "Narrator",
        text: "Long ago in Bethlehem, the youngest son of Jesse tended his father's sheep. His name was David." },

      { bg: "field",
        sprites: [{ name: "david", x: 128, y: 182, bob: true }, { name: "sheep", x: 70, y: 184 }],
        speaker: "David",
        text: "Out here with the flock, I sing to the Lord and watch over every lamb. A shepherd must be ready to protect them." },

      { bg: "field",
        sprites: [{ name: "lion", x: 70, y: 188 }, { name: "david", x: 180, y: 182 }, { name: "sheep", x: 128, y: 188 }],
        speaker: "Narrator",
        text: "Suddenly a lion - and then a bear - came to carry off a lamb! David ran toward the danger, not away from it.",
        minigame: "flock" },

      { bg: "field",
        sprites: [{ name: "david", x: 128, y: 182 }, { name: "sheep", x: 72, y: 186 }, { name: "sheep", x: 188, y: 188 }],
        speaker: "David",
        text: "The Lord who saved me from the lion and the bear will keep me safe. No harm will come to my flock.",
        fact: { ref: "1 Samuel 17:34-37", text: "Before facing any giant, David learned courage protecting sheep. God was training him through small, unseen battles." } },

      { bg: "field",
        sprites: [{ name: "samuel", x: 88, y: 178 }, { name: "david", x: 168, y: 182 }],
        speaker: "Samuel",
        text: "The Lord does not look at the outside, David, but at the heart. He has chosen you. I anoint you with oil as Israel's future king.",
        fact: { ref: "1 Samuel 16:7", text: "God sent the prophet Samuel to anoint David, the overlooked youngest son. God values the heart over appearance." } },

      { bg: "battlefield",
        sprites: [{ name: "goliath", x: 80, y: 188 }, { name: "saul", x: 200, y: 178 }],
        speaker: "Goliath",
        text: "I am Goliath of Gath! Send me a man to fight. If he kills me, we will be your servants. Who dares face me?!",
        fact: { ref: "1 Samuel 17:4", text: "Goliath was about nine feet tall and clad in heavy bronze armor. For forty days he taunted Israel's army." } },

      { bg: "battlefield",
        sprites: [{ name: "saul", x: 88, y: 178 }, { name: "david", x: 176, y: 182 }],
        speaker: "King Saul",
        text: "You are only a boy, David. Take my armor and sword to face the giant.",
        choice: {
          prompt: "Should David wear King Saul's heavy armor?",
          options: [
            { label: "No - trust God and use my sling", correct: true, points: 2,
              response: "'I cannot fight in these,' said David. He trusted the God who had saved him before, not borrowed armor." },
            { label: "Yes - take the king's sword and armor",
              response: "David tried it, but the armor was too heavy and unfamiliar. He set it aside and trusted God instead." },
          ] } },

      { bg: "battlefield",
        sprites: [{ name: "david", x: 128, y: 182, bob: true }],
        speaker: "David",
        text: "Five smooth stones from the brook, and my sling. The battle belongs to the Lord.",
        fact: { ref: "1 Samuel 17:40", text: "David chose five smooth stones from a stream. A shepherd's sling was a deadly-accurate weapon in skilled hands." } },

      { bg: "battlefield",
        sprites: [{ name: "goliath", x: 78, y: 188 }, { name: "david", x: 190, y: 182 }],
        speaker: "David",
        text: "You come with sword and spear, but I come in the name of the Lord of Hosts, the God of Israel whom you have defied!",
        minigame: "sling" },

      { bg: "battlefield",
        sprites: [{ name: "david", x: 128, y: 182, bob: true }],
        speaker: "Narrator",
        text: "The stone struck true, and the giant fell! Israel's army cheered. The shepherd boy had become a hero.",
        fact: { ref: "1 Samuel 17:45", text: "David won not by size or strength, but by faith. The story reminds us that no challenge is too big when God is with us." } },

      { bg: "throne",
        sprites: [{ name: "davidKing", x: 128, y: 150 }],
        speaker: "Narrator",
        text: "Years passed. David grew in wisdom and courage, and at last all Israel made him king. He ruled from Jerusalem.",
        fact: { ref: "2 Samuel 5:4", text: "David became king at thirty and reigned forty years. He united Israel and made Jerusalem its capital." } },

      { bg: "rooftop",
        sprites: [{ name: "davidKing", x: 92, y: 176 }, { name: "bathsheba", x: 180, y: 176 }],
        speaker: "Narrator",
        text: "But even great kings can fall. One evening David saw Bathsheba, another man's wife, and was tempted to do wrong.",
        choice: {
          prompt: "David faces temptation. What is the right path?",
          options: [
            { label: "Turn away - this is not mine to take", correct: true, points: 2,
              response: "That was the right choice... but the real David gave in to temptation, and it led to great trouble." },
            { label: "Take what he wants - he is king",
              response: "This is the path David chose - and it brought sin, cover-up, and heartbreak. Even kings face consequences." },
          ] } },

      { bg: "throne",
        sprites: [{ name: "nathan", x: 86, y: 176 }, { name: "davidKing", x: 172, y: 176, flip: true }],
        speaker: "Nathan",
        text: "A rich man stole the poor man's only lamb. What should be done to him?... You are the man, O King.",
        fact: { ref: "2 Samuel 12:7", text: "The prophet Nathan boldly confronted David's sin with a story. True friends tell us hard truths in love." } },

      { bg: "throne",
        sprites: [{ name: "davidKing", x: 128, y: 176 }],
        speaker: "David",
        text: "I have sinned against the Lord. Have mercy on me, O God; create in me a clean heart.",
        fact: { ref: "Psalm 51:10", text: "David didn't hide his failure - he repented. Psalm 51 is his prayer of sorrow, written after Nathan's rebuke." } },

      { bg: "night",
        sprites: [{ name: "davidKing", x: 128, y: 178, bob: true }],
        speaker: "David",
        text: "The Lord is my shepherd; I shall not want. Even in the valley, I will fear no evil, for You are with me.",
        fact: { ref: "Psalm 23:1", text: "David wrote roughly half of the 150 Psalms - songs of praise, sorrow, and trust that people still pray today." } },

      { bg: "night",
        sprites: [{ name: "davidKing", x: 128, y: 178 }],
        speaker: "Narrator",
        text: "From shepherd, to giant-slayer, to king, to poet - David was called 'a man after God's own heart,' flawed yet faithful to the end.",
        fact: { ref: "Acts 13:22", text: "David's whole life - victories AND failures - shows that God works through imperfect people who keep turning back to Him." } },
    ],
  },
};
