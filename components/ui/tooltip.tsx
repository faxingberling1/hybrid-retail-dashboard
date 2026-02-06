// apps/dashboard/components/ui/tooltip.tsx
'use client';

import { ReactNode, useState } from 'react';

interface TooltipProps {
  children: ReactNode;
  content: string;
}

export function Tooltip({ children, content }: TooltipProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
      >
        {children}
      </div>
      {visible && (
        <div className="absolute z-10 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded-lg shadow-sm -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
          {content}
          <div className="absolute w-2 h-2 bg-gray-900 rotate-45 -bottom-1 left-1/2 -translate-x-1/2" />
        </div>
      )}
    </div>
  );
}