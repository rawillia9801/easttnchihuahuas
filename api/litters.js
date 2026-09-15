const { getBody, requireAdmin, supabase, fail } = require('./_supabase');

const allowed = ['name','status','sire','dam','breeding_date','due_date','birth_date','expected_count','actual_count','announcement_date','notes','image_url','is_public'];
function clean(input){const out={};for(const key of allowed)if(Object.prototype.hasOwnProperty.call(input,key)){let v=input[key];if(v==='')v=null;if(key==='is_public')v=Boolean(v);out[key]=v;}if(!out.status)out.status='planned';return out;}
module.exports=async function handler(req,res){res.setHeader('Cache-Control','no-store');try{
  requireAdmin(req);
  if(req.method==='GET'){const rows=await supabase('/rest/v1/litters?select=*&order=created_at.desc',{method:'GET'});return res.status(200).json(rows||[]);}
  if(req.method==='POST'){const body=clean(getBody(req));if(!body.name)return res.status(400).json({error:'Litter name is required.'});const rows=await supabase('/rest/v1/litters',{method:'POST',headers:{'Content-Type':'application/json',Prefer:'return=representation'},body:JSON.stringify(body)});return res.status(201).json(Array.isArray(rows)?rows[0]:rows);}
  if(req.method==='PUT'){const id=String(req.query?.id||'');if(!id)return res.status(400).json({error:'Litter id is required.'});const rows=await supabase(`/rest/v1/litters?id=eq.${encodeURIComponent(id)}`,{method:'PATCH',headers:{'Content-Type':'application/json',Prefer:'return=representation'},body:JSON.stringify({...clean(getBody(req)),updated_at:new Date().toISOString()})});return res.status(200).json(Array.isArray(rows)?rows[0]:rows);}
  if(req.method==='DELETE'){const id=String(req.query?.id||'');if(!id)return res.status(400).json({error:'Litter id is required.'});await supabase(`/rest/v1/litters?id=eq.${encodeURIComponent(id)}`,{method:'DELETE',headers:{Prefer:'return=minimal'}});return res.status(200).json({ok:true});}
  res.setHeader('Allow','GET,POST,PUT,DELETE');return res.status(405).json({error:'Method not allowed'});
}catch(error){return fail(res,error);}};
