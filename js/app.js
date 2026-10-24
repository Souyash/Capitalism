// Capitanissm Web Platform Logic
document.addEventListener('DOMContentLoaded', () => {
  initEligibilityEngine();
  initSpeechesExplorer();
  initBoothSimulator();
  initSoftwareShowcase();
  initModals();
  initSmoothScroll();
});

/* =========================================================
   1. ELIGIBILITY & MEMBERSHIP APPLICATION ENGINE
   ========================================================= */
function initEligibilityEngine() {
  const form = document.getElementById('membership-application-form');
  if (!form) return;

  const ageInput = document.getElementById('applicant-age');
  const eduSelect = document.getElementById('applicant-education');
  const roleSelect = document.getElementById('applicant-role');
  const expSelect = document.getElementById('applicant-experience');
  const aspirantSelect = document.getElementById('applicant-aspirant');
  const commSelect = document.getElementById('applicant-communication');

  // Live indicators
  const ageStatusEl = document.getElementById('status-age');
  const eduStatusEl = document.getElementById('status-edu');
  const roleStatusEl = document.getElementById('status-role');
  const badgeContainer = document.getElementById('aspirant-badge-preview');
  const overallVerdictEl = document.getElementById('overall-eligibility-verdict');
  const submitBtn = document.getElementById('btn-submit-application');

  function updateLiveValidation() {
    const age = parseInt(ageInput.value, 10);
    const edu = eduSelect.value;
    const role = roleSelect.value;
    const exp = expSelect.value;
    const aspirant = aspirantSelect.value;
    const comm = commSelect.value;

    let isAgeValid = !isNaN(age) && age >= 18;
    let isEduValid = edu !== 'below-12th' && edu !== '';
    let isRoleValid = true;
    let roleWarning = '';

    // Check Age
    if (isNaN(age) || age === 0) {
      ageStatusEl.innerHTML = `<span class="text-slate-400">Enter age (18+ required)</span>`;
    } else if (age < 18) {
      ageStatusEl.innerHTML = `<span class="text-rose-400 flex items-center gap-1 font-semibold"><i class="fa-solid fa-triangle-exclamation"></i> Must be 18+ (Current: ${age})</span>`;
    } else {
      ageStatusEl.innerHTML = `<span class="text-emerald-400 flex items-center gap-1 font-semibold"><i class="fa-solid fa-circle-check"></i> Age verified (${age} yrs)</span>`;
    }

    // Check Basic Education
    if (!edu) {
      eduStatusEl.innerHTML = `<span class="text-slate-400">Select education level</span>`;
    } else if (edu === 'below-12th') {
      eduStatusEl.innerHTML = `<span class="text-rose-400 flex items-center gap-1 font-semibold"><i class="fa-solid fa-xmark"></i> Minimum 12th passed required</span>`;
    } else {
      eduStatusEl.innerHTML = `<span class="text-emerald-400 flex items-center gap-1 font-semibold"><i class="fa-solid fa-circle-check"></i> Education criteria met</span>`;
    }

    // Check Role vs Criteria
    if (role === 'mla-consultant') {
      const isGraduate = (edu === 'graduate' || edu === 'post-graduate' || edu === 'phd');
      const hasExp = (exp === '1-2-years' || exp === '3-plus-years');

      if (!isGraduate && !hasExp) {
        isRoleValid = false;
        roleWarning = 'MLA Consultant requires Graduation OR proven campaign experience';
        roleStatusEl.innerHTML = `<span class="text-amber-400 flex items-center gap-1 text-xs leading-relaxed"><i class="fa-solid fa-circle-info"></i> ${roleWarning}</span>`;
      } else {
        roleStatusEl.innerHTML = `<span class="text-emerald-400 flex items-center gap-1 font-semibold"><i class="fa-solid fa-crown text-amber-400"></i> Qualified for MLA Political Consultant</span>`;
      }
    } else if (role === 'prime-cadre') {
      roleStatusEl.innerHTML = `<span class="text-emerald-400 flex items-center gap-1 font-semibold"><i class="fa-solid fa-circle-check"></i> Prime Field / Speech Data Cadre</span>`;
    } else {
      roleStatusEl.innerHTML = `<span class="text-slate-400">Select intended vertical</span>`;
    }

    // Aspirant Badge
    if (aspirant === 'upsc' || aspirant === 'wbcs' || aspirant === 'state-pcs') {
      const labelMap = {
        'upsc': 'UPSC Civil Services Aspirant',
        'wbcs': 'WBCS State Services Aspirant',
        'state-pcs': 'State PCS Aspirant'
      };
      badgeContainer.innerHTML = `
        <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-emerald-500/20 border border-amber-400/50 text-amber-300 text-xs font-semibold animate-pulse">
          <i class="fa-solid fa-shield-halved text-amber-400"></i>
          <span>★ PRIME SCHOLAR CADRE: ${labelMap[aspirant]}</span>
        </div>
      `;
    } else if (aspirant === 'law-public-policy') {
      badgeContainer.innerHTML = `
        <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-400/40 text-emerald-300 text-xs font-semibold">
          <i class="fa-solid fa-scale-balanced text-emerald-400"></i>
          <span>Policy & Governance Fellow</span>
        </div>
      `;
    } else {
      badgeContainer.innerHTML = '';
    }

    // Overall verdict
    const isOverallEligible = isAgeValid && isEduValid && isRoleValid && comm !== 'poor';

    if (isOverallEligible) {
      overallVerdictEl.className = 'p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-sm flex items-start gap-3';
      overallVerdictEl.innerHTML = `
        <i class="fa-solid fa-circle-check text-emerald-400 text-xl mt-0.5"></i>
        <div>
          <strong class="font-bold text-emerald-300 block text-base">You Meet Capitanissm Criteria!</strong>
          <span class="text-xs text-emerald-200/80">Your profile qualifies for our intelligence network. Fill remaining fields and submit to receive your verified Member ID Pass.</span>
        </div>
      `;
      submitBtn.disabled = false;
      submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    } else {
      overallVerdictEl.className = 'p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-sm flex items-start gap-3';
      let issueText = [];
      if (!isAgeValid) issueText.push("Applicant must be 18+");
      if (!isEduValid) issueText.push("Must be at least 12th passed");
      if (!isRoleValid) issueText.push("MLA Consultant requires graduation or field experience");
      if (comm === 'poor') issueText.push("Good communication skills are essential");

      overallVerdictEl.innerHTML = `
        <i class="fa-solid fa-triangle-exclamation text-amber-400 text-xl mt-0.5"></i>
        <div>
          <strong class="font-bold text-amber-300 block text-base">Criteria Check Incomplete</strong>
          <span class="text-xs text-amber-200/80">${issueText.join(' • ') || 'Please enter your age and education details.'}</span>
        </div>
      `;
      submitBtn.disabled = true;
      submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
    }
  }

  // Bind input listeners
  [ageInput, eduSelect, roleSelect, expSelect, aspirantSelect, commSelect].forEach(el => {
    if (el) {
      el.addEventListener('input', updateLiveValidation);
      el.addEventListener('change', updateLiveValidation);
    }
  });

  // Initial check
  updateLiveValidation();

  // Handle Form Submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const fullName = document.getElementById('applicant-name').value || 'Candidate';
    const age = document.getElementById('applicant-age').value;
    const district = document.getElementById('applicant-district').value || 'Assigned District';
    const role = roleSelect.value;
    const edu = eduSelect.value;
    const aspirant = aspirantSelect.value;

    const roleNameMap = {
      'prime-cadre': 'Prime Speech & Booth Data Analyst',
      'mla-consultant': 'Political Consultant for MLA'
    };

    const aspirantNameMap = {
      'upsc': 'UPSC Civil Services Aspirant',
      'wbcs': 'WBCS State Services Aspirant',
      'state-pcs': 'State PCS Aspirant',
      'law-public-policy': 'Law & Public Policy',
      'general': 'Strategic Campaign Researcher'
    };

    // Generate random pass ID
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const passId = `CPT-2026-${randomNum}`;

    // Fill pass details
    document.getElementById('pass-id-display').textContent = passId;
    document.getElementById('pass-name-display').textContent = fullName.toUpperCase();
    document.getElementById('pass-role-display').textContent = roleNameMap[role] || 'Capitanissm Cadre';
    document.getElementById('pass-district-display').textContent = district.toUpperCase();
    document.getElementById('pass-aspirant-display').textContent = aspirantNameMap[aspirant] || 'Verified Member';
    document.getElementById('pass-date-display').textContent = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    // Show pass modal
    const modal = document.getElementById('membership-pass-modal');
    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    }
  });
}

