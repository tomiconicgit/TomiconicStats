// data/stats.js

export const statsData = [
    {
        id: "stat_001",
        type: "counter", // logic: increments time
        category: "silence",
        title: "UK Government Silence",
        value: "214",
        unit: "Days",
        context: "Since last official press briefing on housing crisis.",
        source: "Hansard Records",
        timestamp: "2023-10-27T10:00:00Z",
        trending: true,
        critical: true
    },
    {
        id: "stat_002",
        type: "static",
        category: "action",
        title: "Total Protests Logged",
        value: "137",
        unit: "Events",
        context: "Verified gatherings across 12 major cities.",
        source: "Local Police Reports / User Submissions",
        timestamp: "2023-10-26T14:30:00Z",
        trending: true,
        critical: false
    },
    {
        id: "stat_003",
        type: "comparison",
        category: "finance",
        title: "Funding Disparity",
        value: "£4.2bn",
        unit: "Gap",
        context: "Difference between promised vs. delivered infrastructure funds.",
        source: "Treasury Q3 Report",
        timestamp: "2023-10-25T09:00:00Z",
        trending: false,
        critical: true
    },
    {
        id: "stat_004",
        type: "timeline",
        category: "policy",
        title: "Bill Amendments",
        value: "0",
        unit: "Passed",
        context: "Amendments accepted by opposition in current session.",
        source: "Parliament TV",
        timestamp: "2023-10-27T08:00:00Z",
        trending: false,
        critical: false
    }
];

export const articlesData = [
    {
        id: "art_001",
        headline: "The Architecture of Silence",
        summary: "Analyzing the 214-day gap in communication using the silence tracker.",
        linkedStatId: "stat_001",
        readTime: "3 min"
    },
    {
        id: "art_002",
        headline: "Follow the Money",
        summary: "A deep dive into the £4.2bn funding gap.",
        linkedStatId: "stat_003",
        readTime: "5 min"
    }
];
