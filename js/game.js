class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        // Set canvas size
        this.canvas.width = CONSTANTS.CANVAS_WIDTH;
        this.canvas.height = CONSTANTS.CANVAS_HEIGHT;
        
        // Game objects
        this.striker = null;
        this.ball = null;
        this.goal = null;
        this.obstacles = [];
        
        // Game state
        this.levelManager = new LevelManager();
        this.inputHandler = new InputHandler(canvas, this);
        this.shots = 0;
        this.score = 0;
        this.isLevelComplete = false;
        this.allObjectsStationary = true;
        
        // Bounds for wall collisions
        this.bounds = {
            left: 0,
            right: this.canvas.width,
            top: 0,
            bottom: this.canvas.height
        };
        
        // Initialize first level
        this.loadLevel();
        
        // Setup UI event listeners
        this.setupUIListeners();
    }
    
    setupUIListeners() {
        document.getElementById('restart-btn').addEventListener('click', () => {
            this.restartLevel();
        });
        
        document.getElementById('next-level-btn').addEventListener('click', () => {
            this.nextLevel();
        });
    }
    
    loadLevel() {
        const level = this.levelManager.getCurrentLevel();
        
        // Create game objects
        this.striker = new Striker(level.striker.x, level.striker.y);
        this.ball = new Ball(level.ball.x, level.ball.y);
        this.goal = new Goal(level.goal.x, level.goal.y);
        
        // Create obstacles
        this.obstacles = [];
        level.obstacles.forEach(obstacleData => {
            const obstacle = new Obstacle(obstacleData.x, obstacleData.y, obstacleData.type);
            if (obstacleData.pattern) {
                obstacle.setMovementPattern(obstacleData.pattern);
            }
            this.obstacles.push(obstacle);
        });
        
        // Reset game state
        this.shots = 0;
        this.isLevelComplete = false;
        this.updateUI();
    }
    
    restartLevel() {
        this.loadLevel();
        this.hideLevelCompleteModal();
    }
    
    nextLevel() {
        if (this.levelManager.nextLevel()) {
            this.loadLevel();
            this.hideLevelCompleteModal();
        } else {
            // Game complete!
            alert('Congratulations! You completed all levels!');
            this.levelManager.resetToFirstLevel();
            this.score = 0;
            this.loadLevel();
            this.hideLevelCompleteModal();
        }
    }
    
    onShot() {
        this.shots++;
        this.updateUI();
    }
    
    update(deltaTime) {
        if (this.isLevelComplete) return;
        
        // Update all objects
        this.striker.update();
        this.ball.update();
        this.obstacles.forEach(obstacle => obstacle.update(deltaTime));
        
        // Check if all objects are stationary
        this.allObjectsStationary = this.striker.isStationary() && this.ball.isStationary();
        this.obstacles.forEach(obstacle => {
            if (obstacle.type === 'dynamic' && !obstacle.isStationary()) {
                this.allObjectsStationary = false;
            }
        });
        
        // Physics checks
        this.checkCollisions();
        this.checkWallCollisions();
        this.checkGoal();
    }
    
    checkCollisions() {
        // Striker-Ball collision
        if (Physics.checkCircleCollision(this.striker, this.ball)) {
            Physics.resolveCircleCollision(this.striker, this.ball);
        }
        
        // Ball-Obstacle collisions
        this.obstacles.forEach(obstacle => {
            if (Physics.checkCircleCollision(this.ball, obstacle)) {
                Physics.resolveCircleCollision(this.ball, obstacle);
            }
        });
        
        // Striker-Obstacle collisions
        this.obstacles.forEach(obstacle => {
            if (Physics.checkCircleCollision(this.striker, obstacle)) {
                Physics.resolveCircleCollision(this.striker, obstacle);
            }
        });
        
        // Obstacle-Obstacle collisions (for dynamic obstacles)
        for (let i = 0; i < this.obstacles.length; i++) {
            for (let j = i + 1; j < this.obstacles.length; j++) {
                if (this.obstacles[i].type !== 'static' || this.obstacles[j].type !== 'static') {
                    if (Physics.checkCircleCollision(this.obstacles[i], this.obstacles[j])) {
                        Physics.resolveCircleCollision(this.obstacles[i], this.obstacles[j]);
                    }
                }
            }
        }
    }
    
    checkWallCollisions() {
        // Check wall collisions for all moving objects
        Physics.checkWallCollision(this.striker, this.bounds);
        Physics.checkWallCollision(this.ball, this.bounds);
        
        this.obstacles.forEach(obstacle => {
            if (obstacle.type === 'dynamic') {
                Physics.checkWallCollision(obstacle, this.bounds);
            }
        });
    }
    
    checkGoal() {
        if (!this.ball.inGoal && Physics.checkGoalCollision(this.ball, this.goal)) {
            this.ball.inGoal = true;
            this.onLevelComplete();
        }
    }
    
    onLevelComplete() {
        this.isLevelComplete = true;
        
        // Calculate score
        const level = this.levelManager.getCurrentLevel();
        const baseScore = CONSTANTS.SCORE_PER_SHOT;
        const penalty = Math.max(0, (this.shots - level.par) * CONSTANTS.SCORE_PENALTY_PER_EXTRA_SHOT);
        const levelScore = Math.max(0, baseScore - penalty);
        this.score += levelScore;
        
        // Show completion modal
        this.showLevelCompleteModal();
    }
    
    showLevelCompleteModal() {
        const modal = document.getElementById('level-complete');
        const finalShots = document.getElementById('final-shots');
        const stars = document.querySelectorAll('.star');
        const level = this.levelManager.getCurrentLevel();
        
        finalShots.textContent = this.shots;
        
        // Calculate stars
        let starCount = 0;
        if (this.shots <= level.par) {
            starCount = 3;
        } else if (this.shots <= level.par + 1) {
            starCount = 2;
        } else {
            starCount = 1;
        }
        
        // Update star display
        stars.forEach((star, index) => {
            if (index < starCount) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
        
        modal.classList.remove('hidden');
    }
    
    hideLevelCompleteModal() {
        const modal = document.getElementById('level-complete');
        modal.classList.add('hidden');
    }
    
    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw field
        this.drawField();
        
        // Draw game objects
        this.goal.draw(this.ctx);
        this.obstacles.forEach(obstacle => obstacle.draw(this.ctx));
        this.ball.draw(this.ctx);
        this.striker.draw(this.ctx);
        
        // Draw level info
        this.drawLevelInfo();
    }
    
    drawField() {
        const ctx = this.ctx;
        
        // Field background
        ctx.fillStyle = CONSTANTS.COLORS.FIELD;
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Field lines
        ctx.strokeStyle = CONSTANTS.COLORS.FIELD_LINES;
        ctx.lineWidth = 2;
        
        // Center line
        ctx.beginPath();
        ctx.moveTo(this.canvas.width / 2, 0);
        ctx.lineTo(this.canvas.width / 2, this.canvas.height);
        ctx.stroke();
        
        // Center circle
        ctx.beginPath();
        ctx.arc(this.canvas.width / 2, this.canvas.height / 2, 50, 0, Math.PI * 2);
        ctx.stroke();
        
        // Goal areas (decorative)
        const goalAreaWidth = 150;
        const goalAreaHeight = 300;
        
        // Left goal area
        ctx.strokeRect(
            0,
            (this.canvas.height - goalAreaHeight) / 2,
            goalAreaWidth,
            goalAreaHeight
        );
        
        // Right goal area
        ctx.strokeRect(
            this.canvas.width - goalAreaWidth,
            (this.canvas.height - goalAreaHeight) / 2,
            goalAreaWidth,
            goalAreaHeight
        );
    }
    
    drawLevelInfo() {
        const ctx = this.ctx;
        const level = this.levelManager.getCurrentLevel();
        
        // Level description
        ctx.save();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(level.description, this.canvas.width / 2, 30);
        
        // Par indicator
        ctx.font = '14px Arial';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.fillText(`Par: ${level.par}`, this.canvas.width / 2, 50);
        
        ctx.restore();
    }
    
    updateUI() {
        document.getElementById('level-number').textContent = this.levelManager.getCurrentLevel().id;
        document.getElementById('shots-taken').textContent = this.shots;
        document.getElementById('score').textContent = this.score;
    }
}
