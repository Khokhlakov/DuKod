let img;
let img2;
let img3;
let img4;
let imgNow;

// Load the image.
function preload() {
  img = loadImage('/assets/f2.png');
  img2 = loadImage('/assets/f3.png');
  img3 = loadImage('/assets/f4.png');
  img4 = loadImage('/assets/f5.png');
  imgNow = img;
}

var dict_col = new Map([[0, "blue"],
                        [1, "blue"],
                        [2, "red"], // Unused
                        [3, "lime"]]) // Active


const FR=60; // Frame rate
var H; // Height
var H43; // 4/5 of height
var U; // Length unit
var H_U; 
var H2;
var H_2U;
var H_2U3;
var H_2U23;
var U5;
var LIFELEN;
var Ut10;
var Usqr;

// Used for tree display movement
var mouse_pressed = false;
var tree_size = 1.4;

// Used for the displayal of alg steps
var treePics = [];
var treePicsId = 0;

// Used for displayal of tree
var show_probs = 0; //0 false, 1 true
var show_probs_img = ["Aa","P"];

// Used for moving tree with cursor
var xshift = 0;
var yshift = 0;

// Used for moving coclasses
var cc_yshift;

// type of configs
var alg_type = 0;
// 0: Huffman, 1: Shannon-Fano, 2: Tunstall, 3: Linear
var alg_texts = [];

// Show G
var show_G = false;
var G_text = "";
var H_text = "";
var linear_type_str = "";

// show tree info
var show_T = false;
var T_text = "";

// array of vector of a linear code & string
var field;
var vectors; // Base for linear code
var linear_code;
var LN_str = "";
var coclass_str = "";
var showing_coclass = false;

// String for displaying polynomial mapping
var poly_map_str = "";
var showing_polys = false;

var asd8;
var asd9;

// Messages
var msgList = [`Ejemplo del algoritmos de Huffman y Shannon-Fano respectivamente.`, 
               `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`,
              `msg de prueba 3`,
              `msg de prueba 4`,
              `msg de prueba 5`];

// Amount a message takes to appear
var msgTime = [50,100,150,20,150]

// second must be true
var msgCounter=0;

let counter = 0;

