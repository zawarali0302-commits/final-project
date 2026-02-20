import StatCard from "./stat-card";

const stats = [
    {
        id: 1,
        value: "100+",
        label: "Institutions",
    },
    {
        id: 2,
        value: "50k+",
        label: "Students",
    },
    {
        id: 3,
        value: "99%",
        label: "Accuracy",
    },
    {
        id: 4,
        value: "24/7",
        label: "Availability",
    }
]
const HeroSection = () => {
    return (
        <section className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
                <h2 className="text-4xl font-bold leading-tight mb-6">
                    Generate Student Result Cards
                    <span className="block text-gray-500">For Any School or College</span>
                </h2>
                <p className="text-gray-600 mb-8 max-w-xl">
                    A modern platform that helps educational institutions create and
                    manage official student result cards efficiently.
                </p>
                <div className="flex gap-4">
                    <button className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800">
                        Register Institution
                    </button>
                    <button className="border border-gray-300 px-6 py-3 rounded-xl hover:bg-gray-100">
                        View Demo
                    </button>
                </div>
            </div>


            <ul className="bg-white rounded-3xl shadow-lg p-8 grid grid-cols-2 gap-6 text-center">
                {stats.map(stat => (
                    <li key={stat.id}>
                        <StatCard value={stat.value} label={stat.label} />
                    </li>
                ))}
            </ul>
        </section>
    );
}

export default HeroSection;