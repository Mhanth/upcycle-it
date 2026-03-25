import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Camera, Map, Users, BarChart3, Home } from "lucide-react";

const navItems = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/scan", icon: Camera, label: "Scan" },
  { path: "/community", icon: Users, label: "Community" },
  { path: "/facilities", icon: Map, label: "Map" },
  { path: "/log", icon: BarChart3, label: "My Log" },
];

const NavBar = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-xl border-t border-border">
      <div className="flex items-center justify-around px-2 py-2 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className="relative flex flex-col items-center gap-0.5 px-3 py-1.5"
            >
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <Icon
                size={20}
                className={isActive ? "text-primary" : "text-muted-foreground"}
              />
              <span
                className={`text-[10px] font-data ${
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
