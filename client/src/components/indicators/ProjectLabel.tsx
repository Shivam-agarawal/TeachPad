import React from 'react';

interface ProjectLabelProps {
  projectName: string;
}

export const ProjectLabel: React.FC<ProjectLabelProps> = ({ projectName }) => {
  return (
    <div className="fixed top-6 left-6 z-50 animate-entry">
      <div className="glass-panel rounded-full px-4 py-2 flex items-center gap-3">
        <span className="font-h3 text-[18px] font-bold tracking-tight text-[#0058bc]">TeachPad</span>
        <div className="w-[1px] h-4 bg-[#c1c6d7]/30 mx-1" />
        <span className="text-[14px] font-semibold text-[#1b1b1d]/80 max-w-[220px] truncate">
          {projectName}
        </span>
        <div className="flex items-center gap-1 ml-2 opacity-60 text-[#414755]">
          <span className="material-symbols-outlined text-[16px]">cloud_done</span>
          <span className="text-[12px] font-medium">Saved</span>
        </div>
      </div>
    </div>
  );
};
