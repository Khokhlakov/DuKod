var id_tree = 0;
var id_node = 0;
var id_node_group = 0;
class Forest {
  
  constructor(D = 2,              // Alphabet size
              roots = [],         // List of parentless nodes
              show_p = false
    ){
    
    this.id = id_tree;
    id_tree += 1
    this.D = D;
    this.show_p=show_p;
    if (roots.length == 0) roots =[new Node()];
    this.roots = roots;
    this.leaves = [...roots];
    this.node_num = 0;
    this.leaf_num = 0;
    this.inner_num = 0;
    this.len_prom =0;
    this.copy_pointer = null;
    this.type = 0; // 0:Huffman 1:Shannon-Fano 2:Tunstall
    this.tunstall_D = 0;
    this.at_a_time = 1; // amount of symbols taken as a unit (for extended sources)
  }
  
  
  
  add_leaf(N, n=0){ // N: parent node, n: child node
    if (!n){
      n = new Node();
    }
    
    N.layer_up(n.layer); // Fix layer value up to the root
    n.add_depth(N.depth);
    N.sub.push(n);
    n.parent = N;
    
    // Add n to leaves
    
    // Add N to roots
    
    // Remove n from the roots
    const index = this.roots.indexOf(n);
    if (index > -1) this.roots.splice(index, 1);
    
    // Remove N from the leaves
    const index2 = this.leaves.indexOf(N);
    if (index2 > -1) this.leaves.splice(index2, 1);
    
  }
  
  
  are_siblings(node_arr){
    // Assumes nodes are not roots
    
    let node = node_arr[0];
    for (let node2 of node_arr) {
      if (!node2.parent){
        return false;
      }
      if (node.parent.id != node2.parent.id){
        return false;
      }
    }
    return true;
  }
  
  
  count_nodes(){
    var counter = 0;
    for (let root of this.roots){
      var q = [root];
      while (q.length != 0){
        let node = q.shift();
        counter += 1;
        q.push(...node.sub);
      }
    }
    this.node_num = counter;
    this.leaf_num = this.leaves.length;
    this.inner_num = counter - this.leaf_num;
  }
  
  
  calc_len_prom(){
    var sum = 0;
    for (let root of this.roots){
      var q = [root];
      while (q.length != 0){
        let node = q.shift();
        
        if (node.layer > 1) {
          sum += node.p;
        }
        
        q.push(...node.sub);
      }
    }
    
    this.len_prom = sum;
  }
  
  
  get_info(n){
    this.count_nodes();
    this.calc_len_prom();
    var st = "";
    if (this.type == 2){
      st += "Longitud promedio de palabra del analizador:\n   "+
          str(this.len_prom);
    } else{
      st += "Longitud promedio de palabra código:\n   "+
          str(this.len_prom);
    }
    if (this.at_a_time > 1) {
      st += " bits/"+ this.at_a_time+" símbolos.\n" + str(this.len_prom/this.at_a_time);
    } 
    st += " bits/símbolo.\n";
    st += "Nodos: "+str(this.node_num)+"\n";
    st += "Hojas: "+str(this.leaf_num)+"\n";
    st += "Nodos internos: "+str(this.inner_num)+"\n";
    print(st);
    return st;
  }
  

