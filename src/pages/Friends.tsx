import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, UserPlus, Copy, Check, Search, Trophy, Send, Clock, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface Friend {
  id: string;
  friendId: string;
  displayName: string;
  avatarUrl: string | null;
  streakCount: number;
  lastInteraction: string | null;
  status: string;
}

interface ScanShare {
  id: string;
  fromName: string;
  itemName: string;
  category: string;
  message: string | null;
  seen: boolean;
  createdAt: string;
}

const Friends = () => {
  const { user, profile } = useAuth();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Friend[]>([]);
  const [recentShares, setRecentShares] = useState<ScanShare[]>([]);
  const [friendCode, setFriendCode] = useState("");
  const [myCode, setMyCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState<"friends" | "requests" | "leaderboard">("friends");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    loadData();
    
    // Realtime for new shares
    const channel = supabase
      .channel("scan-shares")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "scan_shares" }, () => {
        loadShares();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    await Promise.all([loadFriends(), loadShares(), loadMyCode()]);
    setLoading(false);
  };

  const loadMyCode = async () => {
    if (!user) return;
    const { data } = await supabase.from("profiles").select("friend_code").eq("user_id", user.id).single();
    if (data?.friend_code) setMyCode(data.friend_code);
  };

  const loadFriends = async () => {
    if (!user) return;
    // Get all friendships where I'm involved
    const { data: friendships } = await supabase
      .from("friendships")
      .select("*")
      .or(`requester_id.eq.${user.id},receiver_id.eq.${user.id}`);

    if (!friendships) return;

    const accepted: Friend[] = [];
    const pending: Friend[] = [];

    for (const f of friendships) {
      const otherId = f.requester_id === user.id ? f.receiver_id : f.requester_id;
      const { data: prof } = await supabase.from("profiles").select("display_name, avatar_url").eq("user_id", otherId).single();

      const friend: Friend = {
        id: f.id,
        friendId: otherId,
        displayName: prof?.display_name || "User",
        avatarUrl: prof?.avatar_url,
        streakCount: f.streak_count,
        lastInteraction: f.last_interaction_at,
        status: f.status,
      };

      if (f.status === "accepted") accepted.push(friend);
      else if (f.status === "pending" && f.receiver_id === user.id) pending.push(friend);
    }

    setFriends(accepted.sort((a, b) => b.streakCount - a.streakCount));
    setPendingRequests(pending);
  };

  const loadShares = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("scan_shares")
      .select("*, scan_history!inner(item_name, category)")
      .eq("to_user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10);

    if (data) {
      const shares: ScanShare[] = [];
      for (const s of data) {
        const { data: prof } = await supabase.from("profiles").select("display_name").eq("user_id", s.from_user_id).single();
        const scan = s.scan_history as any;
        shares.push({
          id: s.id,
          fromName: prof?.display_name || "Someone",
          itemName: scan?.item_name || "Unknown",
          category: scan?.category || "recyclable",
          message: s.message,
          seen: s.seen,
          createdAt: s.created_at,
        });
      }
      setRecentShares(shares);
    }
  };

  const addFriend = async () => {
    if (!user || !friendCode.trim()) return;
    // Look up profile by friend code
    const { data: target } = await supabase
      .from("profiles")
      .select("user_id")
      .eq("friend_code", friendCode.trim().toLowerCase())
      .single();

    if (!target) {
      toast.error("No user found with that code");
      return;
    }
    if (target.user_id === user.id) {
      toast.error("That's your own code!");
      return;
    }

    const { error } = await supabase.from("friendships").insert({
      requester_id: user.id,
      receiver_id: target.user_id,
    });

    if (error) {
      if (error.code === "23505") toast.error("Friend request already sent");
      else toast.error("Failed to send request");
      return;
    }

    toast.success("Friend request sent! 🤝");
    setFriendCode("");
    loadFriends();
  };

  const acceptRequest = async (friendshipId: string) => {
    await supabase.from("friendships").update({ status: "accepted" }).eq("id", friendshipId);
    toast.success("Friend added! Start sharing scans to build your streak 🔥");
    loadFriends();
  };

  const copyCode = () => {
    navigator.clipboard.writeText(myCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStreakEmoji = (count: number) => {
    if (count >= 30) return "🌟";
    if (count >= 14) return "💎";
    if (count >= 7) return "🔥";
    if (count >= 3) return "⚡";
    return "✨";
  };

  const getStreakColor = (count: number) => {
    if (count >= 14) return "text-amber-500";
    if (count >= 7) return "text-orange-500";
    if (count >= 3) return "text-primary";
    return "text-muted-foreground";
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="text-center">
          <Flame size={48} className="mx-auto text-muted-foreground/30 mb-4" />
          <h2 className="text-xl font-display font-bold text-foreground mb-2">Login to see your streaks</h2>
          <p className="text-sm text-muted-foreground">Add friends, share scans, and compete!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-28 pt-6 px-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Streaks</h1>
            <p className="text-xs text-muted-foreground font-data">Share scans. Keep the fire alive.</p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/20">
            <Flame size={16} className="text-orange-500" />
            <span className="text-sm font-display font-bold text-orange-500">
              {friends.reduce((max, f) => Math.max(max, f.streakCount), 0)}
            </span>
          </div>
        </div>

        {/* My Code Card */}
        <motion.div
          className="p-4 rounded-2xl bg-gradient-to-br from-primary/8 to-card border border-primary/15 mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-[10px] font-data text-muted-foreground uppercase tracking-widest mb-2">Your Friend Code</p>
          <div className="flex items-center gap-3">
            <span className="text-xl font-data font-bold text-foreground tracking-[0.2em] uppercase">{myCode}</span>
            <button onClick={copyCode} className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
        </motion.div>

        {/* Add Friend */}
        <div className="flex gap-2 mb-6">
          <div className="flex-1 relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Enter friend code..."
              value={friendCode}
              onChange={(e) => setFriendCode(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-card border border-border text-sm font-data text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <button
            onClick={addFriend}
            disabled={!friendCode.trim()}
            className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-display font-bold text-sm disabled:opacity-40 transition-opacity"
          >
            <UserPlus size={16} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl bg-card border border-border mb-4">
          {(["friends", "requests", "leaderboard"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-lg text-xs font-display font-bold transition-all ${
                tab === t ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t === "friends" ? `Friends (${friends.length})` : t === "requests" ? `Requests (${pendingRequests.length})` : "Leaderboard"}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {tab === "friends" && (
            <motion.div key="friends" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
              {friends.length === 0 ? (
                <div className="text-center py-12">
                  <UserPlus size={32} className="mx-auto text-muted-foreground/30 mb-3" />
                  <p className="text-sm text-muted-foreground">Add friends to start streaking!</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">Share your code or enter theirs above</p>
                </div>
              ) : (
                friends.map((friend, i) => (
                  <motion.div
                    key={friend.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border hover:border-primary/20 transition-colors cursor-pointer"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-display font-bold text-primary">
                      {friend.displayName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-display font-bold text-foreground truncate">{friend.displayName}</p>
                      <p className="text-[10px] font-data text-muted-foreground">
                        {friend.lastInteraction
                          ? `Last shared ${new Date(friend.lastInteraction).toLocaleDateString()}`
                          : "No shares yet"}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-lg font-display font-bold ${getStreakColor(friend.streakCount)}`}>
                        {friend.streakCount}
                      </span>
                      <span className="text-lg">{getStreakEmoji(friend.streakCount)}</span>
                    </div>
                    <ChevronRight size={14} className="text-muted-foreground" />
                  </motion.div>
                ))
              )}
            </motion.div>
          )}

          {tab === "requests" && (
            <motion.div key="requests" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
              {pendingRequests.length === 0 ? (
                <div className="text-center py-12">
                  <Clock size={32} className="mx-auto text-muted-foreground/30 mb-3" />
                  <p className="text-sm text-muted-foreground">No pending requests</p>
                </div>
              ) : (
                pendingRequests.map((req) => (
                  <div key={req.id} className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-sm font-display font-bold text-accent">
                      {req.displayName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-display font-bold text-foreground">{req.displayName}</p>
                      <p className="text-[10px] font-data text-muted-foreground">wants to be your friend</p>
                    </div>
                    <button
                      onClick={() => acceptRequest(req.id)}
                      className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-display font-bold"
                    >
                      Accept
                    </button>
                  </div>
                ))
              )}
            </motion.div>
          )}

          {tab === "leaderboard" && (
            <motion.div key="leaderboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
              {friends.length === 0 ? (
                <div className="text-center py-12">
                  <Trophy size={32} className="mx-auto text-muted-foreground/30 mb-3" />
                  <p className="text-sm text-muted-foreground">Add friends to see rankings</p>
                </div>
              ) : (
                [...friends]
                  .sort((a, b) => b.streakCount - a.streakCount)
                  .map((friend, i) => (
                    <div key={friend.id} className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border">
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-display font-bold ${
                        i === 0 ? "bg-amber-500/15 text-amber-600" : i === 1 ? "bg-slate-300/20 text-slate-500" : i === 2 ? "bg-orange-400/15 text-orange-500" : "bg-muted text-muted-foreground"
                      }`}>
                        {i + 1}
                      </span>
                      <div className="flex-1">
                        <p className="text-sm font-display font-bold text-foreground">{friend.displayName}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Flame size={14} className={getStreakColor(friend.streakCount)} />
                        <span className="text-sm font-data font-bold text-foreground">{friend.streakCount}</span>
                      </div>
                    </div>
                  ))
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recent Shares Inbox */}
        {recentShares.length > 0 && (
          <div className="mt-8">
            <h3 className="text-sm font-display font-bold text-foreground mb-3 flex items-center gap-2">
              <Send size={14} className="text-primary" />
              Recent Shares
            </h3>
            <div className="space-y-2">
              {recentShares.slice(0, 5).map((share) => (
                <div
                  key={share.id}
                  className={`p-3 rounded-xl border transition-colors ${
                    share.seen ? "bg-card border-border" : "bg-primary/5 border-primary/20"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-display font-bold text-foreground">
                        {share.fromName} scanned <span className="text-primary">{share.itemName}</span>
                      </p>
                      <p className="text-[10px] font-data text-muted-foreground mt-0.5">
                        {share.category} • {new Date(share.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                    {!share.seen && <span className="w-2 h-2 rounded-full bg-primary" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Friends;
