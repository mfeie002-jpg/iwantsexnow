/** Reject HTML/SVG/error payloads even when an upstream declares an image MIME type. */
export function matchesRasterSignature(bytes:Uint8Array,type:string):boolean {
 if(bytes.length<16)return false;
 const ascii=(from:number,to:number)=>String.fromCharCode(...bytes.slice(from,to));
 if(type==='image/jpeg')return bytes[0]===255&&bytes[1]===216&&bytes[2]===255;
 if(type==='image/png')return [137,80,78,71,13,10,26,10].every((n,i)=>bytes[i]===n);
 if(type==='image/webp')return ascii(0,4)==='RIFF'&&ascii(8,12)==='WEBP';
 if(type==='image/gif')return ['GIF87a','GIF89a'].includes(ascii(0,6));
 if(type==='image/avif')return ascii(4,8)==='ftyp'&&/avif|avis/.test(ascii(8,Math.min(32,bytes.length)));
 return false;
}
