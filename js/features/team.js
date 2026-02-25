/**
 * team.js - Team profile rendering logic
 */
const TeamFeature = {
  init: async function () {
    const team = await Data.fetch("team");
    const container = $("#team-container");
    if (container.length === 0) return;
    
    if (!team || team.length === 0) {
      container.html('<p class="text-center">Team details coming soon.</p>');
      return;
    }

    container.empty();
    team.forEach((person, index) => {
      const isEven = index % 2 === 0;
      const alignmentClass = isEven ? "image-left" : "image-right";
      
      container.append(`
                <div class="profile-card ${alignmentClass}">
                    <div class="profile-image">
                        <img src="${person.imageUrl}" alt="${person.name}">
                    </div>
                    <div class="profile-text">
                        <h3>${person.name}</h3>
                        <span class="role">${person.role}</span>
                        <p class="bio">${person.bio}</p>
                    </div>
                </div>
            `);
    });
  }
};