let GUI = {
  isPaused: true,
  isDisplayingMsg: false,
  msg: undefined,
  msgLen: undefined,
  msgColour: undefined,
  stage: 1,
  readyToComment: false,
  msgStartTime: 0,
  msgTime: 0,
  menu : {
    isActive : false,
    button : undefined,
    b1:undefined,
    b2:undefined,
    subtext : undefined,
    display(){
      this.b1.style('display','initial');
      this.b2.style('display','initial');
      this.subtext.style('display','initial');
    },
    hide(){
      this.b1.hide();
      this.b2.hide();
      this.subtext.hide();
    }
  },

  
  setMenu() {
    this.menu.button = createButton('🏠︎');
    this.menu.button.style('font-family', 'Bold Georgia');
    this.menu.button.style('background-color', '#413c42');
    this.menu.button.style('border-color', '#413c42');
    this.menu.button.style('color', '#ffffff');
    this.menu.button.position(H, U);
    this.menu.button.style('font-size', `${U}px`);
    this.menu.button.style('width', `${U*2}px`);
    this.menu.button.style('height', `${U*2}px`);
    this.menu.button.mouseReleased(menuActivation);
    this.menu.button.hide();
    
    
    this.menu.subtext = createP(
      `<strong>Cambiar modo.</strong>`
    );
    this.menu.subtext.style('width', `${U*10}px`);
    this.menu.subtext.style('font-family', 'Courier New');
    this.menu.subtext.style('color', '#ffffff');
    this.menu.subtext.style('font-size', `${U/2}px`);
    this.menu.subtext.position(U*6.8, U*8);
    this.menu.subtext.hide();
    
    this.ttText = createP(`Longitud de las palabras del código:`);
    this.ttText.style('width', `${U*10}px`);
    this.ttText.style('font-family', 'Courier New');
    this.ttText.style('color', '#ffffff');
    this.ttText.style('font-size', `${U*0.4}px`);
    this.ttText.position(21*U, U*12.5);
    this.ttText.hide();
    
    this.ttBox = createInput("3");
    this.ttBox.position(21*U, U*13.5);
    this.ttBox.style('width', `${U*16}px`);
    this.ttBox.style('height', `${U*0.5}px`);
    this.ttBox.hide();
    
    
    this.sText = createP(`Fuente:`);
    this.sText.style('width', `${U*10}px`);
    this.sText.style('font-family', 'Courier New');
    this.sText.style('color', '#ffffff');
    this.sText.style('font-size', `${U*0.4}px`);
    this.sText.position(21*U, U*14);
    
    this.sBox = createInput("a,b,c,d");
    this.sBox.position(21*U, U*15);
    this.sBox.style('width', `${U*16}px`);
    this.sBox.style('height', `${U*0.5}px`);
    
    
    this.exText = createP(`Usar fuente extendida:`);
    this.exText.style('width', `${U*10}px`);
    this.exText.style('font-family', 'Courier New');
    this.exText.style('color', '#ffffff');
    this.exText.style('font-size', `${U*0.4}px`);
    this.exText.position(33*U, U*12.5);
    
    this.exBox = createInput("2");
    this.exBox.position(35*U, U*13.5);
    this.exBox.style('width', `${U*2}px`);
    this.exBox.style('height', `${U*0.5}px`);
    
    this.exButton = createButton('^');
    this.exButton.style('font-family', 'Bold Georgia');
    this.exButton.style('background-color', '#413c42');
    this.exButton.style('border-color', '#413c42');
    this.exButton.style('color', '#ffffff');
    this.exButton.position(37.5*U, 13.5*U);
    this.exButton.style('font-size', `${U/2}px`);
    this.exButton.style('width', `${U*2}px`);
    this.exButton.style('height', `${U*0.7}px`);
    this.exButton.mouseReleased(set_4);
    
    
    this.dText = createP(`Distribución de probabilidad:`);
    this.dText.style('width', `${U*10}px`);
    this.dText.style('font-family', 'Courier New');
    this.dText.style('color', '#ffffff');
    this.dText.style('font-size', `${U*0.4}px`);
    this.dText.position(21*U, U*15.5);
    
    this.dBox = createInput("0.5,0.1,0.2,0.2");
    this.dBox.position(21*U, U*16.5);
    this.dBox.style('width', `${U*16}px`);
    this.dBox.style('height', `${U*0.5}px`);
    
    
    this.aText = createP(`Alfabeto del código:`);
    this.aText.style('width', `${U*10}px`);
    this.aText.style('font-family', 'Courier New');
    this.aText.style('color', '#ffffff');
    this.aText.style('font-size', `${U*0.4}px`);
    this.aText.position(21*U, U*17);
    
    this.aBox = createInput("0,1");
    this.aBox.position(21*U, U*18);
    this.aBox.style('width', `${U*16}px`);
    this.aBox.style('height', `${U*0.5}px`);
    
    this.lpText = createP(`p (GF(pⁿ)ᵏ):`);
    this.lpText.style('width', `${U*10}px`);
    this.lpText.style('font-family', 'Courier New');
    this.lpText.style('color', '#ffffff');
    this.lpText.style('font-size', `${U*0.4}px`);
    this.lpText.position(21*U, U*14);
    this.lpText.hide();
    
    this.lpBox = createInput("2");
    this.lpBox.position(21*U, U*15);
    this.lpBox.style('width', `${U*8}px`);
    this.lpBox.style('height', `${U*0.5}px`);
    this.lpBox.hide();
    
    this.lnText = createP(`n:`);
    this.lnText.style('width', `${U*10}px`);
    this.lnText.style('font-family', 'Courier New');
    this.lnText.style('color', '#ffffff');
    this.lnText.style('font-size', `${U*0.4}px`);
    this.lnText.position(29*U, U*14);
    this.lnText.hide();
    
    this.lnBox = createInput("2");
    this.lnBox.position(29*U, U*15);
    this.lnBox.style('width', `${U*8}px`);
    this.lnBox.style('height', `${U*0.5}px`);
    this.lnBox.hide();
    
    this.lbText = createP(`Base para C:`);
    this.lbText.style('width', `${U*10}px`);
    this.lbText.style('font-family', 'Courier New');
    this.lbText.style('color', '#ffffff');
    this.lbText.style('font-size', `${U*0.4}px`);
    this.lbText.position(21*U, U*15.5);
    this.lbText.hide();
    
    this.lbBox = createInput("A,B,1,B,A;0,1,A,A,0;1,B,A,B,A");
    this.lbBox.position(21*U, U*16.5);
    this.lbBox.style('width', `${U*16}px`);
    this.lbBox.style('height', `${U*0.5}px`);
    this.lbBox.hide();
    
    this.lpoText = createP(`Polinomio irreducible de grado n (expo.:coef.):`);
    this.lpoText.style('width', `${U*16}px`);
    this.lpoText.style('font-family', 'Courier New');
    this.lpoText.style('color', '#ffffff');
    this.lpoText.style('font-size', `${U*0.4}px`);
    this.lpoText.position(21*U, U*17);
    this.lpoText.hide();
    
    this.lpoBox = createInput("0:1,1:1,2:1");
    this.lpoBox.position(21*U, U*18);
    this.lpoBox.style('width', `${U*16}px`);
    this.lpoBox.style('height', `${U*0.5}px`);
    this.lpoBox.hide();
    
    // Option to visualize coclasses
    this.ccButton = createButton('Mostrar coclase de:');
    this.ccButton.style('font-family', 'Bold Georgia');
    this.ccButton.style('background-color', '#413c42');
    this.ccButton.style('border-color', '#413c42');
    this.ccButton.style('color', '#ffffff');
    this.ccButton.position(21*U, U*2.5);
    this.ccButton.style('font-size', `${U*0.4}px`);
    this.ccButton.style('width', `${U*4}px`);
    this.ccButton.style('height', `${U*0.8}px`);
    this.ccButton.mouseReleased(show_coclass);
    this.ccButton.hide();
    
    this.ccBox = createInput("0");
    this.ccBox.position(25*U, U*2.5);
    this.ccBox.style('width', `${U*7.7}px`);
    this.ccBox.style('height', `${U*0.5}px`);
    this.ccBox.hide();
    
    // Option to visualize poly to char map
    this.ppButton = createButton('Polinomios');
    this.ppButton.style('font-family', 'Bold Georgia');
    this.ppButton.style('background-color', '#413c42');
    this.ppButton.style('border-color', '#413c42');
    this.ppButton.style('color', '#ffffff');
    this.ppButton.position(33*U, U*2.5);
    this.ppButton.style('font-size', `${U*0.4}px`);
    this.ppButton.style('width', `${U*4}px`);
    this.ppButton.style('height', `${U*0.8}px`);
    this.ppButton.mouseReleased(show_polys);
    this.ppButton.hide();
  },
  
  setMsgCont() {
    this.algButton = createButton('▶');
    this.algButton.style('font-family', 'Bold Georgia');
    this.algButton.style('background-color', '#413c42');
    this.algButton.style('border-color', '#413c42');
    this.algButton.style('color', '#ffffff');
    this.algButton.position(37.5*U, 15*U);
    this.algButton.style('font-size', `${U}px`);
    this.algButton.style('width', `${U*2}px`);
    this.algButton.style('height', `${U*2}px`);
    this.algButton.mouseReleased(run_alg);
    //this.algButton.hide();
  },
  
  setPicsButton() {
    // Buton for advancing step in algorithm
    this.rButton = createButton('🞂');
    this.rButton.style('font-family', 'Bold Georgia');
    this.rButton.style('background-color', '#413c42');
    this.rButton.style('border-color', '#413c42');
    this.rButton.style('color', '#ffffff');
    this.rButton.position(19*U, 9*U);
    this.rButton.style('font-size', `${U}px`);
    this.rButton.style('width', `${U}px`);
    this.rButton.style('height', `${U*2}px`);
    this.rButton.mouseReleased(nextPic);
    //this.rButton.hide();
    //this.rButton.style('display','initial');
    
    // Buton for returning step in algorithm
    this.lButton = createButton('🞀');
    this.lButton.style('font-family', 'Bold Georgia');
    this.lButton.style('background-color', '#413c42');
    this.lButton.style('border-color', '#413c42');
    this.lButton.style('color', '#ffffff');
    this.lButton.position(0, 9*U);
    this.lButton.style('font-size', `${U}px`);
    this.lButton.style('width', `${U}px`);
    this.lButton.style('height', `${U*2}px`);
    this.lButton.mouseReleased(prevPic);
    
    // Buton for going straight to the last step
    this.tButton = createButton('❭❭');
    this.tButton.style('font-family', 'Bold Georgia');
    this.tButton.style('background-color', '#413c42');
    this.tButton.style('border-color', '#413c42');
    this.tButton.style('color', '#ffffff');
    this.tButton.position(19*U, 12*U);
    this.tButton.style('font-size', `${U}px`);
    this.tButton.style('width', `${U}px`);
    this.tButton.style('height', `${U*2}px`);
    this.tButton.mouseReleased(finalPic);
    
    // Buton for going straight to the first step
    this.iButton = createButton('❬❬');
    this.iButton.style('font-family', 'Bold Georgia');
    this.iButton.style('background-color', '#413c42');
    this.iButton.style('border-color', '#413c42');
    this.iButton.style('color', '#ffffff');
    this.iButton.position(0, 12*U);
    this.iButton.style('font-size', `${U}px`);
    this.iButton.style('width', `${U}px`);
    this.iButton.style('height', `${U*2}px`);
    this.iButton.mouseReleased(initPic);
    
    // Buton for changing node display mode
    this.ndButton = createButton('Aa');
    this.ndButton.style('font-family', 'Bold Georgia');
    this.ndButton.style('background-color', '#413c42');
    this.ndButton.style('border-color', '#413c42');
    this.ndButton.style('color', '#ffffff');
    this.ndButton.position(2*U, 19*U);
    this.ndButton.style('font-size', `${U/2}px`);
    this.ndButton.style('width', `${U}px`);
    this.ndButton.style('height', `${U}px`);
    this.ndButton.mouseReleased(change_node_display_mode);
    
    // huffman
    this.m1Button = createButton('▸ Huffman ◂');
    this.m1Button.style('font-family', 'Bold Georgia');
    this.m1Button.style('background-color', '#413c42');
    this.m1Button.style('border-color', '#413c42');
    this.m1Button.style('color', '#ffffff');
    this.m1Button.position(21*U, U);
    this.m1Button.style('font-size', `${U*0.4}px`);
    this.m1Button.style('width', `${U*4}px`);
    this.m1Button.style('height', `${U}px`);
    this.m1Button.mouseReleased(set_0);
    // huffman
    this.m2Button = createButton('Shannon-Fano');
    this.m2Button.style('font-family', 'Bold Georgia');
    this.m2Button.style('background-color', '#413c42');
    this.m2Button.style('border-color', '#413c42');
    this.m2Button.style('color', '#ffffff');
    this.m2Button.position(25*U, U);
    this.m2Button.style('font-size', `${U*0.4}px`);
    this.m2Button.style('width', `${U*4}px`);
    this.m2Button.style('height', `${U}px`);
    this.m2Button.mouseReleased(set_1);

    // Tunstall
    this.m3Button = createButton('Tunstall');
    this.m3Button.style('font-family', 'Bold Georgia');
    this.m3Button.style('background-color', '#413c42');
    this.m3Button.style('border-color', '#413c42');
    this.m3Button.style('color', '#ffffff');
    this.m3Button.position(29*U, U);
    this.m3Button.style('font-size', `${U*0.4}px`);
    this.m3Button.style('width', `${U*4}px`);
    this.m3Button.style('height', `${U}px`);
    this.m3Button.mouseReleased(set_2);
    // Lineal
    this.m4Button = createButton('Lineal');
    this.m4Button.style('font-family', 'Bold Georgia');
    this.m4Button.style('background-color', '#413c42');
    this.m4Button.style('border-color', '#413c42');
    this.m4Button.style('color', '#ffffff');
    this.m4Button.position(33*U, U);
    this.m4Button.style('font-size', `${U*0.4}px`);
    this.m4Button.style('width', `${U*4}px`);
    this.m4Button.style('height', `${U}px`);
    this.m4Button.mouseReleased(set_3);
    
    
  },
  
  comment(){
    // Empty all containers
    // get msg and colour
    // pause and display
    // set isdisplyingmsg to T
    if (msgList[msgCounter]=='a') {
      GUI.stage = 8;
      return false;
    }
    var msg = msgList[msgCounter];
    var colour = [126, 110, 245];
    var time = msgTime[msgCounter];
    this.msgStartTime = counter;
    this.isPaused = true;
    this.isDisplayingMsg = true;
    this.msg = msg;
    this.msgLen = msg.length;
    this.msgColour = colour;
    this.msgTime = time;
  },
  
  
}

