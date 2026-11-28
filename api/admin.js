const store = require("./_prediction-store");
const PREDICTION_ACTIONS = new Set(["predictionInitialize","predictionList","predictionSave","predictionDelete","predictionPublish","predictionHistory","predictionRollback"]);
const AUTH_ACTIONS = new Set(["adminLogin","adminValidateSession","adminLogout","adminSetCredentials"]);
async function gasRequest(url,payload){const upstream=await fetch(url,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(payload),redirect:"follow"});return {upstream,data:await upstream.json()};}
function sendError(res,error){
 if(error.message==="GITHUB_TOKEN_NOT_CONFIGURED")return res.status(503).json({ok:false,code:error.message,message:"ยังไม่ได้ตั้งค่า GitHub Token สำหรับคลังคำทำนาย"});
 if(error.message==="GITHUB_WRITE_CONFLICT")return res.status(409).json({ok:false,code:error.message,message:"มีการแก้ไขข้อมูลพร้อมกัน กรุณาโหลดข้อมูลใหม่แล้วลองอีกครั้ง"});
 if(error.message==="GITHUB_API_ERROR")return res.status(502).json({ok:false,code:error.message,message:"ไม่สามารถเชื่อมต่อคลังข้อมูล GitHub ได้"});
 const known=new Set(["INVALID_COLLECTION","INVALID_JSON_STORE","INVALID_RECORD","INVALID_ENGINE","INVALID_STATUS","NAME_OR_TITLE_REQUIRED","INVALID_RULE_CONDITION","RULE_CONDITIONS_REQUIRED","INVALID_RULE_LOGIC","INVALID_SPECIFIC_PREDICTION_MAPPING","PREDICTION_TARGET_REQUIRED","MAPPING_SCOPE_REQUIRED","PUBLISHED_PREDICTION_REQUIRED","RECORD_NOT_FOUND","VERSION_NOT_FOUND"]);
 if(known.has(error.message))return res.status(400).json({ok:false,code:error.message,message:"ข้อมูลไม่ถูกต้อง: "+error.message});
 return res.status(500).json({ok:false,message:"เกิดข้อผิดพลาดในการจัดการคลังคำทำนาย"});
}
module.exports=async function handler(req,res){
 if(req.method!=="POST")return res.status(405).json({ok:false,message:"Method not allowed"});
 const body=req.body&&typeof req.body==="object"?req.body:{},action=body.action;
 if(!AUTH_ACTIONS.has(action)&&!PREDICTION_ACTIONS.has(action))return res.status(400).json({ok:false,message:"คำสั่งไม่ถูกต้อง"});
 const gasUrl=process.env.GAS_WEB_APP_URL;
 if(!gasUrl)return res.status(503).json({ok:false,message:"ระบบยืนยันตัวตนยังไม่ได้ตั้งค่า"});
 if(action==="adminLogin"){
  if(typeof body.username!=="string"||typeof body.password!=="string"||body.username.length>80||body.password.length>256)return res.status(400).json({ok:false,message:"กรุณาตรวจสอบชื่อผู้ใช้และรหัสผ่าน"});
  try{const result=await gasRequest(gasUrl,body);return res.status(result.data.ok?200:(result.data.code==="UNAUTHORIZED"?401:400)).json(result.data);}
  catch(error){return res.status(502).json({ok:false,message:"ไม่สามารถเชื่อมต่อระบบยืนยันตัวตนได้"});}
 }
 if(typeof body.token!=="string"||body.token.length>200)return res.status(401).json({ok:false,code:"UNAUTHORIZED",message:"กรุณาเข้าสู่ระบบใหม่"});
 if(AUTH_ACTIONS.has(action)){
  if(action==="adminSetCredentials"){
   const fields=["fullUsername","fullPassword","readonlyUsername","readonlyPassword"];
   if(fields.some(key=>typeof body[key]!=="string"||body[key].length>256))return res.status(400).json({ok:false,message:"ข้อมูลบัญชี Admin ไม่ถูกต้อง"});
  }
  try{const result=await gasRequest(gasUrl,body);return res.status(result.data.ok?200:(result.data.code==="UNAUTHORIZED"?401:(result.data.code==="FORBIDDEN"?403:400))).json(result.data);}
  catch(error){return res.status(502).json({ok:false,message:"ไม่สามารถเชื่อมต่อระบบยืนยันตัวตนได้"});}
 }
 let session;
 try{
  const validation=await gasRequest(gasUrl,{action:"adminValidateSession",token:body.token});
  if(!validation.data.ok)return res.status(401).json({ok:false,code:"UNAUTHORIZED",message:validation.data.message||"เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่"});
  session=validation.data;
 }catch(error){return res.status(502).json({ok:false,message:"ไม่สามารถตรวจสอบเซสชัน Admin ได้"});}
 if(action==="predictionList"){
  if(typeof body.collection!=="string"||body.collection.length>40)return res.status(400).json({ok:false,message:"ข้อมูลคลังคำทำนายไม่ถูกต้อง"});
  try{return res.status(200).json({ok:true,collection:body.collection,records:await store.list(body.collection,typeof body.engineId==="string"?body.engineId:"")});}
  catch(error){return sendError(res,error);}
 }
 if(session.role!=="full")return res.status(403).json({ok:false,code:"FORBIDDEN",message:"บัญชีนี้ไม่มีสิทธิ์แก้ไขคลังคำทำนาย"});
 try{
  if(action==="predictionInitialize")return res.status(200).json({ok:true,message:"GitHub JSON repository พร้อมใช้งาน",branch:store.config().branch});
  if(action==="predictionSave"){const record=await store.save(body.collection,body.record,session.username||"Full Admin");return res.status(200).json({ok:true,record});}
  if(action==="predictionDelete"){
   if(typeof body.id!=="string"||body.id.length>100)return res.status(400).json({ok:false,message:"รหัสรายการไม่ถูกต้อง"});
   return res.status(200).json(await store.archive(body.collection,body.id,session.username||"Full Admin"));
  }
  if(action==="predictionPublish"){
   if(typeof body.id!=="string"||body.id.length>100)return res.status(400).json({ok:false,message:"รหัสรายการไม่ถูกต้อง"});
   return res.status(200).json({ok:true,record:await store.publish(body.collection,body.id,session.username||"Full Admin")});
  }
  if(action==="predictionHistory"){
   if(typeof body.id!=="string"||body.id.length>100)return res.status(400).json({ok:false,message:"รหัสรายการไม่ถูกต้อง"});
   return res.status(200).json({ok:true,versions:await store.history(body.collection,body.id)});
  }
  if(action==="predictionRollback"){
   if(typeof body.id!=="string"||body.id.length>100||!Number.isInteger(Number(body.version))||Number(body.version)<1)return res.status(400).json({ok:false,message:"ข้อมูลเวอร์ชันที่ต้องการกู้คืนไม่ถูกต้อง"});
   return res.status(200).json({ok:true,...(await store.rollback(body.collection,body.id,body.version,session.username||"Full Admin"))});
  }
  return res.status(400).json({ok:false,message:"คำสั่งไม่ถูกต้อง"});
 }catch(error){return sendError(res,error);}
};
