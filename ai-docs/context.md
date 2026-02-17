# StylePlanIt Portfolio Website Project Context

This document provides a summary of the StylePlanIt website project for context continuity.

## 1. Project Overview

*   **Project:** A portfolio website for StylePlanIt, a premium personal styling consultancy in Toronto.
*   **Founders:** Deepesh and Ayushi.
*   **Mission:** To combine the immigrant experience with professional styling. The consultancy targets two main audiences:
    1.  Ambitious newcomers needing help to land jobs.
    2.  High-Net-Worth Individuals (HNIs) looking to manage their image.
*   **Hosting:** GitHub Pages.

## 2. Aesthetic & Design System

*   **Overall Aesthetic:** "Luxury Minimalist," "Old Money," "Editorial." The design emphasizes clean lines, sharp edges, and generous whitespace.
*   **Fonts:**
    *   **Headings (Serif):** 'Cormorant Garamond'
    *   **Body (Sans-Serif):** 'Montserrat'
*   **Color Palette (Updated Feb 2026):**
    *   **Primary Accent (Eucalyptus Green):** `#0c4524` (Used for buttons, links, highlights)
    *   **Accent Hover (Darker Green):** `#547c65`
    *   **Background (Lightest Green):** `#e6f0e7`
    *   **Headings (Rich Black):** `#0F0F0F`
    *   **Body Text (Soft Black):** `#2A2A2A`
    *   **White:** `#ffffff`
*   **Styling:**
    *   **Buttons:** Generally have a 200px border-radius, giving them a pill shape. The subscribe button is an exception with a 0px border-radius.
    *   **Section Padding:** Sections have a vertical padding of 75px.
    *   **Services Page:** The services page features an elegant tab bar and interactive service cards that expand to show details.

## 3. Tech Stack & File Structure

*   **Frameworks:** jQuery is used for DOM manipulation and event handling. The project is built with HTML5, CSS3, and JavaScript.
*   **File Structure:**
    *   `index.html`: The main homepage.
    *   `styles/styles.css`: All styles for the project.
    *   `js/utils.js`: Central utility object (`Utils`) for shared logic like robust CSV parsing and configuration application.
    *   `js/app.js`: Main application object (`App`) containing logic for navigation, hero slideshows, and dynamic service loading.
    *   `js/loader.js`: Coordinates component loading, application initialization, and configuration application in the correct sequence.
    *   `components/header.html`: The common navigation bar component.
    *   `components/footer.html`: The common footer component.
    *   `services.html`: A dedicated page for the detailed service menu.
    *   `configs/config.csv`: A CSV file to store all the configurable text and links.
    *   `configs/services.csv`: A CSV file to store the data for the services.
    *   `wireframes/`: Folder containing the design wireframes.
    *   `ai-docs/context.md`: This file.

## 4. Configuration

The website content is managed through CSV files to allow for easy updates without modifying the HTML.

*   `configs/config.csv`: This file contains key-value pairs for all the text and links used in the website.
*   `js/csv-reader.js`: This script reads the `configs/config.csv` file and populates the content of the HTML elements that have `text-config-key`, `href-config-key`, or `placeholder-config-key` attributes.
*   `configs/services.csv`: This file contains the data for the services offered, including category, title, description, image URL, and price.
*   **CSV Parsing:** `js/services.js` uses a robust parser that correctly handles quoted fields containing commas, which is essential for descriptions in the service menu. `js/csv-reader.js` uses a simpler parser optimized for the 2-column key-value structure of `config.csv`.

## 5. Content & Service Menu

The consultancy offers a range of services tailored to different audiences. The services are dynamically loaded from `configs/services.csv`. The `js/services.js` script handles:
1.  **Dynamic Tab Generation:** Groups services by their `category` and creates navigation tabs.
2.  **Service Grid Generation:** Creates a grid of service cards for each category.
3.  **Interactive Cards:** Clicking a card expands it into a detailed view within the `#service-details` container.

## 6. Homepage Sections

The `index.html` page is structured into the following key sections:

*   **Hero Section:** A full-width banner with a height of 70vh. It features a static three-image layout with a grayscale filter and a content box with the main heading. The primary call-to-action button ("Discover Yours.") links directly to a Calendly booking page.
*   **"How It Works" Section:** A three-step guide for clients:
    1.  **Checkout our services:** Displays cards for "Newcomers" and "Professionals & HNI," which link to the `services.html` page. The service cards have a 200px border-radius.
    2.  **Book a call with us:** A direct link to a Calendly booking page.
    3.  **Start the program you deserve:** The final step in the process.
*   **Logo Band:** A section to display logos of companies worked with or featured in. The logos are populated from `config.csv`.
*   **Reviews Section:** A grid of client testimonials. The grid is scrollable to accommodate a large number of reviews. The reviews are populated from `config.csv`.
*   **"Be an ICON" (HNI) Section:** A section with a dark green background dedicated to the high-net-worth "Icon Service." It includes a brief description and a "Request Access" button linking to Calendly.
*   **Subscribe Section:** A simple form for users to subscribe to a newsletter.
*   **Footer:** Contains a large "Style Plan It." banner (9rem font size), social media icons, and copyright information. All content is populated from `config.csv`.

