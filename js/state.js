export const LEVELS = {
  1: {
    nev: "1. szint: Kitérő vágány jelzőkkel (Könnyű)",
    csomopontok: {
      N_IN: { id: "N_IN", x: 60, y: 384, type: "entry" },
      N_SIG1: { id: "N_SIG1", x: 220, y: 384, type: "waypoint" },
      SW_1: {
        id: "SW_1",
        x: 340,
        y: 384,
        type: "switch",
        outgoingEdgeIds: ["E_SW1_UP", "E_SW1_DOWN"],
        activeEdgeIndex: 0
      },
      N_TOP_BEND: { id: "N_TOP_BEND", x: 480, y: 240, type: "waypoint" },
      N_BOT_BEND: { id: "N_BOT_BEND", x: 480, y: 528, type: "waypoint" },
      N_TOP_SIG: { id: "N_TOP_SIG", x: 500, y: 240, type: "waypoint" },
      N_BOT_SIG: { id: "N_BOT_SIG", x: 500, y: 528, type: "waypoint" },
      ST_RED: { id: "ST_RED", x: 920, y: 240, type: "station", color: "red", label: "1. Vágány (Piros)" },
      ST_BLUE: { id: "ST_BLUE", x: 920, y: 528, type: "station", color: "blue", label: "2. Vágány (Kék)" }
    },
    elek: {
      E_IN: { id: "E_IN", fromNodeId: "N_IN", toNodeId: "N_SIG1" },
      E_SIG1_SW1: {
        id: "E_SIG1_SW1",
        fromNodeId: "N_SIG1",
        toNodeId: "SW_1",
        signal: { id: "SIG_ENTRY", positionRatio: 0.2, state: "red" }
      },
      E_SW1_UP: { id: "E_SW1_UP", fromNodeId: "SW_1", toNodeId: "N_TOP_BEND" },
      E_SW1_DOWN: { id: "E_SW1_DOWN", fromNodeId: "SW_1", toNodeId: "N_BOT_BEND" },
      E_TOP_BEND_SIG: { id: "E_TOP_BEND_SIG", fromNodeId: "N_TOP_BEND", toNodeId: "N_TOP_SIG" },
      E_TOP_TRACK: {
        id: "E_TOP_TRACK",
        fromNodeId: "N_TOP_SIG",
        toNodeId: "ST_RED",
        signal: { id: "SIG_TOP", positionRatio: 0.15, state: "green" }
      },
      E_BOT_BEND_SIG: { id: "E_BOT_BEND_SIG", fromNodeId: "N_BOT_BEND", toNodeId: "N_BOT_SIG" },
      E_BOT_TRACK: {
        id: "E_BOT_TRACK",
        fromNodeId: "N_BOT_SIG",
        toNodeId: "ST_BLUE",
        signal: { id: "SIG_BOT", positionRatio: 0.15, state: "red" }
      }
    },
    menetrend: [
      { id: "T1", spawnTime: 1.0, color: "blue", speed: 52, startEdgeId: "E_IN" },
      { id: "T2", spawnTime: 10.0, color: "red", speed: 56, startEdgeId: "E_IN" },
      { id: "T3", spawnTime: 22.0, color: "blue", speed: 50, startEdgeId: "E_IN" },
      { id: "T4", spawnTime: 34.0, color: "red", speed: 60, startEdgeId: "E_IN" }
    ]
  },
  2: {
    nev: "2. szint: Rendező-pályaudvar (Közepes)",
    csomopontok: {
      N_IN1: { id: "N_IN1", x: 60, y: 280, type: "entry" },
      N_IN2: { id: "N_IN2", x: 60, y: 480, type: "entry" },
      SW_1: { id: "SW_1", x: 260, y: 280, type: "switch", outgoingEdgeIds: ["E_SW1_STRAIGHT", "E_SW1_CROSS"], activeEdgeIndex: 0 },
      SW_2: { id: "SW_2", x: 260, y: 480, type: "switch", outgoingEdgeIds: ["E_SW2_CROSS", "E_SW2_STRAIGHT"], activeEdgeIndex: 1 },
      N_CROSS_TOP: { id: "N_CROSS_TOP", x: 470, y: 280, type: "waypoint" },
      N_CROSS_BOT: { id: "N_CROSS_BOT", x: 470, y: 480, type: "waypoint" },
      SW_3: { id: "SW_3", x: 640, y: 280, type: "switch", outgoingEdgeIds: ["E_SW3_UP", "E_SW3_MID"], activeEdgeIndex: 0 },
      ST_RED: { id: "ST_RED", x: 920, y: 200, type: "station", color: "red", label: "1. Vágány (Piros)" },
      ST_GREEN: { id: "ST_GREEN", x: 920, y: 350, type: "station", color: "green", label: "2. Vágány (Zöld)" },
      ST_BLUE: { id: "ST_BLUE", x: 920, y: 480, type: "station", color: "blue", label: "3. Vágány (Kék)" }
    },
    elek: {
      E_IN1: { id: "E_IN1", fromNodeId: "N_IN1", toNodeId: "SW_1", signal: { id: "SIG_IN1", positionRatio: 0.6, state: "green" } },
      E_IN2: { id: "E_IN2", fromNodeId: "N_IN2", toNodeId: "SW_2", signal: { id: "SIG_IN2", positionRatio: 0.6, state: "red" } },
      E_SW1_STRAIGHT: { id: "E_SW1_STRAIGHT", fromNodeId: "SW_1", toNodeId: "N_CROSS_TOP" },
      E_SW1_CROSS: { id: "E_SW1_CROSS", fromNodeId: "SW_1", toNodeId: "N_CROSS_BOT" },
      E_SW2_STRAIGHT: { id: "E_SW2_STRAIGHT", fromNodeId: "SW_2", toNodeId: "N_CROSS_BOT" },
      E_SW2_CROSS: { id: "E_SW2_CROSS", fromNodeId: "SW_2", toNodeId: "N_CROSS_TOP" },
      E_TOP_TO_SW3: { id: "E_TOP_TO_SW3", fromNodeId: "N_CROSS_TOP", toNodeId: "SW_3", signal: { id: "SIG_MID_TOP", positionRatio: 0.4, state: "green" } },
      E_SW3_UP: { id: "E_SW3_UP", fromNodeId: "SW_3", toNodeId: "ST_RED" },
      E_SW3_MID: { id: "E_SW3_MID", fromNodeId: "SW_3", toNodeId: "ST_GREEN" },
      E_BOT_TO_ST_BLUE: { id: "E_BOT_TO_ST_BLUE", fromNodeId: "N_CROSS_BOT", toNodeId: "ST_BLUE", signal: { id: "SIG_MID_BOT", positionRatio: 0.5, state: "green" } }
    },
    menetrend: [
      { id: "T1", spawnTime: 1.0, color: "red", speed: 52, startEdgeId: "E_IN1" },
      { id: "T2", spawnTime: 7.0, color: "blue", speed: 56, startEdgeId: "E_IN2" },
      { id: "T3", spawnTime: 16.0, color: "green", speed: 48, startEdgeId: "E_IN1" },
      { id: "T4", spawnTime: 25.0, color: "blue", speed: 54, startEdgeId: "E_IN2" },
      { id: "T5", spawnTime: 36.0, color: "red", speed: 60, startEdgeId: "E_IN1" }
    ]
  },
  3: {
    nev: "3. szint: Fejpályaudvar (Nehéz)",
    csomopontok: {
      N_IN1: { id: "N_IN1", x: 60, y: 320, type: "entry" },
      N_IN2: { id: "N_IN2", x: 60, y: 550, type: "entry" },
      SW_1: { id: "SW_1", x: 270, y: 320, type: "switch", outgoingEdgeIds: ["E_SW1_TO_SW2", "E_SW1_TO_SW4"], activeEdgeIndex: 0 },
      SW_3: { id: "SW_3", x: 270, y: 550, type: "switch", outgoingEdgeIds: ["E_SW3_TO_SW2", "E_SW3_TO_SW4"], activeEdgeIndex: 1 },
      SW_2: { id: "SW_2", x: 480, y: 360, type: "switch", outgoingEdgeIds: ["E_SW2_TO_ST1", "E_SW2_TO_ST2"], activeEdgeIndex: 0 },
      SW_4: { id: "SW_4", x: 480, y: 510, type: "switch", outgoingEdgeIds: ["E_SW4_TO_ST3", "E_SW4_TO_ST4"], activeEdgeIndex: 1 },
      ST_RED: { id: "ST_RED", x: 920, y: 220, type: "station", color: "red", label: "1. Vágány (Piros)" },
      ST_YELLOW: { id: "ST_YELLOW", x: 920, y: 360, type: "station", color: "yellow", label: "2. Vágány (Sárga)" },
      ST_GREEN: { id: "ST_GREEN", x: 920, y: 510, type: "station", color: "green", label: "3. Vágány (Zöld)" },
      ST_BLUE: { id: "ST_BLUE", x: 920, y: 650, type: "station", color: "blue", label: "4. Vágány (Kék)" }
    },
    elek: {
      E_IN1: { id: "E_IN1", fromNodeId: "N_IN1", toNodeId: "SW_1", signal: { id: "SIG_IN1", positionRatio: 0.6, state: "green" } },
      E_IN2: { id: "E_IN2", fromNodeId: "N_IN2", toNodeId: "SW_3", signal: { id: "SIG_IN2", positionRatio: 0.6, state: "red" } },
      E_SW1_TO_SW2: { id: "E_SW1_TO_SW2", fromNodeId: "SW_1", toNodeId: "SW_2" },
      E_SW1_TO_SW4: { id: "E_SW1_TO_SW4", fromNodeId: "SW_1", toNodeId: "SW_4" },
      E_SW3_TO_SW2: { id: "E_SW3_TO_SW2", fromNodeId: "SW_3", toNodeId: "SW_2" },
      E_SW3_TO_SW4: { id: "E_SW3_TO_SW4", fromNodeId: "SW_3", toNodeId: "SW_4" },
      E_SW2_TO_ST1: { id: "E_SW2_TO_ST1", fromNodeId: "SW_2", toNodeId: "ST_RED", signal: { id: "SIG_ST1", positionRatio: 0.35, state: "green" } },
      E_SW2_TO_ST2: { id: "E_SW2_TO_ST2", fromNodeId: "SW_2", toNodeId: "ST_YELLOW" },
      E_SW4_TO_ST3: { id: "E_SW4_TO_ST3", fromNodeId: "SW_4", toNodeId: "ST_GREEN" },
      E_SW4_TO_ST4: { id: "E_SW4_TO_ST4", fromNodeId: "SW_4", toNodeId: "ST_BLUE", signal: { id: "SIG_ST4", positionRatio: 0.35, state: "green" } }
    },
    menetrend: [
      { id: "T1", spawnTime: 1.0, color: "red", speed: 52, startEdgeId: "E_IN1" },
      { id: "T2", spawnTime: 6.0, color: "blue", speed: 50, startEdgeId: "E_IN2" },
      { id: "T3", spawnTime: 14.0, color: "yellow", speed: 55, startEdgeId: "E_IN1" },
      { id: "T4", spawnTime: 22.0, color: "green", speed: 54, startEdgeId: "E_IN2" },
      { id: "T5", spawnTime: 31.0, color: "red", speed: 58, startEdgeId: "E_IN1" },
      { id: "T6", spawnTime: 40.0, color: "blue", speed: 56, startEdgeId: "E_IN2" }
    ]
  }
};

