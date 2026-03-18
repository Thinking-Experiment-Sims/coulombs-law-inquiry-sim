const K = 8.9875517923e9;
const G = 9.81;
const E_CHARGE = 1.602176634e-19;
const STORAGE_KEY_THEME = "coulomb-inquiry-theme";
const STORAGE_KEY_ACTIVITY = "coulomb-inquiry-activity";
const STORAGE_KEY_PRESET = "coulomb-inquiry-preset";

const CHARGE_LABELS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const CAMERA_DEFAULTS = { yawDeg: -28, pitchDeg: 20 };

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
const massWrap = $("massWrap");
const massInput = $("massInput");
const massValue = $("massValue");
const massAWrap = $("massAWrap");
const massAInput = $("massAInput");
const massAValue = $("massAValue");
const massBWrap = $("massBWrap");
const massBInput = $("massBInput");
const massBValue = $("massBValue");
const viewYawWrap = $("viewYawWrap");
const viewYawInput = $("viewYawInput");
const viewYawValue = $("viewYawValue");
const viewPitchWrap = $("viewPitchWrap");
const viewPitchInput = $("viewPitchInput");
const viewPitchValue = $("viewPitchValue");
const stringLengthWrap = $("stringLengthWrap");
const stringLengthInput = $("stringLengthInput");
const stringLengthValue = $("stringLengthValue");
const chargeCountWrap = $("chargeCountWrap");
const chargeCountSelect = $("chargeCountSelect");
const editChargeWrap = $("editChargeWrap");
const editChargeSelect = $("editChargeSelect");
const xPositionWrap = $("xPositionWrap");
const xPositionInput = $("xPositionInput");
const xPositionValue = $("xPositionValue");
const yPositionWrap = $("yPositionWrap");
const yPositionInput = $("yPositionInput");
const yPositionValue = $("yPositionValue");
const zPositionWrap = $("zPositionWrap");
const zPositionInput = $("zPositionInput");
const zPositionValue = $("zPositionValue");
const chargeControlList = $("chargeControlList");
const statusLine = $("statusLine");
const presetPrompt = $("presetPrompt");
const sceneCaption = $("sceneCaption");
const formulaLine = $("formulaLine");
const showVectors = $("showVectors");
const showComponents = $("showComponents");
const showAngles = $("showAngles");
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

const ctx = canvas.getContext("2d");

const PRESET_ORDER = [
  "pair",
  "line",
  "triangle",
  "pyramid3d",
  "cube3d",
  "icosahedron3d",
  "free3d",
  "fission",
  "equilibrium",
];

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
    world: world2D(-2.8, 2.8, -2.2, 2.2),
    charges: [
      makeCharge("A", 4.5, -1.65, 0.8, 0, "xy"),
      makeCharge("B", -3.0, 1.4, -0.55, 0, "xy"),
    ],
    targetIndex: 1,
    editIndex: 0,
    massG: 1.2,
    stringLengthCm: 40,
    softening: 0.16,
    is3d: false,
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
    world: world2D(-4.3, 4.3, -2.2, 2.2),
    charges: [
      makeCharge("A", 6.0, -2.7, 0, 0, "x"),
      makeCharge("B", 5.0, 0, 0, 0, "x"),
      makeCharge("C", -4.0, 2.0, 0, 0, "x"),
    ],
    targetIndex: 1,
    editIndex: 0,
    massG: 0.8,
    stringLengthCm: 40,
    softening: 0.2,
    is3d: false,
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
    world: world2D(-1.0, 5.4, -4.5, 1.8),
    charges: [
      makeCharge("A", 6.0, 0, 0, 0, "xy"),
      makeCharge("B", -2.1, 4.0, 0, 0, "xy"),
      makeCharge("C", 5.0, 4.0, -3.0, 0, "xy"),
    ],
    targetIndex: 2,
    editIndex: 0,
    massG: 0.2,
    stringLengthCm: 40,
    softening: 0.18,
    is3d: false,
  },
  pyramid3d: {
    title: "3D Square Pyramid",
    shortTitle: "3D Pyramid",
    prompt:
      "Rotate the view before deciding the net-force direction. This setup is designed for spatial superposition, azimuth, and elevation reasoning.",
    description:
      "A square-pyramid arrangement that turns Coulomb's law into a fully three-dimensional vector problem.",
    formulaNote:
      "In 3D, the same force law applies, but the vector bookkeeping now includes Fz plus azimuth and elevation.",
    teacherUse:
      "Use this when students are ready to leave the page and reason about 3D force geometry with helper angles.",
    docRef: "Extension: 3D superposition and direction-cosine style reasoning.",
    chargeUnitLabel: "microcoulombs",
    chargeUnitShort: "uC",
    chargeScale: 1e-6,
    chargeRange: { min: -8, max: 8, step: 0.1 },
    distanceDisplay: { factor: 1, label: "m", digits: 2 },
    world: world3D(-2.8, 2.8, -2.4, 2.6, -2.8, 2.8),
    charges: [
      makeCharge("A", 4.2, -1.5, -1.1, -1.4, "xyz"),
      makeCharge("B", 4.2, 1.5, -1.1, -1.4, "xyz"),
      makeCharge("C", -3.2, 1.5, -1.1, 1.4, "xyz"),
      makeCharge("D", 4.2, -1.5, -1.1, 1.4, "xyz"),
      makeCharge("E", -2.8, 0, 1.7, 0, "xyz"),
    ],
    targetIndex: 4,
    editIndex: 0,
    massG: 0.6,
    stringLengthCm: 40,
    softening: 0.24,
    is3d: true,
    view: { yawDeg: -34, pitchDeg: 18 },
  },
  cube3d: {
    title: "3D Cube Shell",
    shortTitle: "3D Cube",
    prompt:
      "Use the cube to talk about symmetry in 3D. Rotate until the top and bottom faces separate clearly, then compare the sign pattern before checking the vector table.",
    description:
      "Eight corner charges around a central target. The top and bottom faces can reinforce or cancel in the z direction.",
    formulaNote:
      "A symmetric shell can still produce a nonzero net force when the sign pattern breaks perfect cancellation.",
    teacherUse:
      "A clean bridge from 2D symmetry arguments to 3D cancellation and dominant-axis reasoning.",
    docRef: "3D extension: symmetry, cancellation, and net direction in space.",
    chargeUnitLabel: "microcoulombs",
    chargeUnitShort: "uC",
    chargeScale: 1e-6,
    chargeRange: { min: -8, max: 8, step: 0.1 },
    distanceDisplay: { factor: 1, label: "m", digits: 2 },
    world: world3D(-2.7, 2.7, -2.5, 2.5, -2.7, 2.7),
    charges: [
      makeCharge("A", 3.5, -1.5, 1.5, -1.5, "xyz"),
      makeCharge("B", 3.5, 1.5, 1.5, -1.5, "xyz"),
      makeCharge("C", 3.5, 1.5, 1.5, 1.5, "xyz"),
      makeCharge("D", 3.5, -1.5, 1.5, 1.5, "xyz"),
      makeCharge("E", -3.5, -1.5, -1.5, -1.5, "xyz"),
      makeCharge("F", -3.5, 1.5, -1.5, -1.5, "xyz"),
      makeCharge("G", -3.5, 1.5, -1.5, 1.5, "xyz"),
      makeCharge("H", -3.5, -1.5, -1.5, 1.5, "xyz"),
      makeCharge("I", 1.8, 0, 0, 0, "xyz"),
    ],
    targetIndex: 8,
    editIndex: 0,
    massG: 0.6,
    stringLengthCm: 40,
    softening: 0.22,
    is3d: true,
    view: { yawDeg: -33, pitchDeg: 21 },
  },
  icosahedron3d: {
    title: "3D Icosahedral Shell",
    shortTitle: "3D Icosahedron",
    prompt:
      "This is the richest 3D superposition case. Rotate the shell, identify the pole charges, and use the angle labels to decide whether the net leans more in z or y.",
    description:
      "Twelve charges on an icosahedral shell around a target charge, designed for 3D symmetry and angle reasoning.",
    formulaNote:
      "The vector model is unchanged, but the geometry is now truly spatial: track Fz, azimuth, and elevation together.",
    teacherUse:
      "Use this as a capstone when students are comfortable with superposition and ready for genuinely spatial force fields.",
    docRef: "Capstone extension: icosahedral symmetry and 3D vector addition.",
    chargeUnitLabel: "microcoulombs",
    chargeUnitShort: "uC",
    chargeScale: 1e-6,
    chargeRange: { min: -8, max: 8, step: 0.1 },
    distanceDisplay: { factor: 1, label: "m", digits: 2 },
    world: world3D(-3.1, 3.1, -3.1, 3.1, -3.1, 3.1),
    charges: buildIcosahedronPresetCharges(),
    targetIndex: 12,
    editIndex: 0,
    massG: 0.7,
    stringLengthCm: 40,
    softening: 0.18,
    is3d: true,
    view: { yawDeg: -24, pitchDeg: 24 },
  },
  free3d: {
    title: "Free 3D Builder",
    shortTitle: "Free 3D",
    prompt:
      "Build your own configuration with up to five charges. Rotate the scene, pick a target, and use the position sliders to create any arrangement you want.",
    description:
      "A free-form 3D scenario for custom Coulomb-law setups with up to five charges.",
    formulaNote:
      "Choose your own geometry, then use the component path plus azimuth/elevation labels to explain the net force.",
    teacherUse:
      "Useful for student-designed investigations, challenge problems, and modeling textbook diagrams not covered by the presets.",
    docRef: "Open inquiry: student-built 3D charge systems with at most five charges.",
    chargeUnitLabel: "microcoulombs",
    chargeUnitShort: "uC",
    chargeScale: 1e-6,
    chargeRange: { min: -8, max: 8, step: 0.1 },
    distanceDisplay: { factor: 1, label: "m", digits: 2 },
    world: world3D(-3.5, 3.5, -3.0, 3.0, -3.5, 3.5),
    charges: [
      makeCharge("A", 4.0, -1.6, 0.8, -0.8, "xyz"),
      makeCharge("B", -3.5, 1.7, -0.4, 0.9, "xyz"),
      makeCharge("C", 2.5, 0.1, 1.4, 0.1, "xyz"),
      makeCharge("D", -2.8, -0.6, -1.3, 1.7, "xyz"),
    ],
    targetIndex: 2,
    editIndex: 0,
    massG: 0.5,
    stringLengthCm: 40,
    softening: 0.22,
    is3d: true,
    freeBuilder: true,
    maxCharges: 5,
    view: { yawDeg: -30, pitchDeg: 18 },
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
    world: world2D(-1.7e-14, 1.7e-14, -8.5e-15, 8.5e-15),
    charges: [
      makeCharge("A", 46, -5.9e-15, 0, 0, "x"),
      makeCharge("B", 46, 5.9e-15, 0, 0, "x"),
    ],
    targetIndex: 1,
    editIndex: 0,
    massG: 0.2,
    stringLengthCm: 40,
    softening: 2.2e-15,
    fragmentRadiusM: 5.9e-15,
    is3d: false,
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
    world: world2D(-0.45, 0.45, -0.42, 0.3),
    charges: [
      makeCharge("A", 0.25, -0.12, -0.16, 0, "x"),
      makeCharge("B", 0.25, 0.12, -0.16, 0, "x"),
    ],
    targetIndex: 1,
    editIndex: 0,
    massG: 3.0,
    massByChargeG: [3.0, 3.0],
    stringLengthCm: 36,
    softening: 0.015,
    is3d: false,
  },
};

