var id_source = 0;
class Source {
  constructor(S,                  // Source alphabet
              P,                  // Probability distrivution
              T = [0,1]           // Code Alphabet
  ){
    this.S = S;
    this.P = P;
    this.T = T;
    this.Tbin = [0,1];
    this.id = id_source;
    id_source += 1;
    this.huffman_t = 0;
    this.SF_t = 0;
    this.tunstall_t = 0;
    this.tunstall_dict = new Map();
    this.tunstall_n = 0;
    this.alphabet_simb_len = 1;
    this.at_a_time = 1;
    this.n = 0; // Length of tunstall analizer words
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
  
  
  calc_entropy(base){
    var sum = 0;
    for (var p of this.P) {
      sum -= p*Math.log(p);
    }
    return (sum/Math.log(base));
  }
  
  
  get_info(){
    var st = "";
    st +="Información sobre la fuente:\n";
    st +="Entropía de la fuente (log_2): "+str(this.calc_entropy(2))+"\n";
    if (this.huffman_t){
      if (this.huffman_t.D != 2) {
        st +="Entropía de la fuente (log_"+
              str(this.huffman_t.D)+
              "): "+str(this.calc_entropy(this.huffman_t.D))+"\n";
      }
      st +="Eficiencia de codificar con Huffman ("+
            str(this.T.length)+" símbolos): \n   H(F)/L(C) = "+str(this.calc_entropy(this.huffman_t.D)/this.huffman_t.len_prom)+"\n";
    }
    if (this.SF_t){
      st +="Eficiencia de codificar con Shannon-Fano: \n   H(F)/L(C) = "+str(this.calc_entropy(2)/this.SF_t.len_prom)+"\n";
    }
    if (this.tunstall_t){
      st +="Eficiencia de codificar con Tunstall: \n   η="+
            str(this.calc_entropy(this.T.length)*this.tunstall_t.len_prom/this.n)+"\n";
    }
    print("\n");
    print(st);
    return st;
  }
    

  extend(n) {
    var product_S = [];
    var product_P = [];
    var temp_S = [...this.S];
    var temp_P = [...this.P];
    
    
    for (let i = 1 ; i < n ; i++) {
      for (let j = 0 ; j < this.S.length ; j++) {
        for (let k = 0 ; k < temp_S.length ; k++) {
          product_S.push(this.S[j] + temp_S[k]);
          product_P.push(this.P[j] * temp_P[k]);
        }
      }
      temp_S = product_S;
      temp_P = product_P;
      product_S = [];
      product_P = [];
    }
    var prod_source = new Source(temp_S, temp_P, this.T);
    prod_source.alphabet_simb_len = n;
    return prod_source;
    
  }
  
  
  huffman(){ 
    // S: source alphabet, P: Distribution, T: D-ary code alphabet
    var S = this.S; 
    var P = this.P; 
    var T = this.T;
    var process_register = [];
    // Asociate P with S
    var pairs = [];
    for (let i = 0 ; i < P.length; i++) {
      pairs.push([P[i],S[i]]);
    }

    // Sort using P
    pairs.sort(function(a, b){return a[0] - b[0]});
    P.sort();

    // Initiate tree
    var init_nodes = [];
    for (let pair of pairs){
      init_nodes.push(new Node(3, pair[0], pair[1]));
    }

    var stages = [new Forest(T.length, [...init_nodes], true)];


    // Add unused leaves if necessary
    var r = 0;
    while (((r+P.length-T.length) % (T.length-1)) != 0 ){
      r += 1;
    }

    for (let i = 1; i <= r ; i++) {
      init_nodes.unshift(new Node(2, 0));
    }

    // Create tree
    var tree = new Forest(T.length, init_nodes, true);
    tree.type = 0;

    // Save state
    process_register.push(tree.deep_copy());

    //tree.printx();
    //tree.set_coords();
    //paint_tree(tree);

    while (tree.roots.length > 1){
      
      
      // Add inner node
      var new_p = 0;
      for (let i = 0; i<tree.D; i++){
        new_p += tree.roots[i].p;
        if (tree.roots[i].type != 2) tree.roots[i].type = 0;
      }
      var new_node = new Node(3, new_p);
      var new_subs = tree.roots.splice(0,tree.D, new_node);

      for (let sub of new_subs) {
        tree.add_leaf(new_node, sub);
      }
      // save state
      process_register.push(tree.deep_copy());
      
      
      // Reorder the nodes by probability
      // First the roots
      tree.roots.sort(function(a, b){return a.p - b.p});
      // Then the leaves according to the roots. tho roder the
      // leaves, traverse in in-order
      
      var new_leaves = [];
      
      for (let root of tree.roots){
      
        var stack = [root];
        var node = root;
        node.sub_id = 0;
        if (node.layer == 1) new_leaves.push(node);

        while (stack.length != 0){

          node = stack[stack.length-1];
          if (node.sub.length > node.sub_id) {
            var sub = node.sub[node.sub_id];
            stack.push(sub);
            sub.sub_id = 0;
            node.sub_id += 1;

          } else {
            // Node is leaf
            // Remove from stack an reset sub counter to 0
            if (node.layer == 1) new_leaves.push(node);
            stack.pop().sub_id = 0;
          }
        }

      }
      
      tree.leaves = new_leaves;
      // save state
      process_register.push(tree.deep_copy());

    }
    //process_register.push(tree.deep_copy());
    
    tree.set_coords();
    tree.printx(" (Huffman)");
    this.huffman_t = process_register[process_register.length-1];
    this.huffman_t.at_a_time = this.at_a_time;
    return process_register;
  }
  
  
  
  SF(){ 
    // Only for binary alphabet
    // S: source alphabet, P: Distribution, T: D-ary code alphabet
    var S = this.S; 
    var P = this.P; 
    var T = this.Tbin;
    
    var process_register = [];

    // Asociate P with S
    var pairs = [];
    for (let i = 0 ; i < P.length; i++) {
      pairs.push([P[i],S[i]]);
    }

    // Sort using P
    pairs.sort(function(a, b){return a[0] - b[0]});
    P.sort();

    // Initiate tree
    var init_nodes = [];
    for (let pair of pairs){
      init_nodes.push(new Node(0, pair[0], pair[1]));
    }
    
    
    var root = new Node(0, 1);
    var init_group = new NodeGroup([...init_nodes], root);
    init_nodes.push(root);

    // Create tree
    var tree = new Forest(T.length, init_nodes, true);
    tree.type = 1;
    
    // Save state
    process_register.push(tree.deep_copy());
    
    var node_groups = [init_group];
    
    while (node_groups.length > 0){
      var node_group = node_groups.shift();
      var group = node_group.group;
      
      // Split in two groups
      var best_index = 0;
      var best_num = 1;
      var best_cumulative = 0;
      var cumulative = 0;
      for (let i = 0; i<group.length ; i++) {
        cumulative += group[i].p;
        if (abs(node_group.parent.p*0.5-cumulative) < best_num) {
          best_num = abs(node_group.parent.p*0.5-cumulative);
          best_index = i;
          best_cumulative = cumulative;
        }
      }
      if (best_index > 0) {
        var left_node = new Node(0, best_cumulative);
        var right_group = group.splice(best_index+1);
        var left_node_group = new NodeGroup(group,left_node);
        node_groups.push(left_node_group);
        tree.add_leaf(node_group.parent,
                     left_node);
        if (right_group.length > 1) {
          var right_node = new Node(0, node_group.parent.p-best_cumulative);
          tree.add_leaf(node_group.parent,
                     right_node);
          var right_node_group = new NodeGroup(right_group,right_node);
          node_groups.push(right_node_group);
        } else {
          tree.add_leaf(node_group.parent,
                     right_group[0]);
        }
      } else {
        tree.add_leaf(node_group.parent,
                     group[0]);
        var right_group = group.splice(1);
        if (right_group.length > 1) {
          var right_node = new Node(0, node_group.parent.p-best_cumulative);
          tree.add_leaf(node_group.parent,
                     right_node);
          var right_node_group = new NodeGroup(right_group,right_node);
          node_groups.push(right_node_group);
        } else {
          tree.add_leaf(node_group.parent,
                     right_group[0]);
        }
      }
      
      // Save state
      process_register.push(tree.deep_copy());
    }
    
    tree.set_coords();
    tree.printx(" (Shannon-Fano)");
    this.SF_t = process_register[process_register.length-1];
    
    this.SF_t.at_a_time = this.at_a_time;
    return process_register;
  }
  
  
  tunstall(n){ 
    // S: Source alphabet, 
    // P: Distribution, 
    // T: D-ary code alphabet
    // n: Codeword len
    var S = this.S; 
    var P = this.P; 
    var T = this.T;
    this.n = n;
    this.type = 2;
    
    var process_register = [];
    
    if ((T.length**n) < S.length) {
      print("No hay suficientes palabras de longitud " +
            str(n)+" con el alfabeto dado para codificar todos los símbolos de la fuente.");
      return 0;
    }
    
    // K: Inner nodes
    // M: Leaves
    var K = floor(((T.length**n)-1)/(S.length-1));
    var M = K*(S.length-1) + 1;

    
    // Create tree
    var tree = new Forest(S.length, [new Node(0,1, "")], true);
    tree.type = 2;
    tree.tunstall_D = T.length;
    
    // Save state
    process_register.push(tree.deep_copy());
    
    
    for (let i = 0; i < K ; i++) {
      
      // Find leaf with min weight
      var max_w_node = tree.leaves[0];
      for (var leaf of tree.leaves) {
        if (leaf.p > max_w_node.p) max_w_node = leaf;
      }
      
      // Append |S| children
      for (let j = 0; j < S.length ; j++){
        var node = new Node(0, max_w_node.p*P[j], max_w_node.val + S[j]);
        tree.leaves.push(node);
        tree.add_leaf(max_w_node, node);
      }
      // Save state
      process_register.push(tree.deep_copy());
      
    }
    
    var count = 0;
    for (var leaf of tree.leaves) {
      this.tunstall_dict.set(leaf.val, 
                             Number(count).toString(T.length).padStart(n, '0'));
      count += 1;
    }
    
    
    
    tree.set_coords2();
    tree.printx(" (Tunstall)");
    print("Diccionario del analizador:")
    print(this.tunstall_dict);
    this.tunstall_t = process_register[process_register.length-1];
    
    return process_register;
  }
}