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
document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
        const target = e.target.dataset.target;
        let targetX = "0vw";
        let targetY = "0vh";

        if (target === "chambre") {
            targetX = "0vw"; 
            targetY = "0vh";
        } else if (target === "module-b") {
            targetX = "-100vw"; 
            targetY = "0vh";
        } else if (target === "cockpit") {
            targetX = "-100vw"; 
            targetY = "-100vh";
        }

        gsap.to(pinContainer, { x: targetX, y: targetY, duration: 1.5, ease: "power2.inOut" });
    });
});

// 3. ACTIONS CLIQUABLES (Fiches personnages avec GLITCH)
crewMembers.forEach(member => {
    member.addEventListener("click", () => {
        const photoSrc = member.dataset.presentation;
        
        // 1. Affecter l'image aux 3 calques du glitch
        glitchLayers.forEach(layer => {
            layer.style.backgroundImage = `url('${photoSrc}')`;
            layer.style.opacity = "0"; // Reset avant animation
        });

        // 2. Lancer l'overlay
        gsap.to(overlays.crew, { autoAlpha: 1, duration: 0.3 });
        
        // 3. Ajouter la classe pour démarrer le glitch
        glitchTarget.classList.add('glitch-active');

        // 4. Stopper le glitch après 0.6s (effet d'interférence court)
        setTimeout(() => {
            glitchTarget.classList.remove('glitch-active');
            // Garder uniquement l'image de base visible
            glitchLayers[0].style.opacity = "1";
        }, 600);
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
    
    // Réinitialisation du glitch à la fermeture
    glitchTarget.classList.remove('glitch-active');
};

document.querySelectorAll(".close-btn, .close-btn-internal").forEach(btn => btn.addEventListener("click", closeAll));
window.addEventListener("keydown", (e) => { if (e.key === "Escape") closeAll(); });