
export enum Role {
  USER = 'user',
  MODEL = 'model'
}

export interface Message {
  role: Role;
  text: string;
  timestamp: Date;
  sources?: { title: string; uri: string }[];
  audioData?: Uint8Array; // Store audio bytes for replaying
}

export interface LegalTopic {
  id: string;
  title: string;
  description: string;
  icon: string;
}
