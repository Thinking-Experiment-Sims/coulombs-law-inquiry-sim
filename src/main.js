const K = 8.9875517923e9;
const G = 9.81;
const E_CHARGE = 1.602176634e-19;
const STORAGE_KEY_THEME = "coulomb-inquiry-theme";
const STORAGE_KEY_ACTIVITY = "coulomb-inquiry-activity";
const STORAGE_KEY_PRESET = "coulomb-inquiry-preset";

const $ = (id) => document.getElementById(id);

const canvas = $("simCanvas");
const studentHelpBtn = $("studentHelpBtn");
const teacherGuideBtn = $("teacherGuideBtn");
const teacherGuideDialog = $("teacherGuideDialog");
const studentHelpDialog = $("studentHelpDialog");
const closeTeacherGuideBtn = $("closeTeacherGuideBtn");
const closeStudentHelpBtn = $("closeStudentHelpBtn");
const themeToggleBtn = $("themeToggleBtn");
const activityMode = $("activityMode");
const presetSelect = $("presetSelect");
const targetSelect = $("targetSelect");
const massInput = $("massInput");
const massValue = $("massValue");
const stringLengthWrap = $("stringLengthWrap");
const stringLengthInput = $("stringLengthInput");
const stringLengthValue = $("stringLengthValue");
const statusLine = $("statusLine");
const presetPrompt = $("presetPrompt");
const sceneCaption = $("sceneCaption");
const formulaLine = $("formulaLine");
const showVectors = $("showVectors");
const showComponents = $("showComponents");
const randomizeBtn = $("randomizeBtn");
const resetBtn = $("resetBtn");
const practicePrompt = $("practicePrompt");
const questionGrid = $("questionGrid");
const checkAnswersBtn = $("checkAnswersBtn");
const feedbackLine = $("feedbackLine");
const metricGrid = $("metricGrid");
const forceTableBody = $("forceTableBody");
const arenaPrompt = $("arenaPrompt");
const teacherNote = $("teacherNote");

const chargeControls = [
  { input: $("qA"), output: $("qAValue"), label: $("qALabel"), wrap: $("qA").closest("label") },
  { input: $("qB"), output: $("qBValue"), label: $("qBLabel"), wrap: $("qB").closest("label") },
  { input: $("qC"), output: $("qCValue"), label: $("qCLabel"), wrap: $("qCWrap") },
];

const ctx = canvas.getContext("2d");

const PRESET_ORDER = ["pair", "line", "triangle", "fission", "equilibrium"];

const PRESETS = {
  pair: {
    title: "Two-Charge Force Lab",
    shortTitle: "Two Charges",
    prompt:
      "Start with just two charges. Have students flip a sign, double a charge, or drag one charge farther away before they look at the numeric readout.",
    description:
      "A simple two-charge sandbox for attraction, repulsion, and the inverse-square relationship.",
    formulaNote: "Compare sign logic with magnitude logic: first decide attract or repel, then use F = k|q1q2| / r^2.",
    teacherUse:
      "Matches the sign-and-distance ideas in the notes and works well as a warm-up before superposition.",
    docRef: "Notes I.1-I.4 and homework Part I #2, #8, #9.",
    chargeUnitLabel: "microcoulombs",
    chargeUnitShort: "uC",
    chargeScale: 1e-6,
    chargeRange: { min: -8, max: 8, step: 0.1 },
    distanceDisplay: { factor: 1, label: "m", digits: 2 },
    world: { minX: -2.8, maxX: 2.8, minY: -2.2, maxY: 2.2 },
    charges: [
      { id: "A", label: "A", value: 4.5, x: -1.65, y: 0.8, axis: "xy" },
      { id: "B", label: "B", value: -3.0, x: 1.4, y: -0.55, axis: "xy" },
    ],
    targetIndex: 1,
    massG: 1.2,
    stringLengthCm: 40,
    softening: 0.16,
  },
  line: {
    title: "Three Charges on a Line",
    shortTitle: "Three on a Line",
    prompt:
      "Use this setup for superposition on the x-axis. Ask which contribution is larger before students look at the table, then justify the sign of each force separately.",
    description:
      "Three collinear charges for direct vector addition and superposition on one axis.",
    formulaNote:
      "This mirrors the standard line problem: calculate each force on the target separately, assign left/right direction, then add algebraically.",
    teacherUse:
      "A direct classroom bridge to collinear three-charge problems and sign bookkeeping.",
    docRef: "Homework Part I #4 and notes on the Principle of Superposition.",
    chargeUnitLabel: "millicoulombs",
    chargeUnitShort: "mC",
    chargeScale: 1e-3,
    chargeRange: { min: -10, max: 10, step: 0.1 },
    distanceDisplay: { factor: 1, label: "m", digits: 2 },
    world: { minX: -4.3, maxX: 4.3, minY: -2.2, maxY: 2.2 },
    charges: [
      { id: "A", label: "A", value: 6.0, x: -2.7, y: 0, axis: "x" },
      { id: "B", label: "B", value: 5.0, x: 0, y: 0, axis: "x" },
      { id: "C", label: "C", value: -4.0, x: 2.0, y: 0, axis: "x" },
    ],
    targetIndex: 1,
    massG: 0.8,
    stringLengthCm: 40,
    softening: 0.2,
  },
  triangle: {
    title: "2D Triangle Components",
    shortTitle: "2D Triangle",
    prompt:
      "This is the vector-components setup. Predict the quadrant of the net force first, then check Fx and Fy after dragging or changing the charge values.",
    description:
      "A two-dimensional three-charge setup for component reasoning and net-force direction.",
    formulaNote:
      "Use components here: find each contribution, add Fx and Fy separately, then reconstruct the net with the vector readout.",
    teacherUse:
      "Use it when students move from one-dimensional superposition to two-dimensional component problems.",
    docRef: "Notes Coulomb practice #3 and homework Part I #5.",
    chargeUnitLabel: "nanocoulombs",
    chargeUnitShort: "nC",
    chargeScale: 1e-9,
    chargeRange: { min: -9, max: 9, step: 0.1 },
    distanceDisplay: { factor: 1, label: "m", digits: 2 },
    world: { minX: -1.0, maxX: 5.4, minY: -4.5, maxY: 1.8 },
    charges: [
      { id: "A", label: "A", value: 6.0, x: 0, y: 0, axis: "xy" },
      { id: "B", label: "B", value: -2.0, x: 4.0, y: 0, axis: "xy" },
      { id: "C", label: "C", value: 5.0, x: 4.0, y: -3.0, axis: "xy" },
    ],
    targetIndex: 2,
    massG: 0.2,
    stringLengthCm: 40,
    softening: 0.18,
  },
  fission: {
    title: "U-235 Fission Scale Demo",
    shortTitle: "U-235 Fission",
    prompt:
      "Use this preset to show why tiny separations matter so much. It mirrors the uranium split problem and makes the inverse-square dependence impossible to ignore.",
    description:
      "A tiny-distance Coulomb force demo inspired by the split-nucleus homework problem.",
    formulaNote:
      "Same equation, wildly different scale. The separation is in femtometers, so the force becomes enormous even with only 46 protons per fragment.",
    teacherUse:
      "Useful as the extreme small-r context after students think the equation only matters for classroom-scale charges.",
    docRef: "Homework Part I #1.",
    chargeUnitLabel: "elementary charges",
    chargeUnitShort: "e",
    chargeScale: E_CHARGE,
    chargeRange: { min: 1, max: 92, step: 1 },
    distanceDisplay: { factor: 1e15, label: "fm", digits: 2 },
    world: { minX: -1.7e-14, maxX: 1.7e-14, minY: -8.5e-15, maxY: 8.5e-15 },
    charges: [
      { id: "A", label: "A", value: 46, x: -5.9e-15, y: 0, axis: "x" },
      { id: "B", label: "B", value: 46, x: 5.9e-15, y: 0, axis: "x" },
    ],
    targetIndex: 1,
    massG: 0.2,
    stringLengthCm: 40,
    softening: 2.2e-15,
    fragmentRadiusM: 5.9e-15,
  },
  equilibrium: {
    title: "Suspended-Spheres Equilibrium Bridge",
    shortTitle: "Equilibrium Bridge",
    prompt:
      "This preset turns Coulomb force into a force-balance problem. Ask students to use the horizontal electric force together with mg to reason toward the string angle.",
    description:
      "A pair-force setup with a force-balance readout for hanging-sphere and pendulum-style equilibrium questions.",
    formulaNote:
      "Here the electric force is the horizontal partner in equilibrium: tan(theta) = |Fe| / (mg).",
  teacherUse:
      "Use this as the bridge to suspended-sphere, pendulum, and equilibrium-angle homework problems.",
    docRef: "Homework Part I #7, #10, #11 and the notes Equilibrium section.",
    chargeUnitLabel: "microcoulombs",
    chargeUnitShort: "uC",
    chargeScale: 1e-6,
    chargeRange: { min: -12, max: 12, step: 0.1 },
    distanceDisplay: { factor: 100, label: "cm", digits: 1 },
    world: { minX: -0.45, maxX: 0.45, minY: -0.22, maxY: 0.22 },
    charges: [
      { id: "A", label: "A", value: 5.0, x: -0.12, y: 0, axis: "x" },
      { id: "B", label: "B", value: 5.0, x: 0.12, y: 0, axis: "x" },
    ],
    targetIndex: 1,
    massG: 0.2,
    stringLengthCm: 30,
    softening: 0.015,
  },
};

