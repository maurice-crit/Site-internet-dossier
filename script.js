const pinContainer = document.querySelector("#pin-container");
const crewMembers = document.querySelectorAll(".crew-member"); 

// Cibles de l'effet Glitch
const glitchTarget = document.querySelector("#glitch-target");
const glitchLayers = document.querySelectorAll(".glitch__img");

// Dictionnaires des Overlays
const overlays = {
    crew: document.querySelector("#main-overlay"),
    infos: document.querySelector("#overlay-infos-menu"),
    gallery: document.querySelector("#overlay-gallery"),
    sg: document.querySelector("#overlay-sg")
};

// 1. DÉPART MODULE B
gsap.set(pinContainer, { x: "-100vw", y: "0vh" });

// 2. NAVIGATION 
const holoTransition = document.querySelector("#hologram-transition");
const mapButtons = document.querySelectorAll(".nav-btn-map");
// On définit le Module B comme étant actif par défaut au chargement
document.querySelector("#btn-module-b").classList.add("active");

mapButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
        const target = e.target.dataset.target;
        let targetX = "0vw";
        let targetY = "0vh";

        // Gestion de l'état actif sur la carte
        mapButtons.forEach(b => b.classList.remove("active"));
        e.target.classList.add("active");

        // Coordonnées cibles
        if (target === "chambre") { 
            targetX = "0vw"; targetY = "0vh"; 
        } else if (target === "module-b") { 
            targetX = "-100vw"; targetY = "0vh"; 
        } else if (target === "cockpit") { 
            targetX = "-100vw"; targetY = "-100vh"; 
        }

        // Effet Glitch Global
        holoTransition.classList.add("holo-active");

        setTimeout(() => {
            gsap.set(pinContainer, { x: targetX, y: targetY });
        }, 200);

        setTimeout(() => {
            holoTransition.classList.remove("holo-active");
        }, 400); 
    });
});

// 3. ACTIONS CLIQUABLES (Fiches personnages avec GLITCH)
// Variable pour stocker la boucle (le "timer")
let glitchInterval;

crewMembers.forEach(member => {
    member.addEventListener("click", () => {
        const photoSrc = member.dataset.presentation;
        
        // Affecter l'image aux 3 calques du glitch
        glitchLayers.forEach(layer => {
            layer.style.backgroundImage = `url('${photoSrc}')`;
            layer.style.opacity = ""; 
        });

        // Lancer l'overlay
        gsap.to(overlays.crew, { autoAlpha: 1, duration: 0.3 });
        
        // Fonction qui exécute un seul effet glitch
        const playGlitch = () => {
            glitchLayers[0].style.opacity = ""; // Reset de l'opacité avant le glitch
            glitchTarget.classList.add('glitch-active');
            
            // Le glitch dure 0.6s
            setTimeout(() => {
                glitchTarget.classList.remove('glitch-active');
                glitchLayers[0].style.opacity = "1"; // On fige l'image nette
            }, 600);
        };

        // 1. On lance le glitch immédiatement à l'ouverture
        playGlitch();

        // 2. On le répète toutes les 3 secondes (3000 millisecondes)
        glitchInterval = setInterval(playGlitch, 3000);
    });
});

// Décor interactif du module B
document.querySelector("#decor-sg").addEventListener("click", () => gsap.to(overlays.sg, { autoAlpha: 1, duration: 0.3 }));

// 4. LOGIQUE SG
const sgSubmit = document.querySelector("#sg-submit");
const sgPwd = document.querySelector("#sg-pwd");
sgSubmit.addEventListener("click", () => {
    if (sgPwd.value.toLowerCase() === "cacum") {
        document.querySelector("#sg-auth-zone").style.display = "none";
        document.querySelector("#sg-secret-zone").style.display = "flex";
    } else {
        gsap.fromTo(sgPwd, { x: -10 }, { x: 10, duration: 0.1, yoyo: true, repeat: 3 });
        document.querySelector("#sg-error").style.display = "block";
    }
});

// 5. PDF
document.querySelectorAll(".terminal-btn[data-file]").forEach(btn => {
    btn.addEventListener("click", () => window.open(`documents/${btn.dataset.file}`, "_blank"));
});

// 6. FERMETURE UNIFIÉE
const closeAll = () => {
    gsap.to(Object.values(overlays), { autoAlpha: 0, duration: 0.2 });
    
    // ON STOPPE LA BOUCLE SINON ELLE TOURNE À L'INFINI
    clearInterval(glitchInterval);
    
    // Réinitialisation du glitch à la fermeture
    glitchTarget.classList.remove('glitch-active');
    glitchLayers[0].style.opacity = ""; 
};

document.querySelectorAll(".close-btn, .close-btn-internal").forEach(btn => btn.addEventListener("click", closeAll));
window.addEventListener("keydown", (e) => { if (e.key === "Escape") closeAll(); });