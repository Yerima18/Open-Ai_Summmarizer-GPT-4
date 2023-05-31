import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Retrieve the RapidAPI key from environment variables
const rapidApiKey = import.meta.env.VITE_RAPID_API_ARTICLE_KEY;

// Create an API instance using createApi from @reduxjs/toolkit/query
export const articleApi = createApi({
  // Specify a unique name for the reducer path
  reducerPath: 'articleApi',
  // Configure the base query using fetchBaseQuery
  baseQuery: fetchBaseQuery({
    // Set the base URL for API requests
    baseUrl: 'https://article-extractor-and-summarizer.p.rapidapi.com/',
    // Prepare headers before each request
    prepareHeaders: (headers) => {
      // Set the RapidAPI key and host in the headers
      headers.set('X-RapidAPI-Key', rapidApiKey);
      headers.set('X-RapidAPI-Host', 'article-extractor-and-summarizer.p.rapidapi.com');
      return headers;
    },
  }),
  // Define endpoints for the API
  endpoints: (builder) => ({
    // Define the 'getSummary' endpoint using builder.query
    getSummary: builder.query({
      // Specify the query function and parameters
      query: (params) => `/summarize?url=${encodeURIComponent(params.articleUrl)}&length=3`,
    }),
  }),
});

// Extract the generated hooks for making API requests
export const { useLazyGetSummaryQuery } = articleApi;
