import React from 'react';

interface FieldGroupProps {
  title: string;
  children: React.ReactNode;
}

export function FieldGroup({ title, children }: FieldGroupProps) {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3 pb-1 border-b border-slate-200">
        {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {children}
      </div>
    </div>
  );
}
