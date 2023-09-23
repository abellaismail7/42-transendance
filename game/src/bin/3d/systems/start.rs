use bevy::prelude::{Res, ResMut, Input, KeyCode};
use crate::components::scoreboard::Scoreboard;


pub fn game_starts(score: Res<Scoreboard>) -> bool {
    score.start
}

pub fn start_game(keyboard_input: Res<Input<KeyCode>>, mut scoreboard: ResMut<Scoreboard>) {
    if keyboard_input.just_pressed(KeyCode::Space) && !scoreboard.start {
        scoreboard.start = true;
    }
}