const state = {
  theme: "dark",
  activity: "inquiry",
  presetKey: "pair",
  charges: [],
  defaultCharges: [],
  targetIndex: 0,
  editIndex: 0,
  massG: 1.0,
  stringLengthCm: 40,
  practiceQuestions: [],
  practiceAnswers: {},
  practiceRevealed: true,
  feedback: "",
  dragIndex: null,
  hoverIndex: null,
  pointerId: null,
  orbiting: false,
  orbitPointerId: null,
  orbitOrigin: null,
  viewYawDeg: CAMERA_DEFAULTS.yawDeg,
  viewPitchDeg: CAMERA_DEFAULTS.pitchDeg,
  viewZoom: 1,
  freeChargeCount: 4,
  chargeMassesG: [],
};

const chargeControlRefs = [];

init();

function init() {
  populatePresetOptions();

  state.theme = localStorage.getItem(STORAGE_KEY_THEME) || "dark";
  state.activity = localStorage.getItem(STORAGE_KEY_ACTIVITY) || "inquiry";
  state.presetKey = localStorage.getItem(STORAGE_KEY_PRESET) || "pair";

  activityMode.value = state.activity;
  showVectors.checked = true;
  showComponents.checked = true;
  showAngles.checked = true;

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
  editChargeSelect.addEventListener("change", () => {
    state.editIndex = Number(editChargeSelect.value);
    syncControlsFromState();
    renderAll();
  });

  massInput.addEventListener("input", () => {
    state.massG = Number(massInput.value);
    onStateChanged();
  });
  massValue.addEventListener("change", () => {
    state.massG = clampNumberInput(massValue, massInput.min, massInput.max, state.massG);
    syncMassControls();
    regeneratePractice();
    renderAll();
  });

  massAInput.addEventListener("input", () => {
    state.chargeMassesG[0] = Number(massAInput.value);
    onStateChanged();
  });
  massAValue.addEventListener("change", () => {
    state.chargeMassesG[0] = clampNumberInput(massAValue, massAInput.min, massAInput.max, state.chargeMassesG[0] ?? 1);
    syncMassControls();
    regeneratePractice();
    renderAll();
  });

  massBInput.addEventListener("input", () => {
    state.chargeMassesG[1] = Number(massBInput.value);
    onStateChanged();
  });
  massBValue.addEventListener("change", () => {
    state.chargeMassesG[1] = clampNumberInput(massBValue, massBInput.min, massBInput.max, state.chargeMassesG[1] ?? 1);
    syncMassControls();
    regeneratePractice();
    renderAll();
  });

  viewYawInput.addEventListener("input", () => {
    state.viewYawDeg = Number(viewYawInput.value);
    renderAll();
    syncViewOutputs();
  });
  viewYawValue.addEventListener("change", () => {
    state.viewYawDeg = clampNumberInput(viewYawValue, viewYawInput.min, viewYawInput.max, state.viewYawDeg);
    syncViewOutputs();
    renderAll();
  });

  viewPitchInput.addEventListener("input", () => {
    state.viewPitchDeg = Number(viewPitchInput.value);
    renderAll();
    syncViewOutputs();
  });
  viewPitchValue.addEventListener("change", () => {
    state.viewPitchDeg = clampNumberInput(viewPitchValue, viewPitchInput.min, viewPitchInput.max, state.viewPitchDeg);
    syncViewOutputs();
    renderAll();
  });

  stringLengthInput.addEventListener("input", () => {
    state.stringLengthCm = Number(stringLengthInput.value);
    onStateChanged();
  });
  stringLengthValue.addEventListener("change", () => {
    state.stringLengthCm = clampNumberInput(stringLengthValue, stringLengthInput.min, stringLengthInput.max, state.stringLengthCm);
    syncStringLengthControls();
    regeneratePractice();
    renderAll();
  });

  chargeCountSelect.addEventListener("change", () => {
    if (!getPreset().freeBuilder) return;
    setFreeChargeCount(Number(chargeCountSelect.value));
  });

  xPositionInput.addEventListener("input", () => updateEditedChargePosition("x", Number(xPositionInput.value)));
  yPositionInput.addEventListener("input", () => updateEditedChargePosition("y", Number(yPositionInput.value)));
  zPositionInput.addEventListener("input", () => updateEditedChargePosition("z", Number(zPositionInput.value)));
  xPositionValue.addEventListener("change", () => updateEditedChargePosition("x", Number(xPositionValue.value), { fromNumber: true }));
  yPositionValue.addEventListener("change", () => updateEditedChargePosition("y", Number(yPositionValue.value), { fromNumber: true }));
  zPositionValue.addEventListener("change", () => updateEditedChargePosition("z", Number(zPositionValue.value), { fromNumber: true }));

  showVectors.addEventListener("change", renderAll);
  showComponents.addEventListener("change", renderAll);
  showAngles.addEventListener("change", renderAll);
  randomizeBtn.addEventListener("click", randomizeScene);
  resetBtn.addEventListener("click", () => loadPreset(state.presetKey));
  checkAnswersBtn.addEventListener("click", checkPracticeAnswers);

  canvas.addEventListener("pointerdown", handlePointerDown);
  canvas.addEventListener("pointermove", handlePointerMove);
  canvas.addEventListener("pointerleave", () => {
    state.hoverIndex = null;
    if (state.dragIndex === null && !state.orbiting) renderAll();
  });
  canvas.addEventListener("pointerup", handlePointerUp);
  canvas.addEventListener("pointercancel", handlePointerUp);
  canvas.addEventListener("wheel", handleWheel, { passive: false });

  window.addEventListener("resize", renderAll);
  teacherGuideDialog.addEventListener("click", (event) => handleDialogBackdrop(event, teacherGuideDialog));
  studentHelpDialog.addEventListener("click", (event) => handleDialogBackdrop(event, studentHelpDialog));

  renderAll();
}

function populatePresetOptions() {
  presetSelect.textContent = "";
  PRESET_ORDER.forEach((key) => {
    const option = document.createElement("option");
    option.value = key;
    option.textContent = PRESETS[key].title;
    presetSelect.append(option);
  });
}

function loadPreset(key) {
  const preset = PRESETS[key];
  if (!preset) return;

  state.presetKey = key;
  state.charges = cloneCharges(preset.charges);
  state.defaultCharges = cloneCharges(preset.charges);
  state.targetIndex = Math.min(preset.targetIndex, state.charges.length - 1);
  state.editIndex = Math.min(preset.editIndex ?? 0, state.charges.length - 1);
  state.massG = preset.massG;
  state.chargeMassesG = preset.massByChargeG ? [...preset.massByChargeG] : state.charges.map(() => preset.massG);
  state.stringLengthCm = preset.stringLengthCm;
  state.practiceAnswers = {};
  state.feedback = "";
  state.practiceRevealed = state.activity !== "practice";
  state.viewYawDeg = preset.view?.yawDeg ?? CAMERA_DEFAULTS.yawDeg;
  state.viewPitchDeg = preset.view?.pitchDeg ?? CAMERA_DEFAULTS.pitchDeg;
  state.viewZoom = preset.view?.zoom ?? 1;
  state.freeChargeCount = preset.freeBuilder ? preset.charges.length : state.freeChargeCount;
  state.dragIndex = null;
  state.pointerId = null;
  state.orbiting = false;
  state.orbitPointerId = null;

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
  applyTheme(state.theme === "light" ? "dark" : "light");
  renderAll();
}

function getPreset() {
  return PRESETS[state.presetKey];
}

function is3DPreset(preset = getPreset()) {
  return Boolean(preset.is3d);
}

function syncControlsFromState() {
  const preset = getPreset();
  const edited = state.charges[state.editIndex];

  activityMode.value = state.activity;
  presetSelect.value = state.presetKey;
  syncMassControls();

  syncStringLengthControls();
  stringLengthWrap.classList.toggle("is-hidden", preset !== PRESETS.equilibrium);
  massWrap.classList.toggle("is-hidden", preset === PRESETS.equilibrium);
  massAWrap.classList.toggle("is-hidden", preset !== PRESETS.equilibrium);
  massBWrap.classList.toggle("is-hidden", preset !== PRESETS.equilibrium);

  viewYawWrap.classList.toggle("is-hidden", !preset.is3d);
  viewPitchWrap.classList.toggle("is-hidden", !preset.is3d);
  editChargeWrap.classList.toggle("is-hidden", !preset.is3d);
  xPositionWrap.classList.toggle("is-hidden", !preset.is3d);
  yPositionWrap.classList.toggle("is-hidden", !preset.is3d);
  zPositionWrap.classList.toggle("is-hidden", !preset.is3d);
  chargeCountWrap.classList.toggle("is-hidden", !preset.freeBuilder);
  showAngles.closest("label").classList.toggle("is-hidden", !preset.is3d);

  syncViewOutputs();

  targetSelect.textContent = "";
  editChargeSelect.textContent = "";
  state.charges.forEach((charge, index) => {
    const targetOption = document.createElement("option");
    targetOption.value = String(index);
    targetOption.textContent = `Charge ${charge.label}`;
    targetSelect.append(targetOption);

    const editOption = document.createElement("option");
    editOption.value = String(index);
    editOption.textContent = `Charge ${charge.label}`;
    editChargeSelect.append(editOption);
  });
  targetSelect.value = String(state.targetIndex);
  editChargeSelect.value = String(state.editIndex);

  chargeCountSelect.value = String(state.charges.length);
  syncPositionEditor(edited, preset);
  syncChargeControls();
}

