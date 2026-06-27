// JALA VIVE Types

export type UserRole = 'volunteer' | 'organization' | 'admin';

export type ProjectStatus = 'draft' | 'published' | 'recruiting' | 'in_progress' | 'completed' | 'archived';

export type ApplicationStatus = 'pending' | 'approved' | 'rejected' | 'cancelled' | 'completed' | 'certified';

export type EventStatus = 'draft' | 'published' | 'registration_open' | 'registration_closed' | 'ongoing' | 'finished' | 'archived';

export interface Profile {
    id: string;
    user_id: string;
    role: UserRole;
    full_name: string | null;
    bio: string | null;
    avatar_url: string | null;
    phone: string | null;
    location: string | null;
    website: string | null;
    skills: string[] | null;
    interests: string[] | null;
    volunteer_hours: number;
    achievement_points: number;
    level: string;
    is_verified: boolean;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface Organization {
    id: string;
    owner_id: string;
    name: string;
    slug: string | null;
    description: string | null;
    logo_url: string | null;
    cover_url: string | null;
    website: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    city: string | null;
    country: string;
    category: string | null;
    is_verified: boolean;
    is_featured: boolean;
    total_projects: number;
    total_volunteers: number;
    total_hours: number;
    created_at: string;
    updated_at: string;
}

export interface Project {
    id: string;
    organization_id: string;
    title: string;
    slug: string | null;
    description: string | null;
    banner_url: string | null;
    category: string | null;
    location: string | null;
    requirements: string[] | null;
    benefits: string[] | null;
    skills_needed: string[] | null;
    volunteer_needed: number;
    volunteer_count: number;
    deadline: string | null;
    start_date: string | null;
    end_date: string | null;
    status: ProjectStatus;
    is_featured: boolean;
    gallery: string[] | null;
    faq: Array<{ question: string; answer: string }>;
    progress: number;
    tags: string[] | null;
    created_at: string;
    updated_at: string;
    organization?: Organization;
}

export interface ProjectApplication {
    id: string;
    project_id: string;
    user_id: string;
    message: string | null;
    status: ApplicationStatus;
    applied_at: string;
    reviewed_at: string | null;
    reviewed_by: string | null;
    completed_at: string | null;
    created_at: string;
    updated_at: string;
    project?: Project;
    profile?: Profile;
}

export interface SavedProject {
    id: string;
    project_id: string;
    user_id: string;
    created_at: string;
    project?: Project;
}

export interface Event {
    id: string;
    project_id: string | null;
    organization_id: string;
    title: string;
    description: string | null;
    banner_url: string | null;
    location: string | null;
    is_online: boolean;
    online_url: string | null;
    start_time: string | null;
    end_time: string | null;
    capacity: number | null;
    registered_count: number;
    status: EventStatus;
    tags: string[] | null;
    created_at: string;
    updated_at: string;
    organization?: Organization;
}

export interface EventAttendance {
    id: string;
    event_id: string;
    user_id: string;
    registered_at: string;
    attended: boolean;
    event?: Event;
}

export interface CommunityPost {
    id: string;
    user_id: string;
    content: string;
    image_url: string | null;
    likes_count: number;
    comments_count: number;
    is_pinned: boolean;
    created_at: string;
    updated_at: string;
    profile?: Profile;
    isLiked?: boolean;
}

export interface PostComment {
    id: string;
    post_id: string;
    user_id: string;
    content: string;
    created_at: string;
    updated_at: string;
    profile?: Profile;
}

export interface PostLike {
    id: string;
    post_id: string;
    user_id: string;
    created_at: string;
}

export interface Message {
    id: string;
    conversation_id: string;
    sender_id: string;
    receiver_id: string;
    content: string | null;
    image_url: string | null;
    is_read: boolean;
    read_at: string | null;
    created_at: string;
    sender?: Profile;
}

export interface Conversation {
    id: string;
    participant_id: string;
    participant: Profile;
    last_message?: Message;
    unread_count: number;
}

export interface Notification {
    id: string;
    user_id: string;
    type: string;
    title: string;
    message: string | null;
    data: Record<string, unknown> | null;
    is_read: boolean;
    read_at: string | null;
    created_at: string;
}

export interface Certificate {
    id: string;
    user_id: string;
    project_id: string;
    application_id: string;
    certificate_number: string;
    title: string;
    description: string | null;
    hours_completed: number;
    issued_at: string;
    created_at: string;
    project?: Project;
}

export interface AchievementDefinition {
    id: string;
    name: string;
    description: string | null;
    icon: string | null;
    requirement_type: string | null;
    requirement_value: number | null;
    points: number;
    created_at: string;
}

export interface UserAchievement {
    id: string;
    user_id: string;
    achievement_id: string;
    earned_at: string;
    achievement?: AchievementDefinition;
}

export interface ActivityLog {
    id: string;
    user_id: string | null;
    type: string;
    action: string | null;
    entity_type: string | null;
    entity_id: string | null;
    metadata: Record<string, unknown> | null;
    created_at: string;
}

// Navigation types
export interface NavItem {
    title: string;
    href: string;
    icon?: string;
    badge?: number;
    children?: NavItem[];
}

// Dashboard stats types
export interface DashboardStats {
    label: string;
    value: number | string;
    change?: number;
    icon: string;
    color: string;
}

// Form types
export interface ProjectFormData {
    title: string;
    description: string;
    category: string;
    location: string;
    requirements: string[];
    benefits: string[];
    skills_needed: string[];
    volunteer_needed: number;
    deadline: string;
    start_date: string;
    end_date: string;
    banner_url?: string;
}

export interface OrganizationFormData {
    name: string;
    description: string;
    category: string;
    website: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    logo_url?: string;
    cover_url?: string;
}

export interface ProfileFormData {
    full_name: string;
    bio: string;
    phone: string;
    location: string;
    website: string;
    skills: string[];
    interests: string[];
    avatar_url?: string;
}

// API Response types
export interface ApiResponse<T> {
    data: T | null;
    error: string | null;
    success: boolean;
}

// Pagination types
export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

// WebSocket event types
export type WebSocketEvent =
    | 'USER_CONNECTED'
    | 'USER_DISCONNECTED'
    | 'USER_TYPING'
    | 'NEW_PROJECT'
    | 'PROJECT_UPDATED'
    | 'PROJECT_ARCHIVED'
    | 'PROJECT_DELETED'
    | 'APPLICATION_CREATED'
    | 'APPLICATION_APPROVED'
    | 'APPLICATION_REJECTED'
    | 'APPLICATION_CANCELLED'
    | 'POST_CREATED'
    | 'POST_UPDATED'
    | 'POST_DELETED'
    | 'COMMENT_CREATED'
    | 'COMMENT_DELETED'
    | 'LIKE_UPDATED'
    | 'EVENT_CREATED'
    | 'EVENT_UPDATED'
    | 'EVENT_JOINED'
    | 'EVENT_CANCELLED'
    | 'MESSAGE_SENT'
    | 'MESSAGE_RECEIVED'
    | 'MESSAGE_READ'
    | 'USER_TYPING'
    | 'USER_ONLINE'
    | 'USER_OFFLINE'
    | 'NOTIFICATION_CREATED'
    | 'ANNOUNCEMENT'
    | 'SYSTEM_ALERT';

export interface WebSocketMessage {
    event: WebSocketEvent;
    payload: Record<string, unknown>;
    timestamp: string;
}