function menuActivation(){
  if(GUI.menu.isActive){
    GUI.menu.hide();
    GUI.menu.isActive = false;
    GUI.isPaused = false;
  }else{
    GUI.isPaused = true;
    GUI.menu.display();
    GUI.menu.isActive = true;
    //GUI.terminate();
    //GUI.waitingToStart = false;
  }
}

function nextPic() {
  if (treePicsId < (treePics.length-1)){
    treePicsId += 1;
  }
}

function prevPic() {
  if (treePicsId > 0){
    treePicsId -= 1;
  }
}

function finalPic() {
  treePicsId = treePics.length - 1;
}

function initPic() {
  treePicsId = 0;
}

function change_node_display_mode() {
  show_probs = (show_probs+1)%2;
  GUI.ndButton.html(show_probs_img[show_probs]);
}



function run_alg(){
  
  if (alg_type == 0){
    treePicsId = 0;
    var source_alf = GUI.sBox.value().replaceAll(" ", "").split(',');
    var source_dp = GUI.dBox.value().replaceAll(" ", "").split(',').map(Number);
    var code_alf = GUI.aBox.value().replaceAll(" ", "").split(',').map(Number);
    
    if (source_alf.length != source_dp.length){
      return 0;
    }
    if (source_alf.length*source_dp.length*code_alf.length == 0){
      return 0;
    }
    var source = new Source(source_alf, 
                            source_dp, 
                            code_alf);
    
    treePics = source.huffman();
    T_text = "HUFFMAN\n\n"+ treePics[treePics.length-1].get_info(1) +"\n"+ source.get_info();
    show_T = true;
    
    
  } else if (alg_type == 1){
    treePicsId = 0;
    var source_alf = GUI.sBox.value().replaceAll(" ", "").split(',');
    var source_dp = GUI.dBox.value().replaceAll(" ", "").split(',').map(Number);
    var code_alf = GUI.aBox.value().replaceAll(" ", "").split(',').map(Number);
    
    if (source_alf.length != source_dp.length){
      return 0;
    }
    if (source_alf.length*source_dp.length*code_alf.length == 0){
      return 0;
    }
    var source = new Source(source_alf, 
                            source_dp, 
                            code_alf);
    
    treePics = source.SF();
    T_text = "SHANNON-FANO\n\n"+treePics[treePics.length-1].get_info(1)+"\n"+ source.get_info();
    show_T = true;
    
  } else if (alg_type == 2){
    treePicsId = 0;
    var source_alf = GUI.sBox.value().replaceAll(" ", "").split(',');
    var source_dp = GUI.dBox.value().replaceAll(" ", "").split(',').map(Number);
    var code_alf = GUI.aBox.value().replaceAll(" ", "").split(',').map(Number);
    var len = parseInt(parseInt(GUI.ttBox.value()));
    
    if (source_alf.length != source_dp.length){
      return 0;
    }
    if (source_alf.length*source_dp.length*code_alf.length == 0){
      return 0;
    }
    var source = new Source(source_alf, 
                            source_dp, 
                            code_alf);
    
    treePics = source.tunstall(n=len);
    if (treePics){
      T_text = "TUNSTALL\n\n"+treePics[treePics.length-1].get_info(1)+"\n"+ source.get_info();
    } else { 
      T_text = "No hay suficientes palabras de longitud "+len+ " con el alfabeto dado para codificar todos los símbolos de la fuente.";
    }
    
    show_T = true;
    
  } else if (alg_type == 3){
    
    var pairs = GUI.lpoBox.value().replaceAll(" ", "").split(',');
    var my_dict = {};
    for (let pre_pair of pairs){
      let pair = pre_pair.split(":");
      my_dict[pair[0]] = parseInt(pair[1]);
    }
    
    var p = parseInt(parseInt(GUI.lpBox.value()));
    var n = parseInt(parseInt(GUI.lnBox.value()));
    var mod = new Polynomial(my_dict, p);//1+x+x2
    
    field = new Field(p,n, mod);
    
    var pre_vectors = GUI.lbBox.value().replaceAll(" ", "").split(';');
    vectors = [];
    for (let pre_vector of pre_vectors){
      vectors.push(new Vector(pre_vector.split(","), field));
    }
    
    
    
    let G = get_G(vectors);
    G_text = M_to_str(G);
    H_text = M_to_str(get_H(G));
    linear_code = get_code(G);
    LN_str = coclass_to_str(linear_code);
    print(LN_str);
    poly_map_str = poly_map_to_str(field);
    
    linear_type_str = "CÓDIGO LINEAL ["+
                      G[0].length+","+
                      G.length+","+
                      linear_code[1].weight+"]";
    show_G = true;
    GUI.ccButton.style('display','initial');
    GUI.ppButton.style('display','initial');
    GUI.ccBox.style('display','initial');
    
  } else if (alg_type == 4){
    treePicsId = 0;
    var source_alf = GUI.sBox.value().replaceAll(" ", "").split(',');
    var source_dp = GUI.dBox.value().replaceAll(" ", "").split(',').map(Number);
    var code_alf = GUI.aBox.value().replaceAll(" ", "").split(',').map(Number);
    var ex = parseInt(GUI.exBox.value().replaceAll(" ", ""));
    
    if (source_alf.length != source_dp.length){
      return 0;
    }
    if (source_alf.length*source_dp.length*code_alf.length == 0){
      return 0;
    }
    var source = new Source(source_alf, 
                            source_dp, 
                            code_alf);
    
    var source_ex = source.extend(ex);   
    source_ex.at_a_time = ex;
    
    treePics = source_ex.huffman();
    T_text = "HUFFMAN CON FUENTE EXTENDIDA\n\n"+treePics[treePics.length-1].get_info(1) +"\n"+ source_ex.get_info();
    show_T = true;
  } else if (alg_type == 5){
    treePicsId = 0;
    var ex = parseInt(GUI.exBox.value().replaceAll(" ", ""));
    var source_alf = GUI.sBox.value().replaceAll(" ", "").split(',');
    var source_dp = GUI.dBox.value().replaceAll(" ", "").split(',').map(Number);
    var code_alf = GUI.aBox.value().replaceAll(" ", "").split(',').map(Number);
    
    if (source_alf.length != source_dp.length){
      return 0;
    }
    if (source_alf.length*source_dp.length*code_alf.length == 0){
      return 0;
    }
    
    var source = new Source(source_alf, 
                            source_dp, 
                            code_alf);
    
    var source_ex = source.extend(ex);   
    source_ex.at_a_time = ex;
    
    treePics = source_ex.SF();
    T_text = "SHANNON FANO CON FUENTE EXTENDIDA\n\n"+treePics[treePics.length-1].get_info(1)+"\n"+ source_ex.get_info();
    show_T = true;
    
  }
}