function syncViewOutputs() {
  viewYawInput.value = String(Math.round(state.viewYawDeg));
  viewYawValue.value = formatFixed(state.viewYawDeg, 0);
  viewPitchInput.value = String(Math.round(state.viewPitchDeg));
  viewPitchValue.value = formatFixed(state.viewPitchDeg, 0);
}

function syncMassControls() {
  const preset = getPreset();
  massValue.min = massInput.min;
  massValue.max = massInput.max;
  massValue.step = massInput.step;
  massInput.value = String(state.massG);
  massValue.value = formatFixed(state.massG, 1);

  if (preset === PRESETS.equilibrium) {
    const massA = state.chargeMassesG[0] ?? preset.massG;
    const massB = state.chargeMassesG[1] ?? preset.massG;
    massAValue.min = massAInput.min;
    massAValue.max = massAInput.max;
    massAValue.step = massAInput.step;
    massBValue.min = massBInput.min;
    massBValue.max = massBInput.max;
    massBValue.step = massBInput.step;
    massAInput.value = String(massA);
    massAValue.value = formatFixed(massA, 1);
    massBInput.value = String(massB);
    massBValue.value = formatFixed(massB, 1);
  }
}

function syncStringLengthControls() {
  stringLengthInput.value = String(state.stringLengthCm);
  stringLengthValue.value = String(Math.round(state.stringLengthCm));
}

function syncPositionEditor(charge, preset) {
  if (!charge) return;

  xPositionInput.min = String(preset.world.minX);
  xPositionInput.max = String(preset.world.maxX);
  yPositionInput.min = String(preset.world.minY);
  yPositionInput.max = String(preset.world.maxY);
  zPositionInput.min = String(preset.world.minZ);
  zPositionInput.max = String(preset.world.maxZ);
  xPositionValue.min = xPositionInput.min;
  xPositionValue.max = xPositionInput.max;
  xPositionValue.step = xPositionInput.step;
  yPositionValue.min = yPositionInput.min;
  yPositionValue.max = yPositionInput.max;
  yPositionValue.step = yPositionInput.step;
  zPositionValue.min = zPositionInput.min;
  zPositionValue.max = zPositionInput.max;
  zPositionValue.step = zPositionInput.step;

  xPositionInput.value = String(charge.x);
  yPositionInput.value = String(charge.y);
  zPositionInput.value = String(charge.z);

  xPositionValue.value = formatFixed(charge.x, 1);
  yPositionValue.value = formatFixed(charge.y, 1);
  zPositionValue.value = formatFixed(charge.z, 1);
}

function renderChargeControls() {
  const preset = getPreset();
  chargeControlList.textContent = "";
  chargeControlRefs.length = 0;

  state.charges.forEach((charge, index) => {
    const row = document.createElement("label");
    row.className = "charge-control";
    row.dataset.charge = charge.label;

    const titleRow = document.createElement("div");
    titleRow.className = "charge-control-head";

    const title = document.createElement("span");
    title.textContent = `Charge ${charge.label} (${preset.chargeUnitShort})`;

    const meta = document.createElement("span");
    const tags = [];
    if (index === state.targetIndex) tags.push("target");
    if (index === state.editIndex && preset.is3d) tags.push("editing");
    meta.textContent = tags.join(" · ");

    titleRow.append(title, meta);

    const range = document.createElement("div");
    range.className = "range-row";

    const input = document.createElement("input");
    input.type = "range";
    input.min = String(preset.chargeRange.min);
    input.max = String(preset.chargeRange.max);
    input.step = String(preset.chargeRange.step);
    input.value = String(charge.value);

    const output = document.createElement("input");
    output.type = "number";
    output.min = String(preset.chargeRange.min);
    output.max = String(preset.chargeRange.max);
    output.step = String(preset.chargeRange.step);
    output.value = formatChargeControlValue(charge.value, preset);

    input.addEventListener("input", () => {
      state.charges[index].value = Number(input.value);
      output.value = formatChargeControlValue(state.charges[index].value, preset);
      onStateChanged();
    });

    output.addEventListener("change", () => {
      state.charges[index].value = clampNumberInput(output, input.min, input.max, state.charges[index].value);
      if (document.activeElement !== input) {
        input.value = String(state.charges[index].value);
      }
      regeneratePractice();
      renderAll();
      syncChargeControls();
    });

    range.append(input, output);
    row.append(titleRow, range);
    chargeControlList.append(row);

    chargeControlRefs.push({
      row,
      title,
      meta,
      input,
      output,
    });
  });
}

function syncChargeControls() {
  const preset = getPreset();

  if (chargeControlRefs.length !== state.charges.length) {
    renderChargeControls();
  }

  state.charges.forEach((charge, index) => {
    const refs = chargeControlRefs[index];
    if (!refs) return;

    refs.row.dataset.charge = charge.label;
    refs.title.textContent = `Charge ${charge.label} (${preset.chargeUnitShort})`;

    const tags = [];
    if (index === state.targetIndex) tags.push("target");
    if (index === state.editIndex && preset.is3d) tags.push("editing");
    refs.meta.textContent = tags.join(" · ");

    refs.input.min = String(preset.chargeRange.min);
    refs.input.max = String(preset.chargeRange.max);
    refs.input.step = String(preset.chargeRange.step);
    refs.output.min = String(preset.chargeRange.min);
    refs.output.max = String(preset.chargeRange.max);
    refs.output.step = String(preset.chargeRange.step);
    if (document.activeElement !== refs.input) {
      refs.input.value = String(charge.value);
    }
    if (document.activeElement !== refs.output) {
      refs.output.value = formatChargeControlValue(charge.value, preset);
    }
  });
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
  state.practiceQuestions = buildPracticeQuestions(computeAnalysis());
  renderPracticeQuestions();
}

function buildPracticeQuestions(analysis) {
  if (!analysis) return [];

  const primary = analysis.strongestContribution || analysis.contributions[0];
  const directionOptions = analysis.preset.is3d
    ? ["Mostly +x", "Mostly -x", "Mostly +y", "Mostly -y", "Mostly +z", "Mostly -z", "Near zero"]
    : ["Right", "Left", "Up", "Down", "Near zero"];

  const questions = [
    {
      id: "direction",
      prompt: `The net force on charge ${analysis.target.label} points mostly...`,
      options: directionOptions,
      answer: analysis.directionLabel,
      explanation: `The current net vector is ${analysis.directionLabel.toLowerCase()} based on the combined components.`,
    },
    {
      id: "interaction",
      prompt: `The interaction between charge ${primary.source.label} and charge ${analysis.target.label} is...`,
      options: ["Attractive", "Repulsive", "Zero"],
      answer: capitalize(primary.interaction),
      explanation: `Opposite signs attract and like signs repel. These two charges are ${primary.interaction}.`,
    },
  ];

  if (analysis.preset.is3d) {
    questions.push({
      id: "angles",
      prompt: `Which angle pair best describes the current net-force orientation on charge ${analysis.target.label}?`,
      options: [
        "Small azimuth, small elevation",
        "Large azimuth, small elevation",
        "Small azimuth, large elevation",
        "Large azimuth, large elevation",
      ],
      answer: classifyAngleBucket(analysis.azimuthDeg, analysis.elevationDeg),
      explanation: `Use the displayed azimuth and elevation guides. Right now the force is at azimuth ${formatFixed(
        analysis.azimuthDeg,
        1,
      )} deg and elevation ${formatFixed(analysis.elevationDeg, 1)} deg.`,
    });
  } else if (analysis.contributions.length > 1) {
    questions.push({
      id: "dominant",
      prompt: `Which source currently contributes the largest force magnitude on charge ${analysis.target.label}?`,
      options: analysis.contributions.map((item) => `Charge ${item.source.label}`),
      answer: `Charge ${primary.source.label}`,
      explanation: `Charge ${primary.source.label} has the largest individual |F| in the breakdown table.`,
    });
  } else {
    questions.push({
      id: "scaling",
      prompt: `If the separation between charges ${primary.source.label} and ${analysis.target.label} doubles, that single force becomes...`,
      options: ["4x as large", "2x as large", "1/2 as large", "1/4 as large"],
      answer: "1/4 as large",
      explanation: "Coulomb's law is inverse square in distance, so doubling r makes the force one fourth as large.",
    });
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
    if (state.practiceAnswers[question.id] === question.answer) {
      correct += 1;
    } else {
      explanations.push(`${question.answer}. ${question.explanation}`);
    }
  });

  state.practiceRevealed = true;
  state.feedback =
    correct === state.practiceQuestions.length
      ? `${correct}/${state.practiceQuestions.length}. Your qualitative reasoning matches the current force model.`
      : `${correct}/${state.practiceQuestions.length}. First correction: ${
          explanations[0] || "Check the force breakdown table and compare the source contributions."
        }`;

  feedbackLine.textContent = state.feedback;
  renderAll();
}

