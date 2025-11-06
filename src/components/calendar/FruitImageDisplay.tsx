import React from 'react';
import { FruitImage } from '@/types/calendar';

interface FruitImageDisplayProps {
  image: FruitImage;
}

export const FruitImageDisplay = ({ image }: FruitImageDisplayProps) => {
  return (
    <div className="bg-card border rounded-lg p-6 text-center">
      <img
        src={image.image}
        alt={image.name}
        className="w-48 h-48 object-contain mx-auto mb-4"
      />
      {image.description && (
        <p className="text-sm text-muted-foreground">{image.description}</p>
      )}
    </div>
  );
};
