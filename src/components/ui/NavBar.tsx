import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Camera, Map, Users, BarChart3, Home, Wallet, Building2, LogIn } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const NavBar = () => {
  const location = useLocation();
  const { user, profile } = useAuth();

  const isStudent = profile?.account_type === "student";
  const isOrg = profile?.account_type === "company" || profile?.account_type === "school";

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/scan", icon: Camera, label: "Scan" },
    { path: "/community", icon: Users, label: "Community" },
    { path: "/facilities", icon: Map, label: "Map" },
    ...(user
      ? [
          { path: "/log", icon: BarChart3, label: "Log" },
          ...(isStudent ? [{ path: "/wallet", icon: Wallet, label: "Wallet" }] : []),
          ...(isOrg ? [{ path: "/org", icon: Building2, label: "Org" }] : []),
        ]
      : [{ path: "/auth", icon: LogIn, label: "Login" }]),
  ];

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
              className={`relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors ${
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
