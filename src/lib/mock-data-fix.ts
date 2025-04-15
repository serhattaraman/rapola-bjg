
// This is a temporary file to check the IDs in the mock data
// We'll import it and log the IDs to help debug the problem
import { mockCandidates } from './mock-data';

// Log all candidate IDs for debugging
console.log("All candidate IDs:", mockCandidates.map(c => c.id));

// Check if any candidate has ID "c1"
const hasC1 = mockCandidates.some(c => c.id === "c1");
console.log(`Is there a candidate with ID "c1"? ${hasC1}`);

// Find all places where candidates are referenced by ID
// This will help us identify where the "c1" ID might be used
export const debugCandidateIds = () => {
  return {
    allIds: mockCandidates.map(c => c.id),
    hasC1: hasC1,
    candidate: mockCandidates.find(c => c.id === "c1") || null
  };
};
