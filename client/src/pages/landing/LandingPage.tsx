import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FileText } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleNewProject = () => {
    const newId = `project-${Date.now()}`;
    navigate(`/workspace/${newId}`);
  };

  return (
    <div className="flex h-full w-full flex-col bg-[var(--bg-canvas)] p-8">
      {/* Header / Brand */}
      <header className="mb-12 flex items-center justify-between">
        <div>
          <h1 className="text-[24px] font-semibold text-[var(--text-primary)]">TeachPad</h1>
          <p className="text-[13px] text-[var(--text-secondary)]">
            A professional handwriting whiteboard for educational videos
          </p>
        </div>
      </header>

      {/* Main Launcher Section */}
      <main className="flex-1">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-[15px] font-medium text-[var(--text-primary)]">Recent Projects</h2>
          <button
            onClick={handleNewProject}
            aria-label="Create New Project"
            className="flex items-center gap-2 rounded-[var(--radius-md)] bg-[var(--accent)] px-4 py-2 text-[13px] font-medium text-white transition-opacity hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            New Project
          </button>
        </div>

        {/* Recent Projects Grid Placeholder */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <div
            onClick={handleNewProject}
            className="flex h-48 cursor-pointer flex-col items-center justify-center rounded-[var(--radius-lg)] border border-dashed border-[var(--border-medium)] bg-[var(--bg-surface)] p-6 text-center transition-colors hover:border-[var(--accent)] hover:bg-[var(--bg-surface-translucent)]"
          >
            <Plus className="mb-2 h-8 w-8 text-[var(--text-secondary)]" />
            <span className="text-[13px] font-medium text-[var(--text-primary)]">
              Create New Project
            </span>
          </div>

          <div className="flex h-48 flex-col justify-between rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 shadow-[var(--shadow-float)]">
            <div className="flex items-center gap-3 text-[var(--text-secondary)]">
              <FileText className="h-5 w-5 text-[var(--accent)]" />
              <span className="text-[13px] font-medium text-[var(--text-primary)]">
                Sample Lesson (Demo)
              </span>
            </div>
            <div className="text-[11px] text-[var(--text-secondary)]">Last opened: Just now</div>
          </div>
        </div>
      </main>
    </div>
  );
};
