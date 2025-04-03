const newsData = [
  // Technology and AI news
  {
    title: "Tech Giants Unveil New AI Models",
    image: "https://t3.ftcdn.net/jpg/00/88/43/58/360_F_88435847_HhglbcoGP5qOX3DfudP3hN5z95eTrHqz.jpg",
    description: "Major technology companies have announced their latest advancements in artificial intelligence.",
    tags: ["AI", "Technology", "Innovation"],
    timestamp: new Date("2025-04-01T12:30:00")
  },
  {
    title: "Breakthrough in Quantum Computing",
    image: "https://t3.ftcdn.net/jpg/00/88/43/58/360_F_88435847_HhglbcoGP5qOX3DfudP3hN5z95eTrHqz.jpg",
    description: "Scientists achieve a major breakthrough in quantum computing technology.",
    tags: ["Quantum Computing", "Science", "Technology"],
    timestamp: new Date("2025-04-01T13:15:00")
  },
  {
    title: "Virtual Reality Revolutionizes Education",
    image: "https://t3.ftcdn.net/jpg/00/88/43/58/360_F_88435847_HhglbcoGP5qOX3DfudP3hN5z95eTrHqz.jpg",
    description: "The latest advancements in virtual reality are changing the way students learn across the globe.",
    tags: ["VR", "Education", "Technology"],
    timestamp: new Date("2025-04-02T09:00:00")
  },

  // Finance and Stock Market
  {
    title: "Stock Markets Reach All-Time Highs",
    image: "https://t3.ftcdn.net/jpg/00/88/43/58/360_F_88435847_HhglbcoGP5qOX3DfudP3hN5z95eTrHqz.jpg",
    description: "Global stock markets hit record highs as economic optimism grows.",
    tags: ["Finance", "Stock Market", "Economy"],
    timestamp: new Date("2025-04-01T12:45:00")
  },
  {
    title: "Cryptocurrency Market Hits New Milestones",
    image: "https://t3.ftcdn.net/jpg/00/88/43/58/360_F_88435847_HhglbcoGP5qOX3DfudP3hN5z95eTrHqz.jpg",
    description: "Bitcoin and Ethereum soar as cryptocurrency adoption continues to grow worldwide.",
    tags: ["Cryptocurrency", "Finance", "Economy"],
    timestamp: new Date("2025-04-01T14:00:00")
  },

  // Climate and Environment
  {
    title: "Climate Summit Calls for Urgent Action",
    image: "https://t3.ftcdn.net/jpg/00/88/43/58/360_F_88435847_HhglbcoGP5qOX3DfudP3hN5z95eTrHqz.jpg",
    description: "World leaders convene to discuss urgent climate change measures.",
    tags: ["Climate Change", "Environment", "Politics"],
    timestamp: new Date("2025-04-01T13:00:00")
  },
  {
    title: "New Initiatives for Renewable Energy Investments",
    image: "https://t3.ftcdn.net/jpg/00/88/43/58/360_F_88435847_HhglbcoGP5qOX3DfudP3hN5z95eTrHqz.jpg",
    description: "Governments and corporations are increasing investments in renewable energy solutions.",
    tags: ["Energy", "Renewable", "Environment"],
    timestamp: new Date("2025-04-02T10:30:00")
  },

  // Space Exploration and Science
  {
    title: "New Space Mission Aims for Mars",
    image: "https://t3.ftcdn.net/jpg/00/88/43/58/360_F_88435847_HhglbcoGP5qOX3DfudP3hN5z95eTrHqz.jpg",
    description: "A new mission to Mars has been announced, aiming to explore the planet's surface.",
    tags: ["Space", "NASA", "Exploration"],
    timestamp: new Date("2025-04-02T18:58:00")
  },
  {
    title: "NASA's New Telescope Will Explore Deep Space",
    image: "https://t3.ftcdn.net/jpg/00/88/43/58/360_F_88435847_HhglbcoGP5qOX3DfudP3hN5z95eTrHqz.jpg",
    description: "The James Webb Telescope is set to unravel the mysteries of deep space.",
    tags: ["Space", "NASA", "Science"],
    timestamp: new Date("2025-04-02T14:00:00")
  },

  // Sport News
  {
    title: "Football World Cup Qualifiers: Latest Updates",
    image: "https://t3.ftcdn.net/jpg/00/88/43/58/360_F_88435847_HhglbcoGP5qOX3DfudP3hN5z95eTrHqz.jpg",
    description: "As the qualifiers progress, teams are battling for a spot in the World Cup.",
    tags: ["Football", "Sport", "World Cup"],
    timestamp: new Date("2025-04-02T11:30:00")
  },
  {
    title: "Olympics 2024: Athletes Set to Shine",
    image: "https://t3.ftcdn.net/jpg/00/88/43/58/360_F_88435847_HhglbcoGP5qOX3DfudP3hN5z95eTrHqz.jpg",
    description: "The upcoming Olympics promises exciting new sports and fierce competition.",
    tags: ["Olympics", "Sport", "Athletes"],
    timestamp: new Date("2025-04-02T08:00:00")
  },
  {
    title: "Global Marathon Championship: The Race of the Year",
    image: "https://t3.ftcdn.net/jpg/00/88/43/58/360_F_88435847_HhglbcoGP5qOX3DfudP3hN5z95eTrHqz.jpg",
    description: "Top marathon runners from around the world prepare for the global marathon championship.",
    tags: ["Marathon", "Sport", "Competition"],
    timestamp: new Date("2025-04-02T13:30:00")
  },

  // Education News
  {
    title: "Virtual Learning Platforms to Be Fully Integrated in Schools",
    image: "https://t3.ftcdn.net/jpg/00/88/43/58/360_F_88435847_HhglbcoGP5qOX3DfudP3hN5z95eTrHqz.jpg",
    description: "Education institutions are adopting digital learning tools at a rapid pace.",
    tags: ["Education", "Technology", "Learning"],
    timestamp: new Date("2025-04-01T09:30:00")
  },
  {
    title: "New Scholarship Program for High School Graduates",
    image: "https://t3.ftcdn.net/jpg/00/88/43/58/360_F_88435847_HhglbcoGP5qOX3DfudP3hN5z95eTrHqz.jpg",
    description: "A new scholarship program has been introduced to support talented high school graduates.",
    tags: ["Education", "Scholarship", "Opportunities"],
    timestamp: new Date("2025-04-01T10:00:00")
  },
  {
    title: "Revolutionary Methods in STEM Education",
    image: "https://t3.ftcdn.net/jpg/00/88/43/58/360_F_88435847_HhglbcoGP5qOX3DfudP3hN5z95eTrHqz.jpg",
    description: "The way STEM subjects are being taught has been dramatically altered by new methods.",
    tags: ["Education", "STEM", "Innovation"],
    timestamp: new Date("2025-04-03T13:00:20")
  },

  // Politics News
  {
    title: "Senate Approves Major Infrastructure Bill",
    image: "https://t3.ftcdn.net/jpg/00/88/43/58/360_F_88435847_HhglbcoGP5qOX3DfudP3hN5z95eTrHqz.jpg",
    description: "The Senate has passed a bill aimed at improving the nation's infrastructure.",
    tags: ["Politics", "Government", "Infrastructure"],
    timestamp: new Date("2025-04-01T15:00:00")
  },
  {
    title: "US Elections: Candidates Start Their Campaigns",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRll4aQexNAinjq1iXgvrK3mpKsoQAnDBE9zQ&s",
    description: "Political candidates have started their campaigns as the US elections approach.",
    tags: ["Politics", "Election", "USA"],
    timestamp: new Date("2025-04-01T16:00:00")
  },
  {
    title: "International Trade Talks Hit Roadblock",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTV433tqb1AftGJblZAfI6ekUoXlY1bKz3eDg&s",
    description: "International trade negotiations face a setback as key issues remain unresolved.",
    tags: ["Politics", "Trade", "International"],
    timestamp: new Date("2025-04-03T13:00:00")
  }
];

export default newsData;
