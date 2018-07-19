/**
 * Created by stl on 14-7-22.
 */

var mcanvas = {

    //全局画笔
    systemPaint:null,

    //时间画笔
    eventPaint:null,
    note:new Array(),
    init:function(width,height){
        var contain = document.getElementById("logic");
        var systemCanvas=this.createCanvas(width,height);
        systemCanvas.id = "systemCanvas";
        systemCanvas.style.border = "1px solid red";
        this.bindEvent(systemCanvas);
        contain.appendChild(systemCanvas);

        var eventCanvas = this.createCanvas(width,height);
        eventCanvas.id = "eventCanvas";
        eventCanvas.style.display = "none";
        contain.appendChild(eventCanvas);

        systemPaint = systemCanvas.getContext("2d");
        eventPaint = eventCanvas.getContext("2d");
    },
    createCanvas:function(width,height){
        var canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height= height;
        canvas.style.width = width+"px";
        canvas.style.height = height +"px";
        return canvas;
    },
    bindEvent:function(canvas){
        canvas.onclick = this.notifyOnclickListener;
    },

    /**
     * 获取元素坐标
     */
    getposition : function (e){
        var e = event ||window.event;
        var x = e.clientX;
        var y = e.clientY;
        return MCpoint(x,y);
    },

    /**
     * 遍历数组
     */
    each : function(callback,note){
        var length = note.length;
        if(length<0){
            console.log("没有找到图形");
        }
        for(var i=0;i<length;i++){
            var tem;
            tem = note[i];
            var result = callback(tem);
            if(result){
                return tem;
                break;
            }
        }
    },
    /**
     * 获取元素
     */
    getEleByPosition :function(event){
        var position = mcanvas.getposition(event);
        var ele = mcanvas.each(function (shape){
            var shape = shape;
            var isInShape = shape.isPointInShape(eventPaint,position);
            if(isInShape){
                return true
            }else{
                return false;
            }},mcanvas.note);
        if(ele){;
            return ele;
        }
    },
    notifyOnclickListener:function(){
        var ele = mcanvas.getEleByPosition(event);
        if(ele){
            console.log("你选中了图形");
        }else{
            console.log("没有选中图形");
        }
    }
}
function MCpoint(x,y){
    this.x= x;
    this.y = y;
    return {x:this.x,y:this.y}
}

function MCshape(){
    this.ondraw = function(){
        this.draw(systemPaint);
    }
}

function MCRect(point,width,height){
    MCshape.call(this);
    this.point = point;
    this.width = width;
    this.height = height;

    this.draw = function (paint){
        paint.rect(this.point.x,this.point.y,this.width,this.height);
        paint.stroke();
    }
    this.isPointInShape = function(paint,eventPoint){
        var flag = false;
        paint.rect(this.point.x,this.point.y,this.width,this.height);
        paint.stroke();
        flag = paint.isPointInPath(eventPoint.x,eventPoint.y);
        if(flag){
            console.log("您点击了矩形");
            return flag;
        }
    }
    this.ondraw();
}

function MCCircle(point,radius){
    MCshape.call(this);
    this.point = point;
    this.radius = radius;
    this.draw = function(paint){
        paint.beginPath();
        paint.arc(this.point.x,this.point.y,this.radius,0,Math.PI*2,true);
        paint.closePath();
        paint.stroke()
    }
    this.isPointInShape = function(paint,eventPoint){
        var flag = false;
        paint.beginPath();
        paint.arc(this.point.x,this.point.y,this.radius,0,Math.PI*2,true);
        flag = paint.isPointInPath(eventPoint.x,eventPoint.y);
        paint.stroke();
        if(flag){
            console.log("您点击了圆形");
            return flag;
        }
    }
    this.ondraw();
}

function main(){
    mcanvas.init(1000,600);
    var shape1 = new MCRect(new MCpoint(20,20),150,100);
    mcanvas.note.push(shape1);
    var shape2 = new MCCircle(new MCpoint(200,200),30);
    mcanvas.note.push(shape2);
}



