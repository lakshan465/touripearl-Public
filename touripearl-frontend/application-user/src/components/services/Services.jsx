import { Map, Compass, CalendarCheck, ShieldCheck, MessageCircle, ArrowRight } from "lucide-react";

const Services = () => {
    return (
        <div className="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 py-40 px-6">
            {/* Header Section */}
            <div className="max-w-5xl mx-auto text-center">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">🌟 Our Services</h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                    Discover the best travel experiences with our expert services, designed to make your journey seamless and memorable.
                </p>
            </div>

            {/* Services Grid */}
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ServiceCard
                    icon={<Compass className="text-blue-500" size={32} />}
                    title="Guided Tours"
                    description="Explore Sri Lanka with professional guides who know the best places to visit."
                />

                <ServiceCard
                    icon={<Map className="text-green-500" size={32} />}
                    title="Custom Itineraries"
                    description="Plan personalized trips tailored to your interests, schedule, and budget."
                />

                <ServiceCard
                    icon={<CalendarCheck className="text-red-500" size={32} />}
                    title="Easy Online Booking"
                    description="Book tours and guides in just a few clicks with our user-friendly platform."
                />

                <ServiceCard
                    icon={<ShieldCheck className="text-purple-500" size={32} />}
                    title="Secure Payments"
                    description="Enjoy hassle-free transactions with our secure and reliable payment system."
                />

                <ServiceCard
                    icon={<MessageCircle className="text-yellow-500" size={32} />}
                    title="24/7 Support"
                    description="Get assistance anytime with our dedicated customer support team."
                />
            </div>

            {/* Call to Action */}
            <div className="mt-12 text-center">
                <a href="#" className="bg-blue-600 dark:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 dark:hover:bg-blue-800 inline-flex">
                    Explore Services <ArrowRight size={20} />
                </a>
            </div>
        </div>
    );
};

const ServiceCard = ({ icon, title, description }) => {
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

export default Services;
