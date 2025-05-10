import { useState, useEffect } from "react";
import {
  Menu,
  X,
  Home,
  Info,
  Phone,
  Book,
  LogIn,
  UserRoundPlus,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { Link } from "react-router-dom";
import getInitials from "../../utils/getInitials";
import UserDropdown from "../userDropdown/userDropdown";
import { useAuth } from "../../utils/Auth";
import ConfirmationDialog from "../confirmation-dialog/ConfirmationDialog";
import BellNotifi from "../../components/Notification/Tourist"
const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, logout } = useAuth();

  const navItems = [
    { name: "Home", icon: Home, link: "/" },
    { name: "About", icon: Info, link: "/about-us" },
    { name: "Services", icon: Book, link: "/services" },
    { name: "Contact", icon: Phone, link: "/contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      if (currentScrollY > lastScrollY && currentScrollY > 600) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <nav
      className={`
        fixed w-full transition-all duration-300 ease-in-out z-50
        ${isVisible ? "translate-y-0" : "-translate-y-full"}
        ${
          isScrolled
            ? "py-2 bg-primary/80 dark:bg-gray-900/80 backdrop-blur-sm"
            : "py-4 bg-transparent"
        }
      `}
    >
      <div className="px-4 mx-auto max-w-7xl">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className={`
              font-semibold text-white transition-all duration-300
              ${isScrolled ? "text-2xl" : "text-3xl"}
            `}
          >
            TouriPearl
          </Link>

          <div className="items-center hidden space-x-8 md:flex">
            {navItems.map(({ name, icon: Icon, link }) => (
              <Link
                key={name}
                to={link}
                className={`
                  flex items-center space-x-1 text-white hover:text-highlight
                  transition-all duration-300
                  ${isScrolled ? "text-sm" : "text-base"}
                `}
              >
                <Icon
                  className={`
                  transition-all duration-300 text-accent
                  ${isScrolled ? "w-4 h-4" : "w-5 h-5"}
                `}
                />
                <span>{name}</span>
              </Link>
            ))}

            {user.isAuthenticated ? (
              <>
              
                <Link
                  to="/customTourView"
                  className={`
                  flex items-center space-x-1 text-white hover:text-highlight 
                  transition-all duration-300 ${
                    isScrolled ? "text-sm" : "text-base"
                  }
                `}
                >
                  <Book
                    className={`
                    transition-all duration-300 text-accent
                    ${isScrolled ? "w-4 h-4" : "w-5 h-5"}
                    `}
                  />
                  <span>Your Custom Tour</span>
                </Link>
                <div><BellNotifi/></div>
                <UserDropdown
                  isScrolled={isScrolled}
                  isDropdownOpen={isDropdownOpen}
                  setIsDropdownOpen={setIsDropdownOpen}
                  userData={user.user}
                  getInitials={getInitials}
                  handleLogout={logout}
                />




              </>
            ) : (
              <>
                <Link
                  to="/guide-intro"
                  className={`
                  flex items-center space-x-1 text-white hover:text-highlight 
                  transition-all duration-300 ${
                    isScrolled ? "text-sm" : "text-base"
                  }
                `}
                >
                  <Book
                    className={`
                    transition-all duration-300 text-accent
                    ${isScrolled ? "w-4 h-4" : "w-5 h-5"}
                    `}
                  />
                  <span>Join Us as a Guide</span>
                </Link>
                <Link
                  to="/login"
                  className={`
                  flex items-center space-x-1 text-white hover:text-highlight 
                  transition-all duration-300 ${
                    isScrolled ? "text-sm" : "text-base"
                  }
                `}
                >
                  <LogIn
                    className={`
                    transition-all duration-300 text-accent
                    ${isScrolled ? "w-4 h-4" : "w-5 h-5"}
                  `}
                  />
                  <span>Login</span>
                </Link>
                <Link
                  to="/signUp"
                  className={`
                  flex items-center space-x-1 text-white hover:text-highlight 
                  transition-all duration-300 ${
                    isScrolled ? "text-sm" : "text-base"
                  }
                `}
                >
                  <UserRoundPlus
                    className={`
                    transition-all duration-300 text-accent
                    ${isScrolled ? "w-4 h-4" : "w-5 h-5"}
                  `}
                  />
                  <span>Signup</span>
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white transition-colors md:hidden hover:text-highlight"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        <div
          className={`
            md:hidden absolute left-0 right-0 bg-primary/95 dark:bg-gray-900/95 backdrop-blur-sm
            transition-all duration-300 ease-in-out
            ${
              isMenuOpen
                ? "top-full opacity-100"
                : "-top-96 opacity-0 pointer-events-none"
            }
          `}
        >
          <div className="px-4 py-6 space-y-4">
            {navItems.map(({ name, icon: Icon, link }) => (
              <Link
                key={name}
                to={link}
                className="flex items-center py-2 space-x-2 text-white transition-colors hover:text-highlight"
                onClick={() => setIsMenuOpen(false)}
              >
                <Icon className="w-5 h-5 text-accent" />
                <span>{name}</span>
              </Link>
            ))}
            {user.isAuthenticated && (
              <div className="pt-4 border-t border-secondary">
                {[
                  { name: "Profile", icon: User, link: "/tourist/profile" },
                ].map(({ name, icon: Icon, link }) => (
                  <Link
                    key={name}
                    to={link}
                    className="flex items-center py-2 space-x-2 text-white transition-colors hover:text-highlight"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5 text-accent" />
                    <span>{name}</span>
                  </Link>
                ))}
                <ConfirmationDialog
                  title="Logout"
                  description="Are you sure you want to logout?"
                  confirmText="Logout"
                  onConfirm={() => logout()}
                >
                  <div className="flex items-center py-2 space-x-2 text-white transition-colors hover:text-highlight">
                    <LogOut className="h-5 w-5 text-accent" />
                    <span>Logout</span>
                  </div>
                </ConfirmationDialog>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
