export type Vec3Type = {
  x: number;
  y: number;
  z: number;
};

export function Vec(x = 0, y = 0, z = 0) {
  return {
    x,
    y,
    z,
    mul: function (num: number) {
      const res = Vec();
      res.x = this.x * num;
      res.y = this.y * num;
      res.z = this.z * num;
      return res;
    },
    add: function (to: Vec3Type) {
      const res = Vec();
      res.x = this.x + to.x;
      res.y = this.y + to.y;
      res.z = this.z + to.z;
      return res;
    },

    div: function (num: number) {
      const res = Vec();
      res.x = this.x / num;
      res.y = this.y / num;
      res.z = this.z / num;
      return res;
    },

    cross: function (to: Vec3Type) {
      const res = Vec();
      res.x = this.y * to.z - this.z * to.y;
      res.y = this.z * to.x - this.x * to.z;
      res.z = this.x * to.y - this.y * to.x;
      return res;
    },

    dot: function (to: Vec3Type) {
      return this.x * to.x + this.y * to.y + this.z * to.z;
    },

    reflect: function (n: Vec3Type) {
      const res = Vec();
      const dot = this.dot(n);
      res.x = this.x - 2 * dot * n.x;
      res.y = this.y - 2 * dot * n.y;
      res.z = this.z - 2 * dot * n.z;
      return res;
    },

    mag: function () {
      return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    },

    norm: function () {
      const mag = this.mag();
      return this.div(mag);
    },

    pure: function () {
      return [this.x, this.y, this.z];
    },
  };
}
