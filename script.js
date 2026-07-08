const links = document.querySelectorAll(".nav-link");
const tabs = document.querySelectorAll(".tab");

links.forEach((link) => {
  link.addEventListener("click", () => {
    const target = link.dataset.tab;


    links.forEach((l) => l.classList.toggle("active", l === link));

    tabs.forEach((tab) => tab.classList.toggle("active", tab.id === target));
  });
});


const tocLinks = document.querySelectorAll(".toc nav a");
const sections = document.querySelectorAll(".post section[id]");

if (tocLinks.length && sections.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          tocLinks.forEach((a) =>
            a.classList.toggle(
              "active",
              a.getAttribute("href") === "#" + entry.target.id
            )
          );
        }
      });
    },
    { rootMargin: "-20% 0px -70% 0px" }
  );

  sections.forEach((s) => observer.observe(s));
}
