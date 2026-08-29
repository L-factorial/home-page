import {useEffect, useRef} from 'react'
import EightPuzzleBoard from './board/EightPuzzleBoard'

function EightPuzzle() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        var parent = document.getElementById("canvadDivId");
        canvas.width  = parent.clientWidth;
        canvas.height = parent.clientHeight;
        const eightPuzzleBoard = new EightPuzzleBoard(canvas,ctx);
        eightPuzzleBoard.showEightPuzzleCurrentBoard();
        const interval = setInterval(() => eightPuzzleBoard.showBoard(), 1100);
        return () => {
            clearInterval(interval);
            eightPuzzleBoard.destroy();
        };
    }, [])

    return (
        <canvas id="eight-puzzle-canvas" height="100%" width="100%" ref={canvasRef}></canvas>
    )
}

export default EightPuzzle;
