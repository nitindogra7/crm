export interface WorkspaceConfig {
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
