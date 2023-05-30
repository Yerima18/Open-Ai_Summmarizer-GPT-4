import { useEffect, useState } from 'react';
import { linkIcon, copy, loader } from '../assets';
import { useLazyGetSummaryQuery } from '../services/article';

const Demo = () => {
  const [article, setArticle] = useState({
    url: '',
    summary: '',
  });

  const [allArticles, setAllArticles] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!article.url) {
      console.log('URL is required');
      return;
    }

    const { data } = await getSummary({ articleUrl: article.url });

    if (data && data.summary) {
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

  const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery();

  useEffect(() => {
    const articlesFromLocalStorage = JSON.parse(localStorage.getItem('articles'));
    if (articlesFromLocalStorage) {
      setAllArticles(articlesFromLocalStorage);
    }
  }, []);

  return (
    <section className='mt-16 w-full max-w-xl'>
      {/* search */}
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
              <div className='copy_btn'>
                <img
                  src={copy}
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

      {/* display results */}
      <div className='my-10 max-w-full flex justify-center items-center'>
        {isFetching ? (
          <img src={loader} alt='loader' className='w-20 h-20 object-contain' />
        ) : error ? (
          <p className='font-inter font-bold text-black text-center'>
            Opps, something went wrong. Please try again
            <br />.
            <span className='font-satoshi font-normal text-gray-700'>
              {error?.data?.error}
            </span>
          </p>
        ) : (
          <p className='font-inter font-bold text-black text-center'>
            {article.summary}
          </p>
        )}
      </div>
    </section>
  );
};

export default Demo;