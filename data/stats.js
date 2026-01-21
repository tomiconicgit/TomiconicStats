export const statsData = [
  // HERO ITEM (The Big Headline)
  {
    id: "hero_01",
    type: "hero",
    category: "Immigration",
    title: "“We will stop the boats”",
    value: "+3,421",
    unit: "Crossings",
    context: "Since the Prime Minister's statement on Jan 4th.",
    image: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=80&w=2952&auto=format&fit=crop", // Dark moody sea
    trend: "up", // up = bad in this context? or just up.
    critical: true
  },
  // RAIL 1: SILENCE & INACTION
  {
    id: "stat_01",
    category: "Silence",
    title: "Housing Press Briefings",
    value: "214",
    unit: "Days Since Last",
    context: "Government has not addressed housing publicly since Q3.",
    trend: "flat",
    critical: true
  },
  {
    id: "stat_02",
    category: "Inaction",
    title: "Bill Amendments",
    value: "0",
    unit: "Accepted",
    context: "Opposition amendments passed in current session.",
    trend: "flat",
    critical: false
  },
  {
    id: "stat_03",
    category: "Silence",
    title: "FOI Requests",
    value: "42%",
    unit: "Rejected",
    context: "Freedom of Information requests denied this month.",
    trend: "up",
    critical: true
  },
  // RAIL 2: PUBLIC ACTION
  {
    id: "stat_04",
    category: "Resistance",
    title: "Total Protests",
    value: "137",
    unit: "Events",
    context: "Verified gatherings across 12 major cities.",
    trend: "up",
    critical: false
  },
  {
    id: "stat_05",
    category: "Resistance",
    title: "Petitions Signed",
    value: "2.4M",
    unit: "Signatures",
    context: "Total signatures on 'Accountability Act'.",
    trend: "up",
    critical: false
  }
];

export const articlesData = [
  {
    id: "art_01",
    title: "The Architecture of Silence",
    summary: "Why the 214-day gap in housing comms matters more than the budget.",
    readTime: "3 min",
    image: "https://images.unsplash.com/photo-1476242906366-d8eb64c2f661?q=80&w=2938&auto=format&fit=crop"
  },
  {
    id: "art_02",
    title: "Visualizing the Deficit",
    summary: "A deep dive into the £4.2bn funding gap.",
    readTime: "5 min",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2940&auto=format&fit=crop"
  }
];