function set_4() {
  alg_type += 4; // 0 turns 4 (tunstall), 1 turns 5 (Shannon-Fano)
  run_alg();
  alg_type -= 4;
}

function set_0() {
  alg_type = 0;
  show_G = false;
  showing_coclass = false;
  showing_polys = false;
  GUI.m1Button.html("▸ Huffman ◂");
  GUI.m2Button.html("Shannon-Fano");
  GUI.m3Button.html("Tunstall");
  GUI.m4Button.html("Lineal");
  GUI.aText.html("Alfabeto del código:");
  GUI.sBox.style('display','initial');
  GUI.sText.style('display','initial');
  GUI.dBox.style('display','initial');
  GUI.dText.style('display','initial');
  GUI.aBox.style('display','initial');
  GUI.aText.style('display','initial');
  GUI.exBox.style('display','initial');
  GUI.exText.style('display','initial');
  GUI.exButton.style('display','initial');
  GUI.ttBox.hide();
  GUI.ttText.hide();
  GUI.lpBox.hide();
  GUI.lpText.hide();
  GUI.lpoBox.hide();
  GUI.lpoText.hide();
  GUI.lbBox.hide();
  GUI.lbText.hide();
  GUI.lnBox.hide();
  GUI.lnText.hide();
  GUI.ccButton.hide();
  GUI.ppButton.hide();
  GUI.ccBox.hide();
}

