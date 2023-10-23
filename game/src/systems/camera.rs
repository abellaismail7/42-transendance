use bevy::prelude::{Camera, Quat, Query, Res, Time, Transform, Vec3, With};

/* fn system(mut gizmos: Gizmos, time: Res<Time>) {
    gizmos.cuboid(
        Transform::from_translation(Vec3::Y * 1.0).with_scale(Vec3::splat(1.)),
        Color::BLACK,
    );
}
*/
#[allow(dead_code)]
pub fn rotate_camera(mut query: Query<&mut Transform, With<Camera>>, time: Res<Time>) {
    let mut transform = query.single_mut();
    transform.rotate_around(Vec3::ZERO, Quat::from_rotation_z(time.delta_seconds() / 2.));
}
