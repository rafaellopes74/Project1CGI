import * as UTILS from '../../libs/utils.js';
import * as MV from '../../libs/MV.js';
import { vec2, flatten } from "../../libs/MV.js";

/** @type {WebGLRenderingContext} */
let gl;
const table_width = 3.0;
let table_height;
const grid_spacing = 0.05; 
var program;
var aBuffer;
var vertices = [];
var tw; 
var th;

function animate(time)
{
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    gl.uniform1f(tw, table_width);
    gl.uniform1f(th, table_height);
    gl.bindBuffer(gl.ARRAY_BUFFER, aBuffer);
    gl.drawArrays(gl.POINTS,0, vertices.length);
}

function setup(shaders)
{

    const canvas = document.getElementById("gl-canvas");
    gl = UTILS.setupWebGL(canvas);

    program = UTILS.buildProgramFromSources(gl, shaders["shader1.vert"], shaders["shader1.frag"]);
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    table_height = table_width * (canvas.height/canvas.width);

    window.addEventListener("resize", function (event) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        table_height = table_width * (canvas.width/canvas.height);
        gl.viewport(0, 0, canvas.width, canvas.height);
        
    });
    
    canvas.addEventListener("click", function(event) {
        // Start by getting x and y coordinates inside the canvas element
        const x = event.offsetX;
        const y = event.offsetY;
        
        console.log("Click at (" + x + ", " + y + ")");
    });

    for(let x = -(table_width/2); x <= (table_width/2) ; x += grid_spacing) {
        for(let y = -(table_height/2); y <= (table_height/2); y += grid_spacing) {
            vertices.push(MV.vec2(x, y));
        }
    }

    aBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, aBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    const vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    
    tw = gl.getUniformLocation(program, "table_width");
    th = gl.getUniformLocation(program, "table_height");

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    
    window.requestAnimationFrame(animate);
}

UTILS.loadShadersFromURLS(["shader1.vert", "shader1.frag"]).then(s => setup(s));
