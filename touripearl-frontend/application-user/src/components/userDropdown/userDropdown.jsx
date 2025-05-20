import {useRef, useEffect} from 'react';
import {User, LogOut,Calendar,BookOpen} from 'lucide-react';
import {Link} from 'react-router-dom';

const UserDropdown = ({isScrolled, isDropdownOpen, setIsDropdownOpen, userData, getInitials, handleLogout}) => {
    const dropdownRef = useRef(null);

    const dropdownItems = [
        {name: 'Profile', icon: User, link: "/tourist/profile"},
        {name: 'My Reservations', icon: Calendar, link: "/tourist/reservations"},
        {name: 'My Bookings', icon: BookOpen, link: "/tourist/booking-list"}
    ];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [setIsDropdownOpen]);

    return (
        <div ref={dropdownRef} className="relative">
            <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`
          flex items-center space-x-1 text-white hover:text-gray-300 
          transition-all duration-300 focus:outline-none
          ${isScrolled ? 'text-sm' : 'text-base'}
        `}
            >
                <div
                    className="relative w-8 h-8 hover:bg-gray-400  rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                    {
                        userData?.profileImage?.resourceUrl ? (
                            <img
                                src={userData?.profileImage?.resourceUrl}
                                alt={userData.userName}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="text-lg font-semibold text-gray-600">
              {getInitials(userData.userName)}
            </span>
                        )
                    }
                </div>

            </button>

            <div className={`
        absolute right-0 mt-2 w-48 rounded-md shadow-lg
        transition-all duration-200 transform origin-top-right
        ${isDropdownOpen
                ? 'opacity-100 scale-100'
                : 'opacity-0 scale-95 pointer-events-none'
            }
      `}>
                <div className="bg-white rounded-md shadow-xs py-1">
                    {dropdownItems.map(({name, icon: Icon, link}) => (
                        <Link
                            key={name}
                            to={link}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsDropdownOpen(false)}
                        >
                            <Icon className="w-4 h-4 mr-2"/>
                            {name}
                        </Link>
                    ))}
                    <Link
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                            handleLogout();
                            setIsDropdownOpen(false);
                        }}
                    >
                        <LogOut className="w-4 h-4 mr-2"/>
                        Logout
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default UserDropdown;