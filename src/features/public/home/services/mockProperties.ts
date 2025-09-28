import type { Property } from '../types/property.types'

export const mockProperties: Property[] = [
  {
    id: "PROP-001",
    idOwner: "OWN-001",
    name: "Modern Downtown Apartment",
    address: "123 Main Street, Downtown, New York, NY 10001",
    price: 850000,
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop",
    ownerName: "John Smith"
  },
  {
    id: "PROP-002",
    idOwner: "OWN-002", 
    name: "Luxury Penthouse Suite",
    address: "456 Park Avenue, Upper East Side, New York, NY 10065",
    price: 2500000,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop",
    ownerName: "Sarah Johnson"
  },
  {
    id: "PROP-003",
    idOwner: "OWN-003",
    name: "Cozy Studio in Brooklyn",
    address: "789 Brooklyn Heights Promenade, Brooklyn, NY 11201",
    price: 450000,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop",
    ownerName: "Michael Brown"
  },
  {
    id: "PROP-004",
    idOwner: "OWN-004",
    name: "Family House with Garden",
    address: "321 Suburban Lane, Queens, NY 11375",
    price: 675000,
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop",
    ownerName: "Emily Davis"
  },
  {
    id: "PROP-005",
    idOwner: "OWN-005",
    name: "Waterfront Condo",
    address: "654 Riverside Drive, Manhattan, NY 10031",
    price: 1200000,
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop",
    ownerName: "Robert Wilson"
  },
  {
    id: "PROP-006",
    idOwner: "OWN-006",
    name: "Historic Brownstone",
    address: "987 Harlem Street, Harlem, NY 10027",
    price: 950000,
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
    ownerName: "Lisa Martinez"
  },
  {
    id: "PROP-007",
    idOwner: "OWN-007",
    name: "Modern Loft Space",
    address: "159 Industrial Boulevard, Long Island City, NY 11101",
    price: 725000,
    image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&h=300&fit=crop",
    ownerName: "David Anderson"
  },
  {
    id: "PROP-008",
    idOwner: "OWN-008",
    name: "Luxury Villa with Pool",
    address: "753 Estate Drive, The Hamptons, NY 11937",
    price: 3200000,
    image: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400&h=300&fit=crop",
    ownerName: "Jennifer Taylor"
  },
  {
    id: "PROP-009",
    idOwner: "OWN-009",
    name: "Compact City Apartment",
    address: "852 Broadway, Midtown, NY 10003",
    price: 590000,
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop",
    ownerName: "Christopher Thomas"
  },
  {
    id: "PROP-010",
    idOwner: "OWN-010",
    name: "Suburban Ranch Home",
    address: "741 Oak Tree Road, Staten Island, NY 10314",
    price: 485000,
    image: "https://images.unsplash.com/photo-1449844908441-8829872d2607?w=400&h=300&fit=crop",
    ownerName: "Amanda White"
  }
]

// Simulate API delay
export const fetchMockProperties = (): Promise<Property[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockProperties)
    }, 1000) // 1 second delay to simulate network request
  })
}