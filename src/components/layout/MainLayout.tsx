import React from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { Calendar, BarChart2, Settings } from "lucide-react";

const MainLayout: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Days", icon: <Calendar className="w-5 h-5" /> },
    { path: "/stats", label: "Stats", icon: <BarChart2 className="w-5 h-5" /> },
    { path: "/setup", label: "Setup", icon: <Settings className="w-5 h-5" /> },
  ];

  const isLinkActive = (path: string) => {
    if (path === "/" && location.pathname.startsWith("/day")) return true;
    return location.pathname === path;
  };

  return (
    <div className="App min-h-screen bg-slate-950 flex flex-col font-sans text-slate-200 selection:bg-indigo-500/30">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 w-full border-b border-white/5 bg-slate-950/70 backdrop-blur-xl supports-[backdrop-filter]:bg-slate-950/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Navigation Links */}
            <div className="flex items-center justify-center gap-1 sm:gap-2">
              {navItems.map((item) => {
                const active = isLinkActive(item.path);
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={`
                      relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out
                      flex items-center gap-2 group
                      ${
                        active
                          ? "text-white bg-white/10 shadow-sm ring-1 ring-white/10"
                          : "text-slate-400 hover:text-white hover:bg-white/5"
                      }
                    `}
                  >
                    <span>{item.icon}</span>
                    <span className={`${active ? "block" : "hidden sm:block"}`}>
                      {item.label}
                    </span>
                    {active && (
                      <span className="absolute inset-x-0 -bottom-[17px] h-0.5 bg-indigo-500 rounded-t-full shadow-[0_0_10px_rgba(99,102,241,0.7)]" />
                    )}
                  </NavLink>
                );
              })}
            </div>

            {/* Right Side */}
            <div className="flex-shrink-0 w-8" />
          </div>
        </div>
      </nav>

      <main className="flex-1 w-full bg-slate-950 relative">
        {/* Background gradient blob for ambiance */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-indigo-900/10 blur-[100px] pointer-events-none rounded-full mix-blend-screen opacity-40" />

        <div className="w-full h-full relative z-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
