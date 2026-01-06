-- Remove sidebar_sticky slot type
-- Update existing sidebar_sticky ads to in_article

UPDATE ads 
SET slot_type = 'in_article' 
WHERE slot_type = 'sidebar_sticky';
