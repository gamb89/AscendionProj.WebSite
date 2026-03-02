import type { Story } from '../types/story';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000';

export async function fetchBestStories(count: number): Promise<Story[]> {
  const response = await fetch(`${API_BASE_URL}/api/stories?count=${count}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch stories: ${response.statusText}`);
  }
  return response.json();
}
