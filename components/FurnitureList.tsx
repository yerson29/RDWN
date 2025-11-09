import React, { useState } from 'react';
import { Furniture } from '../types';
import { ExternalLinkIcon } from './icons/Icons';
import ImageWithFallback from './ImageWithFallback';


interface FurnitureListProps {
  furniture: Furniture[];
}

const FurnitureList: React.FC<FurnitureListProps> = ({ furniture }) => {
  return (
    <div className="space-y-4">
      {furniture
        .filter(item => item.link) // Filter: only show items with a valid link
        .map((item, index) => (
        <div key={index} className="bg-gray-50 p-4 rounded-2xl shadow-md transition-all hover:scale-[1.02] flex flex-col sm:flex-row items-start gap-4"> {/* Changed bg-white/50 to bg-gray-50 */}
          <ImageWithFallback src={item.imageUrl} alt={item.name} className="w-full sm:w-24 h-24 object-cover rounded-lg flex-shrink-0" fallbackIconClassName="w-1/2 h-1/2" />
          <div className="flex-grow">
            <div className="flex justify-between items-start">
              <h5 className="font-bold text-lg text-text-color">{item.name}</h5> {/* Changed text-white to text-text-color */}
              <span className="text-lg font-semibold text-text-color">{item.price}</span> {/* Changed text-white to text-text-color */}
            </div>
            <p className="text-sm text-text-color-soft mt-1 mb-3">{item.description}</p> {/* Changed text-white/70 to text-text-color-soft */}
            {item.link && ( 
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary-accent hover:text-primary-accent/80 transition-colors" /* Adjusted text color */
              >
                Ver producto <ExternalLinkIcon className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FurnitureList;