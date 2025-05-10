import { MapPin, Users, ShieldCheck, Clock, CheckCircle, ArrowRight } from "lucide-react";

const AboutUs = () => {
    return (
        <div className="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 py-40 px-6">
            {/* Hero Section */}
            <div className="max-w-5xl mx-auto text-center">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">🌍 Welcome to TouriPearl</h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                    Connecting travelers with expert local guides in Sri Lanka for unique and unforgettable experiences.
                </p>
            </div>

            {/* Features Section */}
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FeatureCard icon={<Users className="text-blue-500" size={32} />} title="Authentic Local Guides"
                             description="Handpicked professionals with deep knowledge of Sri Lanka." />

                <FeatureCard icon={<Clock className="text-green-500" size={32} />} title="Real-Time Availability"
                             description="Instant booking with live availability of guides." />

                <FeatureCard icon={<MapPin className="text-red-500" size={32} />} title="Personalized Experiences"
                             description="Custom tours tailored to your interests and pace." />

                <FeatureCard icon={<ShieldCheck className="text-purple-500" size={32} />} title="Secure & Reliable"
                             description="Safe payments and verified guides for peace of mind." />

                <FeatureCard icon={<CheckCircle className="text-yellow-500" size={32} />} title="Seamless Booking"
                             description="Easy-to-use platform for finding and booking guides." />
            </div>

            {/* Call to Action */}
            <div className="mt-12 text-center">
                <a href="#" className="bg-blue-600 dark:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 dark:hover:bg-blue-800 inline-flex">
                    Find Your Guide <ArrowRight size={20} />
                </a>
            </div>
        </div>
    );
};

const FeatureCard = ({ icon, title, description }) => {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-start gap-4">
            <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full">{icon}</div>
            <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{description}</p>
            </div>
        </div>
    );
};

export default AboutUs;
