class LevelManager {
    constructor() {
        this.levels = this.initializeLevels();
        this.currentLevelIndex = 0;
    }
    
    initializeLevels() {
        return [
            // Level 1: Direct Shot
            {
                id: 1,
                name: "Direct Shot",
                striker: { x: 150, y: 250 },
                ball: { x: 450, y: 250 },
                goal: { x: 800, y: 250 },
                obstacles: [],
                par: 1,
                description: "Simple direct shot to learn the basics"
            },
            
            // Level 2: Single Obstacle
            {
                id: 2,
                name: "First Obstacle",
                striker: { x: 150, y: 250 },
                ball: { x: 450, y: 250 },
                goal: { x: 800, y: 250 },
                obstacles: [
                    { x: 600, y: 250, type: 'static' }
                ],
                par: 1,
                description: "Use the wall to bounce around the obstacle"
            },
            
            // Level 3: Multiple Static Obstacles
            {
                id: 3,
                name: "Obstacle Course",
                striker: { x: 150, y: 250 },
                ball: { x: 300, y: 250 },
                goal: { x: 800, y: 350 },
                obstacles: [
                    { x: 450, y: 200, type: 'static' },
                    { x: 450, y: 300, type: 'static' },
                    { x: 600, y: 250, type: 'static' }
                ],
                par: 2,
                description: "Navigate through multiple obstacles"
            },
            
            // Level 4: Dynamic Obstacles
            {
                id: 4,
                name: "Moving Targets",
                striker: { x: 150, y: 250 },
                ball: { x: 450, y: 250 },
                goal: { x: 800, y: 250 },
                obstacles: [
                    { x: 350, y: 250, type: 'dynamic' },
                    { x: 550, y: 250, type: 'dynamic' }
                ],
                par: 2,
                description: "Hit the dynamic obstacles to clear a path"
            },
            
            // Level 5: Corner Goal
            {
                id: 5,
                name: "Corner Pocket",
                striker: { x: 150, y: 400 },
                ball: { x: 450, y: 250 },
                goal: { x: 800, y: 100 },
                obstacles: [
                    { x: 600, y: 200, type: 'static' },
                    { x: 700, y: 300, type: 'static' }
                ],
                par: 2,
                description: "Use angles to reach the corner goal"
            },
            
            // Level 6: Moving Obstacle
            {
                id: 6,
                name: "Timing Challenge",
                striker: { x: 150, y: 250 },
                ball: { x: 450, y: 250 },
                goal: { x: 800, y: 250 },
                obstacles: [
                    { 
                        x: 600, 
                        y: 250, 
                        type: 'moving',
                        pattern: (time) => {
                            const baseX = 600;
                            const baseY = 250;
                            const radius = 100;
                            return new Vector2D(
                                baseX,
                                baseY + Math.sin(time * 0.002) * radius
                            );
                        }
                    }
                ],
                par: 2,
                description: "Time your shot to avoid the moving obstacle"
            },
            
            // Level 7: Billiards Challenge
            {
                id: 7,
                name: "Chain Reaction",
                striker: { x: 150, y: 250 },
                ball: { x: 300, y: 250 },
                goal: { x: 800, y: 100 },
                obstacles: [
                    { x: 450, y: 250, type: 'dynamic' },
                    { x: 600, y: 200, type: 'dynamic' },
                    { x: 700, y: 350, type: 'static' }
                ],
                par: 1,
                description: "Use chain reactions to reach the goal"
            },
            
            // Level 8: Maze
            {
                id: 8,
                name: "The Maze",
                striker: { x: 100, y: 400 },
                ball: { x: 200, y: 400 },
                goal: { x: 800, y: 100 },
                obstacles: [
                    // Maze walls
                    { x: 300, y: 350, type: 'static' },
                    { x: 300, y: 300, type: 'static' },
                    { x: 300, y: 250, type: 'static' },
                    { x: 400, y: 150, type: 'static' },
                    { x: 450, y: 150, type: 'static' },
                    { x: 500, y: 150, type: 'static' },
                    { x: 500, y: 350, type: 'static' },
                    { x: 550, y: 350, type: 'static' },
                    { x: 600, y: 350, type: 'static' },
                    { x: 700, y: 250, type: 'static' },
                    { x: 700, y: 200, type: 'static' }
                ],
                par: 3,
                description: "Navigate through the maze"
            },
            
            // Level 9: Precision Shot
            {
                id: 9,
                name: "Precision Required",
                striker: { x: 150, y: 250 },
                ball: { x: 450, y: 250 },
                goal: { x: 800, y: 250 },
                obstacles: [
                    // Narrow gap
                    { x: 600, y: 200, type: 'static' },
                    { x: 600, y: 300, type: 'static' },
                    { x: 650, y: 150, type: 'static' },
                    { x: 650, y: 350, type: 'static' }
                ],
                par: 1,
                description: "Thread the needle with precision"
            },
            
            // Level 10: Final Challenge
            {
                id: 10,
                name: "Ultimate Challenge",
                striker: { x: 100, y: 400 },
                ball: { x: 200, y: 100 },
                goal: { x: 800, y: 250 },
                obstacles: [
                    { x: 300, y: 200, type: 'dynamic' },
                    { x: 400, y: 300, type: 'static' },
                    { 
                        x: 500, 
                        y: 250, 
                        type: 'moving',
                        pattern: (time) => {
                            return new Vector2D(
                                500 + Math.cos(time * 0.003) * 50,
                                250 + Math.sin(time * 0.002) * 100
                            );
                        }
                    },
                    { x: 650, y: 150, type: 'static' },
                    { x: 650, y: 350, type: 'static' }
                ],
                par: 3,
                description: "Master all skills to complete the ultimate challenge"
            }
        ];
    }
    
    getCurrentLevel() {
        return this.levels[this.currentLevelIndex];
    }
    
    nextLevel() {
        if (this.currentLevelIndex < this.levels.length - 1) {
            this.currentLevelIndex++;
            return true;
        }
        return false;
    }
    
    resetToFirstLevel() {
        this.currentLevelIndex = 0;
    }
    
    getTotalLevels() {
        return this.levels.length;
    }
}