  set_coords(){
    var nodes = [...this.leaves];
    
    // Set position of leaves
    for (let i = 0 ; i<nodes.length ; i++){
      nodes[i].x = i - (nodes.length-1)/2;
      nodes[i].y = (nodes.length-1)/2;
    }
    
    // Remove leaves that are roots
    var bin_ids = [];
    for (let i = 0 ; i<nodes.length ; i++){
      if (nodes[i].depth == 1) {
        bin_ids.push(i);
      }
    }
    while (bin_ids.length > 0){
      nodes.splice(bin_ids.pop(), 1);
    }
    
    // Build up from the position of the leaves
    var new_nodes = [];
    var contcont = 50;
    var was_edited = true;
    while(nodes.length > 1 && was_edited){
      was_edited = false;
      
      contcont -= 1;
      new_nodes = [...nodes];
      for (let i = 0 ; i<=nodes.length-this.D ; i++ ){
        let nodes2 = [...nodes];
        if(this.are_siblings(nodes2.splice(i,this.D))) {
          let n1 = nodes[i];
          let n2 = nodes[i-1+this.D];
          let len = (n2.x + n1.y - n1.x - n2.y)/2;
          n1.parent.x = n1.x + len;
          n1.parent.y = n1.y - len;
          new_nodes.splice(i,this.D, n1.parent);
          
          was_edited = true;
          break;
          //i = nodes.length-this.D;
        }
      }
      nodes = [...new_nodes];
      
    }
  }
  
  
  set_coords2(){
    var root = this.roots[0];
    var q = [...root.sub];
    var min_coords = [0];
    root.x2 = 0;
    root.y2 = 0;
    while (q.length != 0){
      var node = q.shift();
      var parent = node.parent;
      q.push(...node.sub);
      
      if (min_coords.length < node.depth) {
        min_coords.push(parent.x2-(this.D-1)*0.5);
      }
      node.y2 = parent.y2 + 2;
      node.x2 = max(min_coords[node.depth-1], parent.x2-(this.D-1)*0.5); 
      min_coords[node.depth-1] = node.x2 + 1;
      
    }
  }
  
  
  deep_copy(){
    // Returns deep copy of the tree
    var copy_tree = new Forest(this.D, [], this.show_p);
    copy_tree.type = this.type;
    copy_tree.roots.pop();
    copy_tree.leaves.pop();
    // Traverse with stack
    for (let root of this.roots){
      
      var stack = [root];
      var node = root;
      node.sub_id = 0;
      

      while (stack.length != 0){

        node = stack[stack.length-1];
        if (node.sub_id == 0){
          // If it is the first time readding node 
          // check if it has parents and connect it to the parent
          node.copy_pointer = new Node(node.type, node.p, node.val);
          
          if (node.parent){
            // If has parent
            copy_tree.add_leaf(node.parent.copy_pointer, node.copy_pointer);
          } else {
            // If no parents, set as root
            copy_tree.roots.push(node.copy_pointer);
          }
          
          // check if leave and save to leaves
          if (node.copy_pointer.layer == 1) {
            copy_tree.leaves.push(node.copy_pointer);
          }
        }
        if (node.sub.length > node.sub_id) {
          var sub = node.sub[node.sub_id];
          stack.push(sub);
          sub.sub_id = 0;
          node.sub_id += 1;

        } else {
          // Node is leaf or all subnodes have been read
          // Remove from stack an reset sub counter to 0
          stack.pop().sub_id = 0;
        }
      }

    }
    
    if (this.type == 2){
      copy_tree.set_coords2();
    } else{
      copy_tree.set_coords();
    }
    
    return copy_tree;
  }
  
  
  printx(alg=""){
    print("Arbol"+alg+": ");
    var forest_str = "";
    
    for (let root of this.roots){
      
      var stack = [root];
      var node = root;
      if (this.show_p){
        forest_str += "[" + str(node.id) + "," + node.val + "," + str(node.p);
      } else {
        forest_str += "[" + str(node.id) + "," + node.val;
      }
      
      while (stack.length != 0){
        
        node = stack[stack.length-1];
        if (node.sub.length > node.sub_id) {
          var sub = node.sub[node.sub_id];
          stack.push(sub);
          if (this.show_p){
            forest_str += "[" + str(sub.id) + "," + sub.val + "," + str(sub.p);
          } else {
            forest_str += "[" + str(sub.id) + "," + sub.val;
          }
          node.sub_id += 1;
          
        } else {
          stack.pop().sub_id = 0;
          forest_str += "]";
        }
      }
      
    }
    
    print(forest_str);
  }
  
  
}


class Node {
  constructor(type = 0,          // 0: inactive leaf, 1: inner, 2:unused leaf, 3:active
              p = 0,             // Assigned probability
              val = ""           // Character/word asociated to node
  ){
    this.type = type;
    this.val = val;
    this.id = id_node;
    id_node += 1;
    this.x = 0; this.y = 0;      // Coords for displaying ver. 1
    this.x2 = 0; this.y2 = 0;    // Coords for displaying ver. 2
    this.p = p;
    this.layer = 1;              // Layer (bottom to top starting from 1)
    this.depth = 1;              // Depth (top to bottom starting from 1)
    this.h = 0;                  // Leaves have height 0
    this.sub = [];               // Ordered list of children
    this.sub_id = 0;             // Used fro traversing the children
    this.parent = 0;
  }
  
  
  add_depth(m){
    // Adds m to the depth of the subtree with root this
    
    var q = [this];
    while (q.length != 0){
      let node = q.shift();
      node.depth += m;
      q.push(...node.sub);
    }
    
  }
  
  layer_up(child_layer){
    // from this up, set the correct layer
    
    this.layer = max(this.layer, child_layer + 1);
    if (this.parent) {this.parent.layer_up(this.layer)}
    
  }
  
}


class NodeGroup {
  constructor(nodes,             // Array of nodes it represents
              parent
  ){
    this.id = id_node_group;
    id_node_group += 1;
    this.group = nodes;
    this.parent = parent;
  }
}