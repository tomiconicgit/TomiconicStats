export function generateId(prefix='id') {
  return prefix+'-'+Date.now()+'-'+Math.floor(Math.random()*1000);
}

export function formatDate(date){
  return new Date(date).toISOString().split('T')[0];
}

// Block types for the editor
export const blockTypes = ['text','image','video','stat'];