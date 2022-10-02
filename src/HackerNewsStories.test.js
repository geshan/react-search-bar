import { render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import HackerNewsStories from './HackerNewsStories';

let windowFetchSpy;

function wait(milliseconds){
  return new Promise(resolve => {
      setTimeout(resolve, milliseconds);
  });
}

const mockHnResponse = {
  'hits': [
    {
      'created_at': '2022-10-01T20:26:19.000Z',
      'title': 'TikTok tracks you across the web, even if you don’t use the app',
      'url': 'https://www.consumerreports.org/electronics-computers/privacy/tiktok-tracks-you-across-the-web-even-if-you-dont-use-app-a4383537813/',
      'author': 'bubblehack3r',
      'points': 123,
      'objectID': '33049774',
    },
    {
      'created_at': '2022-10-01T15:16:02.000Z',
      'title': 'The self-taught UI/UX designer roadmap (2021)',
      'url': 'https://bootcamp.uxdesign.cc/the-self-taught-ui-ux-designer-roadmap-in-2021-aa0f5b62cecb',
      'author': 'homarp',
      'points': 253,    
      'objectID': '33047199',
    },    
  ],
  'page': 0,
  'query': '',
};

let mockFetch = async (url) => {
  if (url.startsWith('https://hn.algolia.com/') && url.includes('front_page')) {
    await wait(70);
    return {
      ok: true,
      status: 200,
      json: async () => mockHnResponse,
    };
  }
}


beforeEach(() => {
  windowFetchSpy = jest.spyOn(window, 'fetch').mockImplementation(mockFetch);
})

afterEach(() => {
  jest.restoreAllMocks();
});

test('should render latest HN stories H2', async () => {
  render(<HackerNewsStories />);
  const latestStoriesH2 = await screen.getByText('Latest HN Stories');
  expect(latestStoriesH2).toBeInTheDocument();
});

test('should show stories after they are fetched', async () => {
  render(<HackerNewsStories />);
  expect(windowFetchSpy).toHaveBeenCalled();
  expect(windowFetchSpy).toHaveBeenCalledWith('https://hn.algolia.com/api/v1/search_by_date?tags=front_page&hitsPerPage=20');

  //expect(screen.getByText('The self-taught UI/UX designer roadmap (2021)')).toBeInTheDocument(); //this will fail
  await waitFor(() => {
    expect(screen.getByText('The self-taught UI/UX designer roadmap (2021)')).toBeInTheDocument();
    expect(screen.getByText('homarp')).toBeInTheDocument();
  });  
});

test('should show and then hide the loading message when stories load', async() => {
  render(<HackerNewsStories />);
  const loadingText = screen.getByText('HackerNews frontpage stories loading...');
  expect(loadingText).toBeInTheDocument();
  expect(windowFetchSpy).toHaveBeenCalled();

  // await waitFor(() => {
  //   const loadingText = screen.queryByText('HackerNews frontpage stories loading...');
  //   expect(loadingText).not.toBeInTheDocument();
  // });

  await waitForElementToBeRemoved(() => screen.getByText('HackerNews frontpage stories loading...'), {timeout: 75});
});

test('should show stories sorted by maximum points first', async() => {
  render(<HackerNewsStories />);
  expect(windowFetchSpy).toHaveBeenCalled();

  const stories = await screen.findAllByRole('heading', {level : 3});
  expect(stories).toHaveLength(2);
  expect(stories[0]).toHaveAccessibleName('The self-taught UI/UX designer roadmap (2021) - By homarp (253 points)');
  expect(stories[1]).toHaveAccessibleName('TikTok tracks you across the web, even if you don’t use the app - By bubblehack3r (123 points)');
});