export function calcLength(nodes, edges)
{
  for (const id in edges)
  {
    const edge = edges[id];
    const from = nodes[edge.fromNodeId];
    const to = nodes[edge.toNodeId];
    edge.length = Math.hypot(to.x - from.x, to.y - from.y);
  }
}

export function startingState(levelId = 1, playerName = "")
{
  const template = LEVELS[levelId] || LEVELS[1];
  const nodes = JSON.parse(JSON.stringify(template.csomopontok));
  const edges = JSON.parse(JSON.stringify(template.elek));
  calcLength(nodes, edges);
  const trains = template.menetrend.map(item => ({
    id: item.id,
    color: item.color,
    speed: item.speed,
    spawnTime: item.spawnTime,
    startEdgeId: item.startEdgeId,
    currentEdgeId: null,
    distanceOnEdge: 0,
    x: 0,
    y: 0,
    rotation: 0,
    status: "pending",
    isBraked: false,
    isWarning: false
  }));

  return{
    levelId: Number(levelId),
    levelName: template.nev,
    playerName: playerName.trim(),
    elapsedTime: 0,
    isPaused: false,
    isGameOver: false,
    gameOverReason: null,
    isVictory: false,
    successCount: 0,
    errorCount: 0,
    totalTrainsCount: trains.length,
    nodes,
    edges,
    trains,
    crashLocation: null
  };
}

