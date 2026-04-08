import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Building2, Users, Leaf, Trophy, Copy, BarChart3, TrendingUp, GraduationCap, School } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface MemberStat {
  display_name: string;
  total_scans: number;
  total_credits: number;
  total_co2: number;
}

interface OrgData {
  id: string;
  name: string;
  invite_code: string;
  role: string;
  member_count: number;
  total_scans: number;
  total_co2: number;
  leaderboard: MemberStat[];
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

    if (!orgData) {
      setLoading(false);
      return;
    }

    // Get all members
    const { data: members } = await supabase
      .from("organization_members")
      .select("user_id")
      .eq("organization_id", orgData.id);

    const memberIds = members?.map((m) => m.user_id) || [];

    // Get profiles for all members
    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, display_name")
      .in("user_id", memberIds);

    // Get scan stats per member (from scan_history — both org-tagged and by user_id)
    const { data: scans } = await supabase
      .from("scan_history")
      .select("user_id, credits_earned, carbon_saved")
      .in("user_id", memberIds);

    // Get credits for members
    const { data: credits } = await supabase
      .from("carbon_credits")
      .select("user_id, total_credits")
      .in("user_id", memberIds);

    // Build leaderboard
    const statsMap: Record<string, MemberStat> = {};
    memberIds.forEach((uid) => {
      const p = profiles?.find((pr) => pr.user_id === uid);
      statsMap[uid] = {
        display_name: p?.display_name || "Member",
        total_scans: 0,
        total_credits: 0,
        total_co2: 0,
      };
    });

    scans?.forEach((s) => {
      if (statsMap[s.user_id]) {
        statsMap[s.user_id].total_scans += 1;
        statsMap[s.user_id].total_co2 += Number(s.carbon_saved) || 0;
        statsMap[s.user_id].total_credits += s.credits_earned || 0;
      }
    });

    // Also add credits from carbon_credits table
    credits?.forEach((c) => {
      if (statsMap[c.user_id]) {
        statsMap[c.user_id].total_credits = Math.max(statsMap[c.user_id].total_credits, c.total_credits);
      }
    });

    const leaderboard = Object.values(statsMap).sort((a, b) => b.total_scans - a.total_scans);
    const totalScans = leaderboard.reduce((s, m) => s + m.total_scans, 0);
    const totalCo2 = leaderboard.reduce((s, m) => s + m.total_co2, 0);

