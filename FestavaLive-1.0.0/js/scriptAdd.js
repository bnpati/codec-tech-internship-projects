const countdownDate = new Date("2027-03-22 10:50:10").getTime();

const daysSpan = document.getElementById("days");
const hoursSpan = document.getElementById("hours");
const minutesSpan = document.getElementById("minutes");
const secondsSpan = document.getElementById("seconds");
const liveMessage = document.getElementById("live-message11");

function updateCountdown() {
  const now = new Date().getTime();
  const distance = countdownDate - now;

  if (distance <= 0) {
    document.getElementById("countdown1").style.display = "none";
    liveMessage.style.display = "block";
    liveMessage.textContent = "We Are Live Now!";
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  daysSpan.textContent = String(days).padStart(2, "0");
  hoursSpan.textContent = String(hours).padStart(2, "0");
  minutesSpan.textContent = String(minutes).padStart(2, "0");
  secondsSpan.textContent = String(seconds).padStart(2, "0");
}

setInterval(updateCountdown, 1000);
