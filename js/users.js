class Users {
  constructor() {}

  async getAllUsers(activity) {
    const response = await fetch("/json/users.json");
    const users = await response.json();
    switch (activity) {
      case 0:
        return users
          .filter((user) => user.active_unilevel == 0)
          .sort((a, b) => a.id - b.id);
      case 1:
        return users
          .filter((user) => user.active_unilevel == 1)
          .sort((a, b) => a.id - b.id);
      default:
        return users.sort((a, b) => a.id - b.id);
    }
  }
}