function set_1() {
  alg_type = 1;
  show_G = false;
  showing_coclass = false;
  showing_polys = false;
  GUI.m1Button.html("Huffman");
  GUI.m2Button.html("▸ Shannon-Fano ◂");
  GUI.m3Button.html("Tunstall");
  GUI.m4Button.html("Lineal");
  GUI.aText.html("Alfabeto del código:");
  GUI.sBox.style('display','initial');
  GUI.sText.style('display','initial');
  GUI.dBox.style('display','initial');
  GUI.dText.style('display','initial');
  GUI.exBox.style('display','initial');
  GUI.exText.style('display','initial');
  GUI.exButton.style('display','initial');
  GUI.aBox.hide();
  GUI.aText.hide();
  GUI.ttBox.hide();
  GUI.ttText.hide();
  GUI.lpBox.hide();
  GUI.lpText.hide();
  GUI.lpoBox.hide();
  GUI.lpoText.hide();
  GUI.lbBox.hide();
  GUI.lbText.hide();
  GUI.lnBox.hide();
  GUI.lnText.hide();
  GUI.ccButton.hide();
  GUI.ppButton.hide();
  GUI.ccBox.hide();
}

function set_2() {
  alg_type = 2;
  show_G = false;
  showing_coclass = false;
  showing_polys = false;
  GUI.m1Button.html("Huffman");
  GUI.m2Button.html("Shannon-Fano");
  GUI.m3Button.html("▸ Tunstall ◂");
  GUI.m4Button.html("Lineal");
  GUI.aText.html("Alfabeto del analizador:");
  GUI.sBox.style('display','initial');
  GUI.sText.style('display','initial');
  GUI.dBox.style('display','initial');
  GUI.dText.style('display','initial');
  GUI.aBox.style('display','initial');
  GUI.aText.style('display','initial');
  GUI.ttBox.style('display','initial');
  GUI.ttText.style('display','initial');
  GUI.exBox.hide();
  GUI.exText.hide();
  GUI.exButton.hide();
  GUI.lpBox.hide();
  GUI.lpText.hide();
  GUI.lpoBox.hide();
  GUI.lpoText.hide();
  GUI.lbBox.hide();
  GUI.lbText.hide();
  GUI.lnBox.hide();
  GUI.lnText.hide();
  GUI.ccButton.hide();
  GUI.ppButton.hide();
  GUI.ccBox.hide();
}

function set_3() {
  alg_type = 3;
  GUI.m1Button.html("Huffman");
  GUI.m2Button.html("Shannon-Fano");
  GUI.m3Button.html("Tunstall");
  GUI.m4Button.html("▸ Lineal ◂");
  GUI.sBox.hide();
  GUI.sText.hide();
  GUI.dBox.hide();
  GUI.dText.hide();
  GUI.exBox.hide();
  GUI.exText.hide();
  GUI.exButton.hide();
  GUI.aBox.hide();
  GUI.aText.hide();
  GUI.ttBox.hide();
  GUI.ttText.hide();
  GUI.lpBox.style('display','initial');
  GUI.lpText.style('display','initial');
  GUI.lpoBox.style('display','initial');
  GUI.lpoText.style('display','initial');
  GUI.lbBox.style('display','initial');
  GUI.lbText.style('display','initial');
  GUI.lnBox.style('display','initial');
  GUI.lnText.style('display','initial');
  GUI.lpBox.html("2");
  GUI.lnBox.html("2");
  GUI.lbBox.html("1,0,A,B;A,B,A,A;0,0,0,1");
  GUI.lpoBox.html("0:1,1:1,5:4");
}

function show_coclass (){
  showing_polys = false;
  showing_coclass = true;
  cc_yshift = 0;
  
  let z = GUI.ccBox.value().replaceAll(" ", "");
  if (z.length){
    var coclass;
    if (z == "0"){
      coclass = get_coclass(new Vector(Array(vectors[0].length).fill("0"), field), linear_code);
    } else {
      coclass = get_coclass(new Vector(z.split(','), field), linear_code);
    }
    coclass_str = coclass_to_str(coclass);
    print(coclass_str);
  }
}

function show_polys (){
  showing_coclass = false;
  showing_polys = true;
  cc_yshift = 0;
}

function terminateMsg() {
  GUI.isDisplayingMsg = false;
  GUI.msgButton.hide();
  GUI.isPaused = false;
  msgCounter++;
  if (msgBool[msgCounter]) { // If must reproduce next msg, do
    GUI.comment();
  } else { // else continue and prepare next msg
    // this sets readytocommnet to F
    activateStage(GUI.stage);
    msgBool[msgCounter] = true;
    GUI.readyToComment = false;
  }
}

function activateStage(num) {
  if (num == 1) {
    
  }
}


function comment1(){
  let msg = "msg prueba";
    GUI.msgStartTime = counter;
    GUI.isPaused = true;
    GUI.isDisplayingMsg = true;
    GUI.msg = msg;
    GUI.msgLen = msg.length;
    GUI.msgTime = 100;
  }


