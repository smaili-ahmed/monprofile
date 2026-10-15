/**
 * SecureDev Studio — main.js (vanilla JS, sans backend, site multi-pages)
 *
 * ============================================================
 *  CONFIGURATION À PERSONNALISER AVANT PUBLICATION
 * ============================================================
 * - Les URLs LinkedIn ci-dessous sont les profils EXACTS fournis
 *   (ne pas les remplacer par d'autres profils homonymes).
  * - whatsappNumber : numéro WhatsApp au format international (+212 721903461),
  *   SANS "+" ni espaces (ex. Maroc : "2126XXXXXXXX").
 * - contactEmail : aucune adresse réelle fournie → emplacement
 *   à configurer (domaine réservé ".example" = aucune boîte réelle).
 * - videoBg.enabled = false → fonds statiques (posters) partout.
 */
const SITE_CONFIG = {
  // Profils LinkedIn exacts (vérifiés le 14/10/2026 via extraits publics ;
  // l'accès direct LinkedIn bloque les visiteurs non connectés — code 999).
  linkedinAhmedUrl: "https://www.linkedin.com/in/ahmed-smaili-bb48883aa/",
  linkedinDahiUrl: "https://www.linkedin.com/in/dahi-mohammed-567b962b5/",
  // Numéro WhatsApp — configuré (format international, sans "+" ni espaces).
  whatsappNumber: "212721903461",
  // Adresse e-mail de contact.
  contactEmail: "smailiahmad937@gmail.com",
  // Texte de disponibilité dans le hero (chaîne vide = masque le badge).
  availabilityText: "Basés à Oujda (Maroc) · ouverts aux missions freelance",
  // Fonds vidéo : true = lecture auto (muet, en boucle, sans contrôles).
  videoBg: { enabled: true },
};

