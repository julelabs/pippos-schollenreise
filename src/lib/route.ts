export const STOPS = [
 {x:45,y:85,size:18,label:'Startscholle'},
 {x:50,y:60.5,size:16,label:'Erste Fahne'},
 {x:63,y:48.5,size:14,label:'Glitzerscholle'},
 {x:51,y:41.3,size:12,label:'Zweite Fahne'},
 {x:69,y:36.7,size:10,label:'Letzte Scholle'},
 {x:81.8,y:26,size:8,label:'Iglutür'},
] as const;
export const MARKERS=[{x:79.5,y:54,flag:true},{x:74,y:47,flag:false},{x:41.2,y:36.8,flag:true},{x:77,y:36,flag:false},{x:71.4,y:27.5,flag:true}];
export function visualStep(step:number,solved:boolean){return Math.min(5,Math.max(0,step+(solved?1:0)))}
export function sampleJump(from:{x:number;y:number;size:number},to:{x:number;y:number;size:number},progress:number){const t=Math.max(0,Math.min(1,progress)),ease=t*t*(3-2*t);return {x:from.x+(to.x-from.x)*ease,y:from.y+(to.y-from.y)*ease,size:from.size+(to.size-from.size)*ease,lift:Math.sin(Math.PI*t)*9}}
export function cameraOffset(width:number,height:number,y:number){const stageHeight=width*4/3;return Math.max(0,Math.min(stageHeight-height,stageHeight*y/100-height*.66))}
