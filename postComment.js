import { Builder, By, until } from "selenium-webdriver";
import * as chrome from "selenium-webdriver/chrome.js";
import dotenv from "dotenv";
dotenv.config();

export const postComment = async ( tweetUrl, comment ) =>
{
  let driver = await new Builder()
    .forBrowser( "chrome" )
    .setChromeOptions( new chrome.Options() )
    .build();

  try {
    console.log( `🔍 Opening tweet page: ${ tweetUrl }...` );
    const cleanTweetUrl = tweetUrl.replace( "#m", "" ).replace( "twitter.com", "x.com" );
    console.log( `🔍 Opening cleaned tweet page: ${ cleanTweetUrl }...` );
    await driver.get( cleanTweetUrl );

    await driver.sleep( 5000 );

    console.log( "🔍 Waiting for reply button..." );
    await driver.wait( until.elementLocated( By.xpath( "//button[contains(@aria-label, 'Replies. Reply')]" ) ), 10000 );
    await driver.findElement( By.xpath( "//button[contains(@aria-label, 'Replies. Reply')]" ) ).click();
    console.log( "✅ Reply button clicked!" );

    // ✅ Extra delay after clicking the reply button to allow the text box to appear
    await driver.sleep( 5000 );

    console.log( "🔍 Waiting for reply container..." );
    const replyContainer = await driver.wait(
      until.elementLocated( By.css( "div[data-testid='tweetTextarea_0RichTextInputContainer']" ) ),
      15000
    );
    await replyContainer.click(); // Click to activate the text area
    await driver.sleep( 1000 ); // Ensure it's activated

    console.log( "🔍 Waiting for reply text box..." );
    const replyBox = await driver.wait(
      until.elementLocated( By.css( "div[data-testid='tweetTextarea_0'][role='textbox'][contenteditable='true']" ) ),
      15000
    );
    await driver.sleep( 1000 );

    console.log( `✍️ Typing comment: "${ comment }"` );
    await replyBox.sendKeys( comment );
    await driver.sleep( 2000 ); // Wait for button to activate


    console.log( `✍️ Typing comment: "${ comment }"` );
    await replyBox.sendKeys( comment );
    await driver.sleep( 2000 ); // Wait for button to activate

    console.log( "🔍 Waiting for active reply button..." );
    const replyButton = await driver.wait(
      until.elementLocated( By.xpath( "//button[@data-testid='tweetButton' and @role='button']" ) ),
      10000
    );
    await driver.wait( until.elementIsVisible( replyButton ), 5000 );
    await driver.wait( until.elementIsEnabled( replyButton ), 5000 );

    console.log( "✅ Posting comment..." );
    await replyButton.click();
    console.log( "✅ Comment Posted!" );

  } finally {
    await driver.quit();
  }
};