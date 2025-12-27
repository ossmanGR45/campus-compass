import { User, Ticket, FAQ, ServiceCategory } from '@/types';

export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'Alex Johnson',
    email: 'alex.johnson@campus.edu',
    role: 'student',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex'
  },
  {
    id: 'user-2',
    name: 'Sarah Chen',
    email: 'sarah.chen@campus.edu',
    role: 'staff',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
  },
  {
    id: 'user-3',
    name: 'Dr. Michael Roberts',
    email: 'michael.roberts@campus.edu',
    role: 'admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael'
  }
];

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'it-support',
    name: 'IT & Tech Support',
    description: 'Wi-Fi, email, software, and hardware issues',
    icon: 'Laptop',
    color: 'bg-blue-500'
  },
  {
    id: 'registration',
    name: 'Course Registration',
    description: 'Enrollment, class schedules, and academic records',
    icon: 'GraduationCap',
    color: 'bg-emerald-500'
  },
  {
    id: 'library',
    name: 'Library Services',
    description: 'Book loans, research help, and study spaces',
    icon: 'BookOpen',
    color: 'bg-amber-500'
  },
  {
    id: 'financial-aid',
    name: 'Financial Aid',
    description: 'Scholarships, grants, and tuition payments',
    icon: 'Wallet',
    color: 'bg-purple-500'
  },
  {
    id: 'housing',
    name: 'Housing & Residence',
    description: 'Dorm assignments, maintenance, and roommate issues',
    icon: 'Home',
    color: 'bg-rose-500'
  },
  {
    id: 'general',
    name: 'General Inquiries',
    description: 'Campus events, policies, and other questions',
    icon: 'HelpCircle',
    color: 'bg-slate-500'
  }
];

export const mockFAQs: FAQ[] = [
  {
    id: 'faq-1',
    question: 'How do I connect to campus Wi-Fi?',
    answer: 'To connect to campus Wi-Fi: 1) Select "CampusSecure" from available networks. 2) Enter your student email and password. 3) Accept the certificate if prompted. If you\'re having issues, try forgetting the network and reconnecting, or visit the IT Help Desk in the Library Building.',
    category: 'it-support',
    tags: ['wifi', 'internet', 'connection', 'network'],
    helpful: 245,
    views: 1520
  },
  {
    id: 'faq-2',
    question: 'How do I reset my student portal password?',
    answer: 'Visit portal.campus.edu/reset and enter your student ID. You\'ll receive a reset link at your registered email. If you don\'t receive the email within 5 minutes, check your spam folder or contact IT Support.',
    category: 'it-support',
    tags: ['password', 'reset', 'portal', 'login'],
    helpful: 189,
    views: 980
  },
  {
    id: 'faq-3',
    question: 'How do I add or drop a course?',
    answer: 'Log into the Student Portal, go to "Registration" > "Add/Drop Courses". You can modify your schedule until the add/drop deadline (usually 2 weeks after semester start). After this period, you\'ll need department approval.',
    category: 'registration',
    tags: ['courses', 'registration', 'add', 'drop', 'schedule'],
    helpful: 312,
    views: 2100
  },
  {
    id: 'faq-4',
    question: 'What are the library hours?',
    answer: 'Main Library: Mon-Thu 7AM-12AM, Fri 7AM-9PM, Sat 9AM-9PM, Sun 10AM-12AM. Hours may vary during holidays and exam periods. Check library.campus.edu for current hours and special closures.',
    category: 'library',
    tags: ['library', 'hours', 'schedule', 'open'],
    helpful: 156,
    views: 890
  },
  {
    id: 'faq-5',
    question: 'How do I apply for financial aid?',
    answer: 'Complete the FAFSA at studentaid.gov using our school code (001234). Then submit any additional documents through the Financial Aid portal. Priority deadline is March 1st for the following academic year.',
    category: 'financial-aid',
    tags: ['fafsa', 'financial aid', 'scholarships', 'grants'],
    helpful: 278,
    views: 1650
  },
  {
    id: 'faq-6',
    question: 'How do I check my scholarship status?',
    answer: 'Log into the Student Portal and navigate to "Financial Aid" > "Awards". You can view all pending and approved scholarships, their amounts, and disbursement dates.',
    category: 'financial-aid',
    tags: ['scholarship', 'status', 'awards', 'money'],
    helpful: 198,
    views: 1120
  },
  {
    id: 'faq-7',
    question: 'How do I request a dorm room change?',
    answer: 'Submit a Room Change Request through the Housing Portal. Requests are reviewed monthly. Include your reason and any preferred buildings/roommates. Medical accommodations require documentation from the Health Center.',
    category: 'housing',
    tags: ['dorm', 'room', 'change', 'housing', 'roommate'],
    helpful: 134,
    views: 720
  },
  {
    id: 'faq-8',
    question: 'How do I report a maintenance issue in my dorm?',
    answer: 'Use the Housing Portal\'s "Maintenance Request" feature. For emergencies (flooding, no heat, security issues), call Campus Security at (555) 123-4567 immediately.',
    category: 'housing',
    tags: ['maintenance', 'repair', 'dorm', 'emergency'],
    helpful: 167,
    views: 890
  },
  {
    id: 'faq-9',
    question: 'How do I get my student ID card?',
    answer: 'Visit the ID Card Office in the Student Center (Room 102) with your acceptance letter and photo ID. Hours: Mon-Fri 9AM-5PM. Replacement cards cost $25.',
    category: 'general',
    tags: ['id card', 'student id', 'identification'],
    helpful: 223,
    views: 1340
  },
  {
    id: 'faq-10',
    question: 'Where can I print documents on campus?',
    answer: 'Printing stations are available in all campus libraries, computer labs, and the Student Center. Use your student ID to log in. Costs: B&W 5¢/page, Color 25¢/page. Add funds via the Student Portal.',
    category: 'it-support',
    tags: ['printing', 'print', 'documents', 'copy'],
    helpful: 145,
    views: 780
  }
];

