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

export type PlannerItem = 
    | (Stay & { type: 'Stay' })
    | (WorkSpot & { type: 'WorkSpot', name: string }) // name is on WorkSpot, title is on CommunityEvent
    | (CommunityEvent & { type: 'Community', title: string });
