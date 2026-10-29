export interface OrganizationDashboard {
  id: string;
  userId: string;
  organizationId?: string | null;
  name: string;
  slug: string;
  ownerEmail?: string | null;
  avatarTone: string;
  plan: string;
  createdAt: string;
  updatedAt?: string;
}

export interface WorkspaceConfig {
  id?: string;
  name: string;
  slug: string;
  ownerEmail: string;
  plan: string;
  avatarTone: string;
  createdAt: string;
}

export interface AvatarTone {
  id: string;
  bg: string;
  border: string;
  text: string;
}
