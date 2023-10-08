use super::paddle::PaddleSide;
use bevy::prelude::Resource;

// This resource tracks the game's score
#[derive(Resource)]
pub struct Scoreboard {
    pub left: u32,
    pub right: u32,
    pub turn: PaddleSide,
    pub start: bool,
}

impl Default for Scoreboard {
    fn default() -> Self {
        Scoreboard {
            left: 0,
            right: 0,
            turn: PaddleSide::Left,
            start: false,
        }
    }
}
