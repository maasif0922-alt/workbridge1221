const defaultDonationCauses = [
    {
        id: "cause-1",
        title: "Support a Daily Worker's Family",
        category: "Urgent",
        description: "Provision of monthly food packages (Rashan) for 50 families of daily based construction workers who are currently out of work due to health issues.",
        image: "images/charity-food.png",
        goal: 100000,
        raised: 65000,
        status: "Active"
    },
    {
        id: "cause-2",
        title: "Education for Workers' Children",
        category: "Ongoing",
        description: "Covering the annual school fees, uniforms, and books for 20 children to ensure their future is bright and full of opportunities.",
        image: "images/charity-kids.png",
        goal: 100000,
        raised: 40000,
        status: "Active"
    },
    {
        id: "cause-3",
        title: "Worker's Medical Emergency Fund",
        category: "Critical",
        description: "Emergency surgeries and medical bills for workers injured on sites. Your contribution ensures no one is left untreated because of money.",
        image: "images/charity-kids.png", // Using kids image as placeholder for medical as I ran out of quota
        goal: 100000,
        raised: 85000,
        status: "Active"
    }
];

// Exporting for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = defaultDonationCauses;
} else {
    window.donationCausesData = defaultDonationCauses;
}
