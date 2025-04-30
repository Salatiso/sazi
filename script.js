function showAgeGroup(ageGroupId) {
  if (!ageGroupId) {
    console.error("No age group ID provided.");
    return;
  }

  // Hide all age groups
  const ageGroups = document.querySelectorAll('.age-group');
  ageGroups.forEach(group => {
    group.style.display = 'none';
    group.setAttribute('aria-hidden', 'true'); // Accessibility improvement
  });

  // Show the selected age group
  const selectedAgeGroup = document.getElementById(ageGroupId);
  if (selectedAgeGroup) {
    selectedAgeGroup.style.display = 'block';
    selectedAgeGroup.setAttribute('aria-hidden', 'false'); // Accessibility improvement
  } else {
    console.error(`Age group with ID '${ageGroupId}' not found.`);
  }

  // Optional: Update active state of buttons (for styling)
  const ageButtons = document.querySelectorAll('.age-buttons button');
  ageButtons.forEach(button => {
    button.classList.remove('active');
  });
  const button = document.querySelector(`button[data-age-group="${ageGroupId}"]`);
  if (button) {
    button.classList.add('active');
  } else {
    console.error(`Button corresponding to age group ID '${ageGroupId}' not found.`);
  }

  // Scroll to the top of the content area (optional)
  const content = document.querySelector('.content');
  if (content) {
    content.scrollTo(0, 0);
  }
}

// Show the 'home' section by default (or the first age group, or whatever you prefer)
if (document.getElementById('home')) {
  showAgeGroup('home');
} else {
  console.error("Default section 'home' not found.");
}
