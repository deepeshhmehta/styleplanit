import pytest
from playwright.sync_api import Page, expect

def test_unified_packages_homepage(page: Page, base_url):
    """Verify that homepage renders only the 3 unified CAD packages and no currency switcher."""
    page.goto(base_url + "/#services")
    
    # Wait for package cards to hydrate
    page.wait_for_selector(".package-card")
    
    cards = page.locator(".package-card")
    expect(cards).to_have_count(3)
    
    # Verify titles
    titles = [cards.nth(i).locator("h3").text_content().strip() for i in range(3)]
    assert titles == ["Align", "Refine", "Visionary"]
    
    # Verify prices in CAD
    prices = [cards.nth(i).locator(".package-price").text_content().strip() for i in range(3)]
    assert prices == ["$168", "$402", "$627"]
    
    # Verify currency selector component is NOT present
    expect(page.locator("[data-component='currency-selector']")).to_have_count(0)
    expect(page.locator(".currency-dropdown")).to_have_count(0)

def test_unified_packages_booking_links(page: Page, base_url):
    """Verify that package cards expand and booking links do not contain Country:India query params."""
    page.goto(base_url + "/#services")
    page.wait_for_selector(".package-card")
    
    first_card = page.locator(".package-card").first
    first_card.click()
    
    # Verify expanded details
    details = first_card.locator(".package-details-expanded")
    expect(details).to_be_visible()
    
    # Verify booking link target
    booking_btn = details.locator("a.btn")
    href = booking_btn.get_attribute("href")
    assert "cal.com/styleplanit/establish" in href
    assert "Country:%India" not in href

def test_services_cad_pricing_only(page: Page, base_url):
    """Verify services page contains only CAD prices and no INR or rupee symbols."""
    page.goto(base_url + "/services")
    page.wait_for_selector(".service-card")
    
    # Ensure no INR or Rupee symbols exist in the DOM text
    body_text = page.locator("body").text_content()
    assert "₹" not in body_text
    assert "INR" not in body_text
    
    # Verify all service card prices start with '$'
    price_elements = page.locator(".service-price")
    count = price_elements.count()
    assert count > 0
    for i in range(count):
        price_text = price_elements.nth(i).text_content().strip()
        if price_text:
            assert "$" in price_text
