// js/services.js
$(document).ready(function(){
    // Tab switching
    $('.elegant-tabs li').on('click', function(){
        var tabId = $(this).data('tab');

        // Update active tab
        $('.elegant-tabs li').removeClass('active');
        $(this).addClass('active');

        // Show/hide service grids
        $('.services-grid').removeClass('active');
        $('#' + tabId).addClass('active');

        // Hide the details container
        $('#service-details').slideUp();
    });

    // Service card click event
    $('.service-card').on('click', function(){
        $('.service-card').removeClass('active');
        $(this).addClass('active');
        // Show the details container
        $('#service-details').slideUp();
        setTimeout(() => {
            // Get card content
            var title = $(this).find('h3').text();
            var description = $(this).find('p').text();
            var price = $(this).find('.price-tag').text();

            // Update the details container
            var detailsContent = `
                <h3>${title}</h3>
                <p>${description}</p>
                <span class="price-tag">${price}</span>
            `;
            $('#service-details').html(detailsContent);

            // Show the details container
            $('#service-details').slideDown();
        }, 300);
    });
});