export const mockTickets: Ticket[] = [
  {
    id: 'ticket-1',
    subject: 'Cannot access online course materials',
    description: 'I\'ve been trying to access the course materials for BIO 201 on the learning management system, but I keep getting an "Access Denied" error. I\'m enrolled in the class and can see it in my schedule.',
    category: 'it-support',
    status: 'in-progress',
    priority: 'high',
    createdBy: 'user-1',
    createdByName: 'Alex Johnson',
    assignedTo: 'user-2',
    assignedToName: 'Sarah Chen',
    createdAt: new Date('2024-01-15T10:30:00'),
    updatedAt: new Date('2024-01-15T14:20:00'),
    replies: [
      {
        id: 'reply-1',
        ticketId: 'ticket-1',
        content: 'Hi Alex, I\'m looking into this issue. Can you tell me when you first noticed this problem?',
        authorId: 'user-2',
        authorName: 'Sarah Chen',
        authorRole: 'staff',
        createdAt: new Date('2024-01-15T11:00:00')
      },
      {
        id: 'reply-2',
        ticketId: 'ticket-1',
        content: 'It started yesterday after I registered for the class. I waited 24 hours like the FAQ suggested but still can\'t get in.',
        authorId: 'user-1',
        authorName: 'Alex Johnson',
        authorRole: 'student',
        createdAt: new Date('2024-01-15T11:30:00')
      }
    ]
  },
  {
    id: 'ticket-2',
    subject: 'Financial aid disbursement question',
    description: 'My financial aid shows as "approved" but hasn\'t been applied to my student account yet. The semester starts in 3 days and I need to confirm my enrollment.',
    category: 'financial-aid',
    status: 'open',
    priority: 'urgent',
    createdBy: 'user-1',
    createdByName: 'Alex Johnson',
    createdAt: new Date('2024-01-16T09:00:00'),
    updatedAt: new Date('2024-01-16T09:00:00'),
    replies: []
  },
  {
    id: 'ticket-3',
    subject: 'Broken heater in Wilson Hall Room 304',
    description: 'The heater in my dorm room hasn\'t been working for 2 days. It\'s getting really cold at night. I submitted a maintenance request but haven\'t heard back.',
    category: 'housing',
    status: 'resolved',
    priority: 'high',
    createdBy: 'user-1',
    createdByName: 'Alex Johnson',
    assignedTo: 'user-2',
    assignedToName: 'Sarah Chen',
    createdAt: new Date('2024-01-10T18:00:00'),
    updatedAt: new Date('2024-01-12T16:00:00'),
    replies: [
      {
        id: 'reply-3',
        ticketId: 'ticket-3',
        content: 'A maintenance technician has been dispatched and should arrive within the hour.',
        authorId: 'user-2',
        authorName: 'Sarah Chen',
        authorRole: 'staff',
        createdAt: new Date('2024-01-11T09:00:00')
      },
      {
        id: 'reply-4',
        ticketId: 'ticket-3',
        content: 'The heater has been repaired. Please let us know if you experience any further issues.',
        authorId: 'user-2',
        authorName: 'Sarah Chen',
        authorRole: 'staff',
        createdAt: new Date('2024-01-12T16:00:00')
      }
    ]
  }
];

export const getCategoryInfo = (categoryId: string): ServiceCategory | undefined => {
  return serviceCategories.find(cat => cat.id === categoryId);
};

export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    'open': 'bg-blue-100 text-blue-700',
    'in-progress': 'bg-amber-100 text-amber-700',
    'pending': 'bg-purple-100 text-purple-700',
    'resolved': 'bg-emerald-100 text-emerald-700',
    'closed': 'bg-slate-100 text-slate-700'
  };
  return colors[status] || 'bg-slate-100 text-slate-700';
};

export const getPriorityColor = (priority: string): string => {
  const colors: Record<string, string> = {
    'low': 'bg-slate-100 text-slate-600',
    'medium': 'bg-blue-100 text-blue-600',
    'high': 'bg-amber-100 text-amber-600',
    'urgent': 'bg-red-100 text-red-600'
  };
  return colors[priority] || 'bg-slate-100 text-slate-600';
};
