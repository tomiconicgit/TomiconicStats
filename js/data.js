export const globalStats = [
    { 
        id: "s1", 
        label: "US Inflation", 
        value: 3.4, 
        suffix: "%", 
        color: "#E63946", 
        chartType: "line", // for the detail page
        description: "Year-over-year change in the CPI.",
        history: [3.1, 3.2, 3.4, 3.5, 3.4] // Mock data for charts
    },
    { 
        id: "s2", 
        label: "UK Migrant Crossings", 
        value: 45200, 
        suffix: "", 
        color: "#457B9D", 
        chartType: "bar",
        description: "Total detected crossings via small boats.",
        history: [12000, 28000, 45200]
    },
    { 
        id: "s3", 
        label: "Global Oil Barrels", 
        value: 82.50, 
        prefix: "$", 
        color: "#ffffff", 
        chartType: "area",
        description: "Price per barrel of Brent Crude.",
        history: [75, 78, 80, 82.50]
    }
];

export const articles = [
    {
        id: 101,
        title: "Senate Passes Historic Bill",
        category: "Politics",
        image: "https://images.unsplash.com/photo-1555848962-6e79363ec58f?auto=format&fit=crop&w=800",
        isHero: true
        // ... rest of data
    },
    {
        id: 102,
        title: "London Tech Week: The New Giants",
        category: "Technology",
        image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800",
        isHero: false
    }
    // ... add more items
];
