const PALETTE = {
  red: "#d40023",
  blue: "#1e00c5",
  green: "#00fa36",
  yellow: "#f7fc00"
};

export function timeFormat(seconds) {
  const total = Math.max(0, Math.floor(seconds));
  const m = String(Math.floor(total / 60)).padStart(2, "0");
  const s = String(total % 60).padStart(2, "0");
  return `${m}:${s}`;
}

export function signalPosition(edge, nodes) {
  if (!edge || !edge.signal)return null;
  const fromNode = nodes[edge.fromNodeId];
  const toNode = nodes[edge.toNodeId];
  const x = fromNode.x + edge.signal.positionRatio * (toNode.x - fromNode.x);
  const y = fromNode.y + edge.signal.positionRatio * (toNode.y - fromNode.y) - 26;
  return { x, y, id: edge.signal.id, state: edge.signal.state };
}

export function hud(state, dom) {
  if (!state || !dom) return;

  if (state.playerName) 
  {
    dom.playerName.textContent = state.playerName;
  } 
  else 
  {
    dom.playerName.textContent = "Diszpécser";
  }
  dom.levelName.textContent = state.levelName;
  dom.timer.textContent = timeFormat(state.elapsedTime);
  dom.trainCounter.textContent = `${state.successCount} / ${state.totalTrainsCount}`;
  dom.errorCounter.textContent = String(state.errorCount);
  if (state.isPaused)
  {
    dom.pauseBtn.textContent = "Folytatás";
  } 
  else 
  {
    dom.pauseBtn.textContent = "Szünet";
  }
}

export function canvas(ctx, canvasElem, state, pulseTime = 0) 
{
  if (!ctx || !canvasElem || !state) return;

  ctx.clearRect(0, 0, canvasElem.width, canvasElem.height);
  tracks(ctx, state);
  station(ctx, state);
  entry(ctx, state);
  signal(ctx, state);
  switchRender(ctx, state);
  train(ctx, state, pulseTime);
  if (state.crashLocation)
  {
    crash(ctx, state.crashLocation.x, state.crashLocation.y, pulseTime);
  }
}

function tracks(ctx, state) {
  for (const id in state.edges)
  {
    const edge = state.edges[id];
    const from = state.nodes[edge.fromNodeId];
    const to = state.nodes[edge.toNodeId];

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.strokeStyle = "#4a1d40";
    ctx.lineWidth = 12;
    ctx.lineCap = "round";
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.strokeStyle = "#ec4899";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.stroke();
    ctx.restore();
  }
}

function station(ctx, state)
{
  for (const id in state.nodes)
  {
    const node = state.nodes[id];
    if (node.type !== "station") continue;
    let color = "#ffffff";
    if (PALETTE[node.color])
    {
      color = PALETTE[node.color];
    }
    ctx.save();
    ctx.translate(node.x, node.y);
    ctx.beginPath();
    ctx.roundRect(-12, -32, 24, 64, 10);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = "#fdf2f8";
    ctx.font = "bold 13px 'Plus Jakarta Sans', sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(node.label || node.id, 20, 0);
    ctx.restore();
  }
}

function entry(ctx, state) 
{
  for (const id in state.nodes)
  {
    const node = state.nodes[id];
    if (node.type !== "entry") continue;
    ctx.save();
    ctx.fillStyle = "#f472b6";
    ctx.font = "bold 12px 'Plus Jakarta Sans', sans-serif";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.fillText("Belépő →", node.x - 10, node.y);
    ctx.restore();
  }
}

function switchRender(ctx, state)
{
  for (const id in state.nodes)
  {
    const node = state.nodes[id];
    if (node.type !== "switch") continue;
    const activeEdge = state.edges[node.outgoingEdgeIds[node.activeEdgeIndex]];
    let angle = 0;
    if (activeEdge)
    {
      const targetNode = state.nodes[activeEdge.toNodeId];
      angle = Math.atan2(targetNode.y - node.y, targetNode.x - node.x);
    }
    ctx.save();
    ctx.translate(node.x, node.y);
    ctx.fillStyle = "#2a1024";
    ctx.strokeStyle = "#ec4899";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect(-16, -16, 32, 32, 8);
    ctx.fill();
    ctx.stroke();
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(-8, 0);
    ctx.lineTo(10, 0);
    ctx.strokeStyle = "#fbbf24";
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(10, -5);
    ctx.lineTo(16, 0);
    ctx.lineTo(10, 5);
    ctx.fillStyle = "#fbbf24";
    ctx.fill();
    ctx.restore();
  }
}

function signal(ctx, state)
{
  for (const id in state.edges)
  {
    const edge = state.edges[id];
    if (!edge.signal) continue;
    const pos = signalPosition(edge, state.nodes);
    if (!pos) continue;
    ctx.save();
    ctx.translate(pos.x, pos.y);
    ctx.beginPath();
    ctx.moveTo(0, 10);
    ctx.lineTo(0, 24);
    ctx.strokeStyle = "#9d4c7d";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = "#180914";
    ctx.strokeStyle = "#f472b6";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(-22, -12, 44, 24, 12);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(-10, 0, 6, 0, Math.PI * 2);
    if (pos.state === "red")
    {
      ctx.fillStyle = "#f43f5e";
      ctx.shadowColor = "#f43f5e";
      ctx.shadowBlur = 10;
    } 
    else
    {
      ctx.fillStyle = "#450a0a";
    }
    ctx.fill();
    ctx.beginPath();
    ctx.arc(10, 0, 6, 0, Math.PI * 2);
    if (pos.state === "green")
    {
      ctx.fillStyle = "#10b981";
      ctx.shadowColor = "#10b981";
      ctx.shadowBlur = 10;
    } 
    else
    {
      ctx.fillStyle = "#064e3b";
    }
    ctx.fill();

    ctx.restore();
  }
}

function train(ctx, state, pulseTime)
{
  for (const t of state.trains)
  {
    if (!["moving", "stopped_signal", "derailed", "crashed"].includes(t.status)) continue;
    ctx.save();
    ctx.translate(t.x, t.y);
    ctx.save();
    ctx.rotate(t.rotation);
    ctx.beginPath();
    ctx.roundRect(-16, -10, 32, 20, 6);
    let color = "#ffffff";
    if (PALETTE[t.color])
    {
      color = PALETTE[t.color];
    }
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
    if (t.isBraked && t.status !== "crashed")
    {
      badge(ctx, 0, -26, "FÉK", "#fbbf24");
    } else if (t.status === "stopped_signal")
    {
      badge(ctx, 0, -26, "TILOS", "#f43f5e");
    } else if (t.status === "derailed")
    {
      badge(ctx, 0, -26, "KISIKLOTT", "#c084fc");
    }

    ctx.restore();
  }
}

function badge(ctx, x, y, text, color)
{
  ctx.save();
  ctx.font = "bold 10px 'Plus Jakarta Sans', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
  ctx.restore();
}

function crash(ctx, x, y, pulseTime)
{
  ctx.save();
  ctx.translate(x, y);
  ctx.beginPath();
  ctx.arc(0, 0, 35, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(244, 63, 94, 0.85)";
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.font = "bold 13px 'Plus Jakarta Sans', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("ÜTKÖZÉS!", 0, 0);
  ctx.restore();
}