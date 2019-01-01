"use strict";

class Hit{
    constructor(Shape, Origin, t, rDirection){
        this.Shape = Shape;
        this.t = t;
        this.p = vec3.scaleAndAdd(Origin, rDirection, t);
        this.n = null;
        this.calculateNormal();
    }

    calculateNormal(){
        switch(this.Shape.tipus) {
            case "pla":
                this.n = this.Shape.normal;
                break;
            case "esfera":
                this.calculateNormalSphere();
                break;
            case "triangle":
                this.calculateNormalTriangle();
                break;
            default:
                  // code block
        }
    }

    calculateNormalSphere(){
        let pSUBc = vec3.subtract(this.p, this.Shape.centre);
        this.n = vec3.scale(pSUBc, 1/this.Shape.radi);
    }

    calculateNormalTriangle(){
        let u = vec3.subtract(this.Shape.v1, this.Shape.v0);
        let v = vec3.subtract(this.Shape.v2, this.Shape.v0);
        this.n = vec3.normalize(vec3.cross(u,v));
    }

} 