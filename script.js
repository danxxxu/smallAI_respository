// Cluster colors
const clusterColors = {
  "Feminist and Queer Approaches": "#DC267F",
  "Small Data, Big Impact": "#785EF0",
  "Green AI": "#6590FF",
  "Open Source, Low-Compute, High-Performance": "#FE6100",
  "Indigenous-led Models": "#FFB000",
};
const CLUSTERS = {
  "Feminist and Queer Approaches": [
    "feminist ai",
    "feminist ethics",
    "gender equality",
    "gender justice",
    "intersectionality",
    "intersectional justice",
    "queer",
    "queer inclusive",
    "justice",
    "care",
    "anti-violence",
    "prevention",
    "safety",
    "bias",
    "inclusive",
    "accessibility",
    "participatory design",
    "community-centered",
    "community-driven",
    "equity",
    "responsible ai",
    "ecofeminism",
    "creative",
    "ethical ai",
    "data privacy",
    "co-create",
  ],

  "Small Data, Big Impact": [
    "data sovereignty",
    "data quality",
    "domain-specific",
    "data-driven linguistic modeling",
    "subjective dataset",
    "education",
    "literacy",
    "critical pedagogy",
    "knowledge distribution",
    "research",
    "academic",
    "transparency",
    "accessibility",
    "low-resource accessibility",
    "simplicity",
    "equity",
    "democratizing",
    "open science",
  ],

  "Open Source, Low-Compute, High-Performance": [
    "efficient",
    "efficiency",
    "lightweight",
    "low-compute",
    "high-performance",
    "sparse",
    "mixture-of-experts",
    "edge ai",
    "edge computing",
    "local ai",
    "local/offline",
    "on-device",
    "on-device/offline",
    "on-premises deployment",
    "open-source",
    "open ecosystem",
    "open-weight",
    "permissive licence",
    "privacy",
    "privacy-first",
    "decentralized",
    "technological alternatives",
    "api",
    "training",
  ],

  "Green AI": [
    "biodiversity",
    "conservation",
    "ecological",
    "ecological sustainability",
    "ecological intelligence",
    "environmental monitoring",
    "green ai practices",
    "efficient",
    "inter-species understanding",
    "audio modeling",
    "interdisciplinarity",
    "interdisciplinary science",
    "systems thinking",
    "deep listening",
    "ecofeminism",
    "low compute",
    "sustainability",
  ],

  "Indigenous-led Models": [
    "data sovereignty",
    "indigenous data sovereignty",
    "community-driven",
    "community-created data",
    "cultural preservation",
    "cultural context",
    "cultural literacy",
    "revitalization",
    "indigenous",
    "indigenous ai",
    "māori ai",
    "ancestral knowledge",
    "preserving indigenous language",
    "decolonial",
    "decolonial ai",
    "decoloniality",
    "grassroots",
    "grassroots innovation",
    "community tech",
    "volunteer-run",
    "co-create",
  ],
};

const valueToCluster = {};

Object.entries(CLUSTERS).forEach(([cluster, values]) => {
  values.forEach((v) => {
    valueToCluster[v.toLowerCase()] = cluster;
  });
});

// Panel elements
const panel = document.getElementById("side-panel");
const closePanel = document.getElementById("close-panel");
const panelTitle = document.getElementById("panel-title");
const panelDescription = document.getElementById("panel-description");
const panelValues = document.getElementById("panel-values");
const panelLink = document.getElementById("panel-link");
const panelSmallness = document.getElementById("panel-smallness");
const panelType = document.getElementById("panel-type");
const panelUmbrella = document.getElementById("panel-umbrella");
const panelOrg = document.getElementById("panel-org");

// Filter state
const activeClusters = new Set();
const activeCategories = new Set();
let allData = [];

// Close panel
closePanel.onclick = () => panel.classList.remove("open");

const mainTitle = document.getElementById("main-title");

mainTitle.onclick = () => {
  const about = document.getElementById("about-content");

  panelTitle.textContent = "What is Small AI";
  panelDescription.innerHTML = about.innerHTML;

  panelValues.innerHTML = "";
  panelSmallness.textContent = "";
  panelUmbrella.textContent = "";
  panelUmbrella.parentElement.style.display = "none";
  panelOrg.textContent = "";
  panelOrg.parentElement.style.display = "none";
  panelLink.style.display = "none";

  panel.classList.add("open");
};

// Toggle filter tags
function toggleFilter(tagEl, value, set) {
  if (set.has(value)) {
    set.delete(value);
    tagEl.classList.remove("active");
    tagEl.style.background = "#eee";
    tagEl.style.color = "black";
  } else {
    set.add(value);
    tagEl.classList.add("active");
    tagEl.style.background = clusterColors[value] || "#333";
    tagEl.style.color = "white";
  }
  updateView();
}

// Apply active filters
function applyFilters(data) {
  return data.filter((project) => {
    const matchesCluster =
      activeClusters.size === 0 ||
      (project.value_clusters || []).some((c) => activeClusters.has(c));

    const matchesCategory =
      activeCategories.size === 0 ||
      activeCategories.has(project.umbrella_category);

    return matchesCluster && matchesCategory;
  });
}

