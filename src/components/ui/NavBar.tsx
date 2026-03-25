import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Camera, Map, Users, BarChart3, Home } from "lucide-react";

const navItems = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/scan", icon: Camera, label: "Scan" },
  { path: "/community", icon: Users, label: "Community" },
  { path: "/facilities", icon: Map, label: "Map" },
  { path: "/log", icon: BarChart3, label: "Log" },
];

const NavBar = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-1 px-3 py-2.5 rounded-2xl glass-card">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`relative flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition-colors ${
                isActive ? "bg-primary/15" : "hover:bg-primary/5"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-glow"
                  className="absolute inset-0 rounded-xl bg-primary/10"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <Icon
                size={18}
                className={`relative z-10 ${isActive ? "text-primary" : "text-muted-foreground"}`}
              />
              <span
                className={`relative z-10 text-[9px] font-data ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default NavBar;
