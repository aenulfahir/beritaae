-- Migration: Initial Setup
-- Description: Enable extensions and create custom types

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom enum types
CREATE TYPE user_role AS ENUM ('member', 'author', 'editor', 'admin');
CREATE TYPE article_status AS ENUM ('draft', 'published', 'archived');
