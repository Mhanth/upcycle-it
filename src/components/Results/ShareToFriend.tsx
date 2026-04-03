import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Check, Flame, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface Friend {
  id: string;
  friendId: string;
  displayName: string;
  streakCount: number;
}

interface ShareToFriendProps {
  scanId: string | null;
  open: boolean;
  onClose: () => void;
}

const ShareToFriend = ({ scanId, open, onClose }: ShareToFriendProps) => {
  const { user } = useAuth();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [sentTo, setSentTo] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && user) loadFriends();
  }, [open, user]);

  const loadFriends = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("friendships")
      .select("*")
      .eq("status", "accepted")
      .or(`requester_id.eq.${user.id},receiver_id.eq.${user.id}`);

    if (!data) return;

    const list: Friend[] = [];
    for (const f of data) {
      const otherId = f.requester_id === user.id ? f.receiver_id : f.requester_id;
      const { data: prof } = await supabase.from("profiles").select("display_name").eq("user_id", otherId).single();
      list.push({
        id: f.id,
        friendId: otherId,
        displayName: prof?.display_name || "User",
        streakCount: f.streak_count,
      });
    }
    setFriends(list);
  };

  const shareTo = async (friend: Friend) => {
    if (!user || !scanId || sentTo.has(friend.friendId)) return;
    setLoading(true);

    const { error } = await supabase.from("scan_shares").insert({
      from_user_id: user.id,
      to_user_id: friend.friendId,
      scan_id: scanId,
    });

    if (!error) {
      // Update streak — check if both sides shared today
      const today = new Date().toISOString().split("T")[0];
      const isRequester = friend.id === friend.friendId; // need to check friendship direction
      
      // Update last interaction
      const updateFields: Record<string, any> = { last_interaction_at: new Date().toISOString() };
      
      // Increment streak
      const { data: friendship } = await supabase.from("friendships").select("*").eq("id", friend.id).single();
      if (friendship) {
        const lastDate = friendship.last_interaction_at?.split("T")[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
        
        if (lastDate === yesterday || lastDate === today) {
          updateFields.streak_count = friendship.streak_count + (lastDate === yesterday ? 1 : 0);
        } else if (lastDate !== today) {
          updateFields.streak_count = 1;
        }

        await supabase.from("friendships").update(updateFields).eq("id", friend.id);
      }

      setSentTo((prev) => new Set(prev).add(friend.friendId));
      toast.success(`Shared with ${friend.displayName}! 🔥`);
    } else {
      toast.error("Failed to share");
    }
    setLoading(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            className="relative w-full max-w-lg rounded-t-2xl bg-card border-t border-border p-6 pb-10"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="w-10 h-1 rounded-full bg-border mx-auto mb-4" />
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-display font-bold text-foreground flex items-center gap-2">
                <Send size={16} className="text-primary" />
                Share to Friend
              </h3>
              <button onClick={onClose} className="p-1.5 rounded-lg bg-muted text-muted-foreground">
                <X size={14} />
              </button>
            </div>

            {friends.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Add friends first to share scans!
              </p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {friends.map((friend) => {
                  const sent = sentTo.has(friend.friendId);
                  return (
                    <button
                      key={friend.friendId}
                      onClick={() => shareTo(friend)}
                      disabled={sent || loading}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
                        sent ? "bg-primary/5 border-primary/20" : "bg-card border-border hover:border-primary/30"
                      }`}
                    >
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-display font-bold text-primary">
                        {friend.displayName.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-sm font-display font-bold text-foreground">{friend.displayName}</p>
                        <div className="flex items-center gap-1 text-[10px] font-data text-muted-foreground">
                          <Flame size={10} className="text-orange-500" />
                          {friend.streakCount} streak
                        </div>
                      </div>
                      {sent ? (
                        <Check size={16} className="text-primary" />
                      ) : (
                        <Send size={14} className="text-muted-foreground" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ShareToFriend;
