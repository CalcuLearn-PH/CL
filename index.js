const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting && !entry.target.classList.contains("standby")) {
      console.log(entry.target);
      entry.target.classList.add("standby");
      entry.target.classList.remove("view");
    } else if (
      entry.isIntersecting &&
      !entry.target.classList.contains("view") &&
      !entry.target.classList.contains("standby")
    ) {
      console.log(entry.target);
      entry.target.classList.add("standby");
      setTimeout(() => {
        entry.target.classList.remove("standby");
        entry.target.classList.add("view");
      }, 250);
    } else if (
      !entry.isIntersecting &&
      entry.target.classList.contains("view")
    ) {
      console.log(entry.target);
      entry.target.classList.remove("view");
      entry.target.classList.add("standby");
    } else if (
      entry.isIntersecting &&
      entry.target.classList.contains("standby")
    ) {
      console.log(entry.target);
      entry.target.classList.remove("standby");
      entry.target.classList.add("view");
    }
  });
}, {});
const hiddenarticleElements = document.querySelectorAll(".hidden-article");
hiddenarticleElements.forEach((el) => observer.observe(el));
