// Main game initialization
let game;
let lastTime = 0;
let animationId;

function init() {
    const canvas = document.getElementById('gameCanvas');
    game = new Game(canvas);
    
    // Start game loop
    lastTime = performance.now();
    gameLoop();
}

function gameLoop(currentTime = 0) {
    // Calculate delta time
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;
    
    // Update game
    game.update(deltaTime);
    
    // Draw game
    game.draw();
    
    // Continue loop
    animationId = requestAnimationFrame(gameLoop);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Handle window resize
window.addEventListener('resize', () => {
    // You can add responsive canvas sizing here if needed
});

// Pause game when window loses focus
window.addEventListener('blur', () => {
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
});

// Resume game when window gains focus
window.addEventListener('focus', () => {
    if (!animationId && game) {
        lastTime = performance.now();
        gameLoop();
    }
});
