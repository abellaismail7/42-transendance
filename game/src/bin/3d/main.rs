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


mod components;
mod init;
mod systems;

fn main() {
    App::new()
        .add_plugins(DefaultPlugins)
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
