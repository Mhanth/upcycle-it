
## Phase 1: Authentication + Database Foundation
1. Create database tables: profiles (with account_type: student/individual/company/school), organizations, org_members, scan_history, carbon_credits
2. Build Auth pages (Login/Signup) with account type selection
3. Auth context provider + protected routes

## Phase 2: YouTube Video Suggestions (Mock)
1. Create a `VideoSuggestions` component showing 2-3 contextual videos after scan
2. Use mock data mapped to waste categories (real YouTube video IDs for recycling/upcycling)
3. Horizontal card strip with thumbnail, title, channel — opens in new tab
4. Integrate into ResultSheet below scan results

## Phase 3: Student Carbon Credit System
1. CC Wallet page with total credits, streak history, weekly graph
2. Award CC per scan based on category (10/8/12/15/2)
3. Daily streak multiplier (1x→1.5x→2x→3x at 7 days)
4. Milestone badges + leaderboard tab
5. Toast notification on CC earned after scan

## Phase 4: Organization Mode
1. Org admin dashboard: aggregate stats, member leaderboard, CO₂ saved
2. Invite system (email + join code)
3. Department/class breakdown
4. Real-time updates via Supabase subscriptions

## Phase 5: Enhanced Facilities (Keep OpenStreetMap)
1. Make search bar functional with filtering
2. Auto-detect user location with browser Geolocation API
3. Color-coded category pins on the map
4. Note: Google Maps integration can be added later when API key is available

Each phase builds on the previous. We start with Phase 1 (auth + DB) since everything depends on it.