/* =========================================================
   2. SPEECHES & RHETORIC DATA EXPLORER
   ========================================================= */
const SPEECH_DATABASE = [
  {
    id: 1,
    category: 'farmer',
    categoryLabel: 'Agriculture & MSP',
    title: 'Agrarian Dignity & Direct Procurement Accountability',
    hook: '"A farmer does not ask for charity; he asks for the true value of the sweat he deposits into our soil."',
    keyStats: '34% Mandi price disparity, ₹2,200/q MSP deficit, 6 cold-storages non-operational in block.',
    sentiment: 'Empathetic & Resolute',
    toneClass: 'text-amber-400',
    impactScore: 97,
    languages: ['Bengali', 'Hindi', 'English'],
    targetAudience: 'Rural Mandi crowds, Kisan Sabha gatherings, Gram Panchayat rallies'
  },
  {
    id: 2,
    category: 'youth',
    categoryLabel: 'Youth & Employment',
    title: 'The Unbroken Generation: Jobs, Exams & Transparent Recruitment',
    hook: '"When an exam paper leaks, it is not just paper that burns—it is five years of midnight oil burnt by our sons and daughters."',
    keyStats: '48,000 vacant sub-inspector & teacher posts in state, 3.2 year average recruitment delay.',
    sentiment: 'Fierce & Mobilizing',
    toneClass: 'text-rose-400',
    impactScore: 99,
    languages: ['Hindi', 'Bengali', 'English'],
    targetAudience: 'College squares, coaching hub towns, civil service aspirant assemblies'
  },
  {
    id: 3,
    category: 'infrastructure',
    categoryLabel: 'Local Infrastructure',
    title: 'Potholes in Democracy: The ₹40-Crore Road That Exists Only on Paper',
    hook: '"Our pregnant sisters travel on bullock carts because contractor files move faster than public ambulances."',
    keyStats: '14 km unpaved culvert, 3 bridge tender defaults, ₹8.5 crore unspent MP/MLA LAD fund.',
    sentiment: 'Direct Accusatory with Audit Proof',
    toneClass: 'text-emerald-400',
    impactScore: 94,
    languages: ['Bengali', 'Hindi'],
    targetAudience: 'Highway chawk meetings, urban slum fringes, market associations'
  },
  {
    id: 4,
    category: 'welfare',
    categoryLabel: 'Women & Social Welfare',
    title: 'Security, Nutrition & Direct Cash Transfer Dignity',
    hook: '"Empower the woman at the hearth, and you empower every ballot box in the village."',
    keyStats: '82% self-help group loan repayment rate, 41% anemia prevalence in sub-district.',
    sentiment: 'Constructive & Uplifting',
    toneClass: 'text-purple-400',
    impactScore: 95,
    languages: ['Bengali', 'Hindi'],
    targetAudience: 'Mahila samiti meets, Anganwadi workers, rural women voters'
  },
  {
    id: 5,
    category: 'rebuttal',
    categoryLabel: 'Opposition Rebuttal',
    title: 'Countering the Five-Year Report Card: Fact Over Fiction',
    hook: '"They spent ₹12 Crores on hoardings to announce a hospital that lacks both paracetamol and doctors."',
    keyStats: '6 out of 10 hospital beds unstaffed, 62% water pipeline dry tap incidence.',
    sentiment: 'Sharp Counter-Rhetoric with Field Audits',
    toneClass: 'text-red-400',
    impactScore: 98,
    languages: ['Hindi', 'Bengali', 'English'],
    targetAudience: 'Press conferences, election debate podiums, town halls'
  }
];

