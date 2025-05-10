import React, { useEffect, useState } from "react";
import {
  Search,
  Star,
  Map,
  Clock,
  Users,
  Calendar,
  Heart,
  Home,
} from "lucide-react";
import axios from "axios";
import { services, steps, testimonials } from "../../data/Data.json";
import { Destinations, Events, JoinedGuides, RatedGuides } from "./Sections";
import GlobalSearch from "../websiteSearch/GlobalSearch";
import backUpimg from "../../assets/LionRock.jpg";
import {Link} from "react-router-dom";

const HomePage = () => {
  const [isVisible, setIsVisible] = useState({});
  const iconMapping = {
    Search: Search,
    Map: Map,
    Clock: Clock,
    Users: Users,
    Calendar: Calendar,
    Heart: Heart,
    Home: Home,
  };

  const [currentImage, setCurrentImage] = useState(0);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8085/api/v1/slideShow/getAll"
        );
        setImages(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchImages();
  }, []);

  // Automatically change the image every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible((prev) => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting,
          }));
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll("section").forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-light dark:bg-gray-900 text-secondary">
      {/* Hero Section */}
      <section
        id="hero"
        className="relative flex items-center justify-center h-screen"
      >
        <div className="absolute inset-0">
          {images.length > 0 ? (
            images.map((image, index) => (
              <img
                key={image.id}
                src={image.url}
                alt={`Slide ${index + 1}`}
                className={`w-full h-full object-cover absolute inset-0 ${
                  index === currentImage ? "opacity-100" : "opacity-0"
                } transition-opacity duration-1000`}
              />
            ))
          ) : (
            <img
              src={backUpimg}
              alt="Placeholder"
              className="absolute inset-0 object-cover w-full h-full"
            />
          )}
          <div className="absolute inset-0 bg-black/70" />{" "}
          {/* Increased opacity for better contrast */}
        </div>
        <div className="relative px-4 mx-auto text-center max-w-7xl">
          <h1 className="mb-4 text-4xl font-bold text-white md:text-6xl">
            Discover Sri Lanka with Expert Guides
          </h1>
          <p className="mb-8 text-xl text-white md:text-2xl">
            Tailored Tours for Every Traveler
          </p>
          <div className="flex justify-center mb-8">
            <GlobalSearch />
          </div>
          <Link to={"/guide-list"}>
          <button className="px-8 py-3 mt-4 text-lg font-semibold text-white transition-colors rounded-lg bg-primary hover:bg-primary/90 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600">
            Book a Guide
          </button>
          </Link>
          {/* Slideshow Indicators */}
        </div>
        <div className="absolute  mb-9 flex space-x-2 transform -translate-x-1/2 bottom-11 left-1/2">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`w-3 h-3 rounded-full ${
                index === currentImage ? "bg-white" : "bg-gray-400"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Latest Events Section */}
      <section
        id="events"
        className={`py-20 bg-white dark:bg-gray-800 ${
          isVisible.events
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        } transition-all duration-1000`}
      >
        <Events />
      </section>

      {/* Latest Events Section */}
      <section
        id="destinations"
        className={`py-20 bg-white dark:bg-gray-800 ${
          isVisible.destinations
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        } transition-all duration-1000`}
      >
        <Destinations />
      </section>

      {/* Top Rated Guides Section */}
      <section
        id="ratedGuides"
        className={`py-20 bg-white dark:bg-gray-800 ${
          isVisible.ratedGuides
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        } transition-all duration-1000`}
      >
        <RatedGuides />
      </section>

      {/* New Guides Section */}
      <section
        id="newGuides"
        className={`py-20 bg-white dark:bg-gray-800 ${
          isVisible.newGuides
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        } transition-all duration-1000`}
      >
        <JoinedGuides />
      </section>

      {/* Services Section */}
      <section
        id="services"
        className={`py-20 bg-light/30 dark:bg-gray-900 ${
          isVisible.services
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        } transition-all duration-1000`}
      >
        <div className="px-4 mx-auto max-w-7xl">
          <h2 className="mb-12 text-3xl font-bold text-center text-primary dark:text-white">
            Our Services
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {services.map(({ icon, title, description }) => {
              const Icon = iconMapping[icon];
              return (
                <div key={title} className="p-6 text-center">
                  {Icon && (
                    <Icon className="w-12 h-12 mx-auto mb-4 text-accent" />
                  )}
                  <h3 className="mb-2 text-xl font-semibold text-primary dark:text-white">
                    {title}
                  </h3>
                  <p className="text-secondary dark:text-gray-300">
                    {description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="process"
        className={`py-20 bg-white dark:bg-gray-800 ${
          isVisible.process
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        } transition-all duration-1000`}
      >
        <div className="px-4 mx-auto max-w-7xl">
          <h2 className="mb-12 text-3xl font-bold text-center text-primary dark:text-white">
            How It Works
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {steps.map(({ icon: icon, title, description }, index) => {
              const Icon = iconMapping[icon];
              return (
                <div
                  key={title}
                  className="flex flex-col items-center text-center"
                >
                  <div className="relative mb-8">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-accent">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    {index < steps.length - 1 && (
                      <div className="hidden md:block absolute top-1/2 left-full w-full h-0.5 bg-accent" />
                    )}
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-primary dark:text-white">
                    {title}
                  </h3>
                  <p className="text-secondary dark:text-gray-300">
                    {description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        id="testimonials"
        className={`py-20 bg-light/30 dark:bg-gray-900 ${
          isVisible.testimonials
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        } transition-all duration-1000`}
      >
        <div className="px-4 mx-auto max-w-7xl">
          <h2 className="mb-12 text-3xl font-bold text-center text-primary dark:text-white">
            What Our Travelers Say
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.name}
                className="p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-highlight" />
                  ))}
                </div>
                <p className="mb-4 text-secondary dark:text-gray-300">
                  {testimonial.text}
                </p>
                <div>
                  <p className="font-semibold text-primary dark:text-white">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-secondary dark:text-gray-400">
                    {testimonial.location}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
