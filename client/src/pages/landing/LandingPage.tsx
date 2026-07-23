import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Dashboard');
  const tabs = ['Dashboard', 'Templates', 'Shared', 'Archive'];

  const handleNewProject = () => {
    const newId = `project-${Date.now()}`;
    navigate(`/workspace/${newId}`);
  };

  const handleOpenProject = (id: string) => {
    navigate(`/workspace/${id}`);
  };

  return (
    <div className="min-h-screen w-full bg-[#fcf8fb] text-[#1b1b1d] flex antialiased">
      {/* ─── Sidebar Navigation Shell ─── */}
      <nav className="h-screen w-64 fixed left-0 top-0 bg-[#fcf8fb] border-r border-[#e4e2e4] p-6 flex flex-col justify-between z-50">
        <div>
          {/* Top Brand Logo & Title */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-9 h-9 rounded-lg bg-white border border-[#c1c6d7]/30 shadow-sm flex items-center justify-center p-1">
              <img
                alt="TeachPad Logo"
                className="w-full h-full object-contain rounded"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB7tvxQByLUpJMLE9jpphuPE5QGoGLB1KRPoL6lDFNy2Xnr1Dfi7AfHuyJWcVzWjOkNCuH-uKVKPOS2rPDbONK9XFlh7Jw0BESe7TGzXQaMkQwYdvwlICGbfmbvT0AB-3aUrdpllFmimgFAEpgxvw-l7iru9uwL2VblRLtb4XLI9_Xqf3pcPT1U0bl2Hjx8CSeK5ZDPbi9Z1mQAkVXyQgKwwqiCc8EJVdBsyTBVVjXmUQnctyzdkci7DVO7tN0gNTPqAxuwtSPBGis"
              />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-[#1b1b1d] tracking-tight leading-tight">TeachPad</h3>
              <p className="text-[11px] font-medium text-[#717786]">Creative Workspace</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-1.5">
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="flex items-center gap-3 bg-[#6664e4] text-white font-bold rounded-2xl px-4 py-3 shadow-sm transition-transform hover:translate-x-1"
            >
              <span className="material-symbols-outlined text-[20px]">home</span>
              <span className="text-[13px]">Home</span>
            </a>

            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="flex items-center gap-3 text-[#414755] hover:bg-[#e4e2e4]/40 rounded-2xl px-4 py-3 font-medium transition-transform hover:translate-x-1"
            >
              <span className="material-symbols-outlined text-[20px]">grid_view</span>
              <span className="text-[13px]">My Projects</span>
            </a>

            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="flex items-center gap-3 text-[#414755] hover:bg-[#e4e2e4]/40 rounded-2xl px-4 py-3 font-medium transition-transform hover:translate-x-1"
            >
              <span className="material-symbols-outlined text-[20px]">library_books</span>
              <span className="text-[13px]">Resource Library</span>
            </a>

            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="flex items-center gap-3 text-[#414755] hover:bg-[#e4e2e4]/40 rounded-2xl px-4 py-3 font-medium transition-transform hover:translate-x-1"
            >
              <span className="material-symbols-outlined text-[20px]">delete</span>
              <span className="text-[13px]">Trash</span>
            </a>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="space-y-1">
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="flex items-center gap-3 text-[#414755] hover:bg-[#e4e2e4]/40 rounded-2xl px-4 py-2.5 font-medium transition-transform hover:translate-x-1"
          >
            <span className="material-symbols-outlined text-[20px]">settings</span>
            <span className="text-[13px]">Settings</span>
          </a>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="flex items-center gap-3 text-[#414755] hover:bg-[#e4e2e4]/40 rounded-2xl px-4 py-2.5 font-medium transition-transform hover:translate-x-1"
          >
            <span className="material-symbols-outlined text-[20px]">contact_support</span>
            <span className="text-[13px]">Support</span>
          </a>
        </div>
      </nav>

      {/* ─── Main Area ─── */}
      <div className="ml-64 flex-1 flex flex-col justify-between min-h-screen bg-[#fcf8fb]">
        <div>
          {/* Top Header Bar */}
          <header className="px-10 py-5 flex items-center justify-between">
            {/* Left Nav Tabs */}
            <nav className="flex items-center gap-6">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-[14px] font-semibold transition-colors relative ${activeTab === tab
                      ? 'text-[#0058bc]'
                      : 'text-[#717786] hover:text-[#1b1b1d]'
                    }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <div className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-[#0058bc] rounded-full" />
                  )}
                </button>
              ))}
            </nav>

            {/* Right Controls */}
            <div className="flex items-center gap-4">
              {/* Search Bar */}
              <div className="relative flex items-center">
                <span className="absolute left-3 text-[#717786]">
                  <span className="material-symbols-outlined text-[18px]">search</span>
                </span>
                <input
                  type="text"
                  placeholder="Search projects..."
                  className="pl-9 pr-10 py-2 w-64 rounded-xl bg-[#f0edef] border border-[#c1c6d7]/30 text-[13px] text-[#1b1b1d] placeholder:text-[#717786] outline-none focus:border-[#0058bc] transition-all"
                />
                <span className="absolute right-2.5 text-[10px] font-mono text-[#717786] border border-[#c1c6d7]/40 px-1.5 py-0.5 rounded bg-[#e4e2e4]">
                  ⌘K
                </span>
              </div>

              {/* Action Icons */}
              <button className="p-2 rounded-xl text-[#414755] hover:bg-[#e4e2e4]/50 transition-colors">
                <span className="material-symbols-outlined text-[20px]">settings</span>
              </button>
              <button className="p-2 rounded-xl text-[#414755] hover:bg-[#e4e2e4]/50 transition-colors">
                <span className="material-symbols-outlined text-[20px]">help</span>
              </button>

              {/* User Avatar */}
              <div className="w-8 h-8 rounded-full overflow-hidden border border-[#c1c6d7]/40 cursor-pointer shadow-sm">
                <img
                  alt="User Avatar"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA9ivIwm5hsisZLAxrrHhhdU3HIaB8Ad6nGOtgNbMr4of_A_kRBTTLBawE2LIby-lGzNXrmBxXnIESdJa2nWWBNAr_fAP1CFgcbUuvt5iiIG24_9EwwagD39JxgCXijxd6IeItCrI4CNdKPhrKf7h7eBdxJpyRrnRQ1BChVG4zeLzA-m5Q_g4R2yLOKT5nJ9e6EEWWgEXhHjJRga52gLwBxYzadgPTXWGmFizsCj8Gc8478QLVGBZRDnGmkCACnzDeNsK_Q7QNwfaA"
                />
              </div>
            </div>
          </header>

          {/* Hero Section */}
          <section className="px-10 mt-6 flex items-end justify-between">
            <div>
              <h1 className="text-[40px] font-extrabold text-[#1b1b1d] tracking-tight leading-tight">
                Good morning, Nishant.
              </h1>
              <p className="text-[16px] text-[#414755] mt-1 font-normal">
                What are we designing for your students today?
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleNewProject}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#f6f3f5] border border-[#c1c6d7]/40 text-[#1b1b1d] font-semibold text-[13px] rounded-xl hover:bg-[#eae7ea] transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">file_open</span>
                Open Project
              </button>
              <button
                onClick={handleNewProject}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#0058bc] text-white font-semibold text-[13px] rounded-xl hover:shadow-lg hover:shadow-[#0058bc]/30 transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                New Project
              </button>
            </div>
          </section>

          {/* Recent Projects Section */}
          <section className="px-10 mt-10 mb-8">
            <div className="flex items-center justify-between">
              <h2 className="text-[20px] font-bold text-[#1b1b1d]">Recent Projects</h2>
              <button className="text-[13px] font-semibold text-[#0058bc] hover:underline cursor-pointer">
                View All
              </button>
            </div>

            {/* Cards Grid (3 cards in 1 row) */}
            <div className="grid grid-cols-3 gap-6 mt-6">
              {/* Card 1 */}
              <div
                onClick={() => handleOpenProject('q4-strategy')}
                className="group card-hover flex flex-col bg-white border border-[#c1c6d7]/30 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <div className="aspect-video w-full relative bg-[#f6f3f5] overflow-hidden">
                  <img
                    alt="Q4 Strategy Whiteboard"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBAuUn07xEOFUyisQPz4QAhLZezZD8WZVLvAXLlzO4VtpxIHTZNVmg4Y1QSAJiDxv-0oM4cdLyFMEWtBJDuwAdvfqu2XVrE2GbhiJ-Wo2OpWarIwv2-1DFrxpexsvXYGYLC8KKacYuzhOoddc92qPESGJPBx3b8N6Rg-IKJ2YWVJ5fWvgqyg8cRSxr37kKy5MnhiDgxFIOFtXiLaEXHsRFkeJKR9KjLTLtgRpQajIbH2j6ML2WAuJ5VWvSBnELs7vGSXkQWf_KMR4I"
                  />
                  {/* Hover Quick Actions */}
                  <div className="quick-actions absolute inset-0 bg-[#1b1b1d]/10 opacity-0 flex items-center justify-center gap-3 transition-all duration-300">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleOpenProject('q4-strategy'); }}
                      className="w-10 h-10 rounded-full bg-white shadow-xl flex items-center justify-center text-[#1b1b1d] hover:text-[#0058bc] transition-colors"
                    >
                      <span className="material-symbols-outlined">edit</span>
                    </button>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="w-10 h-10 rounded-full bg-white shadow-xl flex items-center justify-center text-[#1b1b1d] hover:text-[#0058bc] transition-colors"
                    >
                      <span className="material-symbols-outlined">share</span>
                    </button>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="w-10 h-10 rounded-full bg-white shadow-xl flex items-center justify-center text-[#ba1a1a] hover:bg-[#ffdad6] transition-colors"
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                </div>
                <div className="p-4 flex flex-col justify-between flex-1 bg-white">
                  <h3 className="text-[15px] font-bold text-[#1b1b1d] truncate">Q4 Strategy Whiteboard</h3>
                  <div className="mt-3 flex items-center justify-between text-[12px] text-[#717786]">
                    <span>2 hours ago</span>
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-[#f0edef] rounded-lg">
                      <span className="material-symbols-outlined text-[14px]">auto_stories</span>
                      <span className="font-mono text-[11px]">4</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div
                onClick={() => handleOpenProject('episode-012')}
                className="group card-hover flex flex-col bg-white border border-[#c1c6d7]/30 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <div className="aspect-video w-full relative bg-[#f6f3f5] overflow-hidden">
                  <img
                    alt="Episode 012: Growth Tactics"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuB0idybJTwRZMeUrA1lluaUu4PLVv7LTo239UE0aG7FA1XglGqP-pFkU8QWE6LtHsywRtdQq_5HYDqCchw78nzTBxKxN3eoQ0klObKLw-arjzm_6rFYxRZcRMEIk_wsgHej1xHdbvsqomnCb1uwd4dFZp--Sk1b8myBrZcbh8_S0wGRYVCgyfMHtftomsLGX0cmLsGF720ejL8_ZNvHFWVuWUlVJJTHQE_brL6kHw6wxWqx1IMTg60YZEzRCc2fyMIMJRuzFQhzCZY"
                  />
                  <div className="quick-actions absolute inset-0 bg-[#1b1b1d]/10 opacity-0 flex items-center justify-center gap-3 transition-all duration-300">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleOpenProject('episode-012'); }}
                      className="w-10 h-10 rounded-full bg-white shadow-xl flex items-center justify-center text-[#1b1b1d] hover:text-[#0058bc] transition-colors"
                    >
                      <span className="material-symbols-outlined">edit</span>
                    </button>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="w-10 h-10 rounded-full bg-white shadow-xl flex items-center justify-center text-[#1b1b1d] hover:text-[#0058bc] transition-colors"
                    >
                      <span className="material-symbols-outlined">share</span>
                    </button>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="w-10 h-10 rounded-full bg-white shadow-xl flex items-center justify-center text-[#ba1a1a] hover:bg-[#ffdad6] transition-colors"
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                </div>
                <div className="p-4 flex flex-col justify-between flex-1 bg-white">
                  <h3 className="text-[15px] font-bold text-[#1b1b1d] truncate">Episode 012: Growth Tactics</h3>
                  <div className="mt-3 flex items-center justify-between text-[12px] text-[#717786]">
                    <span>Yesterday</span>
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-[#f0edef] rounded-lg">
                      <span className="material-symbols-outlined text-[14px]">auto_stories</span>
                      <span className="font-mono text-[11px]">12</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3 */}
              <div
                onClick={() => handleOpenProject('lesson-template')}
                className="group card-hover flex flex-col bg-white border border-[#c1c6d7]/30 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <div className="aspect-video w-full relative bg-[#f0edef] flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-[#0058bc]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-[#0058bc]/40 text-4xl">edit_note</span>
                  </div>
                  <div className="quick-actions absolute inset-0 bg-[#1b1b1d]/10 opacity-0 flex items-center justify-center gap-3 transition-all duration-300">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleOpenProject('lesson-template'); }}
                      className="w-10 h-10 rounded-full bg-white shadow-xl flex items-center justify-center text-[#1b1b1d] hover:text-[#0058bc] transition-colors"
                    >
                      <span className="material-symbols-outlined">edit</span>
                    </button>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="w-10 h-10 rounded-full bg-white shadow-xl flex items-center justify-center text-[#1b1b1d] hover:text-[#0058bc] transition-colors"
                    >
                      <span className="material-symbols-outlined">share</span>
                    </button>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="w-10 h-10 rounded-full bg-white shadow-xl flex items-center justify-center text-[#ba1a1a] hover:bg-[#ffdad6] transition-colors"
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                </div>
                <div className="p-4 flex flex-col justify-between flex-1 bg-white">
                  <h3 className="text-[15px] font-bold text-[#1b1b1d] truncate">Interactive Lesson Template</h3>
                  <div className="mt-3 flex items-center justify-between text-[12px] text-[#717786]">
                    <span>3 days ago</span>
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-[#f0edef] rounded-lg">
                      <span className="material-symbols-outlined text-[14px]">auto_stories</span>
                      <span className="font-mono text-[11px]">1</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="px-10 py-6 border-t border-[#c1c6d7]/20 flex items-center justify-between text-[12px] text-[#717786] bg-[#fcf8fb]">
          <p>© 2024 TeachPad Systems. Built for educators.</p>
          <div className="flex items-center gap-6">
            <a className="hover:text-[#0058bc] transition-colors" href="#">Privacy</a>
            <a className="hover:text-[#0058bc] transition-colors" href="#">Terms</a>
            <a className="hover:text-[#0058bc] transition-colors" href="#">Changelog</a>
            <a className="hover:text-[#0058bc] transition-colors" href="#">Status</a>
          </div>
        </footer>
      </div>
    </div>
  );
};