// Update view based on filters
function updateView() {
  const filtered = applyFilters(allData);
  renderProjects(filtered);
}

// Render projects grouped by cluster
function renderProjects(data) {
  const container = document.getElementById("container");
  container.innerHTML = ""; // clear

  const grid = document.createElement("div");
  grid.className = "grid";

  data.forEach((project) => {
    const card = document.createElement("div");
    card.className = "card";

    const clusters = project.value_clusters || [];

    // 🎨 Apply color or gradient
    if (clusters.length === 1) {
      card.style.background = clusterColors[clusters[0]] || "#ccc";
    } else if (clusters.length > 1) {
      const colors = clusters.map((c) => clusterColors[c]).filter(Boolean);

      if (colors.length > 0) {
        card.style.background = `linear-gradient(135deg, ${colors.join(", ")})`;
      } else {
        card.style.background = "#ccc";
      }
    } else {
      card.style.background = "#ccc";
    }

    card.innerHTML = `
      <span class="card-text">
        ${project.project_name || "Unnamed"}
      </span>
    `;

    card.title = project.project_name;

    grid.appendChild(card);

    // 👉 Panel logic (unchanged)
    card.onclick = () => {
      panelTitle.textContent = project.project_name || "Unnamed";
      panelSmallness.textContent =
        project['self-description_of_"smallness"'] || "";

      panelDescription.textContent =
        project["self-description:_what_&_who_it_is_useful_for"] ||
        "No description available";

      panelValues.innerHTML = "";

      if (project.values) {
        project.values.split(",").forEach((v) => {
          const raw = v.trim();
          const key = raw.toLowerCase();

          const tag = document.createElement("span");
          tag.className = "tag";
          tag.textContent = "#" + raw.replace(/\s+/g, "-");

          // const clusters = Object.entries(CLUSTERS)
          //   .filter(([_, values]) => values.includes(key))
          //   .map(([cluster]) => cluster);
          tag.style.background = "#eee";
          tag.style.color = "black";

          // if (clusters.length === 1) {
          //   tag.style.background = clusterColors[clusters[0]];
          //   tag.style.color = "white";
          // } else if (clusters.length > 1) {
          //   const colors = clusters
          //     .map((c) => clusterColors[c])
          //     .filter(Boolean);
          //   tag.style.background = `linear-gradient(135deg, ${colors.join(", ")})`;
          //   tag.style.color = "white";
          // } else {
          //   tag.style.background = "#ccc";
          //   tag.style.color = "black";
          // }

          panelValues.appendChild(tag);
        });
      }

      panelUmbrella.textContent = project.umbrella_category || "—";
      panelOrg.textContent =
        project.type_of_organization_behind_the_project || "—";

      if (project.project_url) {
        panelLink.href = project.project_url;
        panelLink.style.display = "inline";
      } else {
        panelLink.style.display = "none";
      }

      panel.classList.add("open");
    };
  });

  const contributeWrapper = document.createElement("div");
  contributeWrapper.className = "card-wrapper";

  const contributeCard = document.createElement("div");
  contributeCard.className = "card contribute-card";
  contributeCard.textContent = "+ New Project";

  contributeCard.onclick = () => {
    // redirect user or open modal
    window.open("https://forms.gle/wGKSWTN4mtdRj8J46", "_blank");
  };

  contributeWrapper.appendChild(contributeCard);
  grid.appendChild(contributeWrapper);

  container.appendChild(grid);
}

// Load JSON and initialize tags
fetch("smallAI.json")
  .then((res) => res.text()) // Step 1: get raw text
  .then((text) => {
    // Step 2: replace NaN with null (also handles Infinity/-Infinity if needed)
    const cleanText = text
      .replace(/\bNaN\b/g, "null")
      .replace(/\bInfinity\b/g, "null")
      .replace(/\b-Infinity\b/g, "null");

    // Step 3: parse JSON manually
    return JSON.parse(cleanText);
  })
  .then((data) => {
    allData = data;

    const clusterSet = new Set();
    const categorySet = new Set();

    data.forEach((project) => {
      (project.value_clusters || []).forEach((c) => clusterSet.add(c));
      if (project.umbrella_category) categorySet.add(project.umbrella_category);
    });

    // Render cluster filter tags
    const clusterTagsContainer = document.getElementById("cluster-tags");
    clusterSet.forEach((cluster) => {
      const tag = document.createElement("div");
      tag.className = "filter-tag";
      tag.textContent = cluster;
      tag.style.border = `2px solid ${clusterColors[cluster] || "#333"}`;
      tag.onclick = () => toggleFilter(tag, cluster, activeClusters);
      clusterTagsContainer.appendChild(tag);
    });

    // Render category filter tags
    const categoryTagsContainer = document.getElementById("category-tags");
    categorySet.forEach((cat) => {
      const tag = document.createElement("div");
      tag.className = "filter-tag";
      tag.textContent = cat;
      tag.onclick = () => toggleFilter(tag, cat, activeCategories);
      categoryTagsContainer.appendChild(tag);
    });

    // Initial rendering
    renderProjects(allData);
  })
  .catch((err) => console.error("Error loading JSON:", err));
