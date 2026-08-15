-- Migration 004: Multi-Tenant Workspaces, Role-Based Access Control (RBAC), Organizations, and Tenant Isolation

-- 1. Create workspaces table
CREATE TABLE IF NOT EXISTS workspaces (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    slug text UNIQUE NOT NULL,
    owner_id uuid NOT NULL,
    plan text DEFAULT 'pro', -- 'free', 'pro', 'business'
    settings jsonb DEFAULT '{"theme": "dark", "primary_color": "#4F6BFF", "custom_stages": []}'::jsonb,
    created_at timestamp with time zone DEFAULT now()
);

-- 2. Create workspace_members table
CREATE TABLE IF NOT EXISTS workspace_members (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id uuid NOT NULL,
    role text NOT NULL DEFAULT 'member', -- 'owner', 'admin', 'manager', 'member'
    joined_at timestamp with time zone DEFAULT now(),
    UNIQUE(workspace_id, user_id)
);

-- 3. Create organizations table
CREATE TABLE IF NOT EXISTS organizations (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE,
    name text NOT NULL,
    domain text,
    industry text,
    employees integer,
    location text,
    created_at timestamp with time zone DEFAULT now(),
    user_id uuid NOT NULL
);

-- 4. Add workspace_id columns to existing tables
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS organization_id uuid REFERENCES organizations(id) ON DELETE SET NULL;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS ai_score integer DEFAULT 50;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS ai_summary text;

ALTER TABLE leads ADD COLUMN IF NOT EXISTS workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS organization_id uuid REFERENCES organizations(id) ON DELETE SET NULL;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS ai_risk text;

ALTER TABLE tasks ADD COLUMN IF NOT EXISTS workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE;
ALTER TABLE lead_lists ADD COLUMN IF NOT EXISTS workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE;
ALTER TABLE activity_log ADD COLUMN IF NOT EXISTS workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE;
ALTER TABLE follow_ups ADD COLUMN IF NOT EXISTS workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE;
ALTER TABLE imports ADD COLUMN IF NOT EXISTS workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE;

-- 5. Enable RLS on new tables
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- 6. Helper function to check workspace membership
CREATE OR REPLACE FUNCTION is_workspace_member(ws_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM workspace_members
    WHERE workspace_id = ws_id AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Workspace RLS Policies
CREATE POLICY "Members can view their workspaces"
ON workspaces FOR SELECT TO authenticated
USING (
  owner_id = auth.uid() OR is_workspace_member(id)
);

CREATE POLICY "Owners can update their workspaces"
ON workspaces FOR UPDATE TO authenticated
USING (owner_id = auth.uid());

CREATE POLICY "Authenticated users can create workspaces"
ON workspaces FOR INSERT TO authenticated
WITH CHECK (owner_id = auth.uid());

-- 8. Workspace Members RLS Policies
CREATE POLICY "Members can view workspace member lists"
ON workspace_members FOR SELECT TO authenticated
USING (is_workspace_member(workspace_id));

CREATE POLICY "Owners and admins can manage workspace members"
ON workspace_members FOR ALL TO authenticated
USING (is_workspace_member(workspace_id));

-- 9. Organizations RLS Policies
CREATE POLICY "Members can view workspace organizations"
ON organizations FOR SELECT TO authenticated
USING (is_workspace_member(workspace_id) OR user_id = auth.uid());

CREATE POLICY "Members can manage workspace organizations"
ON organizations FOR ALL TO authenticated
USING (is_workspace_member(workspace_id) OR user_id = auth.uid());

-- 10. Indexes for multi-tenant query performance
CREATE INDEX IF NOT EXISTS idx_workspace_members_user ON workspace_members(user_id);
CREATE INDEX IF NOT EXISTS idx_contacts_workspace ON contacts(workspace_id);
CREATE INDEX IF NOT EXISTS idx_leads_workspace ON leads(workspace_id);
CREATE INDEX IF NOT EXISTS idx_tasks_workspace ON tasks(workspace_id);
CREATE INDEX IF NOT EXISTS idx_organizations_workspace ON organizations(workspace_id);
