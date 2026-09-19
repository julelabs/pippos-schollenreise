type VoiceInfo={name:string;lang:string;voiceURI:string;default:boolean};
export function germanVoices<T extends VoiceInfo>(voices:T[]):T[]{const score=(v:T)=>/premium|enhanced|erweitert|natural|neural/i.test(v.name+' '+v.voiceURI)?100:/anna|petra|helena|katja/i.test(v.name)?20:v.default?10:0;return voices.filter(v=>/^de([-_]|$)/i.test(v.lang)).sort((a,b)=>score(b)-score(a)||a.name.localeCompare(b.name))}
export function chooseVoice<T extends VoiceInfo>(voices:T[],preferred:string){const german=germanVoices(voices);return german.find(v=>v.voiceURI===preferred)||german[0]}
