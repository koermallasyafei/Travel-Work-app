export interface Stay {
  id: string;
  name: string;
  city: string;
  wifiSpeed: number;
  workspaceType: 'Dedicated Desk' | 'Shared Lounge' | 'Private Office';
  pricePerNight: number;
  imageUrl: string;
}

export interface WorkSpot {
  id: string;
  name: string;
  city: string;
  wifiSpeed: number;
}

export interface CommunityEvent {
    id: string;
    title: string;
    city: string;
    date: string;
}

// FIX: Simplify the discriminated union by removing redundant properties.
// `WorkSpot` already has `name`, and `CommunityEvent` already has `title`.
export type PlannerItem = 
    | (Stay & { type: 'Stay' })
    | (WorkSpot & { type: 'WorkSpot' })
    | (CommunityEvent & { type: 'Community' });