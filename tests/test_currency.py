import pytest
from playwright.sync_api import Page, Browser

def test_currency_load_from_browser_location(browser: Browser, base_url):
    """Verify that the currency is auto-selected based on browser location (timezone/locale)."""
    # Create context emulating India timezone and locale
    context = browser.new_context(
        timezone_id="Asia/Kolkata",
        locale="en-IN",
        viewport={'width': 1280, 'height': 800}
    )
    page = context.new_page()
    
    # Clear localStorage first to make sure there are no saved preferences
    page.goto(base_url)
    page.evaluate("localStorage.clear()")
    
    # Reload page to trigger fresh detection
    page.goto(base_url)
    
    # Wait for the currency selector component to hydrate
    page.wait_for_selector(".active-currency-label")
    
    # Verify label resolves to INR
    active_currency = page.locator(".active-currency-label").text_content()
    assert active_currency.strip() == "INR"
    
    # Verify prices contain the '₹' symbol
    first_price = page.locator(".package-price").first.text_content()
    assert "₹" in first_price
    
    context.close()

def test_currency_load_from_url_parameter(browser: Browser, base_url):
    """Verify that URL parameter ?currency=... sets the currency correctly."""
    context = browser.new_context(viewport={'width': 1280, 'height': 800})
    page = context.new_page()
    
    # Go to URL with CAD currency parameter
    page.goto(base_url + "/?currency=cad")
    page.wait_for_selector(".active-currency-label")
    
    active_currency = page.locator(".active-currency-label").text_content()
    assert active_currency.strip() == "CAD"
    
    # Verify prices contain the '$' symbol
    first_price = page.locator(".package-price").first.text_content()
    assert "$" in first_price
    
    # Go to URL with INR currency parameter (lowercase check)
    page.goto(base_url + "/?currency=inr")
    page.wait_for_selector(".active-currency-label")
    
    active_currency = page.locator(".active-currency-label").text_content()
    assert active_currency.strip() == "INR"
    
    first_price = page.locator(".package-price").first.text_content()
    assert "₹" in first_price
    
    context.close()

def test_currency_url_precedence_over_location(browser: Browser, base_url):
    """Verify that URL parameter takes precedence over browser location detection."""
    # Location is India, but URL is set to ?currency=cad
    context = browser.new_context(
        timezone_id="Asia/Kolkata",
        locale="en-IN",
        viewport={'width': 1280, 'height': 800}
    )
    page = context.new_page()
    
    # Clear localStorage first
    page.goto(base_url)
    page.evaluate("localStorage.clear()")
    
    # Go to URL with CAD parameter
    page.goto(base_url + "/?currency=cad")
    page.wait_for_selector(".active-currency-label")
    
    # Active currency should be CAD, not INR
    active_currency = page.locator(".active-currency-label").text_content()
    assert active_currency.strip() == "CAD"
    
    first_price = page.locator(".package-price").first.text_content()
    assert "$" in first_price
    
    context.close()
