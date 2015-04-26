
function init() {
    var stageWidth = window.innerWidth;
    var stageHeight = window.innerHeight;

    console.log('width='+stageWidth);
    console.log('height='+stageHeight);

    var stage = new createjs.Stage(demoCanvas);

// Add border
    var border = new createjs.Shape();
    border.graphics.beginStroke("#000");
    border.graphics.setStrokeStyle(1);
    border.snapToPixel = true;
    border.graphics.drawRect(stageWidth, stageHeight, 100, 100);
    //border.x = 100;
    //border.y = 100;


    var text = new createjs.Text("Hello World", "20px Arial", "#ff7700");
    text.x = 0;
    text.textBaseline = "alphabetic";

    stage.addChild(border);
    stage.addChild(text);
    stage.update();
    createjs.Ticker.setFPS(1);
    createjs.Ticker.addEventListener("tick", tick);

    function tick() {
        stage.update();
    }
}
