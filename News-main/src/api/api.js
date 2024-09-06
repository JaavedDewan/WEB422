const NEWS_API_TOKEN = 'pub_50585bca5951936c5541e5da5a33f54d7cd57';

export const fetchBreakingNews = async () => {
  const API_BASE_URL = `https://newsdata.io/api/1/news?apikey=${NEWS_API_TOKEN}&language=en&removeduplicate=1`;
  try {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch breaking news.');
    }
    const data = await response.json();
    console.log("Breaking News Data:", data); // Debug: Check the structure of data
    return data.results; // Ensure this matches the API response structure
  } catch (error) {
    console.error('Error fetching breaking news:', error);
    throw error;
  }
};

export const searchArticles = async (query) => {
  const API_BASE_URL = `https://newsdata.io/api/1/news?apikey=${NEWS_API_TOKEN}&q=${encodeURIComponent(query)}&language=en&removeduplicate=1`;
  try {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch search results.');
    }
    const data = await response.json();
    console.log("Search Results Data:", data); // Debug: Check the structure of data
    return data.results; // Ensure this matches the API response structure
  } catch (error) {
    console.error('Error fetching search results:', error);
    throw error;
  }
};
