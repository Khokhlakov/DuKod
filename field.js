class Field {                    // GF(p^n), needs quotient polynomial
  constructor(p = 0,             
              n = 0,             
              poly               // irreducible Polynomial of degree n
  ){
    this.p = p;
    this.n = n;
    this.poly = poly;
    this.id = id_node;
    this.size = p**n;
    id_node += 1;
    
    this.pol_to_char = 0;
    this.sum_table = 0;
    this.inverse_table = 0;
    this.prod_table = 0;
    
    this.map_polys();
  }
  
  
  map_polys() {
    
    // Generate all coefficient combinations in num_it iteration
    let num_it = this.p**(this.n-1);
    var coef_list = [[0]];
    var q = [];
    var append_to_this = [];
    for (let i = 0 ; i<num_it ; i++){
      for (let j = 0 ; j<this.p ; j++){
        if (i!=0 || j!=0){
          
          let new_coefs = [...append_to_this];
          new_coefs.push(j);
          coef_list.push(new_coefs);
          q.push(new_coefs);
        }
      }
      append_to_this = q.shift();
    }
    
    // Create list of symbols to be used: 0, 1, A, B, ..., Z, AA, AB, ...
    var symbols = ["0", "1"];
    q = [""];
    while (symbols.length < this.size) {
      let base = q.shift();
      for (let k = 0; k<26; k++){
        let new_symbol = base + String.fromCharCode(k + 65);
        q.push(new_symbol);
        symbols.push(new_symbol);
      }
    }
    
    // Polynomial/character maps
    var pol_to_char = {};
    var char_to_pol = {};
    let char_i = 0;
    
    // Create each polynomial with the coefficients
    var polys = new Array(this.size);
    for (let i=0; i<coef_list.length; i++){
      let single_cl = coef_list[i];
      
      let poly_dict = {};
      for (let k = 0 ; k<single_cl.length ; k++){
        poly_dict[this.n-1-(k+this.n-single_cl.length)] = single_cl[k];
      }
      
      let pol = new Polynomial(poly_dict, this.p);
      
      // Map polynomial to symbol
      //print(pol.to_str())
      pol_to_char[pol.to_str()] = symbols[i];
      char_to_pol[symbols[i]] = pol;
        
      polys[i] = pol;
      
      char_i += 1;
    }
    this.char_to_pol = char_to_pol;
    
    //Create tables
    var sum_table = {};
    var inverse_table = {};
    var prod_table = {};
    let zero = new Polynomial({0:0}, this.p);
    for (let p1 of polys){
      
      let p1_str = p1.to_str();
      let p1_symb = pol_to_char[p1_str];
      
      inverse_table[pol_to_char[p1_str]] = pol_to_char[zero.minus(p1).to_str()];
      
      for (let p2 of polys){
        
        let p2_str = p2.to_str();
        let p2_symb = pol_to_char[p2_str];
        
        let sum_str = p1.plus(p2).to_str();
        let sum_symb = pol_to_char[sum_str];
        
        !(p1_symb in sum_table) && (sum_table[p1_symb] = {});
        sum_table[p1_symb][p2_symb] = sum_symb;
        !(p2_symb in sum_table) && (sum_table[p2_symb] = {});
        sum_table[p2_symb][p1_symb] = sum_symb;
        
        
        let prod_str = p1.times(p2).mod(this.poly).to_str();
        let prod_symb = pol_to_char[prod_str];
        
        !(p1_symb in prod_table) && (prod_table[p1_symb] = {});
        prod_table[p1_symb][p2_symb] = prod_symb;
        !(p2_symb in prod_table) && (prod_table[p2_symb] = {});
        prod_table[p2_symb][p1_symb] = prod_symb;
      }
    }
    
    
    this.pol_to_char = pol_to_char;
    this.sum_table = sum_table;
    this.inverse_table = inverse_table;
    this.prod_table = prod_table;
    print("Asignaciones Polinomio/Símbolo:")
    print(pol_to_char);
    print("Tabla de la suma:")
    print(sum_table);
    print("Inversos aditivos:")
    print(inverse_table);
    print("Tabla del producto:")
    print(prod_table);
    
  }
}


class Polynomial {
  
