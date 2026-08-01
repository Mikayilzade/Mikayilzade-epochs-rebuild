export const SAVE_KEY="epohi-rebuild-campaign"; export const SAVE_SCHEMA_VERSION=1;
export function serialize(state){return JSON.stringify({schemaVersion:SAVE_SCHEMA_VERSION,savedAt:new Date().toISOString(),game:state});}
export function deserialize(raw){if(!raw)return {ok:false,error:"Сохранение отсутствует."};try{const data=JSON.parse(raw);if(data.schemaVersion!==SAVE_SCHEMA_VERSION)return {ok:false,error:"Версия сохранения не поддерживается."};const g=data.game;if(!g||!Number.isInteger(g.turn)||!Array.isArray(g.map?.tiles)||!Array.isArray(g.units)||!Array.isArray(g.settlements))return {ok:false,error:"Сохранение повреждено."};return {ok:true,state:g};}catch{return {ok:false,error:"Сохранение повреждено и было безопасно отклонено."};}}
export function saveGame(state,storage=localStorage){storage.setItem(SAVE_KEY,serialize(state));return true;}
export function loadGame(storage=localStorage){return deserialize(storage.getItem(SAVE_KEY));}
