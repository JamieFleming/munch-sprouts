import { useState, useCallback } from "react";

// ─── COLOUR TOKENS ────────────────────────────────────────────────────────────
const C = {
  bgMain:"#f3f0fa",bgPurple:"#ede8f7",bgGreen:"#e8f7ee",bgWarning:"#fff4e5",
  primaryPurple:"#9b7fe8",secondaryPurple:"#c4b0f0",primaryPurpleDark:"#7a5fcb",
  primaryGreen:"#3db87a",primaryGreenLight:"#5dd39e",primaryPinkDark:"#5a2d7a",
  textCharcoal:"#3d3d3d",warningStroke:"#e07b39",white:"#ffffff",
  border:"#d9d0f0",borderLight:"#ece8f9",mutedText:"#8a7aaa",
};
const FONT_HEAD="'Josefin Sans', sans-serif";
const FONT_BODY="'Josefin Sans', sans-serif";
const FONT_ACCENT="'Caveat', cursive";

const CATEGORIES=[
  {value:"Vegetables",color:C.primaryGreen},{value:"Fruits",color:"#e05c7a"},
  {value:"Grains",color:"#d4a017"},{value:"Proteins",color:C.warningStroke},
  {value:"Dairy",color:C.secondaryPurple},{value:"Legumes",color:"#3db8a0"},
  {value:"Liquids",color:"#4ab8d8"},{value:"Other",color:C.mutedText},
];
const FORMS=["Purée","Mashed","Soft/Cut","Finger Food","Mixed Texture","Liquid","Sippy Cup","Open Cup"];
const REACTIONS=[
  {value:"Loved",color:C.primaryGreen,bg:C.bgGreen,border:C.primaryGreenLight},
  {value:"Good",color:"#2e9e60",bg:"#d6f5e6",border:"#5dd39e"},
  {value:"Neutral",color:"#b07d20",bg:"#fff8e1",border:"#f0c94a"},
  {value:"Rejected",color:C.warningStroke,bg:C.bgWarning,border:C.warningStroke},
  {value:"Allergic",color:"#c0392b",bg:"#fde8e8",border:"#e07070"},
];

// ─── RECIPES DATA ─────────────────────────────────────────────────────────────
const RECIPES = [
  {
    id:1, title:"Banana Oat Pancakes", category:"Breakfast", ageGroup:"6m+",
    time:"15 min", icon:"grain", tags:["dairy-free","egg-free"], locked:false,
    description:"Soft, naturally sweet pancakes perfect for little hands.",
    ingredients:["1 ripe banana","4 tbsp rolled oats","1 egg","Pinch of cinnamon","Coconut oil for frying"],
    steps:[
      "Mash the banana well in a bowl until smooth with no lumps.",
      "Blend the oats briefly to make a rough flour, then mix into the banana.",
      "Beat in the egg and cinnamon until you have a thick batter.",
      "Heat a little coconut oil in a non-stick pan on medium-low heat.",
      "Drop tablespoons of batter into the pan and cook 2–3 min each side until golden.",
      "Cool completely before serving. Cut into strips for easy gripping.",
    ],
  },
  {
    id:2, title:"Sweet Potato Fingers", category:"Finger Foods", ageGroup:"6m+",
    time:"30 min", icon:"leaf", tags:["vegan","iron-rich"], locked:false,
    description:"Soft-baked wedges that are easy to pick up and naturally sweet.",
    ingredients:["1 medium sweet potato","1 tsp olive oil","Pinch of cumin (optional)"],
    steps:[
      "Preheat oven to 200°C / 180°C fan.",
      "Peel the sweet potato and cut into finger-sized wedges.",
      "Toss in olive oil and cumin if using.",
      "Spread on a baking tray lined with parchment.",
      "Bake for 25–30 minutes until soft all the way through and slightly golden.",
      "Allow to cool until just warm before serving.",
    ],
  },
  {
    id:3, title:"Salmon & Broccoli Bites", category:"Mains", ageGroup:"7m+",
    time:"25 min", icon:"utensils", tags:["omega-3","iron-rich"], locked:true,
    description:"Omega-3 packed bites with hidden veg — a family favourite.",
    ingredients:["150g cooked salmon","80g cooked broccoli","2 tbsp breadcrumbs","1 egg yolk"],
    steps:[
      "Flake the cooked salmon and finely chop the broccoli.",
      "Mix together with breadcrumbs and egg yolk.",
      "Shape into small patties.",
      "Bake at 180°C for 15–18 minutes until firm.",
      "Cool before serving.",
    ],
  },
  {
    id:4, title:"Avocado Toast Soldiers", category:"Breakfast", ageGroup:"6m+",
    time:"10 min", icon:"leaf", tags:["healthy-fats"], locked:true,
    description:"Creamy avocado on toast cut into dippable soldiers.",
    ingredients:["½ ripe avocado","1 slice wholemeal toast","Squeeze of lemon juice"],
    steps:[
      "Mash avocado with lemon juice until smooth.",
      "Toast the bread until golden.",
      "Spread avocado generously on toast.",
      "Cut into finger-width soldiers and serve.",
    ],
  },
  {
    id:5, title:"Lentil & Veggie Fritters", category:"Mains", ageGroup:"7m+",
    time:"35 min", icon:"bean", tags:["high-protein","iron-rich"], locked:true,
    description:"Iron-rich fritters packed with hidden veg and protein.",
    ingredients:["100g cooked red lentils","1 grated carrot","1 grated courgette","2 tbsp plain flour","1 egg"],
    steps:[
      "Squeeze excess moisture from the grated veg.",
      "Mix lentils, veg, flour and egg together.",
      "Shape into small patties.",
      "Fry in a little oil on medium heat for 3–4 min each side.",
      "Drain on kitchen paper and cool before serving.",
    ],
  },
  {
    id:6, title:"Mango Yoghurt Pots", category:"Snacks", ageGroup:"6m+",
    time:"5 min", icon:"apple", tags:["probiotic"], locked:true,
    description:"A quick, creamy snack full of probiotics and vitamin C.",
    ingredients:["3 tbsp full-fat plain yoghurt","2 tbsp fresh or frozen mango","Optional: pinch of cardamom"],
    steps:[
      "If using frozen mango, defrost and drain any liquid.",
      "Mash or blend mango to a smooth purée.",
      "Swirl through the yoghurt.",
      "Serve in a bowl or preloaded on a spoon for younger babies.",
    ],
  },
];

