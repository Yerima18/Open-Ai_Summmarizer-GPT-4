import { useEffect, useState } from 'react';
import { linkIcon, copy, loader, tick } from '../assets';
import { useLazyGetSummaryQuery } from '../services/article';
import { langdetect } from 'langdetect'; // Import the langdetect library


const Demo = () => {
  // State for the current article URL and its summary
  const [article, setArticle] = useState({
    url: '',
    summary: '',
  });

  // State for storing all the articles
  const [allArticles, setAllArticles] = useState([]);

  // State for tracking the copied URL
  const [copied, setCopied] = useState("");

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!article.url) {
      console.log('URL is required');
      return;
    }

    // Call the API to retrieve the article summary
    const { data } = await getSummary({ articleUrl: article.url });

    if (data && data.summary) {
      // If summary is available, update the state and store it in local storage
      const newArticle = { ...article, summary: data.summary };
      const updatedArticles = [newArticle, ...allArticles];

      setArticle(newArticle);
      setAllArticles(updatedArticles);
      console.log(newArticle);

      localStorage.setItem('articles', JSON.stringify(updatedArticles));
    } else {
      console.log('Unable to retrieve summary');
    }
  };

  // Fetch article summaries using a custom query hook
  const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery();

  // Load articles from local storage on component mount
  useEffect(() => {
    const articlesFromLocalStorage = JSON.parse(localStorage.getItem('articles'));
    if (articlesFromLocalStorage) {
      setAllArticles(articlesFromLocalStorage);
    }
  }, []);

  // Function to handle URL copying
  const handleCopy = (copyURL) => {
    setCopied(copyURL);
    navigator.clipboard.writeText(copyURL);
    setTimeout(() => setCopied(""), 3000); // Reset copied state after 3 seconds
  };

  return (
    <section className='mt-16 w-full max-w-xl'>
      {/* Search */}
      <div className='flex flex-col w-full gap-2'>
        <form className='relative flex justify-center items-center' onSubmit={handleSubmit}>
          <img src={linkIcon} alt='link_icon' className='absolute left-0 my-2 ml-3 w-5' />

          <input
            type='url'
            placeholder='Enter a URL'
            value={article.url}
            onChange={(e) => setArticle({ ...article, url: e.target.value })}
            required
            className='url_input peer'
          />

          <button
            type='submit'
            className='submit_btn peer-focus:border-gray-700 peer-focus:text-gray-700'
          >
            ⏎
          </button>
        </form>

        {/* Browser URL history */}
        <div className='flex flex-col gap-1 max-h-60 overflow-y-auto'>
          {allArticles.map((item, index) => (
            <div
              key={`link-${index}`}
              onClick={() => setArticle(item)}
              className='link_card'
            >
              <div className='copy_btn' onClick={() => handleCopy(item.url)}>
                {/* Show copy or tick icon based on whether the URL is copied */}
                <img
                  src={copied === item.url ? tick : copy}
                  alt='copy_icon'
                  className='w-[40%] h-[40%] object-contain'
                />
              </div>
              <p className='flex-1 font-satoshi text-blue-700 font-medium text-sm truncate'>
                {item.url}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Display results */}
      <div className='my-10 max-w-full flex justify-center items-center'>
        {isFetching ? (
          <img src={loader} alt='loader' className='w-20 h-20 object-contain' />
        ) : error ? (
          <p className='font-inter font-bold text-black text-center'>
            Oops, something went wrong. Please try again
            <br />.
            <span className='font-satoshi font-normal text-gray-700'>
              {error?.data?.error}
            </span>
          </p>
        ) : (
          article.summary && (
            <div className='flex flex-col gap-3'>
              <h2 className='font-satoshi font-bold text-gray-600 text-xl'>
                Article <span className='blue_gradient'>Summary</span>
              </h2>
              <div className='summary_box'>
                <p className='font-inter font-medium tex-sm text-gray-700'>
                  {article.summary}
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
};

export default Demo;
