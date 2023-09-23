use bevy::prelude::{Resource, Vec2, Vec3};

// This resource tracks the game's score
#[derive(Resource)]
pub struct Config {
    pub ball_speed: f32,
    pub ball_size: Vec3,
    pub initial_ball_direction: Vec2,
    pub paddle_speed: f32,
}

impl Default for Config {
    fn default() -> Self {
        Config {
            ball_speed: 5.0,
            ball_size: Vec3::new(0.1, 0.1, 0.1),
            initial_ball_direction: Vec2::new(1.0, 1.0),
            paddle_speed: 4.0,
        }
    }
}
