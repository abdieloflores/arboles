"use strict";
const point = 10;
const currency = "MX";
const levels = 3;
const percentage = [0.3, 0.3, 0.3];

class Node {
  constructor(user) {
    this.value = user.id;
    this.id = user.id;
    this.username = user.username;
    this.sponsor = user.sponsor;
    this.sort = user.sort;
    this.active_unilevel = user.active_unilevel;
    this.points_unilevel = user.points_unilevel;
    this.active_enrollment = user.active_enrollment;
    this.points_enrollment = user.points_enrollment;
    this.level = null;
    this.range = null;
    this.unilevel = user.unilevel ? user.unilevel : [];
    this.enrollment = user.enrollment ? user.enrollment : [];

    this.sponsor_node = null;
    this.children = user.children ? user.children : [];
  }
}

class Tree {
  //Reglas del árbol, nadie puede estar patrocinado por alguien inferior.

  constructor() {
    this.root = null;
  }

  add(value, nodeSponsor = null) {
    let node = new Node(value);
    let parent = nodeSponsor
      ? nodeSponsor
      : this.findBFS(this.rootNode, value.sponsor);
    if (parent) {
      node.sponsor_node = parent;
      parent.children.push(node);
    } else if (!this.root) {
      this.root = node;
    } else {
      throw new Error("Root node is already assigned");
    }
  }

  remove(value) {
    if (!value) return null;
    if (this.root.value === value) {
      this.root = null;
    }
    let queue = [this.root];
    while (queue.length) {
      let node = queue.shift();
      for (let i = 0; i < node.children.length; i++) {
        if (node.children[i].value === value) {
          node.children.splice(i, 1);
          queue = [];
          return;
        } else {
          queue.push(node.children[i]);
        }
      }
    }
  }

  removeAndInherit(value) {
    //Elimina los nodos y reasigna a sus hijos al sponsor
    if (!value) return null;
    if (this.root.value === value) {
      this.root = null;
    }

    let queue = [this.root];
    while (queue.length) {
      let node = queue.shift();
      for (let i = 0; i < node.children.length; i++) {
        if (node.children[i].value === value) {
          let childrenAux = node.children[i].children.map((children) => {
            children.sponsor = node.children[i].sponsor;
            return children;
          });
          node.children.splice(i, 1);
          node.children = [...childrenAux, ...node.children];
          node.children.sort((a, b) => a.id - b.id);
          queue = [];
          return;
        } else {
          queue.push(node.children[i]);
        }
      }
    }
  }

  findBFS(node, value) {
    if (!value) return null;
    let queue = [node];
    while (queue.length) {
      let node = queue.shift();
      if (node.value === value) {
        return node;
      }
      for (let i = 0; i < node.children.length; i++) {
        queue.push(node.children[i]);
      }
    }
    return null;
  }

  traverseBFS(node, fn) {
    let queue = [node];
    while (queue.length) {
      let node = queue.shift();
      fn && fn(node);
      for (let i = 0; i < node.children.length; i++) {
        queue.push(node.children[i]);
      }
    }
  }

  traverseDFS(node, fn, method) {
    let current = node;
    if (method) {
      this["_" + method](current, fn);
    } else {
      this._preOrder(current, fn);
    }
  }

  _preOrder(node, fn) {
    if (!node) {
      return;
    }

    fn && fn(node);
    for (let i = 0; i < node.children.length; i++) {
      this._preOrder(node.children[i], fn);
    }
  }

  _postOrder(node, fn) {
    if (!node) {
      return;
    }
    for (let i = 0; i < node.children.length; i++) {
      this._postOrder(node.children[i], fn);
    }
    fn && fn(node);
  }

  traverseListDownToUp(node, fn) {
    let current = node;
    while (current) {
      fn && fn(current);
      current = current.sponsor_node;
    }
  }

  get rootNode() {
    return this.root;
  }
}

class Users {
  constructor() {
    this.network = new Tree();
  }

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

  async createNetwork() {
    const users = await this.getAllUsers();
    users.sort((a, b) => a.id - b.id);
    users.forEach((user) => {
      this.network.add(user);
    });
  }

  totalSales(id) {
    let sales = 0;
    let node = null;
    if (id) {
      node = this.network.findBFS(this.network.rootNode, id);
    } else {
      node = this.network.rootNode;
    }
    this.network.traverseBFS(node, (node) => {
      sales += node.points_unilevel * point;
    });
    return sales;
  }

  commissionsUnilevel() {
    this.network.traverseBFS(this.network.rootNode, (node) => {
      let level = 1;
      if (node.points_unilevel) {
        let information = {
          id: node.id,
          username: node.username,
          level: 0,
          points: node.points_unilevel,
          percentage: 0,
          comision: 0,
        };

        this.network.traverseListDownToUp(node.sponsor_node, (current) => {
          if (current.active_unilevel) {
            let obj = Object.assign({}, information);
            obj.level = level;
            obj.percentage = percentage[level - 1];
            obj.comision = obj.points * percentage[level - 1] * point;

            current.unilevel.push(obj);
            level++;
          }
          if (level > levels) {
            current = null;
          }
        });
      }
    });
    console.log(this.network.rootNode);
  }

  setLevel() {
    this.network.traverseBFS(this.network.rootNode, (node) => {
      if (this.network.rootNode.value === node.value) {
        node.level = 0;
      } else {
        let parent = this.network.findBFS(this.network.rootNode, node.sponsor);
        node.level = parent.level + 1;
      }
    });
    // console.log(this.network.rootNode);
  }
}

const users = new Users();

users.createNetwork().then(() => {
  users.setLevel();
  users.commissionsUnilevel();
});
