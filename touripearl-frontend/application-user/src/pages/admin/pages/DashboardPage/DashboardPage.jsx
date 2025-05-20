import { useState, lazy, Suspense } from "react";
import { BarChart3, UserPlus, Loader2, TreePalm } from "lucide-react";
import Dashboard from "../../dashboard/Dashboard.jsx";

import ImgView from "./DashBordCompo/ImgView.jsx";

const GuideStats = lazy(() => import("./pages/GuideStats.jsx"));
const UserStats = lazy(() => import("./pages/UserStats.jsx"));
const EventStats = lazy(() => import("./pages/EventStats.jsx"));

// Update keys to match the actual categories
const categoryComponents = {
  User: UserStats,
  Guide: GuideStats,
  Event: EventStats,
};

const categoryIcons = {
  User: UserPlus,
  Guide: BarChart3,
  Event: TreePalm,
};

const DashboardPage = () => {
  const [activeCategory, setActiveCategory] = useState("User");
  const ActiveComponent = categoryComponents[activeCategory];

  return (
    <Dashboard title="Dashboard">
      <div className="flex flex-col sm:flex-row items-center justify-between p-4 mb-4 bg-light/10">
        <h2 className="text-2xl font-bold mb-4 sm:mb-0 text-white">
          Analytics Overview
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
                <span className="capitalize">{category} Stats</span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg transition-all duration-200">
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-96">
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="w-8 h-8 animate-spin text-highlight" />
                  <p className="text-secondary dark:text-gray-400">
                    Loading stats...
                  </p>
                </div>
              </div>
            }
          >
            <div className="p-6">
              <ActiveComponent />
            </div>
          </Suspense>
        </div>

        {/* <div className="mt-2">
          <ImgView />
        </div> */}
      </div>
    </Dashboard>
  );
};

export default DashboardPage;
