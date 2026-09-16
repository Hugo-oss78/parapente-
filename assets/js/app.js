(function () {
  'use strict';

  var STORAGE_REVIEWED = 'parapente-memo:reviewed';
  var STORAGE_QUIZ_FILTERS = 'parapente-memo:quiz-filters';

  // ---------- Tabs ----------
  var tabButtons = document.querySelectorAll('.tab-btn');
  var panels = document.querySelectorAll('.panel');

  function activateTab(name) {
    tabButtons.forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.tab === name);
    });
    panels.forEach(function (panel) {
      panel.classList.toggle('active', panel.dataset.panel === name);
    });
    try { localStorage.setItem('parapente-memo:tab', name); } catch (e) {}
  }

  tabButtons.forEach(function (btn) {
    btn.addEventListener('click', function () { activateTab(btn.dataset.tab); });
  });

  (function restoreTab() {
    var saved = null;
    try { saved = localStorage.getItem('parapente-memo:tab'); } catch (e) {}
    if (saved && document.querySelector('[data-panel="' + saved + '"]')) {
      activateTab(saved);
    }
  })();

  // ---------- "révisé" checkboxes ----------
  function loadReviewed() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_REVIEWED) || '{}');
    } catch (e) { return {}; }
  }
  function saveReviewed(state) {
    try { localStorage.setItem(STORAGE_REVIEWED, JSON.stringify(state)); } catch (e) {}
  }

  var reviewedState = loadReviewed();
  document.querySelectorAll('[data-review]').forEach(function (input) {
    var id = input.dataset.review;
    var card = input.closest('.card');
    if (reviewedState[id]) {
      input.checked = true;
      if (card) card.classList.add('is-reviewed');
    }
    input.addEventListener('change', function () {
      reviewedState[id] = input.checked;
      saveReviewed(reviewedState);
      if (card) card.classList.toggle('is-reviewed', input.checked);
    });
  });

  // ---------- Lexique search ----------
  var lexSearch = document.getElementById('lexiqueSearch');
  var lexItems = document.querySelectorAll('.lex-item');
  var lexEmpty = document.getElementById('lexiqueEmpty');

  if (lexSearch) {
    lexSearch.addEventListener('input', function () {
      var q = lexSearch.value.trim().toLowerCase();
      var visibleCount = 0;
      lexItems.forEach(function (item) {
        var text = item.textContent.toLowerCase();
        var match = text.indexOf(q) !== -1;
        item.style.display = match ? '' : 'none';
        if (match) visibleCount++;
      });
      lexEmpty.hidden = visibleCount !== 0;
    });
  }

  // ---------- Quiz ----------
  var QUESTIONS = [
    {
      cat: 'materiel',
      q: "Que veut-on dire par une voile classée « EN B » ?",
      options: [
        "Une voile de compétition exigeante",
        "Une voile loisir/progression, plus tolérante qu'une C ou D",
        "Un modèle réservé aux instructeurs",
        "Une voile qui n'a pas de norme officielle"
      ],
      correct: 1,
      explain: "L'échelle EN va globalement de A (très tolérante) à D (compétition). La B est la catégorie loisir/progression la plus répandue."
    },
    {
      cat: 'materiel',
      q: "À quoi sert la protection dorsale de la sellette ?",
      options: [
        "À améliorer l'aérodynamisme",
        "À amortir un choc, notamment en cas d'atterrissage brutal",
        "À stocker le parachute de secours",
        "À régler la vitesse de l'aile"
      ],
      correct: 1,
      explain: "Mousse ou airbag, elle absorbe une partie du choc en cas d'impact au sol, avec une efficacité qui dépend du type et de la vitesse verticale à l'impact."
    },
    {
      cat: 'materiel',
      q: "À quel rythme un contrôle (« check ») de la voile en atelier est-il généralement conseillé ?",
      options: [
        "Tous les 100h de vol ou 1 à 2 ans environ, à ajuster selon l'usage",
        "Une seule fois, à l'achat",
        "Tous les 10 vols sans exception",
        "Ce n'est jamais nécessaire pour une voile récente"
      ],
      correct: 0,
      explain: "C'est un ordre de grandeur courant, mais je ne suis pas certain qu'il soit universel — vérifie la recommandation du fabricant et pense à un contrôle avant toute reprise après une longue pause."
    },
    {
      cat: 'technique',
      q: "Que fait-on principalement pour corriger un gonflage asymétrique (l'aile part d'un côté) ?",
      options: [
        "Tirer fort sur les deux freins en même temps",
        "Freiner du côté qui part en avant",
        "Lâcher complètement les commandes",
        "Courir plus vite dans l'autre sens"
      ],
      correct: 1,
      explain: "On corrige avec le frein du côté qui avance, pour ralentir ce côté et réaligner l'aile, plutôt qu'en tirant symétriquement."
    },
    {
      cat: 'technique',
      q: "Le virage en parapente est piloté principalement par :",
      options: [
        "Le frein seul, sans jamais utiliser la sellette",
        "Une combinaison frein + report de poids dans la sellette",
        "L'accélérateur uniquement",
        "Le déplacement des élévateurs C"
      ],
      correct: 1,
      explain: "Le report de poids affine le virage et permet d'utiliser moins d'amplitude de frein, particulièrement en thermique."
    },
    {
      cat: 'technique',
      q: "Faire les « oreilles » sert principalement à :",
      options: [
        "Augmenter la vitesse maximale de l'aile",
        "Augmenter le taux de chute pour perdre de la hauteur ou mieux pénétrer dans le vent",
        "Déclencher un virage plus serré",
        "Réduire le risque de fermeture en air calme"
      ],
      correct: 1,
      explain: "En repliant les extrémités via les élévateurs A, on augmente le taux de chute sans trop augmenter la vitesse horizontale."
    },
    {
      cat: 'technique',
      q: "Face à un décrochage (freins trop bas, portance perdue), le réflexe est de :",
      options: [
        "Tirer encore plus fort sur les freins",
        "Relâcher progressivement les freins pour redonner de la vitesse à l'aile",
        "Lancer immédiatement le parachute de secours",
        "Accélérer au maximum avec la speed bar"
      ],
      correct: 1,
      explain: "Il faut redonner de la vitesse à l'aile en relâchant progressivement — un relâchement trop brutal peut aussi créer une abattée forte."
    },
    {
      cat: 'technique',
      q: "Le circuit d'approche classique pour l'atterrissage s'appelle :",
      options: [
        "Le triangle FAI",
        "La PTU (vent arrière, étape de base, finale)",
        "Le SIV",
        "Le cycle thermique"
      ],
      correct: 1,
      explain: "PTU = Prise de Terrain en U, pour arriver face au vent avec de la marge, à l'image d'un circuit d'aérodrome classique."
    },
    {
      cat: 'meteo',
      q: "Le vent est en général :",
      options: [
        "Plus faible en altitude qu'au sol",
        "Identique quelle que soit l'altitude",
        "Plus fort en altitude qu'au sol, à cause du frottement au sol qui le ralentit près du relief",
        "Toujours nul au-dessus de 1000m"
      ],
      correct: 2,
      explain: "C'est le gradient de vent : le frottement du sol et de la végétation ralentit l'air près de la surface."
    },
    {
      cat: 'meteo',
      q: "Qu'est-ce qu'un rotor ?",
      options: [
        "Un nuage annonciateur de beau temps stable",
        "Une turbulence qui se forme sous le vent d'un obstacle (crête, bâtiment...)",
        "Un instrument de mesure du vent",
        "Une technique de pilotage en spirale"
      ],
      correct: 1,
      explain: "Le rotor est une zone d'air turbulent, potentiellement dangereuse, à éviter en priorité."
    },
    {
      cat: 'meteo',
      q: "La brise de pente en milieu de journée a tendance à :",
      options: [
        "Descendre le long du relief",
        "Monter le long du relief, favorable au vol",
        "Rester parfaitement stable toute la journée",
        "N'exister que la nuit"
      ],
      correct: 1,
      explain: "En journée, le sol chauffé réchauffe l'air qui longe la pente et monte ; le phénomène s'inverse généralement en fin de journée."
    },
    {
      cat: 'meteo',
      q: "Un cumulus qui grossit vite avec des sommets en forme de choux-fleurs est plutôt le signe :",
      options: [
        "D'une masse d'air parfaitement stable, aucun risque",
        "D'une instabilité marquée, avec un risque de développement orageux",
        "D'un thermique qui va s'arrêter immédiatement",
        "D'une absence totale de vent"
      ],
      correct: 1,
      explain: "C'est un signal d'alerte classique d'instabilité et de développement convectif à surveiller de près."
    },
    {
      cat: 'securite',
      q: "En cas de croisement face à face avec un autre pilote, la règle est de :",
      options: [
        "Dévier chacun sur sa gauche",
        "Dévier chacun sur sa droite",
        "S'arrêter en vol stationnaire",
        "Le plus haut a toujours priorité, sans autre règle"
      ],
      correct: 1,
      explain: "Comme sur une route, chacun dévie sur sa droite pour éviter la collision."
    },
    {
      cat: 'securite',
      q: "En thermique partagé avec d'autres pilotes, la règle de sens de rotation est :",
      options: [
        "Chacun tourne dans le sens qu'il veut",
        "Tout le monde tourne dans le sens déjà engagé par le premier pilote présent",
        "On tourne toujours dans le sens des aiguilles d'une montre",
        "Il n'existe aucune règle établie"
      ],
      correct: 1,
      explain: "Le premier pilote dans le thermique impose le sens de rotation que les autres doivent suivre."
    },
    {
      cat: 'securite',
      q: "Concernant la décision de lancer le parachute de secours après une cravate qui ne se résout pas :",
      options: [
        "Il vaut mieux attendre le plus tard possible, au ras du sol, pour être sûr",
        "La décision doit être prise tôt, dès que l'altitude et la situation le permettent",
        "Le secours ne doit jamais être utilisé, sauf en compétition",
        "Il faut d'abord essayer l'accélérateur"
      ],
      correct: 1,
      explain: "Plus la décision est prise tôt, plus il reste de hauteur pour que le secours se déploie et remplisse son rôle correctement."
    },
    {
      cat: 'securite',
      q: "Avant de revoler après une longue pause (plusieurs années), la priorité raisonnable est de :",
      options: [
        "Repartir directement sur un site exigeant en conditions fortes pour se retester vite",
        "Faire un ou plusieurs stages de reprise avec un moniteur, sur une voile tolérante et en conditions calmes",
        "Sauter l'étape du contrôle matériel puisque le matériel a peu servi",
        "Voler seul en premier pour ne pas se sentir jugé"
      ],
      correct: 1,
      explain: "Un encadrement par un moniteur en activité, du matériel vérifié (notamment le parachute de secours replié) et des conditions calmes sont les bases raisonnables d'une reprise."
    }
  ];

  var CATEGORIES = [
    { id: 'materiel', label: 'Matériel' },
    { id: 'technique', label: 'Technique' },
    { id: 'meteo', label: 'Météo' },
    { id: 'securite', label: 'Sécurité' }
  ];

  var quizFiltersEl = document.getElementById('quizFilters');
  var quizAreaEl = document.getElementById('quizArea');
  var quizSummaryEl = document.getElementById('quizSummary');
  var quizRestartBtn = document.getElementById('quizRestart');

  function loadQuizFilters() {
    try {
      var saved = JSON.parse(localStorage.getItem(STORAGE_QUIZ_FILTERS) || 'null');
      if (saved && Array.isArray(saved) && saved.length) return saved;
    } catch (e) {}
    return CATEGORIES.map(function (c) { return c.id; });
  }
  function saveQuizFilters(active) {
    try { localStorage.setItem(STORAGE_QUIZ_FILTERS, JSON.stringify(active)); } catch (e) {}
  }

  var activeFilters = loadQuizFilters();
  var score = { correct: 0, answered: 0 };

  function renderFilters() {
    quizFiltersEl.innerHTML = '';
    CATEGORIES.forEach(function (cat) {
      var chip = document.createElement('span');
      chip.className = 'chip' + (activeFilters.indexOf(cat.id) !== -1 ? ' active' : '');
      chip.textContent = cat.label;
      chip.addEventListener('click', function () {
        var idx = activeFilters.indexOf(cat.id);
        if (idx === -1) {
          activeFilters.push(cat.id);
        } else if (activeFilters.length > 1) {
          activeFilters.splice(idx, 1);
        }
        saveQuizFilters(activeFilters);
        renderFilters();
        renderQuiz();
      });
      quizFiltersEl.appendChild(chip);
    });
  }

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  function renderQuiz() {
    var pool = shuffle(QUESTIONS.filter(function (q) {
      return activeFilters.indexOf(q.cat) !== -1;
    }));
    score = { correct: 0, answered: 0 };
    quizSummaryEl.hidden = true;
    quizAreaEl.innerHTML = '';

    if (!pool.length) {
      quizAreaEl.innerHTML = '<p>Sélectionne au moins une catégorie.</p>';
      return;
    }

    pool.forEach(function (question, qIndex) {
      var wrap = document.createElement('div');
      wrap.className = 'quiz-question';

      var catLabel = CATEGORIES.filter(function (c) { return c.id === question.cat; })[0];
      var catEl = document.createElement('div');
      catEl.className = 'q-cat';
      catEl.textContent = catLabel ? catLabel.label : question.cat;
      wrap.appendChild(catEl);

      var textEl = document.createElement('p');
      textEl.className = 'q-text';
      textEl.textContent = (qIndex + 1) + '. ' + question.q;
      wrap.appendChild(textEl);

      var optsEl = document.createElement('div');
      optsEl.className = 'q-options';

      var order = shuffle(question.options.map(function (opt, i) { return { opt: opt, i: i }; }));

      var explainEl = document.createElement('div');
      explainEl.className = 'q-explain';
      explainEl.textContent = question.explain;

      order.forEach(function (entry) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'q-option';
        btn.textContent = entry.opt;
        btn.addEventListener('click', function () {
          var allBtns = optsEl.querySelectorAll('.q-option');
          allBtns.forEach(function (b) { b.disabled = true; });
          var isCorrect = entry.i === question.correct;
          btn.classList.add(isCorrect ? 'correct' : 'incorrect');
          if (!isCorrect) {
            allBtns.forEach(function (b, bi) {
              var origIndex = order[bi].i;
              if (origIndex === question.correct) b.classList.add('correct');
            });
          }
          explainEl.classList.add('shown');
          score.answered++;
          if (isCorrect) score.correct++;
          if (score.answered === pool.length) showSummary(pool.length);
        });
        optsEl.appendChild(btn);
      });

      wrap.appendChild(optsEl);
      wrap.appendChild(explainEl);
      quizAreaEl.appendChild(wrap);
    });
  }

  function showSummary(total) {
    quizSummaryEl.hidden = false;
    quizSummaryEl.textContent = 'Score : ' + score.correct + ' / ' + total +
      ' — ' + (score.correct === total ? "Bien joué, mais garde en tête que le quiz reste indicatif." : "Revois les points ratés dans les onglets correspondants avant de considérer un point comme acquis.");
  }

  if (quizRestartBtn) quizRestartBtn.addEventListener('click', renderQuiz);
  if (quizFiltersEl) { renderFilters(); renderQuiz(); }

})();