function computeAnalysis() {
  const preset = getPreset();
  if (preset === PRESETS.equilibrium) {
    syncSharedPivotEquilibriumGeometry(preset);
  }
  const target = state.charges[state.targetIndex];
  const qTarget = target.value * preset.chargeScale;
  const contributions = [];
  let netFx = 0;
  let netFy = 0;
  let netFz = 0;

  state.charges.forEach((source, index) => {
    if (index === state.targetIndex) return;

    let dx = target.x - source.x;
    let dy = target.y - source.y;
    let dz = target.z - source.z;
    let rawDistance = Math.hypot(dx, dy, dz);

    if (rawDistance < 1e-12) {
      dx = preset.softening;
      dy = 0;
      dz = 0;
      rawDistance = preset.softening;
    }

    const effectiveDistance = Math.max(rawDistance, preset.softening);
    const scale = K * qTarget * source.value * preset.chargeScale / Math.pow(effectiveDistance, 3);
    const fx = scale * dx;
    const fy = scale * dy;
    const fz = scale * dz;
    const magnitude = Math.hypot(fx, fy, fz);
    const interaction = qTarget * source.value * preset.chargeScale >= 0 ? "repulsive" : "attractive";

    netFx += fx;
    netFy += fy;
    netFz += fz;

    contributions.push({
      source,
      sourceIndex: index,
      rawDistance,
      effectiveDistance,
      fx,
      fy,
      fz,
      magnitude,
      interaction,
      midpoint: {
        x: source.x + (target.x - source.x) / 2,
        y: source.y + (target.y - source.y) / 2,
        z: source.z + (target.z - source.z) / 2,
      },
      azimuthDeg: Math.atan2(dz, dx) * (180 / Math.PI),
      elevationDeg: Math.atan2(dy, Math.hypot(dx, dz)) * (180 / Math.PI),
    });
  });

  const netMagnitude = Math.hypot(netFx, netFy, netFz);
  const strongestContribution = contributions.reduce((best, item) => (item.magnitude > (best?.magnitude ?? 0) ? item : best), null);
  const massKg =
    preset === PRESETS.equilibrium
      ? (state.chargeMassesG[state.targetIndex] ?? preset.massG) / 1000
      : state.massG / 1000;
  const equilibrium = preset === PRESETS.equilibrium ? buildEquilibriumSummary(preset, contributions[0], massKg) : null;

  return {
    preset,
    target,
    contributions,
    netFx,
    netFy,
    netFz,
    netMagnitude,
    azimuthDeg: netMagnitude < 1e-18 ? 0 : Math.atan2(netFz, netFx) * (180 / Math.PI),
    elevationDeg: netMagnitude < 1e-18 ? 0 : Math.atan2(netFy, Math.hypot(netFx, netFz)) * (180 / Math.PI),
    strongestContribution,
    acceleration: massKg > 0 ? netMagnitude / massKg : 0,
    directionLabel: classifyDirection(netFx, netFy, netFz, netMagnitude, preset.is3d),
    massKg,
    equilibrium,
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
      : preset.is3d
        ? `Inquiry mode: rotate the scene, compare the 3D force arrows, and explain the net-force model on ${targetLabel}. ${strongest}`
        : `Inquiry mode: drag the charges, compare the arrows, and explain the force model on ${targetLabel}. ${strongest}`;

  presetPrompt.textContent = preset.prompt;
  arenaPrompt.textContent =
    state.activity === "practice"
      ? `Before revealing the numbers, predict the direction of the net force on ${targetLabel} and which source matters most.`
      : preset.is3d
        ? `Rotate ${preset.shortTitle}, then connect the 3D arrow picture to Fx, Fy, Fz, azimuth, and elevation for ${targetLabel}.`
        : `Use ${preset.shortTitle} to connect the visual force arrows to the math model for ${targetLabel}.`;

  sceneCaption.textContent = `${preset.description} ${
    preset.is3d
      ? "Use the yaw/pitch controls or drag empty space to rotate the scene, then scroll to zoom."
      : "Drag a charge to change the separation r and watch the vector picture respond."
  }`;
  teacherNote.textContent = `${preset.teacherUse} Source connection: ${preset.docRef}`;

  if (preset === PRESETS.equilibrium) {
    formulaLine.textContent = analysis.equilibrium?.isBalanced
      ? `${preset.formulaNote} Here the strings share one pivot, and equilibrium occurs when tension, weight, and electric force sum to zero. Current angle: ${formatFixed(
          analysis.equilibrium.thetaTargetDeg,
          1,
        )} deg.`
      : `${preset.formulaNote} With opposite-sign charges from one shared pivot, there is no static separated equilibrium; the spheres collapse inward instead of balancing.`;
  } else if (preset === PRESETS.fission && analysis.contributions[0]) {
    const gap = Math.max(0, analysis.contributions[0].rawDistance - 2 * preset.fragmentRadiusM);
    formulaLine.textContent = `${preset.formulaNote} Surface gap: ${formatDistance(gap, preset)}.`;
  } else if (preset.is3d) {
    formulaLine.textContent = `${preset.formulaNote} Current net-force orientation: azimuth ${formatFixed(
      analysis.azimuthDeg,
      1,
    )} deg, elevation ${formatFixed(analysis.elevationDeg, 1)} deg.`;
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
          note: "Use the vector picture and geometry before pressing Check reasoning.",
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
          : `Direction: ${analysis.directionLabel.toLowerCase()}.`,
    },
    { title: "Fx", value: formatForce(analysis.netFx), note: "X component of the net force." },
    { title: "Fy", value: formatForce(analysis.netFy), note: "Y component of the net force." },
    { title: "Fz", value: formatForce(analysis.netFz), note: preset.is3d ? "Depth component of the net force." : "Zero for planar presets." },
    {
      title: "Acceleration",
      value: `${formatScientific(analysis.acceleration, 3)} m/s^2`,
      note:
        preset === PRESETS.equilibrium
          ? `Using mass of charge ${analysis.target.label}: ${formatFixed(state.chargeMassesG[state.targetIndex] ?? preset.massG, 1)} g.`
          : `Using target mass ${formatFixed(state.massG, 1)} g.`,
    },
  ];

  if (analysis.strongestContribution) {
    cards.push({
      title: "Strongest source",
      value: `Charge ${analysis.strongestContribution.source.label}`,
      note: `At ${formatDistance(analysis.strongestContribution.rawDistance, preset)} with an ${analysis.strongestContribution.interaction} interaction.`,
    });
  }

  if (preset.is3d) {
    cards.push(
      {
        title: "Azimuth",
        value: `${formatFixed(analysis.azimuthDeg, 1)} deg`,
        note: "Measured in the x-z plane from +x toward +z.",
      },
      {
        title: "Elevation",
        value: `${formatFixed(analysis.elevationDeg, 1)} deg`,
        note: "Measured above the x-z plane toward +y.",
      },
    );
  }

  if (preset === PRESETS.equilibrium) {
    const theta = analysis.equilibrium?.thetaTargetDeg ?? equilibriumAngleDeg(analysis.netMagnitude, analysis.massKg);
    cards.push(
      {
        title: "Mass A",
        value: `${formatFixed(state.chargeMassesG[0] ?? preset.massG, 1)} g`,
        note: "Independent hanging mass for charge A.",
      },
      {
        title: "Mass B",
        value: `${formatFixed(state.chargeMassesG[1] ?? preset.massG, 1)} g`,
        note: "Independent hanging mass for charge B.",
      },
    );
    cards.push({
      title: "Equilibrium angle",
      value: analysis.equilibrium?.isBalanced ? `${formatFixed(theta, 1)} deg` : "No static balance",
      note: analysis.equilibrium?.isBalanced
        ? "At equilibrium, the string tilts until tension cancels weight and electric force."
        : "Opposite-sign charges from the same pivot do not have a stable separated equilibrium.",
    });
  }

  if (preset === PRESETS.fission && analysis.contributions[0]) {
    cards.push({
      title: "Center separation",
      value: formatDistance(analysis.contributions[0].rawDistance, preset),
      note: `Each fragment is modeled with radius ${formatDistance(preset.fragmentRadiusM, preset)}.`,
    });
  }

  return cards;
}

function renderForceTable(analysis) {
  const hideNumbers = state.activity === "practice" && !state.practiceRevealed;
  forceTableBody.textContent = "";

  if (hideNumbers) {
    appendTableMessage("Practice mode is hiding the quantitative breakdown. Press Check reasoning to reveal it.");
    return;
  }

  if (!analysis.contributions.length) {
    appendTableMessage("No source charges are available.");
    return;
  }

  analysis.contributions.forEach((item) => {
    const row = document.createElement("tr");
    [
      `Charge ${item.source.label}`,
      formatDistance(item.rawDistance, analysis.preset),
      capitalize(item.interaction),
      formatForce(item.fx),
      formatForce(item.fy),
      formatForce(item.fz),
      formatForce(item.magnitude),
    ].forEach((value) => {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.append(cell);
    });
    forceTableBody.append(row);
  });
}

function appendTableMessage(text) {
  const row = document.createElement("tr");
  const cell = document.createElement("td");
  cell.colSpan = 7;
  cell.textContent = text;
  row.append(cell);
  forceTableBody.append(row);
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
    if (analysis.preset.is3d) {
      draw3DReferenceFrame(analysis.preset, palette, width, height);
    } else {
      drawGrid(width, height, palette);
    }
  }

  const projectedCharges = state.charges
    .map((charge, index) => ({ charge, index, ...projectCharge(charge, analysis.preset, width, height) }))
    .sort((a, b) => a.depth - b.depth);

  if (showVectors.checked && showComponents.checked) {
    drawGeometryHelpers(projectedCharges, analysis, palette, width, height);
  }

  if (showVectors.checked) {
    drawForceVectors(projectedCharges, analysis, palette, width, height);
  }

  if (analysis.preset === PRESETS.triangle) {
    drawTriangleAxes(width, height, analysis.preset, palette);
  }

  if (analysis.preset === PRESETS.equilibrium) {
    drawEquilibriumDecorations(projectedCharges, analysis, palette, width, height);
  }

  drawCharges(projectedCharges, analysis, palette);
  drawSceneAnnotations(projectedCharges, analysis, palette, width, height);
}

