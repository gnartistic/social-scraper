import puppeteer from "puppeteer";

const nitterInstances = [
  "https://nitter.net",
  "https://nitter.privacydev.net",
  "https://nitter.poast.org",
  "https://nitter.lunar.icu",
];

const getRandomInstance = () => nitterInstances[ Math.floor( Math.random() * nitterInstances.length ) ];

export const scrapeTweets = async () =>
{
  const browser = await puppeteer.launch( { headless: false } ); // Set to false to debug
  const page = await browser.newPage();

  const baseURL = getRandomInstance();
  const url = `${ baseURL }/USTreasury`;
  console.log( `🔍 Fetching tweets from ${ baseURL }...` );

  try {
    await page.goto( url, { waitUntil: "networkidle2", timeout: 60000 } );

    // Make sure page is loaded before looking for tweets
    await new Promise( resolve => setTimeout( resolve, 5000 ) );
    // Wait an extra 5 seconds for safety

    console.log( "🔍 Checking if tweets are visible..." );
    const isTweetPresent = await page.$( ".tweet-content.media-body" );

    if( !isTweetPresent ) {
      console.log( "⚠️ No tweets found on this instance. Trying another one..." );
      await browser.close();
      return [];
    }

    // Extract tweets
    const tweets = await page.evaluate( () =>
    {
      return Array.from( document.querySelectorAll( ".tweet-content.media-body" ) )
        .slice( 0, 10 )
        .map( el =>
        {
          const nitterUrl = el.closest( ".timeline-item" )?.querySelector( "a.tweet-link" )?.href || "";
          const twitterUrl = nitterUrl.replace( /https:\/\/nitter\..*?\//, "https://x.com/" ).replace( "#m", "" );
          return {
            text: el.innerText.trim(),
            url: twitterUrl
          };
        } );
    } );

    await browser.close();

    if( tweets.length > 0 ) {
      console.log( `✅ Scraped ${ tweets.length } tweets from ${ baseURL }.` );
      return tweets;
    } else {
      console.log( "⚠️ No tweets found." );
      return [];
    }

  } catch( error ) {
    console.error( `❌ Error scraping from ${ baseURL }:`, error.message );
    await browser.close();
    return [];
  }
};

// Test
scrapeTweets().then( console.log );