import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Building2, Users, Leaf, Trophy, Copy, BarChart3, TrendingUp } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface OrgData {
  id: string;
  name: string;
  invite_code: string;
  member_count: number;
  total_scans: number;
  total_co2: number;
  topScanners: { name: string; scans: number; credits: number }[];
}

const OrgDashboard = () => {
  const { user, profile } = useAuth();
  const [org, setOrg] = useState<OrgData | null>(null);
  const [loading, setLoading] = useState(true);
  const [createMode, setCreateMode] = useState(false);
  const [orgName, setOrgName] = useState("");
  const [joinCode, setJoinCode] = useState("");

  useEffect(() => {
    if (!user) return;
    fetchOrg();
  }, [user]);

  const fetchOrg = async () => {
    // Check if user is in any org
    const { data: membership } = await supabase
      .from("organization_members")
      .select("organization_id, role")
      .eq("user_id", user!.id)
      .limit(1)
      .maybeSingle();

    if (!membership) {
      setLoading(false);
      return;
    }

    const { data: orgData } = await supabase
      .from("organizations")
      .select("*")
      .eq("id", membership.organization_id)
      .single();

    if (orgData) {
      // Get member count
      const { count } = await supabase
        .from("organization_members")
        .select("*", { count: "exact", head: true })
        .eq("organization_id", orgData.id);

      setOrg({
        id: orgData.id,
        name: orgData.name,
        invite_code: orgData.invite_code,
        member_count: count ?? 1,
        total_scans: 0,
        total_co2: 0,
        topScanners: [
          { name: profile?.display_name || "You", scans: 12, credits: 180 },
          { name: "Team Member", scans: 8, credits: 120 },
        ],
      });
    }
    setLoading(false);
  };

  const handleCreate = async () => {
    if (!orgName.trim() || !user) return;
    const { data, error } = await supabase
      .from("organizations")
      .insert({ name: orgName, created_by: user.id })
      .select()
      .single();

    if (error) {
      toast.error(error.message);
      return;
    }

    // Add creator as admin
    await supabase.from("organization_members").insert({
      organization_id: data.id,
      user_id: user.id,
      role: "admin",
    });

    toast.success("Organization created!");
    setCreateMode(false);
    fetchOrg();
  };

  const handleJoin = async () => {
    if (!joinCode.trim() || !user) return;
    const { data: orgData } = await supabase
      .from("organizations")
      .select("id")
      .eq("invite_code", joinCode.trim())
      .single();

    if (!orgData) {
      toast.error("Invalid invite code");
      return;
    }

    const { error } = await supabase.from("organization_members").insert({
      organization_id: orgData.id,
      user_id: user.id,
      role: "member",
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Joined organization!");
    fetchOrg();
  };

  const copyCode = () => {
    if (org) {
      navigator.clipboard.writeText(org.invite_code);
      toast.success("Invite code copied!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-24 pt-6 px-4">
        <div className="max-w-2xl mx-auto space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-36 rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!org) {
    return (
      <div className="min-h-screen bg-background pb-24 pt-6 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-display font-bold text-foreground mb-6">Organization</h1>

          <div className="space-y-4">
            {!createMode ? (
              <>
                <motion.div
                  className="p-6 rounded-2xl glass-card text-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Building2 size={32} className="text-primary mx-auto mb-3" />
                  <h2 className="text-lg font-display font-bold text-foreground mb-1">No Organization Yet</h2>
                  <p className="text-xs text-muted-foreground mb-4">Create or join a team to track collective impact</p>
                  <div className="flex gap-3 justify-center">
                    <button onClick={() => setCreateMode(true)} className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-display font-bold text-sm">
                      Create Org
                    </button>
                    <button onClick={() => setCreateMode(true)} className="px-6 py-2.5 rounded-xl bg-secondary text-secondary-foreground border border-border font-display font-bold text-sm">
                      Join with Code
                    </button>
                  </div>
                </motion.div>
              </>
            ) : (
              <motion.div className="p-6 rounded-2xl glass-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h3 className="text-sm font-display font-bold text-foreground mb-4">Create or Join</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-data text-muted-foreground">Organization Name</label>
                    <input
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      placeholder="e.g., Green School Initiative"
                      className="w-full mt-1 px-4 py-3 rounded-xl bg-background border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <button onClick={handleCreate} className="mt-2 w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-display font-bold text-sm">
                      Create
                    </button>
                  </div>
                  <div className="border-t border-border pt-4">
                    <label className="text-xs font-data text-muted-foreground">Or Join with Code</label>
                    <input
                      value={joinCode}
                      onChange={(e) => setJoinCode(e.target.value)}
                      placeholder="Enter invite code"
                      className="w-full mt-1 px-4 py-3 rounded-xl bg-background border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <button onClick={handleJoin} className="mt-2 w-full py-2.5 rounded-xl bg-secondary text-secondary-foreground border border-border font-display font-bold text-sm">
                      Join
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24 pt-6 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-display font-bold text-foreground mb-6">{org.name}</h1>

        {/* Invite code banner */}
        <motion.div
          className="p-4 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-between mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div>
            <p className="text-[10px] font-data text-muted-foreground uppercase tracking-wider">Invite Code</p>
            <p className="text-lg font-display font-bold text-primary tracking-widest">{org.invite_code}</p>
          </div>
          <button onClick={copyCode} className="p-2 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors">
            <Copy size={16} />
          </button>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: "Members", value: org.member_count, icon: Users, color: "text-category-recycle" },
            { label: "Total Scans", value: org.total_scans, icon: BarChart3, color: "text-category-compost" },
            { label: "CO₂ Saved", value: `${org.total_co2}kg`, icon: Leaf, color: "text-primary" },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                className="p-4 rounded-xl glass-card text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Icon size={18} className={`${stat.color} mx-auto mb-2`} />
                <p className="text-xl font-display font-bold text-foreground">{stat.value}</p>
                <p className="text-[9px] font-data text-muted-foreground">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Leaderboard */}
        <motion.div
          className="p-4 rounded-xl glass-card"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-display font-bold text-foreground">Top Scanners</h3>
            <Trophy size={14} className="text-category-upcycle" />
          </div>
          <div className="space-y-3">
            {org.topScanners.map((scanner, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-primary/15 text-primary text-xs font-data font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-display font-bold text-foreground">{scanner.name}</p>
                  <p className="text-[10px] font-data text-muted-foreground">{scanner.scans} scans • {scanner.credits} CC</p>
                </div>
                <TrendingUp size={14} className="text-primary" />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrgDashboard;
