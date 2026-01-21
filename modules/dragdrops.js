export function enableDragDrop(container){
  let dragged;

  container.addEventListener('dragstart', e=>{
    dragged=e.target;
    e.target.style.opacity='0.5';
  });

  container.addEventListener('dragend', e=>{
    e.target.style.opacity='';
  });

  container.addEventListener('dragover', e=>{
    e.preventDefault();
    const target=e.target.closest('div[data-type]');
    if(target && target!==dragged){
      const rect = target.getBoundingClientRect();
      const next = (e.clientY - rect.top) / rect.height > 0.5;
      target.parentNode.insertBefore(dragged, next ? target.nextSibling : target);
    }
  });
}