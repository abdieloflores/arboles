class Node {
  constructor(user) {
    this.value = user.id ? user.id : null;
    this.id = user.id ? user.id : null;
    this.username = user.username ? user.username : null;
    this.parent = user.parent ? user.parent : null;
    this.active_unilevel = user.active_unilevel ? user.active_unilevel : null;
    this.points_unilevel = user.points_unilevel ? user.points_unilevel : null;
    this.active_enrollment = user.active_enrollment
      ? user.active_enrollment
      : null;
    this.points_enrollment = user.points_enrollment
      ? user.points_enrollment
      : null;
    this.level = user.level ? user.level : null;
    this.range = user.range ? user.range : null;
    this.unilevel = user.unilevel ? user.unilevel : [];
    this.enrollment = user.enrollment ? user.enrollment : [];

    this.up = user.next ? user.next : null;
    this.children = user.children ? user.children : [];
  }
}
