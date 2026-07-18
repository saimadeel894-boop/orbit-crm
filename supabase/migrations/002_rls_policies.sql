-- Enable RLS on all tables
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE industries ENABLE ROW LEVEL SECURITY;
ALTER TABLE sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cold_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE follow_ups ENABLE ROW LEVEL SECURITY;
ALTER TABLE imports ENABLE ROW LEVEL SECURITY;

-- Policies for businesses
-- SELECT open to authenticated user, no INSERT/UPDATE/DELETE
CREATE POLICY "Businesses are viewable by authenticated users" 
ON businesses FOR SELECT 
TO authenticated 
USING (true);

-- Policies for industries
CREATE POLICY "Users can view their own industries" ON industries FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own industries" ON industries FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own industries" ON industries FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own industries" ON industries FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Policies for sources
CREATE POLICY "Users can view their own sources" ON sources FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own sources" ON sources FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own sources" ON sources FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own sources" ON sources FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Policies for folders
CREATE POLICY "Users can view their own folders" ON folders FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own folders" ON folders FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own folders" ON folders FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own folders" ON folders FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Policies for lead_lists
CREATE POLICY "Users can view their own lead_lists" ON lead_lists FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own lead_lists" ON lead_lists FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own lead_lists" ON lead_lists FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own lead_lists" ON lead_lists FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Policies for contacts
CREATE POLICY "Users can view their own contacts" ON contacts FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own contacts" ON contacts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own contacts" ON contacts FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own contacts" ON contacts FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Policies for cold_contacts
CREATE POLICY "Users can view their own cold_contacts" ON cold_contacts FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own cold_contacts" ON cold_contacts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own cold_contacts" ON cold_contacts FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own cold_contacts" ON cold_contacts FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Policies for activity_log
CREATE POLICY "Users can view their own activity_log" ON activity_log FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own activity_log" ON activity_log FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own activity_log" ON activity_log FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own activity_log" ON activity_log FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Policies for leads
CREATE POLICY "Users can view their own leads" ON leads FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own leads" ON leads FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own leads" ON leads FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own leads" ON leads FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Policies for tasks
CREATE POLICY "Users can view their own tasks" ON tasks FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own tasks" ON tasks FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own tasks" ON tasks FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own tasks" ON tasks FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Policies for follow_ups
CREATE POLICY "Users can view their own follow_ups" ON follow_ups FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own follow_ups" ON follow_ups FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own follow_ups" ON follow_ups FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own follow_ups" ON follow_ups FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Policies for imports
CREATE POLICY "Users can view their own imports" ON imports FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own imports" ON imports FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own imports" ON imports FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own imports" ON imports FOR DELETE TO authenticated USING (auth.uid() = user_id);
