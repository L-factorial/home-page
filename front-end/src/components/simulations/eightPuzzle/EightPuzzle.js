import React from 'react'
import {useEffect, useRef} from 'react'
import State from '../../../simulation-logic/eight-puzzle/State';
import EightPuzzleSimulation from '../../../simulation-logic/eight-puzzle/a-star';


function EightPuzzle() {
    const canvasRef = useRef(null);

    var totalShuffle = 100;

    let arr = [
    [7, 4, 3], 
    [8, 9, 5], 
    [2, 1, 6]]
    ;
    
    let eightPuzzle = new EightPuzzleSimulation(arr);
    let path = eightPuzzle.solution();
    let block = 0;
    
    let rectWidth = 0
    let rectHeight = 0;
    
    let rectX = 0;
    let rectY = 0;
    
    var pathPos = 0;

    let canvas = null;
    let ctx = null;
    let blockMargin  = 0;

    function init(){
        canvas = canvasRef.current;
        ctx = canvas.getContext("2d");
        var parent = document.getElementById("canvadDivId");
        canvas.width  = parent.offsetWidth;
        canvas.height = parent.offsetHeight;
        blockMargin =  Math.min(canvas.width, canvas.height)/10;

        block = Math.min(canvas.width, canvas.height)/3 - blockMargin;
        rectWidth = (block * 3) + blockMargin/10;
        rectHeight = rectWidth;
        
        rectX = (canvas.width / 2) - (rectWidth / 2);
        rectY = (canvas.height / 2) - (rectHeight / 2);
    }

    function shuffle() {
        totalShuffle = Math.ceil((Math.random() * 100) + 20);
        for (let i = 0; i < totalShuffle; ++i) {
            let s = new State(arr);
            let babies = s.children();
            let r = Math.random() * 20;
            for (let j = 0; j < babies.length; ++j) {
                if (r > 8) {
                    arr = babies[j].arr;
                }
            }
        }
        let eightPuzzle = new EightPuzzleSimulation(arr);
        path = eightPuzzle.solution();
    }

    function solved() {
        shuffle(arr);
    }
    
    function solvedDisplay(ctx) {
        console.log("Inside solved draawing ...")
    
        ctx.font = (block/10) + "px Arial";
        ctx.fillStyle = "white";
        ctx.fillText("Solved. Wait for new ...", rectX +75, (canvas.height / 2) + 75);
    }
    function animate() {
        ctx.beginPath();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.lineWidth = "6";
        ctx.strokeStyle = "red";
        ctx.rect(rectX, rectY, rectWidth, rectHeight);
        ctx.stroke();
        var x = rectX;
        var y = rectY;
        var k = 0;
    
        if (pathPos < path.length) {
            for (let r = 0; r < 3; ++r) {
                x = rectX;
                for (let c = 0; c < 3; ++c) {
                    let c = path[pathPos][k];
                    let empty = c == '9';
                    ctx.beginPath();
                    ctx.font = (block - 10) + "px Arial";
                    ctx.fillStyle = 'red';
                    if (empty) {
                        ctx.fillStyle = 'white';
                    }
                    ctx.strokeStyle = 'black';
                    ctx.arc(x + block / 2, y + block / 2, (block / 2) - 5, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();
                    ctx.fillStyle = "white"
                    if (!empty) {
                        ctx.fillText("" + path[pathPos][k], (x + block / 2) - blockMargin*0.75, (y + block / 2) + blockMargin*0.75);
                    }
                    ++k;
                    x = x + block;
                }
    
                y = y + block;
            }
            ++pathPos;
            // if(pathPos == path.length) {
            //     shuffle();
            // }
        }
        else if(pathPos < 12) {
            solvedDisplay();
            ++pathPos;
    
        } 
        else {
            pathPos = 0;
        }
    
        console.log(pathPos);
        console.log(path.length +" ---------");
        console.table(path);
    
    }
    useEffect(() => {

        init();
        setInterval(animate, 2000);


    }, [])

    return (
        <canvas id="eight-puzzle-canvas" height="100%" width="100%" ref={canvasRef}></canvas>
    )
}

export default EightPuzzle
