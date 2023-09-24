use crate::components::scoreboard::Scoreboard;
use bevy::prelude::{Input, KeyCode, Res, ResMut};

pub fn game_starts(score: Res<Scoreboard>) -> bool {
    score.start
}

pub fn start_game(keyboard_input: Res<Input<KeyCode>>, mut scoreboard: ResMut<Scoreboard>) {
    if keyboard_input.just_pressed(KeyCode::Space) && !scoreboard.start {
        scoreboard.start = true;
        scoreboard.left += 1;
    }
}