const state = {
  theme: "dark",
  activity: "inquiry",
  presetKey: "pair",
  charges: [],
  defaultCharges: [],
  targetIndex: 0,
  massG: 1.0,
  stringLengthCm: 40,
  practiceQuestions: [],
  practiceAnswers: {},
  practiceRevealed: true,
  feedback: "",
  dragIndex: null,
  hoverIndex: null,
  pointerId: null,
};

init();

function init() {
  populatePresetOptions();

  state.theme = localStorage.getItem(STORAGE_KEY_THEME) || "dark";
  state.activity = localStorage.getItem(STORAGE_KEY_ACTIVITY) || "inquiry";
  state.presetKey = localStorage.getItem(STORAGE_KEY_PRESET) || "pair";

  activityMode.value = state.activity;
  showVectors.checked = true;
  showComponents.checked = true;

  applyTheme(state.theme);
  loadPreset(state.presetKey);
  setActivity(state.activity, { rerender: false });

  studentHelpBtn.addEventListener("click", () => openDialog(studentHelpDialog));
  teacherGuideBtn.addEventListener("click", () => openDialog(teacherGuideDialog));
  closeTeacherGuideBtn.addEventListener("click", () => closeDialog(teacherGuideDialog));
  closeStudentHelpBtn.addEventListener("click", () => closeDialog(studentHelpDialog));
  themeToggleBtn.addEventListener("click", toggleTheme);
  activityMode.addEventListener("change", () => setActivity(activityMode.value));
  presetSelect.addEventListener("change", () => loadPreset(presetSelect.value));
  targetSelect.addEventListener("change", () => {
    state.targetIndex = Number(targetSelect.value);
    onStateChanged();
  });

  massInput.addEventListener("input", () => {
    state.massG = Number(massInput.value);
    massValue.value = formatFixed(state.massG, 1);
    onStateChanged();
  });

  stringLengthInput.addEventListener("input", () => {
    state.stringLengthCm = Number(stringLengthInput.value);
    stringLengthValue.value = String(Math.round(state.stringLengthCm));
    onStateChanged();
  });

  chargeControls.forEach((control, index) => {
    control.input.addEventListener("input", () => {
      if (!state.charges[index]) return;
      state.charges[index].value = Number(control.input.value);
      control.output.value = formatChargeControlValue(state.charges[index].value, getPreset());
      onStateChanged();
    });
  });

  showVectors.addEventListener("change", renderAll);
  showComponents.addEventListener("change", renderAll);
  randomizeBtn.addEventListener("click", randomizeScene);
  resetBtn.addEventListener("click", () => loadPreset(state.presetKey));
  checkAnswersBtn.addEventListener("click", checkPracticeAnswers);

  canvas.addEventListener("pointerdown", handlePointerDown);
  canvas.addEventListener("pointermove", handlePointerMove);
  canvas.addEventListener("pointerleave", () => {
    state.hoverIndex = null;
    if (state.dragIndex === null) {
      renderAll();
    }
  });
  canvas.addEventListener("pointerup", handlePointerUp);
  canvas.addEventListener("pointercancel", handlePointerUp);

  window.addEventListener("resize", renderAll);
  teacherGuideDialog.addEventListener("click", (event) => handleDialogBackdrop(event, teacherGuideDialog));
  studentHelpDialog.addEventListener("click", (event) => handleDialogBackdrop(event, studentHelpDialog));

  renderAll();
}

function populatePresetOptions() {
  presetSelect.textContent = "";

  PRESET_ORDER.forEach((key) => {
    const preset = PRESETS[key];
    const option = document.createElement("option");
    option.value = key;
    option.textContent = preset.title;
    presetSelect.append(option);
  });
}

function loadPreset(key) {
  const preset = PRESETS[key];
  if (!preset) return;

  state.presetKey = key;
  state.charges = preset.charges.map((charge) => ({ ...charge }));
  state.defaultCharges = preset.charges.map((charge) => ({ ...charge }));
  state.targetIndex = Math.min(preset.targetIndex, state.charges.length - 1);
  state.massG = preset.massG;
  state.stringLengthCm = preset.stringLengthCm;
  state.practiceAnswers = {};
  state.feedback = "";
  state.practiceRevealed = state.activity !== "practice";

  localStorage.setItem(STORAGE_KEY_PRESET, key);
  presetSelect.value = key;

  syncControlsFromState();
  regeneratePractice();
  renderAll();
}

