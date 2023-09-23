use bevy::{
    /* prelude::{
        App, DefaultPlugins, EventWriter, FixedTime, KeyCode,
        Query, Res, ResMut,
        Transform, Vec3, With, Without, Input, Time, Quat, Startup, FixedUpdate, Update, Camera, GizmoConfig
    }, */
    prelude::*,
};
use components::{
    collider::CollisionEvent,
    config::Config,
    scoreboard::Scoreboard,
};
use init::setup::setup;
use systems::{start::{start_game, game_starts}, collisions::check_for_collisions, config::update_config, move_paddle::move_paddle, ball_velocity::apply_velocity};

mod components;
mod init;
mod systems;

fn main() {
    App::new()
        .add_plugins(DefaultPlugins)
        .add_systems(Startup, setup)
        .insert_resource(FixedTime::new_from_secs(1.0 / 60.0))
        .add_event::<CollisionEvent>()
        .insert_resource(Scoreboard::default())
        .insert_resource(Config::default())
        //.add_systems(Update, ( rotate_camera, update_config))
        .add_systems(Update, update_config)
        .add_systems(Update, start_game)
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
