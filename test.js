/**
 * Created by stl on 14-3-5.
 */
/**
 * 变量集合
 * @type {{}}
 */
var MCanvas = {
    /**
     * 全局画笔
     */
    systemPaint : null,
    /**
     * 时间画笔
     */
    eventPaint : null,
    /**
     * 图元集合
     */
    rootNodes : new Array(),


    /**
     * 初始化画布
     * @param eve
     * @param width
     * @param height
     */
    initPaint : function (eve , width ,height){
        var contain = document.getElementById(eve);
        if(!contain){
            alert("初始化失败，容器不存在");
        }
        var systemCanvas= MCanvas.createPaint(width , height);
        systemCanvas.id = "systemCanvas";
        contain.appendChild(systemCanvas);
        MCanvas.systemPaint = systemCanvas.getContext("2d");

        var eventCanvas= this.createPaint(width , height);
        eventCanvas.id = "eventCanvas";
        eventCanvas.style.display = "none";
        contain.appendChild(eventCanvas);
        MCanvas.eventPaint = eventCanvas.getContext("2d");


        systemCanvas.onclick = this.notifyOnclickListener;
        systemCanvas.onmousedown = this.notifyOnmousedownListener;
        systemCanvas.onmouseover = this.notifyOnmouseoverListener;
        systemCanvas.onmouseout = this.notifyOnmouseListener;
        systemCanvas.onmouseup = this.notifyOnmoussupListener;
        systemCanvas.onmousemove = this.notifyOnmouseupListener;

    },
    createPaint : function(width , height){
        var canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        canvas.style.width = width;
        canvas.style.height = height;
        canvas.style.border = "1px solid red";
        return canvas;

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
     * 获取元素坐标
     */
     getposition : function (e){
        var e = event ||window.event;
        var x = e.clientX;
        var y = e.clientY;
        return MCpoint(x,y);
    },

    /**
     * 获取元素
     */
     getEleByPosition :function(){
        var position = MCanvas.getposition(event);
        var ele = MCanvas.each(function (shape){
                var shape = shape;
                var isInShape = shape.isPointInShape(MCanvas.eventPaint,position);
                if(isInShape){
                    return true
                }else{
                    return false;
                }},MCanvas.rootNodes);
        if(ele){
            console.log("选中了图形");
            return ele;
        }
    },

    notifyOnclickListener : function(){
        var ele = MCanvas.getEleByPosition();

        if(ele){
            console.log("您点击了");
        }else{
            console.log("您没有选中任何图形");
        }
    },

    notifyOnmousedownListener : function(){},
    notifyOnmouseoverListener : function(){},
    notifyOnmouseoutListener : function(){},
    notifyOnmoussupListener : function(){},
    otifyOnmouseupListener : function(){}
}

/**
 *定义坐标原点
 */
function MCpoint(x,y){
    this.x = x;
    this.y=y;
    return {x:this.x,y:this.y}
}

 function MCshape(orignPoint){

     this.MCpoint = orignPoint;
     /*****事件列表********/
     //鼠标点击事件
     this.onClick = null;
     //鼠标弹起事件

     //子节点
     this.nodes = new Array();
     this.onMouseUp = null;
     this.onMouseDown = null;
     this.onMouseMove = null;
     this.onMouseOver = null;
     this.onMouseOut = null;

     this.add = function (data){
         this.nodes.push(data);
     }

     /**
      * 鼠标点击监听事件
      */
     this.onclickListener = function (){
         if(this.onclick){
             this.onclick();
         }
     };

     /**
      * 鼠标弹起监听事件
      */
     this.onMouseUpListener = function (){
         if(onMouseUp){
             this.onMouseUp();
         }
     };

     /**
      * 鼠标按下监听事件
      */
     this.onMouseDownListener = function (){
         if(this.onMouseDown){
             this.onMouseDown();
         }
     };
     /**
      * 清楚画布
      */
     this.clearAll = function(paint){
         paint.clearRect(0,0,1000,1000);
     },
     /**
      * 鼠标移动监听事件
      */
     this.onMouseMoveListener = function (){
         if(this.onMouseMove){
             this.onMouseMove();
         }
     };

     /**
      * 鼠标悬浮监听事件
      */
     this.onMouseOverListener = function (){
         if(this.onMouseOver){
             this.onMouseOver();
         }
     };

     /**
      * 鼠标移出监听事件
      */
     this.onMouseOutListener = function (){
         if(this.onMouseOver){
             this.onMouseOver();
         }
     };

     /**
      * 绘制矩形
      */
     this.draw  =function (paint){
     },

     /**
      * 绘制阴影
      */
      this.onEventDraw = function(point){
          this.eventDraw(MCanvas.eventPaint,point);
      },

     /**
      * 重绘
      * 需要重载
      */
     this.ondraw = function (){
             this.draw(MCanvas.systemPaint);
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
        this.clearAll(paint);
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
        this.clearAll(paint);
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
    MCanvas.initPaint("logic",1000,600);

    var shape1 = new MCRect(new MCpoint(20,20),150,100);
    MCanvas.rootNodes.push(shape1);
    var shape2 = new MCCircle(new MCpoint(200,200),30);
    MCanvas.rootNodes.push(shape2);


}