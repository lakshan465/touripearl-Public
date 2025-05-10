import { useState, lazy, Suspense } from "react";
import {Users, Book, Loader2, Calendar} from "lucide-react";
import GuideDashboard from "../../Dashboard/GuideDashboard.jsx";

// Lazy load components
const ReservationStat =lazy(()=>import("./pages/ReservationStat.jsx"));
const BookingStat = lazy(() => import("./pages/BookingStat.jsx"));
const AvailabilityCalendarOfGuide = lazy(() => import("./pages/AvailabilityCalendarOfGuide.jsx"));
// Dynamic component mapping
const categoryComponents = {
    Availability: AvailabilityCalendarOfGuide,
    Reservations: ReservationStat,
    Bookings: BookingStat,
};

// Icons for categories
const categoryIcons = {
    Reservations: Users,
    Bookings: Book,
    Availability : Calendar,
};

const GuideDashboardPage = () => {
    const [activeCategory, setActiveCategory] = useState("Availability");
    const ActiveComponent = categoryComponents[activeCategory];

    return (
        <GuideDashboard title="Guide Dashboard">
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 mb-4 bg-light/10">
                <h2 className="text-2xl font-bold mb-4 sm:mb-0 text-white">
                    Analytical Overview
                </h2>
                <div className="flex gap-2">
                    {Object.keys(categoryComponents).map((category) => {
                        const IconComponent = categoryIcons[category];
                        return (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`
                  inline-flex items-center gap-2 px-4 py-2 rounded-lg
                  transition-all duration-200 ease-in-out
                  ${
                                    activeCategory === category
                                        ? "bg-highlight text-white shadow-lg hover:bg-highlight/90"
                                        : "bg-secondary text-secondary hover:bg-secondary/90 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                                }
                `}
                            >
                                <IconComponent className="w-4 h-4 text-white" />
                                <span className="capitalize">{category} Details</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Content Section */}
            <div className="p-4">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg transition-all duration-200">
                    <Suspense
                        fallback={
                            <div className="flex items-center justify-center h-96">
                                <div className="flex flex-col items-center gap-4">
                                    <Loader2 className="w-8 h-8 animate-spin text-highlight" />
                                    <p className="text-secondary dark:text-gray-400">Loading data...</p>
                                </div>
                            </div>
                        }
                    >
                        <div className="p-6">
                            <ActiveComponent />
                        </div>
                    </Suspense>
                </div>
            </div>
        </GuideDashboard>
    );
};

export default GuideDashboardPage;
