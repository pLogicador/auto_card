// Utility function to escape HTML special characters in strings (basic sanitization)
function escapeHtml(unsafe) {
  return unsafe.replace(/[&<"']/g, function (m) {
    return {
      "&": "&amp;",
      "<": "&lt;",
      '"': "&quot;",
      "'": "&#039;",
    }[m];
  });
}

// Function to extract YouTube video ID from a link
function getYouTubeVideoId(url) {
  // https://youtu.be/VIDEO_ID
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch) return shortMatch[1];

  // https://www.youtube.com/watch?v=VIDEO_ID
  const longMatch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (longMatch) return longMatch[1];

  // https://youtube.com/live/VIDEO_ID
  const liveMatch = url.match(/youtube\.com\/live\/([a-zA-Z0-9_-]{11})/);
  if (liveMatch) return liveMatch[1];

  return null; // Not a valid YouTube URL
}

// Load and display future events from the JSON file
fetch("data/events.json")
  .then((response) => response.json())
  .then((events) => {
    const eventList = document.getElementById("event-list");
    const now = new Date();

    // Process future events: add Date object, filter future, sort ascending by date
    const futureEvents = events
      .map((event) => ({
        ...event,
        dateObj: new Date(event.datetime),
      }))
      .filter((event) => event.dateObj > now)
      .sort((a, b) => a.dateObj - b.dateObj);

    if (futureEvents.length === 0) {
      eventList.innerHTML = `<p class="no-events">🙁 No upcoming events scheduled.</p>`;
      return;
    }

    futureEvents.forEach((event) => {
      const card = document.createElement("div");
      card.className = "card";

      const formattedDate = event.dateObj.toLocaleString("pt-BR", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        hour: "2-digit",
        minute: "2-digit",
      });

      const cleanLink = event.link.replace(/\s/g, "").replace(/\u200B/g, "");
      const safeTitle = escapeHtml(event.title);

      // Extract video ID and build thumbnail URL
      const videoId = getYouTubeVideoId(cleanLink);
      const thumbnailUrl = videoId
        ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
        : "";

      card.innerHTML = `
        <div class="thumbnail-container">
          <img
            class="thumbnail"
            src="${thumbnailUrl}"
            alt="Thumbnail da live ${safeTitle}"
            tabindex="0"
            role="button"
            onclick="window.open('${cleanLink}', '_blank')"
            onkeypress="if(event.key === 'Enter') window.open('${cleanLink}', '_blank')"
          />
        </div>
        <div class="card-header">
          <h2>${safeTitle}</h2>
          <span class="event-date">${formattedDate}</span>
        </div>
        <div class="card-footer">
          <a class="button" href="${cleanLink}" target="_blank" rel="noopener noreferrer">🔗 Assistir à Live</a>
        </div>
      `;

      eventList.appendChild(card);
    });
  })
  .catch((error) => {
    console.error("Error loading events:", error);
    document.getElementById("event-list").innerHTML =
      "<p class='error-message'>⚠️ Error loading events.</p>";
  });