function paint_tree(tree, f=1.4, t=0){ // f: resizing factor, t:traslation in y
  textFont('Arial');
  for (let root of tree.roots){
    var q = [...root.sub];
    stroke('white');
    fill ('white');
    strokeWeight(3);
    
    // Plot vertices
    while (q.length != 0){
      let node = q.shift();
      let parent = node.parent;
      q.push(...node.sub);

      line(node.x*f*U + U*10 + xshift, 
           node.y*f*U + 2*U + t*U + yshift, 
           parent.x*f*U + U*10 + xshift, 
           parent.y*f*U + 2*U + t*U + yshift);

    }
    noStroke();
  }
  // Plot nodes
  for (let root of tree.roots){
    var q = [...root.sub];

    // Plot root
    fill (dict_col.get(root.type));
    circle(root.x*f*U + U*10 + xshift, 
             root.y*f*U + 2*U + t*U + yshift, 
             U*0.5);
    if (tree.show_p){
      fill ('orange');
      if (show_probs){
        text(Math.trunc(root.p*100)/100,
           root.x*f*U + U*9.825 + xshift, 
           root.y*f*U + U*2.175 + t*U + yshift);
      } else {
        text(root.val,
           root.x*f*U + U*9.825 + xshift, 
           root.y*f*U + U*2.175 + t*U + yshift);
      }
      
    }
    
    while (q.length != 0){
      let node = q.shift();
      let parent = node.parent;
      q.push(...node.sub);


      // Plot nodes
      fill (dict_col.get(node.type));
      circle(node.x*f*U + U*10 + xshift, 
             node.y*f*U + 2*U + t*U + yshift, 
             U*0.5);
      
      // Plot text
      if (tree.show_p){
        fill ('orange');
        if (show_probs) {
          text(Math.trunc(node.p*100)/100,
             node.x*f*U + U*9.825 + xshift, 
             node.y*f*U + U*2.175 + t*U + yshift);
        } else {
          text(node.val,
             node.x*f*U + U*9.825 + xshift, 
             node.y*f*U + U*2.175 + t*U + yshift);
        }
        
        /*text(node.id,
             node.x*f*U + U*9.825, 
             node.y*f*U + U*2.175 + t*U);*/
      }
    }
    noStroke();
  }
  textFont('Courier New');
}


function paint_tree_2(tree, f=1, t=5){
  // Plot edges
  var root = tree.roots[0];
  var q = [...root.sub];
  stroke('white');
  fill ('white');
  strokeWeight(3);
  
  
  while (q.length != 0){
    let node = q.shift();
    let parent = node.parent;
    q.push(...node.sub);
    
    // Plot vertices
    line(node.x2*f*U + U*10 + xshift, 
         node.y2*f*U + 2*U + t*U + yshift, 
         parent.x2*f*U + U*10 + xshift, 
         parent.y2*f*U + 2*U + t*U + yshift);
  }
  noStroke();
  
  // Plot nodes
  root = tree.roots[0];
  q = [...root.sub];
  fill (dict_col.get(root.type));
  
  // Plot root
  circle(root.x2*f*U + U*10 + xshift, 
         root.y2*f*U + 2*U + t*U + yshift, 
         U*0.5);
  
  fill ('orange');
  if (show_probs) {
    text(Math.trunc(root.p*100)/100,
       root.x2*f*U + U*9.825 + xshift, 
       root.y2*f*U + U*2.175 + t*U + yshift);
  } else {
    text(root.val,
       root.x2*f*U + U*9.825 + xshift, 
       root.y2*f*U + U*2.175 + t*U + yshift);
  }
  
  while (q.length != 0){
    let node = q.shift();
    let parent = node.parent;
    q.push(...node.sub);
    
    // Plot nodes
    fill (dict_col.get(node.type));
    circle(node.x2*f*U + U*10 + xshift, 
           node.y2*f*U + 2*U + t*U + yshift, 
           U*0.5);
    
    if (tree.show_p){
      fill ('orange');
      if (show_probs) {
        text(Math.trunc(node.p*100)/100,
           node.x2*f*U + U*9.825 + xshift, 
           node.y2*f*U + U*2.175 + t*U + yshift);
      } else {
        text(node.val,
           node.x2*f*U + U*9.825 + xshift, 
           node.y2*f*U + U*2.175 + t*U + yshift);
      }
      
    }
  }
  noStroke();
}

function get_G(base){
  let rows = base.length;
  if (rows) {
  let cols = base[0].length;
  } else { 
    print("No se ha ingresado base alguna.");
    return [];
  }
  
  // Register as inversions, computed right to left
  let column_permutations = "";
  
  // eliminate zeros under 
  for (let i = 0 ; i < rows ; i++){ //cols
    
    // Find row with pivot
    let pivot_row = i;
    let piv_i = i;
    while (piv_i < rows && base[piv_i].x[i] == "0"){
      piv_i += 1;
    }
    if (i != piv_i){ 
      // If pivot was found swap rows
      if (piv_i < rows){
        let temporal_row = base[i];
        base[i] = base[piv_i];
        base[piv_i] = temporal_row;
      } else {
        // Otherwise swaping columns is necessary
        // Find column with pivot
        let pivot_col = i;
        let piv_j = i;
        while (piv_j < cols && base[i].x[piv_j] == "0"){
          piv_j += 1;
        }
        if (piv_j < cols) {
          // Swap columns
          column_permutations = "(" + (i+1) +
                                " "+ (piv_j+1) + ")" + 
                                column_permutations;
          
          for (let k = 0 ; k<rows ; k++){
            let temporal = base[k].x[i];
            base[k].x[i] = base[k].x[piv_j];
            base[k].x[piv_j] = temporal;
          }
        } else {
          print("Los vectores no son linearmente independientes.");
          return [];
        }
      }
      
    }
    
    
    for (let j = i+1 ; j < rows ; j++){ //rows
      
      
      let a;
      for (const [k, value] of Object.entries( base[0].field.prod_table[base[i].x[i]]) ) {
        if (value == "1"){
          a = k;
        }
      }
      base[j] = base[j].minus(base[i].prod(base[j].x[i]).prod(a));
      
    }
    
  }
  print(column_permutations);
  
  // eliminate zeros over (if pivots exist)
  for (let i = 1 ; i < rows ; i++){ //cols
    for (let j = 0 ; j < i ; j++){ //rows
      
      let a;
      for (const [k, value] of Object.entries( base[0].field.prod_table[base[i].x[i]]) ) {
        if (value == "1"){
          a = k;
        }
      }
      base[j] = base[j].minus(base[i].prod(base[j].x[i]).prod(a));
      
    }
  }
  
  // Set diagonal to 1's
  for (let i = 0 ; i < rows ; i++){ 
    
    if (base[i].x[i] != "1"){
      // Find product inverse
      let a;
      for (const [k, value] of Object.entries( base[0].field.prod_table[base[i].x[i]]) ) {
        if (value == "1"){
          a = k;
        }
      }
      base[i] = base[i].prod(a);
    }
    
      
  }
  
  return(base);
}

