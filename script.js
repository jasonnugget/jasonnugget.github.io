const links = document.querySelectorAll(".nav-link");
const tabs = document.querySelectorAll(".tab");

if (links.length && tabs.length) {
  // 404.html stashes the path it was reached by, since GitHub Pages has no
  // rewrites and serves 404 for /about, /projects, /contact.
  const stashed = sessionStorage.getItem("redirect");
  if (stashed) {
    sessionStorage.removeItem("redirect");
    history.replaceState(null, "", stashed);
  }

  const routes = ["about", "projects", "contact"];

  const currentTab = () => {
    const name = location.pathname.replace(/^\/+|\/+$/g, "");
    return routes.includes(name) ? name : "about";
  };

  const render = (target) => {
    links.forEach((l) => l.classList.toggle("active", l.dataset.tab === target));
    tabs.forEach((tab) => tab.classList.toggle("active", tab.id === target));
  };

  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      history.pushState(null, "", link.getAttribute("href"));
      render(link.dataset.tab);
    });
  });

  window.addEventListener("popstate", () => render(currentTab()));

  render(currentTab());
}


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
