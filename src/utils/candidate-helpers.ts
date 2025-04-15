
import { mockCandidates } from '@/lib/mock-data';

/**
 * Find a candidate by ID, handling possible string/number type mismatches
 * This helps when IDs might be coming in different formats (string vs number)
 */
export const findCandidateById = (id: string | number | undefined) => {
  if (!id) return null;
  
  // First try direct match
  let candidate = mockCandidates.find(c => c.id === id);
  
  // If not found, try converting string to number
  if (!candidate && typeof id === 'string' && !isNaN(Number(id))) {
    candidate = mockCandidates.find(c => c.id === Number(id));
  }
  
  // If still not found, try converting number to string
  if (!candidate && typeof id === 'number') {
    candidate = mockCandidates.find(c => c.id === String(id));
  }
  
  return candidate || null;
};

/**
 * Get valid candidate ID for navigation
 * Ensures the ID actually exists in our mock data
 */
export const getValidCandidateId = () => {
  return mockCandidates.length > 0 ? mockCandidates[0].id : null;
};
