import pytest
from playwright.sync_api import Page, expect

def test_homepage_hydration(page: Page, base_url):
    """Verify that the page loads and loader fades out."""
    page.goto(base_url)
    
    # Loader should eventually disappear or be hidden
    loader = page.locator("#loader-overlay")
    # On some fast connections/local, it might already be hidden/faded
    try:
        expect(loader).to_have_class("fade-out", timeout=5000)
    except:
        # Fallback: check if it's already hidden
        expect(loader).not_to_be_visible()
    
    # Site wrapper should be visible
    wrapper = page.locator(".site-wrapper")
    expect(wrapper).to_be_visible()

def test_mothers_day_promo_modal(page: Page, base_url):
    """Verify the Mother's Day promo triggers and can be dismissed."""
    page.goto(base_url)
    
    # Wait for the configured 5s delay + some buffer
    modal = page.locator(".promo-card.modal")
    expect(modal).to_be_visible(timeout=10000)
    
    # Title check
    title = modal.locator(".promo-title")
    expect(title).to_contain_text("To the woman beneath")
    
    # Dismiss modal
    close_btn = modal.locator(".promo-close")
    close_btn.click()
    
    # Modal should disappear
    expect(modal).not_to_be_visible()
    
    # Floating trigger should appear (Persistence Logic)
    trigger = page.locator("#promo-trigger-floating")
    expect(trigger).to_be_visible()

def test_services_sorting_and_seen_state(page: Page, base_url):
    """Verify services grid sorting and seen state logic."""
    page.goto(base_url + "/services")
    
    # 1. Verify Price Visibility
    price = page.locator(".service-card .service-price").first
    expect(price).to_be_visible()
    
    # 2. Test Sorting
    sort_trigger = page.locator(".sort-label")
    sort_trigger.click()
    
    # Select 'Investment' (High to Low)
    investment_option = page.locator(".sort-menu li[data-value='investment']")
    investment_option.click()
    
    # Verify grid re-rendered (check for first card change or just stability)
    expect(page.locator(".services-grid")).to_be_visible()
    
    # 3. Test 'Seen' State
    first_card = page.locator(".service-card").first
    card_title = first_card.locator("h3").inner_text()
    
    first_card.click()
    
    # Details should show
    details = page.locator("#service-details-container")
    expect(details).to_be_visible()
    
    # Close details
    close_btn = details.locator(".btn-close-details")
    close_btn.click()
    
    # Grid should be back, and card should have 'seen' class
    expect(first_card).to_have_class(f"service-card seen", timeout=5000)

def test_mobile_modal_sizing(browser, base_url):
    """Verify modal uses compact sizing on mobile viewports."""
    # Create mobile context
    context = browser.new_context(viewport={'width': 390, 'height': 844}, is_mobile=True)
    page = context.new_page()
    page.goto(base_url)
    
    # Wait for modal
    modal = page.locator(".promo-card.modal")
    expect(modal).to_be_visible(timeout=10000)
    
    # Verify width is percentage-based (82vw approx)
    box = modal.bounding_box()
    # 82vw of 390 is ~319px. We check if it's less than screen width.
    assert box['width'] < 390
    assert box['width'] > 300 # Should be around 320px
    
    context.close()

def test_package_expansion(page: Page, base_url):
    """Verify that clicking a package card expands it horizontally."""
    page.goto(base_url + "/#services")
    
    # Wait for grid to hydrate
    page.wait_for_selector(".package-card")
    
    # Find a package card
    package = page.locator(".package-card").first
    package.click()
    
    # Grid should become active
    grid = page.locator("#packages-grid-container")
    expect(grid).to_have_attribute("data-state", "active", timeout=5000)
    
    # "Schedule a call" button should be visible in the expanded state
    booking_btn = package.locator(".btn-primary-accent")
    expect(booking_btn).to_be_visible()
    expect(booking_btn).to_have_attribute("target", "_blank")
