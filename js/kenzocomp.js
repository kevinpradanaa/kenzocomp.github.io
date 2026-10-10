(function () {
  "use strict";

  var whatsappNumber = "6283869993716";
  var rootPath = document.body.getAttribute("data-root") || "";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function createElement(tagName, className, text) {
    var element = document.createElement(tagName);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function loadJson(fileName) {
    return fetch(rootPath + "data/" + fileName).then(function (response) {
      if (!response.ok) {
        throw new Error("Permintaan data " + fileName + " gagal (" + response.status + ").");
      }
      return response.json();
    });
  }

  function showLoadError(container, message) {
    if (!container) return;
    container.replaceChildren(createElement("p", "error-message", message));
  }

  function setupMenu() {
    var toggle = document.querySelector(".menu-toggle");
    var nav = document.querySelector(".primary-nav");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", function () {
      var expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!expanded));
      toggle.setAttribute("aria-label", expanded ? "Buka navigasi" : "Tutup navigasi");
      nav.classList.toggle("is-open", !expanded);
    });

    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Buka navigasi");
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Buka navigasi");
        toggle.focus();
      }
    });
  }

  function setupHeroSlider() {
    var slider = document.querySelector("[data-slider]");
    if (!slider) return;

    var viewport = slider.querySelector("[data-slider-viewport]");
    var track = slider.querySelector("[data-slider-track]");
    var slides = Array.prototype.slice.call(slider.querySelectorAll("[data-slide]"));
    var tabs = Array.prototype.slice.call(slider.querySelectorAll("[data-slide-to]"));
    var dots = Array.prototype.slice.call(slider.querySelectorAll("[data-slide-dot]"));
    var title = slider.querySelector("[data-slide-title]");
    var description = slider.querySelector("[data-slide-description]");
    var counter = slider.querySelector("[data-slide-current]");
    var slideCopy = [
      ["Website company profile", "Bangun kehadiran digital yang profesional dan mudah ditemukan."],
      ["Aplikasi mobile Android", "Bawa aktivitas dan ringkasan bisnis ke genggaman tim Anda."],
      ["Dashboard ERP", "Satukan informasi operasional agar keputusan terasa lebih terarah."],
      ["Katalog laptop ThinkPad", "Bandingkan pilihan perangkat dan tanyakan kondisi unit dengan jelas."],
      ["Booking service laptop", "Mulai dari jadwal pengecekan hingga persetujuan estimasi." ]
    ];
    var current = 0;
    var startX = 0;
    var isPointerDown = false;
    var pointerId = null;
    var pointerOver = false;
    var focusWithin = false;
    var timer = null;

    function render(index) {
      current = (index + slides.length) % slides.length;
      track.style.transform = "translateX(-" + (current * 20) + "%)";
      slides.forEach(function (slide, slideIndex) {
        slide.setAttribute("aria-hidden", String(slideIndex !== current));
        slide.setAttribute("tabindex", slideIndex === current ? "0" : "-1");
      });
      tabs.forEach(function (tab, tabIndex) {
        tab.setAttribute("aria-selected", String(tabIndex === current));
        tab.setAttribute("tabindex", tabIndex === current ? "0" : "-1");
      });
      dots.forEach(function (dot, dotIndex) {
        if (dotIndex === current) dot.setAttribute("aria-current", "true");
        else dot.removeAttribute("aria-current");
      });
      title.textContent = slideCopy[current][0];
      description.textContent = slideCopy[current][1];
      counter.textContent = String(current + 1).padStart(2, "0");
    }

    function stopAutoplay() {
      if (timer !== null) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    function startAutoplay() {
      stopAutoplay();
      if (reduceMotion || pointerOver || focusWithin || document.hidden) return;
      timer = window.setInterval(function () {
        render(current + 1);
      }, 5000);
    }

    tabs.forEach(function (tab, index) {
      tab.addEventListener("click", function () {
        render(index);
        startAutoplay();
      });
      tab.addEventListener("keydown", function (event) {
        var nextIndex = null;
        if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = (index + 1) % tabs.length;
        if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = (index - 1 + tabs.length) % tabs.length;
        if (event.key === "Home") nextIndex = 0;
        if (event.key === "End") nextIndex = tabs.length - 1;
        if (nextIndex !== null) {
          event.preventDefault();
          tabs[nextIndex].focus();
          render(nextIndex);
        }
      });
    });

    dots.forEach(function (dot, index) {
      dot.addEventListener("click", function () {
        render(index);
        startAutoplay();
      });
    });

    viewport.addEventListener("keydown", function (event) {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        render(current + 1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        render(current - 1);
      }
    });

    viewport.addEventListener("pointerdown", function (event) {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      isPointerDown = true;
      pointerId = event.pointerId;
      startX = event.clientX;
    });
    viewport.addEventListener("pointerup", function (event) {
      if (!isPointerDown || event.pointerId !== pointerId) return;
      var distance = event.clientX - startX;
      isPointerDown = false;
      pointerId = null;
      if (Math.abs(distance) > 40) render(current + (distance < 0 ? 1 : -1));
    });
    viewport.addEventListener("pointercancel", function () {
      isPointerDown = false;
      pointerId = null;
    });

    slider.addEventListener("pointerenter", function () {
      pointerOver = true;
      stopAutoplay();
    });
    slider.addEventListener("pointerleave", function () {
      pointerOver = false;
      startAutoplay();
    });
    slider.addEventListener("focusin", function () {
      focusWithin = true;
      stopAutoplay();
    });
    slider.addEventListener("focusout", function () {
      window.setTimeout(function () {
        focusWithin = slider.contains(document.activeElement);
        startAutoplay();
      }, 0);
    });
    document.addEventListener("visibilitychange", startAutoplay);

    render(0);
    startAutoplay();
  }

  function setupProducts() {
    var container = document.querySelector("[data-products]");
    if (!container) return;

    var activeFilter = "all";
    var activeModel = "all";
    var activeCondition = "all";
    var activePrice = "all";
    var productData = [];

    function matchesPrice(product) {
      if (activePrice === "all") return true;
      if (typeof product.price !== "number") return false;
      if (activePrice === "under-5") return product.price < 5000000;
      if (activePrice === "5-8") return product.price >= 5000000 && product.price <= 8000000;
      return product.price > 8000000;
    }

    function renderProducts() {
      container.replaceChildren();
      var visibleProducts = productData.filter(function (product) {
        var modelMatches = activeModel === "all" || product.model.toLowerCase().indexOf(activeModel) !== -1;
        var conditionMatches = activeCondition === "all" || product.condition.toLowerCase().indexOf(activeCondition) !== -1;
        return (activeFilter === "all" || product.category === activeFilter) &&
          modelMatches && conditionMatches && matchesPrice(product);
      });
      if (!visibleProducts.length) {
        var emptyMessage = activePrice !== "all"
          ? "Harga unit belum dicantumkan untuk filter ini. Tanyakan harga terbaru melalui WhatsApp."
          : "Belum ada unit pada filter ini. Hubungi kami untuk pilihan lainnya.";
        container.appendChild(createElement("p", "loading-message", emptyMessage));
        return;
      }

      visibleProducts.forEach(function (product) {
        var card = createElement("article", "product-card");
        var imageWrap = createElement("div", "product-image-wrap");
        var image = document.createElement("img");
        image.src = product.image;
        image.alt = "Ilustrasi laptop " + product.model;
        image.loading = "lazy";
        image.addEventListener("error", function () {
          image.remove();
          imageWrap.appendChild(createElement("span", "product-placeholder"));
        }, { once: true });
        imageWrap.appendChild(image);
        imageWrap.appendChild(createElement("span", "product-badge", product.availability));

        var content = createElement("div", "product-content");
        content.appendChild(createElement("span", "product-overline", product.condition + " · " + product.warranty));
        content.appendChild(createElement("h3", "", product.model));
        content.appendChild(createElement("p", "", product.description));
        var specs = createElement("div", "product-specs");
        product.specs.forEach(function (spec) {
          specs.appendChild(createElement("span", "", spec));
        });
        content.appendChild(specs);
        var bottom = createElement("div", "product-bottom");
        bottom.appendChild(createElement("span", "product-price", "Tanyakan harga"));
        var inquiry = createElement("a", "", "Tanya unit");
        inquiry.href = "https://wa.me/" + whatsappNumber + "?text=" + encodeURIComponent("Halo KenzoComp, apakah " + product.model + " tersedia? Mohon info kondisi, garansi, spesifikasi, dan harga.");
        inquiry.target = "_blank";
        inquiry.rel = "noopener noreferrer";
        bottom.appendChild(inquiry);
        content.appendChild(bottom);
        card.appendChild(imageWrap);
        card.appendChild(content);
        container.appendChild(card);
      });
    }

    document.querySelectorAll("[data-product-filter]").forEach(function (button) {
      button.addEventListener("click", function () {
        activeFilter = button.getAttribute("data-product-filter");
        document.querySelectorAll("[data-product-filter]").forEach(function (filterButton) {
          var selected = filterButton === button;
          filterButton.classList.toggle("is-active", selected);
          filterButton.setAttribute("aria-pressed", String(selected));
        });
        renderProducts();
      });
    });

    [
      ["[data-model-filter]", "activeModel"],
      ["[data-condition-filter]", "activeCondition"],
      ["[data-price-filter]", "activePrice"]
    ].forEach(function (filterBinding) {
      var select = document.querySelector(filterBinding[0]);
      if (!select) return;
      select.addEventListener("change", function () {
        if (filterBinding[1] === "activeModel") activeModel = select.value;
        if (filterBinding[1] === "activeCondition") activeCondition = select.value;
        if (filterBinding[1] === "activePrice") activePrice = select.value;
        renderProducts();
      });
    });

    loadJson("products.json").then(function (data) {
      if (!Array.isArray(data)) throw new Error("Format katalog produk tidak valid.");
      productData = data;
      renderProducts();
    }).catch(function (error) {
      showLoadError(container, "Katalog belum dapat dimuat. Silakan muat ulang halaman atau hubungi kami melalui WhatsApp. (" + error.message + ")");
      console.error(error);
    });
  }

  function setupPortfolio() {
    var container = document.querySelector("[data-portfolio]");
    if (!container) return;

    var activeFilter = "Semua";
    var projectData = [];

    function renderProjects() {
      container.replaceChildren();
      var visibleProjects = projectData.filter(function (project) {
        return activeFilter === "Semua" || project.category === activeFilter;
      });
      if (!visibleProjects.length) {
        container.appendChild(createElement("p", "loading-message", "Belum ada contoh solusi pada kategori ini."));
        return;
      }

      visibleProjects.forEach(function (project) {
        var card = createElement("article", "portfolio-card");
        var art = createElement("div", "portfolio-art art-" + project.visual);
        if (project.visual === "mobile") {
          art.appendChild(createElement("span", "art-phone"));
        } else {
          var dashboard = createElement("div", "art-dashboard");
          dashboard.appendChild(createElement("i"));
          dashboard.appendChild(createElement("i"));
          dashboard.appendChild(createElement("i"));
          art.appendChild(dashboard);
        }
        art.appendChild(createElement("span", "", project.category));

        var content = createElement("div", "portfolio-content");
        content.appendChild(createElement("small", "", "Contoh solusi · " + project.category));
        content.appendChild(createElement("h3", "", project.title));
        content.appendChild(createElement("p", "", project.description));
        content.appendChild(createElement("span", "", "Ilustrasi kebutuhan"));
        card.appendChild(art);
        card.appendChild(content);
        container.appendChild(card);
      });
    }

    document.querySelectorAll("[data-portfolio-filter]").forEach(function (button) {
      button.addEventListener("click", function () {
        activeFilter = button.getAttribute("data-portfolio-filter");
        document.querySelectorAll("[data-portfolio-filter]").forEach(function (filterButton) {
          var selected = filterButton === button;
          filterButton.classList.toggle("is-active", selected);
          filterButton.setAttribute("aria-pressed", String(selected));
        });
        renderProjects();
      });
    });

    loadJson("portfolio.json").then(function (data) {
      if (!Array.isArray(data)) throw new Error("Format data portfolio tidak valid.");
      projectData = data;
      renderProjects();
    }).catch(function (error) {
      showLoadError(container, "Contoh portfolio belum dapat dimuat. Silakan muat ulang halaman atau hubungi kami. (" + error.message + ")");
      console.error(error);
    });
  }

  function setupTestimonials() {
    var card = document.querySelector("[data-testimonial]");
    if (!card) return;

    var entries = [];
    var activeIndex = 0;
    var count = document.querySelector("[data-testimonial-count]");

    function renderTestimonial() {
      var entry = entries[activeIndex];
      card.replaceChildren();
      card.appendChild(createElement("blockquote", "", entry.quote));
      var author = createElement("div", "testimonial-author");
      author.appendChild(createElement("span", "testimonial-avatar", entry.author.split(" ").slice(0, 2).map(function (word) { return word.charAt(0); }).join("").toUpperCase()));
      var authorText = createElement("span");
      authorText.appendChild(createElement("b", "", entry.author));
      authorText.appendChild(createElement("small", "", entry.context));
      author.appendChild(authorText);
      card.appendChild(author);
      count.textContent = String(activeIndex + 1).padStart(2, "0") + " / " + String(entries.length).padStart(2, "0");
    }

    function changeTestimonial(direction) {
      activeIndex = (activeIndex + direction + entries.length) % entries.length;
      renderTestimonial();
    }

    document.querySelector("[data-testimonial-prev]").addEventListener("click", function () {
      changeTestimonial(-1);
    });
    document.querySelector("[data-testimonial-next]").addEventListener("click", function () {
      changeTestimonial(1);
    });

    loadJson("testimonials.json").then(function (data) {
      if (!Array.isArray(data)) throw new Error("Format data testimoni tidak valid.");
      entries = data.filter(function (entry) {
        return entry.approved === true && entry.isSample !== true;
      });
      if (!entries.length) {
        card.replaceChildren(createElement("p", "sample-note", "Carousel siap digunakan. Tambahkan testimoni pelanggan yang sudah mendapat izin pada data/testimonials.json sebelum menampilkannya."));
        document.querySelectorAll("[data-testimonial-prev], [data-testimonial-next]").forEach(function (button) {
          button.disabled = true;
        });
        return;
      }
      renderTestimonial();
    }).catch(function (error) {
      card.replaceChildren(createElement("p", "error-message", "Testimoni belum dapat dimuat. Silakan muat ulang halaman. (" + error.message + ")"));
      console.error(error);
    });
  }

  function setupContactForm() {
    document.querySelectorAll("[data-whatsapp-form]").forEach(function (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        if (!form.reportValidity()) return;
        var formData = new FormData(form);
        var extraDetails = [];
        formData.forEach(function (value, key) {
          if (key === "name" || key === "interest" || key === "message" || !value) return;
          var label = form.querySelector('[name="' + key + '"]');
          var readableLabel = label && label.previousElementSibling && label.previousElementSibling.tagName === "LABEL"
            ? label.previousElementSibling.textContent
            : key;
          extraDetails.push(readableLabel + ": " + value);
        });
        var message = [
          "Halo KenzoComp, saya ingin berkonsultasi.",
          "Nama: " + formData.get("name"),
          "Kebutuhan: " + formData.get("interest"),
          "Pesan: " + formData.get("message")
        ].join("\n");
        if (extraDetails.length) message += "\n" + extraDetails.join("\n");
        window.open("https://wa.me/" + whatsappNumber + "?text=" + encodeURIComponent(message), "_blank", "noopener,noreferrer");
      });
    });
  }

  setupMenu();
  setupHeroSlider();
  setupProducts();
  setupPortfolio();
  setupTestimonials();
  setupContactForm();

  document.querySelectorAll("[data-current-year]").forEach(function (element) {
    element.textContent = String(new Date().getFullYear());
  });
})();
