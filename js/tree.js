class Tree {
  constructor() {
    this.root = null;
    this.levels = 0;
  }

  //METHODS *******************************************
  add(data) {
    let node = new Node(data);
    let parent = this.findBFS(this.rootNode, node.parent);
    if (parent) {
      node.up = parent;
      node.level = parent.level + 1;
      if (node.level > this.levels) this.levels = node.level;
      parent.children.push(node);
    } else if (!this.root) {
      node.up = null;
      node.level = 1;
      if (node.level > this.levels) this.levels = node.level;
      this.root = node;
    } else {
      throw new Error("The parent node is not in the tree.");
    }
  }

  delete(value) {
    /*
      Este método elimina el nodo del arból junto con sus hijos.
    */
    if (!value) return null;
    if (this.root.value === value) {
      this.root = null;
      return;
    }
    let queue = [this.root];
    while (queue.length) {
      let node = queue.shift();

      for (let i = 0; i < node.children.length; i++) {
        if (node.children[i].value === value) {
          node.children.splice(i, 1);
          return;
        } else {
          queue.push(node.children[i]);
        }
      }
    }
  }

  deleteAll() {
    /*
      Este método elimina el arból.
    */
    this.root = null;
  }

  deleteAndReassign(value) {
    /*
      Este método elimina el nodo del arból y reasigna sus hijos al nodo padre
    */
    if (!value) return null;
    if (this.root.value === value) {
      this.root = null;
      return;
    }
    let queue = [this.root];
    while (queue.length) {
      let node = queue.shift();
      for (let i = 0; i < node.children.length; i++) {
        if (node.children[i].value === value) {
          let childrenAux = node.children[i].children.map((children) => {
            children.parent = node.children[i].parent;
            children.current.up = node.children[i].current.up;
            return children;
          });
          node.children.splice(i, 1);
          node.children = [...childrenAux, ...node.children];
          node.children.sort((a, b) => a.id - b.id);
          return;
        } else {
          queue.push(node.children[i]);
        }
      }
    }
  }

  findBFS(node, value) {
    /*
      Este método recorre todo el arból a lo ancho hasta que encuentra una coincidencia
      con el valor buscado y regresa el nodo en caso de que lo encuentra y se detiene.
      Recibe como parametro el nodo root y el valor a buscar.
    */
    if (!value || !node) return null;
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

  BFS(node, fn) {
    /*
      Este método recorre todo el arból a lo largo.
      Recibe como parametro el nodo root y un callback para trabajar con cada nodo.
    */
    let queue = [node];
    while (queue.length) {
      let node = queue.shift();
      fn(node);
      for (let i = 0; i < node.children.length; i++) {
        queue.push(node.children[i]);
      }
    }
  }

  DFS(node, fn, method) {
    /*
      Este método recorre todo el arból a lo largo, por default lo recorre en preOrder al menos
      que se indique lo contrario.
      Recibe como parametro el nodo root, un callback para trabajar con cada nodo y el metodo
      seleccionado en caso de que se quiera modificar a postOrder.
    */
    if (method) {
      this[method](node, fn);
    } else {
      this.preOrderDFS(node, fn);
    }
  }

  preOrderDFS(node, fn) {
    /*
      Este método recorre todo el arból a lo largo en preOrder de forma recursiva.
      Recibe como parametro el nodo root, un callback para trabajar con cada nodo.
    */
    if (!node) {
      return;
    }
    fn(node);
    for (let i = 0; i < node.children.length; i++) {
      this._preOrder(node.children[i], fn);
    }
  }

  postOrderDFS(node, fn) {
    /*
      Este método recorre todo el arból a lo largo en postOrder de forma recursiva.
      Recibe como parametro el nodo root, un callback para trabajar con cada nodo.
    */
    if (!node) {
      return;
    }
    for (let i = 0; i < node.children.length; i++) {
      this._postOrder(node.children[i], fn);
    }
    fn(node);
  }

  list(node, fn, method) {
    /*
      Este método recorre una lista enlazada, por default lo recorre en preOrder al menos
      que se indique lo contrario.
      Recibe como parametro el nodo root, un callback para trabajar con cada nodo y el metodo
      seleccionado en caso de que se quiera modificar a postOrder.
    */
    if (method) {
      this[method](node, fn);
    } else {
      this.preOrderList(node, fn);
    }
  }

  preOrderList(node, fn) {
    /*
      Este método recorre una lista enlazada y corre una función en preOrder.
      Recibe como parametro el nodo root, un callback para trabajar con cada nodo.
    */
    let current = node;
    while (current) {
      fn(current);
      current = current.up;
    }
  }

  postOrderList(node, fn) {
    /*
      Este método recorre una lista enlazada y corre una función en preOrder.
      Recibe como parametro el nodo root, un callback para trabajar con cada nodo.
    */
    let current = node;
    while (current) {
      fn(current);
      current = current.up;
    }
  }

  listWithStop(node, fn) {
    /*
      Este método recorre una lista enlazada y corre una función en preOrder y se detiene
      Recibe como parametro el nodo root, un callback para trabajar con cada nodo (Los dos parámetros son obligatorios
      y el callback siepre debe retornar true si necesita continuar, de lo contrario se detiene el recorrido)
    */
    if (!node || !fn) {
      return;
    }
    let current = node;
    while (current) {
      let _continue = fn(current);
      current = _continue ? current.up : null;
    }
  }

  setLevel(node) {
    this.BFS(node, (current) => {
      if (current.up && current.up.level) {
        current.level = current.up.level + 1;
      } else {
        current.level = 1;
      }
    });
  }

  //SETTERS *******************************************
  set rootNode(node) {
    let newNode = new Node(node);
    this.root = newNode;
  }

  //GETTERS *******************************************
  get rootNode() {
    return this.root;
  }

  get maxLevel() {
    return this.levels;
  }
}

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
    this.up = user.up ? user.up : null;
    this.children = user.children ? user.children : [];
  }
}
