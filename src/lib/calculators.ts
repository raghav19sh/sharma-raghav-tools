export function calculate(slug:string,a:string,b:string,c:string,people:string){
 const n=(x:string)=>Number(x);
 if(slug==="days-between-dates")return Math.abs(Math.round((Date.parse(a+"T00:00:00Z")-Date.parse(b+"T00:00:00Z"))/86400000))+" days";
 if(slug==="day-of-date")return new Date(a+"T00:00:00Z").toLocaleDateString("en-US",{weekday:"long",timeZone:"UTC"});
 if(slug==="percentage-increase"){if(!n(a))throw Error("Old value cannot be zero.");return ((((n(b)-n(a))/Math.abs(n(a)))*100).toFixed(2))+"% increase"}
 if(slug==="discount-calculator"){const s=n(a)*n(b)/100;return "Save "+s.toFixed(2)+" • Pay "+(n(a)-s).toFixed(2)}
 if(slug==="emi-calculator"){const p=n(a),r=n(b)/1200,m=n(c)*12;if(!p||!m)throw Error("Enter principal and tenure.");const e=r?p*r*Math.pow(1+r,m)/(Math.pow(1+r,m)-1):p/m;return "EMI "+e.toFixed(2)+" • Total "+(e*m).toFixed(2)}
 if(slug==="age-calculator"){const x=new Date(a+"T00:00:00Z"),y=new Date((b||new Date().toISOString().slice(0,10))+"T00:00:00Z");let Y=y.getUTCFullYear()-x.getUTCFullYear(),M=y.getUTCMonth()-x.getUTCMonth(),D=y.getUTCDate()-x.getUTCDate();if(D<0){M--;D+=new Date(Date.UTC(y.getUTCFullYear(),y.getUTCMonth(),0)).getUTCDate()}if(M<0){Y--;M+=12}return Y+" years, "+M+" months, "+D+" days"}
 if(slug==="cgpa-to-percentage")return (n(a)*n(b||"9.5")).toFixed(2)+"% using ×"+(b||"9.5");
 if(slug==="split-bill")return (n(a)/Math.max(1,n(people))).toFixed(2)+" per person";
 if(slug==="tip-calculator"){const t=n(a)*n(b||"10")/100;return "Tip "+t.toFixed(2)+" • Total "+(n(a)+t).toFixed(2)}
 if(slug==="fuel-cost"){if(!n(b))throw Error("Mileage cannot be zero.");const l=n(a)/n(b);return l.toFixed(2)+" L • Cost "+(l*n(c)).toFixed(2)}
 if(slug==="salary-after-tax"){const net=n(a)*(1-n(b||"20")/100);return "Annual net "+net.toFixed(2)+" • Monthly "+(net/12).toFixed(2)}
 const m=n(a),r=n(b)/1200,k=n(c)*12;const f=r?m*((Math.pow(1+r,k)-1)/r)*(1+r):m*k;return "Invested "+(m*k).toFixed(2)+" • Projected "+f.toFixed(2)+" • Gain "+(f-m*k).toFixed(2);
}
export function convert(slug:string,v:string,mode:string){
 const n=Number(v);
 if(slug==="celsius-to-fahrenheit")return mode==="c2f"?((n*9)/5+32).toFixed(2)+" °F":(((n-32)*5)/9).toFixed(2)+" °C";
 if(slug==="kg-to-pounds")return mode==="kg2lb"?(n*2.2046226218).toFixed(4)+" lb":(n/2.2046226218).toFixed(4)+" kg";
 if(slug==="feet-to-cm")return mode==="ft2cm"?(n*30.48).toFixed(2)+" cm":(n/30.48).toFixed(2)+" ft";
 return mode==="decimal"?(n/1000).toFixed(4)+" GB":(n/1024).toFixed(4)+" GiB";
}