  constructor(poly,          // polynomial as a js map: exponent:coefficient
              p              // modulo
  ){
    this.poly = poly;
    this.p = p;
    this.set_coefficients();
    this.d = this.get_degree();
    this.id = id_node;
    id_node += 1;
    
    this.sup_script = {"0":"⁰","1":"¹","2":"²","3":"³","4":"⁴",
                         "5":"⁵","6":"⁶","7":"⁷","8":"⁸","9":"⁹"};
  }
  
  
  get_degree(){
    let max_degree = 0;
    for (let k of Object.keys(this.poly)) {
      var k_int = parseInt(k);
      if (this.poly[k]!=0 && k_int>max_degree) {
        max_degree = k_int;
      }
    }
    return max_degree;
  }
  
    
  set_coefficients(){
    for (const [ex, coef] of Object.entries(this.poly)) {
      this.poly[ex] = coef%this.p;
      
      if (this.poly[ex]<0){
        this.poly[ex] += this.p;
      }
    }
  }
  
  
  plus(q){
    // Adds polynomials this and q
    
    var p2 = structuredClone(this.poly);
    
    // If exponent is not in map, add and set to 0
    for (const [ex, coef] of Object.entries(q.poly)) {
      
      !(ex in p2) && (p2[ex] = 0);
      p2[ex]  = (p2[ex] + coef)%this.p;
      
      if (p2[ex]<0){
        p2[ex] += this.p;
      }
    }
    
    
    return new Polynomial(p2, this.p);
  }
  
  
  minus(q){
    // substracts polynomial q from this
    
    var p2 = structuredClone(this.poly);
    
    // If exponent is not in map, add and set to 0
    for (const [ex, coef] of Object.entries(q.poly)) {
      
      !(ex in p2) && (p2[ex] = 0);
      p2[ex]  = (p2[ex] - coef)%this.p;
      
      if (p2[ex]<0){
        p2[ex] += this.p;
      }
    }
    
    
    return new Polynomial(p2, this.p);
  }
  
  
  times(q){
    // Multiplies polynomials this and q
    
    var p2 = {};
    
    // If exponent is not in map, add and set to 0
    for (const [ex, coef] of Object.entries(this.poly)) {
      for (const [ex2, coef2] of Object.entries(q.poly)) {
        
        let prodex = parseInt(ex) + parseInt(ex2);
        
        !(prodex in p2) && (p2[prodex] = 0);
        p2[prodex]  = (p2[prodex] + coef*coef2)%this.p;
        
        if (p2[prodex]<0){
        p2[prodex] += this.p;
      }
      }
    }
    
    
    return new Polynomial(p2, this.p);
  }
  
  
  mod(q){
    // get resudue from this/q
    
    var r = new Polynomial(structuredClone(this.poly), this.p);
    
    while (r.d >= q.d){
      
      let d_diff = r.d-q.d;
      let coeff = (r.poly[r.d.toString()] * (q.poly[q.d.toString()]**(this.p-2)))%this.p;
      var factor_dict = {};
      factor_dict[d_diff] = coeff;
      var new_term = new Polynomial(factor_dict, this.p);
      r = r.minus( new_term.times(q) );
      r.d = r.get_degree();
    }
    
    return r;
  }
  
  
  to_str(){
    // Get list (ex:coef) sorted by key
    var result = "";
    var add_plus = false;
    var lst = Object.keys(this.poly).map((key) => [parseInt(key), this.poly[key]]).sort(function(a, b){return a[0] - b[0]});
    for (let pair of lst){
      if (pair[1]){
        
        // Set exponent
        var new_ex = "";
        var ex_str = pair[0].toString();
        if (ex_str == "1") {
          new_ex = "";
        } else {
          for (let ch of ex_str){
            new_ex += this.sup_script[ch];
          }
        }
        
        if (add_plus){// if coeff != 0
          result += "+";
        } 
        if (pair[1]!=1){ // if coeff is not 1 add it
          result += pair[1].toString()
        } else if (pair[0]==0) { // if coeff is 1 and exp is 0
          result += "1";
        }
        if (pair[0]>0){
          result += "x"+new_ex;
        }
        
        add_plus = true;
      }
    }
    if (result==""){
      return "0";
    }
    return result
  }
}

class Vector {
  constructor(x,     // string array
              field
  ){
    this.x = x;
    this.field = field;
    this.length = this.x.length;
    
    // No. of components different to 0 (Hamming weight):
    this.weight = this.length - x.reduce((a, v) => (v === "0" ? a + 1 : a), 0);         
  }
  
  plus(v2){
    // Componentwise addition
    
    let result = new Array(this.length);
    for (let i = 0 ; i<this.length ; i++){
      result[i] = this.field.sum_table[this.x[i]][v2.x[i]];
    }
    
    return new Vector(result, this.field);
  }
  
  minus(v2){
    // Componentwise addition
    
    let result = new Array(this.length);
    for (let i = 0 ; i<this.length ; i++){
      result[i] = this.field.sum_table[this.x[i]][this.field.inverse_table[v2.x[i]]];
    }
    
    return new Vector(result, this.field);
  }
  
  sum(){
    // Add all components up
    
    let result = "0";
    for (let i = 0 ; i<this.length ; i++){
      result = this.field.sum_table[result][this.x[i]];
    }
    
    return new Vector(result, this.field);
  }
  
  prod(symbol){
    // Scalar product. Symbol must be element of the field
    let result = new Array(this.length);
    for (let i = 0 ; i<this.length ; i++){
      result[i] = this.field.prod_table[this.x[i]][symbol];
    }
    
    return new Vector(result, this.field);
  }
  
  
  times(v2){
    // Componentwise product
    
    let result = new Array(this.length);
    for (let i = 0 ; i<this.length ; i++){
      result[i] = this.field.prod_table[this.x[i]][v2.x[i]];
    }
    
    return new Vector(result, this.field);
  }
  
  to_str(){
    let str = "";
    for (let i = 0; i<this.length ; i++){
      if (i==0){
        str += "(" +this.x[i];
      } else {
        str +=  ","+this.x[i];
      }

    }
    return str + ")";
  }
  
}