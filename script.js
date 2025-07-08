// Chargement des données depuis le fichier JSON
async function loadPortfolioData() {
   try {
      const response = await fetch("data.json");
      const data = await response.json();
      return data;
   } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
      // Données de fallback si le JSON ne charge pas
      return {
         name: "Elias Oumghar",
         tagline: "Développeur Full Stack | Passionné de code",
         initials: "EO",
         contact: {
            email: "eoumghar@gmail.com",
            github: "https://github.com/eliasoumghar",
         },
         projects: [],
      };
   }
}

// Fonction pour créer les éléments de contact
function createContactElements(contact) {
   const contacts = [];

   if (contact.email) {
      contacts.push(`<a href="mailto:${contact.email}" class="contact-item">📧 ${contact.email}</a>`);
   }
   if (contact.github) {
      contacts.push(`<a href="${contact.github}" class="contact-item" target="_blank">🔗 GitHub</a>`);
   }
   if (contact.linkedin) {
      contacts.push(`<a href="${contact.linkedin}" class="contact-item" target="_blank">💼 LinkedIn</a>`);
   }
   if (contact.website) {
      contacts.push(`<a href="${contact.website}" class="contact-item" target="_blank">🌐 Site Web</a>`);
   }

   return contacts.join("");
}

// Fonction pour créer une card de projet
function createProjectCard(project) {
   const techTags = project.technologies.map((tech) => `<span class="tech-tag">${tech}</span>`).join("");

   const links = [];
   if (project.links.github) {
      links.push(`<a href="${project.links.github}" class="project-link" target="_blank">📂 Code</a>`);
   }
   if (project.links.demo) {
      links.push(`<a href="${project.links.demo}" class="project-link" target="_blank">🚀 Demo</a>`);
   }

   return `
        <div class="project-card">
            <h3 class="project-title">${project.title}</h3>
            <p class="project-description">${project.description}</p>
            <div class="project-tech">${techTags}</div>
            <div class="project-links">${links.join("")}</div>
        </div>
    `;
}

// Fonction principale d'initialisation
async function initPortfolio() {
   const data = await loadPortfolioData();

   // Mise à jour des éléments du DOM
   document.getElementById("name").textContent = data.name;
   document.getElementById("tagline").textContent = data.tagline;
   document.getElementById("profilePic").textContent = data.initials;

   // Mise à jour du titre de la page
   document.title = `Portfolio - ${data.name}`;

   // Création des éléments de contact
   document.getElementById("contactInfo").innerHTML = createContactElements(data.contact);

   // Création des projets
   const projectsHTML = data.projects.map(createProjectCard).join("");
   document.getElementById("projects").innerHTML = projectsHTML;
}

// Petite animation pour l'avatar
function addAvatarAnimation() {
   const avatar = document.getElementById("profilePic");
   let rotation = 0;

   avatar.addEventListener("click", () => {
      rotation += 360;
      avatar.style.transform = `rotate(${rotation}deg) scale(1.1)`;

      setTimeout(() => {
         avatar.style.transform = `rotate(${rotation}deg) scale(1)`;
      }, 300);
   });
}

// Initialisation quand le DOM est prêt
document.addEventListener("DOMContentLoaded", () => {
   initPortfolio();
   addAvatarAnimation();
});

// Gestion des erreurs globales
window.addEventListener("error", (e) => {
   console.error("Erreur dans le portfolio:", e.error);
});
