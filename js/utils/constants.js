// Game Constants
const CONSTANTS = {
    // Canvas
    CANVAS_WIDTH: 900,
    CANVAS_HEIGHT: 500,
    
    // Physics
    FRICTION: 0.985,
    MIN_VELOCITY: 0.1,
    MAX_POWER: 20,
    RESTITUTION: 0.8,
    
    // Game Objects
    STRIKER_RADIUS: 25,
    BALL_RADIUS: 15,
    GOAL_WIDTH: 80,
    GOAL_HEIGHT: 120,
    OBSTACLE_RADIUS: 20,
    
    // Colors
    COLORS: {
        FIELD: '#2d5016',
        FIELD_LINES: '#3d6020',
        STRIKER: '#0080ff',
        STRIKER_BORDER: '#606060',
        BALL: '#ffffff',
        BALL_BORDER: '#cccccc',
        GOAL: '#ffeb3b',
        GOAL_NET: '#666666',
        OBSTACLE: '#ff0000',
        OBSTACLE_BORDER: '#bb0000',
        TRAJECTORY: '#ffffff'
    },
    
    // UI
    TRAJECTORY_DOTS: 15,
    TRAJECTORY_DOT_SPACING: 20,
    POWER_INDICATOR_MAX_WIDTH: 300,
    
    // Scoring
    SCORE_PER_SHOT: 100,
    SCORE_PENALTY_PER_EXTRA_SHOT: 20,
    STARS: {
        THREE: 1,
        TWO: 2,
        ONE: 3
    }
};