function drawGrid(width, height, palette) {
  ctx.save();
  ctx.strokeStyle = palette.grid;
  ctx.lineWidth = 1;

  for (let i = 1; i < 8; i += 1) {
    const x = (width / 8) * i;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  for (let i = 1; i < 6; i += 1) {
    const y = (height / 6) * i;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  ctx.restore();
}

function draw3DReferenceFrame(preset, palette, width, height) {
  const origin = projectWorldPoint({ x: 0, y: 0, z: 0 }, preset, width, height);
  const span = maxWorldSpan(preset) * 0.32;
  const axes = [
    { label: "x", point: { x: span, y: 0, z: 0 }, color: palette.axis },
    { label: "y", point: { x: 0, y: span, z: 0 }, color: palette.helper },
    { label: "z", point: { x: 0, y: 0, z: span }, color: palette.net },
  ];

  ctx.save();
  ctx.setLineDash([5, 5]);
  axes.forEach((axis) => {
    const end = projectWorldPoint(axis.point, preset, width, height);
    ctx.strokeStyle = axis.color;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(origin.x, origin.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
    drawLabel(axis.label, end.x + 12, end.y, palette.labelBg, palette.labelText);
  });
  ctx.restore();
}

function drawGeometryHelpers(projectedCharges, analysis, palette, width, height) {
  const target = projectedCharges.find((item) => item.index === state.targetIndex);
  if (!target) return;
  const suppressDistanceLabels = analysis.preset === PRESETS.equilibrium;

  ctx.save();
  ctx.setLineDash([6, 6]);
  ctx.lineWidth = 1.3;
  ctx.strokeStyle = palette.helper;

  analysis.contributions.forEach((item) => {
    const source = projectedCharges.find((projected) => projected.index === item.sourceIndex);
    if (!source) return;
    ctx.beginPath();
    ctx.moveTo(source.x, source.y);
    ctx.lineTo(target.x, target.y);
    ctx.stroke();
    if (!suppressDistanceLabels) {
      drawLabel(
        formatDistance(item.rawDistance, analysis.preset),
        (source.x + target.x) / 2,
        (source.y + target.y) / 2 - 14,
        palette.labelBg,
        palette.labelText,
      );
    }
  });

  if (shouldDrawComponents(analysis)) {
    if (analysis.preset.is3d) {
      draw3DComponentPath(target.charge, analysis, palette, width, height);
    } else {
      draw2DComponentPath(target, analysis, palette, width, height);
    }
  }

  ctx.restore();
}

function draw2DComponentPath(target, analysis, palette, width, height) {
  const dimensions = getWorldToCanvasScale(analysis.preset, width, height);
  const end = buildScreenVectorEnd(target, { x: analysis.netFx, y: analysis.netFy, z: 0 }, analysis.netMagnitude, dimensions, 132);
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

function draw3DComponentPath(targetCharge, analysis, palette, width, height) {
  const worldLength = maxWorldSpan(analysis.preset) * 0.38;
  const scaledVector = scaleVectorToLength(
    { x: analysis.netFx, y: analysis.netFy, z: analysis.netFz },
    worldLength,
  );
  const start = projectWorldPoint(targetCharge, analysis.preset, width, height);
  const xPoint = projectWorldPoint({ x: targetCharge.x + scaledVector.x, y: targetCharge.y, z: targetCharge.z }, analysis.preset, width, height);
  const xyPoint = projectWorldPoint(
    { x: targetCharge.x + scaledVector.x, y: targetCharge.y + scaledVector.y, z: targetCharge.z },
    analysis.preset,
    width,
    height,
  );
  const xyzPoint = projectWorldPoint(
    { x: targetCharge.x + scaledVector.x, y: targetCharge.y + scaledVector.y, z: targetCharge.z + scaledVector.z },
    analysis.preset,
    width,
    height,
  );

  ctx.setLineDash([4, 4]);
  ctx.strokeStyle = palette.axis;
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(xPoint.x, xPoint.y);
  ctx.lineTo(xyPoint.x, xyPoint.y);
  ctx.lineTo(xyzPoint.x, xyzPoint.y);
  ctx.stroke();

  drawLabel("Fx", midpoint(start, xPoint).x, midpoint(start, xPoint).y - 16, palette.labelBg, palette.labelText);
  drawLabel("Fy", midpoint(xPoint, xyPoint).x + 20, midpoint(xPoint, xyPoint).y, palette.labelBg, palette.labelText);
  drawLabel("Fz", midpoint(xyPoint, xyzPoint).x + 20, midpoint(xyPoint, xyzPoint).y, palette.labelBg, palette.labelText);

  if (showAngles.checked && analysis.netMagnitude > 0) {
    draw3DAngleGuides(targetCharge, scaledVector, analysis, palette, width, height);
  }
}

function draw3DAngleGuides(targetCharge, scaledVector, analysis, palette, width, height) {
  const arcRadius = maxWorldSpan(analysis.preset) * 0.16;
  const azimuthEnd = buildArcPoints(targetCharge, arcRadius, 0, rad(analysis.azimuthDeg), "azimuth");
  const elevationEnd = buildArcPoints(targetCharge, arcRadius, 0, rad(analysis.elevationDeg), "elevation", analysis.azimuthDeg);

  ctx.save();
  ctx.strokeStyle = palette.equilibrium;
  ctx.lineWidth = 2;
  drawProjectedPolyline(azimuthEnd, analysis.preset, width, height);
  drawProjectedPolyline(elevationEnd, analysis.preset, width, height);
  ctx.restore();

  const azLabelPoint = projectWorldPoint(azimuthEnd[Math.floor(azimuthEnd.length / 2)], analysis.preset, width, height);
  const elLabelPoint = projectWorldPoint(elevationEnd[Math.floor(elevationEnd.length / 2)], analysis.preset, width, height);

  drawLabel(`Az ${formatFixed(analysis.azimuthDeg, 1)} deg`, azLabelPoint.x + 18, azLabelPoint.y - 10, palette.labelBg, palette.labelText);
  drawLabel(`El ${formatFixed(analysis.elevationDeg, 1)} deg`, elLabelPoint.x + 18, elLabelPoint.y - 10, palette.labelBg, palette.labelText);
}

function drawForceVectors(projectedCharges, analysis, palette, width, height) {
  if (analysis.preset === PRESETS.equilibrium) {
    return;
  }

  const targetProjected = projectedCharges.find((item) => item.index === state.targetIndex);
  if (!targetProjected) return;

  const maxMagnitude = Math.max(analysis.netMagnitude, ...analysis.contributions.map((item) => item.magnitude), 1e-30);
  const showContributionVectors = analysis.contributions.length > 1;

  analysis.contributions.forEach((item) => {
    if (!showContributionVectors) return;
    const length = mapMagnitude(item.magnitude, maxMagnitude, 34, analysis.preset.is3d ? 96 : 112);
    const end = buildProjectedVectorEnd(
      targetProjected.charge,
      { x: item.fx, y: item.fy, z: item.fz },
      item.magnitude,
      analysis.preset,
      width,
      height,
      length,
    );
    drawArrow(targetProjected, end, palette.contribution, 3);
    drawLabel(`F${item.source.label}`, end.x, end.y - 16, palette.labelBg, palette.labelText);
  });

  if (analysis.netMagnitude > 0) {
    const length = mapMagnitude(analysis.netMagnitude, maxMagnitude, 54, analysis.preset.is3d ? 138 : 156);
    const end = buildProjectedVectorEnd(
      targetProjected.charge,
      { x: analysis.netFx, y: analysis.netFy, z: analysis.netFz },
      analysis.netMagnitude,
      analysis.preset,
      width,
      height,
      length,
    );
    drawArrow(targetProjected, end, palette.net, 4.5);
    drawLabel(showContributionVectors ? "Fnet" : `F${analysis.contributions[0].source.label} on ${analysis.target.label}`, end.x, end.y - 18, palette.labelBg, palette.labelText);
  }
}

function drawEquilibriumDecorations(projectedCharges, analysis, palette, width, height) {
  const targetCharge = state.charges[state.targetIndex];
  const equilibrium = analysis.equilibrium;
  const pivotPoint = worldToCanvas(0, equilibrium?.pivotY ?? 0.18, analysis.preset, width, height);
  const supports = projectedCharges.map(({ charge, x, y, index }) => ({
    charge,
    point: { x, y },
    anchorPoint: pivotPoint,
    index,
  }));

  ctx.save();
  ctx.strokeStyle = palette.outline;
  ctx.lineWidth = 3;
  const supportY = pivotPoint.y;

  ctx.beginPath();
  ctx.moveTo(40, supportY);
  ctx.lineTo(width - 40, supportY);
  ctx.stroke();

  supports.forEach((item) => {
    ctx.strokeStyle = palette.helper;
    ctx.beginPath();
    ctx.moveTo(item.anchorPoint.x, item.anchorPoint.y);
    ctx.lineTo(item.point.x, item.point.y);
    ctx.stroke();
  });
  ctx.fillStyle = palette.outline;
  ctx.beginPath();
  ctx.arc(pivotPoint.x, pivotPoint.y, 5, 0, Math.PI * 2);
  ctx.fill();

  const targetSupport = supports.find((item) => item.index === state.targetIndex);
  const sourceSupport = supports.find((item) => item.index !== state.targetIndex);
  if (!targetSupport) {
    ctx.restore();
    return;
  }
  const theta = equilibrium?.thetaTargetDeg ?? equilibriumAngleDeg(analysis.netMagnitude, analysis.massKg);
  if (equilibrium?.isBalanced) {
    drawEquilibriumPivotAngleArc(targetSupport.anchorPoint, targetSupport.point, theta, palette, targetSupport.point.x >= targetSupport.anchorPoint.x ? 1 : -1);
  }

  if (showVectors.checked) {
    const forceMax = Math.max(equilibrium?.tensionTargetN ?? 0, equilibrium?.weightTargetN ?? 0, equilibrium?.forceElectricN ?? 0, 1e-9);
    const tensionLength = mapMagnitude(equilibrium?.tensionTargetN ?? 0, forceMax, 44, 96);
    const weightLength = mapMagnitude(equilibrium?.weightTargetN ?? 0, forceMax, 44, 96);
    const electricLength = mapMagnitude(equilibrium?.forceElectricN ?? 0, forceMax, 44, 96);

    const tensionEnd = pointAlongLine(targetSupport.point, targetSupport.anchorPoint, tensionLength);
    drawArrow(targetSupport.point, tensionEnd, palette.equilibrium, 3.2);
    const tensionLabel = offsetPointFromSegment(
      targetSupport.point,
      tensionEnd,
      0.54,
      targetSupport.point.x >= targetSupport.anchorPoint.x ? 22 : -22,
    );
    drawLabel("T", tensionLabel.x, tensionLabel.y, palette.labelBg, palette.labelText);

    const weightEnd = { x: targetSupport.point.x, y: targetSupport.point.y + weightLength };
    drawArrow(targetSupport.point, weightEnd, "#6C7E88", 3.2);
    const weightLabel = offsetPointFromSegment(targetSupport.point, weightEnd, 0.6, 26, 10);
    drawLabel("mg", weightLabel.x, weightLabel.y, palette.labelBg, palette.labelText);

    const electricEnd = sourceSupport
      ? buildAlignedEquilibriumForceEnd(targetSupport.point, sourceSupport.point, analysis.contributions[0], electricLength)
      : { x: targetSupport.point.x - electricLength, y: targetSupport.point.y };
    drawArrow(targetSupport.point, electricEnd, palette.net, 3.8);
    const electricLabel = offsetPointFromSegment(
      targetSupport.point,
      electricEnd,
      0.58,
      electricEnd.x >= targetSupport.point.x ? -20 : 20,
    );
    drawLabel("Fe", electricLabel.x, electricLabel.y, palette.labelBg, palette.labelText);
  }

  const distanceLabelY = sourceSupport
    ? Math.max(sourceSupport.point.y, targetSupport.point.y) - 30
    : targetSupport.point.y - 30;
  if (sourceSupport) {
    drawLabel(
      formatDistance(analysis.contributions[0]?.rawDistance ?? 0, analysis.preset),
      midpoint(sourceSupport.point, targetSupport.point).x,
      distanceLabelY,
      palette.labelBg,
      palette.labelText,
    );
  }

  drawLabel(
    equilibrium?.isBalanced ? `${formatFixed(theta, 1)} deg` : "No static equilibrium",
    targetSupport.anchorPoint.x,
    targetSupport.anchorPoint.y + 36,
    palette.labelBg,
    palette.labelText,
  );
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

function drawEquilibriumPivotAngleArc(pivotPoint, bobPoint, theta, palette, side) {
  const radius = 30;
  const startAngle = Math.PI / 2;
  const endAngle = side >= 0 ? startAngle - rad(theta) : startAngle + rad(theta);

  ctx.save();
  ctx.strokeStyle = palette.equilibrium;
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.arc(pivotPoint.x, pivotPoint.y, radius, Math.min(startAngle, endAngle), Math.max(startAngle, endAngle), side < 0);
  ctx.stroke();
  ctx.restore();
}

function buildAlignedEquilibriumForceEnd(targetPoint, sourcePoint, contribution, length) {
  const dx = sourcePoint.x - targetPoint.x;
  const dy = sourcePoint.y - targetPoint.y;
  const magnitude = Math.hypot(dx, dy) || 1;
  const towardSource = { x: dx / magnitude, y: dy / magnitude };
  const direction =
    contribution?.interaction === "attractive"
      ? towardSource
      : { x: -towardSource.x, y: -towardSource.y };

  return {
    x: targetPoint.x + direction.x * length,
    y: targetPoint.y + direction.y * length,
  };
}

function pointAlongLine(start, end, length) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const magnitude = Math.hypot(dx, dy) || 1;
  return {
    x: start.x + (dx / magnitude) * length,
    y: start.y + (dy / magnitude) * length,
  };
}

function offsetPointFromSegment(start, end, ratio, normalOffset = 0, tangentOffset = 0) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const magnitude = Math.hypot(dx, dy) || 1;
  const unitX = dx / magnitude;
  const unitY = dy / magnitude;
  const normalX = -unitY;
  const normalY = unitX;

  return {
    x: start.x + dx * ratio + unitX * tangentOffset + normalX * normalOffset,
    y: start.y + dy * ratio + unitY * tangentOffset + normalY * normalOffset,
  };
}

function drawCharges(projectedCharges, analysis, palette) {
  projectedCharges.forEach(({ charge, index, x, y, depth }) => {
    const isTarget = index === state.targetIndex;
    const isEditing = index === state.editIndex && analysis.preset.is3d;
    const radius = isTarget ? 22 : 17;
    const depthScale = analysis.preset.is3d ? clamp(1 - depth * 0.14, 0.78, 1.18) : 1;
    const drawRadius = radius * depthScale;
    const fill = charge.value >= 0 ? palette.positive : palette.negative;

    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, drawRadius, 0, Math.PI * 2);
    ctx.fillStyle = fill;
    ctx.shadowColor = fill;
    ctx.shadowBlur = isTarget ? 18 : 10;
    ctx.fill();
    ctx.restore();

    ctx.beginPath();
    ctx.arc(x, y, drawRadius, 0, Math.PI * 2);
    ctx.lineWidth = isTarget ? 4 : isEditing ? 3 : 2;
    ctx.strokeStyle = isTarget ? palette.target : isEditing ? palette.net : palette.outline;
    ctx.stroke();

    ctx.fillStyle = palette.signText;
    ctx.font = `700 ${isTarget ? 17 : 14}px "Space Grotesk", sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(charge.value >= 0 ? "+" : "-", x, y);

    drawLabel(`${charge.label}: ${formatChargeValue(charge.value, analysis.preset)}`, x, y + drawRadius + 18, palette.labelBg, palette.labelText);

    if (isTarget) {
      drawLabel("target", x, y - drawRadius - 18, palette.targetLabelBg, palette.targetLabelText);
    } else if (isEditing) {
      drawLabel("editing", x, y - drawRadius - 18, palette.labelBg, palette.labelText);
    }
  });
}

function drawSceneAnnotations(projectedCharges, analysis, palette, width, height) {
  const infoLines = [
    `Target: charge ${analysis.target.label}`,
    `${analysis.preset === PRESETS.equilibrium ? "Current electric force" : "Current net force"}: ${formatForce(analysis.netMagnitude)}`,
    `Direction: ${analysis.directionLabel}`,
  ];

  if (analysis.preset.is3d) {
    infoLines.push(`Azimuth: ${formatFixed(analysis.azimuthDeg, 1)} deg`);
    infoLines.push(`Elevation: ${formatFixed(analysis.elevationDeg, 1)} deg`);
  }

  if (analysis.preset === PRESETS.equilibrium) {
    infoLines.push(
      analysis.equilibrium?.isBalanced
        ? `Equilibrium angle: ${formatFixed(analysis.equilibrium.thetaTargetDeg, 1)} deg`
        : "Opposite signs: no static separated equilibrium",
    );
  }

  if (analysis.preset === PRESETS.fission && analysis.contributions[0]) {
    infoLines.push(`Center separation: ${formatDistance(analysis.contributions[0].rawDistance, analysis.preset)}`);
  }

  let y = 18;
  infoLines.forEach((line) => {
    drawLabel(line, 18, y, palette.labelBg, palette.labelText, "left");
    y += 28;
  });

  const footerText = analysis.preset.is3d
    ? "Drag empty space to rotate. Click a charge to edit its 3D position."
    : analysis.preset === PRESETS.equilibrium
      ? "Use charge, mass, and string sliders to test the shared-pivot equilibrium."
      : "Drag a charge to change r";
  drawLabel(footerText, 18, height - 30, palette.labelBg, palette.labelText, "left");
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
  const width = metrics.width + padX * 2;
  const height = 24;
  const left = align === "left" ? x : x - width / 2;
  roundRect(ctx, left, y - height / 2, width, height, Math.min(width / 2, height / 2));
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
  const height = Math.max(360, Math.min(660, width * 0.56));
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
  return {
    x: padX + ((x - preset.world.minX) / (preset.world.maxX - preset.world.minX)) * usableWidth,
    y: height - padY - ((y - preset.world.minY) / (preset.world.maxY - preset.world.minY)) * usableHeight,
    depth: 0,
  };
}

function projectCharge(charge, preset, width, height) {
  const projected = preset.is3d ? projectWorldPoint(charge, preset, width, height) : worldToCanvas(charge.x, charge.y, preset, width, height);
  return { ...projected };
}

function projectWorldPoint(point, preset, width, height) {
  const rotated = rotateForView(point);
  const span = maxWorldSpan(preset);
  const pad = 58;
  const scale = (Math.min(width, height) - pad * 2) / (span * 2.45);
  const cameraDistance = span * 2.8;
  const perspective = cameraDistance / (cameraDistance - rotated.z);
  return {
    x: width / 2 + rotated.x * scale * perspective * state.viewZoom,
    y: height / 2 - rotated.y * scale * perspective * state.viewZoom,
    depth: rotated.z / span,
  };
}

function rotateForView(point) {
  const yaw = rad(state.viewYawDeg);
  const pitch = rad(state.viewPitchDeg);

  const yawedX = point.x * Math.cos(yaw) - point.z * Math.sin(yaw);
  const yawedZ = point.x * Math.sin(yaw) + point.z * Math.cos(yaw);
  const pitchedY = point.y * Math.cos(pitch) - yawedZ * Math.sin(pitch);
  const pitchedZ = point.y * Math.sin(pitch) + yawedZ * Math.cos(pitch);

  return { x: yawedX, y: pitchedY, z: pitchedZ };
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

  return {
    x: clamp(((clientX - rect.left - padX) / usableWidth) * (preset.world.maxX - preset.world.minX) + preset.world.minX, preset.world.minX, preset.world.maxX),
    y: clamp(((height - (clientY - rect.top) - padY) / usableHeight) * (preset.world.maxY - preset.world.minY) + preset.world.minY, preset.world.minY, preset.world.maxY),
    z: 0,
  };
}

function handlePointerDown(event) {
  const preset = getPreset();
  const hitIndex = findChargeAt(event.clientX, event.clientY);

  if (preset === PRESETS.equilibrium) {
    return;
  }

  if (preset.is3d) {
    if (hitIndex !== -1) {
      state.editIndex = hitIndex;
      syncControlsFromState();
      renderAll();
      return;
    }
    state.orbiting = true;
    state.orbitPointerId = event.pointerId;
    state.orbitOrigin = { x: event.clientX, y: event.clientY };
    canvas.setPointerCapture(event.pointerId);
    return;
  }

  if (hitIndex === -1) return;
  state.dragIndex = hitIndex;
  state.pointerId = event.pointerId;
  canvas.setPointerCapture(event.pointerId);
}

function handlePointerMove(event) {
  const hitIndex = findChargeAt(event.clientX, event.clientY);
  state.hoverIndex = hitIndex === -1 ? null : hitIndex;

  if (state.orbiting && state.orbitPointerId === event.pointerId) {
    const dx = event.clientX - state.orbitOrigin.x;
    const dy = event.clientY - state.orbitOrigin.y;
    state.viewYawDeg = wrapAngle(state.viewYawDeg + dx * 0.35);
    state.viewPitchDeg = clamp(state.viewPitchDeg + dy * 0.25, -80, 80);
    state.orbitOrigin = { x: event.clientX, y: event.clientY };
    syncViewOutputs();
    renderAll();
    return;
  }

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

  if (preset === PRESETS.line || preset === PRESETS.equilibrium || preset === PRESETS.fission) {
    charge.y = state.defaultCharges[state.dragIndex]?.y ?? 0;
  }

  charge.z = 0;
  onStateChanged();
}

function handlePointerUp(event) {
  if (state.pointerId === event.pointerId) {
    state.dragIndex = null;
    state.pointerId = null;
    if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
  }

  if (state.orbitPointerId === event.pointerId) {
    state.orbiting = false;
    state.orbitPointerId = null;
    state.orbitOrigin = null;
    if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
  }

  renderAll();
}

function handleWheel(event) {
  if (!getPreset().is3d) {
    return;
  }

  event.preventDefault();
  const factor = event.deltaY < 0 ? 1.08 : 0.92;
  state.viewZoom = clamp(state.viewZoom * factor, 0.55, 2.8);
  renderAll();
}

function findChargeAt(clientX, clientY) {
  const preset = getPreset();
  const rect = canvas.getBoundingClientRect();
  const width = rect.width || 1200;
  const height = rect.height || 620;
  const pointer = { x: clientX - rect.left, y: clientY - rect.top };
  const projected = state.charges
    .map((charge, index) => ({ index, ...projectCharge(charge, preset, width, height) }))
    .sort((a, b) => a.depth - b.depth);

  for (let index = projected.length - 1; index >= 0; index -= 1) {
    const charge = projected[index];
    const radius = charge.index === state.targetIndex ? 28 : 22;
    if (Math.hypot(pointer.x - charge.x, pointer.y - charge.y) <= radius) {
      return charge.index;
    }
  }
  return -1;
}

function randomizeScene() {
  const preset = getPreset();
  const xRange = preset.world.maxX - preset.world.minX;
  const yRange = preset.world.maxY - preset.world.minY;
  const zRange = preset.world.maxZ - preset.world.minZ;

  if (preset === PRESETS.line) {
    const anchors = [-0.35, 0, 0.32];
    state.charges = state.charges.map((charge, index) => ({
      ...charge,
      value: randomSignedStep(2, 9, preset.chargeRange.step),
      x: anchors[index] * xRange,
      y: 0,
      z: 0,
    }));
  } else if (preset === PRESETS.triangle) {
    const anchors = [
      { x: randomBetween(-0.2, 0.6), y: randomBetween(-0.2, 0.5), z: 0 },
      { x: randomBetween(3.5, 4.5), y: randomBetween(-0.1, 0.5), z: 0 },
      { x: randomBetween(3.4, 4.6), y: randomBetween(-3.8, -2.2), z: 0 },
    ];
    state.charges = state.charges.map((charge, index) => ({ ...charge, value: randomSignedStep(2, 8, 0.1), ...anchors[index] }));
  } else if (preset === PRESETS.fission) {
    state.charges = state.charges.map((charge, index) => ({
      ...charge,
      value: randomInt(30, 60),
      x: index === 0 ? -randomBetween(4.5e-15, 8e-15) : randomBetween(4.5e-15, 8e-15),
      y: 0,
      z: 0,
    }));
  } else if (preset === PRESETS.equilibrium) {
    state.charges = state.charges.map((charge, index) => ({
      ...charge,
      value: randomSignedStep(0.05, 0.7, 0.1),
      x: index === 0 ? -randomBetween(0.08, 0.18) : randomBetween(0.08, 0.18),
      y: state.defaultCharges[index]?.y ?? -0.16,
      z: 0,
    }));
    state.chargeMassesG = [randomStep(1.0, 8.0, 0.1), randomStep(1.0, 8.0, 0.1)];
    state.stringLengthCm = randomInt(28, 52);
  } else if (preset.is3d) {
    state.charges = state.charges.map((charge) => ({
      ...charge,
      value: randomSignedStep(1.8, Math.max(Math.abs(preset.chargeRange.max), 2), preset.chargeRange.step),
      x: clamp(charge.x + randomBetween(-xRange * 0.1, xRange * 0.1), preset.world.minX + 0.3, preset.world.maxX - 0.3),
      y: clamp(charge.y + randomBetween(-yRange * 0.1, yRange * 0.1), preset.world.minY + 0.3, preset.world.maxY - 0.3),
      z: clamp(charge.z + randomBetween(-zRange * 0.1, zRange * 0.1), preset.world.minZ + 0.3, preset.world.maxZ - 0.3),
    }));
    state.viewYawDeg = preset.view?.yawDeg ?? CAMERA_DEFAULTS.yawDeg;
    state.viewPitchDeg = preset.view?.pitchDeg ?? CAMERA_DEFAULTS.pitchDeg;
    state.viewZoom = preset.view?.zoom ?? 1;
  } else {
    state.charges = state.charges.map((charge) => ({
      ...charge,
      value: randomSignedStep(1.5, Math.max(Math.abs(preset.chargeRange.max), 2), preset.chargeRange.step),
      x: clamp(charge.x + randomBetween(-xRange * 0.08, xRange * 0.08), preset.world.minX + xRange * 0.08, preset.world.maxX - xRange * 0.08),
      y: clamp(charge.y + randomBetween(-yRange * 0.12, yRange * 0.12), preset.world.minY + yRange * 0.08, preset.world.maxY - yRange * 0.08),
      z: 0,
    }));
  }

  if (preset !== PRESETS.fission && preset !== PRESETS.equilibrium) {
    state.massG = randomStep(0.2, preset.is3d ? 4.5 : 3.5, 0.1);
  }
  onStateChanged();
}

function updateEditedChargePosition(axis, value) {
  const preset = getPreset();
  if (!preset.is3d) return;
  const charge = state.charges[state.editIndex];
  if (!charge) return;
  charge[axis] = clamp(value, preset.world[`min${axis.toUpperCase()}`], preset.world[`max${axis.toUpperCase()}`]);
  onStateChanged();
}

function setFreeChargeCount(count) {
  const preset = getPreset();
  if (!preset.freeBuilder) return;

  const nextCount = clamp(count, 2, preset.maxCharges);
  const existing = cloneCharges(state.charges).slice(0, nextCount);
  while (existing.length < nextCount) {
    const label = CHARGE_LABELS[existing.length];
    existing.push(
      makeCharge(
        label,
        existing.length % 2 === 0 ? 3 : -3,
        randomBetween(preset.world.minX * 0.7, preset.world.maxX * 0.7),
        randomBetween(preset.world.minY * 0.7, preset.world.maxY * 0.7),
        randomBetween(preset.world.minZ * 0.7, preset.world.maxZ * 0.7),
        "xyz",
      ),
    );
  }

  state.charges = existing;
  state.defaultCharges = cloneCharges(existing);
  state.freeChargeCount = nextCount;
  state.targetIndex = Math.min(state.targetIndex, nextCount - 1);
  state.editIndex = Math.min(state.editIndex, nextCount - 1);
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

function classifyDirection(fx, fy, fz, magnitude, is3d) {
  if (magnitude < 1e-18) return "Near zero";
  if (!is3d) {
    if (Math.abs(fx) >= Math.abs(fy)) return fx >= 0 ? "Right" : "Left";
    return fy >= 0 ? "Up" : "Down";
  }

  const axis = [
    { label: "Mostly +x", value: fx },
    { label: "Mostly -x", value: -fx },
    { label: "Mostly +y", value: fy },
    { label: "Mostly -y", value: -fy },
    { label: "Mostly +z", value: fz },
    { label: "Mostly -z", value: -fz },
  ].sort((a, b) => b.value - a.value)[0];
  return axis.label;
}

function classifyAngleBucket(azimuthDeg, elevationDeg) {
  const azBucket = Math.abs(azimuthDeg) >= 45 ? "Large azimuth" : "Small azimuth";
  const elBucket = Math.abs(elevationDeg) >= 25 ? "large elevation" : "small elevation";
  return `${azBucket}, ${elBucket}`;
}

function equilibriumAngleDeg(forceN, massKg) {
  if (!massKg || massKg <= 0) return 0;
  return Math.atan(forceN / (massKg * G)) * (180 / Math.PI);
}

function syncSharedPivotEquilibriumGeometry(preset) {
  if (state.charges.length < 2) {
    return;
  }

  const solution = solveSharedPivotEquilibriumAngles(
    state.charges[0],
    state.charges[1],
    (state.chargeMassesG[0] ?? preset.massG) / 1000,
    (state.chargeMassesG[1] ?? preset.massG) / 1000,
    state.stringLengthCm / 100,
    preset,
  );
  const pivotY = 0.18;
  const stringLengthM = state.stringLengthCm / 100;
  const sameSign = solution.isBalanced;
  const thetaA = solution.thetaA;
  const thetaB = solution.thetaB;
  const xOffsetA = sameSign ? stringLengthM * Math.sin(thetaA) : Math.min(0.012, stringLengthM * 0.08);
  const xOffsetB = sameSign ? stringLengthM * Math.sin(thetaB) : Math.min(0.012, stringLengthM * 0.08);
  const bobYA = pivotY - Math.sqrt(Math.max(0, stringLengthM ** 2 - xOffsetA ** 2));
  const bobYB = pivotY - Math.sqrt(Math.max(0, stringLengthM ** 2 - xOffsetB ** 2));

  state.charges[0].x = -xOffsetA;
  state.charges[0].y = bobYA;
  state.charges[0].z = 0;
  state.charges[1].x = xOffsetB;
  state.charges[1].y = bobYB;
  state.charges[1].z = 0;
}

function buildEquilibriumSummary(preset, contribution, massKg) {
  const massAkg = (state.chargeMassesG[0] ?? preset.massG) / 1000;
  const massBkg = (state.chargeMassesG[1] ?? preset.massG) / 1000;
  const solution = solveSharedPivotEquilibriumAngles(
    state.charges[0],
    state.charges[1],
    massAkg,
    massBkg,
    state.stringLengthCm / 100,
    preset,
  );
  const thetaTarget = state.targetIndex === 0 ? solution.thetaA : solution.thetaB;
  const electricForceN = contribution?.magnitude ?? 0;
  const targetWeight = (state.chargeMassesG[state.targetIndex] ?? preset.massG) / 1000 * G;
  const targetFx = Math.abs(contribution?.fx ?? 0);
  const targetFy = contribution?.fy ?? 0;
  const targetVertical = targetWeight - targetFy;
  const tensionTargetN = Math.hypot(targetFx, targetVertical);

  return {
    isBalanced: solution.isBalanced,
    thetaADeg: solution.thetaA * (180 / Math.PI),
    thetaBDeg: solution.thetaB * (180 / Math.PI),
    thetaTargetDeg: thetaTarget * (180 / Math.PI),
    pivotY: 0.18,
    forceElectricN: electricForceN,
    weightTargetN: targetWeight,
    tensionTargetN,
  };
}

function solveSharedPivotEquilibriumAngles(chargeA, chargeB, massAkg, massBkg, stringLengthM, preset) {
  if (!chargeA || !chargeB || massAkg <= 0 || massBkg <= 0 || stringLengthM <= 0) {
    return { thetaA: 0, thetaB: 0, isBalanced: false };
  }

  const qProduct = chargeA.value * chargeB.value;
  if (qProduct <= 0) {
    return { thetaA: 0, thetaB: 0, isBalanced: false };
  }

  const qAbsProduct = Math.abs(chargeA.value * preset.chargeScale * chargeB.value * preset.chargeScale);
  if (qAbsProduct === 0) {
    return { thetaA: 0, thetaB: 0, isBalanced: false };
  }

  let thetaA = 0.24;
  let thetaB = 0.24;

  for (let index = 0; index < 80; index += 1) {
    const ax = -stringLengthM * Math.sin(thetaA);
    const ay = -stringLengthM * Math.cos(thetaA);
    const bx = stringLengthM * Math.sin(thetaB);
    const by = -stringLengthM * Math.cos(thetaB);
    const rx = bx - ax;
    const ry = by - ay;
    const r = Math.max(Math.hypot(rx, ry), preset.softening);
    const force = K * qAbsProduct / (r * r);
    const fx = force * (rx / r);
    const fy = force * (ry / r);

    const nextThetaA = clamp(Math.atan2(Math.abs(fx), Math.max(1e-9, massAkg * G + fy)), 0, Math.PI / 2 - 0.01);
    const nextThetaB = clamp(Math.atan2(Math.abs(fx), Math.max(1e-9, massBkg * G - fy)), 0, Math.PI / 2 - 0.01);

    if (Math.abs(nextThetaA - thetaA) < 1e-6 && Math.abs(nextThetaB - thetaB) < 1e-6) {
      thetaA = nextThetaA;
      thetaB = nextThetaB;
      break;
    }

    thetaA = thetaA * 0.55 + nextThetaA * 0.45;
    thetaB = thetaB * 0.55 + nextThetaB * 0.45;
  }

  return { thetaA, thetaB, isBalanced: true };
}

function shouldDrawComponents(analysis) {
  if (!showVectors.checked || !showComponents.checked) return false;
  if (analysis.preset.is3d) {
    return (
      Math.abs(analysis.netFx) > Math.max(analysis.netMagnitude * 0.06, 1e-16) ||
      Math.abs(analysis.netFy) > Math.max(analysis.netMagnitude * 0.06, 1e-16) ||
      Math.abs(analysis.netFz) > Math.max(analysis.netMagnitude * 0.06, 1e-16)
    );
  }
  return Math.abs(analysis.netFy) > Math.max(analysis.netMagnitude * 0.08, 1e-16);
}

function mapMagnitude(value, maxValue, minPixels, maxPixels) {
  if (maxValue <= 0) return minPixels;
  return minPixels + (value / maxValue) * (maxPixels - minPixels);
}

function formatChargeValue(value, preset) {
  return `${formatChargeControlValue(value, preset)} ${preset.chargeUnitShort}`;
}

function formatChargeControlValue(value, preset) {
  const digits = preset.chargeRange.step >= 1 ? 0 : preset.chargeRange.step >= 0.1 ? 1 : 2;
  return formatFixed(value, digits);
}

function formatDistance(value, preset) {
  return `${formatFixed(value * preset.distanceDisplay.factor, preset.distanceDisplay.digits)} ${preset.distanceDisplay.label}`;
}

function formatForce(value) {
  return `${formatScientific(value, 3)} N`;
}

function formatScientific(value, digits = 3) {
  const abs = Math.abs(value);
  if (abs === 0) return "0";
  if (abs >= 0.01 && abs < 1000) return trimZeros(value.toFixed(Math.min(digits, 3)));
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

function clampNumberInput(input, min, max, fallback) {
  const step = Number(input.step || 1);
  const digits = step >= 1 ? 0 : step >= 0.1 ? 1 : 2;
  const parsed = Number(input.value);
  if (!Number.isFinite(parsed)) {
    input.value = formatFixed(fallback, digits);
    return fallback;
  }

  const clamped = clamp(parsed, Number(min), Number(max));
  input.value = formatFixed(clamped, digits);
  return clamped;
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

function buildScreenVectorEnd(start, vector, magnitude, dimensions, targetLength) {
  if (!magnitude || magnitude <= 0) return { ...start };
  const screenVector = { x: vector.x * dimensions.pxPerX, y: -vector.y * dimensions.pxPerY };
  const screenMagnitude = Math.hypot(screenVector.x, screenVector.y) || 1;
  const scale = targetLength / screenMagnitude;
  return {
    x: start.x + screenVector.x * scale,
    y: start.y + screenVector.y * scale,
  };
}

function buildProjectedVectorEnd(originCharge, vector, magnitude, preset, width, height, targetLength) {
  const start = projectCharge(originCharge, preset, width, height);
  if (!magnitude || magnitude <= 0) return { x: start.x, y: start.y };

  const probeLength = maxWorldSpan(preset) * 0.18;
  const unit = normalizeVector(vector);
  const probe = projectWorldPoint(
    {
      x: originCharge.x + unit.x * probeLength,
      y: originCharge.y + unit.y * probeLength,
      z: originCharge.z + unit.z * probeLength,
    },
    preset,
    width,
    height,
  );

  const dx = probe.x - start.x;
  const dy = probe.y - start.y;
  const scale = targetLength / (Math.hypot(dx, dy) || 1);
  return { x: start.x + dx * scale, y: start.y + dy * scale };
}

function scaleVectorToLength(vector, targetLength) {
  const magnitude = Math.hypot(vector.x, vector.y, vector.z);
  if (magnitude <= 0) return { x: 0, y: 0, z: 0 };
  const scale = targetLength / magnitude;
  return { x: vector.x * scale, y: vector.y * scale, z: vector.z * scale };
}

function normalizeVector(vector) {
  const magnitude = Math.hypot(vector.x, vector.y, vector.z) || 1;
  return { x: vector.x / magnitude, y: vector.y / magnitude, z: vector.z / magnitude };
}

function midpoint(a, b) {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

function drawProjectedPolyline(points, preset, width, height) {
  if (!points.length) return;
  const projected = points.map((point) => projectWorldPoint(point, preset, width, height));
  ctx.beginPath();
  ctx.moveTo(projected[0].x, projected[0].y);
  projected.slice(1).forEach((point) => ctx.lineTo(point.x, point.y));
  ctx.stroke();
}

function buildArcPoints(origin, radius, start, end, mode, azimuthDeg = 0) {
  const points = [];
  const steps = 18;
  for (let index = 0; index <= steps; index += 1) {
    const t = start + ((end - start) * index) / steps;
    if (mode === "azimuth") {
      points.push({
        x: origin.x + Math.cos(t) * radius,
        y: origin.y,
        z: origin.z + Math.sin(t) * radius,
      });
    } else {
      const az = rad(azimuthDeg);
      points.push({
        x: origin.x + Math.cos(t) * Math.cos(az) * radius,
        y: origin.y + Math.sin(t) * radius,
        z: origin.z + Math.cos(t) * Math.sin(az) * radius,
      });
    }
  }
  return points;
}

function maxWorldSpan(preset) {
  return Math.max(
    preset.world.maxX - preset.world.minX,
    preset.world.maxY - preset.world.minY,
    preset.world.maxZ - preset.world.minZ,
  );
}

function rad(value) {
  return (value * Math.PI) / 180;
}

function wrapAngle(value) {
  let result = value;
  while (result > 180) result -= 360;
  while (result < -180) result += 360;
  return result;
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
  if (!inDialog) closeDialog(dialog);
}

function cloneCharges(charges) {
  return charges.map((charge) => ({ ...charge }));
}

function makeCharge(label, value, x, y, z, axis) {
  return { id: label, label, value, x, y, z, axis };
}

function world2D(minX, maxX, minY, maxY) {
  return { minX, maxX, minY, maxY, minZ: -1, maxZ: 1 };
}

function world3D(minX, maxX, minY, maxY, minZ, maxZ) {
  return { minX, maxX, minY, maxY, minZ, maxZ };
}

function buildIcosahedronPresetCharges() {
  const phi = (1 + Math.sqrt(5)) / 2;
  const scale = 1.2;
  const vertices = [
    [-1, phi, 0],
    [1, phi, 0],
    [-1, -phi, 0],
    [1, -phi, 0],
    [0, -1, phi],
    [0, 1, phi],
    [0, -1, -phi],
    [0, 1, -phi],
    [phi, 0, -1],
    [phi, 0, 1],
    [-phi, 0, -1],
    [-phi, 0, 1],
  ];

  const labels = CHARGE_LABELS.slice(0, 12);
  const charges = vertices.map(([x, y, z], index) =>
    makeCharge(labels[index], index < 6 ? 3.4 : -3.4, x * scale, y * scale, z * scale, "xyz"),
  );
  charges.push(makeCharge("M", 1.7, 0.15, 0.2, -0.1, "xyz"));
  return charges;
}
