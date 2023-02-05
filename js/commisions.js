class Commissions {
  constructor() {}

  // totalSales(id) {
  //   let sales = 0;
  //   let node = null;
  //   if (id) {
  //     node = this.network.findBFS(this.network.rootNode, id);
  //   } else {
  //     node = this.network.rootNode;
  //   }
  //   this.network.BFS(node, (node) => {
  //     sales += node.points_unilevel * point;
  //   });
  //   return sales;
  // }

  // commissionsUnilevel() {
  //   this.network.BFS(this.network.rootNode, (node) => {
  //     let level = 1;
  //     if (node.points_unilevel) {
  //       let information = {
  //         id: node.id,
  //         username: node.username,
  //         level: 0,
  //         points: node.points_unilevel,
  //         percentage: 0,
  //         comision: 0,
  //       };

  //       this.network.traverseList(node.sponsor_node, (current) => {
  //         if (current.active_unilevel) {
  //           let obj = Object.assign({}, information);
  //           obj.level = level;
  //           obj.percentage = percentage[level - 1];
  //           obj.comision = obj.points * percentage[level - 1] * point;

  //           current.unilevel.push(obj);
  //           return ++level;
  //         }
  //       });
  //     }
  //   });
  // }
}