function setActivity(mode, { rerender = true } = {}) {
  state.activity = mode;
  localStorage.setItem(STORAGE_KEY_ACTIVITY, mode);
  document.body.classList.toggle("practice-mode", mode === "practice");
  state.practiceRevealed = mode !== "practice";
  state.practiceAnswers = {};
  state.feedback = "";

  if (rerender) {
    regeneratePractice();
    renderAll();
  }
}

function applyTheme(theme) {
  state.theme = theme;
  document.body.dataset.theme = theme;
  themeToggleBtn.textContent = theme === "light" ? "Dark mode" : "Light mode";
  localStorage.setItem(STORAGE_KEY_THEME, theme);
}

function toggleTheme() {
  const next = state.theme === "light" ? "dark" : "light";
  applyTheme(next);
  renderAll();
}

function getPreset() {
  return PRESETS[state.presetKey];
}

function syncControlsFromState() {
  const preset = getPreset();

  activityMode.value = state.activity;
  presetSelect.value = state.presetKey;
  massInput.value = String(state.massG);
  massValue.value = formatFixed(state.massG, 1);

  stringLengthInput.value = String(state.stringLengthCm);
  stringLengthValue.value = String(Math.round(state.stringLengthCm));
  stringLengthWrap.classList.toggle("is-hidden", preset !== PRESETS.equilibrium);

  chargeControls.forEach((control, index) => {
    const charge = state.charges[index];
    const isVisible = Boolean(charge);
    control.wrap.classList.toggle("is-hidden", !isVisible);
    if (!isVisible) return;

    control.label.textContent = `Charge ${charge.label} (${preset.chargeUnitShort})`;
    control.input.min = String(preset.chargeRange.min);
    control.input.max = String(preset.chargeRange.max);
    control.input.step = String(preset.chargeRange.step);
    control.input.value = String(charge.value);
    control.output.value = formatChargeControlValue(charge.value, preset);
  });

  targetSelect.textContent = "";
  state.charges.forEach((charge, index) => {
    const option = document.createElement("option");
    option.value = String(index);
    option.textContent = `Charge ${charge.label}`;
    targetSelect.append(option);
  });
  targetSelect.value = String(state.targetIndex);

}

function onStateChanged() {
  state.practiceRevealed = state.activity !== "practice";
  state.practiceAnswers = {};
  state.feedback = "";
  syncControlsFromState();
  regeneratePractice();
  renderAll();
}

function regeneratePractice() {
  const analysis = computeAnalysis();
  state.practiceQuestions = buildPracticeQuestions(analysis);
  renderPracticeQuestions();
}

function buildPracticeQuestions(analysis) {
  if (!analysis) return [];

  const primary = analysis.strongestContribution || analysis.contributions[0];
  const questions = [
    {
      id: "direction",
      prompt: `The net force on charge ${analysis.target.label} points mostly...`,
      options: ["Right", "Left", "Up", "Down", "Near zero"],
      answer: analysis.directionLabel,
      explanation: `The current net vector is ${analysis.directionLabel.toLowerCase()} based on the combined Fx and Fy values.`,
    },
    {
      id: "interaction",
      prompt: `The interaction between charge ${primary.source.label} and charge ${analysis.target.label} is...`,
      options: ["Attractive", "Repulsive", "Zero"],
      answer: capitalize(primary.interaction),
      explanation: `Opposite signs attract and like signs repel. These two charges are ${primary.interaction}.`,
    },
  ];

  if (analysis.contributions.length > 1) {
    questions.push({
      id: "dominant",
      prompt: `Which source currently contributes the largest force magnitude on charge ${analysis.target.label}?`,
      options: analysis.contributions.map((item) => `Charge ${item.source.label}`),
      answer: `Charge ${primary.source.label}`,
      explanation: `Charge ${primary.source.label} has the largest individual |F| in the breakdown table.`,
    });
  } else {
    const scalingMode = state.presetKey === "fission" ? "distance" : Math.random() < 0.5 ? "distance" : "charge";
    if (scalingMode === "distance") {
      questions.push({
        id: "scaling",
        prompt: `If the separation between charges ${primary.source.label} and ${analysis.target.label} doubles, that single force becomes...`,
        options: ["4x as large", "2x as large", "1/2 as large", "1/4 as large"],
        answer: "1/4 as large",
        explanation: "Coulomb's law is inverse square in distance, so doubling r makes the force one fourth as large.",
      });
    } else {
      questions.push({
        id: "scaling",
        prompt: `If the source charge ${primary.source.label} doubles while distance stays fixed, that single force becomes...`,
        options: ["4x as large", "2x as large", "1/2 as large", "1/4 as large"],
        answer: "2x as large",
        explanation: "Force is directly proportional to each charge, so doubling one charge doubles the force.",
      });
    }
  }

  return questions;
}

function renderPracticeQuestions() {
  questionGrid.textContent = "";
  const preset = getPreset();
  practicePrompt.textContent =
    state.activity === "practice"
      ? `Practice mode is hiding the numeric readouts. Use the ${preset.shortTitle} setup and answer these before revealing the table.`
      : `Optional quick check for ${preset.shortTitle}. The readouts stay visible in inquiry mode, so students can use this as self-checking practice.`;

  state.practiceQuestions.forEach((question) => {
    const card = document.createElement("div");
    card.className = "question-card";

    const text = document.createElement("p");
    text.textContent = question.prompt;

    const select = document.createElement("select");
    select.dataset.question = question.id;

    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Choose an answer";
    select.append(placeholder);

    question.options.forEach((optionValue) => {
      const option = document.createElement("option");
      option.value = optionValue;
      option.textContent = optionValue;
      select.append(option);
    });

    select.value = state.practiceAnswers[question.id] || "";
    select.addEventListener("change", () => {
      state.practiceAnswers[question.id] = select.value;
    });

    card.append(text, select);
    questionGrid.append(card);
  });

  feedbackLine.textContent = state.feedback;
}

function checkPracticeAnswers() {
  if (!state.practiceQuestions.length) return;

  const unanswered = state.practiceQuestions.some((question) => !state.practiceAnswers[question.id]);
  if (unanswered) {
    state.feedback = "Answer all of the practice prompts first.";
    feedbackLine.textContent = state.feedback;
    return;
  }

  let correct = 0;
  const explanations = [];

  state.practiceQuestions.forEach((question) => {
    const response = state.practiceAnswers[question.id];
    if (response === question.answer) {
      correct += 1;
    } else {
      explanations.push(`${question.answer}. ${question.explanation}`);
    }
  });

  state.practiceRevealed = true;

  if (correct === state.practiceQuestions.length) {
    state.feedback = `${correct}/${state.practiceQuestions.length}. Your qualitative reasoning matches the current force diagram.`;
  } else {
    const firstExplanation = explanations[0] || "Check the force breakdown table and compare the source contributions.";
    state.feedback = `${correct}/${state.practiceQuestions.length}. First correction: ${firstExplanation}`;
  }

  feedbackLine.textContent = state.feedback;
  renderAll();
}

