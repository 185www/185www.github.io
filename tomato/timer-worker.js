/* timer-worker.js: precise background timer */
let running=false,remaining=0,total=0,lastTick=null,intervalId=null;

function tick(){
  if(!running) return;
  const now=Date.now();
  const elapsed=now-lastTick;
  lastTick=now;
  remaining=Math.max(0,remaining-Math.ceil(elapsed/1000));
  postMessage({type:'tick',remaining,total});
  if(remaining<=0){
    running=false;
    if(intervalId){clearInterval(intervalId);intervalId=null;}
    postMessage({type:'done'});
  }
}

self.onmessage=function(e){
  const d=e.data;
  if(d.type==='start'){
    if(running) return;
    remaining=d.remaining;
    total=d.total;
    running=true;
    lastTick=Date.now();
    if(intervalId) clearInterval(intervalId);
    intervalId=setInterval(tick,200);
    tick();
  }else if(d.type==='pause'){
    running=false;
    if(intervalId){clearInterval(intervalId);intervalId=null;}
    postMessage({type:'paused',remaining,total});
  }else if(d.type==='stop'){
    running=false;
    if(intervalId){clearInterval(intervalId);intervalId=null;}
    remaining=0;total=0;
  }
};