export function trainPosition(t, nodes, edges)
{
  const edge = edges[t.currentEdgeId];
  if (!edge) return { x: 0, y: 0, rotation: 0 };
  const from = nodes[edge.fromNodeId];
  const to = nodes[edge.toNodeId];
  let ratio = 0;
  if (edge.length > 0)
  {
    ratio = Math.min(Math.max(t.distanceOnEdge / edge.length, 0), 1);
  }
  return{
    x: from.x + ratio * (to.x - from.x),
    y: from.y + ratio * (to.y - from.y),
    rotation: Math.atan2(to.y - from.y, to.x - from.x)
  };
}

export function switched(state, switchId)
{
  const node = state.nodes[switchId];
  if (node?.type === "switch" && node.outgoingEdgeIds?.length > 0)
  {
    node.activeEdgeIndex = (node.activeEdgeIndex + 1) % node.outgoingEdgeIds.length;
    return true;
  }
  return false;
}

export function signal(state, signalId)
{
  for (const id in state.edges) {
    const edge = state.edges[id];
    if (edge.signal?.id === signalId)
    {
      edge.signal.state = edge.signal.state === "red" ? "green" : "red";
      return true;
    }
  }
  return false;
}

export function emergencyBrake(state, trainId) {
  const t = state.trains.find(item => item.id === trainId);
  if (t && ["moving", "stopped_signal"].includes(t.status))
  {
    t.isBraked = !t.isBraked;
    return true;
  }
  return false;
}