function computeAnalysis() {
  const preset = getPreset();
  const target = state.charges[state.targetIndex];
  const qTarget = target.value * preset.chargeScale;
  const contributions = [];
  let netFx = 0;
  let netFy = 0;

  state.charges.forEach((source, index) => {
    if (index === state.targetIndex) return;

    let dx = target.x - source.x;
    let dy = target.y - source.y;
    let rawDistance = Math.hypot(dx, dy);
    const softening = preset.softening;

    if (rawDistance < 1e-12) {
      dx = softening;
      dy = 0;
      rawDistance = softening;
    }

    const effectiveDistance = Math.max(rawDistance, softening);
    const scale = K * qTarget * source.value * preset.chargeScale / Math.pow(effectiveDistance, 3);
    const fx = scale * dx;
    const fy = scale * dy;
    const magnitude = Math.hypot(fx, fy);
    const interaction = qTarget * source.value * preset.chargeScale >= 0 ? "repulsive" : "attractive";

    netFx += fx;
    netFy += fy;

    contributions.push({
      source,
      sourceIndex: index,
      rawDistance,
      effectiveDistance,
      fx,
      fy,
      magnitude,
      interaction,
      midpoint: { x: source.x + (target.x - source.x) / 2, y: source.y + (target.y - source.y) / 2 },
    });
  });

  const netMagnitude = Math.hypot(netFx, netFy);
  const angleDeg = netMagnitude < 1e-18 ? 0 : (Math.atan2(netFy, netFx) * 180) / Math.PI;
  const strongestContribution = contributions.reduce((best, item) => {
    if (!best || item.magnitude > best.magnitude) return item;
    return best;
  }, null);

  const massKg = state.massG / 1000;
  const acceleration = massKg > 0 ? netMagnitude / massKg : 0;

  return {
    preset,
    target,
    contributions,
    netFx,
    netFy,
    netMagnitude,
    angleDeg,
    strongestContribution,
    acceleration,
    directionLabel: classifyDirection(netFx, netFy, netMagnitude),
    massKg,
  };
}

function renderAll() {
  syncControlsFromState();

  const analysis = computeAnalysis();
  updateTextContent(analysis);
  renderMetrics(analysis);
  renderForceTable(analysis);
  drawScene(analysis);
}

function updateTextContent(analysis) {
  const preset = analysis.preset;
  const targetLabel = `charge ${analysis.target.label}`;
  const strongest = analysis.strongestContribution
    ? `The strongest current source is charge ${analysis.strongestContribution.source.label}.`
    : "Only the target charge is present.";

  statusLine.textContent =
    state.activity === "practice"
      ? `Practice mode: reason qualitatively first, then press Check reasoning to unlock the table. ${strongest}`
      : `Inquiry mode: drag the charges, compare the arrows, and explain the force model on ${targetLabel}. ${strongest}`;

  presetPrompt.textContent = preset.prompt;
  arenaPrompt.textContent =
    state.activity === "practice"
      ? `Before revealing the numbers, predict the direction of the net force on ${targetLabel} and which source matters most.`
      : `Use ${preset.shortTitle} to connect the visual force arrows to the math model for ${targetLabel}.`;
  sceneCaption.textContent = `${preset.description} Drag a charge to change the separation r and watch the vector picture respond.`;
  teacherNote.textContent = `${preset.teacherUse} Source connection: ${preset.docRef}`;

  if (preset === PRESETS.equilibrium) {
    formulaLine.textContent = `${preset.formulaNote} In this view, tension and weight balance the electric force. Current inferred angle: ${formatFixed(
      equilibriumAngleDeg(analysis.netMagnitude, analysis.massKg),
      1,
    )} deg.`;
  } else if (preset === PRESETS.fission) {
    const gap = Math.max(0, analysis.contributions[0].rawDistance - 2 * preset.fragmentRadiusM);
    formulaLine.textContent = `${preset.formulaNote} Surface gap: ${formatDistance(gap, preset)}.`;
  } else {
    formulaLine.textContent = preset.formulaNote;
  }
}

function renderMetrics(analysis) {
  const hideNumbers = state.activity === "practice" && !state.practiceRevealed;
  metricGrid.textContent = "";

  const cards = hideNumbers
    ? [
        {
          title: "Setup",
          value: analysis.preset.shortTitle,
          note: analysis.preset.docRef,
        },
        {
          title: "Target",
          value: `Charge ${analysis.target.label}`,
          note: `Current value: ${formatChargeValue(analysis.target.value, analysis.preset)}`,
        },
        {
          title: "Readouts locked",
          value: "Predict first",
          note: "Use the vector picture and the geometry, then press Check reasoning.",
        },
      ]
    : buildMetricCards(analysis);

  cards.forEach((card) => {
    const wrapper = document.createElement("div");
    wrapper.className = "metric-card";

    const dl = document.createElement("dl");
    const dt = document.createElement("dt");
    dt.textContent = card.title;
    const dd = document.createElement("dd");
    dd.textContent = card.value;
    dl.append(dt, dd);

    wrapper.append(dl);
    if (card.note) {
      const note = document.createElement("p");
      note.textContent = card.note;
      wrapper.append(note);
    }

    metricGrid.append(wrapper);
  });
}

function buildMetricCards(analysis) {
  const preset = analysis.preset;
  const cards = [
    {
      title: preset === PRESETS.equilibrium ? "Electric force" : "Net force",
      value: formatForce(analysis.netMagnitude),
      note:
        preset === PRESETS.equilibrium
          ? `Acts horizontally on the hanging charge. Direction: ${analysis.directionLabel.toLowerCase()}.`
          : `Direction: ${analysis.directionLabel.toLowerCase()} (${formatFixed(analysis.angleDeg, 1)} deg)`,
    },
    {
      title: "Fx",
      value: formatForce(analysis.netFx),
      note: preset === PRESETS.equilibrium ? "Horizontal electric-force component." : "Horizontal component of the net force.",
    },
    {
      title: "Fy",
      value: formatForce(analysis.netFy),
      note: preset === PRESETS.equilibrium ? "Vertical electric-force component." : "Vertical component of the net force.",
    },
    {
      title: "Acceleration",
      value: `${formatScientific(analysis.acceleration, 3)} m/s^2`,
      note: `Using target mass ${formatFixed(state.massG, 1)} g.`,
    },
  ];

  if (analysis.strongestContribution) {
    cards.push({
      title: "Strongest source",
      value: `Charge ${analysis.strongestContribution.source.label}`,
      note: `At ${formatDistance(analysis.strongestContribution.rawDistance, preset)} with an ${analysis.strongestContribution.interaction} interaction.`,
    });
  }

  if (preset === PRESETS.equilibrium) {
    const theta = equilibriumAngleDeg(analysis.netMagnitude, analysis.massKg);
    const lateral = Math.sin((theta * Math.PI) / 180) * (state.stringLengthCm / 100);
    cards.push({
      title: "Equilibrium angle",
      value: `${formatFixed(theta, 1)} deg`,
      note: `If used as a hanging-spheres model, the side deflection would be about ${formatDistance(lateral, {
        ...preset,
        distanceDisplay: { factor: 100, label: "cm", digits: 1 },
      })}.`,
    });
  }

  if (preset === PRESETS.fission && analysis.contributions[0]) {
    const centerDistance = analysis.contributions[0].rawDistance;
    cards.push({
      title: "Center separation",
      value: formatDistance(centerDistance, preset),
      note: `Each fragment is modeled with radius ${formatDistance(preset.fragmentRadiusM, preset)}.`,
    });
  }

  return cards;
}

