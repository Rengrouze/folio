async function loadPortfolioData() {
   try {
      const response = await fetch("data.json");
      const data = await response.json();
      return data;
   } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
      return {
         name: "Elias Oumghar",
         tagline: "Développeur Full Stack | Passionné de code",
         initials: "EO",
         contact: {
            email: "eoumghar@gmail.com",
            github: "https://github.com/eliasoumghar",
         },
         projects: [],
         techStack: {
            // Fallback with icons for consistency
            frontend: [{ name: "React", iconClass: "fa-brands fa-react" }],
            backend: [{ name: "Node.js", iconClass: "fa-brands fa-node-js" }],
            mobile: [{ name: "Android", iconClass: "fa-brands fa-android" }],
            devops: [{ name: "Docker", iconClass: "fa-brands fa-docker" }],
            databases: [{ name: "MySQL", iconClass: "fa-solid fa-database" }],
            creative: [{ name: "Unity", iconClass: "fa-brands fa-unity" }],
            tools: [{ name: "VS Code", iconClass: "fa-solid fa-code" }],
         },
      };
   }
}

function createContactElements(contact) {
   const contacts = [];
   if (contact.email) contacts.push(`<a href="mailto:${contact.email}" class="contact-item">📧 ${contact.email}</a>`);
   if (contact.github) contacts.push(`<a href="${contact.github}" class="contact-item" target="_blank">🔗 GitHub</a>`);
   if (contact.linkedin) contacts.push(`<a href="${contact.linkedin}" class="contact-item" target="_blank">💼 LinkedIn</a>`);
   if (contact.website) contacts.push(`<a href="${contact.website}" class="contact-item" target="_blank">🌐 Site Web</a>`);
   return contacts.join("");
}

function createTechStack(techStack) {
   const sections = [
      { title: "Frontend", items: techStack.frontend },
      { title: "Backend", items: techStack.backend },
      { title: "Mobile", items: techStack.mobile },
      { title: "DevOps", items: techStack.devops },
      { title: "Databases", items: techStack.databases },
      { title: "Creative", items: techStack.creative },
      { title: "Tools", items: techStack.tools },
   ];

   return sections
      .map(
         (section, index) => `
         <section class="tech-category-card" role="region" aria-labelledby="tech-title-${index}">
            <h4 class="tech-category-title" id="tech-title-${index}">${section.title}</h4>
            <div class="tech-items-grid">
               ${section.items
                  .map(
                     (item) => `
                  <div class="tech-item-icon" role="img" aria-label="${item.name} logo">
                     ${
                        item.iconClass
                           ? `<i class="${item.iconClass}" aria-hidden="true"></i>`
                           : '<i class="fa-solid fa-code" aria-hidden="true"></i>'
                     }
                     <p>${item.name}</p>
                  </div>`
                  )
                  .join("")}
            </div>
         </section>
      `
      )
      .join("");
}

function createProjectCard(project) {
   const techTags = project.technologies.map((tech) => `<span class="tech-tag">${tech}</span>`).join("");
   const inProgress = project.status === "in-progress";
   const badge = inProgress ? '<div class="progress-badge" aria-label="Projet en cours">🚧 En cours</div>' : "";
   const cardClass = inProgress ? "project-card in-progress" : "project-card";

   const links = [];
   if (project.links.github)
      links.push(
         `<a href="${project.links.github}" class="project-link" target="_blank" aria-label="Code source du projet ${project.title}">📂 Code</a>`
      );
   if (project.links.demo)
      links.push(
         `<a href="${project.links.demo}" class="project-link" target="_blank" aria-label="Démo du projet ${project.title}">🚀 Demo</a>`
      );

   const projectImage = project.imageUrl
      ? `<img src="${project.imageUrl}" alt="Image du projet ${project.title}" class="project-card-image" />`
      : "";

   return `
     <article class="${cardClass}" data-project-id="${project.id}" tabindex="0" role="button" aria-describedby="desc-${project.id}">
         ${badge}
         ${projectImage}
         <h3 class="project-title">${project.title}</h3>
         <p id="desc-${project.id}" class="project-description">${project.description}</p>
         <div class="project-tech">${techTags}</div>
         <div class="project-links">${links.join("")}</div>
     </article>
   `;
}

function showModal(project) {
   const modal = document.createElement("div");
   modal.className = "modal-overlay";

   const modalImage = project.imageUrl
      ? `<img src="${project.imageUrl}" alt="Image du projet ${project.title}" class="modal-project-image">`
      : "";

   modal.innerHTML = `
     <div class="modal-content">
         <button class="modal-close">×</button>
         ${modalImage}
         <h2>${project.title}</h2>
         <div class="modal-body scrollable-content">
             <div class="modal-section">
                 <h3>Pourquoi ce projet ?</h3>
                 <p>${project.details.why}</p>
             </div>
             <div class="modal-section">
                 <h3>Objectif</h3>
                 <p>${project.details.goal}</p>
             </div>
             <div class="modal-section">
                 <h3>Fonctionnalités</h3>
                 <ul>${project.details.features.map((f) => `<li>${f}</li>`).join("")}</ul>
             </div>
             <div class="modal-section">
                 <h3>Défis techniques</h3>
                 <p>${project.details.challenges}</p>
             </div>
         </div>
     </div>
   `;

   document.body.appendChild(modal);

   modal.querySelector(".modal-close").onclick = () => modal.remove();
   modal.onclick = (e) => {
      if (e.target === modal) modal.remove();
   };
}

async function initPortfolio() {
   const data = await loadPortfolioData();

   document.getElementById("name").textContent = data.name;
   document.getElementById("tagline").textContent = data.tagline;
   document.title = `Portfolio - ${data.name}`;

   document.getElementById("contactInfo").innerHTML = createContactElements(data.contact);

   // ************* MODIFIED: Tech stack inserted into its own container *************
   const techStackContainer = document.getElementById("techStackContainer");
   techStackContainer.innerHTML = createTechStack(data.techStack);
   // ********************************************************************************

   const projectsHTML = data.projects.map(createProjectCard).join("");
   document.getElementById("projects").innerHTML = projectsHTML;

   document.querySelectorAll(".project-card").forEach((card) => {
      card.style.cursor = "pointer";
      card.addEventListener("click", (e) => {
         if (e.target.closest(".project-link")) {
            return;
         }
         const projectId = card.dataset.projectId;
         const project = data.projects.find((p) => p.id === projectId);
         if (project && project.details) showModal(project);
      });
   });
}

function addAvatarAnimation() {
   const avatar = document.getElementById("profilePic");
   let rotation = 0;
   avatar.addEventListener("click", () => {
      rotation += 360;
      avatar.style.transform = `rotate(${rotation}deg) scale(1.1)`;
      setTimeout(() => (avatar.style.transform = `rotate(${rotation}deg) scale(1)`), 300);
   });
}

document.addEventListener("DOMContentLoaded", () => {
   initPortfolio();
   addAvatarAnimation();
});

window.addEventListener("error", (e) => console.error("Erreur:", e.error));