function get_H(G) {
  let n = G[0].length;
  let m = G.length;
  let n_m = n-m;
  var H = Array(n_m).fill().map(()=>Array(n).fill("0"))
  
  // Create -P^T
  for (let i = 0 ; i < m ; i++){
    for (let j = m ; j < n ; j++){
      let p_ij = G[i].x[j];
      H[j-m][i] = G[0].field.inverse_table[p_ij];
    }
  }
  
  // Complete with identity matrix
  for (let i = 0 ; i < n_m ; i++){
    for (let j = m ; j < n ; j++){
      if (i == j-m){
        H[i][j] = "1";
      }
    }
  }
  
  // Turn rows to Vector objects
  for (let i = 0 ; i < n_m ; i++){
    H[i] = new Vector(H[i], G[0].field);
  } 
  return H;
  
}

function get_code(base) {
  // Returns coclass of null vector
  var symbols = Object.keys(base[0].field.inverse_table);
  var m = base.length;
  var n = base[0].length;
  
  // Get all combinations of k elements of the field
  // with k the number of vectors in base
  var pre_q = [...(symbols.map(x=>[x]))];
  var post_q = [];
  for (let i = 1 ; i<m ; i++){
    while (pre_q.length){
      let pre_combination = pre_q.pop();
      for (let symbol of symbols) {
        let new_combination = [...pre_combination];
        new_combination.push(symbol);
        post_q.push(new_combination);
      }
    }
    pre_q = post_q;
    post_q = [];
  }
  
  let result = [];
  // Compute vectors in the code
  for (let linear_combination of pre_q) {
    let result_vect = new Vector(Array(n).fill("0"), base[0].field);
    for (let i = 0 ; i<m ; i++){
      result_vect = result_vect.plus(base[i].prod(linear_combination[i]));
    }
    result.push(result_vect);
  }
  return result.sort((x,y)=>x.weight-y.weight);
}

function get_coclass(z, code) {
  // returns coclass of vector z
  
  var result = [];
  for (let code_word of code) {
    result.push(z.plus(code_word));
  }
  return result.sort((x,y)=>x.weight-y.weight);
  
}

function coclass_to_str(coclass) {
  result = "";
  for (let i = 0; i<coclass.length ; i++){
    result = result +"("+ coclass[i].x.toString() + ") ";
  }
  return result;
}

function poly_map_to_str(field){
  let str_list = Object.keys(field.pol_to_char).map(x => x.toString() + " ↦ " + field.pol_to_char[x]);
  return str_list.join("\n");
}


function M_to_str(G) {
  let rows = G.length;
  var mat = "";
  for (let i = 0 ; i < rows ; i++){
    for (let j = 0 ; j < G[0].length ; j++){
      mat += G[i].x[j];
      if (G[0].length-1 == j && rows-1 != i){
        mat += "\n"
      }
    }
  }
  return mat
}

var example = 15;

function setup() {
  if (example < 2){
    var source_1 = new Source(["A","B","C","D", "E", "F", "G"], 
                              [0.05,0.1,0.15,0.27,0.2,0.2, 0.03], 
                              [0,1,2,4,5]);
    s1_h_tree = source_1.huffman();
    s1_h_tree.get_info(1);

    s1_SF_tree = source_1.SF();
    s1_SF_tree.get_info(1);
    
    s1_t_tree = source_1.tunstall(n=2);
    s1_t_tree.get_info(1);

    source_1.get_info();
  } else if (example == 2){
    var source_1 = new Source(["A","B","C","D", "E", "F", "G"], 
                            [1/7,1/7,1/7,1/7,1/7,1/7, 1/7], 
                            [0,1,2,3,4,5,6]);
    s1_h_tree = source_1.huffman();
    s1_h_tree.get_info(1);

    s1_SF_tree = source_1.SF();
    s1_SF_tree.get_info(1);
    
    source_1.get_info();
  } else if (example == 3) {
    print("Fuente 2:\n");
    var source_2 = new Source(["a","b","c","d", "e"], 
                            [13/55,8/55,12/55,11/55,11/55], 
                            [0,1]);
    s2_t_tree = source_2.tunstall(n=4);
    s2_t_tree.get_info(1);
    
    source_2.get_info();
  } else if (example == 8) {
    print("Fuente 2:\n");
    var source_2 = new Source(["a","b","c","d", "e"], 
                            [13/55,8/55,12/55,11/55,11/55], 
                            [0,1,2]);
                              
    var source_2_ex = source_2.extend(2);   
    
    
    treePics = source_2_ex.huffman();
  } else if (example == 9) {
    print("Fuente 2:\n");
    var source_2 = new Source(["a","b","c","d", "e"], 
                            [13/55,8/55,12/55,11/55,11/55], 
                            [0,1,2]);
                              
    var source_2_ex = source_2.extend(2);   
    
    
    treePics = source_2_ex.SF();
  } else if (example == 10) {
    print("Fuente 2:\n");
    var source_2 = new Source(["a","b","c","d", "e"], 
                            [13/55,8/55,12/55,11/55,11/55], 
                            [0,1,2]);
    source_2 = new Source(["A","B","C","D", "E", "F", "G"], 
                              [0.05,0.1,0.15,0.27,0.2,0.2, 0.03], 
                              [0,1,2,4,5]);
                              
    var source_2_ex = source_2.extend(2);   
    
    
    treePics = source_2.tunstall(n=2);
  } else if (example == 11) {
    var p1 = new Polynomial({0:1,1:1,2:1,4:1,5:1,6:1},2);
    var p2 = new Polynomial({1:1,5:1},2);
    print(p2.times(p1).mod(p1).to_str());
    print(p2.to_str());
    var p3 = new Polynomial({0:1,1:1,2:1},2);
    var opo = new Field(2,2,p3);
  } else if (example == 12) {
    var p3 = new Polynomial({0:1,1:1,2:1},2);//1+x+x2
    var opo = new Field(2,2,p3);
    let a = new Vector(["A","1","1","B","A","1","A"], opo);
    let b = new Vector(["A","B","A","1","1","1","B"], opo);
    let c = new Vector(["1","B","A","B","A","A","B"], opo);
    let my_base = [a,b,c];
    
    let G = get_G(my_base);
    print(M_to_str(G));
    
  } else if (example == 14) {
    print("Comparacion fuente 2 extendida:\n Fuente 2:");
    var source_2 = new Source(["a","b","c","d", "e"], 
                            [13/55,8/55,12/55,11/55,11/55], 
                            [0,1]);
    s2_h_tree = source_2.huffman();
    s2_h_tree.get_info(1);

    s2_SF_tree = source_2.SF();
    s2_SF_tree.get_info(1);
    
    source_2.get_info();
    
    // Extend
    print("\nFuente 2 extendida:\n");
    var source_2_ex = source_2.extend(2);
    
    s2x_h_tree = source_2_ex.huffman();
    s2x_h_tree.get_info(2);

    s2x_SF_tree = source_2_ex.SF();
    s2x_SF_tree.get_info(2);
    
    source_2_ex.get_info();
    
    copied = s2x_h_tree.deep_copy();
    copied.set_coords();
  }
  
  
  
  H = Math.min(windowWidth,windowHeight, 658);
  U = H/20;
  Ut10 = U*10;
  Usqr = U*U;
  H43 = U*23;
  H2 = H*2;
  H_U = H-U;
  H_2U =H-2*U;
  H_2U3 = H_2U/3;
  H_2U23 = H_2U*2/3;
  U5 = U/5;
  LIFELEN = H_2U3-U;
  
  frameRate(FR);
  createCanvas(H2, H);
  
  GUI.setMenu();
  GUI.setMsgCont();
  GUI.setPicsButton();
  
  noStroke();
  background(255);
  image(imgNow, 0, 0);
  
  GUI.comment();
}