function renderForceTable(analysis) {
  const hideNumbers = state.activity === "practice" && !state.practiceRevealed;
  forceTableBody.textContent = "";

  if (hideNumbers) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 6;
    cell.textContent = "Practice mode is hiding the quantitative breakdown. Press Check reasoning to reveal it.";
    row.append(cell);
    forceTableBody.append(row);
    return;
  }

  if (!analysis.contributions.length) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 6;
    cell.textContent = "No source charges are available.";
    row.append(cell);
    forceTableBody.append(row);
    return;
  }

  analysis.contributions.forEach((item) => {
    const row = document.createElement("tr");
    const cells = [
      `Charge ${item.source.label}`,
      formatDistance(item.rawDistance, analysis.preset),
      capitalize(item.interaction),
      formatForce(item.fx),
      formatForce(item.fy),
      formatForce(item.magnitude),
    ];

    cells.forEach((value) => {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.append(cell);
    });

    forceTableBody.append(row);
  });
}

function drawScene(analysis) {
  resizeCanvas();

  const palette = getPalette();
  const width = canvas.width / (window.devicePixelRatio || 1);
  const height = canvas.height / (window.devicePixelRatio || 1);

  ctx.clearRect(0, 0, width, height);

  const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
  bgGradient.addColorStop(0, palette.canvasTop);
  bgGradient.addColorStop(1, palette.canvasBottom);
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, width, height);

  if (showComponents.checked) {
    drawGrid(width, height, palette);
  }

  const projectedCharges = state.charges.map((charge) => ({
    charge,
    point: worldToCanvas(charge.x, charge.y, analysis.preset, width, height),
  }));

  if (showVectors.checked && showComponents.checked) {
    drawGeometryHelpers(projectedCharges, analysis, palette);
  }

  if (showVectors.checked) {
    drawForceVectors(projectedCharges, analysis, palette);
  }

  if (analysis.preset === PRESETS.triangle) {
    drawTriangleAxes(width, height, analysis.preset, palette);
  }

  if (analysis.preset === PRESETS.equilibrium) {
    drawEquilibriumDecorations(projectedCharges, analysis, palette, width, height);
  }

  drawCharges(projectedCharges, analysis, palette);
  drawSceneAnnotations(projectedCharges, analysis, palette);
}

