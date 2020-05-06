
// Helper function adds 'text' into a file and downloads it with the
// given filename
function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

// Generates the buildScene.c file
function exportFile() {
  let dw, dh, rat;
  let wtop, wbottom, wleft, wright;
  
  // Compute the boundaries based on the aspect ratio.
  if (height > width) {
    wleft = -2.0; 
    wright = 2.0; 
    dw = 4.0;

    wtop = (height/width) * -2.0;
    wbottom = (height/width) * 2.0;
    dh = wbottom*2;

  } else {
    wtop = -2.0; 
    wbottom = 2.0;
    dh = 4.0;

    wleft = (width/height) * -2.0;
    wright = (width/height) * 2.0;
    dw = wright*2;
  }

  // Ratio to scale everything from pixel-space to A1-coords.
  rat = dw/width;

  // Build up the file...
  txt =  "";
  txt += `#define W_TOP ` + wtop.toFixed(2) + '\n';
  txt += `#define W_BOTTOM ` + wbottom.toFixed(2) + '\n';
  txt += `#define W_LEFT ` + wleft.toFixed(2) + '\n';
  txt += `#define W_RIGHT ` + wright.toFixed(2) + '\n';
  txt += `\n`
  txt += `void buildWalls(void) {\n`
  txt += `  struct point2D p,d;\n`
  txt += `  p.px=W_LEFT;\n`
  txt += `  p.py=W_TOP;\n`
  txt += `  d.px=W_RIGHT-W_LEFT;\n`
  txt += `  d.py=0;\n`
  txt += `  walls[0].w.p=p;\n`
  txt += `  walls[0].w.d=d;\n`
  txt += `  walls[0].material_type=1;\n`
  txt += `\n`
  txt += `  p.px=W_RIGHT;\n`
  txt += `  p.py=W_TOP;\n`
  txt += `  d.px=0;\n`
  txt += `  d.py=W_BOTTOM-W_TOP;\n`
  txt += `  walls[1].w.p=p;\n`
  txt += `  walls[1].w.d=d;\n`
  txt += `  walls[1].material_type=1;\n`
  txt += `\n`
  txt += `  p.px=W_RIGHT;\n`
  txt += `  p.py=W_BOTTOM;\n`
  txt += `  d.px=W_LEFT-W_RIGHT;\n`
  txt += `  d.py=0;\n`
  txt += `  walls[2].w.p=p;\n`
  txt += `  walls[2].w.d=d;\n`
  txt += `  walls[2].material_type=1;\n`
  txt += `\n`
  txt += `  p.px=W_LEFT;\n`
  txt += `  p.py=W_BOTTOM;\n`
  txt += `  d.px=0;\n`
  txt += `  d.py=W_TOP-W_BOTTOM;\n`
  txt += `  walls[3].w.p=p;\n`
  txt += `  walls[3].w.d=d;\n`
  txt += `  walls[3].material_type=1;\n`
  txt += `}\n`
  txt += `\n`
  txt += `void buildScene(void) {\n`
  txt += `  struct point2D c,p,d;\n`
  txt += `  struct ray2D l;\n`
  txt += `\n`

  // Scale and add the circles
  for (circ of CIRCLES) {
    let cx = rat*circ.x + wleft;   
    let cy = rat*circ.y + wtop;
    let wr = rat*circ.r;   
    txt += `  c.px=`+cx.toFixed(4) + ';\n';
    txt += `  c.py=`+cy.toFixed(4) + ';\n';
    txt += `  addCirc(&c,`+wr.toFixed(4)+','+circ.m+','+circ.i+');\n'
    txt += `\n`
  }

  // Set up the light source
  let pcx = rat*LIGHT.x + wleft;
  let pcy = rat*LIGHT.y + wtop;
  let dcx = sin(LIGHT.a);
  let dcy = cos(LIGHT.a);
  
  txt += `  p.px=`+pcx.toFixed(4)+`;\n`;
  txt += `  p.py=`+pcy.toFixed(4)+`;\n`;
  txt += `  d.px=`+dcx.toFixed(4)+`;\n`;
  txt += `  d.py=`+dcy.toFixed(4)+`;\n`;
  txt += `  normalize(&d);\n`;
  txt += `  l.p=p;\n`
  txt += `  l.d=d;\n`
  txt += `  lightsource.l=l;\n`
  txt += `  lightsource.light_type=1;\n` 
  txt += `  lightsource.R=1.0;\n`	
  txt += `  lightsource.G=1.0;\n`
  txt += `  lightsource.B=1.0;\n`
  txt += `}\n`

  download('buildScene.c',txt);
}