import React from 'react';

interface ProjectLabelProps {
  projectName: string;
}

export const ProjectLabel: React.FC<ProjectLabelProps> = ({ projectName }) => {
  return (
    <div className="absolute top-4 left-4 z-40">
      <span className="text-[13px] font-medium text-[var(--text-secondary)]">
        {projectName}
      </span>
    </div>
  );
};
