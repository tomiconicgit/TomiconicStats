export const statsData = [
    {
        id: "stat_001",
        type: "counter",
        category: "silence",
        title: "UK Government Silence",
        value: 214,
        unit: "Days",
        context: "Since last official press briefing on housing crisis.",
        source: "Hansard Records",
        trending: true,
        critical: true
    },
    {
        id: "stat_002",
        type: "static",
        category: "action",
        title: "Total Protests Logged",
        value: 137,
        unit: "Events",
        context: "Verified gatherings across 12 major cities.",
        source: "Local Police Reports / User Submissions",
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
        trending: false,
        critical: true
    }
];

export const articlesData = [
    {
        id: "art_001",
        headline: "The Architecture of Silence",
        summary: "Analyzing the 214-day gap in communication using the silence tracker.",
        linkedStatId: "stat_001"
    },
    {
        id: "art_002",
        headline: "Follow the Money",
        summary: "A deep dive into the £4.2bn funding gap.",
        linkedStatId: "stat_003"
    }
];