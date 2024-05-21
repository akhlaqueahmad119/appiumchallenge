
describe("Amazon vs Flipkart Price and Delivery Comparison", () => {
  let amazonPrice, flipkartPrice, amazonDelivery, flipkartDelivery;

  it("should fetch iPhone 14 details from Amazon", async () => {
    await driver.reset();
    await $(
      'android=new UiSelector().resourceId("com.amazon.mShop.android.shopping:id/rs_search_src_text")'
    ).setValue("iPhone 14 Black 256 GB");
    await driver.pressKeyCode(66); 
    await $(
      'android=new UiSelector().className("android.widget.ImageView")'
    ).click();
    await driver.pause(3000);

    amazonPrice = await $(
      'android=new UiSelector().resourceId("com.amazon.mShop.android.shopping:id/priceblock_ourprice")'
    ).getText();
    await $('android=new UiSelector().text("Deliver to")').click();
    await $(
      'android=new UiSelector().resourceId("com.amazon.mShop.android.shopping:id/loc_ux_pin_code_input")'
    ).setValue("831003");
    await $(
      'android=new UiSelector().resourceId("com.amazon.mShop.android.shopping:id/loc_ux_update_pin_code")'
    ).click();
    amazonDelivery = await $(
      'android=new UiSelector().resourceId("com.amazon.mShop.android.shopping:id/arrival_message")'
    ).getText();
  });

  it("should fetch iPhone 14 details from Flipkart", async () => {
    await driver.reset();
    await $(
      'android=new UiSelector().resourceId("com.flipkart.android:id/search_widget_textbox")'
    ).setValue("iPhone 14 Black 256 GB");
    await driver.pressKeyCode(66); 
    await $(
      'android=new UiSelector().className("android.widget.ImageView")'
    ).click(); 
    await driver.pause(3000);

    flipkartPrice = await $(
      'android=new UiSelector().resourceId("com.flipkart.android:id/product_price")'
    ).getText();
    await $(
      'android=new UiSelector().resourceId("com.flipkart.android:id/pincode_text_view")'
    ).click();
    await $(
      'android=new UiSelector().resourceId("com.flipkart.android:id/pincode_input_box")'
    ).setValue("831003");
    await $(
      'android=new UiSelector().resourceId("com.flipkart.android:id/pincode_check_button")'
    ).click();
    flipkartDelivery = await $(
      'android=new UiSelector().resourceId("com.flipkart.android:id/delivery_time")'
    ).getText();
  });

  it("should compare prices and delivery times", async () => {
    const amazonPriceValue = parseFloat(amazonPrice.replace(/[^0-9.]/g, ""));
    const flipkartPriceValue = parseFloat(
      flipkartPrice.replace(/[^0-9.]/g, "")
    );

    console.log(
      `Amazon Price: ${amazonPriceValue}, Delivery: ${amazonDelivery}`
    );
    console.log(
      `Flipkart Price: ${flipkartPriceValue}, Delivery: ${flipkartDelivery}`
    );

    let result;

    if (
      flipkartPriceValue > amazonPriceValue &&
      flipkartDelivery > amazonDelivery
    ) {
      result = "Amazon price is lower and can deliver early";
      await driver.activateApp("in.amazon.mShop.android.shopping");
    } else if (
      amazonPriceValue > flipkartPriceValue &&
      amazonDelivery > flipkartDelivery
    ) {
      result = "Flipkart price is lower and can deliver early";
      await driver.activateApp("com.flipkart.android");
    } else if (
      amazonPriceValue === flipkartPriceValue &&
      amazonDelivery === flipkartDelivery
    ) {
      result = "Go for any app of your choice";
    } else if (
      flipkartPriceValue > amazonPriceValue &&
      amazonDelivery < flipkartDelivery
    ) {
      result = "Amazon will deliver faster";
      await driver.activateApp("in.amazon.mShop.android.shopping");
    } else if (
      amazonPriceValue > flipkartPriceValue &&
      flipkartDelivery < amazonDelivery
    ) {
      result = "Flipkart will deliver faster";
      await driver.activateApp("com.flipkart.android");
    }

    console.log(result);
  });
});
