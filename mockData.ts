import type { Stay, WorkSpot, CommunityEvent } from './types';

export const MOCK_STAYS: Stay[] = [
  {
    id: 's1',
    name: 'The Digital Oasis',
    city: 'Lisbon, Portugal',
    wifiSpeed: 250,
    workspaceType: 'Shared Lounge',
    pricePerNight: 85,
    imageUrl: 'https://images.unsplash.com/photo-1583351118968-3a8a30a7d7f7?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 's2',
    name: 'Coder\'s Cove',
    city: 'Bali, Indonesia',
    wifiSpeed: 100,
    workspaceType: 'Dedicated Desk',
    pricePerNight: 60,
    imageUrl: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 's3',
    name: 'Focus Hub',
    city: 'Medellín, Colombia',
    wifiSpeed: 150,
    workspaceType: 'Private Office',
    pricePerNight: 110,
    imageUrl: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 's4',
    name: 'The Nomad\'s Nook',
    city: 'Chiang Mai, Thailand',
    wifiSpeed: 300,
    workspaceType: 'Shared Lounge',
    pricePerNight: 55,
    imageUrl: 'https://images.unsplash.com/photo-1590447158023-632b7033a059?q=80&w=600&auto=format&fit=crop',
  },
];

export const MOCK_WORK_SPOTS: WorkSpot[] = [
    { id: 'w1', name: 'Café de la Connexion', city: 'Lisbon, Portugal', wifiSpeed: 80 },
    { id: 'w2', name: 'Productivity Pad', city: 'Bali, Indonesia', wifiSpeed: 120 },
    { id: 'w3', name: 'El Teclado Rápido', city: 'Medellín, Colombia', wifiSpeed: 200 },
    { id: 'w4', name: 'Jungle Co-work', city: 'Chiang Mai, Thailand', wifiSpeed: 150 },
];

export const MOCK_COMMUNITY_EVENTS: CommunityEvent[] = [
    { id: 'c1', title: 'Sunset Nomad Mingle', city: 'Lisbon, Portugal', date: '2025-10-22' },
    { id: 'c2', title: 'Beachside Yoga & Code', city: 'Bali, Indonesia', date: '2025-11-15' },
    { id: 'c3', title: 'Salsa Night for Expats', city: 'Medellín, Colombia', date: '2025-12-05' },
    { id: 'c4', title: 'Thai Cooking Class Meetup', city: 'Chiang Mai, Thailand', date: '2025-11-20' },
];
