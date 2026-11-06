(function () {
  "use strict";

  const content = window.JIBON_CONTENT;
  const imageBase = "assets/images/";
  const gallery = document.getElementById("gallery-grid");
  const tabs = document.getElementById("package-tabs");
  const panel = document.getElementById("package-panel");
  const contactForm = document.getElementById("contact-form");
  const contactPackage = document.getElementById("contact-package");
  const whatsappNumber = content.whatsappNumber;

  function makeWhatsAppUrl(message) {
    return "https://wa.me/" + whatsappNumber + "?text=" + encodeURIComponent(message);
  }

  function renderGallery() {
    gallery.innerHTML = content.gallery.map(function (item, index) {
      return '<button class="gallery-item gallery-' + item.shape + ' reveal" type="button" data-index="' + index + '" aria-label="View ' + item.title + ' photograph">' +
        '<img src="' + imageBase + item.image + '" alt="' + item.title + '" loading="lazy">' +
        '<span class="gallery-overlay"><span class="gallery-category">' + item.category + '</span><span class="gallery-title">' + item.title + '</span><span class="gallery-view" aria-hidden="true">↗</span></span>' +
        '</button>';
    }).join("");
  }

  function renderFilms() {
    const filmContainer = document.getElementById("film-previews");
    filmContainer.innerHTML = (content.films || []).map(function (film) {
      return '<figure class="film-preview"><video controls preload="none" poster="' + imageBase + film.poster + '">' +
        '<source src="assets/videos/' + film.video + '" type="video/mp4">' +
        "Your browser does not support embedded video." +
        '</video><figcaption>' + film.title + '</figcaption></figure>';
    }).join("");
  }

  function renderTabs(activeId) {
    tabs.innerHTML = content.packageCategories.map(function (category) {
      const active = category.id === activeId;
      return '<button class="package-tab' + (active ? " is-active" : "") + '" type="button" role="tab" id="tab-' + category.id + '" aria-selected="' + active + '" aria-controls="package-panel" data-category="' + category.id + '">' +
        category.name + (category.available ? "" : '<span class="coming-soon">Coming soon</span>') + '</button>';
    }).join("");
  }

  function bookingMessage(packageInfo) {
    return "Assalamu Alaikum,\n\nI would like to book a wedding photography package from Jibon Photography.\n\nPackage: " +
      packageInfo.name + "\nPrice: " + packageInfo.priceLabel +
      "\n\nPlease provide more information about availability and booking.\n\nThank you.";
  }

  function populateContactPackages() {
    const packages = [];
    content.packageCategories.forEach(function (category) {
      if (!category.available) return;
      category.packages.forEach(function (item) {
        const value = category.id + ":" + item.name;
        packages.push({
          value: value,
          label: category.name + " — " + item.name + " (" + item.priceLabel + ")"
        });
      });
    });

    contactPackage.innerHTML = '<option value="">Choose a package</option>' +
      packages.map(function (item) {
        return '<option value="' + item.value + '">' + item.label + '</option>';
      }).join("");
  }

  function initContactForm() {
    populateContactPackages();
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const selectedPackage = contactPackage.value;
      const packageInfo = content.packageCategories.reduce(function (match, category) {
        if (match || !selectedPackage.startsWith(category.id + ":")) return match;
        const packageName = selectedPackage.slice(category.id.length + 1);
        const item = category.packages.find(function (candidate) {
          return candidate.name === packageName;
        });
        return item ? { category: category, item: item } : null;
      }, null);

      if (!packageInfo) {
        throw new Error("Selected wedding package could not be found.");
      }

      const eventDate = new Intl.DateTimeFormat("en-BD", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "UTC"
      }).format(new Date(document.getElementById("contact-date").value + "T00:00:00Z"));
      const message = "Assalamu Alaikum Jibon Photography,\n\n" +
        "I would like to enquire about booking:\n\n" +
        "Name: " + document.getElementById("contact-name").value.trim() + "\n" +
        "Event date: " + eventDate + "\n" +
        "Package: " + packageInfo.category.name + " — " + packageInfo.item.name + "\n" +
        "Price: " + packageInfo.item.priceLabel + "\n\n" +
        "Please let me know if you are available and how to confirm the booking.\n\nThank you.";

      window.location.assign(makeWhatsAppUrl(message));
    });
  }

  function renderPackages(categoryId) {
    const category = content.packageCategories.find(function (item) {
      return item.id === categoryId;
    });

    if (!category) {
      throw new Error("Wedding package category not found: " + categoryId);
    }

    renderTabs(categoryId);
    panel.setAttribute("aria-labelledby", "tab-" + category.id);

    if (!category.available || category.packages.length === 0) {
      panel.innerHTML = '<div class="packages-empty"><span class="empty-star" aria-hidden="true">✳</span><p class="eyebrow">A new chapter, coming soon</p><h3>' + category.name + ' collections are in the works.</h3><p>We haven’t published packages for this collection yet. Get in touch to ask about your celebration.</p><a class="text-link" href="' + makeWhatsAppUrl("Assalamu Alaikum, I would like to ask about " + category.name + " photography from Jibon Photography. Please share any updates.") + '" target="_blank" rel="noopener noreferrer">Ask us on WhatsApp <span aria-hidden="true">↗</span></a></div>';
      return;
    }

    panel.innerHTML = '<div class="packages-intro"><span class="packages-count">' + String(category.packages.length).padStart(2, "0") + ' collections</span><p>Every celebration is different. Choose a starting point, then let’s talk about the details.</p></div>' +
      '<div class="package-grid">' + category.packages.map(function (item, index) {
        const orderMessage = bookingMessage(item);
          const packageImage = item.image
            ? '<img class="package-image" src="' + imageBase + item.image + '" alt="' + item.name + ' package image" loading="lazy">'
            : "";
          return '<article class="package-card' + (item.featured ? " package-featured" : "") + '">' +
            packageImage +
          '<div class="package-card-top"><span class="package-index">PACKAGE ' + String(index + 1).padStart(2, "0") + '</span>' +
          (item.specialFeature
            ? '<span class="package-badge package-badge-special">✦ ' + item.specialFeature + '</span>'
            : item.badge ? '<span class="package-badge">' + item.badge + '</span>'
            : item.featured ? '<span class="package-badge">Most complete</span>' : "") + '</div>' +
          '<h3>' + item.name.replace("Muslim Wedding ", "") + '</h3>' +
          '<p class="package-description">' + item.description + '</p>' +
          '<p class="package-price"><span>' + item.priceLabel + '</span><small>per event collection</small></p>' +
          '<div class="package-divider"></div><p class="included-label">Included</p>' +
          '<ul class="service-list">' + item.services.map(function (service) {
            return "<li>" + service + "</li>";
          }).join("") + '</ul>' +
          '<a class="button ' + (item.featured ? "button-gold" : "button-card") + ' package-order" href="' + makeWhatsAppUrl(orderMessage) + '" target="_blank" rel="noopener noreferrer" aria-label="Order ' + item.name + ' for ' + item.priceLabel + ' on WhatsApp">Order this package <span aria-hidden="true">↗</span></a>' +
          '</article>';
      }).join("") + '</div>';
  }

  function initGalleryDialog() {
    const dialog = document.getElementById("photo-dialog");
    const dialogImage = document.getElementById("dialog-image");
    const dialogCaption = document.getElementById("dialog-caption");

    gallery.addEventListener("click", function (event) {
      const button = event.target.closest(".gallery-item");
      if (!button) return;
      const item = content.gallery[Number(button.dataset.index)];
      dialogImage.src = imageBase + item.image;
      dialogImage.alt = item.title;
      dialogCaption.textContent = item.title + " · " + item.category;
      dialog.showModal();
    });

    dialog.addEventListener("click", function (event) {
      if (event.target === dialog) dialog.close();
    });
  }

  function initNavigation() {
    const toggle = document.querySelector(".menu-toggle");
    const nav = document.getElementById("primary-nav");
    toggle.addEventListener("click", function () {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!expanded));
      toggle.setAttribute("aria-label", expanded ? "Open navigation" : "Close navigation");
      nav.classList.toggle("is-open", !expanded);
    });

    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) {
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open navigation");
        nav.classList.remove("is-open");
      }
    });

    tabs.addEventListener("click", function (event) {
      const button = event.target.closest("[data-category]");
      if (button) renderPackages(button.dataset.category);
    });
  }

  function initReveal() {
    const items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      items.forEach(function (item) { item.classList.add("is-visible"); });
      return;
    }

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    items.forEach(function (item) { observer.observe(item); });
  }

  document.getElementById("current-year").textContent = String(new Date().getFullYear());
  renderGallery();
  renderFilms();
  renderPackages(content.packageCategories[0].id);
  initContactForm();
  initGalleryDialog();
  initNavigation();
  initReveal();
}());
