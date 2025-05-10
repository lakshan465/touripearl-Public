import React from 'react'
import {ChevronLeft, ChevronRight} from 'lucide-react'
import { useState } from 'react';
import { Dot } from 'lucide-react';

const ImageSlider = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
  
    const prevImage = () => {
      setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    };
  
    const nextImage = () => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };
  
    return (
      <div className="relative w-100%  h-[780px] py-16 px-4 group">
        <img
          src={images[currentIndex].destinationImageResourceUrl}
          alt={`Destination view ${currentIndex + 1}`}
          className="object-cover w-full h-full runded-lg"
        />
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute p-2 transform -translate-y-1/2 rounded-full left-5 top-[50%] bg-white/50 hover:bg-white/75 -translate-x-0 text-2xl hidden group-hover:block"
            >
              <ChevronLeft size={32} />
            </button>
            <button
              onClick={nextImage}
              className="absolute p-2 transform -translate-y-1/2 rounded-full right-5 top-[50%] bg-white/50 hover:bg-white/75 -translate-x-0 text-2xl hidden group-hover:block"
            >
              <ChevronRight size={32} />
            </button>
            
          </>
        )}
        <div className="flex justify-center py-2 top-4">
            {images.map((slide, index) => (
              <div
                key={index}
                className="cursor-pointer text-10xl"
                onClick={() => setCurrentIndex(index)}
              >
                <Dot />
              </div>
            ))}
          </div>
      </div>
    );
  };
  
  export default ImageSlider;