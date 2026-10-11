// Project Pan — standalone, testable domain model. All dates are local calendar dates YYYY-MM-DD.
export const SCHEMA=1;
export const ROOTS=[
  ['skin','Skincare','#bc9ff3'],['makeup','Makeup','#ee9bb8'],['hair','Haircare','#89b5f2'],
  ['body','Body care','#98c6ac'],['hygiene','Hygiene','#e6bd84'],['fragrance','Fragrance','#c5a7dd'],
  ['nails','Nails','#dfaba8'],['tools','Tools & accessories','#92bec5']
];
// A path denotes a genuine leaf category, rather than a generic umbrella product class.
const PATHS={
 skin:{
 'Cleansers':['Cleansing oil','Cleansing balm','Micellar water','Gel cleanser','Foaming cleanser','Cream / milk cleanser','Face soap','Eye makeup remover'],
 'Toners & essences':['Hydrating toner','Exfoliating toner','Essence','Face mist'],
 'Serums & actives':['Hyaluronic acid','Niacinamide','Vitamin C','Retinoid','AHA / BHA / PHA','Peptides','Azelaic acid','Other serum / active'],
 'Moisturisers':['Gel moisturiser','Face cream','Night cream','Face oil','Barrier balm'],
 'Sun protection':['Face SPF','Tinted face SPF','Lip SPF','After-sun face care'],
 'Masks & exfoliants':['Sheet mask','Clay mask','Hydrating mask','Overnight mask','Physical exfoliant'],
 'Targeted care':['Eye cream','Eye serum','Lip balm','Lip mask / treatment','Blemish treatment','Spot patches']},
 makeup:{
 'Base':['Face primer','Foundation','Skin tint / BB / CC','Concealer','Loose powder','Pressed powder','Setting spray'],
 'Cheeks':['Powder blush','Cream / liquid blush','Powder bronzer','Cream / liquid bronzer','Contour','Highlighter'],
 'Eyes':['Eye primer','Eyeshadow palette','Single eyeshadow','Cream / liquid eyeshadow','Pencil eyeliner','Liquid / gel eyeliner','Regular mascara','Waterproof mascara','False lashes / glue'],
 'Brows':['Brow pencil / pen','Brow powder','Brow gel / wax','Brow tint'],
 'Lips':['Lipstick','Liquid lipstick','Lip gloss','Lip oil','Lip tint / stain','Lip liner','Lip plumper'],
 'Other makeup':['Makeup remover','Face / body glitter','Makeup setting powder refill']},
 hair:{
 'Washing':['Everyday shampoo','Clarifying shampoo','Purple / toning shampoo','Dry shampoo','Co-wash','Conditioner'],
 'Treatments':['Hair mask','Leave-in conditioner','Hair oil','Hair serum','Bond repair','Scalp treatment','Scalp scrub'],
 'Styling':['Heat protectant','Hair mousse','Styling cream','Hair gel / wax','Hairspray','Texture / salt spray','Curl product'],
 'Colour':['Permanent hair dye','Semi-permanent colour','Toner / gloss','Root cover-up','Bleach / developer']},
 body:{
 'Bath & shower':['Shower gel','Body wash','Bar soap','Bath oil / salts','Body scrub'],
 'Moisturising':['Body lotion','Body butter','Body oil','Hand cream','Foot cream','Body treatment'],
 'Protection':['Body SPF','After-sun body care','Deodorant','Antiperspirant'],
 'Hair removal':['Shaving cream / gel','Razor / blades','Wax / hair-removal cream','After-shave care'],
 'Other body care':['Self-tanner','Body shimmer','Massage product']},
 hygiene:{
 'Oral care':['Toothpaste','Toothbrush / head','Dental floss','Interdental brush','Mouthwash','Whitening treatment'],
 'Hand hygiene':['Hand soap','Hand sanitiser','Wet wipes'],
 'Menstrual & intimate':['Pads / liners','Tampons','Menstrual cup / disc','Intimate wash','Other period care'],
 'Daily essentials':['Cotton pads','Cotton swabs','Facial tissues','Personal wipes','Other hygiene supplies']},
 fragrance:{
 'Perfume':['Eau de parfum','Eau de toilette','Eau de cologne','Perfume oil','Solid perfume'],
 'Other scents':['Body mist','Hair perfume','Fragrance sample / mini']},
 nails:{
 'Colour':['Nail polish','Gel nail polish','Nail wraps / press-ons'],
 'Prep & finish':['Base coat','Top coat','Polish remover','Gel removal'],
 'Treatments':['Nail strengthener','Cuticle oil / cream','Nail repair'],
 'Tools':['Nail file / buffer','Nail tools / accessories']},
 tools:{
 'Makeup tools':['Makeup brush','Makeup sponge / puff','Brush cleaner','Lash curler'],
 'Skincare tools':['Face tool / roller','Reusable face cloth','Skincare device'],
 'Hair tools':['Hairbrush / comb','Hair accessory','Styling device'],
 'Storage & reusable':['Cosmetic bag','Organiser','Refillable container','Other accessory']}
};
const slug=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
export const BUILTIN_CATEGORIES=(()=>{
 const out=[];
 for(const [rid,name,color] of ROOTS){
  out.push({id:rid,name,parentId:null,color,builtin:true});
  for(const [section,leaves] of Object.entries(PATHS[rid])){
   const sid=rid+'-'+slug(section);out.push({id:sid,name:section,parentId:rid,color,builtin:true});
   for(const leaf of leaves)out.push({id:sid+'-'+slug(leaf),name:leaf,parentId:sid,color,builtin:true});
  }
 }
 return out;
})();
export const today=(d=new Date())=>[d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');
export const stamp=()=>new Date().toISOString();
export const uid=(prefix='id')=>`${prefix}-${globalThis.crypto?.randomUUID?.()||`${Date.now()}-${Math.random().toString(36).slice(2)}`}`;
export const blank=()=>({schema:SCHEMA,products:[],units:[],categories:[],challenges:[],wishlist:[],barcodeCache:{},tombstones:{products:{},units:{},categories:{},challenges:{},wishlist:{}},settings:{theme:'dark',currency:'EUR',monthlyBudget:null},updatedAt:stamp()});
export const categories=db=>[...BUILTIN_CATEGORIES,...db.categories];
export const descendants=(db,id)=>{if(!id)return new Set(categories(db).map(c=>c.id));const all=categories(db),ids=new Set([id]);let changed=true;while(changed){changed=false;for(const c of all){if(ids.has(c.parentId)&&!ids.has(c.id)){ids.add(c.id);changed=true;}}}return ids;};
export const catPath=(db,id)=>{let byId=new Map(categories(db).map(c=>[c.id,c])),a=[],cur=byId.get(id),guard=0;while(cur&&guard++<8){a.unshift(cur);cur=byId.get(cur.parentId)}return a;};
export const categoryName=(db,id)=>catPath(db,id).map(x=>x.name).join(' › ')||'Uncategorised';
export const isActive=u=>u.status==='unopened'||u.status==='in-use';
export const money=n=>Number.isFinite(Number(n))&&n!==null&&n!==''?Number(n):null;
export const inPeriod=(date,period,now=today())=>!!date&&(period==='all'||(period==='month'?date.slice(0,7)===now.slice(0,7):period==='year'?date.slice(0,4)===now.slice(0,4):date.startsWith(period)));
export function stats(db,{categoryId=null,period='year',now=today()}={}){
 const allowed=descendants(db,categoryId),prods=new Map(db.products.map(p=>[p.id,p]));
 const rows=db.units.filter(u=>allowed.has(prods.get(u.productId)?.categoryId));
 const active=rows.filter(isActive),finished=rows.filter(u=>u.status==='finished'&&inPeriod(u.finishedAt,period,now));
 const purchased=rows.filter(u=>u.acquisition==='purchase'&&inPeriod(u.purchaseDate,period,now));
 const gifted=rows.filter(u=>u.status==='gifted'&&inPeriod(u.closedAt,period,now));
 const decluttered=rows.filter(u=>u.status==='decluttered'&&inPeriod(u.closedAt,period,now));
 const sum=a=>a.reduce((n,u)=>n+(money(u.price)||0),0),known=a=>a.filter(u=>money(u.price)!==null).length;
 return {active:active.length,unopened:active.filter(u=>u.status==='unopened').length,inUse:active.filter(u=>u.status==='in-use').length,all:rows.length,
  purchased:purchased.length,spent:sum(purchased),spentKnown:known(purchased),spentUnknown:purchased.length-known(purchased),undatedPurchases:rows.filter(u=>u.acquisition==='purchase'&&!u.purchaseDate).length,
  finished:finished.length,emptiesValue:sum(finished),emptiesKnown:known(finished),emptiesUnknown:finished.length-known(finished),
  collectionValue:sum(active),collectionKnown:known(active),collectionUnknown:active.length-known(active),
  gifted:gifted.length,decluttered:decluttered.length,net:purchased.length-finished.length-gifted.length-decluttered.length,
  hitPan:rows.filter(u=>u.hitPanAt&&inPeriod(u.hitPanAt,period,now)).length,rows,activeUnits:active};
}
export function months(n=6,now=today()){let [year,month]=now.split('-').map(Number),res=[];for(let i=n-1;i>=0;i--){let d=new Date(year,month-1-i,1);res.push(today(d).slice(0,7));}return res;}
export function monthlySeries(db,categoryId=null,n=6,now=today()){
 let allowed=descendants(db,categoryId),pmap=new Map(db.products.map(p=>[p.id,p])),units=db.units.filter(u=>allowed.has(pmap.get(u.productId)?.categoryId));
 return months(n,now).map(m=>({month:m,spending:units.filter(u=>u.acquisition==='purchase'&&u.purchaseDate?.slice(0,7)===m).reduce((sum,u)=>sum+(money(u.price)||0),0),
 purchased:units.filter(u=>u.acquisition==='purchase'&&u.purchaseDate?.slice(0,7)===m).length,
 finished:units.filter(u=>u.status==='finished'&&u.finishedAt?.slice(0,7)===m).length,
 // Records start when a unit was entered. This is NOT a reconstructed historic collection before app use.
 collection:units.filter(u=>u.createdAt?.slice(0,7)<=m&&(isActive(u)||((u.finishedAt||u.closedAt||'9999').slice(0,7)>m))).length
 }));
}
export function challengeProgress(db,ch,now=today()){
 const end=ch.endDate||now,from=ch.startDate||'0000-01-01',ids=new Set(ch.unitIds||[]),allowed=descendants(db,ch.categoryId||null),pmap=new Map(db.products.map(p=>[p.id,p]));
 const matching=db.units.filter(u=>(!ids.size||ids.has(u.id))&&allowed.has(pmap.get(u.productId)?.categoryId));
 const within=d=>!!d&&d>=from&&d<=end;
 let current=0,goal=Number(ch.goal)||1,met=false,subtitle='';
 if(ch.type==='finish'){current=matching.filter(u=>u.status==='finished'&&within(u.finishedAt)).length;met=current>=goal;subtitle=`${current} / ${goal} finished`;}
 else if(ch.type==='hit-pan'){current=matching.filter(u=>within(u.hitPanAt)).length;met=current>=goal;subtitle=`${current} / ${goal} pans hit`;}
 else if(ch.type==='reduce'){current=matching.filter(isActive).length;met=current<=goal;subtitle=`${current} owned · target ${goal} or fewer`;}
 else if(ch.type==='no-buy'){current=matching.filter(u=>u.acquisition==='purchase'&&within(u.purchaseDate)).length;met=current===0&&now>=end;subtitle=current?`${current} purchases during challenge`:'No purchases recorded';goal=1;}
 else if(ch.type==='budget'){current=matching.filter(u=>u.acquisition==='purchase'&&within(u.purchaseDate)).reduce((s,u)=>s+(money(u.price)||0),0);met=current<=goal&&now>=end;subtitle=`${current.toFixed(2)} / ${goal.toFixed(2)} spent`;}
 const exceeded=(ch.type==='no-buy'&&current>0)||(ch.type==='budget'&&current>goal);
 const baseline=Math.max(goal+1,Number(ch.startingCount)||current);const progress=ch.type==='reduce'?(met?100:Math.max(0,Math.round(((baseline-current)/Math.max(1,baseline-goal))*100))):ch.type==='no-buy'?(exceeded?0:100):ch.type==='budget'?Math.min(100,(current/goal)*100):Math.min(100,Math.round((current/goal)*100));
 return {current,goal,met,exceeded,progress,subtitle,expired:now>end};
}
export function expiryInfo(u,now=today()){
 const dates=[];
 if(u.expiryDate)dates.push({date:u.expiryDate,why:'Expiry date'});
 if(u.openedAt&&Number(u.paoMonths)>0){const [y,m,d]=u.openedAt.split('-').map(Number);const lastDay=new Date(y,m-1+Number(u.paoMonths)+1,0).getDate();dates.push({date:today(new Date(y,m-1+Number(u.paoMonths),Math.min(d,lastDay))),why:'Period after opening'});}
 if(!dates.length)return null;
 const first=dates.sort((a,b)=>a.date.localeCompare(b.date))[0];let delta=Math.round((Date.parse(first.date+'T12:00:00')-Date.parse(now+'T12:00:00'))/864e5);
 return {...first,days:delta,level:delta<0?'overdue':delta<=30?'soon':'fine'};
}
export function supplyEstimate(db,categoryId=null,now=today()){
 const s=stats(db,{categoryId,period:'all',now});const closed=s.rows.filter(u=>u.status==='finished'&&u.finishedAt);
 if(!closed.length||!s.active)return null;
 const earliest=[...s.rows.map(u=>u.createdAt?.slice(0,10)),...closed.map(u=>u.finishedAt)].filter(Boolean).sort()[0];
 const span=(Date.parse(now+'T12:00:00')-Date.parse(earliest+'T12:00:00'))/864e5/30.4375;
 if(span<2)return null;return {months:Math.round((s.active/(closed.length/span))*10)/10,observedMonths:Math.round(span*10)/10,finished:closed.length};
}
function latest(a,b){return String(a?.updatedAt||a?.createdAt||'')>String(b?.updatedAt||b?.createdAt||'')?a:b;}
export function validBackup(o){return !!o&&typeof o==='object'&&o.schema===SCHEMA&&['products','units','categories','challenges','wishlist'].every(k=>Array.isArray(o[k])&&o[k].length<30000&&o[k].every(x=>x&&typeof x==='object'&&typeof x.id==='string'&&x.id.length>0))&&o.products.every(p=>typeof p.name==='string'&&typeof p.categoryId==='string')&&o.units.every(u=>typeof u.productId==='string'&&typeof u.status==='string')&&o.categories.every(c=>typeof c.name==='string'&&typeof c.parentId==='string')&&o.settings&&typeof o.settings==='object';}
export function mergeData(local,incoming){if(!validBackup(incoming))throw Error('Invalid or unsupported Project Pan backup.');const out=structuredClone(local);
 for(const key of ['products','units','categories','challenges','wishlist']){
  let tomb={...(out.tombstones?.[key]||{})};for(const [id,date] of Object.entries(incoming.tombstones?.[key]||{}))if(!tomb[id]||tomb[id]<date)tomb[id]=date;
  const ids=new Map([...out[key],...incoming[key]].map(x=>[x.id,x]));
  for(const x of [...out[key],...incoming[key]])ids.set(x.id,latest(ids.get(x.id),x));
  out[key]=[...ids.values()].filter(x=>!tomb[x.id]||tomb[x.id]<String(x.updatedAt||x.createdAt||''));out.tombstones[key]=tomb;
 }
 out.barcodeCache={...incoming.barcodeCache,...out.barcodeCache};out.updatedAt=stamp();return out;}
export function deleteRecord(db,key,id){let item=db[key].find(x=>x.id===id);if(!item)return;db[key]=db[key].filter(x=>x.id!==id);db.tombstones[key]??={};db.tombstones[key][id]=stamp();}
export function demo(){let db=blank(),now=today();const cats={cleanser:'skin-cleansers-gel-cleanser',serum:'skin-serums-actives-niacinamide',lip:'makeup-lips-lip-gloss',shampoo:'hair-washing-everyday-shampoo',body:'body-moisturising-body-lotion',nail:'nails-colour-nail-polish'};
 for(const [i,[name,brand,cat,price,st]] of [['Gentle gel cleanser','Example',cats.cleanser,12.5,'in-use'],['Hydrating serum','Example',cats.serum,8,'in-use'],['Clear lip gloss','Example',cats.lip,9.9,'unopened'],['Everyday shampoo','Example',cats.shampoo,6.75,'finished'],['Body lotion','Example',cats.body,5.95,'in-use'],['Rose nail polish','Example',cats.nail,4.5,'unopened']].entries()){
  let p={id:uid('p'),name,brand,categoryId:cat,size:50,unit:'ml',barcode:'',image:'',favorite:i===1,repurchase:i===3,createdAt:stamp(),updatedAt:stamp()};db.products.push(p);
  db.units.push({id:uid('u'),productId:p.id,status:st,acquisition:i<3?'existing':'purchase',price,purchaseDate:i<3?'':now,openedAt:st==='in-use'?now:'',finishedAt:st==='finished'?now:'',closedAt:'',hitPanAt:'',expiryDate:'',paoMonths:12,location:i<4?'Bathroom':'Storage',remaining:st==='in-use'?50:st==='finished'?0:100,createdAt:stamp(),updatedAt:stamp()});
 }return db;
}
