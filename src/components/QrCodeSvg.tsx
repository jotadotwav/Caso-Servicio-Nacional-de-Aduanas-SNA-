import React, { useMemo } from 'react';

interface QrProps {
  value: string;
  size?: number;
  className?: string;
}

export default function QrCodeSvg({ value, size = 160, className = '' }: QrProps) {
  // Deterministic matrix generation based on the input string hash
  const matrix = useMemo(() => {
    const dimension = 21; // standard QR version 1 size
    const grid = Array(dimension).fill(null).map(() => Array(dimension).fill(0));

    // Simple hash function to turn string into repeating bits
    const getHashValue = (str: string) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0; // Convert to 32bit integer
      }
      return Math.abs(hash);
    };

    const seed = getHashValue(value || 'CL-99999');

    // Helper to check if a cell falls in a finder pattern
    const isFinderPattern = (row: number, col: number) => {
      // Top-Left Finder: rows 0-6, cols 0-6
      if (row >= 0 && row <= 6 && col >= 0 && col <= 6) return true;
      // Top-Right Finder: rows 0-6, cols 14-20
      if (row >= 0 && row <= 6 && col >= 14 && col <= 20) return true;
      // Bottom-Left Finder: rows 14-20, cols 0-6
      if (row >= 14 && row <= 20 && col >= 0 && col <= 6) return true;
      return false;
    };

    // Draw finder patterns manually to ensure standard QR visual cues
    const drawFinder = (startRow: number, startCol: number) => {
      for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
          const row = startRow + r;
          const col = startCol + c;
          // Outer border is filled, inner ring is empty, center is filled
          const isBlack = r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4);
          grid[row][col] = isBlack ? 1 : -1; // -1 means empty and locked
        }
      }
    };

    // Initialize finders
    drawFinder(0, 0); // Top-left
    drawFinder(0, 14); // Top-right
    drawFinder(14, 0); // Bottom-left

    // Set simple alignment pattern in bottom right
    const alignX = 14;
    const alignY = 14;
    grid[alignY][alignX] = 1;

    // Fill the rest with pseudo-random bits based on the seed
    for (let r = 0; r < dimension; r++) {
      for (let c = 0; c < dimension; c++) {
        if (grid[r][c] === 0) {
          // Use index combined with seed to calculate cell state
          const state = ((seed >> ((r * c + r + c) % 30)) & 1) === 1;
          grid[r][c] = state ? 1 : 2; // 1 = black, 2 = white (for locked)
        }
      }
    }

    // Clean up empty placeholder values to 0 (white) or 1 (black)
    return grid.map(row => row.map(v => (v === 1 ? 1 : 0)));
  }, [value]);

  const dimension = 21;
  const cellSize = 10;
  const viewSize = dimension * cellSize;

  return (
    <svg
      id="passport-qr-code"
      width={size}
      height={size}
      viewBox={`0 0 ${viewSize} ${viewSize}`}
      className={`bg-white p-2 rounded-lg ${className}`}
      aria-label={`QR Code representing digital pass ${value}`}
    >
      {matrix.map((row, rIndex) =>
        row.map((cell, cIndex) => {
          if (cell === 1) {
            return (
              <rect
                key={`${rIndex}-${cIndex}`}
                x={cIndex * cellSize}
                y={rIndex * cellSize}
                width={cellSize}
                height={cellSize}
                fill="#0f172a" // slate-900 for modern high contrast UI
                shapeRendering="crispEdges"
              />
            );
          }
          return null;
        })
      )}
    </svg>
  );
}
