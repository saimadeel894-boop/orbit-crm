-- Add lead_list_id to contacts table
ALTER TABLE contacts
ADD COLUMN lead_list_id uuid REFERENCES lead_lists(id) ON DELETE SET NULL;

-- Create an index for performance when filtering
CREATE INDEX idx_contacts_lead_list_id ON contacts(lead_list_id);