// ─── SVG ICONS ────────────────────────────────────────────────────────────────
function Icon({name,size=18,color="currentColor",style:x={}}) {
  const s={width:size,height:size,display:"inline-block",flexShrink:0,...x};
  const paths={
    home:<><path d="M3 12L12 3l9 9"/><path d="M9 21V12h6v9"/><path d="M3 12v9h6"/><path d="M15 21v-9h6V21"/></>,
    list:<><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="3" cy="6" r="0.5" fill="currentColor"/><circle cx="3" cy="12" r="0.5" fill="currentColor"/><circle cx="3" cy="18" r="0.5" fill="currentColor"/></>,
    plus:<><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    baby:<><circle cx="12" cy="8" r="4"/><path d="M8 14c-3 1.5-5 3.5-5 5h18c0-1.5-2-3.5-5-5"/></>,
    chef:<><path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"/><line x1="6" y1="17" x2="18" y2="17"/></>,
    export:<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></>,
    star:<><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></>,
    starFill:<><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="currentColor" strokeWidth="0"/></>,
    edit:<><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
    trash:<><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></>,
    close:<><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    chevDown:<><polyline points="6 9 12 15 18 9"/></>,
    chevUp:<><polyline points="18 15 12 9 6 15"/></>,
    check:<><polyline points="20 6 9 17 4 12"/></>,
    alert:<><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
    lock:<><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>,
    search:<><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
    clock:<><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
    download:<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></>,
    chart:<><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>,
    info:<><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></>,
    users:<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
    grid:<><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></>,
    water:<><path d="M12 2C6 9 4 13 4 16a8 8 0 0 0 16 0c0-3-2-7-8-14z"/></>,
    leaf:<><path d="M2 22c1-5 4-9 8-10 1 3 3 5 5 6-2 1-4 3-5 6"/><path d="M22 2s-8 2-10 10C8 16 6 19 2 22c3-1 7-3 10-8 2 1 4 1 6-1-1-3-1-7 4-11z"/></>,
    apple:<><path d="M12 20.94c1.5 0 2.75-.67 4-2 1.5-1.67 2-3.5 2-5.44C18 9 15.87 7 13.5 7c-.87 0-1.5.2-2 .5-.5-.3-1.13-.5-2-.5C7.13 7 5 9 5 13.5c0 1.94.5 3.77 2 5.44 1.25 1.33 2.5 2 4 2z"/><path d="M12 7V3"/></>,
    utensils:<><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/></>,
    milk:<><path d="M8 2h8"/><path d="M9 2v2.789a4 4 0 0 1-.672 2.219l-.656.984A4 4 0 0 0 7 10.212V20a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-9.789a4 4 0 0 0-.672-2.219l-.656-.984A4 4 0 0 1 15 4.788V2"/><path d="M7 15a6.472 6.472 0 0 1 5 0 6.47 6.47 0 0 0 5 0"/></>,
    grain:<><path d="M2 22 16 8"/><path d="M3.47 12.53 5 11l1.53 1.53a3.5 3.5 0 0 1 0 4.94L5 19l-1.53-1.53a3.5 3.5 0 0 1 0-4.94z"/><path d="M7.47 8.53 9 7l1.53 1.53a3.5 3.5 0 0 1 0 4.94L9 15l-1.53-1.53a3.5 3.5 0 0 1 0-4.94z"/><path d="M11.47 4.53 13 3l1.53 1.53a3.5 3.5 0 0 1 0 4.94L13 11l-1.53-1.53a3.5 3.5 0 0 1 0-4.94z"/></>,
    bean:<><path d="M10.5 22C6.5 22 2 17.52 2 13c0-3 1.9-5.5 5-6.5 1.3-.4 3.1.1 4.3 1.3C13.4 9.9 16 11 18 11c2 0 4-1 4-3-2 0-4-1-4-3 0-1.1.9-2 2-2"/><path d="M14.5 22c2-1.5 3.5-4 3.5-7 0-3-2-5-5-5"/></>,
    sprout:<><path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 5 .3 5.5.8z"/><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4.9 1-4.9 2z"/></>,
  };
  const d=paths[name];
  if(!d) return null;
  return <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={s}>{d}</svg>;
}
const CAT_ICON_MAP={Vegetables:"leaf",Fruits:"apple",Grains:"grain",Proteins:"utensils",Dairy:"milk",Legumes:"bean",Liquids:"water",Other:"utensils"};
function CatIcon({category,size=18,color}){const cfg=CATEGORIES.find(c=>c.value===category);return <Icon name={CAT_ICON_MAP[category]||"utensils"} size={size} color={color||cfg?.color||C.mutedText}/>;}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function calcAgeWeeks(dob){if(!dob)return null;return Math.floor((Date.now()-new Date(dob))/(7*24*60*60*1000));}
function calcAgeMonths(dob){if(!dob)return null;const b=new Date(dob),n=new Date();return(n.getFullYear()-b.getFullYear())*12+(n.getMonth()-b.getMonth());}
function formatDate(d){if(!d)return"";return new Date(d).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"});}
function normalize(s){return s.toLowerCase().trim();}
function groupByFood(log){const g={};log.forEach(e=>{const k=normalize(e.name);if(!g[k])g[k]={key:k,name:e.name,category:e.category,attempts:[]};g[k].attempts.push(e);});return g;}
function reactionCfg(r){return REACTIONS.find(x=>x.value===r)||REACTIONS[2];}
function useLocalStorage(key,init){
  const [val,setVal]=useState(()=>{try{const s=localStorage.getItem(key);return s?JSON.parse(s):init;}catch{return init;}});
  const set=useCallback((v)=>{setVal(prev=>{const next=typeof v==="function"?v(prev):v;localStorage.setItem(key,JSON.stringify(next));return next;});},[key]);
  return [val,set];
}

// ─── TOAST ────────────────────────────────────────────────────────────────────
function Toast({toasts}){
  return <div style={{position:"fixed",bottom:90,right:16,zIndex:9999,display:"flex",flexDirection:"column",gap:8}}>
    {toasts.map(t=><div key={t.id} style={{background:t.type==="error"?"#fde8e8":t.type==="warning"?C.bgWarning:C.bgGreen,color:t.type==="error"?"#c0392b":t.type==="warning"?C.warningStroke:"#2e7d52",border:`1.5px solid ${t.type==="error"?"#e07070":t.type==="warning"?C.warningStroke:C.primaryGreenLight}`,borderRadius:12,padding:"10px 16px",fontFamily:FONT_BODY,fontWeight:700,fontSize:13,boxShadow:"0 4px 20px rgba(0,0,0,0.1)",maxWidth:280,animation:"toastIn 0.25s ease"}}>{t.msg}</div>)}
  </div>;
}

// ─── SHARED UI ────────────────────────────────────────────────────────────────
const inputStyle={width:"100%",border:`2px solid ${C.border}`,borderRadius:12,padding:"10px 14px",fontFamily:FONT_BODY,fontSize:13,fontWeight:600,color:C.textCharcoal,outline:"none",background:C.white,boxSizing:"border-box"};
const labelStyle={fontSize:11,fontWeight:700,color:C.mutedText,fontFamily:FONT_BODY,marginBottom:5,display:"block",textTransform:"uppercase",letterSpacing:"0.07em"};
const btnPrimary={background:C.primaryPurple,color:C.white,border:"none",borderRadius:12,padding:"11px 20px",fontFamily:FONT_HEAD,fontWeight:700,fontSize:13,cursor:"pointer",width:"100%",letterSpacing:"0.04em",textTransform:"uppercase"};
const btnOutline={background:"transparent",color:C.primaryPurple,border:`2px solid ${C.primaryPurple}`,borderRadius:12,padding:"9px 16px",fontFamily:FONT_BODY,fontWeight:700,fontSize:12,cursor:"pointer",textTransform:"uppercase",letterSpacing:"0.04em"};
const btnSecondary={background:C.bgPurple,color:C.primaryPurpleDark,border:`2px solid ${C.border}`,borderRadius:10,padding:"8px 14px",fontFamily:FONT_BODY,fontWeight:700,fontSize:12,cursor:"pointer"};
const btnDanger={background:C.bgWarning,color:C.warningStroke,border:`2px solid ${C.warningStroke}`,borderRadius:10,padding:"8px 14px",fontFamily:FONT_BODY,fontWeight:700,fontSize:12,cursor:"pointer"};

function Field({label,children}){return <div style={{display:"flex",flexDirection:"column",gap:5}}><label style={labelStyle}>{label}</label>{children}</div>;}
function Card({children,style:s={},danger=false}){return <div style={{background:danger?"#fde8e8":C.bgPurple,border:`2px solid ${danger?"#e07070":C.borderLight}`,borderRadius:16,padding:18,boxShadow:"0 2px 10px rgba(155,127,232,0.08)",...s}}>{children}</div>;}
function SectionTitle({children,icon}){return <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>{icon&&<Icon name={icon} size={17} color={C.primaryPurple}/>}<h3 style={{margin:0,fontFamily:FONT_HEAD,fontWeight:700,fontSize:14,color:C.primaryPinkDark,letterSpacing:"0.06em",textTransform:"uppercase"}}>{children}</h3></div>;}
function ReactionBadge({reaction}){const r=reactionCfg(reaction);return <span style={{background:r.bg,color:r.color,border:`1.5px solid ${r.border}`,borderRadius:999,padding:"3px 10px",fontSize:11,fontWeight:700,fontFamily:FONT_BODY,whiteSpace:"nowrap"}}>{reaction}</span>;}
function StatCard({icon,label,value,color,bg}){return <div style={{background:bg,border:`2px solid ${C.borderLight}`,borderRadius:14,padding:"14px 14px",display:"flex",flexDirection:"column",gap:6,flex:"1 1 95px",minWidth:85}}><Icon name={icon} size={18} color={color}/><div style={{fontSize:24,fontWeight:700,color,fontFamily:FONT_HEAD,lineHeight:1}}>{value}</div><div style={{fontSize:10,color:C.mutedText,fontWeight:700,fontFamily:FONT_BODY,textTransform:"uppercase",letterSpacing:"0.05em",lineHeight:1.3}}>{label}</div></div>;}

// ─── MODAL ────────────────────────────────────────────────────────────────────
function Modal({open,onClose,title,children}){
  if(!open)return null;
  return <div style={{position:"fixed",inset:0,background:"rgba(90,45,122,0.35)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={onClose}>
    <div style={{background:C.white,borderRadius:20,padding:28,maxWidth:480,width:"100%",maxHeight:"90vh",overflowY:"auto",boxShadow:"0 20px 60px rgba(90,45,122,0.2)",border:`2px solid ${C.border}`}} onClick={e=>e.stopPropagation()}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
        <h3 style={{margin:0,fontFamily:FONT_HEAD,fontWeight:700,fontSize:17,color:C.primaryPinkDark,textTransform:"uppercase",letterSpacing:"0.05em"}}>{title}</h3>
        <button onClick={onClose} style={{background:C.bgPurple,border:"none",cursor:"pointer",borderRadius:8,padding:6,display:"flex",alignItems:"center"}}><Icon name="close" size={15} color={C.mutedText}/></button>
      </div>
      {children}
    </div>
  </div>;
}

// ─── FOOD FORM ────────────────────────────────────────────────────────────────
function FoodForm({onSubmit,initial={},buttonLabel="Add to Log"}){
  const today=new Date().toISOString().split("T")[0];
  const [form,setForm]=useState({date:today,name:"",category:"",form:"",reaction:"",notes:"",favourite:false,...initial});
  const set=(k,v)=>setForm(p=>({...p,[k]:v}));
  const handleSubmit=()=>{if(!form.date||!form.name||!form.category){onSubmit(null,"Please fill in Date, Name and Category.");return;}onSubmit(form);if(!initial.id)setForm({date:today,name:"",category:"",form:"",reaction:"",notes:"",favourite:false});};
  return(
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      <Field label="Date"><input type="date" value={form.date} onChange={e=>set("date",e.target.value)} style={inputStyle}/></Field>
      <Field label="Food or Drink Name"><input type="text" value={form.name} onChange={e=>set("name",e.target.value)} placeholder="e.g. Banana, Water, Formula" style={inputStyle}/></Field>
      <Field label="Category">
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
          {CATEGORIES.map(c=>{const sel=form.category===c.value;return(
            <button key={c.value} type="button" onClick={()=>set("category",c.value)} style={{background:sel?c.color:C.bgPurple,border:`2px solid ${sel?c.color:C.border}`,borderRadius:10,padding:"8px 4px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
              <CatIcon category={c.value} size={15} color={sel?C.white:c.color}/>
              <span style={{fontFamily:FONT_BODY,fontSize:9,fontWeight:700,color:sel?C.white:C.mutedText,textAlign:"center",lineHeight:1.2,textTransform:"uppercase"}}>{c.value}</span>
            </button>);
          })}
        </div>
      </Field>
      <Field label="Form / Texture"><select value={form.form} onChange={e=>set("form",e.target.value)} style={inputStyle}><option value="">Select form…</option>{FORMS.map(f=><option key={f} value={f}>{f}</option>)}</select></Field>
      <Field label="Reaction">
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
          {REACTIONS.map(r=>{const sel=form.reaction===r.value;return <button key={r.value} type="button" onClick={()=>set("reaction",r.value)} style={{background:sel?r.bg:C.bgPurple,border:`2px solid ${sel?r.border:C.border}`,borderRadius:10,padding:"9px 4px",cursor:"pointer",fontFamily:FONT_BODY,fontSize:11,fontWeight:700,color:sel?r.color:C.mutedText,textAlign:"center",textTransform:"uppercase",letterSpacing:"0.03em"}}>{r.value}</button>;})}
        </div>
      </Field>
      <Field label="Notes (optional)"><textarea value={form.notes} onChange={e=>set("notes",e.target.value)} placeholder="Texture feedback, observations…" rows={3} style={{...inputStyle,resize:"vertical"}}/></Field>
      <label style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer",fontFamily:FONT_BODY,fontWeight:700,fontSize:13,color:C.textCharcoal,textTransform:"uppercase",letterSpacing:"0.04em"}}>
        <input type="checkbox" checked={form.favourite} onChange={e=>set("favourite",e.target.checked)} style={{width:17,height:17,accentColor:C.primaryPurple}}/>
        <Icon name="starFill" size={14} color="#d4a017"/>Mark as Favourite
      </label>
      <button style={btnPrimary} onClick={handleSubmit}>{buttonLabel}</button>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({child,foodLog,onNavigate}){
  const groups=groupByFood(foodLog);
  const keys=Object.keys(groups);
  const unique=keys.length,total=foodLog.length;
  const liked=keys.filter(k=>groups[k].attempts.some(a=>a.reaction==="Loved"||a.reaction==="Good")).length;
  const disliked=keys.filter(k=>groups[k].attempts.some(a=>a.reaction==="Rejected")).length;
  const allergic=foodLog.filter(f=>f.reaction==="Allergic").length;
  const favourites=keys.filter(k=>groups[k].attempts.some(a=>a.favourite));
  const liquids=keys.filter(k=>groups[k].category==="Liquids").length;
  const weeks=child?calcAgeWeeks(child.dob):null;
  const months=child?calcAgeMonths(child.dob):null;
  const catBreakdown={};
  keys.forEach(k=>{const cat=groups[k].category||"Other";catBreakdown[cat]=(catBreakdown[cat]||0)+1;});
  const recent=[...foodLog].sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,5);
  return(
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      {child?(
        <div style={{background:`linear-gradient(135deg,${C.primaryPurple} 0%,${C.secondaryPurple} 100%)`,borderRadius:20,padding:"22px 24px",color:C.white,display:"flex",justifyContent:"space-between",alignItems:"center",gap:12}}>
          <div>
            <div style={{fontSize:10,fontWeight:700,opacity:0.8,fontFamily:FONT_BODY,textTransform:"uppercase",letterSpacing:"0.1em"}}>Tracking for</div>
            <div style={{fontSize:28,fontWeight:700,fontFamily:FONT_HEAD,letterSpacing:"0.02em",lineHeight:1.2}}>{child.name}</div>
            {weeks!==null&&<div style={{fontSize:13,fontWeight:600,opacity:0.9,fontFamily:FONT_BODY,marginTop:4}}>{weeks} weeks · {months} months old</div>}
            {child.weaningStart&&<div style={{fontSize:11,opacity:0.75,fontFamily:FONT_BODY,marginTop:3}}>Weaning from {formatDate(child.weaningStart)}</div>}
          </div>
          <Icon name="baby" size={50} color="rgba(255,255,255,0.25)"/>
        </div>
      ):(
        <Card><div style={{textAlign:"center",padding:"16px 0"}}><Icon name="baby" size={38} color={C.secondaryPurple} x={{marginBottom:10}}/><p style={{fontFamily:FONT_BODY,color:C.mutedText,fontWeight:600,margin:0,fontSize:13}}>No child selected. <button onClick={()=>onNavigate("children")} style={{background:"none",border:"none",color:C.primaryPurple,fontWeight:700,cursor:"pointer",fontFamily:FONT_BODY,fontSize:13,textDecoration:"underline"}}>Add a child</button></p></div></Card>
      )}
      <div style={{display:"flex",flexWrap:"wrap",gap:10}}>
        <StatCard icon="grid" label="Foods Tried" value={unique} color={C.primaryPurple} bg={C.bgPurple}/>
        <StatCard icon="list" label="Attempts" value={total} color="#4ab8d8" bg="#e8f6fb"/>
        <StatCard icon="check" label="Liked" value={liked} color={C.primaryGreen} bg={C.bgGreen}/>
        <StatCard icon="alert" label="Disliked" value={disliked} color={C.warningStroke} bg={C.bgWarning}/>
        <StatCard icon="alert" label="Allergic" value={allergic} color="#c0392b" bg="#fde8e8"/>
        <StatCard icon="starFill" label="Favourites" value={favourites.length} color="#d4a017" bg="#fef9e7"/>
        <StatCard icon="water" label="Liquids" value={liquids} color="#4ab8d8" bg="#e8f6fb"/>
      </div>
      {favourites.length>0&&<Card><SectionTitle icon="starFill">Favourites</SectionTitle><div style={{display:"flex",flexWrap:"wrap",gap:8}}>{favourites.map(k=>{const cat=CATEGORIES.find(c=>c.value===groups[k].category)||CATEGORIES[7];return <span key={k} style={{background:C.white,border:`2px solid ${C.border}`,borderRadius:999,padding:"5px 14px",fontFamily:FONT_BODY,fontWeight:700,fontSize:12,color:C.primaryPinkDark,display:"flex",alignItems:"center",gap:6,textTransform:"uppercase",letterSpacing:"0.04em"}}><CatIcon category={groups[k].category} size={12} color={cat.color}/>{groups[k].name}</span>;})}</div></Card>}
      {Object.keys(catBreakdown).length>0&&<Card><SectionTitle icon="chart">Category Breakdown</SectionTitle><div style={{display:"flex",flexDirection:"column",gap:12}}>{Object.entries(catBreakdown).sort((a,b)=>b[1]-a[1]).map(([cat,count])=>{const cfg=CATEGORIES.find(c=>c.value===cat)||CATEGORIES[7];const pct=Math.round((count/unique)*100);return(<div key={cat} style={{display:"flex",alignItems:"center",gap:10}}><CatIcon category={cat} size={17} color={cfg.color}/><div style={{flex:1}}><div style={{display:"flex",justifyContent:"space-between",fontFamily:FONT_BODY,fontSize:12,fontWeight:700,color:C.textCharcoal,marginBottom:4,textTransform:"uppercase",letterSpacing:"0.04em"}}><span>{cat}</span><span style={{color:C.mutedText}}>{count}</span></div><div style={{background:C.borderLight,borderRadius:999,height:7,overflow:"hidden"}}><div style={{background:cfg.color,height:"100%",width:`${pct}%`,borderRadius:999}}/></div></div></div>);})}</div></Card>}
      {recent.length>0&&<Card><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}><SectionTitle icon="clock">Recent Activity</SectionTitle><button onClick={()=>onNavigate("log")} style={{...btnOutline,padding:"6px 12px",fontSize:10}}>View All</button></div><div style={{display:"flex",flexDirection:"column",gap:8}}>{recent.map(e=>(<div key={e.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",background:C.white,border:`2px solid ${C.borderLight}`,borderRadius:12}}><CatIcon category={e.category} size={19}/><div style={{flex:1,minWidth:0}}><div style={{fontFamily:FONT_BODY,fontWeight:700,fontSize:13,color:C.textCharcoal,display:"flex",alignItems:"center",gap:5}}>{e.name}{e.favourite&&<Icon name="starFill" size={11} color="#d4a017"/>}</div><div style={{fontFamily:FONT_BODY,fontSize:11,color:C.mutedText,marginTop:2}}>{formatDate(e.date)}{e.form?` · ${e.form}`:""}</div></div><ReactionBadge reaction={e.reaction}/></div>))}</div></Card>}
      {foodLog.length===0&&<div style={{textAlign:"center",padding:"48px 20px"}}><Icon name="utensils" size={42} color={C.secondaryPurple} x={{marginBottom:14}}/><div style={{fontFamily:FONT_HEAD,fontWeight:700,fontSize:16,marginBottom:8,color:C.primaryPinkDark,textTransform:"uppercase",letterSpacing:"0.06em"}}>No foods logged yet</div><p style={{fontFamily:FONT_BODY,fontSize:13,margin:"0 0 18px",color:C.mutedText}}>Start tracking your little one's weaning journey</p><button onClick={()=>onNavigate("add")} style={{...btnPrimary,width:"auto",display:"inline-block",padding:"12px 28px"}}>Log First Food</button></div>}
    </div>
  );
}

// ─── LOG PAGE ─────────────────────────────────────────────────────────────────
function LogPage({foodLog,onEdit,onDelete,onToggleFavourite}){
  const [search,setSearch]=useState("");
  const [filterCat,setFilterCat]=useState("");
  const [filterReaction,setFilterReaction]=useState("");
  const [sortBy,setSortBy]=useState("date-desc");
  const [expanded,setExpanded]=useState(new Set());
  const groups=groupByFood(foodLog);
  let keys=Object.keys(groups);
  if(search)keys=keys.filter(k=>normalize(groups[k].name).includes(normalize(search)));
  if(filterCat)keys=keys.filter(k=>groups[k].category===filterCat);
  if(filterReaction)keys=keys.filter(k=>groups[k].attempts.some(a=>a.reaction===filterReaction));
  if(sortBy==="date-desc")keys.sort((a,b)=>new Date(groups[b].attempts.at(-1).date)-new Date(groups[a].attempts.at(-1).date));
  else if(sortBy==="date-asc")keys.sort((a,b)=>new Date(groups[a].attempts.at(-1).date)-new Date(groups[b].attempts.at(-1).date));
  else if(sortBy==="alpha")keys.sort((a,b)=>a.localeCompare(b));
  else if(sortBy==="attempts")keys.sort((a,b)=>groups[b].attempts.length-groups[a].attempts.length);
  const toggle=k=>setExpanded(p=>{const n=new Set(p);n.has(k)?n.delete(k):n.add(k);return n;});
  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <Card>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <div style={{position:"relative"}}><Icon name="search" size={14} color={C.mutedText} style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)"}}/><input type="text" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search foods…" style={{...inputStyle,paddingLeft:36}}/></div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            <select value={filterCat} onChange={e=>setFilterCat(e.target.value)} style={inputStyle}><option value="">All categories</option>{CATEGORIES.map(c=><option key={c.value} value={c.value}>{c.value}</option>)}</select>
            <select value={filterReaction} onChange={e=>setFilterReaction(e.target.value)} style={inputStyle}><option value="">All reactions</option>{REACTIONS.map(r=><option key={r.value} value={r.value}>{r.value}</option>)}</select>
          </div>
          <select value={sortBy} onChange={e=>setSortBy(e.target.value)} style={inputStyle}><option value="date-desc">Newest first</option><option value="date-asc">Oldest first</option><option value="alpha">A – Z</option><option value="attempts">Most attempts</option></select>
        </div>
      </Card>
      <div style={{fontFamily:FONT_BODY,fontSize:11,color:C.mutedText,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",paddingLeft:4}}>{keys.length} food{keys.length!==1?"s":""}</div>
      {keys.length===0&&<div style={{textAlign:"center",padding:"40px 20px"}}><Icon name="search" size={34} color={C.secondaryPurple} x={{marginBottom:10}}/><div style={{fontFamily:FONT_BODY,fontWeight:700,color:C.mutedText,textTransform:"uppercase",fontSize:13}}>Nothing found</div></div>}
      {keys.map(key=>{
        const g=groups[key];
        const latest=g.attempts.at(-1);
        const likedCnt=g.attempts.filter(a=>a.reaction==="Loved"||a.reaction==="Good").length;
        const pct=Math.round((likedCnt/g.attempts.length)*100);
        const hasAllergy=g.attempts.some(a=>a.reaction==="Allergic");
        const hasFav=g.attempts.some(a=>a.favourite);
        const isOpen=expanded.has(key);
        const cat=CATEGORIES.find(c=>c.value===g.category)||CATEGORIES[7];
        return(
          <div key={key} style={{background:hasAllergy?"#fde8e8":C.white,border:`2px solid ${hasAllergy?"#e07070":C.borderLight}`,borderRadius:16,overflow:"hidden",boxShadow:"0 2px 8px rgba(155,127,232,0.07)"}}>
            <div style={{display:"flex",alignItems:"center",padding:"14px 16px",gap:12,cursor:"pointer"}} onClick={()=>toggle(key)}>
              <CatIcon category={g.category} size={21} color={cat.color}/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontFamily:FONT_HEAD,fontWeight:700,fontSize:14,color:C.primaryPinkDark,display:"flex",alignItems:"center",gap:7,flexWrap:"wrap"}}>
                  {g.name}{hasFav&&<Icon name="starFill" size={12} color="#d4a017"/>}
                  {hasAllergy&&<span style={{background:"#fde8e8",color:"#c0392b",border:"1.5px solid #e07070",borderRadius:999,padding:"1px 8px",fontSize:9,fontWeight:700,fontFamily:FONT_BODY,textTransform:"uppercase"}}>Allergy</span>}
                  <span style={{background:C.bgPurple,color:C.primaryPurple,border:`1.5px solid ${C.border}`,borderRadius:999,padding:"1px 8px",fontSize:9,fontWeight:700,fontFamily:FONT_BODY}}>{g.attempts.length}×</span>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:8,marginTop:5,flexWrap:"wrap"}}><ReactionBadge reaction={latest.reaction}/><span style={{fontFamily:FONT_BODY,fontSize:11,color:C.mutedText}}>{formatDate(latest.date)}</span></div>
                <div style={{display:"flex",alignItems:"center",gap:6,marginTop:6}}><div style={{background:C.borderLight,borderRadius:999,height:6,width:56,overflow:"hidden"}}><div style={{background:C.primaryGreen,height:"100%",width:`${pct}%`,borderRadius:999}}/></div><span style={{fontFamily:FONT_BODY,fontSize:10,color:C.mutedText,fontWeight:700}}>{pct}%</span></div>
              </div>
              <Icon name={isOpen?"chevUp":"chevDown"} size={15} color={C.mutedText}/>
            </div>
            {isOpen&&<div style={{borderTop:`2px solid ${C.borderLight}`}}>{g.attempts.map((a,i)=>(
              <div key={a.id} style={{padding:"12px 16px",background:i%2===0?C.bgPurple:C.white,borderBottom:i<g.attempts.length-1?`1px solid ${C.borderLight}`:"none"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
                  <div style={{flex:1}}>
                    <div style={{fontFamily:FONT_BODY,fontWeight:700,fontSize:12,color:C.textCharcoal,display:"flex",alignItems:"center",gap:5,textTransform:"uppercase",letterSpacing:"0.04em"}}>Attempt {i+1} · {formatDate(a.date)}{a.favourite&&<Icon name="starFill" size={11} color="#d4a017"/>}</div>
                    <div style={{display:"flex",gap:6,marginTop:5,flexWrap:"wrap",alignItems:"center"}}>{a.form&&<span style={{background:C.bgPurple,border:`1.5px solid ${C.border}`,borderRadius:999,padding:"2px 8px",fontSize:10,fontWeight:700,fontFamily:FONT_BODY,color:C.mutedText,textTransform:"uppercase"}}>{a.form}</span>}<ReactionBadge reaction={a.reaction}/></div>
                    {a.notes&&<div style={{fontFamily:FONT_BODY,fontSize:11,color:C.mutedText,marginTop:6,fontStyle:"italic"}}>"{a.notes}"</div>}
                  </div>
                  <div style={{display:"flex",gap:5,flexShrink:0}}>
                    <button onClick={()=>onToggleFavourite(a.id)} style={{...btnSecondary,padding:"7px 9px",display:"flex",alignItems:"center"}}><Icon name={a.favourite?"starFill":"star"} size={13} color="#d4a017"/></button>
                    <button onClick={()=>onEdit(a)} style={{...btnSecondary,padding:"7px 9px",display:"flex",alignItems:"center"}}><Icon name="edit" size={13} color={C.primaryPurple}/></button>
                    <button onClick={()=>onDelete(a.id)} style={{...btnDanger,padding:"7px 9px",display:"flex",alignItems:"center"}}><Icon name="trash" size={13} color={C.warningStroke}/></button>
                  </div>
                </div>
              </div>
            ))}</div>}
          </div>
        );
      })}
    </div>
  );
}

// ─── CHILDREN PAGE ────────────────────────────────────────────────────────────
function ChildrenPage({children,activeChildId,onSetActive,onAdd,onEdit,onDelete}){
  const [adding,setAdding]=useState(false);
  const [form,setForm]=useState({name:"",dob:"",weaningStart:""});
  const [editing,setEditing]=useState(null);
  const set=(k,v)=>setForm(p=>({...p,[k]:v}));
  return(
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <h2 style={{margin:0,fontFamily:FONT_HEAD,fontWeight:700,fontSize:18,color:C.primaryPinkDark,textTransform:"uppercase",letterSpacing:"0.05em"}}>Children</h2>
        <button onClick={()=>setAdding(true)} style={{...btnPrimary,width:"auto",padding:"10px 18px",display:"flex",alignItems:"center",gap:7}}><Icon name="plus" size={13} color={C.white}/>Add Child</button>
      </div>
      {children.length===0&&!adding&&<Card><div style={{textAlign:"center",padding:"32px 0"}}><Icon name="users" size={38} color={C.secondaryPurple} x={{marginBottom:12}}/><p style={{fontFamily:FONT_BODY,color:C.mutedText,fontWeight:600,margin:0,fontSize:13,textTransform:"uppercase",letterSpacing:"0.05em"}}>No children added yet</p></div></Card>}
      {children.map(child=>{
        const weeks=calcAgeWeeks(child.dob),months=calcAgeMonths(child.dob),isActive=child.id===activeChildId;
        return(
          <Card key={child.id} style={{border:`2px solid ${isActive?C.primaryPurple:C.borderLight}`,background:isActive?C.bgPurple:C.white}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12}}>
              <div style={{flex:1}}>
                <div style={{fontFamily:FONT_HEAD,fontWeight:700,fontSize:16,color:C.primaryPinkDark,display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",textTransform:"uppercase",letterSpacing:"0.04em"}}>
                  {child.name}{isActive&&<span style={{background:C.primaryPurple,color:C.white,fontSize:9,borderRadius:999,padding:"2px 8px",fontWeight:700,fontFamily:FONT_BODY,textTransform:"uppercase",letterSpacing:"0.06em"}}>Active</span>}
                </div>
                <div style={{fontFamily:FONT_BODY,fontSize:12,color:C.mutedText,marginTop:4}}>Born {formatDate(child.dob)} · {weeks} weeks ({months} months)</div>
                {child.weaningStart&&<div style={{fontFamily:FONT_BODY,fontSize:11,color:C.mutedText,marginTop:2}}>Weaning from {formatDate(child.weaningStart)}</div>}
              </div>
              <div style={{display:"flex",gap:6}}>
                {!isActive&&<button onClick={()=>onSetActive(child.id)} style={{...btnPrimary,width:"auto",padding:"8px 12px",fontSize:11,display:"flex",alignItems:"center",gap:5}}><Icon name="check" size={11} color={C.white}/>Select</button>}
                <button onClick={()=>setEditing({...child})} style={{...btnSecondary,padding:"8px 10px",display:"flex",alignItems:"center"}}><Icon name="edit" size={13} color={C.primaryPurple}/></button>
                <button onClick={()=>onDelete(child.id)} style={{...btnDanger,padding:"8px 10px",display:"flex",alignItems:"center"}}><Icon name="trash" size={13} color={C.warningStroke}/></button>
              </div>
            </div>
          </Card>
        );
      })}
      <Modal open={adding} onClose={()=>setAdding(false)} title="Add Child">
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <Field label="Name"><input type="text" value={form.name} onChange={e=>set("name",e.target.value)} placeholder="e.g. Eleia" style={inputStyle}/></Field>
          <Field label="Date of Birth"><input type="date" value={form.dob} onChange={e=>set("dob",e.target.value)} style={inputStyle}/></Field>
          <Field label="Weaning Start Date"><input type="date" value={form.weaningStart} onChange={e=>set("weaningStart",e.target.value)} style={inputStyle}/></Field>
          <button style={btnPrimary} onClick={()=>{if(!form.name||!form.dob)return;onAdd({...form,id:Date.now()});setForm({name:"",dob:"",weaningStart:""});setAdding(false);}}>Save Child</button>
        </div>
      </Modal>
      <Modal open={!!editing} onClose={()=>setEditing(null)} title="Edit Child">
        {editing&&<div style={{display:"flex",flexDirection:"column",gap:14}}>
          <Field label="Name"><input type="text" value={editing.name} onChange={e=>setEditing(p=>({...p,name:e.target.value}))} style={inputStyle}/></Field>
          <Field label="Date of Birth"><input type="date" value={editing.dob} onChange={e=>setEditing(p=>({...p,dob:e.target.value}))} style={inputStyle}/></Field>
          <Field label="Weaning Start Date"><input type="date" value={editing.weaningStart||""} onChange={e=>setEditing(p=>({...p,weaningStart:e.target.value}))} style={inputStyle}/></Field>
          <button style={btnPrimary} onClick={()=>{onEdit(editing);setEditing(null);}}>Update Child</button>
        </div>}
      </Modal>
    </div>
  );
}

// ─── RECIPES PAGE (with expandable ingredient + steps dropdown) ───────────────
function RecipesPage() {
  const [expandedId, setExpandedId] = useState(null);
  const [filterAge, setFilterAge] = useState("all");

  const ageGroups = ["all", "6m+", "7m+", "9m+", "12m+"];
  const filtered = filterAge === "all" ? RECIPES : RECIPES.filter(r => r.ageGroup === filterAge);

  const toggle = (id, locked) => {
    if (locked) return; // locked recipes don't expand
    setExpandedId(prev => prev === id ? null : id);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {/* Lock banner */}
      <Card style={{ background: C.bgWarning, border: `2px solid ${C.warningStroke}` }}>
        <div style={{ textAlign: "center" }}>
          <Icon name="lock" size={30} color={C.warningStroke} x={{ marginBottom: 10 }} />
          <h3 style={{ margin: "0 0 8px", fontFamily: FONT_HEAD, fontWeight: 700, color: C.primaryPinkDark, fontSize: 16, textTransform: "uppercase", letterSpacing: "0.05em" }}>Unlock All Recipes</h3>
          <p style={{ margin: "0 0 16px", fontFamily: FONT_BODY, fontSize: 13, color: C.textCharcoal, lineHeight: 1.6 }}>
            Create a free MunchSprouts account to access our full library of nutritionist-approved BLW recipes.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            <button style={{ ...btnPrimary, width: "auto", padding: "10px 22px" }}>Create Free Account</button>
            <button style={{ ...btnOutline, padding: "10px 18px" }}>Sign In</button>
          </div>
        </div>
      </Card>

      {/* Age filter tabs */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {ageGroups.map(ag => (
          <button key={ag} onClick={() => setFilterAge(ag)} style={{ background: filterAge === ag ? C.primaryPurple : C.bgPurple, color: filterAge === ag ? C.white : C.mutedText, border: `2px solid ${filterAge === ag ? C.primaryPurple : C.border}`, borderRadius: 999, padding: "6px 14px", fontFamily: FONT_BODY, fontWeight: 700, fontSize: 11, cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            {ag === "all" ? "All Ages" : ag}
          </button>
        ))}
      </div>

      <h3 style={{ margin: 0, fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 13, color: C.primaryPinkDark, textTransform: "uppercase", letterSpacing: "0.07em" }}>
        {filterAge === "all" ? "All Recipes" : `Recipes for ${filterAge}`}
      </h3>

      {/* Recipe cards */}
      {filtered.map(r => {
        const isOpen = expandedId === r.id && !r.locked;
        return (
          <div key={r.id} style={{ background: C.white, border: `2px solid ${isOpen ? C.primaryPurple : C.borderLight}`, borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 8px rgba(155,127,232,0.07)", opacity: r.locked ? 0.72 : 1, transition: "border-color 0.2s" }}>

            {/* ── Recipe header row (always visible) ── */}
            <div style={{ display: "flex", gap: 14, alignItems: "center", padding: 18, cursor: r.locked ? "default" : "pointer" }} onClick={() => toggle(r.id, r.locked)}>
              <div style={{ background: C.bgPurple, borderRadius: 12, padding: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon name={r.icon} size={21} color={C.primaryPurple} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 13, color: C.primaryPinkDark, marginBottom: 6, display: "flex", alignItems: "center", gap: 8, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  {r.title}
                  {r.locked && <Icon name="lock" size={12} color={C.mutedText} />}
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  <span style={{ background: C.bgPurple, color: C.primaryPurple, border: `1.5px solid ${C.border}`, borderRadius: 999, padding: "2px 9px", fontSize: 10, fontWeight: 700, fontFamily: FONT_BODY, textTransform: "uppercase" }}>{r.category}</span>
                  <span style={{ background: C.bgGreen, color: C.primaryGreen, border: `1.5px solid ${C.primaryGreenLight}`, borderRadius: 999, padding: "2px 9px", fontSize: 10, fontWeight: 700, fontFamily: FONT_BODY }}>{r.ageGroup}</span>
                  <span style={{ background: C.bgPurple, color: C.mutedText, border: `1.5px solid ${C.border}`, borderRadius: 999, padding: "2px 9px", fontSize: 10, fontWeight: 700, fontFamily: FONT_BODY, display: "flex", alignItems: "center", gap: 3 }}><Icon name="clock" size={9} color={C.mutedText} />{r.time}</span>
                  {r.tags.map(t => <span key={t} style={{ background: C.bgWarning, color: C.warningStroke, border: `1.5px solid ${C.warningStroke}`, borderRadius: 999, padding: "2px 9px", fontSize: 10, fontWeight: 700, fontFamily: FONT_BODY }}>{t}</span>)}
                </div>
              </div>
              {/* Chevron — only show on unlocked */}
              {!r.locked && <Icon name={isOpen ? "chevUp" : "chevDown"} size={16} color={C.mutedText} />}
            </div>

            {/* ── Expanded detail panel ── */}
            {isOpen && (
              <div style={{ borderTop: `2px solid ${C.borderLight}`, padding: "18px 18px 20px" }}>
                {/* Description */}
                {r.description && (
                  <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: C.textCharcoal, margin: "0 0 16px", lineHeight: 1.6, fontStyle: "italic" }}>{r.description}</p>
                )}

                {/* Ingredients */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 12, color: C.primaryPinkDark, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Ingredients</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {r.ingredients.map((ing, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 12px", background: C.bgPurple, borderRadius: 10, border: `1.5px solid ${C.borderLight}` }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.primaryPurple, flexShrink: 0, marginTop: 5 }} />
                        <span style={{ fontFamily: FONT_BODY, fontSize: 13, color: C.textCharcoal, fontWeight: 600 }}>{ing}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Steps */}
                <div>
                  <div style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 12, color: C.primaryPinkDark, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Method</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {r.steps.map((step, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "10px 12px", background: i % 2 === 0 ? C.white : C.bgPurple, borderRadius: 10, border: `1.5px solid ${C.borderLight}` }}>
                        <div style={{ background: C.primaryPurple, color: C.white, borderRadius: "50%", width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 11, flexShrink: 0 }}>{i + 1}</div>
                        <span style={{ fontFamily: FONT_BODY, fontSize: 13, color: C.textCharcoal, lineHeight: 1.5, paddingTop: 2 }}>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Locked overlay prompt */}
            {r.locked && (
              <div style={{ borderTop: `2px solid ${C.borderLight}`, padding: "10px 18px", display: "flex", alignItems: "center", gap: 8 }}>
                <Icon name="lock" size={13} color={C.mutedText} />
                <span style={{ fontFamily: FONT_BODY, fontSize: 11, fontWeight: 700, color: C.mutedText, textTransform: "uppercase", letterSpacing: "0.05em" }}>Sign in to view ingredients & method</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── EXPORT MODAL ─────────────────────────────────────────────────────────────
function ExportModal({open,onClose,foodLog,activeChild,onImport}){
  const [fmt,setFmt]=useState("csv");
  const [importError,setImportError]=useState("");
  const [importPreview,setImportPreview]=useState(null);
  const name=activeChild?.name||"Log";
  const dl=(content,type,filename)=>{const a=document.createElement("a");a.href=`data:${type};charset=utf-8,`+encodeURIComponent(content);a.download=filename;a.click();onClose();};
  const exportCSV=()=>{let csv="Date,Food,Category,Form,Reaction,Favourite,Notes\n";foodLog.forEach(f=>{csv+=`"${f.date}","${f.name}","${f.category||""}","${f.form||""}","${f.reaction||""}","${f.favourite?"Yes":"No"}","${(f.notes||"").replace(/"/g,"'")}"\n`;});dl(csv,"text/csv",`MunchSprouts_${name}.csv`);};
  const exportJSON=()=>dl(JSON.stringify({exportDate:new Date().toISOString(),child:activeChild,log:foodLog},null,2),"application/json",`MunchSprouts_${name}.json`);
  const handleFileChange=(e)=>{setImportError("");setImportPreview(null);const file=e.target.files[0];if(!file)return;if(!file.name.endsWith(".json")){setImportError("Please select a .json file exported from MunchSprouts.");return;}const reader=new FileReader();reader.onload=(ev)=>{try{const parsed=JSON.parse(ev.target.result);if(!parsed.log||!Array.isArray(parsed.log)){setImportError("Invalid file — doesn't look like a MunchSprouts backup.");return;}setImportPreview(parsed);}catch{setImportError("Could not read file. Make sure it's a valid MunchSprouts JSON backup.");}};reader.readAsText(file);};
  const confirmImport=()=>{if(!importPreview)return;onImport(importPreview);setImportPreview(null);setImportError("");onClose();};
  return(
    <Modal open={open} onClose={()=>{setImportPreview(null);setImportError("");onClose();}} title="Export / Import">
      <div style={{display:"flex",flexDirection:"column",gap:16}}>
        <div style={{fontFamily:FONT_BODY,fontSize:11,fontWeight:700,color:C.mutedText,textTransform:"uppercase",letterSpacing:"0.08em"}}>Export</div>
        {activeChild&&<div style={{background:C.bgPurple,border:`2px solid ${C.border}`,borderRadius:12,padding:12}}><div style={{fontFamily:FONT_BODY,fontWeight:700,fontSize:12,color:C.primaryPinkDark,display:"flex",alignItems:"center",gap:7,textTransform:"uppercase",letterSpacing:"0.04em"}}><Icon name="info" size={14} color={C.primaryPurple}/>{foodLog.length} entries for {name}</div></div>}
        <Field label="Format">
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {[["csv","CSV Spreadsheet"],["json","JSON Backup"]].map(([val,label])=>(
              <button key={val} type="button" onClick={()=>setFmt(val)} style={{background:fmt===val?C.bgPurple:C.white,border:`2px solid ${fmt===val?C.primaryPurple:C.border}`,borderRadius:12,padding:"12px 10px",cursor:"pointer",fontFamily:FONT_BODY,fontWeight:700,fontSize:12,color:fmt===val?C.primaryPurple:C.mutedText,display:"flex",flexDirection:"column",alignItems:"center",gap:6,textTransform:"uppercase",letterSpacing:"0.04em"}}>
                <Icon name="download" size={17} color={fmt===val?C.primaryPurple:C.mutedText}/>{label}
              </button>
            ))}
          </div>
        </Field>
        <p style={{fontFamily:FONT_BODY,fontSize:12,color:C.mutedText,margin:0}}>{fmt==="csv"?"Great for sharing with your health visitor or opening in Excel.":"Full data backup — restore or migrate to an account later."}</p>
        <button style={{...btnPrimary,display:"flex",alignItems:"center",justifyContent:"center",gap:8}} onClick={fmt==="csv"?exportCSV:exportJSON}><Icon name="download" size={14} color={C.white}/>Download {fmt.toUpperCase()}</button>
        <div style={{borderTop:`2px solid ${C.borderLight}`,margin:"4px 0"}}/>
        <div style={{fontFamily:FONT_BODY,fontSize:11,fontWeight:700,color:C.mutedText,textTransform:"uppercase",letterSpacing:"0.08em"}}>Import from backup</div>
        <p style={{fontFamily:FONT_BODY,fontSize:12,color:C.mutedText,margin:0}}>Select a MunchSprouts JSON backup to restore data. Existing entries are kept — duplicates skipped.</p>
        <label style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:8,border:`2px dashed ${C.border}`,borderRadius:14,padding:"20px 16px",cursor:"pointer",background:C.bgPurple}}>
          <Icon name="export" size={24} color={C.primaryPurple} style={{transform:"rotate(180deg)"}}/>
          <span style={{fontFamily:FONT_BODY,fontWeight:700,fontSize:13,color:C.primaryPurple,textTransform:"uppercase",letterSpacing:"0.05em"}}>Choose JSON file</span>
          <span style={{fontFamily:FONT_BODY,fontSize:11,color:C.mutedText}}>MunchSprouts_*.json</span>
          <input type="file" accept=".json" onChange={handleFileChange} style={{display:"none"}}/>
        </label>
        {importError&&<div style={{background:"#fde8e8",border:"2px solid #e07070",borderRadius:12,padding:"10px 14px",display:"flex",alignItems:"center",gap:8}}><Icon name="alert" size={15} color="#c0392b"/><span style={{fontFamily:FONT_BODY,fontSize:12,fontWeight:700,color:"#c0392b"}}>{importError}</span></div>}
        {importPreview&&<div style={{background:C.bgGreen,border:`2px solid ${C.primaryGreenLight}`,borderRadius:12,padding:"12px 14px",display:"flex",flexDirection:"column",gap:8}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}><Icon name="check" size={15} color={C.primaryGreen}/><span style={{fontFamily:FONT_BODY,fontWeight:700,fontSize:13,color:"#2e7d52",textTransform:"uppercase",letterSpacing:"0.04em"}}>Ready to import</span></div>
          <div style={{fontFamily:FONT_BODY,fontSize:12,color:"#2e7d52"}}><strong>{importPreview.log.length}</strong> entries found{importPreview.child?.name&&<> for <strong>{importPreview.child.name}</strong></>}{importPreview.exportDate&&<> · Backed up {formatDate(importPreview.exportDate.split("T")[0])}</>}</div>
          <button style={{...btnPrimary,background:C.primaryGreen,display:"flex",alignItems:"center",justifyContent:"center",gap:8}} onClick={confirmImport}><Icon name="download" size={14} color={C.white} style={{transform:"rotate(180deg)"}}/>Confirm Import</button>
        </div>}
      </div>
    </Modal>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function MunchSproutsApp() {
  const [page,setPage]=useState("dashboard");
  const [foodLog,setFoodLog]=useLocalStorage("ms_foodlog_v3",[]);
  const [children,setChildren]=useLocalStorage("ms_children_v3",[]);
  const [activeChildId,setActiveChildId]=useLocalStorage("ms_activeChild_v3",null);
  const [toasts,setToasts]=useState([]);
  const [editEntry,setEditEntry]=useState(null);
  const [showExport,setShowExport]=useState(false);

  const activeChild=children.find(c=>c.id===activeChildId)||children[0]||null;
  const childLog=activeChild?foodLog.filter(f=>f.childId===activeChild.id):foodLog;

  const toast=(msg,type="success")=>{const id=Date.now();setToasts(p=>[...p,{id,msg,type}]);setTimeout(()=>setToasts(p=>p.filter(t=>t.id!==id)),3500);};
  const addFood=(form,err)=>{if(!form){toast(err||"Please fill in required fields.","warning");return;}const existing=childLog.filter(f=>normalize(f.name)===normalize(form.name));const entry={id:Date.now(),childId:activeChild?.id||null,attemptNum:existing.length+1,...form};setFoodLog(p=>[...p,entry]);toast(existing.length===0?`Added "${form.name}" to the log`:`"${form.name}" — attempt #${existing.length+1}`);setPage("log");};
  const editFood=(updated,err)=>{if(!updated){toast(err||"Please fill required fields.","warning");return;}setFoodLog(p=>p.map(f=>f.id===updated.id?{...f,...updated}:f));setEditEntry(null);toast("Entry updated");};
  const deleteFood=(id)=>{if(!confirm("Delete this entry?"))return;setFoodLog(p=>p.filter(f=>f.id!==id));toast("Entry deleted","warning");};
  const toggleFav=(id)=>setFoodLog(p=>p.map(f=>f.id===id?{...f,favourite:!f.favourite}:f));
  const addChild=(child)=>{setChildren(p=>[...p,child]);if(!activeChildId)setActiveChildId(child.id);toast(`${child.name} added`);};
  const editChild=(u)=>setChildren(p=>p.map(c=>c.id===u.id?u:c));
  const deleteChild=(id)=>{if(!confirm("Delete this child and all their data?"))return;setChildren(p=>p.filter(c=>c.id!==id));if(activeChildId===id)setActiveChildId(children.find(c=>c.id!==id)?.id||null);setFoodLog(p=>p.filter(f=>f.childId!==id));toast("Child removed","warning");};
  const handleImport=({log,child})=>{setFoodLog(prev=>{const ids=new Set(prev.map(f=>f.id));return[...prev,...log.filter(f=>!ids.has(f.id))];});if(child&&child.id){setChildren(prev=>{const exists=prev.some(c=>c.id===child.id);return exists?prev:[...prev,child];});setActiveChildId(child.id);}toast("Import complete — entries added");};

  const nav=[{id:"dashboard",icon:"home",label:"Home"},{id:"log",icon:"list",label:"Log"},{id:"add",icon:"plus",label:"Add"},{id:"children",icon:"users",label:"Children"},{id:"recipes",icon:"chef",label:"Recipes"}];
  const titles={dashboard:"Dashboard",log:"Food Log",add:"Log Food",children:"Children",recipes:"Recipes"};

  return(
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=Josefin+Sans:ital,wght@0,400;0,600;0,700;1,400&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        body{background:${C.bgMain};}
        input:focus,select:focus,textarea:focus{border-color:${C.primaryPurple}!important;box-shadow:0 0 0 3px rgba(155,127,232,0.18)!important;outline:none!important;}
        @keyframes toastIn{from{transform:translateX(30px);opacity:0}to{transform:translateX(0);opacity:1}}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:${C.secondaryPurple};border-radius:4px}
      `}</style>
      <div style={{maxWidth:480,margin:"0 auto",minHeight:"100vh",background:C.bgMain,display:"flex",flexDirection:"column"}}>
        <header style={{background:C.white,padding:"13px 18px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100,boxShadow:`0 2px 16px rgba(155,127,232,0.12)`,borderBottom:`2px solid ${C.borderLight}`}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <Icon name="sprout" size={24} color={C.primaryGreen}/>
            <div>
              <div style={{fontFamily:FONT_HEAD,fontWeight:700,fontSize:16,color:C.primaryPinkDark,letterSpacing:"0.06em",textTransform:"uppercase",lineHeight:1}}>Munch Sprouts</div>
              <div style={{fontFamily:FONT_ACCENT,fontSize:14,color:C.mutedText,lineHeight:1.2}}>{titles[page]}</div>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            {activeChild&&<button onClick={()=>setPage("children")} style={{background:C.bgPurple,border:`2px solid ${C.border}`,borderRadius:999,padding:"5px 12px",cursor:"pointer",display:"flex",alignItems:"center",gap:6}}><Icon name="baby" size={13} color={C.primaryPurple}/><span style={{fontFamily:FONT_BODY,fontSize:12,fontWeight:700,color:C.primaryPurple,textTransform:"uppercase",letterSpacing:"0.04em"}}>{activeChild.name}</span></button>}
            <button onClick={()=>setShowExport(true)} style={{background:C.bgPurple,border:`2px solid ${C.border}`,borderRadius:10,padding:"7px 9px",cursor:"pointer",display:"flex",alignItems:"center"}}><Icon name="export" size={15} color={C.primaryPurple}/></button>
          </div>
        </header>
        <main style={{flex:1,padding:"18px 16px 100px"}}>
          {page==="dashboard"&&<Dashboard child={activeChild} foodLog={childLog} onNavigate={setPage}/>}
          {page==="log"      &&<LogPage foodLog={childLog} onEdit={setEditEntry} onDelete={deleteFood} onToggleFavourite={toggleFav}/>}
          {page==="add"      &&<Card><SectionTitle icon="plus">Log Food or Drink</SectionTitle><FoodForm onSubmit={addFood}/></Card>}
          {page==="children" &&<ChildrenPage children={children} activeChildId={activeChild?.id} onSetActive={setActiveChildId} onAdd={addChild} onEdit={editChild} onDelete={deleteChild}/>}
          {page==="recipes"  &&<RecipesPage/>}
        </main>
        <nav style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:C.white,borderTop:`2px solid ${C.borderLight}`,display:"flex",zIndex:200,boxShadow:`0 -4px 20px rgba(155,127,232,0.1)`}}>
          {nav.map(n=>{const active=page===n.id,isAdd=n.id==="add";return(
            <button key={n.id} onClick={()=>setPage(n.id)} style={{flex:1,background:"none",border:"none",cursor:"pointer",padding:isAdd?"6px 0 8px":"10px 0 8px",display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
              {isAdd?(<div style={{background:C.primaryPurple,borderRadius:14,width:44,height:44,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 4px 14px rgba(155,127,232,0.45)`,marginTop:-14}}><Icon name="plus" size={22} color={C.white}/></div>):(<Icon name={n.icon} size={19} color={active?C.primaryPurple:C.mutedText}/>)}
              <span style={{fontSize:9,fontWeight:700,fontFamily:FONT_BODY,color:active?C.primaryPurple:C.mutedText,textTransform:"uppercase",letterSpacing:"0.06em"}}>{n.label}</span>
              {active&&!isAdd&&<div style={{width:16,height:3,background:C.primaryPurple,borderRadius:999,marginTop:1}}/>}
            </button>
          );})}
        </nav>
        <Modal open={!!editEntry} onClose={()=>setEditEntry(null)} title="Edit Entry">
          {editEntry&&<FoodForm initial={editEntry} onSubmit={editFood} buttonLabel="Update Entry"/>}
        </Modal>
        <ExportModal open={showExport} onClose={()=>setShowExport(false)} foodLog={childLog} activeChild={activeChild} onImport={handleImport}/>
        <Toast toasts={toasts}/>
      </div>
    </>
  );
}