export function updateState(state, dt)
{
  if (state.isPaused || state.isGameOver || state.isVictory) return;
  state.elapsedTime += dt;
  for (let i = 0; i < state.trains.length; i++)
  {
    const t = state.trains[i];
    if (t.status === "pending" && state.elapsedTime >= t.spawnTime)
    {
      t.status = "moving";
      t.currentEdgeId = t.startEdgeId;
      t.distanceOnEdge = 0;
      Object.assign(t, trainPosition(t, state.nodes, state.edges));
    }
  }

  for (let i = 0; i < state.trains.length; i++) {
    const t = state.trains[i];
    if (!["moving", "stopped_signal"].includes(t.status) || t.isBraked) continue;

    const edge = state.edges[t.currentEdgeId];
    if (!edge) continue;

    let canMove = true;
    if (edge.signal?.state === "red") {
      const stopDist = (edge.length * edge.signal.positionRatio) - 18;
      if ((t.distanceOnEdge < stopDist && t.distanceOnEdge + t.speed * dt >= stopDist) || Math.abs(t.distanceOnEdge - stopDist) < 2) {
        t.distanceOnEdge = stopDist;
        t.status = "stopped_signal";
        canMove = false;
      }
    }

    if (canMove) {
      t.status = "moving";
      t.distanceOnEdge += t.speed * dt;

      if (t.distanceOnEdge >= edge.length) {
        const overflow = t.distanceOnEdge - edge.length;
        const targetNode = state.nodes[edge.toNodeId];

        if (targetNode.type === "station") {
          t.distanceOnEdge = edge.length;
          t.status = "arrived";
          if (t.color === targetNode.color) {
            state.successCount++;
          } else {
            state.errorCount++;
          }
        } else if (targetNode.type === "switch") {
          const nextEdgeId = targetNode.outgoingEdgeIds[targetNode.activeEdgeIndex];
          if (nextEdgeId && state.edges[nextEdgeId]) {
            t.currentEdgeId = nextEdgeId;
            t.distanceOnEdge = overflow;
          } else {
            t.status = "derailed";
            state.errorCount++;
          }
        } else if (targetNode.type === "waypoint") {
          let nextEdgeId = null;
          for (const eId in state.edges) {
            if (state.edges[eId].fromNodeId === targetNode.id) {
              nextEdgeId = eId;
              break;
            }
          }

          if (nextEdgeId) {
            t.currentEdgeId = nextEdgeId;
            t.distanceOnEdge = overflow;
          } else {
            t.status = "derailed";
            state.errorCount++;
          }
        }
      }
    }

    Object.assign(t, trainPosition(t, state.nodes, state.edges));
  }

  const activeTrains = [];
  for (let i = 0; i < state.trains.length; i++)
  {
    const t = state.trains[i];
    if (["moving", "stopped_signal"].includes(t.status))
    {
      t.isWarning = false;
      activeTrains.push(t);
    }
  }

  for (let i = 0; i < activeTrains.length; i++)
  {
    for (let j = i + 1; j < activeTrains.length; j++)
    {
      const v1 = activeTrains[i];
      const v2 = activeTrains[j];
      const dist = Math.hypot(v1.x - v2.x, v1.y - v2.y);

      if (dist <= 28)
      {
        state.isGameOver = true;
        state.gameOverReason = "utkozes";
        v1.status = "crashed";
        v2.status = "crashed";
        state.crashLocation = { x: (v1.x + v2.x) / 2, y: (v1.y + v2.y) / 2 };
        return;
      } 
      else if (dist <= 75)
      {
        v1.isWarning = true;
        v2.isWarning = true;
      }
    }
  }
  let finishedCount = 0;
  for (let i = 0; i < state.trains.length; i++)
  {
    const t = state.trains[i];
    if (t.status === "arrived" || t.status === "derailed")
    {
      finishedCount++;
    }
  }
  if (finishedCount === state.totalTrainsCount && !state.isGameOver)
  {
    state.isVictory = true;
  }
}


export function serializeState(state)
{
  return JSON.stringify(state);
}

export function deserializeState(jsonStr)
{
  try
  {
    const data = JSON.parse(jsonStr);
    if (!data?.nodes || !data?.edges || !data?.trains)
    {
      throw new Error("Invalid state shape");
    }
    calcLength(data.nodes, data.edges);
    return data;
  }
  catch (error)
  {
    throw new Error("Failed to load save: " + error.message);
  }
}