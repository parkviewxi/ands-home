document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector(".snap-container");
    const sections = document.querySelectorAll(".snap-child");
    let currentIndex = 0;
    let isScrolling = false;

    const scrollToSection = (index) => {
        isScrolling = true;
        sections[index].scrollIntoView({behavior: "smooth"});
        setTimeout(() => {
            isScrolling = false;
        }, 500);
    };

    // Wheel
    container.addEventListener("wheel", (e) => {
        e.preventDefault();
        if (isScrolling) 
            return;
        
        if (e.deltaY > 0) {
            currentIndex = Math.min(sections.length - 1, currentIndex + 1);
        } else {
            currentIndex = Math.max(0, currentIndex - 1);
        }

        scrollToSection(currentIndex);
    }, {passive: false});

    // Keydown
    document.addEventListener("keydown", (e) => {
        if (isScrolling) 
            return;
        
        if (e.key === "ArrowDown") {
            currentIndex = Math.min(sections.length - 1, currentIndex + 1);
            scrollToSection(currentIndex);
        } else if (e.key === "ArrowUp") {
            currentIndex = Math.max(0, currentIndex - 1);
            scrollToSection(currentIndex);
        }
    });

    // 모든 content-section 관찰해서 등장 시 애니메이션
    const observedSections = document.querySelectorAll(".content-section");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry
                    .target
                    .classList
                    .add("section-visible");
            }
        });
    }, {threshold: 0.6});

    observedSections.forEach((section) => observer.observe(section));
});