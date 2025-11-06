import React, { useState } from 'react';

interface HexagonalColorPickerProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
}

export const HexagonalColorPicker = ({ selectedColor, onColorChange }: HexagonalColorPickerProps) => {
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);

  // Generate hexagonal color wheel
  const generateHexColors = () => {
    const colors: string[] = [];
    const rings = 5;
    
    for (let ring = 0; ring < rings; ring++) {
      const radius = ring === 0 ? 0 : ring;
      const hexCount = ring === 0 ? 1 : ring * 6;
      
      for (let i = 0; i < hexCount; i++) {
        const angle = (i / hexCount) * 360;
        const saturation = ring === 0 ? 0 : 70 + (ring * 5);
        const lightness = ring === 0 ? 100 : 50;
        
        const hue = angle;
        colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
      }
    }
    
    return colors;
  };

  const hexColors = generateHexColors();

  // Convert HSL to HEX
  const hslToHex = (hsl: string): string => {
    const match = hsl.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
    if (!match) return '#000000';
    
    const h = parseInt(match[1]);
    const s = parseInt(match[2]) / 100;
    const l = parseInt(match[3]) / 100;
    
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;
    
    let r = 0, g = 0, b = 0;
    
    if (h >= 0 && h < 60) { r = c; g = x; b = 0; }
    else if (h >= 60 && h < 120) { r = x; g = c; b = 0; }
    else if (h >= 120 && h < 180) { r = 0; g = c; b = x; }
    else if (h >= 180 && h < 240) { r = 0; g = x; b = c; }
    else if (h >= 240 && h < 300) { r = x; g = 0; b = c; }
    else if (h >= 300 && h < 360) { r = c; g = 0; b = x; }
    
    const toHex = (n: number) => {
      const hex = Math.round((n + m) * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  const currentHex = hoveredColor ? hslToHex(hoveredColor) : 
                     selectedColor.startsWith('#') ? selectedColor : hslToHex(selectedColor);

  // Generate shade variations for selected color
  const generateShades = (color: string) => {
    const hex = color.startsWith('#') ? color : hslToHex(color);
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    const shades: string[] = [];
    for (let i = 0; i < 9; i++) {
      const factor = 0.2 + (i * 0.1);
      const newR = Math.round(r * factor + 255 * (1 - factor));
      const newG = Math.round(g * factor + 255 * (1 - factor));
      const newB = Math.round(b * factor + 255 * (1 - factor));
      shades.push(`#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`);
    }
    return shades;
  };

  const shades = generateShades(hoveredColor || selectedColor);

  // Position hexagons in a circular/hexagonal pattern
  const getHexPosition = (index: number) => {
    if (index === 0) return { x: 0, y: 0 };
    
    let ring = 1;
    let indexInRing = index - 1;
    
    while (indexInRing >= ring * 6) {
      indexInRing -= ring * 6;
      ring++;
    }
    
    const angle = (indexInRing / (ring * 6)) * 2 * Math.PI;
    const radius = ring * 20;
    
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    };
  };

  return (
    <div className="space-y-4">
      <div className="relative w-full h-64 flex items-center justify-center">
        <svg width="300" height="250" viewBox="-150 -125 300 250" className="mx-auto">
          {hexColors.map((color, index) => {
            const pos = getHexPosition(index);
            const hexColor = hslToHex(color);
            const isSelected = hexColor === selectedColor || color === selectedColor;
            
            return (
              <g key={index} transform={`translate(${pos.x}, ${pos.y})`}>
                <polygon
                  points="-8,5 -8,-5 0,-10 8,-5 8,5 0,10"
                  fill={color}
                  stroke={isSelected ? '#000' : '#fff'}
                  strokeWidth={isSelected ? '2' : '0.5'}
                  className="cursor-pointer transition-all hover:stroke-black hover:stroke-2"
                  onClick={() => onColorChange(hexColor)}
                  onMouseEnter={() => setHoveredColor(color)}
                  onMouseLeave={() => setHoveredColor(null)}
                />
              </g>
            );
          })}
        </svg>
      </div>

      <div className="text-center">
        <div className="inline-block px-4 py-2 border rounded-lg bg-background">
          <span className="font-mono text-sm font-semibold">{currentHex.toUpperCase()}</span>
        </div>
      </div>

      <div>
        <div className="text-sm text-muted-foreground mb-2 text-center">Choose the shade</div>
        <div className="flex justify-center gap-1">
          {shades.map((shade, idx) => (
            <button
              key={idx}
              onClick={() => onColorChange(shade)}
              className={`w-8 h-8 rounded-full border-2 transition-all ${
                shade === selectedColor ? 'ring-2 ring-offset-2 ring-primary scale-110' : 'hover:scale-105'
              }`}
              style={{ backgroundColor: shade, borderColor: 'white' }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
