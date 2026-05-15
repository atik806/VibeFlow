const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const statusValue = document.getElementById("statusValue");
const fpsValue = document.getElementById("fpsValue");
const infValue = document.getElementById("infValue");
const objValue = document.getElementById("objValue");
const objectList = document.getElementById("objectList");
const profileSelect = document.getElementById("profileSelect");

async function callApi(url, method = "GET") {
  const response = await fetch(url, { method });
  if (!response.ok) {
    let message = "Request failed";
    try {
      const data = await response.json();
      message = data.detail || message;
    } catch (_) {
      // Ignore invalid JSON.
    }
    throw new Error(message);
  }
  return response.json();
}

function renderStats(stats) {
  statusValue.textContent = stats.running ? "Running" : "Paused";
  fpsValue.textContent = Number(stats.fps || 0).toFixed(2);
  infValue.textContent = `${Number(stats.inference_ms || 0).toFixed(2)} ms`;
  objValue.textContent = stats.total_objects ?? 0;
  if (stats.profile && profileSelect.value !== stats.profile) {
    profileSelect.value = stats.profile;
  }

  objectList.innerHTML = "";
  if (!stats.objects || stats.objects.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.textContent = "No objects detected";
    objectList.appendChild(emptyItem);
    return;
  }

  stats.objects.forEach((item) => {
    const row = document.createElement("li");
    row.textContent = `${item.label}: ${item.count}`;
    objectList.appendChild(row);
  });
}

async function updateStats() {
  try {
    const stats = await callApi("/stats");
    renderStats(stats);
    startBtn.disabled = stats.running;
    stopBtn.disabled = !stats.running;
  } catch (error) {
    statusValue.textContent = `Error: ${error.message}`;
  }
}

startBtn.addEventListener("click", async () => {
  try {
    await callApi("/start", "POST");
    await updateStats();
  } catch (error) {
    alert(`Failed to start detection: ${error.message}`);
  }
});

stopBtn.addEventListener("click", async () => {
  try {
    await callApi("/stop", "POST");
    await updateStats();
  } catch (error) {
    alert(`Failed to stop detection: ${error.message}`);
  }
});

profileSelect.addEventListener("change", async () => {
  const profile = encodeURIComponent(profileSelect.value);
  try {
    await callApi(`/profile?profile=${profile}`, "POST");
    await updateStats();
  } catch (error) {
    alert(`Failed to change mode: ${error.message}`);
  }
});

setInterval(updateStats, 1000);
updateStats();
