var shaderDefinition = {
    attributes:{
        /* nombreDelAtributoDentroDelShader : TipoDelAtributo para gestionarlo internamente
        y poner al aPosition como atributo para la posicion de los bufferes
        */
        aPosition : Sepinaco.SEMANTIC_POSITION,
        aUv0: Sepinaco.SEMANTIC_TEXTCOORD0
    },
    uniforms:{
        //no puedo hacer esto puesto que ya tengo una clase que maneja las matrices
        uPMatrix : mat4.create(),
        //Con esto internamente podría relacionar ese atributo con el atributo PMatrix de mi clase mvpMatrix
        //Tendria que convertir la clase mvpMatrix en un singletone
        uPMatrix : Sepinaco.SEMANTIC_UPMATRIX,
        //Pero utilizando el mecanismo de arriba ¿Que hago para los uniforms que me invento en el shader?
        //Puedo usar lo siguiente, pero en ningun lugar le estoy indicando el VALUE que tendra ese atributo
        //en el shader y en mi codigo no se le da valor en ninguna parte a diferencia de lo que ocurre con
        //uPMatrix que si se le va dando valor
        uLightingDirection : Sepinaco.SEMANTIC_OTHER,
        //Para este caso veo una solucion crear una clase llamada ShaderVariableUniform
        uLightingDirection : ShaderVariableUniform(Sepinaco.SEMANTIC_OTHER,value)
    }
}

function ShaderVariableUniform(type,value){
    //Si el type es UPMATRIX o alguno que no sea SEMANTIC_OTHER realizaria lo correspondiente
    //para unirlo con el atributo pMatrix de la clase mvpMatrix
        this.type = type;
        this.value = value;
}

//Esta funcion no admite redefinicion
ShaderVariableUniform.prototype.updateValue = function () {
    this.beforeUpdateValue();
    //Por el tipo del value podria saber si utilizar gl.uniform3fv, gl.uniform2fv...
    gl.uniform3fv(shaderProgram.lightingDirectionUniform,this.value);
}

//Esta funcion admite redefinicion
ShaderVariableUniform.prototype.beforeUpdateValue = function (){
    //Funcion que de primeras se encuentra vacia, pero si lo necesitamos podemos redefinirla para
    //poner codigo especifico antes de insertar el value en el shader, ejemplo:
    var adjustedLD = vec3.create();
    vec3.normalize(this.value,adjustedLD);
    vec3.scale(adjustedLD, -1);
    //Finalmente se modifica el this.value para que ese valor sea el que entregamos al shader
    //en el updateValue
    this.value = adjustedLD;
}