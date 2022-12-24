(function claudiaCountdown() {
  const countdown = document.querySelector(".countdown time");
  const date = new Date(countdown.getAttribute("datetime"));
  let days;
  let hours;
  let minutes;
  let seconds;

  // Calculate number of seconds
  let tdeltaSeconds = parseInt((date - Date.now()) / 1000, 10);

  function setMessage(msg) {
    document.querySelector(".message").textContent = msg;
  }

  function getRemainingTime(time) {
    days = parseInt(time / (60 * 60 * 24), 10);
    hours = parseInt((time / (60 * 60)) % 24, 10);
    minutes = parseInt((time / 60) % 60, 10);
    seconds = parseInt(time % 60, 10);

    return [days, hours, minutes, seconds];
  }

  function updateCounters(remaining) {
    const labels = document.querySelectorAll(".label");
    const counters = document.querySelectorAll(".count");
    const units = ["day", "hour", "minute", "second"];

    for (let i = 0; i < counters.length; i += 1) {
      const el = counters[i];
      const count = remaining[i];
      const label = labels[i];
      const unit = units[i];

      // Zero-pad values below 10
      el.textContent = count < 10 ? `0${count}` : count;
      label.textContent = count === 1 ? unit : `${unit}s`;
    }
  }

  function embedVid() {
    const container = document.querySelector(".countdown");
    const frameContainer = document.createElement("div");
    const embed = document.createElement("iframe");
    const w = window.innerWidth;
    const attrs = {
      src: "https://www.youtube.com/embed/s0SUEMGZU04?autoplay=1&color=white&showinfo=0&rel=0&end=60",
      frameborder: 0,
      allowfullscreen: "",
    };

    attrs.width = w < 400 ? w : 400;
    attrs.height = (attrs.width * 3) / 4;
    Object.entries(attrs).map(([key, val]) => embed.setAttribute(key, val));

    frameContainer.setAttribute("class", "vid-container");
    frameContainer.appendChild(embed);

    container.insertBefore(frameContainer, countdown);
  }

  if (tdeltaSeconds > 0) {
    // Initialize to show values immediately
    updateCounters(getRemainingTime((tdeltaSeconds -= 1)));
    setMessage("until Claudia leaves :(");

    const timer = setInterval(() => {
      updateCounters(getRemainingTime((tdeltaSeconds -= 1)));
      if (tdeltaSeconds <= 0) {
        clearInterval(timer);
        embedVid();
      }
    }, 1000);
  } else {
    tdeltaSeconds = -tdeltaSeconds;
    updateCounters(getRemainingTime((tdeltaSeconds += 1)));
    setMessage("since Claudia left :(");
    setInterval(() => {
      updateCounters(getRemainingTime((tdeltaSeconds += 1)));
    }, 1000);
    embedVid();
  }
})();
