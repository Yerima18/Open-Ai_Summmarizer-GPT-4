import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { langdetect } from 'langdetect'; // Import the langdetect library

const rapidApiKey = import.meta.env.VITE_RAPID_API_ARTICLE_KEY;

export const articleApi = createApi({
  reducerPath: 'articleApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://article-extractor-and-summarizer.p.rapidapi.com/',
    prepareHeaders: (headers) => {
      headers.set('X-RapidAPI-Key', rapidApiKey);
      headers.set('X-RapidAPI-Host', 'article-extractor-and-summarizer.p.rapidapi.com');
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getSummary: builder.query({
      query: async (params) => {
        // Fetch article content
        const contentResponse = await fetch(
          `https://article-extractor-and-summarizer.p.rapidapi.com/content?url=${encodeURIComponent(
            params.articleUrl
          )}`,
          {
            method: 'GET',
            headers: {
              'X-RapidAPI-Key': rapidApiKey,
              'X-RapidAPI-Host': 'article-extractor-and-summarizer.p.rapidapi.com',
            },
          }
        );

        if (!contentResponse.ok) {
          throw new Error('Failed to fetch article content');
        }

        const contentData = await contentResponse.json();

        // Detect language
        const detectedLanguage = langdetect.detect(contentData.articleContent);

        // Set the language parameter based on detection
        const languageParam = detectedLanguage === 'en' ? 'en' : 'fr';

        // Fetch summary with language parameter
        const summaryResponse = await fetch(
          `https://article-extractor-and-summarizer.p.rapidapi.com/summarize?url=${encodeURIComponent(
            params.articleUrl
          )}&length=3&lang=${languageParam}`,
          {
            method: 'GET',
            headers: {
              'X-RapidAPI-Key': rapidApiKey,
              'X-RapidAPI-Host': 'article-extractor-and-summarizer.p.rapidapi.com',
            },
          }
        );

        if (!summaryResponse.ok) {
          throw new Error('Failed to fetch article summary');
        }

        return summaryResponse.json();
      },
    }),
  }),
});

export const { useLazyGetSummaryQuery } = articleApi;
