#  Challenges Faced & Solutions

## 1️⃣ Realtime Not Syncing Across Tabs  
Initially, adding a bookmark in one tab did not update the second tab.  
**Solution:** Added `bookmarks` table to `supabase_realtime` publication and implemented `postgres_changes` subscription to sync state using realtime payload updates.

## 2️⃣ Duplicate Realtime Events  
Bookmarks were updating twice due to multiple subscriptions.  
**Solution:** Removed duplicate `useEffect` and ensured only one realtime channel with proper cleanup using `removeChannel()`.

## 3️⃣ RLS Blocking Inserts  
Encountered `new row violates row-level security policy` error.  
**Solution:** Added proper RLS policies using `auth.uid()` with correct `USING` and `WITH CHECK` clauses for SELECT, INSERT, UPDATE, and DELETE.


Google login setup was smooth due to prior experience with OAuth integration.
