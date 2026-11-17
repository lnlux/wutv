// Source - https://stackoverflow.com/a/15654454
// Posted by OpherV, modified by community. See post 'Timeline' for change history
// Retrieved 2026-11-15, License - CC BY-SA 4.0

let box = document.querySelector(".box");
let boxBoundingRect = box.getBoundingClientRect();
let boxCenter={
    x: boxBoundingRect.left + boxBoundingRect.width/2, 
    y: boxBoundingRect.top + boxBoundingRect.height/2
};

document.addEventListener("mousemove", e => {
    let angle = Math.atan2(e.pageX - boxCenter.x, - (e.pageY - boxCenter.y) )*(180 / Math.PI);      
    box.style.transform = `rotate(${angle}deg)`;  
})
