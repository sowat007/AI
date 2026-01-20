
export enum Role {
  USER = 'user',
  MODEL = 'model'
}

export interface Message {
  role: Role;
  text: string;
  timestamp: Date;
  sources?: { title: string; uri: string }[];
}

export interface LegalTopic {
  id: string;
  title: string;
  description: string;
  icon: string;
}
