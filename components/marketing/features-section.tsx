import FeatureCard from "./feature-card";
const features = [
    {
        id: 1,
        title: "Multi-Institution Support",
        description: "Manage results for multiple schools and colleges securely from one platform.",
    },
    {
        id: 2,
        title: "Automated Calculations",
        description: "Instant grade, GPA, and percentage calculation with zero manual errors.",
    },
    {
        id: 3,
        title: "Downloadable Result Cards",
        description: "Generate professional PDF result cards with institution branding.",
    },
]

const FeaturesSection = () => {
    return (
        <section className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <h3 className="text-3xl font-semibold text-center mb-12">
                    Why Choose ResultCard?
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map(feature => (
                        <li key={feature.id}>
                            <FeatureCard title={feature.title} description={feature.description} />
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}

export default FeaturesSection;
