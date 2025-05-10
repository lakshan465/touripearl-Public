import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Check, X } from 'lucide-react';
import axiosFetch from "../../utils/axiosFetch.js";
import Loader from "../loader/Loader.jsx";

const DateSelection = ({guideId, setSelectedDate, tourDateRange}) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [calendar, setCalendar] = useState([]);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [transitionDirection, setTransitionDirection] = useState('right');
    const [isLoading, setIsLoading] = useState(true);
    const [unavailabilityRanges, setUnavailabilityRanges] = useState([]);


    useEffect(() => {
        const fetchData = async() => {
            setIsLoading(true);
            try {
                const response = await axiosFetch.get(`api/v1/booking/unavailability/${guideId}`)
                console.log(response.data.object);
                setUnavailabilityRanges(response?.data?.object?.map(range => [new Date(range.startDate), new Date(range.endDate)]));
            } catch (error) {
                alert("Error fetching guide unavailability ranges");
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, [guideId]);

    // Get today's date at midnight for comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if a date is in the future
    const isFutureDate = (date) => {
        const dateToCheck = new Date(date);
        dateToCheck.setHours(0, 0, 0, 0);
        return dateToCheck >= today;
    };

    // Check if a date is unavailable based on the unavailability ranges
    const isDateUnavailable = (date) => {
        if (!date) return false;

        const checkDate = new Date(date);
        checkDate.setHours(0, 0, 0, 0);

        for (const [start, end] of unavailabilityRanges) {
            const rangeStart = new Date(start);
            rangeStart.setHours(0, 0, 0, 0);

            const rangeEnd = new Date(end);
            rangeEnd.setHours(0, 0, 0, 0);

            if (checkDate >= rangeStart && checkDate <= rangeEnd) {
                return true;
            }
        }

        // If not in any unavailability range, it's available
        return false;
    };

    // Check if a tour starting on this date would conflict with unavailability
    const wouldTourConflict = (startDate) => {
        if (!startDate || tourDateRange <= 0) return false;

        // Check each day of the potential tour
        for (let i = 0; i < tourDateRange; i++) {
            const tourDay = new Date(startDate);
            tourDay.setDate(tourDay.getDate() + i);

            if (isDateUnavailable(tourDay)) {
                return true; // Found a conflict
            }
        }

        return false; // No conflicts found
    };

    // Generate calendar for the current month
    const generateCalendar = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();

        // First day of the month
        const firstDay = new Date(year, month, 1);
        // Last day of the month
        const lastDay = new Date(year, month + 1, 0);

        // Start from the previous month's days to fill the first week
        const startingDayOfWeek = firstDay.getDay(); // 0 = Sunday, 6 = Saturday
        const daysInMonth = lastDay.getDate();

        const calendarDays = [];

        // Add previous month's days
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        for (let i = startingDayOfWeek - 1; i >= 0; i--) {
            const date = new Date(year, month - 1, prevMonthLastDay - i);
            const tourConflict = wouldTourConflict(date);
            calendarDays.push({
                date,
                isCurrentMonth: false,
                isPast: !isFutureDate(date),
                isUnavailable: isDateUnavailable(date) || tourConflict,
                hasTourConflict: tourConflict
            });
        }

        // Add current month's days
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const tourConflict = wouldTourConflict(date);
            calendarDays.push({
                date,
                isCurrentMonth: true,
                isPast: !isFutureDate(date),
                isUnavailable: isDateUnavailable(date) || tourConflict,
                hasTourConflict: tourConflict
            });
        }

        // Add next month's days to fill the last week
        const lastDayOfWeek = lastDay.getDay();
        const daysToAdd = 6 - lastDayOfWeek;
        for (let i = 1; i <= daysToAdd; i++) {
            const date = new Date(year, month + 1, i);
            const tourConflict = wouldTourConflict(date);
            calendarDays.push({
                date,
                isCurrentMonth: false,
                isPast: !isFutureDate(date),
                isUnavailable: isDateUnavailable(date) || tourConflict,
                hasTourConflict: tourConflict
            });
        }

        setCalendar(calendarDays);
    };

    // Update calendar when month or unavailability ranges change
    useEffect(() => {
        generateCalendar();
    }, [currentMonth, unavailabilityRanges, tourDateRange]);

    // Navigate to previous month with transition
    const prevMonth = () => {
        setTransitionDirection('left');
        setIsTransitioning(true);

        setTimeout(() => {
            setCurrentMonth(prev => {
                const prevMonth = new Date(prev);
                prevMonth.setMonth(prev.getMonth() - 1);
                return prevMonth;
            });

            setTimeout(() => {
                setIsTransitioning(false);
            }, 50);
        }, 200);
    };

    // Navigate to next month with transition
    const nextMonth = () => {
        setTransitionDirection('right');
        setIsTransitioning(true);

        setTimeout(() => {
            setCurrentMonth(prev => {
                const nextMonth = new Date(prev);
                nextMonth.setMonth(prev.getMonth() + 1);
                return nextMonth;
            });

            setTimeout(() => {
                setIsTransitioning(false);
            }, 50);
        }, 200);
    };

    // Handle date selection
    const handleDateSelect = (day) => {
        // Don't allow selecting past or unavailable days
        if (day.isPast || day.isUnavailable) return;
        const selectedDate=new Date(day.date)
        selectedDate.setDate(selectedDate.getDate()+1)
        setSelectedDate(selectedDate.toISOString().split("T")[0]); // Pass the selected date up to the parent component
    };

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    if(isLoading) {
        return <Loader/>;
    }

    return (
        <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-lg transition-shadow duration-300 hover:shadow-xl">
            <div className="flex items-center gap-2 mb-4">
                <Calendar className="text-indigo-600" size={20} />
                <h2 className="text-xl font-bold text-indigo-700">Select Your Date</h2>
            </div>

            <div className="mb-4">
                <div className="flex justify-between items-center mb-4">
                    <button
                        onClick={prevMonth}
                        className="p-2 bg-indigo-50 rounded-full hover:bg-indigo-100 transition-colors duration-200 flex items-center justify-center text-indigo-700"
                        aria-label="Previous month"
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <h3 className="text-lg font-medium text-gray-800">
                        {currentMonth.toLocaleDateString('default', { month: 'long', year: 'numeric' })}
                    </h3>
                    <button
                        onClick={nextMonth}
                        className="p-2 bg-indigo-50 rounded-full hover:bg-indigo-100 transition-colors duration-200 flex items-center justify-center text-indigo-700"
                        aria-label="Next month"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>

                {tourDateRange > 0 && (
                    <div className="mb-4 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                        Tour duration: {tourDateRange} {tourDateRange === 1 ? 'day' : 'days'}. Dates that would cause conflicts are marked unavailable.
                    </div>
                )}

                <div className={`
                    grid grid-cols-7 gap-1
                    transition-opacity duration-200 ease-in-out
                    ${isTransitioning ? 'opacity-0' : 'opacity-100'}
                    transform ${isTransitioning ? (transitionDirection === 'right' ? 'translate-x-4' : '-translate-x-4') : 'translate-x-0'}
                    transition-transform duration-200
                `}>
                    {days.map(day => (
                        <div key={day} className="text-center font-medium text-sm py-2 text-gray-600">
                            {day}
                        </div>
                    ))}

                    {calendar.map((day, index) => (
                        <div
                            key={index}
                            onClick={() => handleDateSelect(day)}
                            className={`
                                p-2 text-center rounded-lg transition-all duration-200
                                hover:scale-105 hover:font-medium
                                flex items-center justify-center flex-col
                                ${!day.isCurrentMonth ? 'text-gray-400 hover:bg-gray-50' : ''}
                                ${day.isPast ? 'text-gray-400 bg-gray-50 cursor-not-allowed' : 'cursor-pointer'}
                                ${!day.isPast && !day.isUnavailable && day.isCurrentMonth ? 'bg-green-50 hover:bg-green-100 text-green-800' : ''}
                                ${!day.isPast && day.isUnavailable && day.isCurrentMonth ? 'bg-red-50 hover:bg-red-100 text-red-700' : ''}
                             
                            `}
                            title={day.hasTourConflict ? 'Tour date conflict' : day.isUnavailable ? 'Unavailable' : 'Available'}
                        >
                            <span className="text-sm">{day.date.getDate()}</span>
                            {!day.isPast && day.isCurrentMonth && (
                                <span className="mt-1">
                                    {day.isUnavailable ?
                                        <X size={14} className={day.hasTourConflict ? "text-orange-500" : "text-red-500"} /> :
                                        <Check size={14} className="text-green-500" />
                                    }
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            </div>


        </div>
    );
};

export default DateSelection;