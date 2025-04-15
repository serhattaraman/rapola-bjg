
import { mockCandidates } from '@/lib/mock-data';

/**
 * Find a candidate by their ID
 * @param id The ID of the candidate to find
 * @returns The candidate object if found, or null if not found
 */
export function findCandidateById(id: string | undefined) {
  if (!id) return null;
  
  const candidate = mockCandidates.find(candidate => candidate.id === id);
  return candidate || null;
}
