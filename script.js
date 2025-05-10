function confirmAge(isAdult) {
  if (isAdult) {
    document.getElementById('age-check-overlay').style.display = 'none';
    localStorage.setItem('ageConfirmed', 'true');
  } else {
    window.history.back();
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const confirmed = localStorage.getItem('ageConfirmed');
  if (confirmed === 'true') {
    document.getElementById('age-check-overlay').style.display = 'none';
  }
});
