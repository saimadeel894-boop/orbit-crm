-- Create businesses table
CREATE TABLE businesses (
    id text PRIMARY KEY,
    name text NOT NULL,
    color text
);

-- Create industries table
CREATE TABLE industries (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    archived boolean DEFAULT false,
    user_id uuid NOT NULL
);

-- Create sources table
CREATE TABLE sources (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    user_id uuid NOT NULL
);

-- Create folders table
CREATE TABLE folders (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    user_id uuid NOT NULL
);

-- Create lead_lists table
CREATE TABLE lead_lists (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    folder_id uuid REFERENCES folders(id) ON DELETE SET NULL,
    business_id text REFERENCES businesses(id) ON DELETE CASCADE,
    industry text,
    source text,
    location text,
    status text,
    created_at timestamp with time zone DEFAULT now(),
    user_id uuid NOT NULL
);

-- Create contacts table
CREATE TABLE contacts (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    business_id text REFERENCES businesses(id) ON DELETE CASCADE,
    name text NOT NULL,
    email text,
    phone text,
    company text,
    location text,
    industry_id uuid REFERENCES industries(id) ON DELETE SET NULL,
    source_id uuid REFERENCES sources(id) ON DELETE SET NULL,
    priority text,
    authority text,
    call_status text,
    attempts integer DEFAULT 0,
    conversations integer DEFAULT 0,
    last_call_date timestamp with time zone,
    last_outcome text,
    next_call_date timestamp with time zone,
    notes text,
    tags text[],
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    user_id uuid NOT NULL
);

-- Create cold_contacts table
CREATE TABLE cold_contacts (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    business_id text REFERENCES businesses(id) ON DELETE CASCADE,
    name text NOT NULL,
    email text,
    phone text,
    company text,
    location text,
    industry_id uuid REFERENCES industries(id) ON DELETE SET NULL,
    source_id uuid REFERENCES sources(id) ON DELETE SET NULL,
    priority text,
    authority text,
    call_status text,
    attempts integer DEFAULT 0,
    conversations integer DEFAULT 0,
    last_call_date timestamp with time zone,
    last_outcome text,
    next_call_date timestamp with time zone,
    notes text,
    tags text[],
    is_cold boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    user_id uuid NOT NULL
);

-- Create activity_log table
CREATE TABLE activity_log (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    contact_id uuid REFERENCES contacts(id) ON DELETE CASCADE,
    type text NOT NULL,
    date timestamp with time zone DEFAULT now(),
    outcome text,
    notes text,
    person text,
    interest text,
    follow_up_date timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    user_id uuid NOT NULL
);

-- Create leads table
CREATE TABLE leads (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    business_id text REFERENCES businesses(id) ON DELETE CASCADE,
    contact_id uuid REFERENCES contacts(id) ON DELETE SET NULL,
    title text NOT NULL,
    stage text NOT NULL,
    deal_value numeric,
    won_value numeric,
    close_result text,
    loss_reason text,
    won_date timestamp with time zone,
    lost_date timestamp with time zone,
    contract_status text,
    payment_status text,
    status text,
    priority text,
    notes text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    user_id uuid NOT NULL
);

-- Create tasks table
CREATE TABLE tasks (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    title text NOT NULL,
    lead_id uuid REFERENCES leads(id) ON DELETE CASCADE,
    contact_id uuid REFERENCES contacts(id) ON DELETE CASCADE,
    business_id text REFERENCES businesses(id) ON DELETE CASCADE,
    due_date timestamp with time zone,
    done boolean DEFAULT false,
    priority text,
    notes text,
    created_at timestamp with time zone DEFAULT now(),
    user_id uuid NOT NULL
);

-- Create follow_ups table
CREATE TABLE follow_ups (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    contact_id uuid REFERENCES contacts(id) ON DELETE CASCADE,
    lead_id uuid REFERENCES leads(id) ON DELETE CASCADE,
    date timestamp with time zone NOT NULL,
    notes text,
    done boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    user_id uuid NOT NULL
);

-- Create imports table
CREATE TABLE imports (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    file_name text NOT NULL,
    row_count integer DEFAULT 0,
    status text,
    created_at timestamp with time zone DEFAULT now(),
    user_id uuid NOT NULL
);

-- Create Indexes
CREATE INDEX idx_contacts_business_id ON contacts(business_id);
CREATE INDEX idx_contacts_call_status ON contacts(call_status);
CREATE INDEX idx_contacts_next_call_date ON contacts(next_call_date);
CREATE INDEX idx_contacts_user_id ON contacts(user_id);

CREATE INDEX idx_leads_stage ON leads(stage);
CREATE INDEX idx_leads_business_id ON leads(business_id);

CREATE INDEX idx_activity_log_contact_id ON activity_log(contact_id);

CREATE INDEX idx_tasks_due_date ON tasks(due_date);
