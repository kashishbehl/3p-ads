export interface Segment {
  id: string;
  name: string;
  description?: string;
  category: string; // 'retail', 'restricted', etc.
  createdAt: string;
}
