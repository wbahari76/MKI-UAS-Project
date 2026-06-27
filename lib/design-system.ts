// JALA VIVE Design System Constants

export const colors = {
  primary: {
    DEFAULT: '#10B981',
    hover: '#059669',
    light: '#34D399',
    dark: '#047857',
  },
  secondary: {
    DEFAULT: '#2563EB',
    hover: '#1D4ED8',
    light: '#60A5FA',
    dark: '#1E40AF',
  },
  accent: {
    DEFAULT: '#F59E0B',
    hover: '#D97706',
    light: '#FBBF24',
    dark: '#B45309',
  },
  success: '#22C55E',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#3B82F6',
} as const;

export const backgrounds = {
  primary: '#FFFFFF',
  secondary: '#F8FAFC',
  card: '#FFFFFF',
  hover: '#F1F5F9',
} as const;

export const textColors = {
  primary: '#0F172A',
  secondary: '#475569',
  muted: '#94A3B8',
} as const;

export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
  },
  fontSize: {
    h1: '48px',
    h2: '36px',
    h3: '28px',
    h4: '24px',
    body: '16px',
    caption: '14px',
    small: '12px',
  },
  fontWeight: {
    bold: 700,
    semibold: 600,
    medium: 500,
    regular: 400,
  },
  lineHeight: {
    heading: 1.2,
    body: 1.5,
  },
} as const;

export const borderRadius = {
  small: '8px',
  medium: '12px',
  large: '16px',
  extra: '24px',
  button: '16px',
  card: '20px',
  modal: '24px',
  full: '9999px',
} as const;

export const shadows = {
  card: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  hover: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  modal: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
} as const;

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  '2xl': '32px',
  '3xl': '48px',
  '4xl': '64px',
  '5xl': '80px',
} as const;

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

export const container = {
  maxWidth: '1280px',
  padding: '24px',
} as const;

export const animations = {
  duration: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
  },
  easing: {
    default: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  },
} as const;

export const projectCategories = [
  'Education',
  'Environment',
  'Health',
  'Animal',
  'Technology',
  'Community',
  'Disaster',
  'Elderly',
  'Children',
  'Women Empowerment',
  'Poverty Relief',
  'Other',
] as const;

export const volunteerLevels = [
  { name: 'Explorer', minPoints: 0, color: '#94A3B8' },
  { name: 'Contributor', minPoints: 100, color: '#22C55E' },
  { name: 'Changemaker', minPoints: 250, color: '#3B82F6' },
  { name: 'Leader', minPoints: 500, color: '#F59E0B' },
  { name: 'Impact Hero', minPoints: 1000, color: '#EF4444' },
] as const;

export const projectStatuses = {
  draft: { label: 'Draft', color: '#94A3B8' },
  published: { label: 'Published', color: '#3B82F6' },
  recruiting: { label: 'Recruiting', color: '#F59E0B' },
  in_progress: { label: 'In Progress', color: '#10B981' },
  completed: { label: 'Completed', color: '#22C55E' },
  archived: { label: 'Archived', color: '#64748B' },
} as const;

export const applicationStatuses = {
  pending: { label: 'Pending', color: '#F59E0B' },
  approved: { label: 'Approved', color: '#22C55E' },
  rejected: { label: 'Rejected', color: '#EF4444' },
  cancelled: { label: 'Cancelled', color: '#64748B' },
  completed: { label: 'Completed', color: '#10B981' },
  certified: { label: 'Certified', color: '#3B82F6' },
} as const;

export const notificationTypes = {
  application_approved: { label: 'Application Approved', icon: 'CheckCircle' },
  application_rejected: { label: 'Application Rejected', icon: 'XCircle' },
  new_application: { label: 'New Application', icon: 'UserPlus' },
  new_event: { label: 'New Event', icon: 'Calendar' },
  reminder: { label: 'Reminder', icon: 'Bell' },
  certificate_ready: { label: 'Certificate Ready', icon: 'Award' },
  new_message: { label: 'New Message', icon: 'MessageCircle' },
  project_update: { label: 'Project Update', icon: 'FileText' },
  volunteer_cancel: { label: 'Volunteer Cancelled', icon: 'UserMinus' },
} as const;
