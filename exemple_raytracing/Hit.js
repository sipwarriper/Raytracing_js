"use strict";

class Hit{
    constructor(Shape, Origin, t, rDirection){
        this.Shape = Shape;
        this.t = t;
        this.p = null;
        this.n = null;
        this.p = vec3.scaleAndAdd(Origin, rDirection, this.t);
        this.calculateNormal();
    }

    calculateNormal(){
        switch(this.Shape.tipus) {
            case "pla":
                this.calculateNormalPlane();
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

    // calculateHitPoint(Origin, rDirection){
    //     switch(this.Shape.tipus) {
    //         case "triangle":
    //             let temp = vec3.scaleAndAdd(this.Shape.v0, this.Shape.u, this.s);
    //             this.p = vec3.scaleAndAdd(temp, this.Shape.v, this.t);
    //             break;
    //         default:
    //             this.p = vec3.scaleAndAdd(Origin, rDirection, this.t);
    //             break;
    //     }
    // }

    calculateNormalPlane(){
        let normal = this.Shape.normal;
        let trans = mat4.create();
        trans = mat4.translate(trans, trans, this.p);
        this.n = vec3.transformMat4(normal, trans);        
    }

    calculateNormalSphere(){
        let pSUBc = vec3.subtract(this.p, this.Shape.centre);
        this.n = vec3.scale(pSUBc, 1/this.Shape.radi);
    }

    calculateNormalTriangle(){
        let u = this.Shape.u;
        let v = this.Shape.v;
        let normal = vec3.normalize(vec3.cross(u,v));
        let trans = mat4.create();
        trans = mat4.translate(trans, trans, this.p);
        this.n = vec3.transformMat4(normal, trans);
    }

} 