function initSpeechesExplorer() {
  const container = document.getElementById('speeches-cards-container');
  const searchInput = document.getElementById('speech-search-input');
  const filterButtons = document.querySelectorAll('.speech-filter-btn');
  const generatorTopic = document.getElementById('gen-speech-topic');
  const generatorTone = document.getElementById('gen-speech-tone');
  const generatorBtn = document.getElementById('btn-generate-hook');
  const generatorResult = document.getElementById('generator-result-box');

  let currentCategory = 'all';
  let searchQuery = '';

  function renderSpeeches() {
    if (!container) return;

    const filtered = SPEECH_DATABASE.filter(item => {
      const matchCat = (currentCategory === 'all' || item.category === currentCategory);
      const matchSearch = searchQuery === '' || 
        item.title.toLowerCase().includes(searchQuery) ||
        item.hook.toLowerCase().includes(searchQuery) ||
        item.keyStats.toLowerCase().includes(searchQuery);
      return matchCat && matchSearch;
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="col-span-full p-8 text-center glass-panel rounded-2xl">
          <i class="fa-solid fa-magnifying-glass text-3xl text-emerald-400/50 mb-3"></i>
          <p class="text-slate-300 font-medium">No speech data matching "${searchQuery}".</p>
          <p class="text-xs text-slate-400 mt-1">Try keywords like 'MSP', 'Youth', 'Road', or reset filters.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(speech => `
      <div class="glass-panel p-6 rounded-2xl flex flex-col justify-between relative group hover:border-emerald-400/50 transition-all duration-300">
        <div>
          <div class="flex items-center justify-between mb-3 text-xs">
            <span class="px-2.5 py-1 rounded-md bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 font-semibold uppercase tracking-wider">
              ${speech.categoryLabel}
            </span>
            <div class="flex items-center gap-1.5 text-amber-400 font-mono font-bold">
              <i class="fa-solid fa-fire text-coral"></i>
              <span>Impact: ${speech.impactScore}/100</span>
            </div>
          </div>

          <h3 class="text-lg font-bold text-white mb-3 group-hover:text-emerald-300 transition-colors">
            ${speech.title}
          </h3>

          <div class="p-3.5 rounded-xl bg-black/40 border border-white/5 mb-4 relative">
            <i class="fa-solid fa-quote-left text-emerald-500/30 text-2xl absolute -top-2 left-2"></i>
            <p class="text-sm italic text-slate-200 pl-4 relative z-10 leading-relaxed">
              ${speech.hook}
            </p>
          </div>

          <div class="space-y-2 text-xs text-slate-300 mb-4">
            <div class="flex items-start gap-2">
              <i class="fa-solid fa-chart-column text-emerald-400 mt-0.5"></i>
              <span><strong>Ground Data:</strong> ${speech.keyStats}</span>
            </div>
            <div class="flex items-center gap-2">
              <i class="fa-solid fa-bullhorn ${speech.toneClass}"></i>
              <span><strong>Delivery Cadence:</strong> ${speech.sentiment}</span>
            </div>
            <div class="flex items-center gap-2">
              <i class="fa-solid fa-users text-slate-400"></i>
              <span><strong>Prime Audience:</strong> ${speech.targetAudience}</span>
            </div>
          </div>
        </div>

        <div class="pt-4 border-t border-white/10 flex items-center justify-between">
          <div class="flex gap-1.5">
            ${speech.languages.map(lang => `
              <span class="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-slate-300">${lang}</span>
            `).join('')}
          </div>
          <button onclick="copySpeechHook('${encodeURIComponent(speech.hook)}')" class="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all">
            <i class="fa-regular fa-copy"></i>
            <span>Copy Hook</span>
          </button>
        </div>
      </div>
    `).join('');
  }

  // Filter Buttons
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => {
        b.classList.remove('bg-emerald-500', 'text-slate-950', 'font-bold');
        b.classList.add('bg-white/5', 'text-slate-300');
      });
      btn.classList.remove('bg-white/5', 'text-slate-300');
      btn.classList.add('bg-emerald-500', 'text-slate-950', 'font-bold');
      currentCategory = btn.getAttribute('data-filter') || 'all';
      renderSpeeches();
    });
  });

  // Search input
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      renderSpeeches();
    });
  }

  // Prompt Generator
  if (generatorBtn && generatorResult) {
    generatorBtn.addEventListener('click', () => {
      const topic = generatorTopic.value;
      const tone = generatorTone.value;

      generatorBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Synthesizing War-Room Punchline...`;
      generatorBtn.disabled = true;

      setTimeout(() => {
        let generatedPunchline = '';
        let generatedStats = '';

        if (topic === 'inflation') {
          generatedPunchline = `"When the price of mustard oil touches ₹180, it is not inflation—it is an undeclared kitchen tax on every hardworking mother!"`;
          generatedStats = 'Ground Audit: 42% rise in edible essentials vs 4.8% rural wage growth over 3 years.';
        } else if (topic === 'healthcare') {
          generatedPunchline = `"They celebrate digital health cards, but when our mother falls ill at 2 AM, the primary health centre has a rusted padlock and no doctor!"`;
          generatedStats = 'Constituency Telemetry: 71% specialist doctor vacancies in sub-divisional hospital.';
        } else if (topic === 'unemployment') {
          generatedPunchline = `"Degrees are accumulating in suitcases while our educated youth are forced to stand in migrant labor lines in other states!"`;
          generatedStats = 'Booth Demographics: 64% first-time voters under 25 report zero local formal employment openings.';
        } else {
          generatedPunchline = `"Trust is not won on television channels; it is earned on dusty village lanes where promises either stand or crumble."`;
          generatedStats = 'Booth Metric: 88% electorate demands physical accountability over media advertising.';
        }

        generatorResult.innerHTML = `
          <div class="p-4 rounded-xl bg-emerald-950/80 border border-emerald-400/50 space-y-2.5 animate-fadeIn">
            <div class="flex items-center justify-between text-xs text-emerald-300">
              <span class="font-bold flex items-center gap-1.5"><i class="fa-solid fa-bolt text-amber-400"></i> AI-Synthesized Speech Hook (${tone.toUpperCase()})</span>
              <span class="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-400/30 text-[10px]">Fact-Verified</span>
            </div>
            <p class="text-white text-sm font-medium italic">
              ${generatedPunchline}
            </p>
            <div class="text-xs text-slate-300 pt-2 border-t border-emerald-500/20">
              <span class="text-emerald-400 font-semibold">Supporting Speech Stat:</span> ${generatedStats}
            </div>
            <div class="flex justify-end pt-1">
              <button onclick="copySpeechHook('${encodeURIComponent(generatedPunchline)}')" class="text-xs px-2.5 py-1 rounded bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400">
                <i class="fa-regular fa-copy"></i> Copy Punchline
              </button>
            </div>
          </div>
        `;

        generatorBtn.innerHTML = `<i class="fa-solid fa-wand-magic-sparkles"></i> Generate Another Hook`;
        generatorBtn.disabled = false;
      }, 500);
    });
  }

  renderSpeeches();
}

window.copySpeechHook = function(encodedText) {
  const text = decodeURIComponent(encodedText);
  navigator.clipboard.writeText(text).then(() => {
    showToast("Speech hook copied to clipboard!");
  }).catch(() => {
    showToast("Hook ready to use!");
  });
};

/* =========================================================
   3. BOOTH-LEVEL CONNECTION SIMULATOR (WAR-ROOM MATRIX)
   ========================================================= */
const BOOTH_DATA = [
  {
    id: 101,
    name: "Booth 101 - Shantinagar Primary School",
    totalVoters: 1142,
    youthVotersPct: 38,
    turnoutProb: "78.4%",
    swingVoterPct: 18,
    dominantIssue: "Drinking water pipeline leakage & erratic electricity supply in summer",
    cadreStrength: "12 Active Panna Pramukhs (Full Coverage)",
    recommendedSpeechFocus: "Direct attack on delayed jal-mission funds + promise of 24x7 feeder transformer."
  },
  {
    id: 102,
    name: "Booth 102 - Kisan Mandi Gate Community Hall",
    totalVoters: 980,
    youthVotersPct: 29,
    turnoutProb: "84.1%",
    swingVoterPct: 24,
    dominantIssue: "Cold storage warehouse pending completion for 4 years; middlemen margins",
    cadreStrength: "8 Cadre Volunteers (Needs 3 more youth leaders)",
    recommendedSpeechFocus: "MSP floor price guarantee + immediate probe into warehouse contractor scam."
  },
  {
    id: 103,
    name: "Booth 103 - Railway Colony Ward 7",
    totalVoters: 1320,
    youthVotersPct: 45,
    turnoutProb: "69.5%",
    swingVoterPct: 31,
    dominantIssue: "Railway flyover bottleneck, unemployment among ITI pass-outs, street lighting",
    cadreStrength: "15 Cadre Members (Strong youth brigade)",
    recommendedSpeechFocus: "Youth skill centre establishment in ward + timeline for overbridge completion."
  },
  {
    id: 104,
    name: "Booth 104 - Adarsh High School North Wing",
    totalVoters: 890,
    youthVotersPct: 33,
    turnoutProb: "74.0%",
    swingVoterPct: 14,
    dominantIssue: "Drainage overflow during monsoons causing waterlogging in 120 households",
    cadreStrength: "9 Active Workers (Solid door-to-door touch)",
    recommendedSpeechFocus: "Concrete storm drain development with municipal budget reallocation."
  }
];

function initBoothSimulator() {
  const listContainer = document.getElementById('booth-selector-list');
  const detailsContainer = document.getElementById('booth-detail-display');

  if (!listContainer || !detailsContainer) return;

  function renderBoothDetails(booth) {
    detailsContainer.innerHTML = `
      <div class="glass-panel p-6 rounded-2xl border border-emerald-500/40 space-y-5 animate-fadeIn">
        <div class="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <span class="text-xs font-mono font-bold text-emerald-400 tracking-wider uppercase">Booth Telemetry Record #${booth.id}</span>
            <h3 class="text-xl font-bold text-white mt-1">${booth.name}</h3>
          </div>
          <span class="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            Live Intelligence
          </span>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div class="p-3.5 rounded-xl bg-black/40 border border-white/5">
            <span class="text-[11px] text-slate-400 block">Total Electorate</span>
            <span class="text-lg font-bold text-white font-mono">${booth.totalVoters.toLocaleString()}</span>
          </div>
          <div class="p-3.5 rounded-xl bg-black/40 border border-white/5">
            <span class="text-[11px] text-slate-400 block">Youth Demographic</span>
            <span class="text-lg font-bold text-emerald-300 font-mono">${booth.youthVotersPct}%</span>
          </div>
          <div class="p-3.5 rounded-xl bg-black/40 border border-white/5">
            <span class="text-[11px] text-slate-400 block">Predicted Turnout</span>
            <span class="text-lg font-bold text-amber-400 font-mono">${booth.turnoutProb}</span>
          </div>
          <div class="p-3.5 rounded-xl bg-black/40 border border-white/5">
            <span class="text-[11px] text-slate-400 block">Swing Voter Pool</span>
            <span class="text-lg font-bold text-rose-400 font-mono">${booth.swingVoterPct}%</span>
          </div>
        </div>

        <div class="space-y-3 text-sm">
          <div class="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/20">
            <span class="text-xs font-bold text-emerald-400 uppercase tracking-wide block mb-1">
              <i class="fa-solid fa-bullseye text-coral mr-1"></i> Ground Grievance Heatmap
            </span>
            <p class="text-slate-200 text-xs sm:text-sm leading-relaxed">${booth.dominantIssue}</p>
          </div>

          <div class="p-4 rounded-xl bg-slate-900/60 border border-white/5">
            <span class="text-xs font-bold text-amber-300 uppercase tracking-wide block mb-1">
              <i class="fa-solid fa-users-viewfinder text-amber-400 mr-1"></i> Cadre & Panna Pramukh Deployment
            </span>
            <p class="text-slate-200 text-xs sm:text-sm">${booth.cadreStrength}</p>
          </div>

          <div class="p-4 rounded-xl bg-gradient-to-r from-emerald-950/70 to-slate-900/90 border border-emerald-400/30">
            <span class="text-xs font-bold text-emerald-300 uppercase tracking-wide block mb-1">
              <i class="fa-solid fa-microphone-lines text-emerald-400 mr-1"></i> Candidate Tactical Talking Point
            </span>
            <p class="text-slate-100 text-xs sm:text-sm italic font-medium">"${booth.recommendedSpeechFocus}"</p>
          </div>
        </div>
      </div>
    `;
  }

  listContainer.innerHTML = BOOTH_DATA.map((booth, idx) => `
    <button 
      class="booth-card-btn w-full text-left p-4 rounded-xl glass-panel border transition-all ${idx === 0 ? 'border-emerald-400 bg-emerald-950/50' : 'border-white/10 hover:border-emerald-500/40'}" 
      data-id="${booth.id}"
    >
      <div class="flex items-center justify-between">
        <span class="text-xs font-mono font-bold text-emerald-300">BOOTH #${booth.id}</span>
        <span class="text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-300">${booth.turnoutProb} Est.</span>
      </div>
      <div class="text-sm font-semibold text-white mt-1 truncate">${booth.name.split(' - ')[1] || booth.name}</div>
      <div class="flex items-center gap-3 text-xs text-slate-400 mt-2">
        <span><i class="fa-solid fa-users text-emerald-400/80 mr-1"></i> ${booth.totalVoters}</span>
        <span><i class="fa-solid fa-bolt text-amber-400/80 mr-1"></i> ${booth.swingVoterPct}% Swing</span>
      </div>
    </button>
  `).join('');

  renderBoothDetails(BOOTH_DATA[0]);

  const buttons = listContainer.querySelectorAll('.booth-card-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => {
        b.classList.remove('border-emerald-400', 'bg-emerald-950/50');
        b.classList.add('border-white/10');
      });
      btn.classList.add('border-emerald-400', 'bg-emerald-950/50');
      btn.classList.remove('border-white/10');

      const id = parseInt(btn.getAttribute('data-id'), 10);
      const selected = BOOTH_DATA.find(b => b.id === id);
      if (selected) renderBoothDetails(selected);
    });
  });
}

/* =========================================================
   4. CUSTOM SOFTWARE SUITE SHOWCASE TABS
   ========================================================= */
const SOFTWARE_MODULES = {
  crm: {
    title: "BoothPulse CRM™ - Micro-Voter Intelligence",
    tagline: "Digitize every household, Panna Pramukh, and caste-demographic dynamic in the constituency.",
    features: [
      "Family tree voter clustering with verified phone & whatsapp linkage",
      "Grievance resolution ticket tracking with SLA alerts for candidate office",
      "Caste, age, and occupational micro-segmentation with zero data leak guarantee",
      "Offline sync mode for remote rural booths with zero connectivity"
    ],
    metric: "100% booth digitization in under 14 days",
    badge: "Field Ops Suite"
  },
  teleprompter: {
    title: "VaniRhetoric™ - Live Teleprompter & Fact Check",
    tagline: "Empowering MLA candidates on stage with real-time constituency figures and opposition counters.",
    features: [
      "Offline local speech teleprompter with auto-scroll and dialect pitch control",
      "Instant counter-punchline suggestions when opposition issues new statement",
      "Constituency statistical bank (Mandi rates, budget utilization, school counts) accessible in 2 clicks",
      "Crowd acoustic sentiment feedback and speech duration optimizer"
    ],
    metric: "450+ high-impact election speeches powered",
    badge: "Stage & Media Suite"
  },
  warroom: {
    title: "WarRoom Sentinel™ - Polling Day Command Centre",
    tagline: "Live telemetry from 7:00 AM to 6:00 PM on EVM turnout, queue lengths, and booth anomalies.",
    features: [
      "Hourly voter turnout projection vs historical trends across every booth",
      "Instant distress alert trigger when rival booth rigging or EVM glitch occurs",
      "Voter transport coordination dispatch system for elderly and disabled voters",
      "Real-time legal desk helpline integration for polling agent complaints"
    ],
    metric: "< 90 seconds critical incident dispatch time",
    badge: "D-Day Command"
  },
  cadresync: {
    title: "CadreSync Broadcaster™ - Encrypted Cadre Network",
    tagline: "Unified broadcast and direct communication bridge from Candidate to 2,000+ Booth Workers.",
    features: [
      "One-click multi-tier WhatsApp and SMS broadcast without ban risk",
      "Panna Pramukh attendance and morning booth mobilization checklist",
      "Voice notes dissemination in candidate's original voice for authentic impact",
      "Gamified volunteer task completion and reward points system"
    ],
    metric: "98.4% broadcast read-rate within 20 minutes",
    badge: "Grassroots Network"
  }
};

function initSoftwareShowcase() {
  const tabs = document.querySelectorAll('.software-tab-btn');
  const displayContainer = document.getElementById('software-display-card');

  if (!tabs.length || !displayContainer) return;

  function renderSoftware(key) {
    const mod = SOFTWARE_MODULES[key] || SOFTWARE_MODULES.crm;
    displayContainer.innerHTML = `
      <div class="glass-panel p-8 rounded-3xl border border-emerald-500/30 relative overflow-hidden animate-fadeIn">
        <div class="absolute -right-12 -top-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
          <span class="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            ${mod.badge}
          </span>
          <span class="text-xs font-mono text-amber-300 font-semibold flex items-center gap-1.5">
            <i class="fa-solid fa-chart-line"></i> ${mod.metric}
          </span>
        </div>

        <h3 class="text-2xl sm:text-3xl font-extrabold text-white mb-2">${mod.title}</h3>
        <p class="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">${mod.tagline}</p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-8">
          ${mod.features.map(f => `
            <div class="flex items-start gap-3 p-3.5 rounded-xl bg-black/40 border border-white/5">
              <i class="fa-solid fa-circle-check text-emerald-400 mt-1 flex-shrink-0"></i>
              <span class="text-xs sm:text-sm text-slate-200">${f}</span>
            </div>
          `).join('')}
        </div>

        <div class="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-white/10">
          <div class="flex items-center gap-2 text-xs text-slate-400">
            <i class="fa-solid fa-shield-cat text-emerald-400"></i>
            <span>Military-Grade End-to-End Encryption • Zero Foreign Cloud Dependence</span>
          </div>
          <button onclick="openClientModal('${encodeURIComponent(mod.title)}')" class="btn-primary-green px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2">
            <span>Request Software Demo for MLA / Constituency</span>
            <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    `;
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('bg-emerald-500', 'text-slate-950', 'font-bold');
        t.classList.add('bg-white/5', 'text-slate-300');
      });
      tab.classList.remove('bg-white/5', 'text-slate-300');
      tab.classList.add('bg-emerald-500', 'text-slate-950', 'font-bold');

      const key = tab.getAttribute('data-software');
      renderSoftware(key);
    });
  });

  renderSoftware('crm');
}

/* =========================================================
   5. MODALS & TOAST NOTIFICATIONS
   ========================================================= */
function initModals() {
  // Membership Pass Modal Close
  const closePassModal = document.getElementById('btn-close-pass-modal');
  const passModal = document.getElementById('membership-pass-modal');
  if (closePassModal && passModal) {
    closePassModal.addEventListener('click', () => {
      passModal.classList.add('hidden');
      passModal.classList.remove('flex');
    });
  }

  // Client Consultation Modal
  const clientModal = document.getElementById('client-consult-modal');
  const closeClientModal = document.getElementById('btn-close-client-modal');
  const clientForm = document.getElementById('client-consult-form');

  if (closeClientModal && clientModal) {
    closeClientModal.addEventListener('click', () => {
      clientModal.classList.add('hidden');
      clientModal.classList.remove('flex');
    });
  }

  if (clientForm && clientModal) {
    clientForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clientModal.classList.add('hidden');
      clientModal.classList.remove('flex');
      showToast("Consultation inquiry logged! Our Senior MLA Strategist will contact you under strict NDA.");
      clientForm.reset();
    });
  }

  // Print Pass action
  const printPassBtn = document.getElementById('btn-print-pass');
  if (printPassBtn) {
    printPassBtn.addEventListener('click', () => {
      window.print();
    });
  }
}

window.openClientModal = function(title) {
  const modal = document.getElementById('client-consult-modal');
  const focusInput = document.getElementById('client-purpose-input');
  if (modal) {
    if (focusInput && title) {
      focusInput.value = `Interested in: ${decodeURIComponent(title)}`;
    }
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
};

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl bg-emerald-950 border border-emerald-400 text-white text-sm font-semibold shadow-2xl flex items-center gap-2.5 animate-bounce';
  toast.innerHTML = `<i class="fa-solid fa-circle-check text-emerald-400"></i> <span>${message}</span>`;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 3500);
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });
}

