const setMessage = (countdown, msg) => {
  const message = countdown.querySelector(".message");
  message.textContent = msg;
};

const getRemainingTime = (time) => {
  const days = parseInt(time / (60 * 60 * 24), 10);
  const hours = parseInt((time / (60 * 60)) % 24, 10);
  const minutes = parseInt((time / 60) % 60, 10);
  const seconds = parseInt(time % 60, 10);

  return [days, hours, minutes, seconds];
};

const updateCounters = (countdown, remaining) => {
  const labels = countdown.querySelectorAll(".label");
  const counters = countdown.querySelectorAll(".count");
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
};

const embedVid = (container, beforeElement, youtube) => {
  const videoFrameContainer = document.createElement("div");
  const embed = document.createElement("iframe");
  const w = window.innerWidth;
  const attrs = {
    src: youtube,
    frameborder: 0,
    allowfullscreen: "",
  };

  attrs.width = w < 400 ? w : 400;
  attrs.height = (attrs.width * 3) / 4;
  Object.entries(attrs).map(([key, val]) => embed.setAttribute(key, val));

  videoFrameContainer.setAttribute("class", "vid-container");
  videoFrameContainer.appendChild(embed);

  container.insertBefore(videoFrameContainer, beforeElement);
};

const generateQueryString = (query) => {
  const queryString = new URLSearchParams(query);
  return queryString.toString();
};

const claudiaCountdown = () => {
  const container = document.querySelector(".countdown");
  const time = document.querySelector(".countdown time");
  const date = new Date(time.getAttribute("datetime"));

  const youtubeOptions = {
    autoplay: 0,
    color: "white",
    controls: 1,
  };
  const leavingYoutubeOptions = {
    ...youtubeOptions,
    end: 60,
  };
  const returningYoutubeOptions = {
    ...youtubeOptions,
    start: 35,
  };
  const extras = {
    leaving: {
      youtubeLink: `https://www.youtube.com/embed/s0SUEMGZU04?${generateQueryString(
        leavingYoutubeOptions
      )}`,
      messageBefore: "until Claudia leaves :(",
      messageAfter: "since Claudia left :(",
      messageDone: "that Claudia was gone, but now she's back! 🎊",
    },
    returning: {
      youtubeLink: `https://www.youtube.com/embed/vNey0PR46F4?${generateQueryString(
        returningYoutubeOptions
      )}`,
      messageBefore: "until Claudia returns... ⏳",
      messageAfter: "since Claudia came back! 🎉🎉",
      date: new Date("Mon Dec 26 2022 07:00:00 PDT"),
    },
  };

  // eslint-disable-next-line no-undef -- from page variable set within layout
  const action = claudiaAction;
  const data = extras[action];

  if (action === "leaving") {
    const tdeltaSeconds = parseInt((date - extras.returning.date) / 1000, 10);
    const secondsToDone = parseInt(
      (Date.now() - extras.returning.date) / 1000,
      10
    );
    const done = secondsToDone >= 0;
    if (done) {
      updateCounters(container, getRemainingTime(-tdeltaSeconds));
      setMessage(container, extras.leaving.messageDone);
      embedVid(container, time, extras.returning.youtubeLink);
      return;
    }
  }

  // Calculate number of seconds
  const tdeltaSecondsOriginal = parseInt((date - Date.now()) / 1000, 10);
  const direction = tdeltaSecondsOriginal > 0 ? -1 : 1;
  const message =
    tdeltaSecondsOriginal > 0 ? data.messageBefore : data.messageAfter;
  let tdeltaSeconds =
    tdeltaSecondsOriginal > 0 ? tdeltaSecondsOriginal : -tdeltaSecondsOriginal;

  updateCounters(container, getRemainingTime((tdeltaSeconds += direction)));
  setMessage(container, message);
  if (tdeltaSecondsOriginal <= 0) {
    embedVid(container, time, data.youtubeLink);
  }

  const timer = setInterval(() => {
    updateCounters(container, getRemainingTime((tdeltaSeconds += direction)));
    // on page when countdown reaches end datetime
    if (tdeltaSeconds === 0) {
      clearInterval(timer);
      embedVid(container, time, data.youtubeLink);
      setMessage(container, data.messageAfter);
    }
  }, 1000);
};

claudiaCountdown();
