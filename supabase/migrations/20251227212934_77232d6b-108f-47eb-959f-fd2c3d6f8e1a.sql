-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('student', 'staff', 'admin');

-- Create enum for ticket status
CREATE TYPE public.ticket_status AS ENUM ('open', 'in_progress', 'resolved', 'closed');

-- Create enum for ticket priority
CREATE TYPE public.ticket_priority AS ENUM ('low', 'medium', 'high', 'urgent');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'student',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Create service_categories table
CREATE TABLE public.service_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT NOT NULL DEFAULT 'HelpCircle',
  color TEXT NOT NULL DEFAULT 'bg-primary',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create faqs table
CREATE TABLE public.faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category_id UUID REFERENCES public.service_categories(id) ON DELETE SET NULL,
  tags TEXT[] DEFAULT '{}',
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tickets table
CREATE TABLE public.tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  status ticket_status NOT NULL DEFAULT 'open',
  priority ticket_priority NOT NULL DEFAULT 'medium',
  category_id UUID REFERENCES public.service_categories(id) ON DELETE SET NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create ticket_messages table for conversation history
CREATE TABLE public.ticket_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID REFERENCES public.tickets(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  is_internal BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create chat_messages table for AI chat history
CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Security definer function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Function to get user's highest role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.user_roles
  WHERE user_id = _user_id
  ORDER BY CASE role
    WHEN 'admin' THEN 1
    WHEN 'staff' THEN 2
    WHEN 'student' THEN 3
  END
  LIMIT 1
$$;

-- Profiles policies
CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- User roles policies (only admins can modify, users can view their own)
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Service categories policies (public read, admin write)
CREATE POLICY "Anyone can view categories"
  ON public.service_categories FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage categories"
  ON public.service_categories FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- FAQs policies (public read, staff/admin write)
CREATE POLICY "Anyone can view FAQs"
  ON public.faqs FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Staff can manage FAQs"
  ON public.faqs FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'admin'));

-- Tickets policies
CREATE POLICY "Users can view their own tickets"
  ON public.tickets FOR SELECT
  TO authenticated
  USING (auth.uid() = created_by);

CREATE POLICY "Staff can view all tickets"
  ON public.tickets FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can create tickets"
  ON public.tickets FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own tickets"
  ON public.tickets FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by);

CREATE POLICY "Staff can update all tickets"
  ON public.tickets FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'admin'));

-- Ticket messages policies
CREATE POLICY "Users can view messages for their tickets"
  ON public.ticket_messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.tickets
      WHERE tickets.id = ticket_messages.ticket_id
      AND (tickets.created_by = auth.uid() OR public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'admin'))
    )
  );

CREATE POLICY "Users can add messages to their tickets"
  ON public.ticket_messages FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM public.tickets
      WHERE tickets.id = ticket_messages.ticket_id
      AND (tickets.created_by = auth.uid() OR public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'admin'))
    )
  );

-- Chat messages policies (users can only access their own)
CREATE POLICY "Users can view their own chat messages"
  ON public.chat_messages FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own chat messages"
  ON public.chat_messages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name');
  
  -- Assign default student role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'student');
  
  RETURN NEW;
END;
$$;

-- Trigger to create profile and assign role on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Add update triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_faqs_updated_at
  BEFORE UPDATE ON public.faqs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tickets_updated_at
  BEFORE UPDATE ON public.tickets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert seed data for service categories
INSERT INTO public.service_categories (name, description, icon, color) VALUES
  ('IT Support', 'Technical assistance for campus systems, Wi-Fi, and software', 'Monitor', 'bg-blue-500'),
  ('Library Services', 'Book reservations, database access, and study room bookings', 'BookOpen', 'bg-emerald-500'),
  ('Financial Aid', 'Scholarships, grants, payment plans, and billing inquiries', 'DollarSign', 'bg-amber-500'),
  ('Academic Records', 'Transcripts, enrollment verification, and grade inquiries', 'GraduationCap', 'bg-purple-500'),
  ('Housing', 'Dormitory assignments, maintenance requests, and housing applications', 'Home', 'bg-rose-500'),
  ('Student Life', 'Clubs, events, counseling services, and campus activities', 'Users', 'bg-cyan-500');

-- Insert seed FAQs
INSERT INTO public.faqs (question, answer, category_id, tags) 
SELECT 
  'How do I connect to campus Wi-Fi?',
  'To connect to campus Wi-Fi: 1) Select "CampusNet" from available networks. 2) Enter your student email and password. 3) Accept the terms of service. For issues, visit IT Support in Building A, Room 101.',
  id,
  ARRAY['wifi', 'network', 'internet', 'connection']
FROM public.service_categories WHERE name = 'IT Support';

INSERT INTO public.faqs (question, answer, category_id, tags)
SELECT
  'How do I reset my student portal password?',
  'Visit the Student Portal login page and click "Forgot Password". Enter your student email to receive a reset link. The link expires in 24 hours. If you don''t receive the email, check your spam folder or contact IT Support.',
  id,
  ARRAY['password', 'login', 'portal', 'reset']
FROM public.service_categories WHERE name = 'IT Support';

INSERT INTO public.faqs (question, answer, category_id, tags)
SELECT
  'How do I reserve a study room?',
  'Log into the Library Portal, navigate to "Room Reservations", select your preferred date/time, and confirm your booking. Rooms can be reserved up to 2 weeks in advance for up to 3 hours per day.',
  id,
  ARRAY['library', 'study', 'room', 'reservation']
FROM public.service_categories WHERE name = 'Library Services';

INSERT INTO public.faqs (question, answer, category_id, tags)
SELECT
  'What are the library hours?',
  'Regular hours: Monday-Thursday 7AM-11PM, Friday 7AM-9PM, Saturday 9AM-6PM, Sunday 12PM-10PM. Hours may vary during holidays and exam periods. Check the library website for current hours.',
  id,
  ARRAY['library', 'hours', 'schedule']
FROM public.service_categories WHERE name = 'Library Services';

INSERT INTO public.faqs (question, answer, category_id, tags)
SELECT
  'How do I apply for financial aid?',
  'Complete the FAFSA at studentaid.gov using our school code. Submit by March 1 for priority consideration. Additional documents may be requested via your student portal. Visit Financial Aid Office for personalized assistance.',
  id,
  ARRAY['financial aid', 'fafsa', 'scholarships', 'grants']
FROM public.service_categories WHERE name = 'Financial Aid';

INSERT INTO public.faqs (question, answer, category_id, tags)
SELECT
  'How do I request an official transcript?',
  'Log into your student portal, go to Academic Records, and select "Request Transcript". Electronic transcripts are delivered within 1-2 business days. Paper transcripts take 5-7 business days. Rush processing is available for an additional fee.',
  id,
  ARRAY['transcript', 'records', 'official']
FROM public.service_categories WHERE name = 'Academic Records';