    setOrg({
      id: orgData.id,
      name: orgData.name,
      invite_code: orgData.invite_code,
      role: membership.role,
      member_count: memberIds.length,
      total_scans: totalScans,
      total_co2: Math.round(totalCo2 * 100) / 100,
      leaderboard,
    });
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
    try {
      const { error } = await supabase.rpc("join_org_by_code", { _invite_code: joinCode.trim() });
      if (error) throw error;
      toast.success("Joined organization!");
      fetchOrg();
    } catch (err: any) {
      toast.error(err.message || "Invalid invite code");
    }
  };

  const copyCode = () => {
    if (org) {
      navigator.clipboard.writeText(org.invite_code);
      toast.success("Invite code copied! Share with students.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-24 pt-6 lg:pt-24 px-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-36 rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!org) {
    return (
      <div className="min-h-screen bg-background pb-24 pt-6 lg:pt-24 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-display font-bold text-foreground mb-6">Organization</h1>
          <div className="space-y-4">
            {!createMode ? (
              <motion.div className="p-6 rounded-2xl glass-card text-center" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <Building2 size={32} className="text-primary mx-auto mb-3" />
                <h2 className="text-lg font-display font-bold text-foreground mb-1">No Organization Yet</h2>
                <p className="text-xs text-muted-foreground mb-4">Create a school/company or join one with a code</p>
                <div className="flex gap-3 justify-center">
                  <button onClick={() => setCreateMode(true)} className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-display font-bold text-sm">
                    Create Org
                  </button>
                  <button onClick={() => { setCreateMode(true); }} className="px-6 py-2.5 rounded-xl bg-secondary text-secondary-foreground border border-border font-display font-bold text-sm">
                    Join with Code
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div className="p-6 rounded-2xl glass-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h3 className="text-sm font-display font-bold text-foreground mb-4">Create or Join</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-data text-muted-foreground">Organization Name</label>
                    <input value={orgName} onChange={(e) => setOrgName(e.target.value)} placeholder="e.g., Green School Initiative" className="w-full mt-1 px-4 py-3 rounded-xl bg-background border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
                    <button onClick={handleCreate} className="mt-2 w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-display font-bold text-sm">Create</button>
                  </div>
                  <div className="border-t border-border pt-4">
                    <label className="text-xs font-data text-muted-foreground">Or Join with Code</label>
                    <input value={joinCode} onChange={(e) => setJoinCode(e.target.value)} placeholder="Enter invite code" className="w-full mt-1 px-4 py-3 rounded-xl bg-background border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
                    <button onClick={handleJoin} className="mt-2 w-full py-2.5 rounded-xl bg-secondary text-secondary-foreground border border-border font-display font-bold text-sm">Join</button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    );
  }

  const isAdmin = org.role === "admin";

  return (
    <div className="min-h-screen bg-background pb-24 pt-6 lg:pt-24 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
            <School size={20} className="text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">{org.name}</h1>
            <p className="text-xs text-muted-foreground font-data">{isAdmin ? "Admin" : "Member"} • {org.member_count} members</p>
          </div>
        </div>

        {/* Invite code banner — visible to admins */}
        {isAdmin && (
          <motion.div className="p-4 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-between mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div>
              <p className="text-[10px] font-data text-muted-foreground uppercase tracking-wider">Share this code with students</p>
              <p className="text-lg font-display font-bold text-primary tracking-widest">{org.invite_code}</p>
            </div>
            <button onClick={copyCode} className="p-2.5 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors">
              <Copy size={16} />
            </button>
          </motion.div>
        )}

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: "Students", value: org.member_count, icon: Users, color: "text-category-recycle" },
            { label: "Total Scans", value: org.total_scans, icon: BarChart3, color: "text-category-compost" },
            { label: "CO₂ Saved", value: `${org.total_co2}kg`, icon: Leaf, color: "text-primary" },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div key={stat.label} className="p-4 rounded-xl glass-card text-center" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Icon size={18} className={`${stat.color} mx-auto mb-2`} />
                <p className="text-xl font-display font-bold text-foreground">{stat.value}</p>
                <p className="text-[9px] font-data text-muted-foreground">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Student Leaderboard */}
        <motion.div className="p-5 rounded-xl glass-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Trophy size={16} className="text-category-upcycle" />
              <h3 className="text-sm font-display font-bold text-foreground">Student Leaderboard</h3>
            </div>
            <GraduationCap size={16} className="text-muted-foreground" />
          </div>

          {org.leaderboard.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-6">No scans yet. Students need to start scanning!</p>
          ) : (
            <div className="space-y-3">
              {org.leaderboard.map((member, i) => {
                const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : null;
                return (
                  <motion.div
                    key={i}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${i < 3 ? "bg-primary/5 border border-primary/10" : ""}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.05 }}
                  >
                    <span className="w-7 h-7 rounded-full bg-primary/15 text-primary text-xs font-data font-bold flex items-center justify-center shrink-0">
                      {medal || i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-display font-bold text-foreground truncate">{member.display_name}</p>
                      <p className="text-[10px] font-data text-muted-foreground">
                        {member.total_scans} scans • {member.total_credits} CC • {member.total_co2.toFixed(1)}kg CO₂
                      </p>
                    </div>
                    {i < 3 && <TrendingUp size={14} className="text-primary shrink-0" />}
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default OrgDashboard;