(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function storeTemporarySafe(key, value) {
    try { window.sessionStorage.setItem(key, value); } catch (e) { /* stockage indisponible */ }
  }
  function readTemporarySafe(key) {
    try { return window.sessionStorage.getItem(key); } catch (e) { return null; }
  }

  /* ---------- 1. Appliquer la configuration centralisée ---------- */
  function applyConfig() {
    var linkedinTargets = document.querySelectorAll("[data-linkedin]");
    linkedinTargets.forEach(function (el) {
      var key = el.getAttribute("data-linkedin");
      var url = key === "dahi" ? SITE_CONFIG.linkedinDahiUrl : SITE_CONFIG.linkedinAhmedUrl;
      el.setAttribute("href", url);
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener noreferrer");
    });

    var waTargets = document.querySelectorAll("[data-whatsapp]");
    waTargets.forEach(function (el) {
      el.setAttribute("href", "https://wa.me/" + SITE_CONFIG.whatsappNumber);
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener noreferrer");
    });

    var emailLinks = document.querySelectorAll("[data-email-link]");
    emailLinks.forEach(function (el) {
      el.setAttribute("href", "mailto:" + SITE_CONFIG.contactEmail);
    });
    var emailTexts = document.querySelectorAll("[data-email-text]");
    emailTexts.forEach(function (el) {
      el.textContent = SITE_CONFIG.contactEmail;
    });

    var availability = document.getElementById("availabilityText");
    if (availability) {
      if (SITE_CONFIG.availabilityText) {
        availability.textContent = SITE_CONFIG.availabilityText;
      } else if (availability.parentElement) {
        availability.parentElement.style.display = "none";
      }
    }
  }

  /* ---------- 2. Navbar : effet au défilement + lien actif par page ---------- */
  function initNavbar() {
    var nav = document.getElementById("mainNav");
    if (nav) {
      var onScroll = function () {
        nav.classList.toggle("scrolled", window.scrollY > 24);
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }
    // Lien actif selon la page courante (body[data-page] prioritaire).
    var page = (document.body && document.body.getAttribute("data-page")) || "";
    if (!page) {
      var file = (window.location.pathname.split("/").pop() || "index.html").split("?")[0].split("#")[0];
      page = file.replace(/\.html$/, "") || "index";
    }
    document.querySelectorAll('#mainNav .nav-link[data-nav]').forEach(function (a) {
      if (a.getAttribute("data-nav") === page) {
        a.classList.add("active");
        a.setAttribute("aria-current", "page");
      } else {
        a.classList.remove("active");
        a.removeAttribute("aria-current");
      }
    });
  }

  /* ---------- 3. Fermer le menu mobile après clic ---------- */
  function initMobileMenu() {
    var menu = document.getElementById("navMenu");
    if (!menu || !window.bootstrap) return;
    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        if (!menu.classList.contains("show")) return;
        var collapse = window.bootstrap.Collapse.getInstance(menu);
        if (collapse) collapse.hide();
        else menu.classList.remove("show");
      });
    });
  }

  /* ---------- 4. Fonds vidéo ----------
     - Hero : lecture immédiate (prioritaire).
     - data-src : chargement différé quand la section approche (preload="none").
     - Pause hors écran + onglet masqué + prefers-reduced-motion (posters statiques). */
  function initVideoBg() {
    // Unique fond vidéo : le panneau du hero d'accueil (.sd-hero-figure).
    // Le reste du site est statique (direction noir & blanc).
    var videos = document.querySelectorAll(".sd-hero-figure video");
    if (!videos.length) return;
    if (prefersReducedMotion || !SITE_CONFIG.videoBg.enabled) {
      videos.forEach(function (v) {
        v.removeAttribute("autoplay");
        try { v.pause(); } catch (e) { /* ignore */ }
        v.preload = "none";
        v.removeAttribute("data-src"); // ne jamais charger : le poster suffit
      });
      return;
    }

    var playIfVisible = function (v) {
      // NOTE : aucun test de chargement ici — play() déclenche lui-même
      // le chargement (y compris via l'enfant <source>). L'ancien garde
      // « pas encore chargée » empêchait tout démarrage sans scroll.
      var r = v.getBoundingClientRect();
      var vh = window.innerHeight || 800;
      var visible = r.bottom > 0 && r.top < vh;
      if (visible && v.paused) {
        var p = v.play();
        if (p && p.catch) p.catch(function () { /* lecture auto refusée */ });
      } else if (!visible && !v.paused) {
        v.pause();
      }
    };
    var refreshAll = function () {
      videos.forEach(playIfVisible);
    };
    // Re-tente la lecture dès que des données arrivent (le play() initial
    // peut partir avant que le navigateur ait résolu la source).
    videos.forEach(function (v) {
      v.addEventListener("loadeddata", function () { playIfVisible(v); });
      v.addEventListener("canplay", function () { playIfVisible(v); });
    });

    if ("IntersectionObserver" in window) {
      var loader = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            var v = entry.target;
            if (entry.isIntersecting && v.hasAttribute("data-src")) {
              v.src = v.getAttribute("data-src");
              v.removeAttribute("data-src");
              v.load();
              loader.unobserve(v);
            }
            playIfVisible(v);
          });
        },
        { rootMargin: "600px 0px" }
      );
      videos.forEach(function (v) { loader.observe(v); });
    } else {
      // Repli : charge tout immédiatement.
      videos.forEach(function (v) {
        if (v.hasAttribute("data-src")) {
          v.src = v.getAttribute("data-src");
          v.removeAttribute("data-src");
          v.load();
        }
      });
    }

    window.addEventListener("scroll", refreshAll, { passive: true });
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) videos.forEach(function (v) { v.pause(); });
      else refreshAll();
    });
    refreshAll();
  }

  /* ---------- 5. Apparition progressive au défilement ---------- */
  function initReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("visible"); });
      return;
    }
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    items.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- 6. Pré-remplissage inter-pages (services/équipe → contact) ---------- */
  function initServicePrefill() {
    document.querySelectorAll("[data-service]").forEach(function (el) {
      el.addEventListener("click", function () {
        storeTemporarySafe("sd_service", el.getAttribute("data-service") || "");
      });
    });
    document.querySelectorAll("[data-contact-name]").forEach(function (el) {
      el.addEventListener("click", function () {
        storeTemporarySafe("sd_name", el.getAttribute("data-contact-name") || "");
      });
    });
    var typeSelect = document.getElementById("fType");
    var msg = document.getElementById("fMsg");
    if (!typeSelect && !msg) return;
    var service = readTemporarySafe("sd_service");
    if (service && typeSelect) {
      Array.prototype.forEach.call(typeSelect.options, function (opt) {
        if (opt.text === service) typeSelect.value = opt.value || opt.text;
      });
    }
    var name = readTemporarySafe("sd_name");
    if (name && msg && !msg.value) {
      msg.value = "Bonjour " + name + ",\n\nJe vous contacte au sujet de : ";
    }
  }

  /* ---------- 6b. WhatsApp pré-rempli par service ----------
     Ouvre wa.me avec un message mentionnant le service choisi.
     L'utilisateur confirme l'envoi dans WhatsApp : rien d'automatique. */
  function initWaService() {
    document.querySelectorAll("[data-wa-service]").forEach(function (el) {
      el.addEventListener("click", function (e) {
        e.preventDefault();
        var service = el.getAttribute("data-wa-service") || "Demande de devis";
        var msg = [
          "Bonjour SecureDev Studio,",
          "",
          "Je suis intéressé par le service : " + service,
          "",
          "Mon besoin :",
          "[Décrivez votre besoin ici]",
          "",
          "Pouvons-nous discuter du périmètre du projet ?",
        ].join("\n");
        // Redirection DIRECTE vers WhatsApp (même onglet) : sur mobile,
        // l'application WhatsApp s'ouvre aussitôt avec le message pré-rempli.
        window.location.href =
          "https://wa.me/" + SITE_CONFIG.whatsappNumber + "?text=" + encodeURIComponent(msg);
      });
    });
  }

  /* ---------- 7. Formulaire SANS backend : WhatsApp + e-mail ----------
     N'envoie RIEN directement : ouvre WhatsApp (message pré-rempli,
     l'utilisateur confirme l'envoi lui-même) ou la messagerie. */
  function buildMessage(form) {
    var data = new FormData(form);
    return [
      "Bonjour SecureDev Studio,",
      "",
      "Nom : " + (data.get("name") || ""),
      "E-mail : " + (data.get("email") || ""),
      "Type de projet : " + (data.get("type") || ""),
      "Budget indicatif : " + (data.get("budget") || "Non précisé"),
      "",
      "Description du besoin :",
      String(data.get("message") || ""),
    ].join("\n");
  }
  function setStatus(text, kind) {
    var status = document.getElementById("formStatus");
    if (status) {
      status.className = "sd-form-status " + (kind || "");
      status.textContent = text;
    }
  }
  function initDemoForm() {
    var form = document.getElementById("contactForm");
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      var url = "https://wa.me/" + SITE_CONFIG.whatsappNumber +
        "?text=" + encodeURIComponent(buildMessage(form));
      setStatus("Ouverture de WhatsApp… il ne reste qu'à appuyer sur Envoyer dans WhatsApp.", "success");
      // Redirection DIRECTE (même onglet) : WhatsApp s'ouvre aussitôt
      // avec le message pré-rempli, sans nouvel onglet ni blocage.
      window.location.href = url;
    });

    var emailBtn = document.getElementById("emailFallback");
    if (emailBtn) {
      emailBtn.addEventListener("click", function () {
        if (!form.checkValidity()) {
          form.reportValidity();
          return;
        }
        var data = new FormData(form);
        var subject = "[" + (data.get("type") || "Contact") + "] Nouveau besoin — " + (data.get("name") || "");
        var body = buildMessage(form);
        setStatus("Ouverture de Gmail… il ne reste qu'à appuyer sur Envoyer dans Gmail.", "success");
        // Redirection DIRECTE vers la rédaction Gmail (même onglet),
        // avec destinataire, objet et message déjà remplis.
        window.location.href =
          "https://mail.google.com/mail/?view=cm&fs=1" +
          "&to=" + encodeURIComponent(SITE_CONFIG.contactEmail) +
          "&su=" + encodeURIComponent(subject) +
          "&body=" + encodeURIComponent(body);
      });
    }
  }

  /* ---------- 8b. Équipe : barres de compétences + formulaires individuels ---------- */
  function initTeamSkills() {
    var skills = document.querySelectorAll(".team-card .skill");
    if (!skills.length) return;
    var animate = function (el) {
      var bar = el.querySelector(".skill-bar span");
      var level = parseInt(el.getAttribute("data-level") || "80", 10);
      if (bar) requestAnimationFrame(function () { bar.style.width = level + "%"; });
    };
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      skills.forEach(animate);
      return;
    }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { animate(entry.target); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.4 });
    skills.forEach(function (s) { obs.observe(s); });
  }

  function initTeamForms() {
    document.querySelectorAll(".team-form").forEach(function (form) {
      var member = form.getAttribute("data-member") || "SecureDev Studio";
      var status = form.querySelector(".team-status");
      var say = function (txt, ok) {
        if (status) {
          status.textContent = txt;
          status.classList.toggle("success", !!ok);
        }
      };
      var getData = function () {
        return {
          name: (form.querySelector('[name="name"]') || {}).value || "",
          email: (form.querySelector('[name="email"]') || {}).value || "",
          message: (form.querySelector('[name="message"]') || {}).value || "",
        };
      };
      var valid = function () {
        var ok = true;
        form.querySelectorAll("[required]").forEach(function (f) {
          f.classList.remove("shake");
          if (!f.value.trim() || (f.type === "email" && f.value && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.value))) {
            ok = false;
            f.classList.add("shake");
            setTimeout(function () { f.classList.remove("shake"); }, 450);
          }
        });
        return ok;
      };
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (!valid()) { say("Veuillez remplir votre nom et votre message.", false); return; }
        var d = getData();
        var msg = ["Bonjour " + member + ",", "", "Je m'appelle " + d.name + (d.email ? " (" + d.email + ")" : "") + ".", "", d.message].join("\n");
        say("Ouverture de WhatsApp vers " + member + "… appuyez sur Envoyer dans WhatsApp.", true);
        // Redirection DIRECTE (même onglet) vers WhatsApp.
        window.location.href = "https://wa.me/" + SITE_CONFIG.whatsappNumber + "?text=" + encodeURIComponent(msg);
      });
      var mailBtn = form.querySelector("[data-team-mail]");
      if (mailBtn) {
        mailBtn.addEventListener("click", function () {
          if (!valid()) { say("Veuillez remplir votre nom et votre message.", false); return; }
          var d = getData();
          var subject = "[Contact " + member + "] Message de " + d.name;
          var body = ["Bonjour " + member + ",", "", d.message, "", "— " + d.name + (d.email ? " (" + d.email + ")" : "")].join("\n");
          say("Ouverture de Gmail vers " + member + "… appuyez sur Envoyer dans Gmail.", true);
          // Redirection DIRECTE vers la rédaction Gmail (même onglet).
          window.location.href =
            "https://mail.google.com/mail/?view=cm&fs=1" +
            "&to=" + encodeURIComponent(SITE_CONFIG.contactEmail) +
            "&su=" + encodeURIComponent(subject) +
            "&body=" + encodeURIComponent(body);
        });
      }
    });
  }

  /* ---------- 8. Année auto + retour en haut ---------- */
  function initFooter() {
    var year = document.getElementById("year");
    if (year) year.textContent = String(new Date().getFullYear());

    var btn = document.getElementById("backToTop");
    if (btn) {
      btn.addEventListener("click", function () {
        if (prefersReducedMotion) window.scrollTo(0, 0);
        else window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
  }

  /* ---------- Init ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    applyConfig();
    initNavbar();
    initMobileMenu();
    initVideoBg();
    initReveal();
    initServicePrefill();
    initWaService();
    initDemoForm();
    initTeamSkills();
    initTeamForms();
    initFooter();
  });
})();
