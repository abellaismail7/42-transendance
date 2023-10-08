use bevy::prelude::*;
use components::{ config::Config, scoreboard::Scoreboard, text_result::ScoreEvent};
use init::setup::setup;
use systems::{
    ball_velocity::apply_velocity,
    collisions::check_for_collisions,
    config::update_config,
    move_paddle::move_paddle,
    start::{game_starts, start_game}, result::update_result,
};
use wasm_bindgen::prelude::*;

mod components;
mod init;
mod systems;

#[wasm_bindgen]
pub fn add(a: i32, b: i32) -> i32 {
    a + b
}


#[wasm_bindgen]
pub fn run_bevy() {
    App::new()
        .add_plugins(DefaultPlugins.set(WindowPlugin{
            primary_window: Some(Window {
                title: "Pong Pong".to_string(),
                canvas: Some("#canvas".to_string()),
                resizable: false,
                ..Default::default()
            }),
            ..Default::default()
        }))
        .add_systems(Startup, setup)
        .insert_resource(FixedTime::new_from_secs(1.0 / 60.0))
        .add_event::<ScoreEvent>()
        .insert_resource(Scoreboard::default())
        .insert_resource(Config::default())
        //.add_systems(Update, ( rotate_camera, update_config))
        
        .add_systems(Update, update_config)
        .add_systems(Update, start_game)
        .add_systems(Update, update_result)
        .add_systems(
            FixedUpdate,
            (
                check_for_collisions,
                apply_velocity.before(check_for_collisions),
                move_paddle,
            )
                .run_if(game_starts),
        )
        .run();
}
