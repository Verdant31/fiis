import webdriver from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";

const options = new chrome.Options();
options.addArguments("--headless");
options.addArguments("--disable-gpu");
options.addArguments("--no-sandbox");
options.addArguments("--disable-dev-shm-usage");
options.addArguments("--log-level=3");

export const driver = new webdriver.Builder().forBrowser("chrome").setChromeOptions(options).build();
