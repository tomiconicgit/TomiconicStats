export function renderPreview(editorCanvas, previewCanvas){
  previewCanvas.innerHTML='';
  Array.from(editorCanvas.children).forEach(block=>{
    const b=document.createElement('div');
    b.style.marginBottom='12px';
    b.style.borderRadius='12px';
    b.style.padding='10px';
    b.style.background='rgba(255,255,255,0.05)';
    
    if(block.dataset.type==='text') b.innerText=block.innerText;
    else if(block.dataset.type==='image') b.innerHTML=`<img src="${block.innerText}" style="max-width:100%; border-radius:12px">`;
    else if(block.dataset.type==='video') b.innerHTML=`<video src="${block.innerText}" controls style="max-width:100%; border-radius:12px"></video>`;
    else if(block.dataset.type==='stat') {
      const stat = JSON.parse(block.innerText || '{}');
      b.innerHTML=`<div style="font-weight:600">STAT: ${stat.today || 0} today | ${stat.year || 0} this year | ${stat.change || '0%'}</div>`;
    }

    previewCanvas.appendChild(b);
  });
}