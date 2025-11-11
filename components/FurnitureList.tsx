import React, { useState } from 'react';
import { Furniture } from '../types';
import { ExternalLinkIcon } from './icons/Icons';
import ImageWithFallback from './ImageWithFallback';


interface FurnitureListProps {
  furniture: Furniture[];
}

const FurnitureList: React.FC<FurnitureListProps> = ({ furniture }) => {
  return (
    <div className="space-y-4" role="list" aria-label="Recomendaciones de muebles">
      {furniture
        .filter(item => item.link && item.imageUrl) // Filter: only show items with a valid link AND image URL
        .map((item, index) => (
        <div key={index} className="bg-gray-50 p-4 rounded-2xl shadow-md transition-all hover:scale-[1.02] flex flex-col sm:flex-row items-start gap-4" role="listitem">
          <ImageWithFallback src={item.imageUrl} alt={item.name} className="w-full sm:w-24 h-24 object-cover rounded-lg flex-shrink-0" fallbackIconClassName="w-1/2 h-1/2" loading="lazy" />
          <div className="flex-grow">
            <div className="flex justify-between items-start">
              <h5 className="font-bold text-lg text-text-color">{item.name}</h5>
              <span className="text-lg font-semibold text-text-color">{item.price}</span>
            </div>
            <p className="text-sm text-text-color-soft mt-1 mb-3">{item.description}</p>
            {item.link && ( 
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary-accent hover:text-primary-accent/80 transition-colors"
                aria-label={`Ver producto: ${item.name}`}
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