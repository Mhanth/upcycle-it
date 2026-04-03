
-- Friendships table for Snapchat-style friend connections
CREATE TABLE public.friendships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  requester_id UUID NOT NULL,
  receiver_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'blocked')),
  streak_count INTEGER NOT NULL DEFAULT 0,
  last_interaction_at TIMESTAMP WITH TIME ZONE,
  requester_last_shared TIMESTAMP WITH TIME ZONE,
  receiver_last_shared TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (requester_id, receiver_id)
);

ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own friendships"
ON public.friendships FOR SELECT
USING (auth.uid() = requester_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send friend requests"
ON public.friendships FOR INSERT
WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Users can update own friendships"
ON public.friendships FOR UPDATE
USING (auth.uid() = requester_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can delete own friendships"
ON public.friendships FOR DELETE
USING (auth.uid() = requester_id OR auth.uid() = receiver_id);

-- Scan shares table
CREATE TABLE public.scan_shares (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  from_user_id UUID NOT NULL,
  to_user_id UUID NOT NULL,
  scan_id UUID NOT NULL REFERENCES public.scan_history(id) ON DELETE CASCADE,
  message TEXT,
  seen BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.scan_shares ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view received or sent shares"
ON public.scan_shares FOR SELECT
USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

CREATE POLICY "Users can send scan shares"
ON public.scan_shares FOR INSERT
WITH CHECK (auth.uid() = from_user_id);

CREATE POLICY "Receiver can update share (mark seen)"
ON public.scan_shares FOR UPDATE
USING (auth.uid() = to_user_id);

-- Add friend_code to profiles for easy friend adding
ALTER TABLE public.profiles
ADD COLUMN friend_code TEXT UNIQUE DEFAULT substring(md5(random()::text), 1, 8);

-- Update existing profiles with friend codes
UPDATE public.profiles SET friend_code = substring(md5(random()::text || id::text), 1, 8) WHERE friend_code IS NULL;

-- Trigger for friendships updated_at
CREATE TRIGGER update_friendships_updated_at
BEFORE UPDATE ON public.friendships
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for scan_shares
ALTER PUBLICATION supabase_realtime ADD TABLE public.scan_shares;
ALTER PUBLICATION supabase_realtime ADD TABLE public.friendships;