function draw() {
  image(imgNow, 0, 0);
  counter++;
  
  // Check if coursor is moving the tree
  
  
  if (example==1){
    paint_tree(s1_h_tree);
    paint_tree(s1_SF_tree, 1.4,6);
  } else if (example==1.5){
    paint_tree_2(s1_t_tree);
  } else if (example==2){
    paint_tree(s1_h_tree);
    paint_tree(s1_SF_tree, 1.4,6);
  } else if (example==3){
    paint_tree_2(s2_t_tree);
  } else if (example==4){
    paint_tree(s2_h_tree);
    paint_tree(s2_SF_tree, 1.4,6);
  } else if (example==4.5){
    textSize(U/4);
    //paint_tree(s2x_h_tree, 0.7,2);
    paint_tree(copied, 0.7, 2);
    textSize(U/2);
  } else if (example == 8){
    //paint_tree(treePic[Math.trunc(counter/30)%48], 0.7, 2);
    paint_tree(treePics[treePicsId], 0.7, 2);
  } else if (example == 9){
    paint_tree(treePics[treePicsId], tree_size, 6);
  } else if (example == 10){
    treePics[treePicsId].set_coords();
    paint_tree_2(treePics[treePicsId], tree_size, 6);
  }
  
  if (treePics.length){
    if (treePics[0].type == 2){
      paint_tree_2(treePics[treePicsId], tree_size, 6);
    } else{
      paint_tree(treePics[treePicsId], tree_size, 6);
    }
  }
  
  

  
  
  
  if(showing_coclass){
    
    if (mouse_pressed && max(Math.abs(mouseX-Ut10), Math.abs(mouseY-Ut10)) < U*9){
      cc_yshift -= (mouseY - Ut10)**3*0.0002/Ut10;
    }
    
    fill(0,100);
    rect(0,0,H,H);
    filter(BLUR, 3);
    
    textFont('Courier New');
    textSize(U/2);
    fill(255);
    text(coclass_str,
           U,
           U+cc_yshift,
           H_U,
           H*10+cc_yshift);
  } else if (showing_polys){
    if (mouse_pressed && max(Math.abs(mouseX-Ut10), Math.abs(mouseY-Ut10)) < U*9){
      cc_yshift -= (mouseY - Ut10)**3*0.0002/Ut10;
    }
    
    fill(0,100);
    rect(0,0,H,H);
    filter(BLUR, 3);
    
    textFont('Courier New');
    textSize(U/2);
    fill(255);
    text(poly_map_str,
           U,
           U+cc_yshift,
           H_U,
           H*10+cc_yshift);
  } else {
    if (mouse_pressed && max(Math.abs(mouseX-Ut10), Math.abs(mouseY-Ut10)) < U*9){
      xshift -= (mouseX - Ut10)**3*0.0002/Ut10;
      yshift -= (mouseY - Ut10)**3*0.0002/Ut10;
    } 
    if (keyIsDown(DOWN_ARROW) === true) {
      tree_size -= 0.01;
    }
    if (keyIsDown(UP_ARROW) === true) {
      tree_size += 0.01;
    }
  }
  
  //Frame the GUI
  fill(40, 36, 41);
  rect(0,0,H43,U);   //up
  rect(0,H_U,H43,U); //down
  rect(0,0,U,H);     //left
  rect(H_U,0,H2,H);   //right
  
  
  
  
  if (show_G){
    textFont('Courier New');
    textSize(U/2);
    fill(255);
    text(linear_type_str,
           21*U,
           4.5*U,
           18*U,
           10*U);
    text("G = ",
           21*U,
           6.5*U,
           18*U,
           12*U);
    text(G_text,
           22*U,
           6*U,
           18*U,
           12*U);
    
    text("H = ",
           30*U,
           6.5*U,
           18*U,
           12*U);
    text(H_text,
           31*U,
           6*U,
           18*U,
           12*U);
    
  } else if (show_T){
    textFont('Courier New');
    textSize(U/2);
    fill(255);
    text(T_text,
           21*U,
           4*U,
           18*U,
           10*U);
  }
  
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    prevPic();
  } else if (keyCode === RIGHT_ARROW) {
    nextPic();
  }
}

function keyReleased() {
  if (keyCode === 32) {
    
  }
}


function touchMoved() {
  // do some stuff
  return false;
}

function mouseReleased() {
  mouse_pressed = false;
}

function mousePressed() {
  mouse_pressed = true;
}

function mouseWheel(event) {
  if (event.delta > 0) {
    tree_size -= 0.01;
  } else {
    tree_size += 0.01;
  }
  // Uncomment to prevent any default behavior.
  return false;
}