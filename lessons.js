const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (
      !entry.isIntersecting &&
      !entry.target.classList.contains("standby") &&
      entry.target.classList.contains("hidden-article")
    ) {
      console.log(entry.target);
      entry.target.classList.add("standby");
      entry.target.classList.remove("view");
    } else if (
      entry.isIntersecting &&
      !entry.target.classList.contains("view") &&
      !entry.target.classList.contains("standby") &&
      entry.target.classList.contains("hidden-article")
    ) {
      console.log(entry.target);
      entry.target.classList.add("standby");
      setTimeout(() => {
        entry.target.classList.remove("standby");
        entry.target.classList.add("view");
      }, 250);
    } else if (
      !entry.isIntersecting &&
      entry.target.classList.contains("view") &&
      entry.target.classList.contains("hidden-article")
    ) {
      console.log(entry.target);
      entry.target.classList.remove("view");
      entry.target.classList.add("standby");
    } else if (
      entry.isIntersecting &&
      entry.target.classList.contains("standby") &&
      entry.target.classList.contains("hidden-article")
    ) {
      console.log(entry.target);
      entry.target.classList.remove("standby");
      entry.target.classList.add("view");
    } else {
      //do nothing
    }
    if (
      !entry.isIntersecting &&
      !entry.target.classList.contains("standby") &&
      entry.target.classList.contains("hidden-list")
    ) {
      console.log(entry.target);
      entry.target.classList.add("standby");
      entry.target.classList.remove("view");
    } else if (
      entry.isIntersecting &&
      !entry.target.classList.contains("view") &&
      !entry.target.classList.contains("standby") &&
      entry.target.classList.contains("hidden-list")
    ) {
      console.log(entry.target);
      entry.target.classList.add("standby");
      setTimeout(() => {
        entry.target.classList.remove("standby");
        entry.target.classList.add("view");
      }, 250);
    } else if (
      !entry.isIntersecting &&
      entry.target.classList.contains("view") &&
      entry.target.classList.contains("hidden-list")
    ) {
      console.log(entry.target);
      entry.target.classList.remove("view");
      entry.target.classList.add("standby");
    } else if (
      entry.isIntersecting &&
      entry.target.classList.contains("standby") &&
      entry.target.classList.contains("hidden-list")
    ) {
      console.log(entry.target);
      entry.target.classList.remove("standby");
      entry.target.classList.add("view");
    } else {
      //do nothing
    }
  });
}, {});
const hiddenarticleElements = document.querySelectorAll(".hidden-article");
hiddenarticleElements.forEach((el) => observer.observe(el));

const hiddenlisteElements = document.querySelectorAll(".hidden-list");
hiddenlisteElements.forEach((el) => observer.observe(el));
const form = document.getElementById("uploadForm");