function drawGrid(width, height, palette) {
  ctx.save();
  ctx.strokeStyle = palette.grid;
  ctx.lineWidth = 1;

  const cols = 8;
  const rows = 6;
  for (let i = 1; i < cols; i += 1) {
    const x = (width / cols) * i;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  for (let i = 1; i < rows; i += 1) {
    const y = (height / rows) * i;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  ctx.restore();
}

function drawGeometryHelpers(projectedCharges, analysis, palette) {
  const target = projectedCharges[state.targetIndex].point;
  const dimensions = getWorldToCanvasScale(analysis.preset, canvas.width / (window.devicePixelRatio || 1), canvas.height / (window.devicePixelRatio || 1));

  ctx.save();
  ctx.setLineDash([6, 6]);
  ctx.lineWidth = 1.4;
  ctx.strokeStyle = palette.helper;

  analysis.contributions.forEach((item) => {
    const source = projectedCharges[item.sourceIndex].point;
    ctx.beginPath();
    ctx.moveTo(source.x, source.y);
    ctx.lineTo(target.x, target.y);
    ctx.stroke();

    drawLabel(
      `${formatDistance(item.rawDistance, analysis.preset)}`,
      (source.x + target.x) / 2,
      (source.y + target.y) / 2 - 14,
      palette.labelBg,
      palette.labelText,
    );
  });

  if (shouldDrawComponents(analysis)) {
    const end = buildScreenVectorEnd(target, analysis.netFx, analysis.netFy, analysis.netMagnitude, dimensions, 132);
    const horizontalEnd = { x: end.x, y: target.y };

    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = palette.axis;

    ctx.beginPath();
    ctx.moveTo(target.x, target.y);
    ctx.lineTo(horizontalEnd.x, horizontalEnd.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();

    drawLabel("Fx", (target.x + horizontalEnd.x) / 2, target.y - 16, palette.labelBg, palette.labelText);
    drawLabel("Fy", end.x + 24, (target.y + end.y) / 2, palette.labelBg, palette.labelText);
  }

  ctx.restore();
}

function drawForceVectors(projectedCharges, analysis, palette) {
  const target = projectedCharges[state.targetIndex].point;
  const width = canvas.width / (window.devicePixelRatio || 1);
  const height = canvas.height / (window.devicePixelRatio || 1);
  const dimensions = getWorldToCanvasScale(analysis.preset, width, height);
  const maxMagnitude = Math.max(
    analysis.netMagnitude,
    ...analysis.contributions.map((item) => item.magnitude),
    1e-30,
  );

  const showContributionVectors = analysis.contributions.length > 1;

  analysis.contributions.forEach((item) => {
    if (!showContributionVectors) return;

    const color = palette.contribution;
    const length = mapMagnitude(item.magnitude, maxMagnitude, 34, 112);
    const end = buildScreenVectorEnd(target, item.fx, item.fy, item.magnitude, dimensions, length);
    drawArrow(target, end, color, 3);
    drawLabel(`F${item.source.label}`, end.x, end.y - 16, palette.labelBg, palette.labelText);
  });

  if (analysis.netMagnitude > 0) {
    const length = mapMagnitude(analysis.netMagnitude, maxMagnitude, 50, 156);
    const end = buildScreenVectorEnd(target, analysis.netFx, analysis.netFy, analysis.netMagnitude, dimensions, length);
    drawArrow(target, end, palette.net, 4.5);
    drawLabel(showContributionVectors ? "Fnet" : `F${analysis.contributions[0].source.label} on ${analysis.target.label}`, end.x, end.y - 18, palette.labelBg, palette.labelText);
  }
}

function drawEquilibriumDecorations(projectedCharges, analysis, palette, width, height) {
  const targetCharge = state.charges[state.targetIndex];
  const centerX = state.charges.reduce((sum, charge) => sum + charge.x, 0) / state.charges.length;
  const theta = equilibriumAngleDeg(analysis.netMagnitude, analysis.massKg);
  const angleRad = (theta * Math.PI) / 180;
  const stringLengthM = state.stringLengthCm / 100;
  const supports = projectedCharges.map(({ charge, point }) => {
    const sameSign = charge.value * targetCharge.value >= 0;
    const side = Math.sign(charge.x - centerX || (charge.label === "A" ? -1 : 1));
    const direction = sameSign ? side : -side;
    const anchor = {
      x: charge.x - direction * Math.sin(angleRad) * stringLengthM,
      y: charge.y + Math.cos(angleRad) * stringLengthM,
    };

    return {
      charge,
      point,
      anchorWorld: anchor,
      anchorPoint: worldToCanvas(anchor.x, anchor.y, analysis.preset, width, height),
    };
  });

  ctx.save();
  ctx.strokeStyle = palette.outline;
  ctx.lineWidth = 3;

  const supportY = Math.min(...supports.map((item) => item.anchorPoint.y)) - 10;
  ctx.beginPath();
  ctx.moveTo(40, supportY);
  ctx.lineTo(width - 40, supportY);
  ctx.stroke();

  supports.forEach((item) => {
    ctx.beginPath();
    ctx.moveTo(item.anchorPoint.x, supportY);
    ctx.lineTo(item.anchorPoint.x, item.anchorPoint.y);
    ctx.stroke();

    ctx.strokeStyle = palette.helper;
    ctx.beginPath();
    ctx.moveTo(item.anchorPoint.x, item.anchorPoint.y);
    ctx.lineTo(item.point.x, item.point.y);
    ctx.stroke();
    ctx.strokeStyle = palette.outline;

    ctx.beginPath();
    ctx.arc(item.anchorPoint.x, item.anchorPoint.y, 5, 0, Math.PI * 2);
    ctx.fillStyle = palette.outline;
    ctx.fill();
  });

  const targetSupport = supports[state.targetIndex];
  const targetPoint = targetSupport.point;
  const anchorPoint = targetSupport.anchorPoint;

  drawAngleArc(targetPoint, anchorPoint, theta, palette);

  if (showVectors.checked) {
    drawArrow(targetPoint, anchorPoint, palette.equilibrium, 3.2);
    drawLabel("T", (targetPoint.x + anchorPoint.x) / 2, (targetPoint.y + anchorPoint.y) / 2 - 18, palette.labelBg, palette.labelText);

    const weightEnd = { x: targetPoint.x, y: targetPoint.y + 90 };
    drawArrow(targetPoint, weightEnd, "#6C7E88", 3.2);
    drawLabel("mg", weightEnd.x + 26, (targetPoint.y + weightEnd.y) / 2, palette.labelBg, palette.labelText);

    const electricEnd = buildScreenVectorEnd(targetPoint, analysis.netFx, 0, Math.max(Math.abs(analysis.netFx), 1e-18), getWorldToCanvasScale(analysis.preset, width, height), 110);
    drawArrow(targetPoint, electricEnd, palette.net, 3.8);
    drawLabel("Fe", electricEnd.x, electricEnd.y - 16, palette.labelBg, palette.labelText);
  }

  drawLabel(`${formatFixed(theta, 1)} deg`, anchorPoint.x + 34, targetPoint.y - 18, palette.labelBg, palette.labelText);
  ctx.restore();
}

function drawAngleArc(targetPoint, anchorPoint, theta, palette) {
  const radius = 34;
  const dy = anchorPoint.y - targetPoint.y;
  const dx = anchorPoint.x - targetPoint.x;
  const startAngle = -Math.PI / 2;
  const endAngle = Math.atan2(dy, dx);

  ctx.save();
  ctx.strokeStyle = palette.equilibrium;
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.arc(targetPoint.x, targetPoint.y, radius, Math.min(startAngle, endAngle), Math.max(startAngle, endAngle), endAngle < startAngle);
  ctx.stroke();
  ctx.restore();
}

function drawCharges(projectedCharges, analysis, palette) {
  projectedCharges.forEach(({ charge, point }, index) => {
    const isTarget = index === state.targetIndex;
    const radius = isTarget ? 23 : 18;
    const fill = charge.value >= 0 ? palette.positive : palette.negative;

    ctx.save();
    ctx.beginPath();
    ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
    ctx.fillStyle = fill;
    ctx.shadowColor = fill;
    ctx.shadowBlur = isTarget ? 20 : 10;
    ctx.fill();
    ctx.restore();

    ctx.beginPath();
    ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
    ctx.lineWidth = isTarget ? 4 : 2;
    ctx.strokeStyle = isTarget ? palette.target : palette.outline;
    ctx.stroke();

    ctx.fillStyle = palette.signText;
    ctx.font = `700 ${isTarget ? 18 : 15}px "Space Grotesk", sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(charge.value >= 0 ? "+" : "-", point.x, point.y);

    drawLabel(
      `${charge.label}: ${formatChargeValue(charge.value, analysis.preset)}`,
      point.x,
      point.y + radius + 18,
      palette.labelBg,
      palette.labelText,
    );

    if (isTarget) {
      drawLabel("target", point.x, point.y - radius - 18, palette.targetLabelBg, palette.targetLabelText);
    }
  });
}

function drawSceneAnnotations(projectedCharges, analysis, palette) {
  const infoLines = [
    `Target: charge ${analysis.target.label}`,
    `${analysis.preset === PRESETS.equilibrium ? "Current electric force" : "Current net force"}: ${formatForce(analysis.netMagnitude)}`,
    `Direction: ${analysis.directionLabel}`,
  ];

  if (analysis.preset === PRESETS.equilibrium) {
    infoLines.push(`Inferred equilibrium angle: ${formatFixed(equilibriumAngleDeg(analysis.netMagnitude, analysis.massKg), 1)} deg`);
  }

  if (analysis.preset === PRESETS.fission && analysis.contributions[0]) {
    infoLines.push(`Center separation: ${formatDistance(analysis.contributions[0].rawDistance, analysis.preset)}`);
  }

  ctx.save();
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.font = '500 14px "IBM Plex Sans", sans-serif';

  let y = 18;
  infoLines.forEach((line) => {
    drawLabel(line, 18, y, palette.labelBg, palette.labelText, "left");
    y += 28;
  });

  drawLabel("Drag a charge to change r", 18, canvas.height / (window.devicePixelRatio || 1) - 30, palette.labelBg, palette.labelText, "left");
  ctx.restore();
}

function drawTriangleAxes(width, height, preset, palette) {
  const origin = worldToCanvas(0, 0, preset, width, height);
  ctx.save();
  ctx.setLineDash([5, 5]);
  ctx.strokeStyle = palette.axis;
  ctx.lineWidth = 1.2;

  ctx.beginPath();
  ctx.moveTo(origin.x, 0);
  ctx.lineTo(origin.x, height);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0, origin.y);
  ctx.lineTo(width, origin.y);
  ctx.stroke();
  ctx.restore();
}

function drawArrow(start, end, color, lineWidth) {
  const headLength = 10 + lineWidth * 1.5;
  const angle = Math.atan2(end.y - start.y, end.x - start.x);

  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = "round";

  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(end.x, end.y);
  ctx.lineTo(end.x - headLength * Math.cos(angle - Math.PI / 6), end.y - headLength * Math.sin(angle - Math.PI / 6));
  ctx.lineTo(end.x - headLength * Math.cos(angle + Math.PI / 6), end.y - headLength * Math.sin(angle + Math.PI / 6));
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawLabel(text, x, y, bg, fg, align = "center") {
  ctx.save();
  ctx.font = '500 12px "IBM Plex Sans", sans-serif';
  ctx.textAlign = align;
  ctx.textBaseline = "middle";
  const metrics = ctx.measureText(text);
  const padX = 8;
  const padY = 5;
  const width = metrics.width + padX * 2;
  const height = 24;
  const left = align === "left" ? x : x - width / 2;

  const radius = Math.min(999, width / 2, height / 2);
  roundRect(ctx, left, y - height / 2, width, height, radius);
  ctx.fillStyle = bg;
  ctx.fill();

  ctx.fillStyle = fg;
  ctx.fillText(text, align === "left" ? x + padX : x, y + 0.5);
  ctx.restore();
}

function roundRect(context, x, y, width, height, radius) {
  const r = Math.max(0, Math.min(radius, width / 2, height / 2));
  context.beginPath();
  context.moveTo(x + r, y);
  context.lineTo(x + width - r, y);
  context.quadraticCurveTo(x + width, y, x + width, y + r);
  context.lineTo(x + width, y + height - r);
  context.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  context.lineTo(x + r, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - r);
  context.lineTo(x, y + r);
  context.quadraticCurveTo(x, y, x + r, y);
  context.closePath();
}

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const width = rect.width || 1200;
  const height = Math.max(360, Math.min(620, width * 0.52));
  const dpr = window.devicePixelRatio || 1;

  if (canvas.width === Math.round(width * dpr) && canvas.height === Math.round(height * dpr)) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return;
  }

  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function worldToCanvas(x, y, preset, width, height) {
  const padX = 52;
  const padY = 42;
  const usableWidth = width - padX * 2;
  const usableHeight = height - padY * 2;
  const px = padX + ((x - preset.world.minX) / (preset.world.maxX - preset.world.minX)) * usableWidth;
  const py = height - padY - ((y - preset.world.minY) / (preset.world.maxY - preset.world.minY)) * usableHeight;
  return { x: px, y: py };
}

function canvasToWorld(clientX, clientY) {
  const preset = getPreset();
  const rect = canvas.getBoundingClientRect();
  const width = rect.width || 1200;
  const height = rect.height || 620;
  const padX = 52;
  const padY = 42;
  const usableWidth = width - padX * 2;
  const usableHeight = height - padY * 2;

  const x = ((clientX - rect.left - padX) / usableWidth) * (preset.world.maxX - preset.world.minX) + preset.world.minX;
  const y = ((height - (clientY - rect.top) - padY) / usableHeight) * (preset.world.maxY - preset.world.minY) + preset.world.minY;
  return {
    x: clamp(x, preset.world.minX, preset.world.maxX),
    y: clamp(y, preset.world.minY, preset.world.maxY),
  };
}

function handlePointerDown(event) {
  const hitIndex = findChargeAt(event.clientX, event.clientY);
  if (hitIndex === -1) return;

  state.dragIndex = hitIndex;
  state.pointerId = event.pointerId;
  canvas.setPointerCapture(event.pointerId);
}

function handlePointerMove(event) {
  const hitIndex = findChargeAt(event.clientX, event.clientY);
  state.hoverIndex = hitIndex === -1 ? null : hitIndex;

  if (state.dragIndex === null) {
    renderAll();
    return;
  }

  const charge = state.charges[state.dragIndex];
  const preset = getPreset();
  const position = canvasToWorld(event.clientX, event.clientY);

  if (charge.axis === "x") {
    charge.x = position.x;
  } else {
    charge.x = position.x;
    charge.y = position.y;
  }

  if (preset === PRESETS.line) {
    charge.y = 0;
  }

  if (preset === PRESETS.equilibrium || preset === PRESETS.fission) {
    charge.y = 0;
  }

  onStateChanged();
}

function handlePointerUp(event) {
  if (state.pointerId !== event.pointerId) return;
  state.dragIndex = null;
  state.pointerId = null;
  canvas.releasePointerCapture(event.pointerId);
  renderAll();
}

function findChargeAt(clientX, clientY) {
  const preset = getPreset();
  const rect = canvas.getBoundingClientRect();
  const width = rect.width || 1200;
  const height = rect.height || 620;
  const pointer = { x: clientX - rect.left, y: clientY - rect.top };

  for (let index = state.charges.length - 1; index >= 0; index -= 1) {
    const charge = state.charges[index];
    const point = worldToCanvas(charge.x, charge.y, preset, width, height);
    const radius = index === state.targetIndex ? 26 : 22;
    if (Math.hypot(pointer.x - point.x, pointer.y - point.y) <= radius) {
      return index;
    }
  }

  return -1;
}

function randomizeScene() {
  const preset = getPreset();
  const xRange = preset.world.maxX - preset.world.minX;
  const yRange = preset.world.maxY - preset.world.minY;

  state.charges = state.charges.map((charge, index) => {
    const next = { ...charge };

    if (preset === PRESETS.fission) {
      next.value = randomInt(30, 60);
      next.x = index === 0 ? -randomBetween(4.5e-15, 8e-15) : randomBetween(4.5e-15, 8e-15);
      next.y = 0;
      return next;
    }

    if (preset === PRESETS.equilibrium) {
      next.value = randomStep(1.5, 8.5, 0.1);
      next.x = index === 0 ? -randomBetween(0.08, 0.18) : randomBetween(0.08, 0.18);
      next.y = 0;
      return next;
    }

    next.value = randomSignedStep(
      Math.max(Math.abs(preset.chargeRange.min), 0.3),
      Math.max(Math.abs(preset.chargeRange.max), 0.3),
      preset.chargeRange.step,
    );

    if (preset === PRESETS.line) {
      const anchors = [-0.35, 0, 0.32];
      next.x = anchors[index] * xRange;
      next.y = 0;
      return next;
    }

    if (preset === PRESETS.triangle) {
      const anchorPositions = [
        { x: randomBetween(-0.2, 0.5), y: randomBetween(-0.2, 0.4) },
        { x: randomBetween(3.4, 4.4), y: randomBetween(-0.1, 0.5) },
        { x: randomBetween(3.3, 4.5), y: randomBetween(-3.8, -2.2) },
      ];
      next.x = anchorPositions[index].x;
      next.y = anchorPositions[index].y;
      return next;
    }

    next.x = charge.x + randomBetween(-xRange * 0.08, xRange * 0.08);
    next.y = charge.axis === "x" ? 0 : charge.y + randomBetween(-yRange * 0.12, yRange * 0.12);
    next.x = clamp(next.x, preset.world.minX + xRange * 0.08, preset.world.maxX - xRange * 0.08);
    next.y = clamp(next.y, preset.world.minY + yRange * 0.08, preset.world.maxY - yRange * 0.08);
    return next;
  });

  state.massG =
    preset === PRESETS.equilibrium
      ? randomStep(0.2, 1.5, 0.1)
      : preset === PRESETS.fission
        ? state.massG
        : randomStep(0.2, 3.5, 0.1);

  if (preset === PRESETS.equilibrium) {
    state.stringLengthCm = randomInt(20, 60);
  }

  onStateChanged();
}

function getPalette() {
  const styles = getComputedStyle(document.body);
  return {
    canvasTop: styles.getPropertyValue("--canvas-top").trim(),
    canvasBottom: styles.getPropertyValue("--canvas-bottom").trim(),
    grid: styles.getPropertyValue("--canvas-grid").trim(),
    axis: styles.getPropertyValue("--canvas-axis").trim(),
    helper: styles.getPropertyValue("--border-strong").trim(),
    contribution: styles.getPropertyValue("--gold-500").trim(),
    equilibrium: "#d67b19",
    positive: styles.getPropertyValue("--positive").trim(),
    negative: styles.getPropertyValue("--negative").trim(),
    target: styles.getPropertyValue("--target").trim(),
    net: styles.getPropertyValue("--net").trim(),
    outline: styles.getPropertyValue("--border-strong").trim(),
    signText: document.body.dataset.theme === "light" ? "#ffffff" : "#130f08",
    labelBg: document.body.dataset.theme === "light" ? "rgba(255,255,255,0.9)" : "rgba(17,20,27,0.86)",
    labelText: styles.getPropertyValue("--text-100").trim(),
    targetLabelBg: document.body.dataset.theme === "light" ? "#123140" : "rgba(255,255,255,0.9)",
    targetLabelText: document.body.dataset.theme === "light" ? "#ffffff" : "#11141b",
  };
}

function classifyDirection(fx, fy, magnitude) {
  if (magnitude < 1e-18) return "Near zero";
  if (Math.abs(fx) >= Math.abs(fy)) {
    return fx >= 0 ? "Right" : "Left";
  }
  return fy >= 0 ? "Up" : "Down";
}

function equilibriumAngleDeg(forceN, massKg) {
  if (!massKg || massKg <= 0) return 0;
  return (Math.atan(forceN / (massKg * G)) * 180) / Math.PI;
}

function shouldDrawComponents(analysis) {
  return showVectors.checked && showComponents.checked && Math.abs(analysis.netFy) > Math.max(analysis.netMagnitude * 0.08, 1e-16);
}

function mapMagnitude(value, maxValue, minPixels, maxPixels) {
  if (maxValue <= 0) return minPixels;
  const ratio = value / maxValue;
  return minPixels + ratio * (maxPixels - minPixels);
}

function clampMagnitude(component, magnitude, maxPixels) {
  if (magnitude <= 0) return 0;
  return (component / magnitude) * Math.min(maxPixels, mapMagnitude(magnitude, magnitude, maxPixels, maxPixels));
}

function formatChargeValue(value, preset) {
  return `${formatChargeControlValue(value, preset)} ${preset.chargeUnitShort}`;
}

function formatChargeControlValue(value, preset) {
  const digits = preset.chargeRange.step >= 1 ? 0 : preset.chargeRange.step >= 0.1 ? 1 : 2;
  return formatFixed(value, digits);
}

function formatDistance(value, preset) {
  const scaled = value * preset.distanceDisplay.factor;
  return `${formatFixed(scaled, preset.distanceDisplay.digits)} ${preset.distanceDisplay.label}`;
}

function formatForce(value) {
  return `${formatScientific(value, 3)} N`;
}

function formatScientific(value, digits = 3) {
  const abs = Math.abs(value);
  if (abs === 0) return "0";
  if (abs >= 0.01 && abs < 1000) {
    return trimZeros(value.toFixed(Math.min(digits, 3)));
  }
  return value.toExponential(digits - 1).replace("e+", "e");
}

function formatFixed(value, digits) {
  return trimZeros(Number(value).toFixed(digits));
}

function trimZeros(text) {
  return text.replace(/\.0+$/u, "").replace(/(\.\d*?)0+$/u, "$1");
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function randomStep(min, max, step) {
  const raw = randomBetween(min, max);
  return Number((Math.round(raw / step) * step).toFixed(3));
}

function randomSignedStep(minAbs, maxAbs, step) {
  const magnitude = randomStep(minAbs, maxAbs, step);
  return Math.random() < 0.5 ? magnitude : -magnitude;
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getWorldToCanvasScale(preset, width, height) {
  const padX = 52;
  const padY = 42;
  const usableWidth = width - padX * 2;
  const usableHeight = height - padY * 2;
  return {
    pxPerX: usableWidth / (preset.world.maxX - preset.world.minX),
    pxPerY: usableHeight / (preset.world.maxY - preset.world.minY),
  };
}

function buildScreenVectorEnd(start, vx, vy, magnitude, dimensions, targetLength) {
  if (!magnitude || magnitude <= 0) {
    return { ...start };
  }

  const screenVector = {
    x: vx * dimensions.pxPerX,
    y: -vy * dimensions.pxPerY,
  };
  const screenMagnitude = Math.hypot(screenVector.x, screenVector.y) || 1;
  const scale = targetLength / screenMagnitude;

  return {
    x: start.x + screenVector.x * scale,
    y: start.y + screenVector.y * scale,
  };
}

function openDialog(dialog) {
  dialog.showModal();
}

function closeDialog(dialog) {
  dialog.close();
}

function handleDialogBackdrop(event, dialog) {
  const rect = dialog.getBoundingClientRect();
  const inDialog =
    event.clientX >= rect.left &&
    event.clientX <= rect.right &&
    event.clientY >= rect.top &&
    event.clientY <= rect.bottom;

  if (!inDialog) {
    closeDialog(dialog);
  }
}
