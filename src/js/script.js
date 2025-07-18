fetch("data/events.json")
  .then((response) => response.json())
  .then((events) => {
    const eventList = document.getElementById("event-list");
    const now = new Date();

    const futureEvents = events
      .map((event) => ({
        ...event,
        dateObj: new Date(event.datetime),
      }))
      .filter((event) => event.dateObj > now)
      .sort((a, b) => a.dateObj - b.dateObj);

    if (futureEvents.length === 0) {
      eventList.innerHTML = "<p>🙁 Nenhum evento futuro programado.</p>";
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

      card.innerHTML = `
        <h2>${event.title}</h2>
        <p><strong>🗓️ Data e Hora:</strong> ${formattedDate}</p>
        <a class="button" href="${event.link}" target="_blank">🔗 Assistir à Live</a>
      `;

      eventList.appendChild(card);
    });
  })
  .catch((error) => {
    console.error("Erro ao carregar os eventos:", error);
    document.getElementById("event-list").innerHTML =
      "<p>Erro ao carregar eventos.</p>";
  });
